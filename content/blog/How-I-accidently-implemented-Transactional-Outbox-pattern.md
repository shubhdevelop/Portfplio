---
title: "How I accidently implemented Transactional Outbox pattern"
date: "2026-02-24"
description: "Exploring the and implementing transactional outbox pattern."
tags: ["Distributed Systems", "GO", "Valkey", "Redis", "Valkey function"]
author: "Shubham Raj"
---

Recently, I worked on a project handling credit management. The requirements were simple: add and deduct credits from user accounts and retrieve the balance all under relatively high throughput.

**Write-Ahead Caching** came to mind. For those who don’t know, it’s a strategy where you write to faster memory (Redis/Valkey) first and later sync with persistent storage (the DB).

I implemented three endpoints:

- `POST /add/:userId`
- `POST /deduct/:userId`
- `GET /balance/:userId`
### 1. Handling the Cache Miss (Thundering Herd)

Each route checks for a `balanceKey` in the cache. If it’s a cache miss:

1. The API call takes a **distributed lock** on the `userId`.
2. It fetches the `currentBalance` from the DB.
3. Concurrent requests for that `userid` wait and retry until the lock is released and the cache is rehydrated.

Taking a lock here is essential. You don’t want 1,000 concurrent cache misses for a userId hitting your DB at once. This prevents the **Thundering Herd** problem. Once rehydrated, the other 999 users pull directly from Redis/Valkey.
### 2. The Logic: Adding vs. Deducting

Once the balance is in the cache, the algorithms look like this:

#### For Adding Credits:

We use the Redis `INCRBY` command. Since `INCRBY` is atomic, it safely increments the value regardless of concurrency.

Bash

```
# Atomic increment in Redis/Valkey
INCRBY user:123:balance 50
```

#### For Deducting Credits:

This is where things get tricky. If we use application-level code, we risk a race condition:

1. **Get** the balance.
2. **Check** if the user has enough credits.
3. **Deduct** if sufficient.
4. **Update** the cache with the new balance.
5. **Push** to a queue for DB synchronization.

**The "Sin" of this approach:** In the time between Step 1 (Get) and Step 4 (Update), 10 concurrent requests could see the same balance, allowing a user to spend more than they have. If your app crashes between Step 4 and Step 5, your DB will never sync with the cache. Redis/Valkey is single threaded hence are safe you application logic necessarily isn't nor do you want it undertake that challenge as it's isn't worth it
### 3. The Solution

The solution is two-fold:

1. Move the algorithm away from the application level and into the **Cache Layer**.
2. Make the balance update and the queueing a single **Atomic Transaction**.

Valkey recently introduced **Valkey Functions** ( Lua scripts ), hence I used it. Valkey guarantees that all operations inside a script happen atomically. Either the balance is deducted and the event is queued, or nothing happens.

Benefits of valkey functions are that, we save on network bandwidth, and it also acts as stored proccedures.

#### The Lua Script:

Lua script

```lua
#!lua name=credits_lib

local function deductCredits(keys, args)
	local balKey = keys[1]
	local idempotency_key = keys[2]
	local streamKey = keys[3]

	local amt = tonumber(args[1])
	local txn_id = args[2]
	local user_id = args[3]

	if server.call("EXISTS", idempotency_key) == 1 then
		return { 1, "ALREADY_PROCESSED" }
	end

	local balance = server.call("GET", balKey)
	if not balance then
		return { -1, "CACHE_MISS" }
	end

	if tonumber(balance) < amt then
		return { -2, "INSUFFICIENT_BALANCE" }
	end

	local new_balance = server.call("DECRBY", balKey, amt)
	server.call("XADD", streamKey, "*", "user_id", user_id, "amount", -amt, "type", "deduct", "tx_id", txn_id)
	server.call("SETEX", idempotency_key, 86400, "OK")
	return { 1, "DEDUCTED", new_balance }
end

local function addCredits(keys, args)
	local balKey = keys[1]
	local idempotency_key = keys[2]
	local streamKey = keys[3]

	local amt = tonumber(args[1])
	local txn_id = args[2]
	local user_id = args[3]

	if server.call("EXISTS", idempotency_key) == 1 then
		return { 1, "ALREADY_PROCESSED" }
	end

	local balance = server.call("GET", balKey)
	if not balance then
		return { -1, "CACHE_MISS" }
	end

	local new_balance = server.call("INCRBY", balKey, amt)
	server.call("XADD", streamKey, "*", "user_id", user_id, "amount", amt, "type", "allot", "tx_id", txn_id)
	server.call("SETEX", idempotency_key, 86400, "OK")
	return { 1, "ALLOTED", new_balance }
end

server.register_function("deductCredits", deductCredits)
server.register_function("addCredits", addCredits)
```

Usage inside application code

```go 

func DeductCredits(ctx context.Context, client *glide.Client, balKey, idempotencyKey, streamKey, amt, txnID, userID string) (*Result, error) {
	val, err := client.FCallWithKeysAndArgs(ctx, "deductCredits", []string{balKey, idempotencyKey, streamKey}, []string{amt, txnID, userID})
	if err != nil {
		log.Printf("err execeuting credits deduction command: %v", err)
		return &Result{}, err
	}

	arr, ok := val.([]any)
	if !ok {
		log.Fatalf("unexpected type: %T", val)
	}

	status := arr[0].(int64) // Lua number → int64
	code := arr[1].(string)  // same

	var balance int64
	if len(arr) == 3 {
		balance = arr[2].(int64)
	}
	return &Result{
		status, code, balance,
	}, nil
}

func AddCredits(ctx context.Context, client *glide.Client, balKey, idempotencyKey, streamKey, amt, txnID, userID string) (*Result, error) {
	val, err := client.FCallWithKeysAndArgs(ctx, "addCredits", []string{balKey, idempotencyKey, streamKey}, []string{amt, txnID, userID})
	if err != nil {
		log.Printf("err execeuting addCredits command: %v", err)
		return &Result{}, err
	}

	arr, ok := val.([]any)
	if !ok {
		log.Fatalf("unexpected type: %T", val)
	}

	status := arr[0].(int64) // Lua number → int64
	code := arr[1].(string)  // same

	var balance int64
	if len(arr) == 3 {
		balance = arr[2].(int64)
	}
	return &Result{
		status, code, balance,
	}, nil
}
```

### Conclusion


If you didn't figure out yet, you just like me and we just unknowingly implemented the transactional outbox pattern together.

Traditionally outbox pattern happens on db, whenever we take any business action and save a record in db, we also write to a dedicated outbox table or collection about the event, and ensure both happens or none with transactions.

Other services tails this table/collection and publishes them to a message broker like kafka, sqs or redis stream.  

we skipped the relay part of it, as we could publish the event and save the record in a transaction the message broker in a atomic manner, with the help of valkey functions and it's guarentees. Now any other services can consume the events, and act accordingly 

Without realizing it, we just implemented the **Transactional Outbox Pattern** together.