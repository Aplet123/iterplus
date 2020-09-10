import {IterPlus, iterplus, nullVal, Null, range} from "../src/index";

function genYielder(bound: number = 5): () => number | Null {
    let count = 0;
    return function () {
        if (count == bound) {
            return nullVal;
        }
        return ++count;
    };
}

function expectIter<T>(iter: Iterable<T>) {
    return expect(Array.from(iter));
}

describe("Utility functions", () => {
    it("range works", () => {
        expectIter(range(1, 5)).toEqual([1, 2, 3, 4]);
        expectIter(range(1, 1)).toEqual([]);
        expectIter(range(2, 1)).toEqual([]);
        expectIter(range(5, 1, -1)).toEqual([5, 4, 3, 2]);
        expectIter(range(1, 6, 2)).toEqual([1, 3, 5]);
        expectIter(range(1, 3, 0.5)).toEqual([1, 1.5, 2, 2.5]);
        expectIter(range(5)).toEqual([0, 1, 2, 3, 4]);
        expectIter(range(BigInt(1), BigInt(5))).toEqual(
            [1, 2, 3, 4].map((v) => BigInt(v))
        );
    });
});

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
        const mock = jest.fn((x: number) => (x < 5 ? x + 1 : nullVal));
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

    it(".product works", () => {
        const iter = IterPlus.product([1, 2], [3, 4], [5, 6]);
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
});

