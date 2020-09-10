// https://leetcode.com/problems/search-insert-position/
import {iterplus} from "../src/index"; // or "iterplus" if running in a different package

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
