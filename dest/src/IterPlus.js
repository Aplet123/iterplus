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
 * A wrapper around an iterator to add additional functionality. The types intentionally ignore return value.
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
        /* o:async */ function* ret() { }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Generates an iterator that yields values from a function and ends once the function returns null.
     *
     * @param func The function to yield values, or null to end the iterator.
     * @returns The generated iterator.
     */
    static fromFunction(func /* o:-> */) {
        /* o:async */ function* ret() {
            while (true) {
                const val = /* o:await */ func();
                if (val === null) {
                    break;
                }
                yield val;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Generates an iterator that lazily yields a single value.
     *
     * @param func The function to generate a single value.
     * @returns The generated iterator.
     */
    static onceWith(func /* o:-> */) {
        /* o:async */ function* ret() {
            yield /* o:await */ func();
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Generates an iterator that yields a single value.
     *
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static once(val /* o:-> */) {
        /* o:async */ function* ret() {
            yield /* o:await */ val;
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Generates an iterator that endlessly calls a function.
     *
     * @param func The function to generate values.
     * @returns The generated iterator.
     */
    static repeatWith(func /* o:-> */) {
        /* o:async */ function* ret() {
            while (true) {
                yield /* o:await */ func();
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Generates an iterator that endlessly repeats a value.
     *
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static repeat(val /* o:-> */) {
        /* o:async */ function* ret() {
            while (true) {
                yield /* o:await */ val;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Generates an iterator that generates values based on the previous value.
     *
     * @param first The initial value.
     * @param func The function to generate new values.
     * @returns The generated iterator.
     */
    static successors(first, func) {
        /* o:async */ function* ret() {
            while (true) {
                if (first === null) {
                    break;
                }
                yield first;
                first = func(first);
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Generates an iterator that cycles through an iterable.
     *
     * While this **does** work on infinite iterators,
     * it should be avoided as it stores all elements,
     * leading to an ever-growing memory usage.
     *
     * @param data The iterable to cycle through.
     * @returns The generated iterator.
     */
    static cycle(data) {
        /* o:async */ function* ret() {
            const cache = [];
            /* r:for await */ for (const item of data) {
                yield item;
                cache.push(item);
            }
            while (true) {
                yield* cache;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Generates an iterator that iterates through lexicographically sorted combinations without repetition of a dataset.
     *
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinations(data, count = data.length) {
        /* o:async */ function* ret() {
            if (count > data.length || count <= 0) {
                return;
            }
            const indices = [];
            for (let i = 0; i < count; i++) {
                indices.push(i);
            }
            while (true) {
                yield indices.map((v) => data[v]);
                let i;
                for (i = 0; i < indices.length; i++) {
                    if (indices[indices.length - i - 1] < data.length - i - 1) {
                        indices[indices.length - i - 1]++;
                        break;
                    }
                }
                if (i == indices.length) {
                    break;
                }
                i--;
                while (i >= 0) {
                    indices[indices.length - i - 1] =
                        indices[indices.length - i - 2] + 1;
                    i--;
                }
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Generates an iterator that iterates through lexicographically sorted combinations with repetition of a dataset.
     *
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinationsWithRepetition(data, count = data.length) {
        /* o:async */ function* ret() {
            if (data.length <= 0 || count <= 0) {
                return;
            }
            const indices = [];
            for (let i = 0; i < count; i++) {
                indices.push(0);
            }
            while (true) {
                yield indices.map((v) => data[v]);
                let i;
                for (i = 0; i < indices.length; i++) {
                    if (indices[indices.length - i - 1] < data.length - 1) {
                        indices[indices.length - i - 1]++;
                        break;
                    }
                }
                if (i == indices.length) {
                    break;
                }
                i--;
                while (i >= 0) {
                    indices[indices.length - i - 1] =
                        indices[indices.length - i - 2];
                    i--;
                }
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Generates an iterator that iterates through lexicographically sorted permutations without repetition of a dataset.
     *
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutations(data, count = data.length) {
        /* o:async */ function* ret() {
            if (count > data.length || count <= 0) {
                return;
            }
            const indices = [];
            const cycles = [];
            for (let i = 0; i < data.length; i++) {
                indices.push(i);
            }
            for (let i = data.length; i > data.length - count; i--) {
                cycles.push(i);
            }
            yield indices.slice(0, count).map((v) => data[v]);
            while (true) {
                let i;
                for (i = count - 1; i >= 0; i--) {
                    cycles[i]--;
                    if (cycles[i] == 0) {
                        const first = indices[i];
                        for (let j = i; j < indices.length - 1; j++) {
                            indices[j] = indices[j + 1];
                        }
                        indices[indices.length - 1] = first;
                        cycles[i] = data.length - i;
                    }
                    else {
                        const temp = indices[i];
                        indices[i] = indices[indices.length - cycles[i]];
                        indices[indices.length - cycles[i]] = temp;
                        yield indices.slice(0, count).map((v) => data[v]);
                        break;
                    }
                }
                if (i < 0) {
                    return;
                }
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Generates an iterator that iterates through lexicographically sorted permutations with repetition of a dataset.
     *
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutationsWithRepetition(data, count = data.length) {
        /* o:async */ function* ret() {
            if (data.length <= 0 || count <= 0) {
                return;
            }
            const indices = [];
            for (let i = 0; i < count; i++) {
                indices.push(0);
            }
            while (true) {
                yield indices.map((v) => data[v]);
                let i;
                for (i = 0; i < indices.length; i++) {
                    if (indices[indices.length - i - 1] < data.length - 1) {
                        indices[indices.length - i - 1]++;
                        break;
                    }
                }
                if (i == indices.length) {
                    break;
                }
                i--;
                while (i >= 0) {
                    indices[indices.length - i - 1] = 0;
                    i--;
                }
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Generates an iterator that generates a lexicographically sorted cartesian product.
     *
     * @param data The iterators to take the product of.
     * @returns The generated iterator.
     */
    static product(...data) {
        /* o:async */ function* ret() {
            if (data.length <= 0) {
                return;
            }
            const indices = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].length == 0) {
                    return;
                }
                indices.push(0);
            }
            while (true) {
                yield indices.map((v, i) => data[i][v]);
                let i;
                for (i = 0; i < indices.length; i++) {
                    if (indices[data.length - i - 1] <
                        data[data.length - i - 1].length - 1) {
                        indices[data.length - i - 1]++;
                        break;
                    }
                }
                if (i == indices.length) {
                    break;
                }
                i--;
                while (i >= 0) {
                    indices[data.length - i - 1] = 0;
                    i--;
                }
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Checks if every element in the iterator matches a predicate.
     *
     * This function is short-circuiting,
     * so if any element returns false,
     * the function immediately returns false.
     *
     * @param pred The predicate function.
     * @returns If every element satisfies the predicate.
     */
    /* o:async */ every(pred) {
        /* r:for await */ for (const elem of this) {
            if (!pred(elem)) {
                return false;
            }
        }
        return true;
    }
}
exports.IterPlus = IterPlus;
//# sourceMappingURL=IterPlus.js.map