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
