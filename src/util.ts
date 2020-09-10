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
