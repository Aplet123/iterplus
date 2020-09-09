"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
function genYielder() {
    let count = 0;
    return function () {
        if (count == 5) {
            return null;
        }
        return ++count;
    };
}
function expectIter(iter) {
    return expect(Array.from(iter));
}
describe("Static functions", () => {
    it(".empty works", () => {
        expect(Array.from(index_1.IterPlus.empty()).length).toBe(0);
    });
    it(".fromFunction works", () => {
        expect(Array.from(index_1.IterPlus.empty())).toBe(0);
    });
});
//# sourceMappingURL=iterplus.js.map