import { IterPlus } from "./IterPlus";
import { AsyncIterPlus } from "./AsyncIterPlus";
/**
 * Generates an `IterPlus` from an iterable or async iterable.
 * @param iter The iterable to upgrade.
 */
export declare function iterplus<T>(iter: T): T extends Iterable<infer I> ? IterPlus<I> : T extends AsyncIterable<infer I> ? AsyncIterPlus<I> : IterPlus<unknown> | AsyncIterPlus<unknown>;
