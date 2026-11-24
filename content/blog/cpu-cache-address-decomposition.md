---
title: "CPU Cache Address Decomposition: Tag, Index and Offset Explained"
date: "2026-11-24"
description: "Learn how a CPU cache splits a memory address into tag, set index, and block offset. Formulas, bit widths, and worked examples for direct-mapped and set-associative caches."
tags: ["Computer Architecture", "Systems Programming", "Performance"]
author: "Shubham Raj"
---

Every time a CPU loads a byte, the cache has to answer two questions within a few cycles: **where do I look?** and **how do I know the thing I found is the right one?** Address decomposition answers both by cutting the memory address into three fields: the **tag**, the **set index**, and the **block offset**.

This page is the short, practical reference. It gives you the formulas, the bit layout, and worked examples you can follow with a pen. If you want to understand *why* caches are organised into lines and sets in the first place, read [CPU cache mapping and address decomposition: how lines, sets and ways work](/blog/cpu-cache-mapping-and-address-decomposition) first, or keep going here and come back later.

## The three fields

An $R$-bit address is split, from the most significant bit to the least, into:

$$
\underbrace{\text{tag}}_{t\ \text{bits}}
\quad
\underbrace{\text{set index}}_{s\ \text{bits}}
\quad
\underbrace{\text{block offset}}_{b\ \text{bits}}
$$

| Field | Question it answers | Used for |
| --- | --- | --- |
| Block offset | Which byte inside the cache line? | Selecting the requested byte(s) once the line is found |
| Set index | Which set can hold this block? | Choosing the one set the hardware searches |
| Tag | Which memory block is stored in this line? | Compared against the tags of every way in the set |

The offset and index are the *address* of the data inside the cache. The tag is the *name* of the block, kept next to the data so the hardware can verify a match.

## The formulas

Start from the cache geometry:

- $C$: data capacity in bytes
- $B$: line (block) size in bytes
- $W$: associativity, the number of ways per set
- $R$: address width in bits

Then:

$$
S = \frac{C}{B \times W}
$$

$$
b = \log_2 B \qquad s = \log_2 S \qquad t = R - s - b
$$

Both $B$ and $S$ are powers of two in practice, so extracting each field is just a shift and a mask:

```c
offset = A & (B - 1);          // low b bits
index  = (A >> b) & (S - 1);   // next s bits
tag    = A >> (b + s);         // everything above
```

Mathematically, with integer division and modulo:

$$
\text{block number} = \left\lfloor \frac{A}{B} \right\rfloor \quad
\text{offset} = A \bmod B \quad
\text{index} = \text{block number} \bmod S \quad
\text{tag} = \left\lfloor \frac{\text{block number}}{S} \right\rfloor
$$

Associativity changes the split only through $S$. Direct-mapped is $W = 1$, so $S$ is as large as it can be. Fully associative is $S = 1$, so $s = 0$ and **there is no index field at all**, only tag and offset.

## Step by step procedure

1. Compute $S = C / (B \times W)$.
2. Compute $b = \log_2 B$ and $s = \log_2 S$.
3. Compute $t = R - s - b$.
4. Write the address in binary, padded to $R$ bits.
5. The lowest $b$ bits are the offset, the next $s$ bits are the index, the remaining high $t$ bits are the tag.

## Worked example 1: 32 KiB, 8-way, 64-byte lines

Cache: $C = 32768$, $B = 64$, $W = 8$, 48-bit physical address. Address $A = \text{0x12345678}$.

$$
S = \frac{32768}{64 \times 8} = 64 \qquad b = 6 \qquad s = 6 \qquad t = 48 - 6 - 6 = 36
$$

The low 12 bits of `0x12345678` are `0x678`, which is `0110 0111 1000` in binary. Split them 6 + 6:

| Field | Bits | Binary | Value |
| --- | --- | --- | --- |
| Offset | 5-0 | `111000` | 56 |
| Index | 11-6 | `011001` | 25 |
| Tag | 47-12 | `0x12345` | 74565 |

```c
offset = 0x12345678 & 0x3f;         // 56
index  = (0x12345678 >> 6) & 0x3f;  // 25
tag    = 0x12345678 >> 12;          // 0x12345
```

The hardware goes to set 25, compares `0x12345` against the tags of the 8 ways in parallel, and on a match reads the byte at offset 56. Nothing in the address tells it which *way* holds the line; that is discovered by the tag comparison.

## Worked example 2: a tiny direct-mapped cache

Cache: $C = 1024$, $B = 16$, $W = 1$, 16-bit address. Address $A = \text{0x2F9C}$.

$$
S = \frac{1024}{16 \times 1} = 64 \qquad b = 4 \qquad s = 6 \qquad t = 16 - 6 - 4 = 6
$$

`0x2F9C` in binary is `0010 1111 1001 1100`. Group it as 6 | 6 | 4:

```
001011 | 111001 | 1100
 tag      index    offset
```

So tag = 11, index = 57, offset = 12. Check by rebuilding the address:

$$
((11 \times 64) + 57) \times 16 + 12 = (704 + 57) \times 16 + 12 = 12176 + 12 = 12188 = \text{0x2F9C}
$$

## Common mistakes

- **Using the cache size in the wrong place.** The index width depends on the number of *sets*, not the number of lines. A 4-way cache has a quarter of the index bits of a direct-mapped cache of the same size.
- **Forgetting that associativity removes index bits.** Doubling $W$ halves $S$ and moves one bit from the index to the tag.
- **Putting a "way" field in the address.** There is none. The way is chosen on insertion by the replacement policy and found on lookup by tag comparison.
- **Mixing virtual and physical addresses.** Most L2 and L3 caches are physically indexed and physically tagged. L1 caches can be indexed with virtual-address bits. Check which address your textbook or problem uses.
- **Counting the tag as storage-free.** Every line stores a tag, plus metadata such as a valid bit. For a 16 KiB direct-mapped cache with 32-byte lines and 32-bit addresses there are 512 lines, each with an 18-bit tag: 9216 bits (1152 bytes) of tag storage.

## Frequently asked questions

**Why do the offset bits come last?** Because blocks are aligned to $B$ bytes, so the low $b$ bits of any block's start address are zero. Everything in the same block shares the upper bits.

**Why is the index taken from the low bits of the block number?** Consecutive blocks then map to consecutive sets, which spreads sequential accesses evenly across the cache and keeps conflicts rare for typical locality.

**What if the cache size is not a power of two?** Real caches can have odd total sizes (for example 12-way or 24 MiB), and then $S$ may not be a power of two or hashing is used. The shift-and-mask view is the textbook case.

## Keep going

- [Address decomposition examples](/blog/cpu-cache-address-decomposition-examples): seven fully worked configurations, including fully associative and conflict-miss cases.
- [Address decomposition practice problems](/blog/cpu-cache-address-decomposition-practice-problems): eight exercises with answers.
- [Cache tag, index and offset calculator](/tools/cache-address-calculator): enter a geometry and an address, get the fields and binary split.
- [CPU cache mapping and address decomposition](/blog/cpu-cache-mapping-and-address-decomposition): direct, fully associative and set-associative mapping explained from scratch.
- [Cache lookup and replacement](/blog/cache-lookup-and-replacement): what happens after the index selects a set.
