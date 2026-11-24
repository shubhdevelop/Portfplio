---
title: "CPU Cache: Mapping and Address Decomposition"
date: "2026-11-15"
description: "How cache lines, sets, associativity, tags, and address bits determine where the CPU looks for data in a cache."
tags: ["Computer Architecture", "Systems Programming", "Performance"]
author: "Shubham Raj"
---

Having a cache generally means providing fast access to a small subset of memory.

##### Why only subsets?

There are several reasons, but they largely boil down to two things:

**Economics:** SRAM stores data in circuits made of transistors that retain their state while powered. DRAM uses much denser storage cells whose contents need refreshing.

**Selection work:** There is no magic way of selecting the correct slot.

Because of the above reasons, there exists a hierarchy, with fast, small memory for common accesses, backed by larger but slower memory behind it.

The reason why having a hierarchy works is that most application programs exhibit locality.

- **Temporal locality:** If a memory location is accessed, it is likely to be accessed again in the near future.
- **Spatial locality:** If a memory location is accessed, nearby memory locations are likely to be accessed in the near future.

For example, arrays provide spatial locality as their contents are packed closely together, whereas a small loop provides temporal locality, with basically the same variables being accessed frequently.

![Memory hierarchy from registers through storage, with temporal and spatial locality](/blog/cpu-cache-diagrams/memory-hierarchy.svg)

## The Unit of Cache: Cache Line / Block

If we wanted, we could cache individual bytes, but tracking each byte introduces overhead. This overhead can include identification (key) and management policies when several cores are accessing the same cache, along with other overheads, including but not limited to the eviction policy.

To avoid the above-mentioned overhead and take advantage of spatial locality, we cache a whole block of memory. This also helps exploit spatial locality because nearby bytes are brought into the cache together.

To be clear semantically, a **memory block** is an aligned, fixed-size chunk of memory. A **cache line** is the cache storage location that holds a copy of that memory block, along with its metadata.

Important things to note here are:

1. **Cache-line transfer:** Data is fetched between cache levels in cache-line-sized units, although the actual transfer may happen through multiple smaller internal transfers. Some processors use techniques such as *critical-word-first*, where the requested word is supplied before the remaining bytes of the cache line arrive.
2. **Size of the block:** It is implementation-dependent. It could be 16, 32, 64, or 128 bytes. On my Mac, the cache line is 128 bytes, but it is fixed across all the slots for a given cache. Different cache levels can have different cache line widths, but modern implementations keep them fixed across each level. For example, on my Linux machine, it is 64 bytes across all cache levels: L1d (directly on the core), L1i, L2, and L3. On my Mac, it is 128 bytes.
3. **Natural alignment:** Keeping the block size at $2^n$ creates natural alignment with addresses in multiples of powers of two. Consequently, the lowest $n$ bits of a block's starting address are always zero.

```c
int *a = &b;
// Say the address is in hex 0x40.
// In binary it is 1000000.
```

Going forward, we will assume the block size to be 64 bytes to keep the upcoming examples simple and consistent.

| Term | Meaning |
| --- | --- |
| Memory block | An aligned, fixed-size region of main memory, such as bytes 0–63. |
| Cache line | A cache storage location that holds a copy of one memory block and its metadata. |

##### Logically divided memory

| Memory Block Number | Byte Address |
| --- | --- |
| 0 | 0–63 |
| 1 | 64–127 |
| 2 | 128–191 |
| 3 | 192–255 |

For an address $A$:

$$
\text{block number} = \left\lfloor \frac{A}{B} \right\rfloor
$$

$$
\text{offset within block} = A \bmod 64
$$

Though data is loaded in blocks, the CPU can update individual bytes of an existing cache line (cache slot). Processors can have 64-byte cache lines and smaller internal access widths.

#### Conceptual cache entry

```c
struct cache_entry {
    bool valid;
    bool dirty;
    uint64_t tag;
    unsigned char data[64];
};
```

`valid`: Whether the entry contains usable cached data.  
`dirty`: Whether modifications must be preserved when the entry is displaced.  
`tag`: Which memory block occupies this entry.  
`data`: The actual bytes.

