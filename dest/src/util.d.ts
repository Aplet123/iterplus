import { IterPlus } from "./IterPlus";
import { AsyncIterPlus } from "./AsyncIterPlus";
/**
 * Generates an `IterPlus` from an iterable or async iterable.
 * @param iter The iterable to upgrade.
 */
export declare function iterplus(iter: any): IterPlus<unknown> | AsyncIterPlus<unknown>;
