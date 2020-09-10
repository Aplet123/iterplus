// https://leetcode.com/problems/implement-strstr/
import {range} from "../src/index"; // or "iterplus" if running in a different package

function strStr(haystack: string, needle: string): number {
    return range(haystack.length)
        .findIndex(i => haystack.substr(i, needle.length) === needle);
}

console.log(strStr("hello", "ll")); // 2
console.log(strStr("chicken", "c")); // 0
console.log(strStr("chicken", "d")); // -1
