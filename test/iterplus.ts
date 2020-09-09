import {IterPlus} from "../src/index";

function genYielder(bound: number = 5): () => number | null {
    let count = 0;
    return function () {
        if (count == bound) {
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
        expectIter(IterPlus.empty()).toEqual([]);
    });

    it(".fromFunction works", () => {
        expectIter(IterPlus.fromFunction(genYielder())).toEqual([
            1,
            2,
            3,
            4,
            5,
        ]);
    });

    it(".onceWith works", () => {
        const mock = jest.fn(() => 5);
        const iter = IterPlus.onceWith(mock);
        expect(mock).not.toBeCalled();
        expectIter(iter).toEqual([5]);
    });

    it(".repeatWith works", () => {
        const vals = [];
        const iter = IterPlus.repeatWith(genYielder(Infinity));
        for (let i = 0; i < 5; i++) {
            vals.push(iter.next().value);
        }
        expect(vals).toEqual([1, 2, 3, 4, 5]);
    });

    it(".repeat works", () => {
        const vals = [];
        const iter = IterPlus.repeat(5);
        for (let i = 0; i < 5; i++) {
            vals.push(iter.next().value);
        }
        expect(vals).toEqual([5, 5, 5, 5, 5]);
    });

    it(".successors works", () => {
        const vals = [];
        const mock = jest.fn((x: number) => (x < 5 ? x + 1 : null));
        const iter = IterPlus.successors(1, mock);
        for (let i = 0; i < 5; i++) {
            vals.push(iter.next().value);
            expect(mock).toBeCalledTimes(i);
        }
        expect(iter.next().done).toBe(true);
        expect(vals).toEqual([1, 2, 3, 4, 5]);
    });

    it(".cycle works", () => {
        const vals = [];
        const iter = IterPlus.cycle([1, 2, 3]);
        for (let i = 0; i < 9; i++) {
            vals.push(iter.next().value);
        }
        expect(vals).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3]);
    });

    it(".combinations works", () => {
        const iter = IterPlus.combinations([1, 2, 3, 4, 5], 3);
        expectIter(iter).toEqual([
            [1, 2, 3],
            [1, 2, 4],
            [1, 2, 5],
            [1, 3, 4],
            [1, 3, 5],
            [1, 4, 5],
            [2, 3, 4],
            [2, 3, 5],
            [2, 4, 5],
            [3, 4, 5],
        ]);
    });

    it(".combinationsWithRepetition works", () => {
        const iter = IterPlus.combinationsWithRepetition([1, 2, 3], 4);
        expectIter(iter).toEqual([
            [1, 1, 1, 1],
            [1, 1, 1, 2],
            [1, 1, 1, 3],
            [1, 1, 2, 2],
            [1, 1, 2, 3],
            [1, 1, 3, 3],
            [1, 2, 2, 2],
            [1, 2, 2, 3],
            [1, 2, 3, 3],
            [1, 3, 3, 3],
            [2, 2, 2, 2],
            [2, 2, 2, 3],
            [2, 2, 3, 3],
            [2, 3, 3, 3],
            [3, 3, 3, 3],
        ]);
    });

    it(".permutations works", () => {
        const iter = IterPlus.permutations([1, 2, 3, 4], 3);
        expectIter(iter).toEqual([
            [1, 2, 3],
            [1, 2, 4],
            [1, 3, 2],
            [1, 3, 4],
            [1, 4, 2],
            [1, 4, 3],
            [2, 1, 3],
            [2, 1, 4],
            [2, 3, 1],
            [2, 3, 4],
            [2, 4, 1],
            [2, 4, 3],
            [3, 1, 2],
            [3, 1, 4],
            [3, 2, 1],
            [3, 2, 4],
            [3, 4, 1],
            [3, 4, 2],
            [4, 1, 2],
            [4, 1, 3],
            [4, 2, 1],
            [4, 2, 3],
            [4, 3, 1],
            [4, 3, 2],
        ]);
    });

    it(".permutationsWithRepetition works", () => {
        const iter = IterPlus.permutationsWithRepetition([1, 2, 3, 4], 2);
        expectIter(iter).toEqual([
            [1, 1],
            [1, 2],
            [1, 3],
            [1, 4],
            [2, 1],
            [2, 2],
            [2, 3],
            [2, 4],
            [3, 1],
            [3, 2],
            [3, 3],
            [3, 4],
            [4, 1],
            [4, 2],
            [4, 3],
            [4, 4],
        ]);
    });
});
