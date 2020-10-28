"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Peekable = exports.IterPlus = exports.nullVal = exports.canIter = exports.isIter = void 0;
/* o:import {IterPlus as SyncIterPlus} from "./IterPlus"; */
/* o:import {PromiseOrValue} from "./util"; */
const CircularBuffer_1 = require("./CircularBuffer");
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
    return (
    /* o://- */ typeof obj === "string" ||
        (typeof obj === "object" &&
            obj !== null &&
            Symbol. /* r:asyncIterator */iterator in obj));
}
exports.canIter = canIter;
/**
 * The value of null to use.
 *
 * Defaults to `null`.
 */
/* o:// */ exports.nullVal = null;
/* o:import {Null} from "./IterPlus"; */
/**
 * A wrapper around an iterator to add additional functionality. The types intentionally ignore return value.
 *
 * Many of the methods consume elements of the iterator,
 * so use `tee` the iterator into two first if you want to preserve elements.
 *
 * @typeParam T The item type of the iterator.
 */
class IterPlus {
    /**
     * Instantiates an `IterPlus` from any iterator.
     *
     * @param iter The iterator to wrap around.
     */
    constructor(iter) {
        this.internal = iter;
    }
    /**
     * Yields the next element in the iterator.
     *
     * @returns The next element.
     */
    /* o:async */ next() {
        return /* o:await */ this.internal.next();
    }
    /**
     * Returns the next value, or null if the iterator ended.
     *
     * @returns The next value, or null if the iterator ended.
     */
    /* o:async */ nextVal() {
        const elem = /* o:await */ this.internal.next();
        if (elem.done) {
            return exports.nullVal;
        }
        return elem.value;
    }
    /**
     * Makes the iterator work as an iterable.
     *
     * @returns The same iterator.
     */
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
     * @typeParam T The item type of the iterator.
     * @param func The function to yield values, or null to end the iterator.
     * @returns The generated iterator.
     */
    static fromFunction(func /* o:-> */) {
        /* o:async */ function* ret() {
            while (true) {
                const val = /* o:await */ func();
                if (val === exports.nullVal) {
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
     * @typeParam T The item type of the iterator.
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
     * @typeParam T The item type of the iterator.
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
     * @typeParam T The item type of the iterator.
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
     * @typeParam T The item type of the iterator.
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
     * @typeParam T The item type of the iterator.
     * @param first The initial value.
     * @param func The function to generate new values.
     * @returns The generated iterator.
     */
    static successors(first, func) {
        /* o:async */ function* ret() {
            while (true) {
                if (first === exports.nullVal) {
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
     * @typeParam T The item type of the iterator.
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
     * @typeParam T The item type of the iterator.
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinations(data, count = data.length) {
        /* o:async */ function* ret() {
            if (count > data.length || count < 0) {
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
                if (i === indices.length) {
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
     * @typeParam T The item type of the iterator.
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinationsWithRepetition(data, count = data.length) {
        /* o:async */ function* ret() {
            if (data.length <= 0 || count < 0) {
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
                if (i === indices.length) {
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
     * @typeParam T The item type of the iterator.
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutations(data, count = data.length) {
        /* o:async */ function* ret() {
            if (count > data.length || count < 0) {
                return;
            }
            if (count === 0) {
                yield [];
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
                    if (cycles[i] === 0) {
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
     * @typeParam T The item type of the iterator.
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutationsWithRepetition(data, count = data.length) {
        /* o:async */ function* ret() {
            if (data.length <= 0 || count < 0) {
                return;
            }
            if (count === 0) {
                yield [];
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
                if (i === indices.length) {
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
     * Generates an iterator that iterates through the lexicographically sorted powerset of a dataset.
     *
     * @typeParam T The item type of the iterator.
     * @param data The data to get the powerset of.
     * @return The generated iterator.
     */
    static powerset(data) {
        /* o:async */ function* ret() {
            for (let i = 0; i <= data.length; i++) {
                yield* /* o:Async- */ IterPlus.combinations(data, i);
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Generates an iterator that generates a lexicographically sorted cartesian product.
     *
     * @typeParam T The item type of the iterator.
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
                if (data[i].length === 0) {
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
                if (i === indices.length) {
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
     * so if any element returns `false`,
     * the function immediately returns `false`.
     *
     * @param pred The predicate function.
     * @returns If every element satisfies the predicate.
     */
    /* o:async */ every(pred /* o:-> */) {
        /* r:for await */ for (const elem of this) {
            if (!( /* o:await */pred(elem))) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks if some element in the iterator matches a predicate.
     *
     * This function is short-circuiting,
     * so if any element returns `true`,
     * the function immediately returns `true`.
     *
     * @param pred The predicate function.
     * @returns If some element satisfies the predicate.
     */
    /* o:async */ some(pred /* o:-> */) {
        /* r:for await */ for (const elem of this) {
            if ( /* o:await */pred(elem)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Concatenates one or more iterables to this iterator,
     * creating an iterator that yields their elements in sequentual order.
     *
     * @param iters The iterables to chain to this one.
     * @returns The generated iterator.
     */
    concat(...iters) {
        const that = this;
        /* o:async */ function* ret() {
            for (const iter of [that, ...iters]) {
                /* r:for await */ for (const val of iter) {
                    yield val;
                }
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Lexicographically compares this iterator with another using a comparison function.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @typeParam O The type of the other iterator.
     * @param other Iterable to compare to.
     * @param cmp A function that should return a negative for less than, zero for equal to,
     * and positive for greater than.
     * @returns -1 if this is less than the other, 0 if it's equal, and 1 if it's greater than.
     */
    /* o:async */ compareBy(other, cmp /* o:-> */) {
        const iter = other[Symbol. /* r:asyncIterator */iterator]();
        while (true) {
            const a = /* o:await */ this.next();
            const b = /* o:await */ iter.next();
            if (a.done && b.done) {
                return 0;
            }
            else if (a.done) {
                return -1;
            }
            else if (b.done) {
                return 1;
            }
            else {
                const diff = /* o:await */ cmp(a.value, b.value);
                if (diff < 0) {
                    return -1;
                }
                else if (diff > 0) {
                    return 1;
                }
            }
        }
    }
    /**
     * Lexicographically compares this iterator with another using a key.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @typeParam K The type of the key.
     * @param other Iterable to compare to.
     * @param key Function to generate a key to compare with from an element.
     * @returns -1 if this is less than the other, 0 if it's equal, and 1 if it's greater than.
     */
    /* o:async */ compareWith(other, key /* o:-> */) {
        return this.compareBy(other, 
        /* o:async */ function (a, b) {
            const ak = /* o:await */ key(a);
            const bk = /* o:await */ key(b);
            if (ak < bk) {
                return -1;
            }
            if (ak > bk) {
                return 1;
            }
            return 0;
        });
    }
    /**
     * Lexicographically compares this iterator with another.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @param other Iterable to compare to.
     * @returns -1 if this is less than the other, 0 if it's equal, and 1 if it's greater than.
     */
    /* o:async */ compare(other) {
        return this.compareBy(other, 
        /* o:async */ function (a, b) {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });
    }
    /**
     * Collects the items in this iterator into an array.
     *
     * @returns An array with the items in the iterator.
     */
    /* o:async */ collect() {
        const ret = [];
        /* r:for await */ for (const item of this) {
            ret.push(item);
        }
        return ret;
    }
    /**
     * Counts the number of items in this iterator.
     *
     * @returns The number of items in the iterator.
     */
    /* o:async */ count() {
        let ret = 0;
        /* r:for await */ for (const item of this) {
            ret++;
        }
        return ret;
    }
    /**
     * Generates an iterator that yields a 2 element array with the index and the element.
     *
     * @returns The generated iterator.
     */
    enumerate() {
        const that = this;
        /* o:async */ function* ret() {
            let count = 0;
            /* r:for await */ for (const item of that) {
                yield [count, item];
                count++;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Checks if this iterator is equal to another using a comparison function.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @typeParam O The type of the other iterable.
     * @param other Iterable to compare to.
     * @param cmp A function that checks if elements are equal.
     * @returns If the two iterators are equal.
     */
    /* o:async */ equalsBy(other, cmp /* o:-> */) {
        const iter = other[Symbol. /* r:asyncIterator */iterator]();
        while (true) {
            const a = /* o:await */ this.next();
            const b = /* o:await */ iter.next();
            if (a.done && b.done) {
                return true;
            }
            else if (a.done || b.done) {
                return false;
            }
            else {
                const eq = /* o:await */ cmp(a.value, b.value);
                if (!eq) {
                    return false;
                }
            }
        }
    }
    /**
     * Checks if this iterator is equal to another using a key.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @typeParam K The type of the key.
     * @param other Iterable to compare to.
     * @param key Function to generate a key to compare with from an element.
     * @returns If the two iterators are equal.
     */
    /* o:async */ equalsWith(other, key /* o:-> */) {
        return this.equalsBy(other, 
        /* o:async */ function (a, b) {
            const ak = /* o:await */ key(a);
            const bk = /* o:await */ key(b);
            return ak === bk;
        });
    }
    /**
     * Checks if this iterator is equal to another.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @param other Iterable to compare to.
     * @returns If the two iterators are equal.
     */
    /* o:async */ equals(other) {
        return this.equalsBy(other, 
        /* o:async */ function (a, b) {
            return a === b;
        });
    }
    /**
     * Generates an iterator that only yields elements that match a predicate.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    filter(pred /* o:-> */) {
        const that = this;
        /* o:async */ function* ret() {
            /* r:for await */ for (const elem of that) {
                if ( /* o:await */pred(elem)) {
                    yield elem;
                }
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Generates a mapped iterator that yields non-null elements.
     *
     * @typeParam K The resulting type.
     * @typeParam N The type of the null value.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    filterMap(func /* o:-> */) {
        const that = this;
        /* o:async */ function* ret() {
            /* r:for await */ for (const elem of that) {
                const val = /* o:await */ func(elem);
                if (val !== exports.nullVal) {
                    yield val;
                }
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Finds an element that satisfies a predicate.
     *
     * This function is short-circuiting,
     * so it stops on the first match.
     *
     * @param pred The predicate function.
     * @returns The element, or null if none was found.
     */
    /* o:async */ find(pred /* o:-> */) {
        /* r:for await */ for (const elem of this) {
            if ( /* o:await */pred(elem)) {
                return elem;
            }
        }
        return exports.nullVal;
    }
    /**
     * Runs a function on every element and returns the first non-null element.
     *
     * This function is short-circuiting,
     * so it stops on the first match.
     *
     * @typeParam K The resulting type.
     * @typeParam N The type of the null value.
     * @param func The mapping function.
     * @returns The element, or null if none was found.
     */
    /* o:async */ findMap(func /* o:-> */) {
        /* r:for await */ for (const elem of this) {
            const val = /* o:await */ func(elem);
            if (val !== exports.nullVal) {
                return val;
            }
        }
        return exports.nullVal;
    }
    /**
     * Flattens an iterator of iterables,
     * yielding an iterator that sequentially produces their elements.
     *
     * @typeParam K The internal type.
     * @returns The generated iterator.
     */
    flatten() {
        const that = this;
        /* o:async */ function* ret() {
            /* r:for await */ for (const iterable of that) {
                yield* iterable;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Lazily maps an iterator, creating a new iterator where each element has been modified by a function.
     *
     * If you want to immediately run a function on all elements of the iterator, use `forEach` instead.
     *
     * @typeParam K The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    map(func /* o:-> */) {
        const that = this;
        /* o:async */ function* ret() {
            /* r:for await */ for (const elem of that) {
                yield /* o:await */ func(elem);
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Maps an iterator of iterables,
     * and calls a function with the contents of the iterable as the argument.
     *
     * @typeParam K The iterable type.
     * @typeParam R The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    starmap(func /* o:-> */) {
        const that = this;
        /* o:async */ function* ret() {
            /* r:for await */ for (const elem of that) {
                yield /* o:await */ func(...elem);
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Maps then flattens an iterator.
     *
     * @typeParam K The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    flatMap(func /* o:-> */) {
        const that = this;
        /* o:async */ function* ret() {
            /* r:for await */ for (const elem of that) {
                yield* /* o:await */ func(elem);
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /* o: async */ reduce(func /* o:-> */, initializer) {
        let accum;
        if (initializer === undefined) {
            const next = /* o: await */ this.next();
            if (next.done) {
                throw new TypeError("Reduce of empty iterator with no initializer.");
            }
            accum = next.value;
        }
        else {
            accum = initializer;
        }
        /* r:for await */ for (const elem of this) {
            accum = /* o:await */ func(accum, elem);
        }
        return accum;
    }
    /**
     * Runs a function on each element of an iterator.
     *
     * This is equivalent to running a for loop on the iterator.
     * If you want to obtain the values, consider using `.map(func).collect()` instead.
     *
     * @param func The function to run.
     */
    /* o:async */ forEach(func /* o:-> */) {
        /* r:for await */ for (const elem of this) {
            /* o:await */ func(elem);
        }
    }
    /**
     * Generates an iterator that is guaranteed to never yield a value after finishing.
     *
     * @returns The generated iterator.
     */
    fuse() {
        const that = this;
        /* o:async */ function* ret() {
            /* r:for await */ for (const elem of that) {
                yield elem;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Lazily runs functions on an iterator, returning a new iterator with unmodified elements.
     *
     * This function is primarily used as a debugging tool to inspect elements in the middle of an iterator function chain.
     *
     * @param func The function to call.
     * @returns The generated iterator.
     */
    inspect(func /* o:-> */) {
        const that = this;
        /* o:async */ function* ret() {
            /* r:for await */ for (const elem of that) {
                /* o:await */ func(elem);
                yield elem;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Determines if an iterator is partitioned by a predicate
     * (Items that return true come before items that return false).
     *
     * This function is short-circuiting,
     * so it stops on the first non-partitioned element.
     *
     * @param pred The predicate function.
     * @returns If the iterator is partitioned.
     */
    /* o:async */ isPartitioned(pred /* o:-> */) {
        let seenFalse = false;
        /* r:for await */ for (const elem of this) {
            if ( /* o:await */pred(elem)) {
                if (seenFalse) {
                    return false;
                }
            }
            else {
                seenFalse = true;
            }
        }
        return true;
    }
    /**
     * Determines if an iterator is sorted increasingly by a comparison function.
     *
     * This function is short-circuiting,
     * so it stops on the first non-sorted element.
     *
     * @param cmp A function that should return a negative for less than, zero for equal to,
     * and positive for greater than.
     * @returns If the iterator is sorted.
     */
    /* o:async */ isSortedBy(cmp /* o:-> */) {
        const first = /* o:await */ this.next();
        if (first.done) {
            return true;
        }
        let prev = first.value;
        /* r:for await */ for (const elem of this) {
            if ( /* o:await */cmp(prev, elem) > 0) {
                return false;
            }
            prev = elem;
        }
        return true;
    }
    /**
     * Determines if an iterator is sorted increasingly by a key.
     *
     * This function is short-circuiting,
     * so it stops on the first non-sorted element.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @returns If the iterator is sorted.
     */
    /* o:async */ isSortedWith(key /* o:-> */) {
        const first = /* o:await */ this.next();
        if (first.done) {
            return true;
        }
        let prev = /* o:await */ key(first.value);
        /* r:for await */ for (const elem of this) {
            const elKey = /* o:await */ key(elem);
            if (prev > elKey) {
                return false;
            }
            prev = elKey;
        }
        return true;
    }
    /**
     * Determines if an iterator is sorted increasingly.
     *
     * This function is short-circuiting,
     * so it stops on the first non-sorted element.
     *
     * @returns If the iterator is sorted.
     */
    isSorted() {
        return this.isSortedWith(/* o:async */ (x) => x);
    }
    /**
     * Finds the last element in an iterator.
     *
     * @returns The last element of the iterator, or null if the iterator is empty.
     */
    /* o:async */ last() {
        let last = exports.nullVal;
        /* r:for await */ for (const elem of this) {
            last = elem;
        }
        return last;
    }
    /**
     * Lazily maps an iterator until it encounters null.
     *
     * @typeParam K The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    mapWhile(func /* o:-> */) {
        const that = this;
        /* o:async */ function* ret() {
            /* r:for await */ for (const elem of that) {
                const val = /* o:await */ func(elem);
                if (val === null) {
                    break;
                }
                yield val;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Finds the maximum value of an iterator with a comparison function.
     *
     * @param cmp A function that should return a negative for less than, zero for equal to,
     * and positive for greater than.
     * @param overwrite If `true`, elements will be counted as the new maximum if they are equal to the maximum.
     * Defaults to `false`.
     * @returns The maximum element, or null if the iterator is empty.
     */
    /* o: async */ maxBy(cmp /* o:-> */, overwrite = false) {
        const next = /* o: await */ this.next();
        if (next.done) {
            return null;
        }
        let curMax = next.value;
        /* r:for await */ for (const elem of this) {
            const diff = /* o: await */ cmp(elem, curMax);
            if (diff > 0 || (overwrite && diff === 0)) {
                curMax = elem;
            }
        }
        return curMax;
    }
    /**
     * Finds the maximum value of an iterator with a key.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @param overwrite If `true`, elements will be counted as the new maximum if they are equal to the maximum.
     * Defaults to `false`.
     * @returns The maximum element, or null if the iterator is empty.
     */
    /* o: async */ maxWith(key /* o:-> */, overwrite = false) {
        const next = /* o: await */ this.next();
        if (next.done) {
            return null;
        }
        let curMax = next.value;
        let curMaxKey = key(curMax);
        /* r:for await */ for (const elem of this) {
            const elemKey = /* o:await */ key(elem);
            if (elemKey > curMaxKey || (overwrite && elemKey === curMaxKey)) {
                curMax = elem;
                curMaxKey = elemKey;
            }
        }
        return curMax;
    }
    /**
     * Finds the maximum value of an iterator.
     *
     * @param overwrite If `true`, elements will be counted as the new maximum if they are equal to the maximum.
     * Defaults to `false`.
     * @returns The maximum element, or null if the iterator is empty.
     */
    max(overwrite = false) {
        return this.maxWith(/* o:async */ (x) => x, overwrite);
    }
    /**
     * Finds the minimum value of an iterator with a comparison function.
     *
     * @param cmp A function that should return a negative for less than, zero for equal to,
     * and positive for greater than.
     * @param overwrite If `true`, elements will be counted as the new minimum if they are equal to the minimum.
     * Defaults to `false`.
     * @returns The minimum element, or null if the iterator is empty.
     */
    /* o: async */ minBy(cmp /* o:-> */, overwrite = false) {
        const next = /* o: await */ this.next();
        if (next.done) {
            return null;
        }
        let curMax = next.value;
        /* r:for await */ for (const elem of this) {
            const diff = /* o: await */ cmp(elem, curMax);
            if (diff < 0 || (overwrite && diff === 0)) {
                curMax = elem;
            }
        }
        return curMax;
    }
    /**
     * Finds the minimum value of an iterator with a key.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @param overwrite If `true`, elements will be counted as the new minimum if they are equal to the minimum.
     * Defaults to `false`.
     * @returns The minimum element, or null if the iterator is empty.
     */
    /* o: async */ minWith(key /* o:-> */, overwrite = false) {
        const next = /* o: await */ this.next();
        if (next.done) {
            return null;
        }
        let curMax = next.value;
        let curMaxKey = key(curMax);
        /* r:for await */ for (const elem of this) {
            const elemKey = /* o:await */ key(elem);
            if (elemKey < curMaxKey || (overwrite && elemKey === curMaxKey)) {
                curMax = elem;
                curMaxKey = elemKey;
            }
        }
        return curMax;
    }
    /**
     * Finds the minimum value of an iterator.
     *
     * @param overwrite If `true`, elements will be counted as the new minimum if they are equal to the minimum.
     * Defaults to `false`.
     * @returns The minimum element, or null if the iterator is empty.
     */
    min(overwrite = false) {
        return this.minWith(/* o:async */ (x) => x, overwrite);
    }
    /**
     * Finds the nth element in an iterator.
     *
     * @param n The number element to get.
     * @returns The nth element of the iterator, or null if the iterator is too short.
     */
    /* o:async */ nth(n) {
        if (n < 0) {
            return exports.nullVal;
        }
        /* r:for await */ for (const elem of this) {
            if (n <= 0) {
                return elem;
            }
            n--;
        }
        return exports.nullVal;
    }
    /**
     * Partitions an iterator into two groups.
     *
     * @param pred The predicate function.
     * @returns An array with two elements:
     *  - The elements where the predicate returned true.
     *  - The elements where the predicate returned false.
     */
    /* o:async */ partition(pred /* o:-> */) {
        const truePart = [];
        const falsePart = [];
        /* r:for await */ for (const elem of this) {
            if ( /* o:await */pred(elem)) {
                truePart.push(elem);
            }
            else {
                falsePart.push(elem);
            }
        }
        return [truePart, falsePart];
    }
    /**
     * Generates a `Peekable` iterator.
     *
     * @returns The peekable iterator.
     */
    peekable() {
        return new /* o:Async- */ Peekable(this);
    }
    /**
     * Finds the index of an element that satisfies a predicate.
     *
     * If you want to find the value and the index, consider using `enumerate`
     * then using `find`.
     *
     * This function is short-circuiting,
     * so it stops on the first match.
     *
     * @param pred The predicate function.
     * @returns The index, or -1 if none was found.
     */
    /* o:async */ findIndex(pred /* o:-> */) {
        let count = 0;
        /* r:for await */ for (const elem of this) {
            if ( /* o:await */pred(elem)) {
                return count;
            }
            count++;
        }
        return -1;
    }
    /**
     * Returns the product of all elements in the iterator.
     *
     * @returns The product, or 1 if the iterator is empty.
     */
    /* o: async */ product() {
        let accum = 1;
        let typechecked = false;
        /* r:for await */ for (const elem of this) {
            if (!typechecked) {
                if (typeof elem === "bigint") {
                    accum = BigInt(accum);
                }
                typechecked = true;
            }
            accum = accum * elem;
        }
        return accum;
    }
    /**
     * Returns the sum of all elements in the iterator.
     *
     * @returns The sum, or 0 if the iterator is empty.
     */
    /* o: async */ sum() {
        let accum;
        let typechecked = false;
        /* r:for await */ for (const elem of this) {
            if (!typechecked) {
                if (typeof elem === "bigint") {
                    accum = BigInt(0);
                }
                else if (typeof elem === "number") {
                    accum = 0;
                }
                else {
                    accum = "";
                }
                typechecked = true;
            }
            accum += elem;
        }
        if (accum === undefined) {
            accum = 0;
        }
        return accum;
    }
    /**
     * Consumes the iterator and reverses it.
     *
     * This has to immediately resolve every element in the iterator,
     * so it is equivalent to collecting to an array and revsersing the array,
     * so it is very inefficient on memory and should be avoided.
     *
     * @returns The reversed iterator.
     */
    /* o: async */ reverse() {
        const collected = [];
        /* r:for await */ for (const item of this) {
            collected.push(item);
        }
        return new /* o:Sync- */ IterPlus(collected.reverse().values());
    }
    /**
     * Skips the first n elements of an iterator.
     *
     * @param n The number of elements to skip.
     * @returns The generated iterator.
     */
    skip(n) {
        const that = this;
        /* o:async */ function* ret() {
            for (let i = 0; i < n; i++) {
                const val = /* o:await */ that.next();
                if (val.done) {
                    return;
                }
            }
            yield* that;
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Skips elements of an iterator while a predicate is met.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    skipWhile(pred /* o:-> */) {
        const that = this;
        /* o:async */ function* ret() {
            while (true) {
                const val = /* o:await */ that.next();
                if (val.done) {
                    return;
                }
                if (!pred(val.value)) {
                    yield val.value;
                    break;
                }
            }
            yield* that;
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Takes the first n elements of an iterator.
     *
     * @param n The number of elements to take.
     * @returns The generated iterator.
     */
    take(n) {
        const that = this;
        /* o:async */ function* ret() {
            for (let i = 0; i < n; i++) {
                const val = /* o:await */ that.next();
                if (val.done) {
                    return;
                }
                yield val.value;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Takes elements of an iterator while a predicate is met.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    takeWhile(pred /* o:-> */) {
        const that = this;
        /* o:async */ function* ret() {
            while (true) {
                const val = /* o:await */ that.next();
                if (val.done) {
                    return;
                }
                if (!pred(val.value)) {
                    return;
                }
                yield val.value;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * "Unzips" an iterator of tuples into a tuple of arrays.
     *
     * @typeParam K The tuple type.
     * @returns A tuple with the individual elements.
     */
    /* o:async */ unzip() {
        const ret = [];
        /* r:for await */ for (const elem of this) {
            while (elem.length > ret.length) {
                ret.push([]);
            }
            for (let i = 0; i < elem.length; i++) {
                ret[i].push(elem[i]);
            }
        }
        return ret;
    }
    /**
     * Zips one or more iterables with this iterator using a function.
     *
     * Stops once any one of the iterators stop.
     *
     * @typeParam K The types of the other iterables.
     * @typeParam R The resulting value.
     * @param func The function to use when zipping.
     * @param iters The iterables to zip with this one.
     * @returns The generated iterator.
     */
    zipWith(func /* o:-> */, ...iters) {
        const that = this;
        /* o:async */ function* ret() {
            const zippers = [
                that,
                ...iters.map((v) => v[Symbol. /* r:asyncIterator */iterator]()),
            ];
            while (true) {
                const tot = [];
                for (const iter of zippers) {
                    const val = /* o:await */ iter.next();
                    if (val.done) {
                        return;
                    }
                    tot.push(val.value);
                }
                yield /* o:await */ func(...tot);
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Zips one or more iterables with this iterator.
     *
     * @typeParam K The types of the other iterables.
     * @param iters The iterables to zip with this one.
     * @returns The generated iterator.
     */
    zip(...iters) {
        return this.zipWith(Array.of, ...iters);
    }
    /**
     * Splits an iterator into multiple, where advancing one iterator does not advance the others.
     *
     * Functions by storing old values and removing when no longer needed,
     * so only tee as many iterators as you need in order for memory to be cleaned properly.
     *
     * The original iterator will still be advanced,
     * so only used the iterators returned by `tee`.
     *
     * @param count The number of iterators to split into.
     * @returns An array of length `count` with separate iterators.
     */
    tee(count = 2) {
        if (count <= 0) {
            return [];
        }
        const stored = new CircularBuffer_1.CircularBuffer();
        let init = 0;
        let finished = false;
        const that = this;
        const tot = /* o:Async- */ [];
        const indices = [];
        /* o:async */ function* ret(index) {
            let n = 0;
            while (true) {
                if (n >= init + stored.size()) {
                    if (finished) {
                        return;
                    }
                    const elem = /* o:await */ that.next();
                    if (elem.done) {
                        finished = true;
                        return;
                    }
                    stored.pushEnd(elem.value);
                    yield elem.value;
                }
                else {
                    yield stored.get(n - init);
                    const minind = Math.min(...indices);
                    while (minind > init) {
                        init++;
                        stored.popStart();
                    }
                }
                n++;
                indices[index] = n;
            }
        }
        for (let i = 0; i < count; i++) {
            indices.push(0);
            tot.push(new /* o:Async- */ IterPlus(ret(i)));
        }
        return tot;
    }
    /**
     * Returns the average of all elements in the iterator.
     *
     * @throws A RangeError on an empty iterator.
     *
     * @returns The average.
     */
    /* o: async */ average() {
        let accum = 0;
        let typechecked = false;
        let bigint = false;
        let count = 0;
        /* r:for await */ for (const elem of this) {
            if (!typechecked) {
                if (typeof elem === "bigint") {
                    bigint = true;
                    accum = BigInt(accum);
                }
                typechecked = true;
            }
            accum = accum + elem;
            count++;
        }
        if (bigint) {
            count = BigInt(count);
        }
        if (count === 0) {
            throw new RangeError("Cannot average an empty iterator.");
        }
        return (accum / count);
    }
    /**
     * Returns an iterator yielding non-overlapping chunks of the iterator.
     *
     * If there aren't enough elements to fill a chunk,
     * the last chunk will be smaller than the chunk size.
     *
     * If you want gaps between the chunks,
     * consider using `windows` with the appropriate interval instead.
     *
     * @param chunkSize The chunk size.
     *
     * @returns An iterator that yields the chunks.
     */
    chunks(chunkSize) {
        const that = this;
        /* o:async */ function* ret() {
            while (true) {
                const eles = [];
                for (let i = 0; i < chunkSize; i++) {
                    const val = /* o:await */ that.next();
                    if (val.done) {
                        if (eles.length > 0) {
                            yield eles;
                        }
                        return;
                    }
                    eles.push(val.value);
                }
                yield eles;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Returns an iterator yielding non-overlapping chunks of the iterator.
     *
     * If there aren't enough elements to fill a chunk,
     * the extra elements will be omitted.
     *
     * If you want gaps between the chunks,
     * consider using `windows` with the appropriate interval instead.
     *
     * @param chunkSize The chunk size.
     *
     * @returns An iterator that yields the chunks.
     */
    chunksExact(chunkSize) {
        const that = this;
        /* o:async */ function* ret() {
            while (true) {
                const eles = [];
                for (let i = 0; i < chunkSize; i++) {
                    const val = /* o:await */ that.next();
                    if (val.done) {
                        if (eles.length === chunkSize) {
                            yield eles;
                        }
                        return;
                    }
                    eles.push(val.value);
                }
                yield eles;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Creates an iterator that repeats the contents of the current iterator a certain number of times.
     *
     * @param n The number of times to repeat.
     *
     * @returns An iterator that repeats itself n times.
     */
    repeat(n) {
        const that = this;
        /* o:async */ function* ret() {
            const eles = [];
            /* r:for await */ for (const item of that) {
                eles.push(item);
            }
            if (eles.length === 0) {
                return;
            }
            for (let i = 0; i < n; i++) {
                yield* eles;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Creates an iterator that's rotated left a certain amount,
     * so elements at the start end up at the end.
     *
     * This **does not** handle negative numbers due to right rotation being significantly slower.
     * If you want negatives, please do the checks yourself and use rotateRight when appropriate.
     *
     * @throws A RangeError when the amount is negative.
     *
     * @param amount Amount to rotate by.
     *
     * @returns The rotated iterator.
     */
    rotateLeft(amount) {
        if (amount < 0) {
            throw new RangeError("Cannot left rotate by a negative amount.");
        }
        const that = this;
        /* o:async */ function* ret() {
            const eles = [];
            for (let i = 0; i < amount; i++) {
                const val = /* o:await */ that.next();
                if (val.done) {
                    if (eles.length > 0) {
                        amount %= eles.length;
                        yield* [
                            ...eles.slice(amount),
                            ...eles.slice(0, amount),
                        ];
                    }
                    return;
                }
                eles.push(val.value);
            }
            yield* that;
            yield* eles;
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Creates an iterator that's rotated right a certain amount,
     * so elements at the end end up at the start.
     *
     * **Due to the one-directional nature of iterators, this is not lazy and therefore much slower than `rotateLeft`.**
     *
     * This **does not** handle negative numbers to be consistent with `rotateLeft`.
     * If you want negatives, please do the checks yourself and use rotateRight when appropriate.
     *
     * @throws A RangeError when the amount is negative.
     *
     * @param amount Amount to rotate by.
     *
     * @returns The rotated iterator.
     */
    rotateRight(amount) {
        if (amount < 0) {
            throw new RangeError("Cannot left rotate by a negative amount.");
        }
        const that = this;
        /* o:async */ function* ret() {
            const eles = [];
            while (true) {
                const val = /* o:await */ that.next();
                if (val.done) {
                    break;
                }
                eles.push(val.value);
            }
            if (eles.length > 0) {
                amount %= eles.length;
                yield* [...eles.slice(-amount), ...eles.slice(0, -amount)];
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Splits an iterator on an element.
     *
     * @param ele The element to split on.
     * @param limit The maximum number of chunks to make.
     *
     * @returns The iterator with the split chunks.
     */
    split(elem /* o:-> */, limit = Infinity) {
        const that = this;
        /* o:async */ function* ret() {
            const awaited = /* o:await */ elem;
            let foundEle = false;
            let chunks = 1;
            let eles = [];
            while (true) {
                const val = /* o:await */ that.next();
                if (val.done) {
                    if (foundEle) {
                        yield eles;
                    }
                    break;
                }
                foundEle = true;
                if (chunks < limit && val.value === awaited) {
                    yield eles;
                    eles = [];
                    chunks++;
                }
                else {
                    eles.push(val.value);
                }
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Splits an iterator on a predicate.
     *
     * @param pred The predicate to split with.
     * @param limit The maximum number of chunks to make.
     *
     * @returns The iterator with the split chunks.
     */
    splitPred(pred /* o:-> */, limit = Infinity) {
        const that = this;
        /* o:async */ function* ret() {
            let foundEle = false;
            let chunks = 1;
            let eles = [];
            while (true) {
                const val = /* o:await */ that.next();
                if (val.done) {
                    if (foundEle) {
                        yield eles;
                    }
                    break;
                }
                foundEle = true;
                if (chunks < limit && /* o:await */ pred(val.value)) {
                    yield eles;
                    eles = [];
                    chunks++;
                }
                else {
                    eles.push(val.value);
                }
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Splits an iterator on an element,
     * including the matched element as the last element of the chunk.
     *
     * Unlike the exclusive split,
     * this does not create an empty chunk on the end when ending with the matched element.
     *
     * @param ele The element to split on.
     * @param limit The maximum number of chunks to make.
     *
     * @returns The iterator with the split chunks.
     */
    splitInclusive(elem /* o:-> */, limit = Infinity) {
        const that = this;
        /* o:async */ function* ret() {
            const awaited = /* o:await */ elem;
            let foundEle = false;
            let chunks = 1;
            let eles = [];
            while (true) {
                const val = /* o:await */ that.next();
                if (val.done) {
                    if (foundEle && eles.length > 0) {
                        yield eles;
                    }
                    break;
                }
                foundEle = true;
                eles.push(val.value);
                if (chunks < limit && val.value === awaited) {
                    yield eles;
                    eles = [];
                    chunks++;
                }
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Splits an iterator on a predicate,
     * including the matched element as the last element of the chunk.
     *
     * Unlike the exclusive split,
     * this does not create an empty chunk on the end when ending with the matched element.
     *
     * @param pred The predicate to split with.
     * @param limit The maximum number of chunks to make.
     *
     * @returns The iterator with the split chunks.
     */
    splitPredInclusive(pred /* o:-> */, limit = Infinity) {
        const that = this;
        /* o:async */ function* ret() {
            let foundEle = false;
            let chunks = 1;
            let eles = [];
            while (true) {
                const val = /* o:await */ that.next();
                if (val.done) {
                    if (foundEle && eles.length > 0) {
                        yield eles;
                    }
                    break;
                }
                foundEle = true;
                eles.push(val.value);
                if (chunks < limit && /* o:await */ pred(val.value)) {
                    yield eles;
                    eles = [];
                    chunks++;
                }
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Returns an iterator yielding overlapping windows of the iterator.
     *
     * If there aren't enough elements to fill a window,
     * no windows will be yielded.
     *
     * @param windowSize The window size.
     * @param interval The increment between the starts of windows. Defaults to 1.
     *
     * @returns An iterator that yields the windows.
     */
    windows(windowSize, interval = 1) {
        const that = this;
        /* o:async */ function* ret() {
            const eles = new CircularBuffer_1.CircularBuffer();
            for (let i = 0; i < windowSize; i++) {
                const val = /* o:await */ that.next();
                if (val.done) {
                    return;
                }
                eles.pushEnd(val.value);
            }
            while (true) {
                yield eles.toArray();
                for (let i = 0; i < interval; i++) {
                    const val = /* o:await */ that.next();
                    if (val.done) {
                        return;
                    }
                    eles.popStart();
                    eles.pushEnd(val.value);
                }
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Removes elements of an iterator that are equal to the previous one.
     *
     * @returns An iterator with no consecutive duplicates.
     */
    dedup() {
        const that = this;
        /* o:async */ function* ret() {
            const val = /* o:await */ that.next();
            if (val.done) {
                return;
            }
            yield val.value;
            let prev = val.value;
            /* r:for await */ for (const item of that) {
                if (item !== prev) {
                    yield item;
                }
                prev = item;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Removes elements of an iterator that are equal to the previous one with a key.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     *
     * @returns An iterator with no consecutive duplicates.
     */
    dedupWith(key /* o:-> */) {
        const that = this;
        /* o:async */ function* ret() {
            const val = /* o:await */ that.next();
            if (val.done) {
                return;
            }
            yield val.value;
            let prev = /* o:await */ key(val.value);
            /* r:for await */ for (const item of that) {
                const keyItem = /* o:await */ key(item);
                if (keyItem !== prev) {
                    yield item;
                }
                prev = keyItem;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Removes elements of an iterator that are equal to the previous one with a comparison function.
     *
     * @param cmp A function that checks if elements are equal.
     *
     * @returns An iterator with no consecutive duplicates.
     */
    dedupBy(cmp /* o:-> */) {
        const that = this;
        /* o:async */ function* ret() {
            const val = /* o:await */ that.next();
            if (val.done) {
                return;
            }
            yield val.value;
            let prev = val.value;
            /* r:for await */ for (const item of that) {
                if (!cmp(prev, item)) {
                    yield item;
                }
                prev = item;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Intersperses an element between every element of the iterator.
     *
     * @param elem The element to intersperse.
     *
     * @returns The new iterator.
     */
    intersperse(elem /* o:-> */) {
        const that = this;
        /* o:async */ function* ret() {
            const awaited = /* o:await */ elem;
            const val = /* o:await */ that.next();
            if (val.done) {
                return;
            }
            yield val.value;
            /* r:for await */ for (const item of that) {
                yield awaited;
                yield item;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Intersperses multiple elements between every element of the iterator.
     *
     * @param elems The elements to intersperse.
     *
     * @returns The new iterator.
     */
    intersperseMultiple(elems) {
        const that = this;
        /* o:async */ function* ret() {
            const awaited = [];
            /* r:for await */ for (const item of elems) {
                awaited.push(item);
            }
            const val = /* o:await */ that.next();
            if (val.done) {
                return;
            }
            yield val.value;
            /* r:for await */ for (const item of that) {
                yield* awaited;
                yield item;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Joins an iterator of iterables with an element.
     *
     * @typeParam K The internal type.
     * @param elem The element to join with.
     *
     * @returns The joined iterator.
     */
    join(elem /* o:-> */) {
        const that = this;
        /* o:async */ function* ret() {
            const awaited = /* o:await */ elem;
            const val = /* o:await */ that.next();
            if (val.done) {
                return;
            }
            yield* val.value;
            /* r:for await */ for (const item of that) {
                yield awaited;
                yield* item;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
    /**
     * Joins an iterator of iterables with multiple elements.
     *
     * @typeParam K The internal type.
     * @param elems The elements to intersperse.
     *
     * @returns The joined iterator.
     */
    joinMultiple(elems) {
        const that = this;
        /* o:async */ function* ret() {
            const awaited = [];
            /* r:for await */ for (const item of elems) {
                awaited.push(item);
            }
            const val = /* o:await */ that.next();
            if (val.done) {
                return;
            }
            yield* val.value;
            /* r:for await */ for (const item of that) {
                yield* awaited;
                yield* item;
            }
        }
        return new /* o:Async- */ IterPlus(ret());
    }
}
exports.IterPlus = IterPlus;
/**
 * An iterator with a `peek`. method that can look one element in advance.
 *
 * Do not instantiate this directly, instead use the `peekable` method in `IterPlus` or `AsyncIterPlus`.
 *
 * @typeParam T The item type of the iterator.
 */
class Peekable/* r:extends Async- */  extends IterPlus {
    constructor(iter) {
        super(iter);
        this.storedVal = {
            has: false,
            val: undefined,
        };
    }
    /**
     * Yields the next element in the iterator.
     *
     * @returns The next element.
     */
    /* o:async */ next() {
        if (this.storedVal.has) {
            const ret = this.storedVal.val;
            this.storedVal = {
                has: false,
                val: undefined,
            };
            return ret;
        }
        return /* o:await */ this.internal.next();
    }
    /**
     * Peeks the next element in the iterator and does not consume it.
     *
     * @returns The next element.
     */
    /* o:async */ peek() {
        if (this.storedVal.has) {
            return this.storedVal.val;
        }
        this.storedVal = { has: true, val: /* o:await */ this.internal.next() };
        return this.storedVal.val;
    }
}
exports.Peekable = Peekable;
//# sourceMappingURL=IterPlus.js.map