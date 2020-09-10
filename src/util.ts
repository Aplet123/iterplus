import {IterPlus, canIter} from "./IterPlus";
import {AsyncIterPlus, canAsyncIter} from "./AsyncIterPlus";

/**
 * The return type of `iterplus`.
 */
type UpgradeIter<T> = T extends Iterable<infer I>
    ? IterPlus<I>
    : T extends AsyncIterable<infer I>
    ? AsyncIterPlus<I>
    : IterPlus<unknown> | AsyncIterPlus<unknown>;

/**
 * Generates an `IterPlus` from an iterable or async iterable.
 *
 * @typeParam T The iterable/async iterable to upgrade.
 * @param iter The iterable to upgrade.
 */
export function iterplus<T>(
    iter: T
): T extends Iterable<infer I>
    ? IterPlus<I>
    : T extends AsyncIterable<infer I>
    ? AsyncIterPlus<I>
    : IterPlus<unknown> | AsyncIterPlus<unknown> {
    if (canIter(iter)) {
        return new IterPlus(iter[Symbol.iterator]()) as UpgradeIter<T>;
    } else if (canAsyncIter(iter)) {
        return new AsyncIterPlus(iter[Symbol.asyncIterator]()) as UpgradeIter<
            T
        >;
    } else {
        throw new Error("Object is not an iterable.");
    }
}

/**
 * Creates an inclusive-exclusive range iterator that's useful for loops.
 *
 * @param start The starting point.
 * @param dest The ending point, exclusive.
 * @param step The step, can be negative to go down.
 */
// @ts-ignore
export declare function range(
    start: bigint,
    dest?: bigint,
    step?: bigint
): IterPlus<bigint>;
/**
 * Creates an inclusive-exclusive range iterator that's useful for loops.
 *
 * @param start The starting point.
 * @param dest The ending point, exclusive.
 * @param step The step, can be negative to go down.
 */
// @ts-ignore
export declare function range(
    start: number,
    dest?: number,
    step?: number
): IterPlus<number>;
export function range<T>(start: T, dest?: T, step?: T): IterPlus<T> {
    let actualStep: any = step;
    let zero: any;
    if (typeof start === "bigint") {
        if (step === undefined) {
            actualStep = BigInt(1);
        }
        zero = BigInt(0);
    } else {
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
    return new IterPlus(ret());
}

/**
 * Creates an iterator that keeps adding values to a starting point.
 *
 * @param start The starting point.
 * @param step The step.
 */
// @ts-ignore
export declare function count(start: bigint, step?: bigint): IterPlus<bigint>;
/**
 * Creates an iterator that keeps adding values to a starting point.
 *
 * @param start The starting point.
 * @param step The step.
 */
// @ts-ignore
export declare function count(start: number, step?: number): IterPlus<number>;
export function count<T>(start: T, step?: T): IterPlus<T> {
    let actualStep: any = step;
    if (typeof start === "bigint" && step === undefined) {
        actualStep = BigInt(1);
    } else if (step === undefined) {
        actualStep = 1;
    }
    function* ret() {
        let cur = start;
        while (true) {
            yield cur;
            cur += actualStep;
        }
    }
    return new IterPlus(ret());
}

/**
 * Lifts an iterable to an async iterable that immediately resolves promises.
 *
 * @typeParam T The item of the iterator.
 * @param iterable The iterable to lift.
 * @returns The lifted iterator.
 */
export function liftAsync<T>(iterable: Iterable<T>): AsyncIterPlus<T> {
    const iter = iterable[Symbol.iterator]();
    return new AsyncIterPlus({
        next() {
            return Promise.resolve(iter.next());
        },
    });
}

/**
 * Lifts an function to an async function that immediately resolves the return value.
 *
 * @typeParam A The arguments of the function.
 * @typeParam R The return value of the function.
 * @param func The function to lift.
 * @returns The lifted function.
 */
export function asyncify<A extends unknown[], R>(
    func: (...args: A) => R
): (...args: A) => Promise<R> {
    return async function (...args: A) {
        return func(...args);
    };
}
