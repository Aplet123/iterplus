# Iterplus
The best of Rust/Haskell/Python iterators in Javascript.

# Why Iterplus?
Javascript iterators are weak. Really weak. Like, the only method they have is to get the next value levels of weak. To make matters worse, non-Array containers in Javascript have little to no utility methods, making using them incredibly clunky. By adding powerful functionality to iterators, every single data container gains additional functionality. Also, iterators are lazy, which means they save memory and avoid unnecessary calculations.

# Installation
Iterplus is available on npm! Just install it with:
```sh
npm install iterplus
```
You can also find a deno-compatible version on deno.land:
```
https://deno.land/x/iterplus@v2.4.0/index.ts
```
It can also be bundled for the web, but you'll have to figure that out for now.

# Sample Code
Here are some Leetcode problems solved using iterplus (you can find these in `samples/`):
```ts
// https://leetcode.com/problems/longest-common-prefix/
import {iterplus} from "iterplus";

function longestCommonPrefix(strs: string[]): string {
    return iterplus(strs[0])
        .zip(...strs.slice(1))
        .takeWhile(x => x.every(v => v === x[0]))
        .map(x => x[0])
        .collect()
        .join("");
}

console.log(longestCommonPrefix(["flower","flow","flight"]) || "(nothing)"); // fl
console.log(longestCommonPrefix(["dog","racecar","car"]) || "(nothing)"); // (nothing)
```
<hr/>

```ts
// https://leetcode.com/problems/implement-strstr/
import {range} from "iterplus";

function strStr(haystack: string, needle: string): number {
    return range(haystack.length)
        .findIndex(i => haystack.substr(i, needle.length) === needle);
}

console.log(strStr("hello", "ll")); // 2
console.log(strStr("chicken", "c")); // 0
console.log(strStr("chicken", "d")); // -1
```
<hr/>

```ts
// https://leetcode.com/problems/search-insert-position/
import {iterplus} from "iterplus";

function searchInsert(nums: number[], target: number): number {
    return iterplus(nums)
        .concat([Infinity])
        .enumerate()
        .skipWhile(([_, v]) => v < target)
        .nextVal()![0];
}

console.log(searchInsert([1, 3, 5, 6], 5)); // 2
console.log(searchInsert([1, 3, 5, 6], 2)); // 1
console.log(searchInsert([1, 3, 5, 6], 7)); // 4
console.log(searchInsert([1, 3, 5, 6], 0)); // 0

```

# Documentation
You can find the generated docs at [https://aplet123.github.io/iterplus/](https://aplet123.github.io/iterplus/).