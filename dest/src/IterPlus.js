"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IterPlus = exports.canIter = exports.isIter = void 0;
/**
 * Tests if an object is an iterator.
 * @param obj The object to test for.
 * @returns If `obj` is an iterator.
 */
function isIter(obj) {
    return (typeof obj === "object" &&
        obj !== null &&
        typeof obj.next === "function");
}
exports.isIter = isIter;
/**
 * Tests if an object is iterable.
 * @param obj The object to test for.
 * @returns If `obj` is an iterable.
 */
function canIter(obj) {
    return (typeof obj === "object" &&
        obj !== null &&
        Symbol. /* r:asyncIterator */iterator in obj);
}
exports.canIter = canIter;
/**
 * A wrapper around an iterator to add additional functionality.
 */
class IterPlus {
    constructor(iter) {
        this.internal = iter;
    }
    /* o:async */ next() {
        return /* o:await */ this.internal.next();
    }
    [Symbol. /* r: asyncIterator */iterator]() {
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
        return new /* o:Async- */ IterPlus({
            /* o:async */ next() {
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
    static fromFunction(func /* o:-> */) {
        return new /* o:Async- */ IterPlus({
            /* o:async */ next() {
                const val = /* o:await */ func();
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
exports.IterPlus = IterPlus;
//# sourceMappingURL=IterPlus.js.map