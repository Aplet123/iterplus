"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterplus = void 0;
const IterPlus_1 = require("./IterPlus");
const AsyncIterPlus_1 = require("./AsyncIterPlus");
/**
 * Generates an `IterPlus` from an iterable or async iterable.
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
//# sourceMappingURL=util.js.map