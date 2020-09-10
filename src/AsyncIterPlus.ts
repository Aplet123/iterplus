import {IterPlus as SyncIterPlus} from "./IterPlus";

/**
 * Tests if an object is an iterator.
 * @param obj The object to test for.
 * @returns If `obj` is an iterator.
 */
export function isAsyncIter(obj: any): obj is AsyncIterator<unknown> {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.next === "function"
    );
}

/**
 * Tests if an object is iterable.
 * @param obj The object to test for.
 * @returns If `obj` is an iterable.
 */
export function canAsyncIter(obj: any): obj is AsyncIterable<unknown> {
    return (
        //typeof obj === "string" ||
        typeof obj === "object" && obj !== null && Symbol.asyncIterator in obj
    );
}

/**
 * Dirty workaround for Prettier moving comments.
 */
type CurIter<T> = AsyncIterator<T>;

/**
 * Dirty workaround for Prettier moving comments.
 */
type CurIterable<T> = AsyncIterable<T>;

/**
 * Typescript-abusing type that wraps every type in a tuple type with an array.
 */
type ArrayMap<T extends unknown[]> = {
    [K in keyof T]: T[K][];
};

/**
 * Typescript-abusing type that wraps every type in a tuple type with an Iterable.
 */
type AsyncIterableMap<T extends unknown[]> = {
    [K in keyof T]: CurIterable<T[K]>;
};

/**
 * The value of null to use.
 *
 * Defaults to `null`.
 */
// export const nullVal = "this is for testing purposes";
import {nullVal} from "./IterPlus";
/**
 * The type of null to use.
 */
//export type AsyncNull = typeof asyncNullVal;
import {Null} from "./IterPlus";

/**
 * A wrapper around an iterator to add additional functionality. The types intentionally ignore return value.
 *
 * Many of the methods consume elements of the iterator,
 * so use `tee` the iterator into two first if you want to preserve elements.
 *
 * @typeParam T The item type of the iterator.
 */
export class AsyncIterPlus<T> implements CurIter<T>, AsyncIterable<T> {
    /**
     * The internal iterator that this wraps around.
     */
    protected internal: AsyncIterator<T>;

    /**
     * Instantiates an `IterPlus` from any iterator.
     *
     * @param iter The iterator to wrap around.
     */
    constructor(iter: AsyncIterator<T>) {
        this.internal = iter;
    }

    /**
     * Yields the next element in the iterator.
     *
     * @returns The next element.
     */
    async next(): Promise<IteratorResult<T>> {
        return await this.internal.next();
    }

    /**
     * Makes the iterator work as an iterable.
     *
     * @returns The same iterator.
     */
    [Symbol.asyncIterator](): AsyncIterator<T> {
        return this;
    }

    // ==== STATIC METHODS ====
    /**
     * Generates an empty iterator.
     *
     * @typeParam T The item yielded by the iterator.
     * @returns The generated iterator.
     */
    static empty<T>(): AsyncIterPlus<T> {
        async function* ret() {}
        return new AsyncIterPlus<T>(ret());
    }

    /**
     * Generates an iterator that yields values from a function and ends once the function returns null.
     *
     * @param func The function to yield values, or null to end the iterator.
     * @returns The generated iterator.
     */
    static fromFunction<T>(func: () => Promise<T | Null>): AsyncIterPlus<T> {
        async function* ret() {
            while (true) {
                const val = await func();
                if (val === nullVal) {
                    break;
                }
                yield val;
            }
        }
        return new AsyncIterPlus<T>(ret());
    }

