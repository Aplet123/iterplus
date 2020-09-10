import { IterPlus } from "./IterPlus";
import { AsyncIterPlus } from "./AsyncIterPlus";
/**
 * Generates an `IterPlus` from an iterable or async iterable.
 *
 * @typeParam T The iterable/async iterable to upgrade.
 * @param iter The iterable to upgrade.
 */
export declare function iterplus<T>(iter: T): T extends Iterable<infer I> ? IterPlus<I> : T extends AsyncIterable<infer I> ? AsyncIterPlus<I> : IterPlus<unknown> | AsyncIterPlus<unknown>;
export declare function range(start: bigint, dest?: bigint, step?: bigint): IterPlus<bigint>;
export declare function range(start: number, dest?: number, step?: number): IterPlus<number>;
/**
 * Lifts an iterable to an async iterable that immediately resolves promises.
 *
 * @typeParam T The item of the iterator.
 * @param iterable The iterable to lift.
 * @returns The lifted iterator.
 */
export declare function liftAsync<T>(iterable: Iterable<T>): AsyncIterPlus<T>;
/**
 * Lifts an function to an async function that immediately resolves the return value.
 *
 * @typeParam A The arguments of the function.
 * @typeParam R The return value of the function.
 * @param func The function to lift.
 * @returns The lifted function.
 */
export declare function asyncify<A extends unknown[], R>(func: (...args: A) => R): (...args: A) => Promise<R>;
