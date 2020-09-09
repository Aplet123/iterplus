import {IterPlus} from "../src/index";

function genYielder(): () => number | null {
    let count = 0;
    return function() {
        if (count == 5) {
            return null;
        }
        return ++count;
    };
}

function expectIter<T>(iter: Iterable<T>) {
    return expect(Array.from(iter));
}

describe("Static functions", () => {
    it(".empty works", () => {
        expect(Array.from(IterPlus.empty()).length).toBe(0);
    });

    it(".fromFunction works", () => {
        expect(Array.from(IterPlus.empty())).toBe(0);
    });
});