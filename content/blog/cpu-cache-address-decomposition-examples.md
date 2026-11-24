---
title: "Cache Address Decomposition Examples: Tag, Index and Offset Worked Out"
date: "2026-11-24"
description: "Seven worked cache address decomposition examples: direct-mapped, set-associative, fully associative, and a conflict-miss case, each with tag, index and offset calculated step by step."
tags: ["Computer Architecture", "Systems Programming", "Performance"]
author: "Shubham Raj"
---

This page collects worked examples of splitting an address into **tag**, **set index** and **block offset**. The method is always the same, as described in the [tag, index and offset tutorial](/blog/cpu-cache-address-decomposition):

$$
S = \frac{C}{B \times W} \qquad b = \log_2 B \qquad s = \log_2 S \qquad t = R - s - b
$$

All addresses are byte addresses. $C$ is data capacity, $B$ line size, $W$ ways, $R$ address width in bits. You can check any of these with the [cache address calculator](/tools/cache-address-calculator).

## Example 1: 32 KiB, 8-way, 64 B lines, 48-bit

$A = \text{0x12345678}$

$S = 32768 / (64 \times 8) = 64$, so $b = 6$, $s = 6$, $t = 36$.

| Field | Value |
| --- | --- |
| Offset | 56 |
| Index | 25 |
| Tag | `0x12345` |

## Example 2: 1 KiB, direct-mapped, 16 B lines, 16-bit

$A = \text{0x2F9C} = \text{0010 1111 1001 1100}_2$

$S = 1024 / 16 = 64$, so $b = 4$, $s = 6$, $t = 6$.

```
001011 | 111001 | 1100
tag=11   index=57  offset=12
```

## Example 3: 4 KiB, 4-way, 32 B lines, 16-bit

$A = \text{0xABCD} = \text{1010 1011 1100 1101}_2$

$S = 4096 / (32 \times 4) = 32$, so $b = 5$, $s = 5$, $t = 6$.

```
101010 | 11110 | 01101
tag=42   index=30  offset=13
```

## Example 4: 64 KiB, 4-way, 64 B lines, 32-bit

$A = \text{0x001A2B3C}$

$S = 65536 / (64 \times 4) = 256$, so $b = 6$, $s = 8$, $t = 18$.

| Field | Bits | Value |
| --- | --- | --- |
| Offset | 5-0 | 60 |
| Index | 13-6 | 172 |
| Tag | 31-14 | 104 (`0x68`) |

Check: $((104 \times 256) + 172) \times 64 + 60 = 26796 \times 64 + 60 = 1714944 + 60 = 1715004 = \text{0x1A2B3C}$.

## Example 5: 256 KiB, 8-way, 64 B lines, 32-bit

$A = \text{0xDEADBEEF}$

$S = 262144 / (64 \times 8) = 512$, so $b = 6$, $s = 9$, $t = 17$.

| Field | Value |
| --- | --- |
| Offset | 47 |
| Index | 251 |
| Tag | `0x1BD5B` |

## Example 6: a conflict miss in a direct-mapped cache

Cache: 512 B, direct-mapped, 64 B lines, 32-bit addresses. $S = 8$, $b = 6$, $s = 3$, $t = 23$.

| Address | Block number | Index | Tag |
| --- | --- | --- | --- |
| `0x00000040` | 1 | 1 | 0 |
| `0x00000240` | 9 | 1 | 1 |

Both addresses have index 1, so they compete for the same single line. Alternating between them misses every time even though seven other lines are empty. This is the pattern from the [direct mapping section of the mapping article](/blog/cpu-cache-mapping-and-address-decomposition). Making the cache 2-way ($S = 4$) lets both live in the same set.

## Example 7: fully associative, no index

Cache: 512 B, 8-way, 64 B lines. That is $S = 512 / (64 \times 8) = 1$, so $s = 0$. With a 32-bit address, $b = 6$ and $t = 26$.

$A = \text{0x1FC0}$ gives offset 0 and tag $\text{0x1FC0} \gg 6 = \text{0x7F} = 127$. There is no index; the hardware compares the tag against every line.

## What to take from the examples

- The offset is the low $b$ bits; it only depends on line size.
- Increasing associativity at a fixed capacity shifts bits from the index into the tag: example 6 goes from $s = 3$ to $s = 2$ when it becomes 2-way.
- Two addresses with the same index but different tags fight for the same set (example 6).

Next, try the [practice problems](/blog/cpu-cache-address-decomposition-practice-problems), or revisit what happens after the set is selected in [cache lookup and replacement](/blog/cache-lookup-and-replacement).
