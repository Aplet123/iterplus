"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncify = exports.liftAsync = exports.iterplus = void 0;
const IterPlus_1 = require("./IterPlus");
const AsyncIterPlus_1 = require("./AsyncIterPlus");
/**
 * Generates an `IterPlus` from an iterable or async iterable.
 *
 * @typeParam T The iterable/async iterable to upgrade.
 * @param iter The iterable to upgrade.
 */
function iterplus(iter) {
    if (IterPlus_1.canIter(iter)) {
        return new IterPlus_1.IterPlus(iter[Symbol.iterator]());
    }
    else if (AsyncIterPlus_1.canAsyncIter(iter)) {
        return new AsyncIterPlus_1.AsyncIterPlus(iter[Symbol.asyncIterator]());
    }
    else {
        throw new Error("Object is not an iterable.");
    }
}
exports.iterplus = iterplus;
/**
 * Lifts an iterable to an async iterable that immediately resolves promises.
 *
 * @typeParam T The item of the iterator.
 * @param iterable The iterable to lift.
 * @returns The lifted iterator.
 */
function liftAsync(iterable) {
    const iter = iterable[Symbol.iterator]();
    return new AsyncIterPlus_1.AsyncIterPlus({
        next() {
            return Promise.resolve(iter.next());
        },
    });
}
exports.liftAsync = liftAsync;
/**
 * Lifts an function to an async function that immediately resolves the return value.
 *
 * @typeParam A The arguments of the function.
 * @typeParam R The return value of the function.
 * @param func The function to lift.
 * @returns The lifted function.
 */
function asyncify(func) {
    return async function (...args) {
        return func(...args);
    };
}
exports.asyncify = asyncify;
//# sourceMappingURL=util.js.map