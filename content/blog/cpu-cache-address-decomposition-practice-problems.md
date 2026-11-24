---
title: "Cache Address Decomposition Practice Problems with Answers"
date: "2026-11-24"
description: "Eight practice problems on CPU cache tag, index and offset calculation for direct-mapped, set-associative and fully associative caches, with full answers and worked solutions."
tags: ["Computer Architecture", "Systems Programming", "Performance"]
author: "Shubham Raj"
---

Work these with a pen, then check the solutions at the bottom. The method is in the [tag, index and offset tutorial](/blog/cpu-cache-address-decomposition); [worked examples](/blog/cpu-cache-address-decomposition-examples) show the same steps. You can verify answers with the [cache address calculator](/tools/cache-address-calculator).

Reminder:

$$
S = \frac{C}{B \times W} \qquad b = \log_2 B \qquad s = \log_2 S \qquad t = R - s - b
$$

## Problems

**Problem 1.** A 16 KiB direct-mapped cache has 32-byte lines and the CPU uses 32-bit addresses. How many bits are in the offset, index and tag?

**Problem 2.** A 32 KiB 4-way set-associative cache has 64-byte lines and 40-bit physical addresses. Give the offset, index and tag widths.

**Problem 3.** For a 2 KiB 2-way cache with 32-byte lines and 16-bit addresses, split the address `0x3E8A` into tag, index and offset.

**Problem 4.** A 1 KiB fully associative cache has 64-byte lines and 32-bit addresses. How many index bits and tag bits are there?

**Problem 5.** In a 1 KiB 2-way cache with 64-byte lines and 32-bit addresses, do `0x00001FC0` and `0x00000FC0` map to the same set? If so, do they have the same tag?

**Problem 6.** A 64 KiB 8-way cache has 128-byte lines and 36-bit addresses. Give the three field widths.

**Problem 7.** A 32-bit-address cache uses a 20-bit tag and an 8-bit index. What is the line size?

**Problem 8.** How many bits of tag storage does the cache in Problem 1 need in total, ignoring valid and dirty bits?

## Solutions

**Solution 1.** $S = 16384 / 32 = 512$. $b = 5$, $s = 9$, $t = 32 - 9 - 5 = 18$. Answer: offset 5, index 9, tag 18.

**Solution 2.** $S = 32768 / (64 \times 4) = 128$. $b = 6$, $s = 7$, $t = 40 - 7 - 6 = 27$. Answer: offset 6, index 7, tag 27.

**Solution 3.** $S = 2048 / (32 \times 2) = 32$, so $b = 5$, $s = 5$, $t = 6$. `0x3E8A` is `001111 10100 01010`. Tag $= 001111_2 = 15$, index $= 10100_2 = 20$, offset $= 01010_2 = 10$.

**Solution 4.** $S = 1024 / (64 \times 16) = 1$, so $s = 0$. $b = 6$, $t = 32 - 6 = 26$. Answer: 0 index bits, 26 tag bits.

**Solution 5.** $S = 1024 / (64 \times 2) = 8$, $b = 6$, $s = 3$. `0x1FC0` has block number 127, so index $127 \bmod 8 = 7$ and tag $\lfloor 127 / 8 \rfloor = 15$. `0x0FC0` has block number 63, so index 7 and tag 7. Same set (7), different tags (15 and 7). With 2 ways, both can be resident at once.

**Solution 6.** $S = 65536 / (128 \times 8) = 64$. $b = 7$, $s = 6$, $t = 36 - 6 - 7 = 23$. Answer: offset 7, index 6, tag 23.

**Solution 7.** $b = 32 - 20 - 8 = 4$, so $B = 2^4 = 16$ bytes.

**Solution 8.** The cache has $16384 / 32 = 512$ lines, each with an 18-bit tag: $512 \times 18 = 9216$ bits, which is 1152 bytes.

## More practice

- Read how addresses are placed in the first place in [CPU cache mapping and address decomposition](/blog/cpu-cache-mapping-and-address-decomposition).
- Continue with [cache lookup and replacement](/blog/cache-lookup-and-replacement) to see what the tag is compared against.
