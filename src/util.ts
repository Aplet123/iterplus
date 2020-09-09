import {IterPlus, canIter} from "./IterPlus";
import {AsyncIterPlus, canAsyncIter} from "./AsyncIterPlus";

/**
 * Generates an `IterPlus` from an iterable or async iterable.
 * @param iter The iterable to upgrade.
 */
export function iterplus(iter: any) {
    if (canIter(iter)) {
        return new IterPlus(iter[Symbol.iterator]());
    } else if (canAsyncIter(iter)) {
        return new AsyncIterPlus(iter[Symbol.asyncIterator]());
    } else {
        throw new Error("Object is not an iterable.");
    }
}
