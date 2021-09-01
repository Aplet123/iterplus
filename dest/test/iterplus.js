"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
function genYielder(bound = 5) {
    let count = 0;
    return function () {
        if (count === bound) {
            return index_1.nullVal;
        }
        return ++count;
    };
}
function expectIter(iter) {
    return expect(Array.from(iter));
}
function expectAllEqual(...args) {
    for (let i = 0; i < args.length - 1; i++) {
        expect(args[i]).toEqual(args[i + 1]);
    }
}
describe("CircularBuffer", () => {
    it("works", () => {
        const buf = new index_1.CircularBuffer([1, 2, 3]);
        expectAllEqual(buf.toArray(), Array.from(buf), [1, 2, 3]);
        expect(buf.size()).toBe(buf.toArray().length);
        buf.clear();
        buf.pushEnd(1);
        buf.pushEnd(2);
        buf.pushEnd(3);
        buf.pushEnd(4);
        expectAllEqual(buf.toArray(), Array.from(buf), [1, 2, 3, 4]);
        expect(buf.size()).toBe(buf.toArray().length);
        buf.pushStart(0);
        expectAllEqual(buf.toArray(), Array.from(buf), [0, 1, 2, 3, 4]);
        expect(buf.size()).toBe(buf.toArray().length);
        for (let i = 0; i < buf.size(); i++) {
            expect(buf.get(i)).toBe(i);
            buf.set(i, buf.get(i) + 5);
        }
        expect(() => buf.get(-1)).toThrow();
        expect(() => buf.get(5)).toThrow();
        expect(() => buf.set(-1, 10)).toThrow();
        expect(() => buf.set(5, 10)).toThrow();
        expectAllEqual(buf.toArray(), Array.from(buf), [0, 1, 2, 3, 4].map((x) => x + 5));
        expect(buf.size()).toBe(buf.toArray().length);
        buf.popStart();
        buf.popStart();
        expectAllEqual(buf.toArray(), Array.from(buf), [2, 3, 4].map((x) => x + 5));
        expect(buf.size()).toBe(buf.toArray().length);
        buf.popEnd();
        buf.popEnd();
        expectAllEqual(buf.toArray(), Array.from(buf), [2].map((x) => x + 5));
        expect(buf.size()).toBe(buf.toArray().length);
        buf.pushEnd(3);
        expect(buf.getEnd()).toBe(3);
        buf.setEnd(buf.getEnd() + 5);
        expect(buf.getEnd()).toBe(3 + 5);
        expectAllEqual(buf.toArray(), Array.from(buf), [2, 3].map((x) => x + 5));
        expect(buf.size()).toBe(buf.toArray().length);
        buf.popEnd();
        buf.popEnd();
        expectAllEqual(buf.toArray(), Array.from(buf), []);
        expect(buf.size()).toBe(buf.toArray().length);
        expect(() => buf.popEnd()).toThrow();
        expect(() => buf.popStart()).toThrow();
        expect(() => buf.getEnd()).toThrow();
        const arr = [];
        for (let i = 0; i < 50; i++) {
            buf.pushEnd(i);
            arr.push(i);
            buf.pushStart(-i);
            arr.unshift(-i);
        }
        expectAllEqual(buf.toArray(), Array.from(buf), arr);
    });
});
describe("Utility functions", () => {
    it("range works", () => {
        expectIter(index_1.range(1, 5)).toEqual([1, 2, 3, 4]);
        expectIter(index_1.range(1, 1)).toEqual([]);
        expectIter(index_1.range(2, 1)).toEqual([]);
        expectIter(index_1.range(5, 1, -1)).toEqual([5, 4, 3, 2]);
        expectIter(index_1.range(1, 6, 2)).toEqual([1, 3, 5]);
        expectIter(index_1.range(1, 3, 0.5)).toEqual([1, 1.5, 2, 2.5]);
        expectIter(index_1.range(5)).toEqual([0, 1, 2, 3, 4]);
        expectIter(index_1.range(BigInt(1), BigInt(5))).toEqual([1, 2, 3, 4].map((v) => BigInt(v)));
    });
    it("count works", () => {
        expectIter(index_1.count(0).take(5)).toEqual([0, 1, 2, 3, 4]);
        expectIter(index_1.count(5, -1).take(5)).toEqual([5, 4, 3, 2, 1]);
        expectIter(index_1.count(BigInt(3)).take(5)).toEqual([3, 4, 5, 6, 7].map((v) => BigInt(v)));
        expectIter(index_1.count(BigInt(3), BigInt(-1)).take(5)).toEqual([3, 2, 1, 0, -1].map((v) => BigInt(v)));
    });
});
describe("Static functions", () => {
    it(".empty works", () => {
        expectIter(index_1.IterPlus.empty()).toEqual([]);
    });
    it(".fromFunction works", () => {
        expectIter(index_1.IterPlus.fromFunction(genYielder())).toEqual([
            1,
            2,
            3,
            4,
            5,
        ]);
    });
    it(".onceWith works", () => {
        const mock = jest.fn(() => 5);
        const iter = index_1.IterPlus.onceWith(mock);
        expect(mock).not.toBeCalled();
        expectIter(iter).toEqual([5]);
    });
    it(".repeatWith works", () => {
        const vals = [];
        const iter = index_1.IterPlus.repeatWith(genYielder(Infinity));
        for (let i = 0; i < 5; i++) {
            vals.push(iter.next().value);
        }
        expect(vals).toEqual([1, 2, 3, 4, 5]);
    });
    it(".repeat works", () => {
        const vals = [];
        const iter = index_1.IterPlus.repeat(5);
        for (let i = 0; i < 5; i++) {
            vals.push(iter.next().value);
        }
        expect(vals).toEqual([5, 5, 5, 5, 5]);
    });
    it(".successors works", () => {
        const vals = [];
        const mock = jest.fn((x) => (x < 5 ? x + 1 : index_1.nullVal));
        const iter = index_1.IterPlus.successors(1, mock);
        for (let i = 0; i < 5; i++) {
            vals.push(iter.next().value);
            expect(mock).toBeCalledTimes(i);
        }
        expect(iter.next().done).toBe(true);
        expect(vals).toEqual([1, 2, 3, 4, 5]);
    });
    it(".unfold works", () => {
        const vals = [];
        const mock = jest.fn((x) => x <= 5 ? [2 * x, x + 1] : index_1.nullVal);
        const iter = index_1.IterPlus.unfold(mock, 1);
        for (let i = 0; i < 5; i++) {
            vals.push(iter.next().value);
            expect(mock).toBeCalledTimes(i + 1);
        }
        expect(iter.next().done).toBe(true);
        expect(vals).toEqual([2, 4, 6, 8, 10]);
    });
    it(".cycle works", () => {
        const vals = [];
        const iter = index_1.IterPlus.cycle([1, 2, 3]);
        for (let i = 0; i < 9; i++) {
            vals.push(iter.next().value);
        }
        expect(vals).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3]);
    });
    it(".combinations works", () => {
        const iter = index_1.IterPlus.combinations([1, 2, 3, 4, 5], 3);
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
        const iter = index_1.IterPlus.combinationsWithRepetition([1, 2, 3], 4);
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
        const iter = index_1.IterPlus.permutations([1, 2, 3, 4], 3);
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
        const iter = index_1.IterPlus.permutationsWithRepetition([1, 2, 3, 4], 2);
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
    it(".product works", () => {
        const iter = index_1.IterPlus.product([1, 2], [3, 4], [5, 6]);
        expectIter(iter).toEqual([
            [1, 3, 5],
            [1, 3, 6],
            [1, 4, 5],
            [1, 4, 6],
            [2, 3, 5],
            [2, 3, 6],
            [2, 4, 5],
            [2, 4, 6],
        ]);
    });
    it(".powerset works", () => {
        const iter = index_1.IterPlus.powerset([1, 2, 3]);
        expectIter(iter).toEqual([
            [],
            [1],
            [2],
            [3],
            [1, 2],
            [1, 3],
            [2, 3],
            [1, 2, 3],
        ]);
    });
});
describe("Methods", () => {
    describe(".nextVal", () => {
        it("works normally", () => {
            const iter = index_1.iterplus([1, 2, 3]);
            expect(iter.nextVal()).toBe(1);
            expect(iter.nextVal()).toBe(2);
            expect(iter.nextVal()).toBe(3);
            expect(iter.nextVal()).toBe(null);
        });
    });
    describe(".every", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 4, 5]).every((x) => x < 10)).toBe(true);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.every((x) => x < 3)).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".some", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 4, 5]).some((x) => x === 7)).toBe(false);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.some((x) => x > 2)).toBe(true);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".concat", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3]).concat([4, 5, 6])).toEqual([
                1,
                2,
                3,
                4,
                5,
                6,
            ]);
        });
    });
    describe(".compareBy", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3]).compareBy([1, 2, 4], (a, b) => b - a)).toBe(1);
            expect(index_1.iterplus([1, 2, 3]).compareBy([1, 2, 3], (a, b) => b - a)).toBe(0);
            expect(index_1.iterplus([1, 2, 3]).compareBy([1, 1, 3], (a, b) => b - a)).toBe(-1);
            expect(index_1.iterplus([1, 2, 3, 4]).compareBy([1, 2, 3], (a, b) => b - a)).toBe(1);
            expect(index_1.iterplus([1, 2, 3]).compareBy([1, 2, 3, 4], (a, b) => b - a)).toBe(-1);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.compareBy([1, 2, 4], (a, b) => b - a)).toBe(1);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".compareWith", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3]).compareWith([1, 2, 4], (x) => -x)).toBe(1);
            expect(index_1.iterplus([1, 2, 3]).compareWith([1, 2, 3], (x) => -x)).toBe(0);
            expect(index_1.iterplus([1, 2, 3]).compareWith([1, 1, 3], (x) => -x)).toBe(-1);
            expect(index_1.iterplus([1, 2, 3, 4]).compareWith([1, 2, 3], (x) => -x)).toBe(1);
            expect(index_1.iterplus([1, 2, 3]).compareWith([1, 2, 3, 4], (x) => -x)).toBe(-1);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.compareWith([1, 2, 4], (x) => -x)).toBe(1);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".compare", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3]).compare([1, 2, 4])).toBe(-1);
            expect(index_1.iterplus([1, 2, 3]).compare([1, 2, 3])).toBe(0);
            expect(index_1.iterplus([1, 2, 3]).compare([1, 1, 3])).toBe(1);
            expect(index_1.iterplus([1, 2, 3, 4]).compare([1, 2, 3])).toBe(1);
            expect(index_1.iterplus([1, 2, 3]).compare([1, 2, 3, 4])).toBe(-1);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.compare([1, 2, 4])).toBe(-1);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".collect", () => {
        it("works normally", () => {
            expect(index_1.iterplus([2, 1, 3]).collect()).toEqual([2, 1, 3]);
        });
    });
    describe(".collectWith", () => {
        it("works normally", () => {
            expect(index_1.iterplus([2, 1, 3]).collectWith(Array.from)).toEqual([2, 1, 3]);
            expect(index_1.iterplus([2, 1, 3]).collectWith((x) => new Set(x))).toEqual(new Set([2, 1, 3]));
        });
    });
    describe(".construct", () => {
        it("works normally", () => {
            expect(index_1.iterplus([2, 1, 3]).construct(Set)).toEqual(new Set([2, 1, 3]));
            expect(index_1.iterplus([["a", 1], ["b", 2]]).construct(Map)).toEqual(new Map([["a", 1], ["b", 2]]));
        });
    });
    describe(".count", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 4]).count()).toBe(4);
        });
    });
    describe(".enumerate", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus(["a", "b", "c"]).enumerate()).toEqual([
                [0, "a"],
                [1, "b"],
                [2, "c"],
            ]);
        });
    });
    describe(".equalsBy", () => {
        it("works normally", () => {
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo"]).equalsBy(["a", "b", "c"], (a, b) => a === b + "_foo")).toBe(true);
            expect(index_1.iterplus(["a_foo", "b_bar", "c_foo"]).equalsBy(["a", "b", "c"], (a, b) => a === b + "_foo")).toBe(false);
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo", "d_foo"]).equalsBy(["a", "b", "c"], (a, b) => a === b + "_foo")).toBe(false);
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo"]).equalsBy(["a", "b", "c", "d"], (a, b) => a === b + "_foo")).toBe(false);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.equalsBy([0, 1, 3, 9, 10], (a, b) => a === b + 1)).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".equalsWith", () => {
        it("works normally", () => {
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo"]).equalsWith(["a", "b", "c"], (x) => (x.endsWith("_foo") ? x : x + "_foo"))).toBe(true);
            expect(index_1.iterplus(["a_foo", "b_bar", "c_foo"]).equalsWith(["a", "b", "c"], (x) => (x.endsWith("_foo") ? x : x + "_foo"))).toBe(false);
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo", "d_foo"]).equalsWith(["a", "b", "c"], (x) => (x.endsWith("_foo") ? x : x + "_foo"))).toBe(false);
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo"]).equalsWith(["a", "b", "c", "d"], (x) => (x.endsWith("_foo") ? x : x + "_foo"))).toBe(false);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.equalsWith([101, 102, 104, 109, 110], (x) => x > 100 ? x - 100 : x)).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".equals", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3]).equals([1, 2, 3])).toBe(true);
            expect(index_1.iterplus([1, 2, 3]).equals([1, 2, 4])).toBe(false);
            expect(index_1.iterplus([1, 2, 3, 4]).equals([1, 2, 3])).toBe(false);
            expect(index_1.iterplus([1, 2, 3]).equals([1, 2, 3, 4])).toBe(false);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.equals([1, 2, 5, 6, 7])).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".filter", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).filter((x) => x % 2 === 0)).toEqual([2, 4]);
        });
    });
    describe(".filterMap", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([
                [1, 3],
                [7, 2],
                [8, 3],
                [1, 4],
                [9, 5],
            ]).filterMap((x) => { var _a; return (_a = x.find((v) => v % 2 === 0)) !== null && _a !== void 0 ? _a : index_1.nullVal; })).toEqual([2, 8, 4]);
        });
    });
    describe(".find", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 4, 5]).find((x) => x === 3)).toBe(3);
            expect(index_1.iterplus([1, 2, 3, 4, 5]).find((x) => x === 6)).toBe(index_1.nullVal);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.find((x) => x === 3)).toBe(3);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".findMap", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 4, 5]).findMap((x) => x === 3 ? "foo" : index_1.nullVal)).toBe("foo");
            expect(index_1.iterplus([1, 2, 3, 4, 5]).findMap((x) => x === 6 ? "foo" : index_1.nullVal)).toBe(index_1.nullVal);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.findMap((x) => (x === 3 ? "foo" : index_1.nullVal))).toBe("foo");
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".flatten", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([[1, 2], [3]]).flatten()).toEqual([1, 2, 3]);
        });
    });
    describe(".map", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3]).map((v) => v + 1)).toEqual([
                2,
                3,
                4,
            ]);
        });
        it("is lazy", () => {
            const mock = jest.fn((v) => v + 1);
            const iter = index_1.iterplus([1, 2, 3]).map(mock);
            expect(mock).toBeCalledTimes(0);
            expect(iter.next().value).toBe(2);
            expect(mock).toBeCalledTimes(1);
            expectIter(iter).toEqual([3, 4]);
            expect(mock).toBeCalledTimes(3);
        });
    });
    describe(".starmap", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([
                [3, 2],
                [4, 3],
                [1, 1],
            ]).starmap(Math.pow)).toEqual([9, 64, 1]);
        });
        it("is lazy", () => {
            const mock = jest.fn(Math.pow);
            const iter = index_1.iterplus([
                [3, 2],
                [4, 3],
                [1, 1],
            ]).starmap(mock);
            expect(mock).toBeCalledTimes(0);
            expect(iter.next().value).toBe(9);
            expect(mock).toBeCalledTimes(1);
            expectIter(iter).toEqual([64, 1]);
            expect(mock).toBeCalledTimes(3);
        });
    });
    describe(".flatMap", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3]).flatMap((v) => [v, v + 10])).toEqual([1, 11, 2, 12, 3, 13]);
        });
    });
    describe(".reduce", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 4]).reduce((a, b) => a * 10 + b)).toBe(1234);
            expect(index_1.iterplus([1, 2, 3, 4]).reduce((a, b) => a * 10 + b, 9)).toBe(91234);
            expect(index_1.iterplus([]).reduce((a, _) => a, "foo")).toBe("foo");
        });
        it("errors on empty array", () => {
            expect(() => index_1.iterplus([]).reduce((a, _) => a)).toThrow(TypeError);
        });
    });
    describe(".forEach", () => {
        it("works normally", () => {
            const tot = [];
            index_1.iterplus([1, 2, 3]).forEach((v) => tot.push(v));
            expect(tot).toEqual([1, 2, 3]);
        });
    });
    describe(".fuse", () => {
        it("works normally", () => {
            let count = 0;
            const fused = new index_1.IterPlus({
                next() {
                    if (count === 1) {
                        count++;
                        return {
                            done: true,
                            value: undefined,
                        };
                    }
                    return {
                        done: false,
                        value: count++,
                    };
                },
            }).fuse();
            expect(fused.next().done).toBe(false);
            expect(fused.next().done).toBe(true);
            expect(fused.next().done).toBe(true);
            expect(fused.next().done).toBe(true);
        });
    });
    describe(".inspect", () => {
        it("works normally", () => {
            const tot = [];
            const inspected = index_1.iterplus([1, 2, 3]).inspect((v) => {
                tot.push(v + 10);
                return "this value doesn't matter";
            });
            expect(tot).toEqual([]);
            expectIter(inspected).toEqual([1, 2, 3]);
            expect(tot).toEqual([11, 12, 13]);
        });
    });
    describe(".isPartitioned", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 6, 7, 8]).isPartitioned((x) => x < 5)).toBe(true);
            expect(index_1.iterplus([1, 8, 3, 6, 7, 8]).isPartitioned((x) => x < 5)).toBe(false);
            expect(index_1.iterplus([1]).isPartitioned((x) => x < 5)).toBe(true);
            expect(index_1.iterplus([]).isPartitioned((x) => x < 5)).toBe(true);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.isPartitioned((x) => x !== 2)).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".isSortedBy", () => {
        it("works normally", () => {
            expect(index_1.iterplus([4, 3, 2, 1]).isSortedBy((a, b) => b - a)).toBe(true);
            expect(index_1.iterplus([4, 2, 3, 1]).isSortedBy((a, b) => b - a)).toBe(false);
            expect(index_1.iterplus([]).isSortedBy((a, b) => b - a)).toBe(true);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.isSortedBy((_, b) => b - 2)).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".isSortedWith", () => {
        it("works normally", () => {
            expect(index_1.iterplus([4, 3, 2, 1]).isSortedWith((x) => -x)).toBe(true);
            expect(index_1.iterplus([4, 2, 3, 1]).isSortedWith((x) => -x)).toBe(false);
            expect(index_1.iterplus([]).isSortedWith((x) => -x)).toBe(true);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.isSortedWith((x) => (x < 3 ? 100 : x))).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".isSorted", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 4]).isSorted()).toBe(true);
            expect(index_1.iterplus([1, 3, 2, 4]).isSorted()).toBe(false);
            expect(index_1.iterplus([]).isSorted()).toBe(true);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 3, 2, 4, 5]);
            expect(iter.isSorted()).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".last", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 4]).last()).toBe(4);
            expect(index_1.iterplus([]).last()).toBe(index_1.nullVal);
        });
    });
    describe(".mapWhile", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).mapWhile((v) => v < 4 ? v + 1 : null)).toEqual([2, 3, 4]);
        });
        it("is lazy", () => {
            const mock = jest.fn((v) => (v < 4 ? v + 1 : null));
            const iter = index_1.iterplus([1, 2, 3, 4, 5]).mapWhile(mock);
            expect(mock).toBeCalledTimes(0);
            expect(iter.next().value).toBe(2);
            expect(mock).toBeCalledTimes(1);
            expectIter(iter).toEqual([3, 4]);
            expect(mock).toBeCalledTimes(4);
        });
    });
    describe(".maxBy", () => {
        it("works normally", () => {
            expect(index_1.iterplus([]).maxBy((a, b) => b.localeCompare(a))).toBe(null);
            expect(index_1.iterplus(["e", "a", "b", "d", "c"]).maxBy((a, b) => b.localeCompare(a))).toBe("a");
            expect(index_1.iterplus(["a1", "b1", "c1", "b2", "c2"]).maxBy((a, b) => a[0].localeCompare(b[0]))).toBe("c1");
            expect(index_1.iterplus(["a1", "b1", "c1", "b2", "c2"]).maxBy((a, b) => a[0].localeCompare(b[0]), true)).toBe("c2");
        });
    });
    describe(".maxWith", () => {
        it("works normally", () => {
            expect(index_1.iterplus([]).maxWith((x) => -x)).toBe(null);
            expect(index_1.iterplus([3, 5, 1, 4, 2]).maxWith((x) => -x)).toBe(1);
            expect(index_1.iterplus(["a1", "b1", "c1", "b2", "c2"]).maxWith((x) => x[0])).toBe("c1");
            expect(index_1.iterplus(["a1", "b1", "c1", "b2", "c2"]).maxWith((x) => x[0], true)).toBe("c2");
        });
    });
    describe(".max", () => {
        it("works normally", () => {
            expect(index_1.iterplus([]).max()).toBe(null);
            expect(index_1.iterplus([3, 5, 1, 4, 2]).max()).toBe(5);
        });
    });
    describe(".minBy", () => {
        it("works normally", () => {
            expect(index_1.iterplus([]).minBy((a, b) => b.localeCompare(a))).toBe(null);
            expect(index_1.iterplus(["e", "a", "b", "d", "c"]).minBy((a, b) => b.localeCompare(a))).toBe("e");
            expect(index_1.iterplus(["a1", "b1", "c1", "a2", "c2"]).minBy((a, b) => a[0].localeCompare(b[0]))).toBe("a1");
            expect(index_1.iterplus(["a1", "b1", "c1", "a2", "c2"]).minBy((a, b) => a[0].localeCompare(b[0]), true)).toBe("a2");
        });
    });
    describe(".minWith", () => {
        it("works normally", () => {
            expect(index_1.iterplus([]).minWith((x) => -x)).toBe(null);
            expect(index_1.iterplus([3, 5, 1, 4, 2]).minWith((x) => -x)).toBe(5);
            expect(index_1.iterplus(["a1", "b1", "c1", "a2", "c2"]).minWith((x) => x[0])).toBe("a1");
            expect(index_1.iterplus(["a1", "b1", "c1", "a2", "c2"]).minWith((x) => x[0], true)).toBe("a2");
        });
    });
    describe(".min", () => {
        it("works normally", () => {
            expect(index_1.iterplus([]).min()).toBe(null);
            expect(index_1.iterplus([3, 5, 1, 4, 2]).min()).toBe(1);
        });
    });
    describe(".nth", () => {
        it("works normally", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(index_1.iterplus([1, 2, 3]).nth(3)).toBe(index_1.nullVal);
            expect(index_1.iterplus([1, 2, 3]).nth(-1)).toBe(index_1.nullVal);
            expect(iter.nth(2)).toBe(3);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".partition", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 4, 5]).partition((x) => x % 2 === 0)).toEqual([
                [2, 4],
                [1, 3, 5],
            ]);
            expect(index_1.iterplus([]).partition((x) => x % 2 === 0)).toEqual([
                [],
                [],
            ]);
        });
    });
    describe(".peekable", () => {
        it("works normally", () => {
            const iter = index_1.iterplus([1, 2, 3]).peekable();
            expect(iter.hasCached()).toBe(false);
            expect(iter.peek().value).toBe(1);
            expect(iter.peek().value).toBe(1);
            expect(iter.peekVal()).toBe(1);
            expect(iter.hasCached()).toBe(true);
            expect(iter.peek().done).toBe(false);
            expect(iter.next().value).toBe(1);
            expect(iter.hasCached()).toBe(false);
            expect(iter.next().value).toBe(2);
            expect(iter.hasCached()).toBe(false);
            expect(iter.peek().value).toBe(3);
            expect(iter.hasCached()).toBe(true);
            expect(iter.peek().done).toBe(false);
            expect(iter.next().value).toBe(3);
            expect(iter.peek().done).toBe(true);
            expect(iter.peek().done).toBe(true);
            expect(iter.hasCached()).toBe(true);
            expect(iter.peekVal()).toBe(null);
            expect(iter.next().done).toBe(true);
            expect(iter.hasCached()).toBe(false);
        });
    });
    describe(".findIndex", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 4, 5]).findIndex((x) => x === 3)).toBe(2);
            expect(index_1.iterplus([1, 2, 3, 4, 5]).findIndex((x) => x === 6)).toBe(-1);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.findIndex((x) => x === 3)).toBe(2);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".product", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 4, 5]).product()).toBe(120);
            expect(index_1.iterplus([1, 2, 3, 4, 5].map((v) => BigInt(v))).product(BigInt(1))).toBe(BigInt(120));
            expect(index_1.iterplus([]).product(1)).toBe(1);
            expect(index_1.iterplus([]).product(BigInt(1))).toBe(BigInt(1));
        });
    });
    describe(".sum", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 4, 5]).sum()).toBe(15);
            expect(index_1.iterplus([1, 2, 3, 4, 5].map((v) => BigInt(v))).sum(BigInt(0))).toBe(BigInt(15));
            expect(index_1.iterplus(["foo", "bar", "baz"]).sum("")).toBe("foobarbaz");
            expect(index_1.iterplus([]).sum()).toBe(0);
        });
    });
    describe(".reverse", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).reverse()).toEqual([
                5,
                4,
                3,
                2,
                1,
            ]);
            expectIter(index_1.iterplus([]).reverse()).toEqual([]);
        });
    });
    describe(".skip", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).skip(-2)).toEqual([
                1,
                2,
                3,
                4,
                5,
            ]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).skip(2)).toEqual([3, 4, 5]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).skip(7)).toEqual([]);
        });
    });
    describe(".skipWhile", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).skipWhile((x) => x === 0)).toEqual([1, 2, 3, 4, 5]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).skipWhile((x) => x !== 3)).toEqual([3, 4, 5]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).skipWhile((x) => x <= 5)).toEqual([]);
        });
    });
    describe(".take", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).take(7)).toEqual([
                1,
                2,
                3,
                4,
                5,
            ]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).take(3)).toEqual([1, 2, 3]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).take(-2)).toEqual([]);
        });
    });
    describe(".takeWhile", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).takeWhile((x) => x < 7)).toEqual([1, 2, 3, 4, 5]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).takeWhile((x) => x < 4)).toEqual([1, 2, 3]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).takeWhile((x) => x === 2)).toEqual([]);
        });
    });
    describe(".unzip", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([
                [1, "a", 5],
                [2, "b", 6],
                [3, "c", 7],
            ]).unzip()).toEqual([
                [1, 2, 3],
                ["a", "b", "c"],
                [5, 6, 7],
            ]);
            expectIter(index_1.iterplus([[1, "a"], [2, "b", 6], [3]]).unzip()).toEqual([
                [1, 2, 3],
                ["a", "b"],
                [6],
            ]);
        });
    });
    describe(".zipWith", () => {
        it("works normally", () => {
            const other = index_1.iterplus([4, 5, 6, 7, 8]);
            expectIter(index_1.iterplus([1, 2, 3]).zipWith((a, b) => a + b, other)).toEqual([5, 7, 9]);
            expectIter(other).toEqual([7, 8]);
            expectIter(index_1.iterplus("abc").zipWith((a, b, c) => a + b + c, "def", "ghi")).toEqual(["adg", "beh", "cfi"]);
        });
    });
    describe(".zip", () => {
        it("works normally", () => {
            const other = index_1.iterplus([4, 5, 6, 7, 8]);
            expectIter(index_1.iterplus([1, 2, 3]).zip(other)).toEqual([
                [1, 4],
                [2, 5],
                [3, 6],
            ]);
            expectIter(other).toEqual([7, 8]);
            expectIter(index_1.iterplus("abc").zip("def", "ghi")).toEqual(["adg", "beh", "cfi"].map((v) => v.split("")));
        });
    });
    describe(".tee", () => {
        it("works normally", () => {
            const iter = index_1.iterplus([1, 2, 3]);
            const [a, b, c] = iter.tee(3);
            expect(a.next().value).toBe(1);
            expect(b.next().value).toBe(1);
            expectIter(a).toEqual([2, 3]);
            expectIter(b).toEqual([2, 3]);
            expectIter(c).toEqual([1, 2, 3]);
        });
    });
    describe(".average", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 4, 5]).average()).toBe(3);
            expect(index_1.iterplus([1, 2, 3, 4, 5].map((v) => BigInt(v))).average()).toBe(BigInt(3));
            expect(() => index_1.iterplus([]).average()).toThrowError();
            expect(index_1.iterplus([0, 4]).average()).toBe(2);
        });
    });
    describe(".chunks", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 4, 5, 6, 7]).chunks(3)).toEqual([
                [1, 2, 3],
                [4, 5, 6],
                [7],
            ]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5, 6]).chunks(3)).toEqual([
                [1, 2, 3],
                [4, 5, 6],
            ]);
            expectIter(index_1.iterplus([1, 2, 3]).chunks(4)).toEqual([[1, 2, 3]]);
            expectIter(index_1.iterplus([1, 2, 3]).chunks(1)).toEqual([[1], [2], [3]]);
            expectIter(index_1.iterplus([]).chunks(5)).toEqual([]);
        });
    });
    describe(".chunksExact", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 4, 5, 6, 7]).chunksExact(3)).toEqual([
                [1, 2, 3],
                [4, 5, 6],
            ]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5, 6]).chunksExact(3)).toEqual([
                [1, 2, 3],
                [4, 5, 6],
            ]);
            expectIter(index_1.iterplus([1, 2, 3]).chunksExact(4)).toEqual([]);
            expectIter(index_1.iterplus([1, 2, 3]).chunksExact(1)).toEqual([
                [1],
                [2],
                [3],
            ]);
            expectIter(index_1.iterplus([]).chunksExact(5)).toEqual([]);
        });
    });
    describe(".repeat", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3]).repeat(3)).toEqual([
                1,
                2,
                3,
                1,
                2,
                3,
                1,
                2,
                3,
            ]);
            expectIter(index_1.iterplus([1, 2]).repeat(1)).toEqual([1, 2]);
            expectIter(index_1.iterplus([1, 2]).repeat(-1)).toEqual([]);
        });
        it("handles empty iterator repeated infinitely", () => {
            expectIter(index_1.iterplus([]).repeat(Infinity)).toEqual([]);
        });
    });
    describe(".rotateRight", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).rotateRight(2)).toEqual([
                4,
                5,
                1,
                2,
                3,
            ]);
            expectIter(index_1.iterplus([]).rotateRight(2)).toEqual([]);
            expectIter(index_1.iterplus([1, 2, 3]).rotateRight(4)).toEqual([3, 1, 2]);
        });
    });
    describe(".split", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 0, 4, 5, 0]).split(0)).toEqual([
                [1, 2, 3],
                [4, 5],
                [],
            ]);
            expectIter(index_1.iterplus([1, 2, 3, 0, 4, 5]).split(0)).toEqual([
                [1, 2, 3],
                [4, 5],
            ]);
            expectIter(index_1.iterplus([1, 2, 3]).split(0)).toEqual([[1, 2, 3]]);
            expectIter(index_1.iterplus([3, 3]).split(3)).toEqual([[], [], []]);
            expectIter(index_1.iterplus([]).split(3)).toEqual([]);
            expectIter(index_1.iterplus([1, 2, 0, 3, 4, 0, 5, 6]).split(0, 2)).toEqual([
                [1, 2],
                [3, 4, 0, 5, 6],
            ]);
        });
    });
    describe(".splitPred", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 11, 4, 5, 12]).splitPred((x) => x > 10)).toEqual([[1, 2, 3], [4, 5], []]);
            expectIter(index_1.iterplus([1, 2, 3, 13, 4, 5]).splitPred((x) => x > 10)).toEqual([
                [1, 2, 3],
                [4, 5],
            ]);
            expectIter(index_1.iterplus([1, 2, 3]).splitPred((_) => false)).toEqual([
                [1, 2, 3],
            ]);
            expectIter(index_1.iterplus([1, 10]).splitPred((_) => true)).toEqual([
                [],
                [],
                [],
            ]);
            expectIter(index_1.iterplus([]).splitPred((_) => true)).toEqual([]);
            expectIter(index_1.iterplus([1, 2, 11, 3, 4, 12, 5, 6]).splitPred((x) => x > 10, 2)).toEqual([
                [1, 2],
                [3, 4, 12, 5, 6],
            ]);
        });
        it("short circuits", () => {
            const mock = jest.fn((x) => x > 10);
            expectIter(index_1.iterplus([1, 2, 11, 3, 4, 12, 5, 6]).splitPred(mock, 2)).toEqual([
                [1, 2],
                [3, 4, 12, 5, 6],
            ]);
            expect(mock).toBeCalledTimes(3);
        });
    });
    describe(".splitInclusive", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 0, 4, 5, 0]).splitInclusive(0)).toEqual([
                [1, 2, 3, 0],
                [4, 5, 0],
            ]);
            expectIter(index_1.iterplus([1, 2, 3, 0, 4, 5]).splitInclusive(0)).toEqual([
                [1, 2, 3, 0],
                [4, 5],
            ]);
            expectIter(index_1.iterplus([1, 2, 3]).splitInclusive(0)).toEqual([
                [1, 2, 3],
            ]);
            expectIter(index_1.iterplus([3, 3]).splitInclusive(3)).toEqual([[3], [3]]);
            expectIter(index_1.iterplus([]).splitInclusive(3)).toEqual([]);
            expectIter(index_1.iterplus([1, 2, 0, 3, 4, 0, 5, 6]).splitInclusive(0, 2)).toEqual([
                [1, 2, 0],
                [3, 4, 0, 5, 6],
            ]);
        });
    });
    describe(".splitPredInclusive", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 11, 4, 5, 12]).splitPredInclusive((x) => x > 10)).toEqual([
                [1, 2, 3, 11],
                [4, 5, 12],
            ]);
            expectIter(index_1.iterplus([1, 2, 3, 13, 4, 5]).splitPredInclusive((x) => x > 10)).toEqual([
                [1, 2, 3, 13],
                [4, 5],
            ]);
            expectIter(index_1.iterplus([1, 2, 3]).splitPredInclusive((_) => false)).toEqual([[1, 2, 3]]);
            expectIter(index_1.iterplus([1, 10]).splitPredInclusive((_) => true)).toEqual([[1], [10]]);
            expectIter(index_1.iterplus([]).splitPredInclusive((_) => true)).toEqual([]);
            expectIter(index_1.iterplus([1, 2, 11, 3, 4, 12, 5, 6]).splitPredInclusive((x) => x > 10, 2)).toEqual([
                [1, 2, 11],
                [3, 4, 12, 5, 6],
            ]);
        });
        it("short circuits", () => {
            const mock = jest.fn((x) => x > 10);
            expectIter(index_1.iterplus([1, 2, 11, 3, 4, 12, 5, 6]).splitPredInclusive(mock, 2)).toEqual([
                [1, 2, 11],
                [3, 4, 12, 5, 6],
            ]);
            expect(mock).toBeCalledTimes(3);
        });
    });
    describe(".windows", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).windows(3)).toEqual([
                [1, 2, 3],
                [2, 3, 4],
                [3, 4, 5],
            ]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).windows(3, 1)).toEqual([
                [1, 2, 3],
                [2, 3, 4],
                [3, 4, 5],
            ]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5, 6, 7]).windows(3, 2)).toEqual([
                [1, 2, 3],
                [3, 4, 5],
                [5, 6, 7],
            ]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5, 6]).windows(3, 2)).toEqual([
                [1, 2, 3],
                [3, 4, 5],
            ]);
            expectIter(index_1.iterplus([1, 2, 3]).windows(3)).toEqual([[1, 2, 3]]);
            expectIter(index_1.iterplus([1, 2, 3]).windows(4)).toEqual([]);
        });
    });
    describe(".dedup", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 2, 3, 2]).dedup()).toEqual([1, 2, 3, 2]);
            expectIter(index_1.iterplus([1, 2, 2, 2, 2, 3, 2, 2]).dedup()).toEqual([
                1,
                2,
                3,
                2,
            ]);
            expectIter(index_1.iterplus([1, 2, 3, 4]).dedup()).toEqual([1, 2, 3, 4]);
            expectIter(index_1.iterplus([1, 1, 1, 1, 1]).dedup()).toEqual([1]);
            expectIter(index_1.iterplus([]).dedup()).toEqual([]);
        });
    });
    describe(".dedupWith", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 4, 3, 6]).dedupWith((x) => x % 2)).toEqual([1, 2, 3, 6]);
            expectIter(index_1.iterplus([1, 4, 2, 6, 2, 3, 2, 8]).dedupWith((x) => x % 2)).toEqual([1, 4, 3, 2]);
            expectIter(index_1.iterplus([1, 2, 3, 4]).dedupWith((x) => x % 2)).toEqual([
                1,
                2,
                3,
                4,
            ]);
            expectIter(index_1.iterplus([1, 1, 1, 1, 1]).dedupWith((x) => x % 2)).toEqual([1]);
            expectIter(index_1.iterplus([]).dedupWith((x) => x % 2)).toEqual([]);
        });
    });
    describe(".dedupBy", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 4, 3, 6]).dedupBy((a, b) => a % 2 === b % 2)).toEqual([1, 2, 3, 6]);
            expectIter(index_1.iterplus([1, 4, 2, 6, 2, 3, 2, 8]).dedupBy((a, b) => a % 2 === b % 2)).toEqual([1, 4, 3, 2]);
            expectIter(index_1.iterplus([1, 2, 3, 4]).dedupBy((a, b) => a % 2 === b % 2)).toEqual([1, 2, 3, 4]);
            expectIter(index_1.iterplus([1, 1, 1, 1, 1]).dedupBy((a, b) => a % 2 === b % 2)).toEqual([1]);
            expectIter(index_1.iterplus([]).dedupBy((a, b) => a % 2 === b % 2)).toEqual([]);
        });
    });
    describe(".intersperse", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3]).intersperse(0)).toEqual([
                1,
                0,
                2,
                0,
                3,
            ]);
            expectIter(index_1.iterplus([1]).intersperse(0)).toEqual([1]);
            expectIter(index_1.iterplus([]).intersperse(0)).toEqual([]);
        });
    });
    describe(".intersperseMultiple", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3]).intersperseMultiple([10, 11, 12])).toEqual([1, 10, 11, 12, 2, 10, 11, 12, 3]);
            expectIter(index_1.iterplus([1]).intersperseMultiple([10, 11, 12])).toEqual([1]);
            expectIter(index_1.iterplus([]).intersperseMultiple([10, 11, 12])).toEqual([]);
        });
    });
    describe(".join", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([
                [1, 2],
                [3, 4],
                [5, 6],
            ]).join(0)).toEqual([1, 2, 0, 3, 4, 0, 5, 6]);
            expectIter(index_1.iterplus([[1]]).join(0)).toEqual([1]);
            expectIter(index_1.iterplus([]).join(0)).toEqual([]);
        });
    });
    describe(".joinMultiple", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([
                [1, 2],
                [3, 4],
                [5, 6],
            ]).joinMultiple([10, 11, 12])).toEqual([1, 2, 10, 11, 12, 3, 4, 10, 11, 12, 5, 6]);
            expectIter(index_1.iterplus([[1]]).joinMultiple([10, 11, 12])).toEqual([1]);
            expectIter(index_1.iterplus([]).joinMultiple([10, 11, 12])).toEqual([]);
        });
    });
    describe(".toObject", () => {
        it("works normally", () => {
            expect(index_1.iterplus([
                ["a", "b"],
                ["c", "d"],
                ["e", "f"],
            ]).toObject()).toEqual({ a: "b", c: "d", e: "f" });
            expect(index_1.iterplus([
                ["a", "b"],
                ["c", "d"],
                ["e", "f"],
            ]).toObject("maintain")).toEqual({ a: "b", c: "d", e: "f" });
            expect(index_1.iterplus([
                ["a", "b"],
                ["c", "d"],
                ["e", "f"],
            ]).toObject("error")).toEqual({ a: "b", c: "d", e: "f" });
            expect(index_1.iterplus([
                ["a", "b"],
                ["c", "d"],
                ["e", "f"],
                ["a", "foo"],
            ]).toObject()).toEqual({ a: "foo", c: "d", e: "f" });
            expect(index_1.iterplus([
                ["a", "b"],
                ["c", "d"],
                ["e", "f"],
                ["a", "foo"],
            ]).toObject("overwrite")).toEqual({ a: "foo", c: "d", e: "f" });
            expect(index_1.iterplus([
                ["a", "b"],
                ["c", "d"],
                ["e", "f"],
                ["a", "foo"],
            ]).toObject("maintain")).toEqual({ a: "b", c: "d", e: "f" });
            expect(() => index_1.iterplus([
                ["a", "b"],
                ["c", "d"],
                ["e", "f"],
                ["a", "foo"],
            ]).toObject("error")).toThrowError();
            expect(index_1.iterplus([]).toObject()).toEqual({});
        });
    });
    describe(".toMap", () => {
        it("works normally", () => {
            expect(index_1.iterplus([
                ["a", "b"],
                ["c", "d"],
                ["e", "f"],
            ]).toMap()).toEqual(new Map(Object.entries({ a: "b", c: "d", e: "f" })));
            expect(index_1.iterplus([
                ["a", "b"],
                ["c", "d"],
                ["e", "f"],
            ]).toMap("maintain")).toEqual(new Map(Object.entries({ a: "b", c: "d", e: "f" })));
            expect(index_1.iterplus([
                ["a", "b"],
                ["c", "d"],
                ["e", "f"],
            ]).toMap("error")).toEqual(new Map(Object.entries({ a: "b", c: "d", e: "f" })));
            expect(index_1.iterplus([
                ["a", "b"],
                ["c", "d"],
                ["e", "f"],
                ["a", "foo"],
            ]).toMap()).toEqual(new Map(Object.entries({ a: "foo", c: "d", e: "f" })));
            expect(index_1.iterplus([
                ["a", "b"],
                ["c", "d"],
                ["e", "f"],
                ["a", "foo"],
            ]).toMap("overwrite")).toEqual(new Map(Object.entries({ a: "foo", c: "d", e: "f" })));
            expect(index_1.iterplus([
                ["a", "b"],
                ["c", "d"],
                ["e", "f"],
                ["a", "foo"],
            ]).toMap("maintain")).toEqual(new Map(Object.entries({ a: "b", c: "d", e: "f" })));
            expect(() => index_1.iterplus([
                ["a", "b"],
                ["c", "d"],
                ["e", "f"],
                ["a", "foo"],
            ]).toMap("error")).toThrowError();
            expect(index_1.iterplus([]).toMap()).toEqual(new Map());
        });
    });
    describe(".toSet", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 4, 2]).toSet()).toEqual(new Set([1, 2, 3, 4]));
            expect(index_1.iterplus([1, 2, 3]).toSet()).toEqual(new Set([1, 2, 3]));
            expect(index_1.iterplus([]).toSet()).toEqual(new Set());
        });
    });
    describe(".toArray", () => {
        it("works normally", () => {
            expect(index_1.iterplus([2, 1, 3]).collect()).toEqual([2, 1, 3]);
        });
    });
    describe(".interleave", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3]).interleave([4, 5, 6, 7], [8, 9, 10, 11, 12])).toEqual([1, 4, 8, 2, 5, 9, 3, 6, 10, 7, 11, 12]);
            expectIter(index_1.iterplus([1, 2, 3]).interleave([4, 5, 6])).toEqual([
                1,
                4,
                2,
                5,
                3,
                6,
            ]);
            expectIter(index_1.iterplus([]).interleave([1, 2, 3])).toEqual([
                1,
                2,
                3,
            ]);
            expectIter(index_1.iterplus([1, 2, 3]).interleave([])).toEqual([
                1,
                2,
                3,
            ]);
            expectIter(index_1.iterplus([]).interleave([])).toEqual([]);
        });
    });
    describe(".mapAccum", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus(["A", "B", "C"]).mapAccum((a, v) => [a + 1, v + a.toString()], 0)).toEqual(["A0", "B1", "C2"]);
            expectIter(index_1.iterplus([]).mapAccum((a, v) => [a + 1, v + a.toString()], 0)).toEqual([]);
        });
    });
    describe(".countIf", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3, 4, 5]).countIf((x) => x % 2 == 0)).toBe(2);
            expect(index_1.iterplus([1, 2, 3, 4, 5]).countIf((x) => x == 10)).toBe(0);
            expect(index_1.iterplus([]).countIf((x) => true)).toBe(0);
        });
    });
    describe(".scan", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([1, 2, 3, 4]).scan((a, b) => a * 10 + b)).toEqual([1, 12, 123, 1234]);
            expectIter(index_1.iterplus([1, 2, 3, 4]).scan((a, b) => a * 10 + b, 9)).toEqual([9, 91, 912, 9123, 91234]);
            expectIter(index_1.iterplus([]).scan((a, _) => a, "foo")).toEqual(["foo"]);
        });
        it("errors on empty array", () => {
            expect(() => index_1.iterplus([])
                .scan((a, _) => a)
                .next()).toThrow(TypeError);
        });
    });
    describe(".headEqualsBy", () => {
        it("works normally", () => {
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo"]).headEqualsBy(["a", "b", "c"], (a, b) => a === b + "_foo")).toBe(true);
            expect(index_1.iterplus(["a_foo", "b_bar", "c_foo"]).headEqualsBy(["a", "b", "c"], (a, b) => a === b + "_foo")).toBe(false);
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo", "d_foo"]).headEqualsBy(["a", "b", "c"], (a, b) => a === b + "_foo")).toBe(true);
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo"]).headEqualsBy(["a", "b", "c", "d"], (a, b) => a === b + "_foo")).toBe(true);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.headEqualsBy([0, 1, 3, 9, 10], (a, b) => a === b + 1)).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".headEqualsWith", () => {
        it("works normally", () => {
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo"]).headEqualsWith(["a", "b", "c"], (x) => (x.endsWith("_foo") ? x : x + "_foo"))).toBe(true);
            expect(index_1.iterplus(["a_foo", "b_bar", "c_foo"]).headEqualsWith(["a", "b", "c"], (x) => (x.endsWith("_foo") ? x : x + "_foo"))).toBe(false);
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo", "d_foo"]).headEqualsWith(["a", "b", "c"], (x) => (x.endsWith("_foo") ? x : x + "_foo"))).toBe(true);
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo"]).headEqualsWith(["a", "b", "c", "d"], (x) => (x.endsWith("_foo") ? x : x + "_foo"))).toBe(true);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.headEqualsWith([101, 102, 104, 109, 110], (x) => x > 100 ? x - 100 : x)).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".headEquals", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3]).headEquals([1, 2, 3])).toBe(true);
            expect(index_1.iterplus([1, 2, 3]).headEquals([1, 2, 4])).toBe(false);
            expect(index_1.iterplus([1, 2, 3, 4]).headEquals([1, 2, 3])).toBe(true);
            expect(index_1.iterplus([1, 2, 3]).headEquals([1, 2, 3, 4])).toBe(true);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.headEquals([1, 2, 5, 6, 7])).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".hasPrefixBy", () => {
        it("works normally", () => {
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo"]).hasPrefixBy(["a", "b", "c"], (a, b) => a === b + "_foo")).toBe(true);
            expect(index_1.iterplus(["a_foo", "b_bar", "c_foo"]).hasPrefixBy(["a", "b", "c"], (a, b) => a === b + "_foo")).toBe(false);
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo", "d_foo"]).hasPrefixBy(["a", "b", "c"], (a, b) => a === b + "_foo")).toBe(true);
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo"]).hasPrefixBy(["a", "b", "c", "d"], (a, b) => a === b + "_foo")).toBe(false);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.hasPrefixBy([0, 1, 3, 9, 10], (a, b) => a === b + 1)).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".hasPrefixWith", () => {
        it("works normally", () => {
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo"]).hasPrefixWith(["a", "b", "c"], (x) => (x.endsWith("_foo") ? x : x + "_foo"))).toBe(true);
            expect(index_1.iterplus(["a_foo", "b_bar", "c_foo"]).hasPrefixWith(["a", "b", "c"], (x) => (x.endsWith("_foo") ? x : x + "_foo"))).toBe(false);
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo", "d_foo"]).hasPrefixWith(["a", "b", "c"], (x) => (x.endsWith("_foo") ? x : x + "_foo"))).toBe(true);
            expect(index_1.iterplus(["a_foo", "b_foo", "c_foo"]).hasPrefixWith(["a", "b", "c", "d"], (x) => (x.endsWith("_foo") ? x : x + "_foo"))).toBe(false);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.hasPrefixWith([101, 102, 104, 109, 110], (x) => x > 100 ? x - 100 : x)).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".hasPrefix", () => {
        it("works normally", () => {
            expect(index_1.iterplus([1, 2, 3]).hasPrefix([1, 2, 3])).toBe(true);
            expect(index_1.iterplus([1, 2, 3]).hasPrefix([1, 2, 4])).toBe(false);
            expect(index_1.iterplus([1, 2, 3, 4]).hasPrefix([1, 2, 3])).toBe(true);
            expect(index_1.iterplus([1, 2, 3]).hasPrefix([1, 2, 3, 4])).toBe(false);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 2, 3, 4, 5]);
            expect(iter.hasPrefix([1, 2, 5, 6, 7])).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });
    describe(".allEqualBy", () => {
        it("works normally", () => {
            expect(index_1.iterplus([]).allEqualBy((a, b) => a % 10 === b % 10)).toBe(true);
            expect(index_1.iterplus([11]).allEqualBy((a, b) => a % 10 === b % 10)).toBe(true);
            expect(index_1.iterplus([11, 21]).allEqualBy((a, b) => a % 10 === b % 10)).toBe(true);
            expect(index_1.iterplus([11, 21, 31]).allEqualBy((a, b) => a % 10 === b % 10)).toBe(true);
            expect(index_1.iterplus([11, 22, 31]).allEqualBy((a, b) => a % 10 === b % 10)).toBe(false);
            expect(index_1.iterplus([11, 21, 32]).allEqualBy((a, b) => a % 10 === b % 10)).toBe(false);
            expect(index_1.iterplus([12, 21, 31]).allEqualBy((a, b) => a % 10 === b % 10)).toBe(false);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([11, 21, 31, 42, 53, 64]);
            expect(iter.allEqualBy((a, b) => a % 10 === b % 10)).toBe(false);
            expectIter(iter).toEqual([53, 64]);
        });
    });
    describe(".allEqualWith", () => {
        it("works normally", () => {
            expect(index_1.iterplus([]).allEqualWith((x) => x % 10)).toBe(true);
            expect(index_1.iterplus([11]).allEqualWith((x) => x % 10)).toBe(true);
            expect(index_1.iterplus([11, 21]).allEqualWith((x) => x % 10)).toBe(true);
            expect(index_1.iterplus([11, 21, 31]).allEqualWith((x) => x % 10)).toBe(true);
            expect(index_1.iterplus([11, 22, 31]).allEqualWith((x) => x % 10)).toBe(false);
            expect(index_1.iterplus([11, 21, 32]).allEqualWith((x) => x % 10)).toBe(false);
            expect(index_1.iterplus([12, 21, 31]).allEqualWith((x) => x % 10)).toBe(false);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([11, 21, 31, 42, 53, 64]);
            expect(iter.allEqualWith((x) => x % 10)).toBe(false);
            expectIter(iter).toEqual([53, 64]);
        });
    });
    describe(".allEqual", () => {
        it("works normally", () => {
            expect(index_1.iterplus([]).allEqual()).toBe(true);
            expect(index_1.iterplus([1]).allEqual()).toBe(true);
            expect(index_1.iterplus([1, 1]).allEqual()).toBe(true);
            expect(index_1.iterplus([1, 1, 1]).allEqual()).toBe(true);
            expect(index_1.iterplus([1, 2, 1]).allEqual()).toBe(false);
            expect(index_1.iterplus([1, 1, 2]).allEqual()).toBe(false);
            expect(index_1.iterplus([2, 1, 1]).allEqual()).toBe(false);
        });
        it("short circuits", () => {
            const iter = index_1.iterplus([1, 1, 1, 2, 3, 4]);
            expect(iter.allEqual()).toBe(false);
            expectIter(iter).toEqual([3, 4]);
        });
    });
    describe(".nubBy", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([]).nubBy((a, b) => a % 10 === b % 10)).toEqual([]);
            expectIter(index_1.iterplus([11, 21, 33, 41, 53, 63, 72, 81, 92, 13, 23]).nubBy((a, b) => a % 10 === b % 10)).toEqual([11, 33, 72]);
            expectIter(index_1.iterplus([21, 11, 31]).nubBy((a, b) => a % 10 === b % 10)).toEqual([21]);
        });
    });
    describe(".nubWith", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([]).nubWith((x) => x % 10)).toEqual([]);
            expectIter(index_1.iterplus([11, 21, 33, 41, 53, 63, 72, 81, 92, 13, 23]).nubWith((x) => x % 10)).toEqual([11, 33, 72]);
            expectIter(index_1.iterplus([21, 11, 31]).nubWith((x) => x % 10)).toEqual([
                21,
            ]);
        });
    });
    describe(".nub", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([]).nub()).toEqual([]);
            expectIter(index_1.iterplus([1, 1, 3, 1, 3, 3, 2, 1, 2, 3, 3]).nub()).toEqual([1, 3, 2]);
            expectIter(index_1.iterplus([1, 1, 1]).nub()).toEqual([1]);
        });
    });
    describe(".group", () => {
        it("works normally", () => {
            expect(index_1.iterplus([]).group((x) => x)).toEqual({});
            expect(index_1.iterplus([1, 1, 2, 1, 3, 3]).group((x) => x)).toEqual({
                1: [1, 1, 1],
                2: [2],
                3: [3, 3],
            });
            expect(index_1.iterplus([11, 21, 32, 41, 53, 63]).group((x) => x % 10)).toEqual({
                1: [11, 21, 41],
                2: [32],
                3: [53, 63],
            });
        });
    });
    describe(".tallyWith", () => {
        it("works normally", () => {
            expect(index_1.iterplus([]).tallyWith((x) => x)).toEqual({});
            expect(index_1.iterplus([1, 1, 2, 1, 3, 3]).tallyWith((x) => x)).toEqual({
                1: 3,
                2: 1,
                3: 2,
            });
            expect(index_1.iterplus([11, 21, 32, 41, 53, 63]).tallyWith((x) => x % 10)).toEqual({
                1: 3,
                2: 1,
                3: 2,
            });
        });
    });
    describe(".tally", () => {
        it("works normally", () => {
            expect(index_1.iterplus([]).tally()).toEqual({});
            expect(index_1.iterplus([1, 1, 2, 1, 3, 3]).tally()).toEqual({
                1: 3,
                2: 1,
                3: 2,
            });
        });
    });
    describe(".globBy", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([]).globBy((a, b) => a % 10 === b % 10)).toEqual([]);
            expectIter(index_1.iterplus([12]).globBy((a, b) => a % 10 === b % 10)).toEqual([[12]]);
            expectIter(index_1.iterplus([11, 21, 31]).globBy((a, b) => a % 10 === b % 10)).toEqual([[11, 21, 31]]);
            expectIter(index_1.iterplus([11, 21, 31, 42, 51, 63, 73]).globBy((a, b) => a % 10 === b % 10)).toEqual([[11, 21, 31], [42], [51], [63, 73]]);
        });
    });
    describe(".globWith", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([]).globWith((x) => x % 10)).toEqual([]);
            expectIter(index_1.iterplus([12]).globWith((x) => x % 10)).toEqual([[12]]);
            expectIter(index_1.iterplus([11, 21, 31]).globWith((x) => x % 10)).toEqual([
                [11, 21, 31],
            ]);
            expectIter(index_1.iterplus([11, 21, 31, 42, 51, 63, 73]).globWith((x) => x % 10)).toEqual([[11, 21, 31], [42], [51], [63, 73]]);
        });
    });
    describe(".glob", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([]).glob()).toEqual([]);
            expectIter(index_1.iterplus([2]).glob()).toEqual([[2]]);
            expectIter(index_1.iterplus([1, 1, 1]).glob()).toEqual([[1, 1, 1]]);
            expectIter(index_1.iterplus([1, 1, 1, 2, 1, 3, 3]).glob()).toEqual([
                [1, 1, 1],
                [2],
                [1],
                [3, 3],
            ]);
        });
    });
    describe(".stepBy", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([]).stepBy(1)).toEqual([]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5, 6]).stepBy(1)).toEqual([1, 2, 3, 4, 5, 6]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5]).stepBy(2)).toEqual([1, 3, 5]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5, 6]).stepBy(2)).toEqual([1, 3, 5]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5, 6]).stepBy(3)).toEqual([1, 4]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5, 6, 7]).stepBy(3)).toEqual([1, 4, 7]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5, 6]).stepBy(10)).toEqual([1]);
            expectIter(index_1.iterplus([1, 2, 3, 4, 5, 6]).stepBy(Infinity)).toEqual([1]);
        });
    });
    describe(".dropEnd", () => {
        it("works normally", () => {
            expectIter(index_1.iterplus([]).dropEnd(3)).toEqual([]);
            expectIter(index_1.iterplus([1, 2, 3]).dropEnd(3)).toEqual([]);
            expectIter(index_1.iterplus([1, 2, 3, 4]).dropEnd(5)).toEqual([]);
            expectIter(index_1.iterplus([1, 2, 3, 4]).dropEnd(4)).toEqual([]);
            expectIter(index_1.iterplus([1, 2, 3, 4]).dropEnd(3)).toEqual([1]);
            expectIter(index_1.iterplus([1, 2, 3, 4]).dropEnd(2)).toEqual([1, 2]);
            expectIter(index_1.iterplus([1, 2, 3, 4]).dropEnd(1)).toEqual([1, 2, 3]);
            expectIter(index_1.iterplus([1, 2, 3, 4]).dropEnd(0)).toEqual([1, 2, 3, 4]);
        });
    });
});
//# sourceMappingURL=iterplus.js.map