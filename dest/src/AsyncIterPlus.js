"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncIterPlus = exports.canAsyncIter = exports.isAsyncIter = void 0;
/**
 * Tests if an object is an iterator.
 * @param obj The object to test for.
 * @returns If `obj` is an iterator.
 */
function isAsyncIter(obj) {
    return (typeof obj === "object" &&
        obj !== null &&
        typeof obj.next === "function");
}
exports.isAsyncIter = isAsyncIter;
/**
 * Tests if an object is iterable.
 * @param obj The object to test for.
 * @returns If `obj` is an iterable.
 */
function canAsyncIter(obj) {
    return (typeof obj === "object" && obj !== null && Symbol.asyncIterator in obj);
}
exports.canAsyncIter = canAsyncIter;
/**
 * A wrapper around an iterator to add additional functionality.
 */
class AsyncIterPlus {
    constructor(iter) {
        this.internal = iter;
    }
    async next() {
        return await this.internal.next();
    }
    [Symbol.asyncIterator]() {
        return this;
    }
    // ==== STATIC METHODS ====
    /**
     * Generates an empty iterator.
     *
     * @typeParam T The item yielded by the iterator.
     * @returns The generated iterator.
     */
    static empty() {
        return new AsyncIterPlus({
            async next() {
                return {
                    done: true,
                    value: null,
                };
            },
        });
    }
    /**
     * Generates an iterator that yields values from a function and ends once the function returns null.
     *
     * @param func The function to yield values, or null to end the iterator.
     * @returns The generated iterator.
     */
    static fromFunction(func) {
        return new AsyncIterPlus({
            async next() {
                const val = await func();
                if (val === null) {
                    return {
                        done: true,
                        value: null,
                    };
                }
                return {
                    done: false,
                    value: val,
                };
            },
        });
    }
}
exports.AsyncIterPlus = AsyncIterPlus;
//# sourceMappingURL=AsyncIterPlus.js.map