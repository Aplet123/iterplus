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
 * A wrapper around an iterator to add additional functionality. The types intentionally ignore return value.
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
        function ret() { return __asyncGenerator(this, arguments, function* ret_1() { }); }
        return new AsyncIterPlus(ret());
    }
    /**
     * Generates an iterator that yields values from a function and ends once the function returns null.
     *
     * @param func The function to yield values, or null to end the iterator.
     * @returns The generated iterator.
     */
    static fromFunction(func) {
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_2() {
                while (true) {
                    const val = yield __await(func());
                    if (val === null) {
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
     * @param first The initial value.
     * @param func The function to generate new values.
     * @returns The generated iterator.
     */
    static successors(first, func) {
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_7() {
                while (true) {
                    if (first === null) {
                        break;
                    }
                    yield yield __await(first);
                    first = func(first);
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
     * @param data The iterable to cycle through.
     * @returns The generated iterator.
     */
    static cycle(data) {
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_8() {
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
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinations(data, count = data.length) {
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_9() {
                if (count > data.length || count <= 0) {
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
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Generates an iterator that iterates through lexicographically sorted combinations with repetition of a dataset.
     *
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinationsWithRepetition(data, count = data.length) {
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_10() {
                if (count <= 0) {
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
            });
        }
        return new AsyncIterPlus(ret());
    }
    /**
     * Generates an iterator that iterates through lexicographically sorted permutations without repetition of a dataset.
     *
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutations(data, count = data.length) {
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_11() {
                if (count > data.length || count <= 0) {
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
                console.log(indices, cycles);
                yield yield __await(indices.slice(0, count).map((v) => data[v]));
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
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutationsWithRepetition(data, count = data.length) {
        function ret() {
            return __asyncGenerator(this, arguments, function* ret_12() {
                if (count > data.length || count <= 0) {
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
                    if (i == indices.length) {
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
}
exports.AsyncIterPlus = AsyncIterPlus;
//# sourceMappingURL=AsyncIterPlus.js.map