Actual caches also track other information, like replacement state and, in coherent systems with multiple cores and processes, permissions and coherence state. `tag` and `data` can live in separate hardware arrays.

Now that we have looked at what a logical cache entry might look like, we come to the lookup problem.

As these caches hold a smaller subset of main memory, we have a shortage of slots (cache entries) to hold the many possible memory blocks. How do we find the entry holding the requested block?

The answer comes from how we permit a memory block to be placed in the cache. This placement rule determines where the hardware should look.

## Deriving the Mapping of Cache Entries to a Given Slot

Let's assume a cache with just 8 slots or lines, whatever you want to call them.

This means only 8 entries can be placed at any given time. With a line size of 64 bytes, the total capacity comes out to be 512 bytes.

$$
8 \times 64 = 512\ \text{bytes of capacity}
$$

We have only 8 slots and **134,217,728 blocks** (or $2^{27}$ blocks) in 8 GiB of RAM when the cache line size is 64 bytes. There can be more blocks as RAM capacity increases.

$$
\frac{8 \times 2^{30}}{64} = 2^{27} = 134,217,728
$$

### Go Direct

A simple strategy for any block number from 0 to $n$, where $n$ is the maximum block number, could be:

$$
\text{slot} = \text{block number} \bmod 8
$$

As the block number increases, the slots will wrap around, starting again from 0. Consequently, the mapping could look like this:

| Memory blocks | Permitted cache lines |
| --- | --- |
| 0, 8, 16, 24, 32, ... | 0 |
| 1, 9, 17, 25, 33, ... | 1 |
| 2, 10, 18, 26, 34, ... | 2 |
| ... | ... |
| 7, 15, 23, 31, 39, ... | 7 |

This way of assigning an entry to a cache line is called **direct mapping**.

To look for a slot, the hardware can perform a modulo operation on the address $A$ to get the slot number. This makes the lookup very inexpensive. But the restriction we put on the mapping has its drawbacks too.

As a slot can contain any member of the group, the slots also need identification information: the tag. This adds a little bit of overhead for storing the tag.

Another problem is **placement conflict**. Assume this access pattern:

```
block 0, block 8, block 0, block 8, ...
```

Both blocks go into slot 0. Starting with an empty cache, the accesses would look something like this:

1. Block 0 misses and is placed in slot 0.
2. Block 8 misses and replaces block 0.
3. Block 0 misses and replaces block 8.
4. This continues indefinitely.

While this happens, the other 7 slots remain unused, wasting capacity, while cache hits keep failing and we pay a cache miss penalty, which means going to a lower-level cache, to DRAM, and, in the worst case, to disk on page faults.

![Direct mapping groups memory blocks by their permitted cache line and shows a placement conflict](/blog/cpu-cache-diagrams/direct-mapping.svg)

### Go Haywire

Another strategy we can use is to allow any block to occupy any of the given 8 slots. This is known as full **associativity**.

But the drawback is that the hardware must search the entire search space, which here consists of all the cache slots. Modern hardware compares each requested identity with every entry's identity in parallel.

The hardware needs to figure out if the requested block exists in any cache line. Modern fully associative caches can compare the requested tag against all stored tags in parallel using comparison circuitry. This makes lookup fast but increases hardware cost, power consumption, and complexity as the number of entries grows.

This works when the capacity is just 512 bytes, with 8 slots, but for hundreds and thousands of slots, the comparison and selection circuitry becomes expensive.

### The Middle Ground

In this strategy, we divide all available slots into sets, having a fixed number of slots in each set. The fixed number here is called the number of ways.

For our eight-slot cache:

| Organisation | Sets | Slots per set, or ways |
| --- | --- | --- |
| Direct mapped | 8 | 1 |
| 2-way associative | 4 | 2 |
| 4-way associative | 2 | 4 |
| Fully associative | 1 | 8 |

For an $n$-way cache, the placement rule becomes:

$$
\text{set} = \text{block number} \bmod \text{number of sets}
$$

For a 4-way cache, the rule looks like this:

$$
\text{set} = \text{block number} \bmod 2
$$

