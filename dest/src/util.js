"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncify = exports.liftAsync = exports.count = exports.range = exports.iterplus = void 0;
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
function range(start, dest, step) {
    let actualStep = step;
    let zero;
    if (typeof start === "bigint") {
        if (step === undefined) {
            actualStep = BigInt(1);
        }
        zero = BigInt(0);
    }
    else {
        if (step === undefined) {
            actualStep = 1;
        }
        zero = 0;
    }
    if (dest === undefined) {
        dest = start;
        start = zero;
    }
    function* ret() {
        let cur = start;
        while (true) {
            if (dest !== undefined) {
                if (actualStep < zero && cur <= dest) {
                    break;
                }
                if (actualStep >= zero && cur >= dest) {
                    break;
                }
            }
            yield cur;
            cur += actualStep;
        }
    }
    return new IterPlus_1.IterPlus(ret());
}
exports.range = range;
function count(start, step) {
    let actualStep = step;
    if (typeof start === "bigint" && step === undefined) {
        actualStep = BigInt(1);
    }
    else if (step === undefined) {
        actualStep = 1;
    }
    function* ret() {
        let cur = start;
        while (true) {
            yield cur;
            cur += actualStep;
        }
    }
    return new IterPlus_1.IterPlus(ret());
}
exports.count = count;
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