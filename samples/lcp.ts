// https://leetcode.com/problems/longest-common-prefix/
import {iterplus} from "../src/index"; // or "iterplus" if running in a different package

function longestCommonPrefix(strs: string[]): string {
    return iterplus(strs[0])
        .zip(...strs.slice(1))
        .takeWhile(x => x.every(v => v === x[0]))
        .map(x => x[0])
        .sum();
}

console.log(longestCommonPrefix(["flower","flow","flight"]) || "(nothing)"); // fl
console.log(longestCommonPrefix(["dog","racecar","car"]) || "(nothing)"); // (nothing)
