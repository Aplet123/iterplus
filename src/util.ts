import {IterPlus} from "./IterPlus";
import {AsyncIterPlus} from "./AsyncIterPlus";

/**
 * A promise or a value that can be awaited.
 */
export type PromiseOrValue<T> = T | Promise<T>;

/**
 * Generates an `IterPlus` from an iterable.
 *
 * @typeParam T The iteration type.
 * @param iter The iterable to upgrade.
 */
export function iterplus<T>(iter: Iterable<T>): IterPlus<T> {
    return new IterPlus(iter[Symbol.iterator]());
}

/**
 * Generates an `AsyncIterPlus` from an async iterable.
 *
 * @typeParam T The iteration type.
 * @param iter The async iterable to upgrade.
 */
export function asyncIterplus<T>(iter: AsyncIterable<T>): AsyncIterPlus<T> {
    return new AsyncIterPlus(iter[Symbol.asyncIterator]());
}

/**
 * Creates an inclusive-exclusive range iterator that's useful for loops.
 *
 * @param start The starting point.
 * @param dest The ending point, exclusive.
 * @param step The step, can be negative to go down.
 */
export function range(
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
export function range(
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
export function count(start: bigint, step?: bigint): IterPlus<bigint>;
/**
 * Creates an iterator that keeps adding values to a starting point.
 *
 * @param start The starting point.
 * @param step The step.
 */
export function count(start: number, step?: number): IterPlus<number>;
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