describe("Methods", () => {
    describe(".nextVal", () => {
        it("works normally", () => {
            const iter = iterplus([1, 2, 3]);
            expect(iter.nextVal()).toBe(1);
            expect(iter.nextVal()).toBe(2);
            expect(iter.nextVal()).toBe(3);
            expect(iter.nextVal()).toBe(null);
        });
    });

    describe(".every", () => {
        it("works normally", () => {
            expect(iterplus([1, 2, 3, 4, 5]).every((x) => x < 10)).toBe(true);
        });

        it("short circuits", () => {
            const iter = iterplus([1, 2, 3, 4, 5]);
            expect(iter.every((x) => x < 3)).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".some", () => {
        it("works normally", () => {
            expect(iterplus([1, 2, 3, 4, 5]).some((x) => x == 7)).toBe(false);
        });

        it("short circuits", () => {
            const iter = iterplus([1, 2, 3, 4, 5]);
            expect(iter.some((x) => x > 2)).toBe(true);
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".concat", () => {
        it("works normally", () => {
            expectIter(iterplus([1, 2, 3]).concat([4, 5, 6])).toEqual([
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
            expect(
                iterplus([1, 2, 3]).compareBy([1, 2, 4], (a, b) => b - a)
            ).toBe(1);
            expect(
                iterplus([1, 2, 3]).compareBy([1, 2, 3], (a, b) => b - a)
            ).toBe(0);
            expect(
                iterplus([1, 2, 3]).compareBy([1, 1, 3], (a, b) => b - a)
            ).toBe(-1);
            expect(
                iterplus([1, 2, 3, 4]).compareBy([1, 2, 3], (a, b) => b - a)
            ).toBe(1);
            expect(
                iterplus([1, 2, 3]).compareBy([1, 2, 3, 4], (a, b) => b - a)
            ).toBe(-1);
        });

        it("short circuits", () => {
            const iter = iterplus([1, 2, 3, 4, 5]);
            expect(iter.compareBy([1, 2, 4], (a, b) => b - a)).toBe(1);
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".compareWith", () => {
        it("works normally", () => {
            expect(iterplus([1, 2, 3]).compareWith([1, 2, 4], (x) => -x)).toBe(
                1
            );
            expect(iterplus([1, 2, 3]).compareWith([1, 2, 3], (x) => -x)).toBe(
                0
            );
            expect(iterplus([1, 2, 3]).compareWith([1, 1, 3], (x) => -x)).toBe(
                -1
            );
            expect(
                iterplus([1, 2, 3, 4]).compareWith([1, 2, 3], (x) => -x)
            ).toBe(1);
            expect(
                iterplus([1, 2, 3]).compareWith([1, 2, 3, 4], (x) => -x)
            ).toBe(-1);
        });

        it("short circuits", () => {
            const iter = iterplus([1, 2, 3, 4, 5]);
            expect(iter.compareWith([1, 2, 4], (x) => -x)).toBe(1);
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".compare", () => {
        it("works normally", () => {
            expect(iterplus([1, 2, 3]).compare([1, 2, 4])).toBe(-1);
            expect(iterplus([1, 2, 3]).compare([1, 2, 3])).toBe(0);
            expect(iterplus([1, 2, 3]).compare([1, 1, 3])).toBe(1);
            expect(iterplus([1, 2, 3, 4]).compare([1, 2, 3])).toBe(1);
            expect(iterplus([1, 2, 3]).compare([1, 2, 3, 4])).toBe(-1);
        });

        it("short circuits", () => {
            const iter = iterplus([1, 2, 3, 4, 5]);
            expect(iter.compare([1, 2, 4])).toBe(-1);
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".collect", () => {
        it("works normally", () => {
            expect(iterplus(new Set([2, 1, 3])).collect()).toEqual([2, 1, 3]);
        });
    });

    describe(".count", () => {
        it("works normally", () => {
            expect(iterplus([1, 2, 3, 4]).count()).toBe(4);
        });
    });

    describe(".enumerate", () => {
        it("works normally", () => {
            expectIter(iterplus(["a", "b", "c"]).enumerate()).toEqual([
                [0, "a"],
                [1, "b"],
                [2, "c"],
            ]);
        });
    });

    describe(".equalsBy", () => {
        it("works normally", () => {
            expect(
                iterplus(["a_foo", "b_foo", "c_foo"]).equalsBy(
                    ["a", "b", "c"],
                    (a, b) => a == b + "_foo"
                )
            ).toBe(true);
            expect(
                iterplus(["a_foo", "b_bar", "c_foo"]).equalsBy(
                    ["a", "b", "c"],
                    (a, b) => a == b + "_foo"
                )
            ).toBe(false);
            expect(
                iterplus(["a_foo", "b_foo", "c_foo", "d_foo"]).equalsBy(
                    ["a", "b", "c"],
                    (a, b) => a == b + "_foo"
                )
            ).toBe(false);
            expect(
                iterplus(["a_foo", "b_foo", "c_foo"]).equalsBy(
                    ["a", "b", "c", "d"],
                    (a, b) => a == b + "_foo"
                )
            ).toBe(false);
        });

        it("short circuits", () => {
            const iter = iterplus([1, 2, 3, 4, 5]);
            expect(iter.equalsBy([0, 1, 3, 9, 10], (a, b) => a == b + 1)).toBe(
                false
            );
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".equalsWith", () => {
        it("works normally", () => {
            expect(
                iterplus(["a_foo", "b_foo", "c_foo"]).equalsWith(
                    ["a", "b", "c"],
                    (x) => (x.endsWith("_foo") ? x : x + "_foo")
                )
            ).toBe(true);
            expect(
                iterplus(["a_foo", "b_bar", "c_foo"]).equalsWith(
                    ["a", "b", "c"],
                    (x) => (x.endsWith("_foo") ? x : x + "_foo")
                )
            ).toBe(false);
            expect(
                iterplus(["a_foo", "b_foo", "c_foo", "d_foo"]).equalsWith(
                    ["a", "b", "c"],
                    (x) => (x.endsWith("_foo") ? x : x + "_foo")
                )
            ).toBe(false);
            expect(
                iterplus(["a_foo", "b_foo", "c_foo"]).equalsWith(
                    ["a", "b", "c", "d"],
                    (x) => (x.endsWith("_foo") ? x : x + "_foo")
                )
            ).toBe(false);
        });

        it("short circuits", () => {
            const iter = iterplus([1, 2, 3, 4, 5]);
            expect(
                iter.equalsWith([101, 102, 104, 109, 110], (x) =>
                    x > 100 ? x - 100 : x
                )
            ).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".equals", () => {
        it("works normally", () => {
            expect(iterplus([1, 2, 3]).equals([1, 2, 3])).toBe(true);
            expect(iterplus([1, 2, 3]).equals([1, 2, 4])).toBe(false);
            expect(iterplus([1, 2, 3, 4]).equals([1, 2, 3])).toBe(false);
            expect(iterplus([1, 2, 3]).equals([1, 2, 3, 4])).toBe(false);
        });

        it("short circuits", () => {
            const iter = iterplus([1, 2, 3, 4, 5]);
            expect(iter.equals([1, 2, 5, 6, 7])).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".filter", () => {
        it("works normally", () => {
            expectIter(
                iterplus([1, 2, 3, 4, 5]).filter((x) => x % 2 == 0)
            ).toEqual([2, 4]);
        });
    });

    describe(".filterMap", () => {
        it("works normally", () => {
            expectIter(
                iterplus([
                    [1, 3],
                    [7, 2],
                    [8, 3],
                    [1, 4],
                    [9, 5],
                ]).filterMap((x) => x.find((v) => v % 2 == 0) ?? nullVal)
            ).toEqual([2, 8, 4]);
        });
    });

    describe(".find", () => {
        it("works normally", () => {
            expect(iterplus([1, 2, 3, 4, 5]).find((x) => x == 3)).toBe(3);
            expect(iterplus([1, 2, 3, 4, 5]).find((x) => x == 6)).toBe(nullVal);
        });

        it("short circuits", () => {
            const iter = iterplus([1, 2, 3, 4, 5]);
            expect(iter.find((x) => x == 3)).toBe(3);
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".findMap", () => {
        it("works normally", () => {
            expect(
                iterplus([1, 2, 3, 4, 5]).findMap((x) =>
                    x == 3 ? "foo" : nullVal
                )
            ).toBe("foo");
            expect(
                iterplus([1, 2, 3, 4, 5]).findMap((x) =>
                    x == 6 ? "foo" : nullVal
                )
            ).toBe(nullVal);
        });

        it("short circuits", () => {
            const iter = iterplus([1, 2, 3, 4, 5]);
            expect(iter.findMap((x) => (x == 3 ? "foo" : nullVal))).toBe("foo");
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".flatten", () => {
        it("works normally", () => {
            expectIter(iterplus([[1, 2], [3]]).flatten()).toEqual([1, 2, 3]);
        });
    });

    describe(".map", () => {
        it("works normally", () => {
            expectIter(iterplus([1, 2, 3]).map((v) => v + 1)).toEqual([
                2,
                3,
                4,
            ]);
        });

        it("is lazy", () => {
            const mock = jest.fn((v) => v + 1);
            const iter = iterplus([1, 2, 3]).map(mock);
            expect(mock).toBeCalledTimes(0);
            expect(iter.next().value).toBe(2);
            expect(mock).toBeCalledTimes(1);
            expectIter(iter).toEqual([3, 4]);
            expect(mock).toBeCalledTimes(3);
        });
    });

    describe(".starmap", () => {
        it("works normally", () => {
            expectIter(iterplus([[3, 2], [4, 3], [1, 1]]).starmap(Math.pow)).toEqual([
                9, 64, 1
            ]);
        });

        it("is lazy", () => {
            const mock = jest.fn(Math.pow);
            const iter = iterplus([[3, 2], [4, 3], [1, 1]]).starmap(mock);
            expect(mock).toBeCalledTimes(0);
            expect(iter.next().value).toBe(9);
            expect(mock).toBeCalledTimes(1);
            expectIter(iter).toEqual([64, 1]);
            expect(mock).toBeCalledTimes(3);
        });
    });

    describe(".flatMap", () => {
        it("works normally", () => {
            expectIter(
                iterplus([1, 2, 3]).flatMap((v) => [v, v + 10])
            ).toEqual([1, 11, 2, 12, 3, 13]);
        });
    });

    describe(".reduce", () => {
        it("works normally", () => {
            expect(iterplus([1, 2, 3, 4]).reduce((a, b) => a * 10 + b)).toBe(
                1234
            );
            expect(iterplus([1, 2, 3, 4]).reduce((a, b) => a * 10 + b, 9)).toBe(
                91234
            );
            expect(iterplus([] as string[]).reduce((a, _) => a, "foo")).toBe(
                "foo"
            );
        });

        it("errors on empty array", () => {
            expect(() => iterplus([]).reduce((a, _) => a)).toThrow(TypeError);
        });
    });

    describe(".forEach", () => {
        it("works normally", () => {
            const tot: number[] = [];
            iterplus([1, 2, 3]).forEach((v) => tot.push(v));
            expect(tot).toEqual([1, 2, 3]);
        });
    });

    describe(".fuse", () => {
        it("works normally", () => {
            let count = 0;
            const fused = new IterPlus({
                next() {
                    if (count == 1) {
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
            const tot: number[] = [];
            const inspected = iterplus([1, 2, 3]).inspect((v) => {
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
            expect(
                iterplus([1, 2, 3, 6, 7, 8]).isPartitioned((x) => x < 5)
            ).toBe(true);
            expect(
                iterplus([1, 8, 3, 6, 7, 8]).isPartitioned((x) => x < 5)
            ).toBe(false);
            expect(iterplus([1]).isPartitioned((x) => x < 5)).toBe(true);
            expect(iterplus([] as number[]).isPartitioned((x) => x < 5)).toBe(
                true
            );
        });

        it("short circuits", () => {
            const iter = iterplus([1, 2, 3, 4, 5]);
            expect(iter.isPartitioned((x) => x != 2)).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".isSortedBy", () => {
        it("works normally", () => {
            expect(iterplus([4, 3, 2, 1]).isSortedBy((a, b) => b - a)).toBe(
                true
            );
            expect(iterplus([4, 2, 3, 1]).isSortedBy((a, b) => b - a)).toBe(
                false
            );
            expect(iterplus([]).isSortedBy((a, b) => b - a)).toBe(true);
        });

        it("short circuits", () => {
            const iter = iterplus([1, 2, 3, 4, 5]);
            expect(iter.isSortedBy((_, b) => b - 2)).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".isSortedWith", () => {
        it("works normally", () => {
            expect(iterplus([4, 3, 2, 1]).isSortedWith((x) => -x)).toBe(true);
            expect(iterplus([4, 2, 3, 1]).isSortedWith((x) => -x)).toBe(false);
            expect(iterplus([]).isSortedWith((x) => -x)).toBe(true);
        });

        it("short circuits", () => {
            const iter = iterplus([1, 2, 3, 4, 5]);
            expect(iter.isSortedWith((x) => (x < 3 ? 100 : x))).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".isSorted", () => {
        it("works normally", () => {
            expect(iterplus([1, 2, 3, 4]).isSorted()).toBe(true);
            expect(iterplus([1, 3, 2, 4]).isSorted()).toBe(false);
            expect(iterplus([]).isSorted()).toBe(true);
        });

        it("short circuits", () => {
            const iter = iterplus([1, 3, 2, 4, 5]);
            expect(iter.isSorted()).toBe(false);
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".last", () => {
        it("works normally", () => {
            expect(iterplus([1, 2, 3, 4]).last()).toBe(4);
            expect(iterplus([]).last()).toBe(nullVal);
        });
    });

    describe(".mapWhile", () => {
        it("works normally", () => {
            expectIter(
                iterplus([1, 2, 3, 4, 5]).mapWhile((v) =>
                    v < 4 ? v + 1 : null
                )
            ).toEqual([2, 3, 4]);
        });

        it("is lazy", () => {
            const mock = jest.fn((v) => (v < 4 ? v + 1 : null));
            const iter = iterplus([1, 2, 3, 4, 5]).mapWhile(mock);
            expect(mock).toBeCalledTimes(0);
            expect(iter.next().value).toBe(2);
            expect(mock).toBeCalledTimes(1);
            expectIter(iter).toEqual([3, 4]);
            expect(mock).toBeCalledTimes(4);
        });
    });

    describe(".maxBy", () => {
        it("works normally", () => {
            expect(
                iterplus([] as string[]).maxBy((a, b) => b.localeCompare(a))
            ).toBe(null);
            expect(
                iterplus(["e", "a", "b", "d", "c"]).maxBy((a, b) =>
                    b.localeCompare(a)
                )
            ).toBe("a");
            expect(
                iterplus(["a1", "b1", "c1", "b2", "c2"]).maxBy((a, b) =>
                    a[0].localeCompare(b[0])
                )
            ).toBe("c1");
            expect(
                iterplus(["a1", "b1", "c1", "b2", "c2"]).maxBy(
                    (a, b) => a[0].localeCompare(b[0]),
                    true
                )
            ).toBe("c2");
        });
    });

    describe(".maxWith", () => {
        it("works normally", () => {
            expect(iterplus([] as number[]).maxWith((x) => -x)).toBe(null);
            expect(iterplus([3, 5, 1, 4, 2]).maxWith((x) => -x)).toBe(1);
            expect(
                iterplus(["a1", "b1", "c1", "b2", "c2"]).maxWith((x) => x[0])
            ).toBe("c1");
            expect(
                iterplus(["a1", "b1", "c1", "b2", "c2"]).maxWith(
                    (x) => x[0],
                    true
                )
            ).toBe("c2");
        });
    });

    describe(".max", () => {
        it("works normally", () => {
            expect(iterplus([]).max()).toBe(null);
            expect(iterplus([3, 5, 1, 4, 2]).max()).toBe(5);
        });
    });

    describe(".minBy", () => {
        it("works normally", () => {
            expect(
                iterplus([] as string[]).minBy((a, b) => b.localeCompare(a))
            ).toBe(null);
            expect(
                iterplus(["e", "a", "b", "d", "c"]).minBy((a, b) =>
                    b.localeCompare(a)
                )
            ).toBe("e");
            expect(
                iterplus(["a1", "b1", "c1", "a2", "c2"]).minBy((a, b) =>
                    a[0].localeCompare(b[0])
                )
            ).toBe("a1");
            expect(
                iterplus(["a1", "b1", "c1", "a2", "c2"]).minBy(
                    (a, b) => a[0].localeCompare(b[0]),
                    true
                )
            ).toBe("a2");
        });
    });

    describe(".minWith", () => {
        it("works normally", () => {
            expect(iterplus([] as number[]).minWith((x) => -x)).toBe(null);
            expect(iterplus([3, 5, 1, 4, 2]).minWith((x) => -x)).toBe(5);
            expect(
                iterplus(["a1", "b1", "c1", "a2", "c2"]).minWith((x) => x[0])
            ).toBe("a1");
            expect(
                iterplus(["a1", "b1", "c1", "a2", "c2"]).minWith(
                    (x) => x[0],
                    true
                )
            ).toBe("a2");
        });
    });

    describe(".min", () => {
        it("works normally", () => {
            expect(iterplus([]).min()).toBe(null);
            expect(iterplus([3, 5, 1, 4, 2]).min()).toBe(1);
        });
    });

    describe(".nth", () => {
        it("works normally", () => {
            const iter = iterplus([1, 2, 3, 4, 5]);
            expect(iterplus([1, 2, 3]).nth(3)).toBe(nullVal);
            expect(iterplus([1, 2, 3]).nth(-1)).toBe(nullVal);
            expect(iter.nth(2)).toBe(3);
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".partition", () => {
        it("works normally", () => {
            expect(
                iterplus([1, 2, 3, 4, 5]).partition((x) => x % 2 == 0)
            ).toEqual([
                [2, 4],
                [1, 3, 5],
            ]);
            expect(iterplus([]).partition((x) => x % 2 == 0)).toEqual([[], []]);
        });
    });

    describe(".peekable", () => {
        it("works normally", () => {
            const iter = iterplus([1, 2, 3]).peekable();
            expect(iter.peek().value).toBe(1);
            expect(iter.peek().value).toBe(1);
            expect(iter.peek().done).toBe(false);
            expect(iter.next().value).toBe(1);
            expect(iter.next().value).toBe(2);
            expect(iter.peek().value).toBe(3);
            expect(iter.peek().done).toBe(false);
            expect(iter.next().value).toBe(3);
            expect(iter.peek().done).toBe(true);
            expect(iter.peek().done).toBe(true);
            expect(iter.next().done).toBe(true);
        });
    });

    describe(".findIndex", () => {
        it("works normally", () => {
            expect(iterplus([1, 2, 3, 4, 5]).findIndex((x) => x == 3)).toBe(2);
            expect(iterplus([1, 2, 3, 4, 5]).findIndex((x) => x == 6)).toBe(-1);
        });

        it("short circuits", () => {
            const iter = iterplus([1, 2, 3, 4, 5]);
            expect(iter.findIndex((x) => x == 3)).toBe(2);
            expectIter(iter).toEqual([4, 5]);
        });
    });

    describe(".product", () => {
        it("works normally", () => {
            expect(iterplus([1, 2, 3, 4, 5]).product()).toBe(120);
            expect(
                iterplus([1, 2, 3, 4, 5].map((v) => BigInt(v))).product()
            ).toBe(BigInt(120));
            expect(iterplus([] as number[]).product()).toBe(1);
        });
    });

    describe(".sum", () => {
        it("works normally", () => {
            expect(iterplus([1, 2, 3, 4, 5]).sum()).toBe(15);
            expect(iterplus([1, 2, 3, 4, 5].map((v) => BigInt(v))).sum()).toBe(
                BigInt(15)
            );
            expect(iterplus(["foo", "bar", "baz"]).sum()).toBe("foobarbaz");
            expect(iterplus([] as number[]).sum()).toBe(0);
        });
    });

    describe(".reverse", () => {
        it("works normally", () => {
            expectIter(iterplus([1, 2, 3, 4, 5]).reverse()).toEqual([
                5,
                4,
                3,
                2,
                1,
            ]);
            expectIter(iterplus([]).reverse()).toEqual([]);
        });
    });

    describe(".skip", () => {
        it("works normally", () => {
            expectIter(iterplus([1, 2, 3, 4, 5]).skip(-2)).toEqual([
                1,
                2,
                3,
                4,
                5,
            ]);
            expectIter(iterplus([1, 2, 3, 4, 5]).skip(2)).toEqual([3, 4, 5]);
            expectIter(iterplus([1, 2, 3, 4, 5]).skip(7)).toEqual([]);
        });
    });

    describe(".skipWhile", () => {
        it("works normally", () => {
            expectIter(
                iterplus([1, 2, 3, 4, 5]).skipWhile((x) => x == 0)
            ).toEqual([1, 2, 3, 4, 5]);
            expectIter(
                iterplus([1, 2, 3, 4, 5]).skipWhile((x) => x != 3)
            ).toEqual([3, 4, 5]);
            expectIter(
                iterplus([1, 2, 3, 4, 5]).skipWhile((x) => x <= 5)
            ).toEqual([]);
        });
    });

    describe(".take", () => {
        it("works normally", () => {
            expectIter(iterplus([1, 2, 3, 4, 5]).take(7)).toEqual([
                1,
                2,
                3,
                4,
                5,
            ]);
            expectIter(iterplus([1, 2, 3, 4, 5]).take(3)).toEqual([1, 2, 3]);
            expectIter(iterplus([1, 2, 3, 4, 5]).take(-2)).toEqual([]);
        });
    });

    describe(".takeWhile", () => {
        it("works normally", () => {
            expectIter(
                iterplus([1, 2, 3, 4, 5]).takeWhile((x) => x < 7)
            ).toEqual([1, 2, 3, 4, 5]);
            expectIter(
                iterplus([1, 2, 3, 4, 5]).takeWhile((x) => x < 4)
            ).toEqual([1, 2, 3]);
            expectIter(
                iterplus([1, 2, 3, 4, 5]).takeWhile((x) => x == 2)
            ).toEqual([]);
        });
    });

    describe(".unzip", () => {
        it("works normally", () => {
            expectIter(
                iterplus([
                    [1, "a", 5],
                    [2, "b", 6],
                    [3, "c", 7],
                ]).unzip()
            ).toEqual([
                [1, 2, 3],
                ["a", "b", "c"],
                [5, 6, 7],
            ]);
            expectIter(iterplus([[1, "a"], [2, "b", 6], [3]]).unzip()).toEqual([
                [1, 2, 3],
                ["a", "b"],
                [6],
            ]);
        });
    });

    describe(".zipWith", () => {
        it("works normally", () => {
            const other = iterplus([4, 5, 6, 7, 8]);
            expectIter(
                iterplus([1, 2, 3]).zipWith((a, b) => a + b, other)
            ).toEqual([5, 7, 9]);
            expectIter(other).toEqual([7, 8]);
            expectIter(
                iterplus("abc").zipWith((a, b, c) => a + b + c, "def", "ghi")
            ).toEqual(["adg", "beh", "cfi"]);
        });
    });

    describe(".zip", () => {
        it("works normally", () => {
            const other = iterplus([4, 5, 6, 7, 8]);
            expectIter(iterplus([1, 2, 3]).zip(other)).toEqual([
                [1, 4],
                [2, 5],
                [3, 6],
            ]);
            expectIter(other).toEqual([7, 8]);
            expectIter(iterplus("abc").zip("def", "ghi")).toEqual(
                ["adg", "beh", "cfi"].map((v) => v.split(""))
            );
        });
    });

    describe(".tee", () => {
        it("works normally", () => {
            const iter = iterplus([1, 2, 3]);
            const [a, b, c] = iter.tee(3);
            expect(a.next().value).toBe(1);
            expect(b.next().value).toBe(1);
            expectIter(a).toEqual([2, 3]);
            expectIter(b).toEqual([2, 3]);
            expectIter(c).toEqual([1, 2, 3]);
        });
    });
});