    /**
     * Generates an iterator that lazily yields a single value.
     *
     * @param func The function to generate a single value.
     * @returns The generated iterator.
     */
    static onceWith<T>(func: () => Promise<T>): AsyncIterPlus<T> {
        async function* ret() {
            yield await func();
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Generates an iterator that yields a single value.
     *
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static once<T>(val: Promise<T>): AsyncIterPlus<T> {
        async function* ret() {
            yield await val;
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Generates an iterator that endlessly calls a function.
     *
     * @param func The function to generate values.
     * @returns The generated iterator.
     */
    static repeatWith<T>(func: () => Promise<T>): AsyncIterPlus<T> {
        async function* ret() {
            while (true) {
                yield await func();
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Generates an iterator that endlessly repeats a value.
     *
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static repeat<T>(val: Promise<T>): AsyncIterPlus<T> {
        async function* ret() {
            while (true) {
                yield await val;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Generates an iterator that generates values based on the previous value.
     *
     * @param first The initial value.
     * @param func The function to generate new values.
     * @returns The generated iterator.
     */
    static successors<T>(
        first: T | Null,
        func: (prev: T) => T | Null
    ): AsyncIterPlus<T> {
        async function* ret() {
            while (true) {
                if (first === nullVal) {
                    break;
                }
                yield first;
                first = func(first);
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Generates an iterator that cycles through an iterable.
     *
     * While this **does** work on infinite iterators,
     * it should be avoided as it stores all elements,
     * leading to an ever-growing memory usage.
     *
     * @param data The iterable to cycle through.
     * @returns The generated iterator.
     */
    static cycle<T>(data: AsyncIterable<T>): AsyncIterPlus<T> {
        async function* ret() {
            const cache = [];
            for await (const item of data) {
                yield item;
                cache.push(item);
            }
            while (true) {
                yield* cache;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Generates an iterator that iterates through lexicographically sorted combinations without repetition of a dataset.
     *
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinations<T>(
        data: T[],
        count: number = data.length
    ): AsyncIterPlus<T[]> {
        async function* ret() {
            if (count > data.length || count <= 0) {
                return;
            }
            const indices: number[] = [];
            for (let i = 0; i < count; i++) {
                indices.push(i);
            }
            while (true) {
                yield indices.map((v) => data[v]);
                let i;
                for (i = 0; i < indices.length; i++) {
                    if (indices[indices.length - i - 1] < data.length - i - 1) {
                        indices[indices.length - i - 1]++;
                        break;
                    }
                }
                if (i == indices.length) {
                    break;
                }
                i--;
                while (i >= 0) {
                    indices[indices.length - i - 1] =
                        indices[indices.length - i - 2] + 1;
                    i--;
                }
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Generates an iterator that iterates through lexicographically sorted combinations with repetition of a dataset.
     *
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinationsWithRepetition<T>(
        data: T[],
        count: number = data.length
    ): AsyncIterPlus<T[]> {
        async function* ret() {
            if (data.length <= 0 || count <= 0) {
                return;
            }
            const indices: number[] = [];
            for (let i = 0; i < count; i++) {
                indices.push(0);
            }
            while (true) {
                yield indices.map((v) => data[v]);
                let i;
                for (i = 0; i < indices.length; i++) {
                    if (indices[indices.length - i - 1] < data.length - 1) {
                        indices[indices.length - i - 1]++;
                        break;
                    }
                }
                if (i == indices.length) {
                    break;
                }
                i--;
                while (i >= 0) {
                    indices[indices.length - i - 1] =
                        indices[indices.length - i - 2];
                    i--;
                }
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Generates an iterator that iterates through lexicographically sorted permutations without repetition of a dataset.
     *
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutations<T>(
        data: T[],
        count: number = data.length
    ): AsyncIterPlus<T[]> {
        async function* ret() {
            if (count > data.length || count <= 0) {
                return;
            }
            const indices: number[] = [];
            const cycles: number[] = [];
            for (let i = 0; i < data.length; i++) {
                indices.push(i);
            }
            for (let i = data.length; i > data.length - count; i--) {
                cycles.push(i);
            }
            yield indices.slice(0, count).map((v) => data[v]);
            while (true) {
                let i;
                for (i = count - 1; i >= 0; i--) {
                    cycles[i]--;
                    if (cycles[i] == 0) {
                        const first = indices[i];
                        for (let j = i; j < indices.length - 1; j++) {
                            indices[j] = indices[j + 1];
                        }
                        indices[indices.length - 1] = first;
                        cycles[i] = data.length - i;
                    } else {
                        const temp = indices[i];
                        indices[i] = indices[indices.length - cycles[i]];
                        indices[indices.length - cycles[i]] = temp;
                        yield indices.slice(0, count).map((v) => data[v]);
                        break;
                    }
                }
                if (i < 0) {
                    return;
                }
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Generates an iterator that iterates through lexicographically sorted permutations with repetition of a dataset.
     *
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutationsWithRepetition<T>(
        data: T[],
        count: number = data.length
    ): AsyncIterPlus<T[]> {
        async function* ret() {
            if (data.length <= 0 || count <= 0) {
                return;
            }
            const indices: number[] = [];
            for (let i = 0; i < count; i++) {
                indices.push(0);
            }
            while (true) {
                yield indices.map((v) => data[v]);
                let i;
                for (i = 0; i < indices.length; i++) {
                    if (indices[indices.length - i - 1] < data.length - 1) {
                        indices[indices.length - i - 1]++;
                        break;
                    }
                }
                if (i == indices.length) {
                    break;
                }
                i--;
                while (i >= 0) {
                    indices[indices.length - i - 1] = 0;
                    i--;
                }
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Generates an iterator that generates a lexicographically sorted cartesian product.
     *
     * @param data The iterators to take the product of.
     * @returns The generated iterator.
     */
    static product<T extends unknown[]>(
        ...data: ArrayMap<T>
    ): AsyncIterPlus<T> {
        async function* ret() {
            if (data.length <= 0) {
                return;
            }
            const indices: number[] = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].length == 0) {
                    return;
                }
                indices.push(0);
            }
            while (true) {
                yield indices.map((v, i) => data[i][v]) as T;
                let i;
                for (i = 0; i < indices.length; i++) {
                    if (
                        indices[data.length - i - 1] <
                        data[data.length - i - 1].length - 1
                    ) {
                        indices[data.length - i - 1]++;
                        break;
                    }
                }
                if (i == indices.length) {
                    break;
                }
                i--;
                while (i >= 0) {
                    indices[data.length - i - 1] = 0;
                    i--;
                }
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Checks if every element in the iterator matches a predicate.
     *
     * This function is short-circuiting,
     * so if any element returns `false`,
     * the function immediately returns `false`.
     *
     * @param pred The predicate function.
     * @returns If every element satisfies the predicate.
     */
    async every(pred: (elem: T) => Promise<boolean>): Promise<boolean> {
        for await (const elem of this) {
            if (!(await pred(elem))) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if some element in the iterator matches a predicate.
     *
     * This function is short-circuiting,
     * so if any element returns `true`,
     * the function immediately returns `true`.
     *
     * @param pred The predicate function.
     * @returns If some element satisfies the predicate.
     */
    async some(pred: (elem: T) => boolean): Promise<boolean> {
        for await (const elem of this) {
            if (await pred(elem)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Concatenates one or more iterables to this iterator,
     * creating an iterator that yields their elements in sequentual order.
     *
     * @param iters The iterables to chain to this one.
     * @returns The generated iterator.
     */
    concat(...iters: AsyncIterable<T>[]): AsyncIterPlus<T> {
        const that = this;
        async function* ret() {
            for (const iter of [that, ...iters]) {
                for await (const val of iter) {
                    yield val;
                }
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Lexicographically compares this iterator with another using a comparison function.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @typeParam O The type of the other iterator.
     * @param other Iterable to compare to.
     * @param cmp A function that should return a negative for less than, zero for equal to,
     * and positive for greater than.
     * @returns -1 if this is less than the other, 0 if it's equal, and 1 if it's greater than.
     */
    async compareBy<O>(
        other: AsyncIterable<O>,
        cmp: (first: T, second: O) => Promise<number>
    ): Promise<number> {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (a.done && b.done) {
                return 0;
            } else if (a.done) {
                return -1;
            } else if (b.done) {
                return 1;
            } else {
                const diff = await cmp(a.value, b.value);
                if (diff < 0) {
                    return -1;
                } else if (diff > 0) {
                    return 1;
                }
            }
        }
    }

    /**
     * Lexicographically compares this iterator with another using a key.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @typeParam K The type of the key.
     * @param other Iterable to compare to.
     * @param key Function to generate a key to compare with from an element.
     * @returns -1 if this is less than the other, 0 if it's equal, and 1 if it's greater than.
     */
    async compareWith<K>(
        other: AsyncIterable<T>,
        key: (elem: T) => Promise<K>
    ): Promise<number> {
        return this.compareBy(other, async function (a, b) {
            const ak = await key(a);
            const bk = await key(b);
            if (ak < bk) {
                return -1;
            }
            if (ak > bk) {
                return 1;
            }
            return 0;
        });
    }

    /**
     * Lexicographically compares this iterator with another.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @param other Iterable to compare to.
     * @returns -1 if this is less than the other, 0 if it's equal, and 1 if it's greater than.
     */
    async compare(other: AsyncIterable<T>): Promise<number> {
        return this.compareBy(other, async function (a, b) {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });
    }

    /**
     * Collects the items in this iterator into an array.
     *
     * @returns An array with the items in the iterator.
     */
    async collect(): Promise<T[]> {
        const ret: T[] = [];
        for await (const item of this) {
            ret.push(item);
        }
        return ret;
    }

    /**
     * Counts the number of items in this iterator.
     *
     * @returns The number of items in the iterator.
     */
    async count(): Promise<number> {
        let ret: number = 0;
        for await (const item of this) {
            ret++;
        }
        return ret;
    }

    /**
     * Generates an iterator that yields a 2 element array with the index and the element.
     *
     * @returns The generated iterator.
     */
    enumerate(): AsyncIterPlus<[number, T]> {
        const that = this;
        async function* ret() {
            let count = 0;
            for await (const item of that) {
                yield [count, item] as [number, T];
                count++;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Checks if this iterator is equal to another using a comparison function.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @typeParam O The type of the other iterable.
     * @param other Iterable to compare to.
     * @param cmp A function that checks if elements are equal.
     * @returns If the two iterators are equal.
     */
    async equalsBy<O>(
        other: AsyncIterable<O>,
        cmp: (first: T, second: O) => Promise<boolean>
    ): Promise<boolean> {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (a.done && b.done) {
                return true;
            } else if (a.done || b.done) {
                return false;
            } else {
                const eq = await cmp(a.value, b.value);
                if (!eq) {
                    return false;
                }
            }
        }
    }

    /**
     * Checks if this iterator is equal to another using a key.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @typeParam K The type of the key.
     * @param other Iterable to compare to.
     * @param key Function to generate a key to compare with from an element.
     * @returns If the two iterators are equal.
     */
    async equalsWith<K>(
        other: AsyncIterable<T>,
        key: (elem: T) => Promise<K>
    ): Promise<boolean> {
        return this.equalsBy(other, async function (a, b) {
            const ak = await key(a);
            const bk = await key(b);
            return ak == bk;
        });
    }

    /**
     * Checks if this iterator is equal to another.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @param other Iterable to compare to.
     * @returns If the two iterators are equal.
     */
    async equals(other: AsyncIterable<T>): Promise<boolean> {
        return this.equalsBy(other, async function (a, b) {
            return a == b;
        });
    }

    /**
     * Generates an iterator that only yields elements that match a predicate.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    filter(pred: (elem: T) => Promise<boolean>): AsyncIterPlus<T> {
        const that = this;
        async function* ret() {
            for await (const elem of that) {
                if (await pred(elem)) {
                    yield elem;
                }
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Generates a mapped iterator that yields non-null elements.
     *
     * @typeParam K The resulting type.
     * @typeParam N The type of the null value.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    filterMap<K>(func: (elem: T) => Promise<K | Null>): AsyncIterPlus<K> {
        const that = this;
        async function* ret() {
            for await (const elem of that) {
                const val = await func(elem);
                if (val !== nullVal) {
                    yield val as K;
                }
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Finds an element that satisfies a predicate.
     *
     * This function is short-circuiting,
     * so it stops on the first match.
     *
     * @param pred The predicate function.
     * @returns The element, or null if none was found.
     */
    async find(pred: (elem: T) => Promise<boolean>): Promise<T | Null> {
        for await (const elem of this) {
            if (await pred(elem)) {
                return elem;
            }
        }
        return nullVal;
    }

    /**
     * Runs a function on every element and returns the first non-null element.
     *
     * This function is short-circuiting,
     * so it stops on the first match.
     *
     * @typeParam K The resulting type.
     * @typeParam N The type of the null value.
     * @param func The mapping function.
     * @returns The element, or null if none was found.
     */
    async findMap<K>(func: (elem: T) => Promise<K | Null>): Promise<K | Null> {
        for await (const elem of this) {
            const val = await func(elem);
            if (val !== nullVal) {
                return val as K;
            }
        }
        return nullVal;
    }

    /**
     * Flattens an iterator of iterables,
     * yielding an iterator that sequentially produces their elements.
     *
     * @typeParam K The internal type.
     * @returns The generated iterator.
     */
    flatten<K>(this: AsyncIterPlus<AsyncIterable<K>>): AsyncIterPlus<K> {
        const that = this;
        async function* ret() {
            for await (const iterable of that) {
                yield* iterable;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Lazily maps an iterator, creating a new iterator where each element has been modified by a function.
     *
     * If you want to immediately run a function on all elements of the iterator, use `forEach` instead.
     *
     * @typeParam K The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    map<K>(func: (elem: T) => Promise<K>): AsyncIterPlus<K> {
        const that = this;
        async function* ret() {
            for await (const elem of that) {
                yield await func(elem);
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Maps then flattens an iterator.
     *
     * @typeParam K The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    flatMap<K>(func: (elem: T) => Promise<AsyncIterable<K>>): AsyncIterPlus<K> {
        return this.map(func).flatten();
    }

    /**
     * Runs a function for every element of the iterator, keeping track of an accumulator.
     *
     * @typeParam A The type of the accumulator.
     * @param func The reducing function.
     * @param initializer The initial accumulator.
     * @returns The final accumulator.
     */
    async reduce<A>(
        func: (accum: A, elem: T) => Promise<A>,
        initializer: A
    ): Promise<A>;
    /**
     * Runs a function for every element of the iterator, keeping track of an accumulator.
     *
     * @param func The reducing function.
     * @param initializer The initial accumulator.
     * If not provided, the first element of the iterator will be used instead,
     * and the first element will be skipped over in the reduction.
     * If an initializer is not provided and the iterator is empty,
     * then an error will be thrown.
     * @returns The final accumulator.
     */
    reduce(
        func: (accum: T, elem: T) => Promise<T>,
        initializer?: T
    ): Promise<T>;
    async reduce<A>(
        func: (accum: A, elem: T) => Promise<A>,
        initializer: A
    ): Promise<A> {
        let accum: A;
        if (initializer === undefined) {
            const next = await this.next();
            if (next.done) {
                throw new TypeError(
                    "Reduce of empty iterator with no initializer."
                );
            }
            accum = (next.value as unknown) as A;
        } else {
            accum = initializer as A;
        }
        for await (const elem of this) {
            accum = await func(accum, elem);
        }
        return accum;
    }

    /**
     * Runs a function on each element of an iterator.
     *
     * This is equivalent to running a for loop on the iterator.
     * If you want to obtain the values, consider using `.map(func).collect()` instead.
     *
     * @param func The function to run.
     */
    async forEach(func: (elem: T) => Promise<unknown>): Promise<void> {
        for await (const elem of this) {
            await func(elem);
        }
    }

    /**
     * Generates an iterator that is guaranteed to never yield a value after finishing.
     *
     * @returns The generated iterator.
     */
    fuse(): AsyncIterPlus<T> {
        const that = this;
        async function* ret() {
            for await (const elem of that) {
                yield elem;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Lazily runs functions on an iterator, returning a new iterator with unmodified elements.
     *
     * This function is primarily used as a debugging tool to inspect elements in the middle of an iterator function chain.
     *
     * @param func The function to call.
     * @returns The generated iterator.
     */
    inspect(func: (elem: T) => Promise<unknown>): AsyncIterPlus<T> {
        const that = this;
        async function* ret() {
            for await (const elem of that) {
                await func(elem);
                yield elem;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Determines if an iterator is partitioned by a predicate
     * (Items that return true come before items that return false).
     *
     * This function is short-circuiting,
     * so it stops on the first non-partitioned element.
     *
     * @param pred The predicate function.
     * @returns If the iterator is partitioned.
     */
    async isPartitioned(pred: (elem: T) => Promise<boolean>): Promise<boolean> {
        let seenFalse = false;
        for await (const elem of this) {
            if (await pred(elem)) {
                if (seenFalse) {
                    return false;
                }
            } else {
                seenFalse = true;
            }
        }
        return true;
    }

    /**
     * Determines if an iterator is sorted increasingly by a comparison function.
     *
     * This function is short-circuiting,
     * so it stops on the first non-sorted element.
     *
     * @param cmp A function that should return a negative for less than, zero for equal to,
     * and positive for greater than.
     * @returns If the iterator is sorted.
     */
    async isSortedBy(
        cmp: (first: T, second: T) => Promise<number>
    ): Promise<boolean> {
        const first = await this.next();
        if (first.done) {
            return true;
        }
        let prev = first.value;
        for await (const elem of this) {
            if ((await cmp(prev, elem)) > 0) {
                return false;
            }
            prev = elem;
        }
        return true;
    }

    /**
     * Determines if an iterator is sorted increasingly by a key.
     *
     * This function is short-circuiting,
     * so it stops on the first non-sorted element.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @returns If the iterator is sorted.
     */
    async isSortedWith<K>(key: (elem: T) => Promise<K>): Promise<boolean> {
        const first = await this.next();
        if (first.done) {
            return true;
        }
        let prev = await key(first.value);
        for await (const elem of this) {
            const elKey = await key(elem);
            if (prev > elKey) {
                return false;
            }
            prev = elKey;
        }
        return true;
    }

    /**
     * Determines if an iterator is sorted increasingly.
     *
     * This function is short-circuiting,
     * so it stops on the first non-sorted element.
     *
     * @returns If the iterator is sorted.
     */
    isSorted(): Promise<boolean> {
        return this.isSortedWith(async (x) => x);
    }

    /**
     * Finds the last element in an iterator.
     *
     * @returns The last element of the iterator, or null if the iterator is empty.
     */
    async last(): Promise<T | Null> {
        let last: T | Null = nullVal;
        for await (const elem of this) {
            last = elem;
        }
        return last;
    }

    /**
     * Lazily maps an iterator until it encounters null.
     *
     * @typeParam K The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    mapWhile<K>(func: (elem: T) => Promise<K | Null>): AsyncIterPlus<K> {
        const that = this;
        async function* ret() {
            for await (const elem of that) {
                const val = await func(elem);
                if (val === null) {
                    break;
                }
                yield val as K;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Finds the maximum value of an iterator with a comparison function.
     *
     * @param cmp A function that should return a negative for less than, zero for equal to,
     * and positive for greater than.
     * @param overwrite If `true`, elements will be counted as the new maximum if they are equal to the maximum.
     * Defaults to `false`.
     * @returns The maximum element, or null if the iterator is empty.
     */
    async maxBy(
        cmp: (first: T, second: T) => Promise<number>,
        overwrite: boolean = false
    ): Promise<T | null> {
        const next = await this.next();
        if (next.done) {
            return null;
        }
        let curMax = next.value;
        for await (const elem of this) {
            const diff = await cmp(elem, curMax);
            if (diff > 0 || (overwrite && diff == 0)) {
                curMax = elem;
            }
        }
        return curMax;
    }

    /**
     * Finds the maximum value of an iterator with a key.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @param overwrite If `true`, elements will be counted as the new maximum if they are equal to the maximum.
     * Defaults to `false`.
     * @returns The maximum element, or null if the iterator is empty.
     */
    async maxWith<K>(
        key: (elem: T) => Promise<K>,
        overwrite: boolean = false
    ): Promise<T | null> {
        const next = await this.next();
        if (next.done) {
            return null;
        }
        let curMax = next.value;
        let curMaxKey: K = await key(curMax);
        for await (const elem of this) {
            const elemKey = await key(elem);
            if (elemKey > curMaxKey || (overwrite && elemKey == curMaxKey)) {
                curMax = elem;
                curMaxKey = elemKey;
            }
        }
        return curMax;
    }

    /**
     * Finds the maximum value of an iterator.
     *
     * @param overwrite If `true`, elements will be counted as the new maximum if they are equal to the maximum.
     * Defaults to `false`.
     * @returns The maximum element, or null if the iterator is empty.
     */
    max(overwrite: boolean = false): Promise<T | null> {
        return this.maxWith(async (x) => x, overwrite);
    }

    /**
     * Finds the minimum value of an iterator with a comparison function.
     *
     * @param cmp A function that should return a negative for less than, zero for equal to,
     * and positive for greater than.
     * @param overwrite If `true`, elements will be counted as the new minimum if they are equal to the minimum.
     * Defaults to `false`.
     * @returns The minimum element, or null if the iterator is empty.
     */
    async minBy(
        cmp: (first: T, second: T) => Promise<number>,
        overwrite: boolean = false
    ): Promise<T | null> {
        const next = await this.next();
        if (next.done) {
            return null;
        }
        let curMax = next.value;
        for await (const elem of this) {
            const diff = await cmp(elem, curMax);
            if (diff < 0 || (overwrite && diff == 0)) {
                curMax = elem;
            }
        }
        return curMax;
    }

    /**
     * Finds the minimum value of an iterator with a key.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @param overwrite If `true`, elements will be counted as the new minimum if they are equal to the minimum.
     * Defaults to `false`.
     * @returns The minimum element, or null if the iterator is empty.
     */
    async minWith<K>(
        key: (elem: T) => Promise<K>,
        overwrite: boolean = false
    ): Promise<T | null> {
        const next = await this.next();
        if (next.done) {
            return null;
        }
        let curMax = next.value;
        let curMaxKey: K = await key(curMax);
        for await (const elem of this) {
            const elemKey = await key(elem);
            if (elemKey < curMaxKey || (overwrite && elemKey == curMaxKey)) {
                curMax = elem;
                curMaxKey = elemKey;
            }
        }
        return curMax;
    }

    /**
     * Finds the minimum value of an iterator.
     *
     * @param overwrite If `true`, elements will be counted as the new minimum if they are equal to the minimum.
     * Defaults to `false`.
     * @returns The minimum element, or null if the iterator is empty.
     */
    min(overwrite: boolean = false): Promise<T | null> {
        return this.minWith(async (x) => x, overwrite);
    }

    /**
     * Finds the nth element in an iterator.
     *
     * @param n The number element to get.
     * @returns The nth element of the iterator, or null if the iterator is too short.
     */
    async nth(n: number): Promise<T | Null> {
        if (n < 0) {
            return nullVal;
        }
        for await (const elem of this) {
            if (n <= 0) {
                return elem;
            }
            n--;
        }
        return nullVal;
    }

    /**
     * Partitions an iterator into two groups.
     *
     * @param pred The predicate function.
     * @returns An array with two elements:
     *  - The elements where the predicate returned true.
     *  - The elements where the predicate returned false.
     */
    async partition(pred: (elem: T) => Promise<boolean>): Promise<[T[], T[]]> {
        const truePart: T[] = [];
        const falsePart: T[] = [];
        for await (const elem of this) {
            if (await pred(elem)) {
                truePart.push(elem);
            } else {
                falsePart.push(elem);
            }
        }
        return [truePart, falsePart];
    }

    /**
     * Generates a `Peekable` iterator.
     *
     * @returns The peekable iterator.
     */
    peekable(): AsyncPeekable<T> {
        return new AsyncPeekable(this);
    }

    /**
     * Finds the index of an element that satisfies a predicate.
     *
     * If you want to find the value and the index, consider using `enumerate`
     * then using `find`.
     *
     * This function is short-circuiting,
     * so it stops on the first match.
     *
     * @param pred The predicate function.
     * @returns The index, or -1 if none was found.
     */
    async findIndex(pred: (elem: T) => Promise<boolean>): Promise<number> {
        let count = 0;
        for await (const elem of this) {
            if (await pred(elem)) {
                return count;
            }
            count++;
        }
        return -1;
    }

    /**
     * Returns the product of all elements in the iterator.
     *
     * @returns The product, or 1 if the iterator is empty.
     */
    async product(
        this: AsyncIterPlus<number> | AsyncIterPlus<bigint>
    ): Promise<T> {
        let accum: any = 1;
        let typechecked = false;
        for await (const elem of this) {
            if (!typechecked) {
                if (typeof elem === "bigint") {
                    accum = BigInt(accum);
                }
                typechecked = true;
            }
            accum = accum * (elem as number);
        }
        return (accum as unknown) as T;
    }

    /**
     * Returns the sum of all elements in the iterator.
     *
     * @returns The sum, or 0 if the iterator is empty.
     */
    async sum(): Promise<
        T extends number ? number : T extends bigint ? bigint : string
    > {
        let accum: any;
        let typechecked = false;
        for await (const elem of this) {
            if (!typechecked) {
                if (typeof elem === "bigint") {
                    accum = BigInt(0);
                } else if (typeof elem === "number") {
                    accum = 0;
                } else {
                    accum = "";
                }
                typechecked = true;
            }
            accum += elem;
        }
        if (accum === undefined) {
            accum = 0;
        }
        return (accum as unknown) as T extends number
            ? number
            : T extends bigint
            ? bigint
            : string;
    }

    /**
     * Consumes the iterator and reverses it.
     *
     * This has to immediately resolve every element in the iterator,
     * so it is equivalent to collecting to an array and revsersing the array,
     * so it is very inefficient on memory and should be avoided.
     *
     * @returns The reversed iterator.
     */
    async reverse(): Promise<SyncIterPlus<T>> {
        const collected = await this.collect();
        return new SyncIterPlus(collected.reverse().values());
    }

    /**
     * Skips the first n elements of an iterator.
     *
     * @param n The number of elements to skip.
     * @returns The generated iterator.
     */
    skip(n: number): AsyncIterPlus<T> {
        const that = this;
        async function* ret() {
            for (let i = 0; i < n; i++) {
                const val = await that.next();
                if (val.done) {
                    return;
                }
            }
            yield* that;
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Skips elements of an iterator while a predicate is met.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    skipWhile(pred: (elem: T) => Promise<boolean>): AsyncIterPlus<T> {
        const that = this;
        async function* ret() {
            while (true) {
                const val = await that.next();
                if (val.done) {
                    return;
                }
                if (!pred(val.value)) {
                    yield val.value;
                    break;
                }
            }
            yield* that;
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Takes the first n elements of an iterator.
     *
     * @param n The number of elements to take.
     * @returns The generated iterator.
     */
    take(n: number): AsyncIterPlus<T> {
        const that = this;
        async function* ret() {
            for (let i = 0; i < n; i++) {
                const val = await that.next();
                if (val.done) {
                    return;
                }
                yield val.value;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Takes elements of an iterator while a predicate is met.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    takeWhile(pred: (elem: T) => Promise<boolean>): AsyncIterPlus<T> {
        const that = this;
        async function* ret() {
            while (true) {
                const val = await that.next();
                if (val.done) {
                    return;
                }
                if (!pred(val.value)) {
                    return;
                }
                yield val.value;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * "Unzips" an iterator of tuples into a tuple of arrays.
     *
     * @typeParam K The tuple type.
     * @returns A tuple with the individual elements.
     */
    async unzip<K extends unknown[]>(
        this: AsyncIterPlus<K>
    ): Promise<ArrayMap<K>> {
        const ret: any[][] = [];
        for await (const elem of this) {
            while (elem.length > ret.length) {
                ret.push([]);
            }
            for (let i = 0; i < elem.length; i++) {
                ret[i].push(elem[i]);
            }
        }
        return ret as ArrayMap<K>;
    }

    /**
     * Zips one or more iterables with this iterator using a function.
     *
     * Stops once any one of the iterators stop.
     *
     * @typeParam K The types of the other iterables.
     * @typeParam R The resulting value.
     * @param func The function to use when zipping.
     * @param iters The iterables to zip with this one.
     * @returns The generated iterator.
     */
    zipWith<K extends unknown[], R>(
        func: (...args: [T, ...K]) => R,
        ...iters: AsyncIterableMap<K>
    ): AsyncIterPlus<R> {
        const that = this;
        async function* ret() {
            const zippers = [
                that,
                ...iters.map((v) => v[Symbol.asyncIterator]()),
            ];
            while (true) {
                const tot = [];
                for (const iter of zippers) {
                    const val = await iter.next();
                    if (val.done) {
                        return;
                    }
                    tot.push(val.value);
                }
                yield func(...(tot as [T, ...K]));
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Zips one or more iterables with this iterator.
     *
     * @typeParam K The types of the other iterables.
     * @param iters The iterables to zip with this one.
     * @returns The generated iterator.
     */
    zip<K extends unknown[]>(
        ...iters: AsyncIterableMap<K>
    ): AsyncIterPlus<[T, ...K]> {
        return this.zipWith(Array.of, ...iters) as AsyncIterPlus<[T, ...K]>;
    }
}

/**
 * An iterator with a `peek`. method that can look one element in advance.
 *
 * Do not instantiate this directly, instead use the `peekable` method in `IterPlus` or `AsyncIterPlus`.
 *
 * @typeParam T The item type of the iterator.
 */
export class AsyncPeekable<T> extends AsyncIterPlus<T> {
    private storedVal:
        | {has: true; val: IteratorResult<T>}
        | {has: false; val: unknown};

    constructor(iter: AsyncIterator<T>) {
        super(iter);
        this.storedVal = {
            has: false,
            val: undefined,
        };
    }

    /**
     * Yields the next element in the iterator.
     *
     * @returns The next element.
     */
    async next(): Promise<IteratorResult<T>> {
        if (this.storedVal.has) {
            const ret = this.storedVal.val;
            this.storedVal = {
                has: false,
                val: undefined,
            };
            return ret;
        }
        return await this.internal.next();
    }

    /**
     * Peeks the next element in the iterator and does not consume it.
     *
     * @returns The next element.
     */
    async peek(): Promise<IteratorResult<T>> {
        if (this.storedVal.has) {
            return this.storedVal.val;
        }
        this.storedVal = {has: true, val: await this.internal.next()};
        return this.storedVal.val;
    }
}
