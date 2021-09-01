"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncPeekable = exports.AsyncIterPlus = exports.canAsyncIter = exports.isAsyncIter = void 0;
const IterPlus_1 = require("./IterPlus");
const CircularBuffer_1 = require("./CircularBuffer");
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
    return (
    //typeof obj === "string" ||
    typeof obj === "object" && obj !== null && Symbol.asyncIterator in obj);
}
exports.canAsyncIter = canAsyncIter;
/**
 * The value of null to use.
 *
 * Defaults to `null`.
 */
// export const nullVal = null;
const IterPlus_2 = require("./IterPlus");
/**
 * A wrapper around an iterator to add additional functionality. The types intentionally ignore return value.
 *
 * Many of the methods consume elements of the iterator,
 * so use `tee` the iterator into two first if you want to preserve elements.
 *
 * @typeParam T The item type of the iterator.
 */
class AsyncIterPlus {
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
    async next() {
        return await this.internal.next();
    }
    /**
     * Returns the next value, or null if the iterator ended.
     *
     * @returns The next value, or null if the iterator ended.
     */
    async nextVal() {
        const elem = await this.internal.next();
        if (elem.done) {
            return IterPlus_2.nullVal;
        }
        return elem.value;
    }
    /**
     * Makes the iterator work as an iterable.
     *
     * @returns The same iterator.
     */
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
        function ret() { return __asyncGenerator(this, arguments, function* ret_1() { }); }
        return new AsyncIterPlus(ret());
    }
    /**
     * Generates an iterator that yields values from a function and ends once the function returns null.
     *
     * @typeParam T The item type of the iterator.
     * @param func The function to yield values, or null to end the iterator.
     * @returns The generated iterator.
     */
    static fromFunction(func) {
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_2() {
                while (true) {
                    const val = yield __await(func());
                    if (val === IterPlus_2.nullVal) {
                        break;
                    }
                    yield yield __await(val);
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Generates an iterator that lazily yields a single value.
     *
     * @typeParam T The item type of the iterator.
     * @param func The function to generate a single value.
     * @returns The generated iterator.
     */
    static onceWith(func) {
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_3() {
                yield yield __await(yield __await(func()));
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Generates an iterator that yields a single value.
     *
     * @typeParam T The item type of the iterator.
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static once(val) {
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_4() {
                yield yield __await(yield __await(val));
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Generates an iterator that endlessly calls a function.
     *
     * @typeParam T The item type of the iterator.
     * @param func The function to generate values.
     * @returns The generated iterator.
     */
    static repeatWith(func) {
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_5() {
                while (true) {
                    yield yield __await(yield __await(func()));
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Generates an iterator that endlessly repeats a value.
     *
     * @typeParam T The item type of the iterator.
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static repeat(val) {
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_6() {
                while (true) {
                    yield yield __await(yield __await(val));
                }
            });
        }
        return new AsyncIterPlus(ret());
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
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_7() {
                let val = yield __await(first);
                while (true) {
                    if (val === IterPlus_2.nullVal) {
                        break;
                    }
                    yield yield __await(val);
                    val = yield __await(func(val));
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    static unfold(func, init) {
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_8() {
                let accum = yield __await(init);
                while (true) {
                    const pair = yield __await(func(accum));
                    if (pair === IterPlus_2.nullVal) {
                        break;
                    }
                    yield yield __await(pair[0]);
                    accum = pair[1];
                }
            });
        }
        return new AsyncIterPlus(ret());
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
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_9() {
                var e_1, _a;
                const cache = [];
                try {
                    for (var data_1 = __asyncValues(data), data_1_1; data_1_1 = yield __await(data_1.next()), !data_1_1.done;) {
                        const item = data_1_1.value;
                        yield yield __await(item);
                        cache.push(item);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (data_1_1 && !data_1_1.done && (_a = data_1.return)) yield __await(_a.call(data_1));
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                while (true) {
                    yield __await(yield* __asyncDelegator(__asyncValues(cache)));
                }
            });
        }
        return new AsyncIterPlus(ret());
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
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_10() {
                if (count > data.length || count < 0) {
                    return yield __await(void 0);
                }
                const indices = [];
                for (let i = 0; i < count; i++) {
                    indices.push(i);
                }
                while (true) {
                    yield yield __await(indices.map((v) => data[v]));
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
            });
        }
        return new AsyncIterPlus(ret());
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
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_11() {
                if (data.length <= 0 || count < 0) {
                    return yield __await(void 0);
                }
                const indices = [];
                for (let i = 0; i < count; i++) {
                    indices.push(0);
                }
                while (true) {
                    yield yield __await(indices.map((v) => data[v]));
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
            });
        }
        return new AsyncIterPlus(ret());
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
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_12() {
                if (count > data.length || count < 0) {
                    return yield __await(void 0);
                }
                if (count === 0) {
                    yield yield __await([]);
                    return yield __await(void 0);
                }
                const indices = [];
                const cycles = [];
                for (let i = 0; i < data.length; i++) {
                    indices.push(i);
                }
                for (let i = data.length; i > data.length - count; i--) {
                    cycles.push(i);
                }
                yield yield __await(indices.slice(0, count).map((v) => data[v]));
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
                            yield yield __await(indices.slice(0, count).map((v) => data[v]));
                            break;
                        }
                    }
                    if (i < 0) {
                        return yield __await(void 0);
                    }
                }
            });
        }
        return new AsyncIterPlus(ret());
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
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_13() {
                if (data.length <= 0 || count < 0) {
                    return yield __await(void 0);
                }
                if (count === 0) {
                    yield yield __await([]);
                    return yield __await(void 0);
                }
                const indices = [];
                for (let i = 0; i < count; i++) {
                    indices.push(0);
                }
                while (true) {
                    yield yield __await(indices.map((v) => data[v]));
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
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Generates an iterator that iterates through the lexicographically sorted powerset of a dataset.
     *
     * @typeParam T The item type of the iterator.
     * @param data The data to get the powerset of.
     * @return The generated iterator.
     */
    static powerset(data) {
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_14() {
                for (let i = 0; i <= data.length; i++) {
                    yield __await(yield* __asyncDelegator(__asyncValues(AsyncIterPlus.combinations(data, i))));
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Generates an iterator that generates a lexicographically sorted cartesian product.
     *
     * @typeParam T The item type of the iterator.
     * @param data The iterators to take the product of.
     * @returns The generated iterator.
     */
    static product(...data) {
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_15() {
                if (data.length <= 0) {
                    return yield __await(void 0);
                }
                const indices = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].length === 0) {
                        return yield __await(void 0);
                    }
                    indices.push(0);
                }
                while (true) {
                    yield yield __await(indices.map((v, i) => data[i][v]));
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
            });
        }
        return new AsyncIterPlus(ret());
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
    async every(pred) {
        var e_2, _a;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                if (!(await pred(elem))) {
                    return false;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
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
    async some(pred) {
        var e_3, _a;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                if (await pred(elem)) {
                    return true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
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
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_16() {
                var e_4, _a;
                for (const iter of [that, ...iters]) {
                    try {
                        for (var iter_1 = (e_4 = void 0, __asyncValues(iter)), iter_1_1; iter_1_1 = yield __await(iter_1.next()), !iter_1_1.done;) {
                            const val = iter_1_1.value;
                            yield yield __await(val);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (iter_1_1 && !iter_1_1.done && (_a = iter_1.return)) yield __await(_a.call(iter_1));
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                }
            });
        }
        return new AsyncIterPlus(ret());
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
    async compareBy(other, cmp) {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
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
                const diff = await cmp(a.value, b.value);
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
    async compareWith(other, key) {
        return this.compareBy(other, async function (a, b) {
            const ak = await key(a);
            const bk = await key(b);
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
    async compare(other) {
        return this.compareBy(other, async function (a, b) {
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
    async collect() {
        var e_5, _a;
        const ret = [];
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const item = _c.value;
                ret.push(item);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return ret;
    }
    /**
     * Calls a specified collector function with this iterator as its only argument.
     *
     * @param collector The collector to use.
     * @returns The return value of the collector.
     */
    collectWith(collector) {
        return collector(this);
    }
    /**
     * Calls a specified constructor with this iterator as its only argument.
     *
     * @param ctor The constructor to use.
     * @returns The constructed value.
     */
    construct(ctor) {
        return new ctor(this);
    }
    /**
     * Counts the number of items in this iterator.
     *
     * @returns The number of items in the iterator.
     */
    async count() {
        var e_6, _a;
        let ret = 0;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const item = _c.value;
                ret++;
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
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
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_17() {
                var e_7, _a;
                let count = 0;
                try {
                    for (var that_1 = __asyncValues(that), that_1_1; that_1_1 = yield __await(that_1.next()), !that_1_1.done;) {
                        const item = that_1_1.value;
                        yield yield __await([count, item]);
                        count++;
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (that_1_1 && !that_1_1.done && (_a = that_1.return)) yield __await(_a.call(that_1));
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
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
    async equalsBy(other, cmp) {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (a.done && b.done) {
                return true;
            }
            else if (a.done || b.done) {
                return false;
            }
            else {
                const eq = await cmp(a.value, b.value);
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
    async equalsWith(other, key) {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (a.done && b.done) {
                return true;
            }
            else if (a.done || b.done) {
                return false;
            }
            else {
                const eq = (await key(a.value)) === (await key(b.value));
                if (!eq) {
                    return false;
                }
            }
        }
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
    async equals(other) {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (a.done && b.done) {
                return true;
            }
            else if (a.done || b.done) {
                return false;
            }
            else {
                const eq = a.value === b.value;
                if (!eq) {
                    return false;
                }
            }
        }
    }
    /**
     * Generates an iterator that only yields elements that match a predicate.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    filter(pred) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_18() {
                var e_8, _a;
                try {
                    for (var that_2 = __asyncValues(that), that_2_1; that_2_1 = yield __await(that_2.next()), !that_2_1.done;) {
                        const elem = that_2_1.value;
                        if (yield __await(pred(elem))) {
                            yield yield __await(elem);
                        }
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (that_2_1 && !that_2_1.done && (_a = that_2.return)) yield __await(_a.call(that_2));
                    }
                    finally { if (e_8) throw e_8.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Generates a mapped iterator that yields non-null elements.
     *
     * @typeParam K The resulting type.
     * @typeParam N The type of the null value.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    filterMap(func) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_19() {
                var e_9, _a;
                try {
                    for (var that_3 = __asyncValues(that), that_3_1; that_3_1 = yield __await(that_3.next()), !that_3_1.done;) {
                        const elem = that_3_1.value;
                        const val = yield __await(func(elem));
                        if (val !== IterPlus_2.nullVal) {
                            yield yield __await(val);
                        }
                    }
                }
                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                finally {
                    try {
                        if (that_3_1 && !that_3_1.done && (_a = that_3.return)) yield __await(_a.call(that_3));
                    }
                    finally { if (e_9) throw e_9.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
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
    async find(pred) {
        var e_10, _a;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                if (await pred(elem)) {
                    return elem;
                }
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_10) throw e_10.error; }
        }
        return IterPlus_2.nullVal;
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
    async findMap(func) {
        var e_11, _a;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                const val = await func(elem);
                if (val !== IterPlus_2.nullVal) {
                    return val;
                }
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_11) throw e_11.error; }
        }
        return IterPlus_2.nullVal;
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
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_20() {
                var e_12, _a;
                try {
                    for (var that_4 = __asyncValues(that), that_4_1; that_4_1 = yield __await(that_4.next()), !that_4_1.done;) {
                        const iterable = that_4_1.value;
                        yield __await(yield* __asyncDelegator(__asyncValues(iterable)));
                    }
                }
                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                finally {
                    try {
                        if (that_4_1 && !that_4_1.done && (_a = that_4.return)) yield __await(_a.call(that_4));
                    }
                    finally { if (e_12) throw e_12.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
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
    map(func) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_21() {
                var e_13, _a;
                try {
                    for (var that_5 = __asyncValues(that), that_5_1; that_5_1 = yield __await(that_5.next()), !that_5_1.done;) {
                        const elem = that_5_1.value;
                        yield yield __await(yield __await(func(elem)));
                    }
                }
                catch (e_13_1) { e_13 = { error: e_13_1 }; }
                finally {
                    try {
                        if (that_5_1 && !that_5_1.done && (_a = that_5.return)) yield __await(_a.call(that_5));
                    }
                    finally { if (e_13) throw e_13.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
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
    starmap(func) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_22() {
                var e_14, _a;
                try {
                    for (var that_6 = __asyncValues(that), that_6_1; that_6_1 = yield __await(that_6.next()), !that_6_1.done;) {
                        const elem = that_6_1.value;
                        yield yield __await(yield __await(func(...elem)));
                    }
                }
                catch (e_14_1) { e_14 = { error: e_14_1 }; }
                finally {
                    try {
                        if (that_6_1 && !that_6_1.done && (_a = that_6.return)) yield __await(_a.call(that_6));
                    }
                    finally { if (e_14) throw e_14.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Maps then flattens an iterator.
     *
     * @typeParam K The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    flatMap(func) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_23() {
                var e_15, _a;
                try {
                    for (var that_7 = __asyncValues(that), that_7_1; that_7_1 = yield __await(that_7.next()), !that_7_1.done;) {
                        const elem = that_7_1.value;
                        yield __await(yield* __asyncDelegator(__asyncValues(yield __await(func(elem)))));
                    }
                }
                catch (e_15_1) { e_15 = { error: e_15_1 }; }
                finally {
                    try {
                        if (that_7_1 && !that_7_1.done && (_a = that_7.return)) yield __await(_a.call(that_7));
                    }
                    finally { if (e_15) throw e_15.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    async reduce(func, initializer) {
        var e_16, _a;
        let accum;
        if (initializer === undefined) {
            const next = await this.next();
            if (next.done) {
                throw new TypeError("Reduce of empty iterator with no initializer.");
            }
            accum = next.value;
        }
        else {
            accum = initializer;
        }
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                accum = await func(accum, elem);
            }
        }
        catch (e_16_1) { e_16 = { error: e_16_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_16) throw e_16.error; }
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
    async forEach(func) {
        var e_17, _a;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                await func(elem);
            }
        }
        catch (e_17_1) { e_17 = { error: e_17_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_17) throw e_17.error; }
        }
    }
    /**
     * Generates an iterator that is guaranteed to never yield a value after finishing.
     *
     * @returns The generated iterator.
     */
    fuse() {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_24() {
                var e_18, _a;
                try {
                    for (var that_8 = __asyncValues(that), that_8_1; that_8_1 = yield __await(that_8.next()), !that_8_1.done;) {
                        const elem = that_8_1.value;
                        yield yield __await(elem);
                    }
                }
                catch (e_18_1) { e_18 = { error: e_18_1 }; }
                finally {
                    try {
                        if (that_8_1 && !that_8_1.done && (_a = that_8.return)) yield __await(_a.call(that_8));
                    }
                    finally { if (e_18) throw e_18.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Lazily runs functions on an iterator, returning a new iterator with unmodified elements.
     *
     * This function is primarily used as a debugging tool to inspect elements in the middle of an iterator function chain.
     *
     * @param func The function to call.
     * @returns The generated iterator.
     */
    inspect(func) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_25() {
                var e_19, _a;
                try {
                    for (var that_9 = __asyncValues(that), that_9_1; that_9_1 = yield __await(that_9.next()), !that_9_1.done;) {
                        const elem = that_9_1.value;
                        yield __await(func(elem));
                        yield yield __await(elem);
                    }
                }
                catch (e_19_1) { e_19 = { error: e_19_1 }; }
                finally {
                    try {
                        if (that_9_1 && !that_9_1.done && (_a = that_9.return)) yield __await(_a.call(that_9));
                    }
                    finally { if (e_19) throw e_19.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
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
    async isPartitioned(pred) {
        var e_20, _a;
        let seenFalse = false;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                if (await pred(elem)) {
                    if (seenFalse) {
                        return false;
                    }
                }
                else {
                    seenFalse = true;
                }
            }
        }
        catch (e_20_1) { e_20 = { error: e_20_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_20) throw e_20.error; }
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
    async isSortedBy(cmp) {
        var e_21, _a;
        const first = await this.next();
        if (first.done) {
            return true;
        }
        let prev = first.value;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                if ((await cmp(prev, elem)) > 0) {
                    return false;
                }
                prev = elem;
            }
        }
        catch (e_21_1) { e_21 = { error: e_21_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_21) throw e_21.error; }
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
    async isSortedWith(key) {
        var e_22, _a;
        const first = await this.next();
        if (first.done) {
            return true;
        }
        let prev = await key(first.value);
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                const elKey = await key(elem);
                if (prev > elKey) {
                    return false;
                }
                prev = elKey;
            }
        }
        catch (e_22_1) { e_22 = { error: e_22_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_22) throw e_22.error; }
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
        return this.isSortedWith(async (x) => x);
    }
    /**
     * Finds the last element in an iterator.
     *
     * @returns The last element of the iterator, or null if the iterator is empty.
     */
    async last() {
        var e_23, _a;
        let last = IterPlus_2.nullVal;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                last = elem;
            }
        }
        catch (e_23_1) { e_23 = { error: e_23_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_23) throw e_23.error; }
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
    mapWhile(func) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_26() {
                var e_24, _a;
                try {
                    for (var that_10 = __asyncValues(that), that_10_1; that_10_1 = yield __await(that_10.next()), !that_10_1.done;) {
                        const elem = that_10_1.value;
                        const val = yield __await(func(elem));
                        if (val === null) {
                            break;
                        }
                        yield yield __await(val);
                    }
                }
                catch (e_24_1) { e_24 = { error: e_24_1 }; }
                finally {
                    try {
                        if (that_10_1 && !that_10_1.done && (_a = that_10.return)) yield __await(_a.call(that_10));
                    }
                    finally { if (e_24) throw e_24.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
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
    async maxBy(cmp, overwrite = false) {
        var e_25, _a;
        const next = await this.next();
        if (next.done) {
            return null;
        }
        let curMax = next.value;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                const diff = await cmp(elem, curMax);
                if (diff > 0 || (overwrite && diff === 0)) {
                    curMax = elem;
                }
            }
        }
        catch (e_25_1) { e_25 = { error: e_25_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_25) throw e_25.error; }
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
    async maxWith(key, overwrite = false) {
        var e_26, _a;
        const next = await this.next();
        if (next.done) {
            return null;
        }
        let curMax = next.value;
        let curMaxKey = await key(curMax);
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                const elemKey = await key(elem);
                if (elemKey > curMaxKey || (overwrite && elemKey === curMaxKey)) {
                    curMax = elem;
                    curMaxKey = elemKey;
                }
            }
        }
        catch (e_26_1) { e_26 = { error: e_26_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_26) throw e_26.error; }
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
        return this.maxWith(async (x) => x, overwrite);
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
    async minBy(cmp, overwrite = false) {
        var e_27, _a;
        const next = await this.next();
        if (next.done) {
            return null;
        }
        let curMax = next.value;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                const diff = await cmp(elem, curMax);
                if (diff < 0 || (overwrite && diff === 0)) {
                    curMax = elem;
                }
            }
        }
        catch (e_27_1) { e_27 = { error: e_27_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_27) throw e_27.error; }
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
    async minWith(key, overwrite = false) {
        var e_28, _a;
        const next = await this.next();
        if (next.done) {
            return null;
        }
        let curMax = next.value;
        let curMaxKey = await key(curMax);
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                const elemKey = await key(elem);
                if (elemKey < curMaxKey || (overwrite && elemKey === curMaxKey)) {
                    curMax = elem;
                    curMaxKey = elemKey;
                }
            }
        }
        catch (e_28_1) { e_28 = { error: e_28_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_28) throw e_28.error; }
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
        return this.minWith(async (x) => x, overwrite);
    }
    /**
     * Finds the nth element in an iterator.
     *
     * @param n The number element to get.
     * @returns The nth element of the iterator, or null if the iterator is too short.
     */
    async nth(n) {
        var e_29, _a;
        if (n < 0) {
            return IterPlus_2.nullVal;
        }
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                if (n <= 0) {
                    return elem;
                }
                n--;
            }
        }
        catch (e_29_1) { e_29 = { error: e_29_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_29) throw e_29.error; }
        }
        return IterPlus_2.nullVal;
    }
    /**
     * Partitions an iterator into two groups.
     *
     * @param pred The predicate function.
     * @returns An array with two elements:
     *  - The elements where the predicate returned true.
     *  - The elements where the predicate returned false.
     */
    async partition(pred) {
        var e_30, _a;
        const truePart = [];
        const falsePart = [];
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                if (await pred(elem)) {
                    truePart.push(elem);
                }
                else {
                    falsePart.push(elem);
                }
            }
        }
        catch (e_30_1) { e_30 = { error: e_30_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_30) throw e_30.error; }
        }
        return [truePart, falsePart];
    }
    /**
     * Generates a `Peekable` iterator.
     *
     * @returns The peekable iterator.
     */
    peekable() {
        return new AsyncPeekable(this);
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
    async findIndex(pred) {
        var e_31, _a;
        let count = 0;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                if (await pred(elem)) {
                    return count;
                }
                count++;
            }
        }
        catch (e_31_1) { e_31 = { error: e_31_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_31) throw e_31.error; }
        }
        return -1;
    }
    async product(empty = 1) {
        var e_32, _a;
        let accum;
        let typechecked = false;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                if (!typechecked) {
                    accum = elem;
                    typechecked = true;
                }
                else {
                    accum = accum * elem;
                }
            }
        }
        catch (e_32_1) { e_32 = { error: e_32_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_32) throw e_32.error; }
        }
        if (accum === undefined) {
            return empty;
        }
        return accum;
    }
    async sum(empty = 0) {
        var e_33, _a;
        let accum;
        let typechecked = false;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                if (!typechecked) {
                    accum = elem;
                    typechecked = true;
                }
                else {
                    accum += elem;
                }
            }
        }
        catch (e_33_1) { e_33 = { error: e_33_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_33) throw e_33.error; }
        }
        if (accum === undefined) {
            return empty;
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
    async reverse() {
        var e_34, _a;
        const collected = [];
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const item = _c.value;
                collected.push(item);
            }
        }
        catch (e_34_1) { e_34 = { error: e_34_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_34) throw e_34.error; }
        }
        return new IterPlus_1.IterPlus(collected.reverse().values());
    }
    /**
     * Skips the first n elements of an iterator.
     *
     * @param n The number of elements to skip.
     * @returns The generated iterator.
     */
    skip(n) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_27() {
                for (let i = 0; i < n; i++) {
                    const val = yield __await(that.next());
                    if (val.done) {
                        return yield __await(void 0);
                    }
                }
                yield __await(yield* __asyncDelegator(__asyncValues(that)));
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Skips elements of an iterator while a predicate is met.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    skipWhile(pred) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_28() {
                while (true) {
                    const val = yield __await(that.next());
                    if (val.done) {
                        return yield __await(void 0);
                    }
                    if (!pred(val.value)) {
                        yield yield __await(val.value);
                        break;
                    }
                }
                yield __await(yield* __asyncDelegator(__asyncValues(that)));
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Takes the first n elements of an iterator.
     *
     * @param n The number of elements to take.
     * @returns The generated iterator.
     */
    take(n) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_29() {
                for (let i = 0; i < n; i++) {
                    const val = yield __await(that.next());
                    if (val.done) {
                        return yield __await(void 0);
                    }
                    yield yield __await(val.value);
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Takes elements of an iterator while a predicate is met.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    takeWhile(pred) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_30() {
                while (true) {
                    const val = yield __await(that.next());
                    if (val.done) {
                        return yield __await(void 0);
                    }
                    if (!pred(val.value)) {
                        return yield __await(void 0);
                    }
                    yield yield __await(val.value);
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * "Unzips" an iterator of tuples into a tuple of arrays.
     *
     * @typeParam K The tuple type.
     * @returns A tuple with the individual elements.
     */
    async unzip() {
        var e_35, _a;
        const ret = [];
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                while (elem.length > ret.length) {
                    ret.push([]);
                }
                for (let i = 0; i < elem.length; i++) {
                    ret[i].push(elem[i]);
                }
            }
        }
        catch (e_35_1) { e_35 = { error: e_35_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_35) throw e_35.error; }
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
    zipWith(func, ...iters) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_31() {
                const zippers = [
                    that,
                    ...iters.map((v) => v[Symbol.asyncIterator]()),
                ];
                while (true) {
                    const tot = [];
                    for (const iter of zippers) {
                        const val = yield __await(iter.next());
                        if (val.done) {
                            return yield __await(void 0);
                        }
                        tot.push(val.value);
                    }
                    yield yield __await(yield __await(func(...tot)));
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Zips one or more iterables with this iterator.
     *
     * @typeParam K The types of the other iterables.
     * @param iters The iterables to zip with this one.
     * @returns The generated iterator.
     */
    zip(...iters) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_32() {
                const zippers = [
                    that,
                    ...iters.map((v) => v[Symbol.asyncIterator]()),
                ];
                while (true) {
                    const tot = [];
                    for (const iter of zippers) {
                        const val = yield __await(iter.next());
                        if (val.done) {
                            return yield __await(void 0);
                        }
                        tot.push(val.value);
                    }
                    yield yield __await(tot);
                }
            });
        }
        return new AsyncIterPlus(ret());
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
        const tot = [];
        const indices = [];
        function ret(index) {
            return __asyncGenerator(this, arguments, function* ret_33() {
                let n = 0;
                while (true) {
                    if (n >= init + stored.size()) {
                        if (finished) {
                            return yield __await(void 0);
                        }
                        const elem = yield __await(that.next());
                        if (elem.done) {
                            finished = true;
                            return yield __await(void 0);
                        }
                        stored.pushEnd(elem.value);
                        yield yield __await(elem.value);
                    }
                    else {
                        yield yield __await(stored.get(n - init));
                        const minind = Math.min(...indices);
                        while (minind > init) {
                            init++;
                            stored.popStart();
                        }
                    }
                    n++;
                    indices[index] = n;
                }
            });
        }
        for (let i = 0; i < count; i++) {
            indices.push(0);
            tot.push(new AsyncIterPlus(ret(i)));
        }
        return tot;
    }
    /**
     * Returns the average of all elements in the iterator.
     *
     * @throws A RangeError on an empty iterator.
     * @returns The average.
     */
    async average() {
        var e_36, _a;
        let accum = 0;
        let typechecked = false;
        let bigint = false;
        let count = 0;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
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
        }
        catch (e_36_1) { e_36 = { error: e_36_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_36) throw e_36.error; }
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
     * @returns An iterator that yields the chunks.
     */
    chunks(chunkSize) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_34() {
                while (true) {
                    const eles = [];
                    for (let i = 0; i < chunkSize; i++) {
                        const val = yield __await(that.next());
                        if (val.done) {
                            if (eles.length > 0) {
                                yield yield __await(eles);
                            }
                            return yield __await(void 0);
                        }
                        eles.push(val.value);
                    }
                    yield yield __await(eles);
                }
            });
        }
        return new AsyncIterPlus(ret());
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
     * @returns An iterator that yields the chunks.
     */
    chunksExact(chunkSize) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_35() {
                while (true) {
                    const eles = [];
                    for (let i = 0; i < chunkSize; i++) {
                        const val = yield __await(that.next());
                        if (val.done) {
                            if (eles.length === chunkSize) {
                                yield yield __await(eles);
                            }
                            return yield __await(void 0);
                        }
                        eles.push(val.value);
                    }
                    yield yield __await(eles);
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Creates an iterator that repeats the contents of the current iterator a certain number of times.
     *
     * @param n The number of times to repeat.
     * @returns An iterator that repeats itself n times.
     */
    repeat(n) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_36() {
                var e_37, _a;
                const eles = [];
                try {
                    for (var that_11 = __asyncValues(that), that_11_1; that_11_1 = yield __await(that_11.next()), !that_11_1.done;) {
                        const item = that_11_1.value;
                        eles.push(item);
                    }
                }
                catch (e_37_1) { e_37 = { error: e_37_1 }; }
                finally {
                    try {
                        if (that_11_1 && !that_11_1.done && (_a = that_11.return)) yield __await(_a.call(that_11));
                    }
                    finally { if (e_37) throw e_37.error; }
                }
                if (eles.length === 0) {
                    return yield __await(void 0);
                }
                for (let i = 0; i < n; i++) {
                    yield __await(yield* __asyncDelegator(__asyncValues(eles)));
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Creates an iterator that's rotated left a certain amount,
     * so elements at the start end up at the end.
     *
     * This **does not** handle negative numbers due to right rotation being significantly slower.
     * If you want negatives, please do the checks yourself and use rotateRight when appropriate.
     *
     * @param amount Amount to rotate by.
     * @throws A RangeError when the amount is negative.
     * @returns The rotated iterator.
     */
    rotateLeft(amount) {
        if (amount < 0) {
            throw new RangeError("Cannot left rotate by a negative amount.");
        }
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_37() {
                const eles = [];
                for (let i = 0; i < amount; i++) {
                    const val = yield __await(that.next());
                    if (val.done) {
                        if (eles.length > 0) {
                            amount %= eles.length;
                            yield __await(yield* __asyncDelegator(__asyncValues([
                                ...eles.slice(amount),
                                ...eles.slice(0, amount),
                            ])));
                        }
                        return yield __await(void 0);
                    }
                    eles.push(val.value);
                }
                yield __await(yield* __asyncDelegator(__asyncValues(that)));
                yield __await(yield* __asyncDelegator(__asyncValues(eles)));
            });
        }
        return new AsyncIterPlus(ret());
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
     * @param amount Amount to rotate by.
     * @throws A RangeError when the amount is negative.
     * @returns The rotated iterator.
     */
    rotateRight(amount) {
        if (amount < 0) {
            throw new RangeError("Cannot right rotate by a negative amount.");
        }
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_38() {
                const eles = [];
                while (true) {
                    const val = yield __await(that.next());
                    if (val.done) {
                        break;
                    }
                    eles.push(val.value);
                }
                if (eles.length > 0) {
                    amount %= eles.length;
                    yield __await(yield* __asyncDelegator(__asyncValues([...eles.slice(-amount), ...eles.slice(0, -amount)])));
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Splits an iterator on an element.
     *
     * @param ele The element to split on.
     * @param limit The maximum number of chunks to make.
     * @returns The iterator with the split chunks.
     */
    split(elem, limit = Infinity) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_39() {
                const awaited = yield __await(elem);
                let foundEle = false;
                let chunks = 1;
                let eles = [];
                while (true) {
                    const val = yield __await(that.next());
                    if (val.done) {
                        if (foundEle) {
                            yield yield __await(eles);
                        }
                        break;
                    }
                    foundEle = true;
                    if (chunks < limit && val.value === awaited) {
                        yield yield __await(eles);
                        eles = [];
                        chunks++;
                    }
                    else {
                        eles.push(val.value);
                    }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Splits an iterator on a predicate.
     *
     * @param pred The predicate to split with.
     * @param limit The maximum number of chunks to make.
     * @returns The iterator with the split chunks.
     */
    splitPred(pred, limit = Infinity) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_40() {
                let foundEle = false;
                let chunks = 1;
                let eles = [];
                while (true) {
                    const val = yield __await(that.next());
                    if (val.done) {
                        if (foundEle) {
                            yield yield __await(eles);
                        }
                        break;
                    }
                    foundEle = true;
                    if (chunks < limit && (yield __await(pred(val.value)))) {
                        yield yield __await(eles);
                        eles = [];
                        chunks++;
                    }
                    else {
                        eles.push(val.value);
                    }
                }
            });
        }
        return new AsyncIterPlus(ret());
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
     * @returns The iterator with the split chunks.
     */
    splitInclusive(elem, limit = Infinity) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_41() {
                const awaited = yield __await(elem);
                let foundEle = false;
                let chunks = 1;
                let eles = [];
                while (true) {
                    const val = yield __await(that.next());
                    if (val.done) {
                        if (foundEle && eles.length > 0) {
                            yield yield __await(eles);
                        }
                        break;
                    }
                    foundEle = true;
                    eles.push(val.value);
                    if (chunks < limit && val.value === awaited) {
                        yield yield __await(eles);
                        eles = [];
                        chunks++;
                    }
                }
            });
        }
        return new AsyncIterPlus(ret());
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
     * @returns The iterator with the split chunks.
     */
    splitPredInclusive(pred, limit = Infinity) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_42() {
                let foundEle = false;
                let chunks = 1;
                let eles = [];
                while (true) {
                    const val = yield __await(that.next());
                    if (val.done) {
                        if (foundEle && eles.length > 0) {
                            yield yield __await(eles);
                        }
                        break;
                    }
                    foundEle = true;
                    eles.push(val.value);
                    if (chunks < limit && (yield __await(pred(val.value)))) {
                        yield yield __await(eles);
                        eles = [];
                        chunks++;
                    }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Returns an iterator yielding overlapping windows of the iterator.
     *
     * If there aren't enough elements to fill a window,
     * no windows will be yielded.
     *
     * @param windowSize The window size.
     * @param interval The increment between the starts of windows. Defaults to 1.
     * @returns An iterator that yields the windows.
     */
    windows(windowSize, interval = 1) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_43() {
                const eles = new CircularBuffer_1.CircularBuffer();
                for (let i = 0; i < windowSize; i++) {
                    const val = yield __await(that.next());
                    if (val.done) {
                        return yield __await(void 0);
                    }
                    eles.pushEnd(val.value);
                }
                while (true) {
                    yield yield __await(eles.toArray());
                    for (let i = 0; i < interval; i++) {
                        const val = yield __await(that.next());
                        if (val.done) {
                            return yield __await(void 0);
                        }
                        eles.popStart();
                        eles.pushEnd(val.value);
                    }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Removes elements of an iterator that are equal to the previous one.
     * @returns An iterator with no consecutive duplicates.
     */
    dedup() {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_44() {
                var e_38, _a;
                const val = yield __await(that.next());
                if (val.done) {
                    return yield __await(void 0);
                }
                yield yield __await(val.value);
                let prev = val.value;
                try {
                    for (var that_12 = __asyncValues(that), that_12_1; that_12_1 = yield __await(that_12.next()), !that_12_1.done;) {
                        const item = that_12_1.value;
                        if (item !== prev) {
                            yield yield __await(item);
                        }
                        prev = item;
                    }
                }
                catch (e_38_1) { e_38 = { error: e_38_1 }; }
                finally {
                    try {
                        if (that_12_1 && !that_12_1.done && (_a = that_12.return)) yield __await(_a.call(that_12));
                    }
                    finally { if (e_38) throw e_38.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Removes elements of an iterator that are equal to the previous one with a key.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @returns An iterator with no consecutive duplicates.
     */
    dedupWith(key) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_45() {
                var e_39, _a;
                const val = yield __await(that.next());
                if (val.done) {
                    return yield __await(void 0);
                }
                yield yield __await(val.value);
                let prev = yield __await(key(val.value));
                try {
                    for (var that_13 = __asyncValues(that), that_13_1; that_13_1 = yield __await(that_13.next()), !that_13_1.done;) {
                        const item = that_13_1.value;
                        const keyItem = yield __await(key(item));
                        if (keyItem !== prev) {
                            yield yield __await(item);
                        }
                        prev = keyItem;
                    }
                }
                catch (e_39_1) { e_39 = { error: e_39_1 }; }
                finally {
                    try {
                        if (that_13_1 && !that_13_1.done && (_a = that_13.return)) yield __await(_a.call(that_13));
                    }
                    finally { if (e_39) throw e_39.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Removes elements of an iterator that are equal to the previous one with a comparison function.
     *
     * @param cmp A function that checks if elements are equal.
     * @returns An iterator with no consecutive duplicates.
     */
    dedupBy(cmp) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_46() {
                var e_40, _a;
                const val = yield __await(that.next());
                if (val.done) {
                    return yield __await(void 0);
                }
                yield yield __await(val.value);
                let prev = val.value;
                try {
                    for (var that_14 = __asyncValues(that), that_14_1; that_14_1 = yield __await(that_14.next()), !that_14_1.done;) {
                        const item = that_14_1.value;
                        if (!cmp(prev, item)) {
                            yield yield __await(item);
                        }
                        prev = item;
                    }
                }
                catch (e_40_1) { e_40 = { error: e_40_1 }; }
                finally {
                    try {
                        if (that_14_1 && !that_14_1.done && (_a = that_14.return)) yield __await(_a.call(that_14));
                    }
                    finally { if (e_40) throw e_40.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Intersperses an element between every element of the iterator.
     *
     * @param elem The element to intersperse.
     * @returns The new iterator.
     */
    intersperse(elem) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_47() {
                var e_41, _a;
                const awaited = yield __await(elem);
                const val = yield __await(that.next());
                if (val.done) {
                    return yield __await(void 0);
                }
                yield yield __await(val.value);
                try {
                    for (var that_15 = __asyncValues(that), that_15_1; that_15_1 = yield __await(that_15.next()), !that_15_1.done;) {
                        const item = that_15_1.value;
                        yield yield __await(awaited);
                        yield yield __await(item);
                    }
                }
                catch (e_41_1) { e_41 = { error: e_41_1 }; }
                finally {
                    try {
                        if (that_15_1 && !that_15_1.done && (_a = that_15.return)) yield __await(_a.call(that_15));
                    }
                    finally { if (e_41) throw e_41.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Intersperses multiple elements between every element of the iterator.
     *
     * @param elems The elements to intersperse.
     * @returns The new iterator.
     */
    intersperseMultiple(elems) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_48() {
                var e_42, _a, e_43, _b;
                const awaited = [];
                try {
                    for (var elems_1 = __asyncValues(elems), elems_1_1; elems_1_1 = yield __await(elems_1.next()), !elems_1_1.done;) {
                        const item = elems_1_1.value;
                        awaited.push(item);
                    }
                }
                catch (e_42_1) { e_42 = { error: e_42_1 }; }
                finally {
                    try {
                        if (elems_1_1 && !elems_1_1.done && (_a = elems_1.return)) yield __await(_a.call(elems_1));
                    }
                    finally { if (e_42) throw e_42.error; }
                }
                const val = yield __await(that.next());
                if (val.done) {
                    return yield __await(void 0);
                }
                yield yield __await(val.value);
                try {
                    for (var that_16 = __asyncValues(that), that_16_1; that_16_1 = yield __await(that_16.next()), !that_16_1.done;) {
                        const item = that_16_1.value;
                        yield __await(yield* __asyncDelegator(__asyncValues(awaited)));
                        yield yield __await(item);
                    }
                }
                catch (e_43_1) { e_43 = { error: e_43_1 }; }
                finally {
                    try {
                        if (that_16_1 && !that_16_1.done && (_b = that_16.return)) yield __await(_b.call(that_16));
                    }
                    finally { if (e_43) throw e_43.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Joins an iterator of iterables with an element.
     *
     * @typeParam K The internal type.
     * @param elem The element to join with.
     * @returns The joined iterator.
     */
    join(elem) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_49() {
                var e_44, _a;
                const awaited = yield __await(elem);
                const val = yield __await(that.next());
                if (val.done) {
                    return yield __await(void 0);
                }
                yield __await(yield* __asyncDelegator(__asyncValues(val.value)));
                try {
                    for (var that_17 = __asyncValues(that), that_17_1; that_17_1 = yield __await(that_17.next()), !that_17_1.done;) {
                        const item = that_17_1.value;
                        yield yield __await(awaited);
                        yield __await(yield* __asyncDelegator(__asyncValues(item)));
                    }
                }
                catch (e_44_1) { e_44 = { error: e_44_1 }; }
                finally {
                    try {
                        if (that_17_1 && !that_17_1.done && (_a = that_17.return)) yield __await(_a.call(that_17));
                    }
                    finally { if (e_44) throw e_44.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Joins an iterator of iterables with multiple elements.
     *
     * @typeParam K The internal type.
     * @param elems The elements to intersperse.
     * @returns The joined iterator.
     */
    joinMultiple(elems) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_50() {
                var e_45, _a, e_46, _b;
                const awaited = [];
                try {
                    for (var elems_2 = __asyncValues(elems), elems_2_1; elems_2_1 = yield __await(elems_2.next()), !elems_2_1.done;) {
                        const item = elems_2_1.value;
                        awaited.push(item);
                    }
                }
                catch (e_45_1) { e_45 = { error: e_45_1 }; }
                finally {
                    try {
                        if (elems_2_1 && !elems_2_1.done && (_a = elems_2.return)) yield __await(_a.call(elems_2));
                    }
                    finally { if (e_45) throw e_45.error; }
                }
                const val = yield __await(that.next());
                if (val.done) {
                    return yield __await(void 0);
                }
                yield __await(yield* __asyncDelegator(__asyncValues(val.value)));
                try {
                    for (var that_18 = __asyncValues(that), that_18_1; that_18_1 = yield __await(that_18.next()), !that_18_1.done;) {
                        const item = that_18_1.value;
                        yield __await(yield* __asyncDelegator(__asyncValues(awaited)));
                        yield __await(yield* __asyncDelegator(__asyncValues(item)));
                    }
                }
                catch (e_46_1) { e_46 = { error: e_46_1 }; }
                finally {
                    try {
                        if (that_18_1 && !that_18_1.done && (_b = that_18.return)) yield __await(_b.call(that_18));
                    }
                    finally { if (e_46) throw e_46.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Converts an iterator of key-value pairs into an object.
     *
     * @typeParam K The key type.
     * @typeParam V The value type.
     * @param duplicate How to handle duplicate keys.
     * `"overwrite"` replaces values with the new value.
     * `"maintain"` maintains the old value.
     * `"error"` throws an error.
     * Defaults to `"overwrite"`.
     * @throws A RangeError if `duplicate` is `"error"` and a duplicate key is encountered.
     * @returns The generated object.
     */
    async toObject(duplicate = "overwrite") {
        var e_47, _a;
        const ret = {};
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const [key, val] = _c.value;
                if (duplicate !== "overwrite" && key in ret) {
                    if (duplicate === "error") {
                        throw new RangeError("Duplicate key encountered.");
                    }
                    else if (duplicate === "maintain") {
                        // do nothing
                    }
                    else {
                        ret[key] = val;
                    }
                }
                else {
                    ret[key] = val;
                }
            }
        }
        catch (e_47_1) { e_47 = { error: e_47_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_47) throw e_47.error; }
        }
        return ret;
    }
    /**
     * Converts an iterator of key-value pairs into a map.
     *
     * @typeParam K The key type.
     * @typeParam V The value type.
     * @param duplicate How to handle duplicate keys.
     * `"overwrite"` replaces values with the new value.
     * `"maintain"` maintains the old value.
     * `"error"` throws an error.
     * Defaults to `"overwrite"`.
     * @throws A RangeError if `duplicate` is `"error"` and a duplicate key is encountered.
     * @returns The generated map.
     */
    async toMap(duplicate = "overwrite") {
        var e_48, _a;
        const ret = new Map();
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const [key, val] = _c.value;
                if (duplicate !== "overwrite" && ret.has(key)) {
                    if (duplicate === "error") {
                        throw new RangeError("Duplicate key encountered.");
                    }
                    else if (duplicate === "maintain") {
                        // do nothing
                    }
                    else {
                        ret.set(key, val);
                    }
                }
                else {
                    ret.set(key, val);
                }
            }
        }
        catch (e_48_1) { e_48 = { error: e_48_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_48) throw e_48.error; }
        }
        return ret;
    }
    /**
     * Converts an iterator into a set.
     *
     * @returns The generated set.
     */
    async toSet() {
        var e_49, _a;
        const ret = new Set();
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const val = _c.value;
                ret.add(val);
            }
        }
        catch (e_49_1) { e_49 = { error: e_49_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_49) throw e_49.error; }
        }
        return ret;
    }
    /**
     * Converts an iterator into an array.
     *
     * @returns The generated array.
     */
    async toArray() {
        var e_50, _a;
        const ret = [];
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const item = _c.value;
                ret.push(item);
            }
        }
        catch (e_50_1) { e_50 = { error: e_50_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_50) throw e_50.error; }
        }
        return ret;
    }
    /**
     * Interleaves one or more iterables with this iterator.
     *
     * @param iters The iterables to interleave with this one.
     *
     * @returns The interleaved iterator, yielding elements in the iterators in order.
     */
    interleave(...iters) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_51() {
                const iterList = [
                    that,
                    ...iters.map((v) => v[Symbol.asyncIterator]()),
                ].map((v) => ({
                    done: false,
                    iter: v,
                }));
                while (true) {
                    let found = false;
                    for (const obj of iterList) {
                        if (obj.done) {
                            continue;
                        }
                        found = true;
                        const val = yield __await(obj.iter.next());
                        if (val.done) {
                            obj.done = true;
                            continue;
                        }
                        yield yield __await(val.value);
                    }
                    if (!found) {
                        break;
                    }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Runs a function for every element of the iterator, keeping track of an accumulator.
     *
     * @typeParam A The type of the accumulator.
     * @typeParam V The resulting type.
     * @param func The mapping function.
     * @param initializer The initial accumulator.
     * @returns The mapped iterator.
     */
    mapAccum(func, initializer) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_52() {
                var e_51, _a;
                let accum = initializer;
                try {
                    for (var that_19 = __asyncValues(that), that_19_1; that_19_1 = yield __await(that_19.next()), !that_19_1.done;) {
                        const elem = that_19_1.value;
                        const [newAccum, newElem] = yield __await(func(accum, elem));
                        yield yield __await(newElem);
                        accum = newAccum;
                    }
                }
                catch (e_51_1) { e_51 = { error: e_51_1 }; }
                finally {
                    try {
                        if (that_19_1 && !that_19_1.done && (_a = that_19.return)) yield __await(_a.call(that_19));
                    }
                    finally { if (e_51) throw e_51.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Counts the number of items in this iterator that match a predicate.
     *
     * @param pred The predicate function.
     * @returns The number of matched items in the iterator.
     */
    async countIf(pred) {
        var e_52, _a;
        let ret = 0;
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const item = _c.value;
                if (await pred(item)) {
                    ret++;
                }
            }
        }
        catch (e_52_1) { e_52 = { error: e_52_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_52) throw e_52.error; }
        }
        return ret;
    }
    scan(func, initializer) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_53() {
                var e_53, _a;
                let accum;
                if (initializer === undefined) {
                    const next = yield __await(that.next());
                    if (next.done) {
                        throw new TypeError("Scan of empty iterator with no initializer.");
                    }
                    accum = next.value;
                }
                else {
                    accum = initializer;
                }
                try {
                    for (var that_20 = __asyncValues(that), that_20_1; that_20_1 = yield __await(that_20.next()), !that_20_1.done;) {
                        const elem = that_20_1.value;
                        yield yield __await(accum);
                        accum = yield __await(func(accum, elem));
                    }
                }
                catch (e_53_1) { e_53 = { error: e_53_1 }; }
                finally {
                    try {
                        if (that_20_1 && !that_20_1.done && (_a = that_20.return)) yield __await(_a.call(that_20));
                    }
                    finally { if (e_53) throw e_53.error; }
                }
                yield yield __await(accum);
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Checks if this iterator is equal to another,
     * while they both yield elements, using a comparison function.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * However, if the first iterator terminates,
     * a value will still be yielded from the second so that `headEquals` is commutative.
     *
     * @typeParam O The type of the other iterable.
     * @param other Iterable to compare to.
     * @param cmp A function that checks if elements are equal.
     * @returns If the two iterators are equal.
     */
    async headEqualsBy(other, cmp) {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (a.done || b.done) {
                return true;
            }
            else {
                const eq = await cmp(a.value, b.value);
                if (!eq) {
                    return false;
                }
            }
        }
    }
    /**
     * Checks if this iterator is equal to another,
     * while they both yield elements, using a key.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * However, if the first iterator terminates,
     * a value will still be yielded from the second so that `headEquals` is commutative.
     *
     * @typeParam K The type of the key.
     * @param other Iterable to compare to.
     * @param key The key function.
     * @returns If the two iterators are equal.
     */
    async headEqualsWith(other, key) {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (a.done || b.done) {
                return true;
            }
            else {
                const eq = (await key(a.value)) === (await key(b.value));
                if (!eq) {
                    return false;
                }
            }
        }
    }
    /**
     * Checks if this iterator is equal to another,
     * while they both yield elements.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * However, if the first iterator terminates,
     * a value will still be yielded from the second so that `headEquals` is commutative.
     *
     * @param other Iterable to compare to.
     * @returns If the two iterators are equal.
     */
    async headEquals(other) {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (a.done || b.done) {
                return true;
            }
            const eq = a.value === b.value;
            if (!eq) {
                return false;
            }
        }
    }
    /**
     * Checks if this iterator is equal to another,
     * while the second iterator still yields elements, using a comparison function.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @typeParam O The type of the other iterable.
     * @param other Iterable to compare to.
     * @param cmp A function that checks if elements are equal.
     * @returns If the first iterator starts with the second iterator.
     */
    async hasPrefixBy(other, cmp) {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (b.done) {
                return true;
            }
            if (a.done) {
                return false;
            }
            const eq = await cmp(a.value, b.value);
            if (!eq) {
                return false;
            }
        }
    }
    /**
     * Checks if this iterator is equal to another,
     * while the second iterator still yields elements, with a key function.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @typeParam K The type of the key.
     * @param other Iterable to compare to.
     * @param key The key function.
     * @returns If the first iterator starts with the second iterator.
     */
    async hasPrefixWith(other, key) {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (b.done) {
                return true;
            }
            if (a.done) {
                return false;
            }
            const eq = (await key(a.value)) === (await key(b.value));
            if (!eq) {
                return false;
            }
        }
    }
    /**
     * Checks if this iterator is equal to another,
     * while the second iterator still yields elements.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @param other Iterable to compare to.
     * @returns If the first iterator starts with the second iterator.
     */
    async hasPrefix(other) {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (b.done) {
                return true;
            }
            if (a.done) {
                return false;
            }
            const eq = a.value === b.value;
            if (!eq) {
                return false;
            }
        }
    }
    /**
     * Checks if every element in this iterator is equal, using a comparison function.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @param cmp A function that checks if elements are equal.
     * @returns If every element is equal, or true if the iterator has one or less elements.
     */
    async allEqualBy(cmp) {
        const firstItem = await this.next();
        if (firstItem.done) {
            return true;
        }
        const first = firstItem.value;
        while (true) {
            const item = await this.next();
            if (item.done) {
                return true;
            }
            const eq = await cmp(item.value, first);
            if (!eq) {
                return false;
            }
        }
    }
    /**
     * Checks if every element in this iterator is equal, using a key function.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @returns If every element is equal, or true if the iterator has one or less elements.
     */
    async allEqualWith(key) {
        const firstItem = await this.next();
        if (firstItem.done) {
            return true;
        }
        const first = await key(firstItem.value);
        while (true) {
            const item = await this.next();
            if (item.done) {
                return true;
            }
            const eq = (await key(item.value)) === first;
            if (!eq) {
                return false;
            }
        }
    }
    /**
     * Checks if every element in this iterator is equal.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @returns If every element is equal, or true if the iterator has one or less elements.
     */
    async allEqual() {
        const firstItem = await this.next();
        if (firstItem.done) {
            return true;
        }
        const first = firstItem.value;
        while (true) {
            const item = await this.next();
            if (item.done) {
                return true;
            }
            const eq = item.value === first;
            if (!eq) {
                return false;
            }
        }
    }
    /**
     * Removes duplicates from an iterator, including non-consecutive ones, with a comparison function.
     *
     * Unlike `nubWith` and `nub`, this does not use a set, so it is significantly slower.
     *
     * @param cmp A function that checks if elements are equal.
     * @returns The nubbed iterator.
     */
    nubBy(cmp) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_54() {
                var e_54, _a;
                const seen = [];
                try {
                    outer: for (var that_21 = __asyncValues(that), that_21_1; that_21_1 = yield __await(that_21.next()), !that_21_1.done;) {
                        const elem = that_21_1.value;
                        for (const item of seen) {
                            if (yield __await(cmp(elem, item))) {
                                continue outer;
                            }
                        }
                        seen.push(elem);
                        yield yield __await(elem);
                    }
                }
                catch (e_54_1) { e_54 = { error: e_54_1 }; }
                finally {
                    try {
                        if (that_21_1 && !that_21_1.done && (_a = that_21.return)) yield __await(_a.call(that_21));
                    }
                    finally { if (e_54) throw e_54.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Removes duplicates from an iterator, including non-consecutive ones, with a key function.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @returns The nubbed iterator.
     */
    nubWith(key) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_55() {
                var e_55, _a;
                const seen = new Set();
                try {
                    for (var that_22 = __asyncValues(that), that_22_1; that_22_1 = yield __await(that_22.next()), !that_22_1.done;) {
                        const elem = that_22_1.value;
                        const keyVal = yield __await(key(elem));
                        if (seen.has(keyVal)) {
                            continue;
                        }
                        seen.add(keyVal);
                        yield yield __await(elem);
                    }
                }
                catch (e_55_1) { e_55 = { error: e_55_1 }; }
                finally {
                    try {
                        if (that_22_1 && !that_22_1.done && (_a = that_22.return)) yield __await(_a.call(that_22));
                    }
                    finally { if (e_55) throw e_55.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Removes duplicates from an iterator, including non-consecutive ones.
     *
     * @returns The nubbed iterator.
     */
    nub() {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_56() {
                var e_56, _a;
                const seen = new Set();
                try {
                    for (var that_23 = __asyncValues(that), that_23_1; that_23_1 = yield __await(that_23.next()), !that_23_1.done;) {
                        const elem = that_23_1.value;
                        if (seen.has(elem)) {
                            continue;
                        }
                        seen.add(elem);
                        yield yield __await(elem);
                    }
                }
                catch (e_56_1) { e_56 = { error: e_56_1 }; }
                finally {
                    try {
                        if (that_23_1 && !that_23_1.done && (_a = that_23.return)) yield __await(_a.call(that_23));
                    }
                    finally { if (e_56) throw e_56.error; }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Groups elements of an iterator together with a key function.
     *
     * @typeParam K The type of the key.
     * @param cmp A function that checks if elements are equal.
     * @returns An object mapping keys to arrays of matching items.
     */
    async group(key) {
        var e_57, _a;
        const ret = {};
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                const keyVal = await key(elem);
                if (keyVal in ret) {
                    ret[keyVal].push(elem);
                }
                else {
                    ret[keyVal] = [elem];
                }
            }
        }
        catch (e_57_1) { e_57 = { error: e_57_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_57) throw e_57.error; }
        }
        return ret;
    }
    /**
     * Tallies elements of an iterator together with a key function.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @returns An object mapping keys to the number of times they appeared.
     */
    async tallyWith(key) {
        var e_58, _a;
        const ret = {};
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                const keyVal = await key(elem);
                if (keyVal in ret) {
                    ret[keyVal] += 1;
                }
                else {
                    ret[keyVal] = 1;
                }
            }
        }
        catch (e_58_1) { e_58 = { error: e_58_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_58) throw e_58.error; }
        }
        return ret;
    }
    /**
     * Tallies elements of an iterator together.
     *
     * @returns An object mapping keys to the number of times they appeared.
     */
    async tally() {
        var e_59, _a;
        const ret = {};
        try {
            for (var _b = __asyncValues(this), _c; _c = await _b.next(), !_c.done;) {
                const elem = _c.value;
                if (elem in ret) {
                    ret[elem.toString()] += 1;
                }
                else {
                    ret[elem.toString()] = 1;
                }
            }
        }
        catch (e_59_1) { e_59 = { error: e_59_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_59) throw e_59.error; }
        }
        return ret;
    }
    /**
     * Globs elements of an iterator together, with a comparison function.
     *
     * @param cmp A function that checks if elements are equal.
     * @returns An iterator where every element is an array of consecutively equal elements.
     */
    globBy(cmp) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_57() {
                var e_60, _a;
                let curGlob = [];
                try {
                    for (var that_24 = __asyncValues(that), that_24_1; that_24_1 = yield __await(that_24.next()), !that_24_1.done;) {
                        const elem = that_24_1.value;
                        if (curGlob.length === 0 ||
                            (yield __await(cmp(curGlob[curGlob.length - 1], elem)))) {
                            curGlob.push(elem);
                        }
                        else {
                            yield yield __await(curGlob);
                            curGlob = [elem];
                        }
                    }
                }
                catch (e_60_1) { e_60 = { error: e_60_1 }; }
                finally {
                    try {
                        if (that_24_1 && !that_24_1.done && (_a = that_24.return)) yield __await(_a.call(that_24));
                    }
                    finally { if (e_60) throw e_60.error; }
                }
                if (curGlob.length > 0) {
                    yield yield __await(curGlob);
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Globs elements of an iterator together, with a key function.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @returns An iterator where every element is an array of consecutively equal elements.
     */
    globWith(key) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_58() {
                var e_61, _a;
                let curGlob = [];
                let prevKey = undefined;
                try {
                    for (var that_25 = __asyncValues(that), that_25_1; that_25_1 = yield __await(that_25.next()), !that_25_1.done;) {
                        const elem = that_25_1.value;
                        const elemKey = yield __await(key(elem));
                        if (curGlob.length === 0 || prevKey === elemKey) {
                            curGlob.push(elem);
                        }
                        else {
                            yield yield __await(curGlob);
                            curGlob = [elem];
                        }
                        prevKey = elemKey;
                    }
                }
                catch (e_61_1) { e_61 = { error: e_61_1 }; }
                finally {
                    try {
                        if (that_25_1 && !that_25_1.done && (_a = that_25.return)) yield __await(_a.call(that_25));
                    }
                    finally { if (e_61) throw e_61.error; }
                }
                if (curGlob.length > 0) {
                    yield yield __await(curGlob);
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Globs elements of an iterator together.
     *
     * @returns An iterator where every element is an array of consecutively equal elements.
     */
    glob() {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_59() {
                var e_62, _a;
                let curGlob = [];
                try {
                    for (var that_26 = __asyncValues(that), that_26_1; that_26_1 = yield __await(that_26.next()), !that_26_1.done;) {
                        const elem = that_26_1.value;
                        if (curGlob.length === 0 ||
                            elem === curGlob[curGlob.length - 1]) {
                            curGlob.push(elem);
                        }
                        else {
                            yield yield __await(curGlob);
                            curGlob = [elem];
                        }
                    }
                }
                catch (e_62_1) { e_62 = { error: e_62_1 }; }
                finally {
                    try {
                        if (that_26_1 && !that_26_1.done && (_a = that_26.return)) yield __await(_a.call(that_26));
                    }
                    finally { if (e_62) throw e_62.error; }
                }
                if (curGlob.length > 0) {
                    yield yield __await(curGlob);
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Steps through an iterator by a certain amount, starting from the first.
     *
     * A step of 2 would yield the first element, then the third, then the fifth, and so on.
     *
     * @param step The step size.
     * @returns An iterator that advances by the given step size.
     */
    stepBy(step) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_60() {
                while (true) {
                    const next = yield __await(that.next());
                    if (next.done) {
                        return yield __await(void 0);
                    }
                    yield yield __await(next.value);
                    for (let i = 0; i < step - 1; i++) {
                        const skipped = yield __await(that.next());
                        if (skipped.done) {
                            return yield __await(void 0);
                        }
                    }
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Drops elements from the iterator **from the end**.
     *
     * This uses memory proportional to the number of elements dropped,
     * as the iterator must look ahead and store elements to know that it has not reached the end.
     *
     * @param n The number of elements to drop.
     * @returns An iterator with the specified number of elements removed from the end.
     */
    dropEnd(n) {
        const that = this;
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_61() {
                if (n <= 0) {
                    yield __await(yield* __asyncDelegator(__asyncValues(that)));
                    return yield __await(void 0);
                }
                const lookahead = new CircularBuffer_1.CircularBuffer();
                for (let i = 0; i < n; i++) {
                    const next = yield __await(that.next());
                    if (next.done) {
                        return yield __await(void 0);
                    }
                    lookahead.pushEnd(next.value);
                }
                while (true) {
                    const next = yield __await(that.next());
                    if (next.done) {
                        return yield __await(void 0);
                    }
                    yield yield __await(lookahead.popStart());
                    lookahead.pushEnd(next.value);
                }
            });
        }
        return new AsyncIterPlus(ret());
    }
}
exports.AsyncIterPlus = AsyncIterPlus;
/**
 * An iterator with a `peek`. method that can look one element in advance.
 *
 * Do not instantiate this directly, instead use the `peekable` method in `IterPlus` or `AsyncIterPlus`.
 *
 * @typeParam T The item type of the iterator.
 */
class AsyncPeekable extends AsyncIterPlus {
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
    async next() {
        if (this.storedVal.has) {
            const ret = this.storedVal.val;
            this.storedVal = {
                has: false,
                val: undefined,
            };
            return ret;
        }
        return await this.internal.next();
    }
    /**
     * Peeks the next element in the iterator and does not consume it.
     *
     * @returns The next element as an iterator result.
     */
    async peek() {
        if (this.storedVal.has) {
            return this.storedVal.val;
        }
        this.storedVal = { has: true, val: await this.internal.next() };
        return this.storedVal.val;
    }
    /**
     * Peeks the next element in the iterator and does not consume it.
     *
     * Nullable version of `peek`.
     *
     * @returns The next element, or `null` if the iterator is finished.
     */
    async peekVal() {
        const res = await this.peek();
        if (res.done) {
            return IterPlus_2.nullVal;
        }
        return res.value;
    }
    /**
     * Checks if there's a value cached from a previous `peek`.
     *
     * Will return `true` even if the cached value is the end of the iterator.
     *
     * @returns If there's a value cached.
     */
    hasCached() {
        return this.storedVal.has;
    }
}
exports.AsyncPeekable = AsyncPeekable;
//# sourceMappingURL=AsyncIterPlus.js.map