A possible cache state is:

| Set | Way 0 | Way 1 | Way 2 | Way 3 |
| --- | --- | --- | --- | --- |
| 0 | Block 0 | Block 8 | Block 16 | Block 24 |
| 1 | Empty | Empty | Empty | Empty |

All four blocks are even, so they belong to set 0. They can coexist because that set has 4 ways.

Now, if a request for block 32 comes in, it will map to set 0. Something in set 0 must be evicted, even though half of the cache is empty.

**An address selects one set. Associativity determines how many slots are available within that set.**

More formulas:

$$
\text{total line slots} = \text{sets} \times \text{ways}
$$

$$
\text{number of sets} = \frac{\text{total line slots}}{\text{ways}}
$$

- $C$: Cache data capacity in bytes.
- $B$: Bytes per line.
- $W$: Ways.
- $S$: Sets.

$$
S = \frac{C}{BW}
$$

## Solving the Lookup

Let's set up the scene. The CPU has loaded an address into one of its registers and then goes on to check if the data is in the cache. But where should it look? It has so many slots.

Even though modern 64-bit processors use 64-bit general-purpose registers, this does not mean all 64 bits are used for physical addresses. The supported physical address width is implementation-dependent. For example, many x86-64 processors support physical addresses up to 52 bits, while virtual addresses may use 48 or 57 bits depending on the paging configuration.

For our examples, we will assume a 48-bit physical address.

$$
2^{48} = 256\ \text{TiB}
$$

We know that caches store blocks in slots called cache lines, which have a fixed block size, and that a set is a group of a fixed number of slots. A cache has several sets.

Let's take an example. Assume:

- **32 KiB** of data capacity.
- **64-byte** lines.
- **8 ways**.
- **48-bit physical addresses**.

First, we figure out how many slots we have:

$$
\text{slots} = \frac{\text{total capacity}}{\text{cache line size}} = \frac{32768}{64} = 512
$$

Now we have the number of slots. How many sets do we have? With 8 ways, the number of sets comes out to be:

$$
\text{number of sets} = \frac{\text{slots}}{\text{ways}} = \frac{512}{8} = 64
$$

By combining both, the unified formula for the number of sets comes out to be:

$$
\begin{aligned}
C &= \text{Cache data capacity in bytes} \\
B &= \text{Bytes per line} \\
W &= \text{Ways} \\
S &= \text{Sets} \\
S &= \frac{C}{BW} = \frac{32768}{64 \times 8} = 64
\end{aligned}
$$

Now we have 64 sets, from 0 to 63, each having 8 slots.

For a given address $A = 1000$:

**Block number:**

$$
\text{block number} = \left\lfloor \frac{A}{B} \right\rfloor = \left\lfloor \frac{1000}{64} \right\rfloor = 15
$$

**Offset in the block:**

$$
\text{offset} = A \bmod B = 1000 \bmod 64 = 40
$$

The set index is the index of the set to which the given block number belongs. As there are 64 sets, values above 63 wrap around to 0 again, mapping all addressable memory into these 64 sets. The index tells us which set the given address belongs to.

$$
\text{set index} = \text{block number} \bmod S = 15 \bmod 64 = 15
$$

As there are several blocks that can go inside any given set, the tag allows us to know which block is currently stored in the set. It does not indicate which way (the slot) the given block should go into.

$$
\text{tag} = \left\lfloor \frac{\text{block number}}{S} \right\rfloor = \left\lfloor \frac{15}{64} \right\rfloor = 0
$$

Now we have all the four pieces of information we derived to know where to look (set index), and what to look for (tag):

- Block number = 15
- Offset = 40
- Set index = 15
- Tag = 0

$$
\begin{aligned}
A &= ((\text{tag} \times S) + \text{set index}) \times B + \text{offset} \\
  &= ((0 \times 64) + 15) \times 64 + 40 \\
  &= 15 \times 64 + 40 \\
  &= 960 + 40 = 1000
\end{aligned}
$$

![Worked cache lookup for address 1000 in a 32 KiB, 8-way cache with 64-byte lines](/blog/cpu-cache-diagrams/cache-lookup-example.svg)

By doing all those operations, nothing about the address has changed. But the CPU does not need to execute these instructions because, when $B$ and $S$ are powers of two:

- **The remainder modulo $2^n$ selects the lower $n$ bits.**

  Example:

  $$
  \text{Let } S = 64 = 2^6
  $$

  $$
  \text{Block number} = 1000001\ (65)
  $$

  $$
  \begin{aligned}
  \text{set index} &= \text{block number} \bmod S = 65 \bmod 64 = 1 \\
                   &= 1000001\ \&\ 0111111 = 0000001 = 1
  \end{aligned}
  $$

- **Integer division by $2^n$ removes those bits.**

  Example:

  $$
  \text{Let } S = 64 = 2^6
  $$

  $$
  \text{Let block number} = 1000001\ (65)
  $$

  $$
  \begin{aligned}
  \text{tag} &= \left\lfloor \frac{\text{block number}}{S} \right\rfloor \\
             &= \left\lfloor \frac{65}{64} \right\rfloor = 1 \\
             &= (1000001 \gg 6) = 0000001 = 1
  \end{aligned}
  $$

So:

$$
\begin{aligned}
b &= \log_2 B \\
s &= \log_2 S
\end{aligned}
$$

$b$ and $s$ are the numbers of bits needed to represent the byte offset within the block and set index, respectively.

For an $R$-bit address:

$$
\text{tag} = R - b - s
$$

$$
\underbrace{\text{tag}}_{t\text{ bits}}
\quad
\underbrace{\text{set index}}_{s\text{ bits}}
\quad
\underbrace{\text{byte offset}}_{b\text{ bits}}
$$

For a conventional organisation with a 64-byte line and a 48-bit address, $s = 6$ and $b = 6$, so the remaining bits are left for the tag. These are the bits of the **physical address** for a physically indexed, physically tagged cache. Not every cache uses this exact organisation.

| Field | Width | Address bits |
| --- | --- | --- |
| Tag | 36 | 47–12 |
| Set index | 6 | 11–6 |
| Byte offset | 6 | 5–0 |

For:

```
A = 0x000012345678
```

We get:

```c
offset    = A & 0x3f;         // 56
set_index = (A >> 6) & 0x3f;  // 25
tag       = A >> 12;          // 0x12345
```

> By this, the CPU knows it needs to go to the set at index 25, check its 8 entries concurrently using circuitry, check if one of the lines matches the tag, and read the requested byte from offset 56.

As you can see, there is no `way` bit. As mentioned above, the address does not determine the way; it only determines the set. It does not tell us which slot holds the block. On insertion, the cache chooses an available way or a victim way. On a later access, the tag comparisons discover which way contains the block.

## Conclusion

We have now seen how a memory address is mapped to a cache location.

The important things to take away are that an address is divided into three fields:

- **Byte offset:** Identifies the requested byte within a cache line.
- **Set index:** Identifies the set in which the corresponding memory block can reside.
- **Tag:** Identifies which memory block is currently represented by a cache line within that set.

The set index tells us where to look, while the tag tells us what we are looking for.

Notice that the address does not tell us which `way` holds the requested block. It only determines the set.

Moreover, the tag alone does not determine the block globally. The tag + set index identifies the block, and adding the offset identifies the byte.

With this, we have established the fundamental mechanism behind cache mapping and address decomposition.

## Next topic

[**Cache lookup and replacement**](/blog/cache-lookup-and-replacement) covers tag comparison, valid bits, parallel comparison, cache hits and misses, plus LRU, pseudo-LRU, random replacement, and eviction.

## Related articles

- [CPU cache address decomposition: tag, index and offset explained](/blog/cpu-cache-address-decomposition): the short reference with formulas and a step-by-step procedure.
- [Cache address decomposition examples](/blog/cpu-cache-address-decomposition-examples): seven worked configurations.
- [Cache address decomposition practice problems](/blog/cpu-cache-address-decomposition-practice-problems): exercises with answers.
- [Cache tag, index and offset calculator](/tools/cache-address-calculator): check your own geometry and address.
