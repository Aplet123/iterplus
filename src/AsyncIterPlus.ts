import {IterPlus as SyncIterPlus} from "./IterPlus";
import {PromiseOrValue} from "./util";
import {CircularBuffer} from "./CircularBuffer";

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
// export const nullVal = null;
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
     * Returns the next value, or null if the iterator ended.
     *
     * @returns The next value, or null if the iterator ended.
     */
    async nextVal(): Promise<T | Null> {
        const elem = await this.internal.next();
        if (elem.done) {
            return nullVal;
        }
        return elem.value;
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
     * @typeParam T The item type of the iterator.
     * @param func The function to yield values, or null to end the iterator.
     * @returns The generated iterator.
     */
    static fromFunction<T>(
        func: () => PromiseOrValue<T | Null>
    ): AsyncIterPlus<T> {
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
     * @typeParam T The item type of the iterator.
     * @param func The function to generate a single value.
     * @returns The generated iterator.
     */
    static onceWith<T>(func: () => PromiseOrValue<T>): AsyncIterPlus<T> {
        async function* ret() {
            yield await func();
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Generates an iterator that yields a single value.
     *
     * @typeParam T The item type of the iterator.
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static once<T>(val: PromiseOrValue<T>): AsyncIterPlus<T> {
        async function* ret() {
            yield await val;
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Generates an iterator that endlessly calls a function.
     *
     * @typeParam T The item type of the iterator.
     * @param func The function to generate values.
     * @returns The generated iterator.
     */
    static repeatWith<T>(func: () => PromiseOrValue<T>): AsyncIterPlus<T> {
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
     * @typeParam T The item type of the iterator.
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static repeat<T>(val: PromiseOrValue<T>): AsyncIterPlus<T> {
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
     * @typeParam T The item type of the iterator.
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
     * @typeParam T The item type of the iterator.
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
     * @typeParam T The item type of the iterator.
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinations<T>(
        data: T[],
        count: number = data.length
    ): AsyncIterPlus<T[]> {
        async function* ret() {
            if (count > data.length || count < 0) {
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
                if (i === indices.length) {
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
     * @typeParam T The item type of the iterator.
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinationsWithRepetition<T>(
        data: T[],
        count: number = data.length
    ): AsyncIterPlus<T[]> {
        async function* ret() {
            if (data.length <= 0 || count < 0) {
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
                if (i === indices.length) {
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
     * @typeParam T The item type of the iterator.
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutations<T>(
        data: T[],
        count: number = data.length
    ): AsyncIterPlus<T[]> {
        async function* ret() {
            if (count > data.length || count < 0) {
                return;
            }
            if (count === 0) {
                yield [];
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
                    if (cycles[i] === 0) {
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
     * @typeParam T The item type of the iterator.
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutationsWithRepetition<T>(
        data: T[],
        count: number = data.length
    ): AsyncIterPlus<T[]> {
        async function* ret() {
            if (data.length <= 0 || count < 0) {
                return;
            }
            if (count === 0) {
                yield [];
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
                if (i === indices.length) {
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
     * Generates an iterator that iterates through the lexicographically sorted powerset of a dataset.
     *
     * @typeParam T The item type of the iterator.
     * @param data The data to get the powerset of.
     * @return The generated iterator.
     */
    static powerset<T>(data: T[]): AsyncIterPlus<T[]> {
        async function* ret() {
            for (let i = 0; i <= data.length; i++) {
                yield* AsyncIterPlus.combinations(data, i);
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Generates an iterator that generates a lexicographically sorted cartesian product.
     *
     * @typeParam T The item type of the iterator.
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
                if (data[i].length === 0) {
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
                if (i === indices.length) {
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
    async every(pred: (elem: T) => PromiseOrValue<boolean>): Promise<boolean> {
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
    async some(pred: (elem: T) => PromiseOrValue<boolean>): Promise<boolean> {
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
        cmp: (first: T, second: O) => PromiseOrValue<number>
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
        key: (elem: T) => PromiseOrValue<K>
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
        cmp: (first: T, second: O) => PromiseOrValue<boolean>
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
        key: (elem: T) => PromiseOrValue<K>
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
                const eq = (await key(a.value)) === (await key(b.value));
                if (!eq) {
                    return false;
                }
            }
        }
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
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (a.done && b.done) {
                return true;
            } else if (a.done || b.done) {
                return false;
            } else {
                const eq = a.value === b.value;
                if (!eq) {
                    return false;
                }
            }
        }
    }

    /**
     * Generates an iterator that only yields elements that match a predicate.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    filter(pred: (elem: T) => PromiseOrValue<boolean>): AsyncIterPlus<T> {
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
    filterMap<K>(
        func: (elem: T) => PromiseOrValue<K | Null>
    ): AsyncIterPlus<K> {
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
    async find(pred: (elem: T) => PromiseOrValue<boolean>): Promise<T | Null> {
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
    async findMap<K>(
        func: (elem: T) => PromiseOrValue<K | Null>
    ): Promise<K | Null> {
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
    flatten<K>(
        this: AsyncIterPlus<Iterable<K> | AsyncIterable<K>>
    ): AsyncIterPlus<K> {
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
    map<K>(func: (elem: T) => PromiseOrValue<K>): AsyncIterPlus<K> {
        const that = this;
        async function* ret() {
            for await (const elem of that) {
                yield await func(elem);
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Maps an iterator of iterables,
     * and calls a function with the contents of the iterable as the argument.
     *
     * @typeParam K The iterable type.
     * @typeParam R The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    starmap<K, R>(
        this: AsyncIterPlus<Iterable<K>>,
        func: (...args: K[]) => PromiseOrValue<R>
    ): AsyncIterPlus<R> {
        const that = this;
        async function* ret() {
            for await (const elem of that) {
                yield await func(...elem);
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
    flatMap<K>(
        func: (
            elem: T
        ) =>
            | Iterable<K>
            | AsyncIterable<K>
            | Promise<Iterable<K> | AsyncIterable<K>>
    ): AsyncIterPlus<K> {
        const that = this;
        async function* ret() {
            for await (const elem of that) {
                yield* await func(elem);
            }
        }
        return new AsyncIterPlus(ret());
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
        func: (accum: A, elem: T) => PromiseOrValue<A>,
        initializer: A
    ): Promise<A>;
    /**
     * Runs a function for every element of the iterator, keeping track of an accumulator.
     *
     * Uses the first element as the initial accumulator,
     * and it will be skipped over in the reduction.
     *
     * @param func The reducing function.
     * @throws If the iterator is empty,
     * then an error will be thrown.
     * @returns The final accumulator.
     */
    reduce(func: (accum: T, elem: T) => PromiseOrValue<T>): Promise<T>;
    async reduce<A>(
        func: (accum: A, elem: T) => PromiseOrValue<A>,
        initializer?: A
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
    async forEach(func: (elem: T) => PromiseOrValue<unknown>): Promise<void> {
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
    inspect(func: (elem: T) => PromiseOrValue<unknown>): AsyncIterPlus<T> {
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
    async isPartitioned(
        pred: (elem: T) => PromiseOrValue<boolean>
    ): Promise<boolean> {
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
        cmp: (first: T, second: T) => PromiseOrValue<number>
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
    async isSortedWith<K>(
        key: (elem: T) => PromiseOrValue<K>
    ): Promise<boolean> {
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
    mapWhile<K>(func: (elem: T) => PromiseOrValue<K | Null>): AsyncIterPlus<K> {
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
        cmp: (first: T, second: T) => PromiseOrValue<number>,
        overwrite: boolean = false
    ): Promise<T | null> {
        const next = await this.next();
        if (next.done) {
            return null;
        }
        let curMax = next.value;
        for await (const elem of this) {
            const diff = await cmp(elem, curMax);
            if (diff > 0 || (overwrite && diff === 0)) {
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
        key: (elem: T) => PromiseOrValue<K>,
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
            if (elemKey > curMaxKey || (overwrite && elemKey === curMaxKey)) {
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
    max(overwrite: boolean = false): Promise<T | Null> {
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
        cmp: (first: T, second: T) => PromiseOrValue<number>,
        overwrite: boolean = false
    ): Promise<T | null> {
        const next = await this.next();
        if (next.done) {
            return null;
        }
        let curMax = next.value;
        for await (const elem of this) {
            const diff = await cmp(elem, curMax);
            if (diff < 0 || (overwrite && diff === 0)) {
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
        key: (elem: T) => PromiseOrValue<K>,
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
            if (elemKey < curMaxKey || (overwrite && elemKey === curMaxKey)) {
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
    min(overwrite: boolean = false): Promise<T | Null> {
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
    async partition(
        pred: (elem: T) => PromiseOrValue<boolean>
    ): Promise<[T[], T[]]> {
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
    async findIndex(
        pred: (elem: T) => PromiseOrValue<boolean>
    ): Promise<number> {
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
                accum = elem;
                typechecked = true;
            } else {
                accum = accum * (elem as number);
            }
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
                accum = elem;
                typechecked = true;
            } else {
                accum += elem;
            }
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
        const collected: T[] = [];
        for await (const item of this) {
            collected.push(item);
        }
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
    skipWhile(pred: (elem: T) => PromiseOrValue<boolean>): AsyncIterPlus<T> {
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
    takeWhile(pred: (elem: T) => PromiseOrValue<boolean>): AsyncIterPlus<T> {
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
        func: (...args: [T, ...K]) => PromiseOrValue<R>,
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
                yield await func(...(tot as [T, ...K]));
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
                yield tot as [T, ...K];
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Splits an iterator into multiple, where advancing one iterator does not advance the others.
     *
     * Functions by storing old values and removing when no longer needed,
     * so only tee as many iterators as you need in order for memory to be cleaned properly.
     *
     * The original iterator will still be advanced,
     * so only used the iterators returned by `tee`.
     *
     * @param count The number of iterators to split into.
     * @returns An array of length `count` with separate iterators.
     */
    tee(count: number = 2): AsyncIterPlus<T>[] {
        if (count <= 0) {
            return [];
        }
        const stored: CircularBuffer<T> = new CircularBuffer();
        let init = 0;
        let finished = false;
        const that = this;
        const tot: AsyncIterPlus<T>[] = [];
        const indices: number[] = [];
        async function* ret(index: number) {
            let n = 0;
            while (true) {
                if (n >= init + stored.size()) {
                    if (finished) {
                        return;
                    }
                    const elem = await that.next();
                    if (elem.done) {
                        finished = true;
                        return;
                    }
                    stored.pushEnd(elem.value);
                    yield elem.value;
                } else {
                    yield stored.get(n - init);
                    const minind = Math.min(...indices);
                    while (minind > init) {
                        init++;
                        stored.popStart();
                    }
                }
                n++;
                indices[index] = n;
            }
        }
        for (let i = 0; i < count; i++) {
            indices.push(0);
            tot.push(new AsyncIterPlus(ret(i)));
        }
        return tot;
    }

    /**
     * Returns the average of all elements in the iterator.
     *
     * @throws A RangeError on an empty iterator.
     * @returns The average.
     */
    async average(
        this: AsyncIterPlus<number> | AsyncIterPlus<bigint>
    ): Promise<T> {
        let accum: any = 0;
        let typechecked = false;
        let bigint = false;
        let count = 0;
        for await (const elem of this) {
            if (!typechecked) {
                if (typeof elem === "bigint") {
                    bigint = true;
                    accum = BigInt(accum);
                }
                typechecked = true;
            }
            accum = accum + (elem as number);
            count++;
        }
        if (bigint) {
            count = (BigInt(count) as unknown) as number;
        }
        if (count === 0) {
            throw new RangeError("Cannot average an empty iterator.");
        }
        return ((accum / count) as unknown) as T;
    }

    /**
     * Returns an iterator yielding non-overlapping chunks of the iterator.
     *
     * If there aren't enough elements to fill a chunk,
     * the last chunk will be smaller than the chunk size.
     *
     * If you want gaps between the chunks,
     * consider using `windows` with the appropriate interval instead.
     *
     * @param chunkSize The chunk size.
     * @returns An iterator that yields the chunks.
     */
    chunks(chunkSize: number): AsyncIterPlus<T[]> {
        const that = this;
        async function* ret() {
            while (true) {
                const eles: T[] = [];
                for (let i = 0; i < chunkSize; i++) {
                    const val = await that.next();
                    if (val.done) {
                        if (eles.length > 0) {
                            yield eles;
                        }
                        return;
                    }
                    eles.push(val.value);
                }
                yield eles;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Returns an iterator yielding non-overlapping chunks of the iterator.
     *
     * If there aren't enough elements to fill a chunk,
     * the extra elements will be omitted.
     *
     * If you want gaps between the chunks,
     * consider using `windows` with the appropriate interval instead.
     *
     * @param chunkSize The chunk size.
     * @returns An iterator that yields the chunks.
     */
    chunksExact(chunkSize: number): AsyncIterPlus<T[]> {
        const that = this;
        async function* ret() {
            while (true) {
                const eles: T[] = [];
                for (let i = 0; i < chunkSize; i++) {
                    const val = await that.next();
                    if (val.done) {
                        if (eles.length === chunkSize) {
                            yield eles;
                        }
                        return;
                    }
                    eles.push(val.value);
                }
                yield eles;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Creates an iterator that repeats the contents of the current iterator a certain number of times.
     *
     * @param n The number of times to repeat.
     * @returns An iterator that repeats itself n times.
     */
    repeat(n: number): AsyncIterPlus<T> {
        const that = this;
        async function* ret() {
            const eles: T[] = [];
            for await (const item of that) {
                eles.push(item);
            }
            if (eles.length === 0) {
                return;
            }
            for (let i = 0; i < n; i++) {
                yield* eles;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Creates an iterator that's rotated left a certain amount,
     * so elements at the start end up at the end.
     *
     * This **does not** handle negative numbers due to right rotation being significantly slower.
     * If you want negatives, please do the checks yourself and use rotateRight when appropriate.
     *
     * @param amount Amount to rotate by.
     * @throws A RangeError when the amount is negative.
     * @returns The rotated iterator.
     */
    rotateLeft(amount: number): AsyncIterPlus<T> {
        if (amount < 0) {
            throw new RangeError("Cannot left rotate by a negative amount.");
        }
        const that = this;
        async function* ret() {
            const eles: T[] = [];
            for (let i = 0; i < amount; i++) {
                const val = await that.next();
                if (val.done) {
                    if (eles.length > 0) {
                        amount %= eles.length;
                        yield* [
                            ...eles.slice(amount),
                            ...eles.slice(0, amount),
                        ];
                    }
                    return;
                }
                eles.push(val.value);
            }
            yield* that;
            yield* eles;
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Creates an iterator that's rotated right a certain amount,
     * so elements at the end end up at the start.
     *
     * **Due to the one-directional nature of iterators, this is not lazy and therefore much slower than `rotateLeft`.**
     *
     * This **does not** handle negative numbers to be consistent with `rotateLeft`.
     * If you want negatives, please do the checks yourself and use rotateRight when appropriate.
     *
     * @param amount Amount to rotate by.
     * @throws A RangeError when the amount is negative.
     * @returns The rotated iterator.
     */
    rotateRight(amount: number): AsyncIterPlus<T> {
        if (amount < 0) {
            throw new RangeError("Cannot right rotate by a negative amount.");
        }
        const that = this;
        async function* ret() {
            const eles: T[] = [];
            while (true) {
                const val = await that.next();
                if (val.done) {
                    break;
                }
                eles.push(val.value);
            }
            if (eles.length > 0) {
                amount %= eles.length;
                yield* [...eles.slice(-amount), ...eles.slice(0, -amount)];
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Splits an iterator on an element.
     *
     * @param ele The element to split on.
     * @param limit The maximum number of chunks to make.
     * @returns The iterator with the split chunks.
     */
    split(
        elem: PromiseOrValue<T>,
        limit: number = Infinity
    ): AsyncIterPlus<T[]> {
        const that = this;
        async function* ret() {
            const awaited = await elem;
            let foundEle = false;
            let chunks = 1;
            let eles: T[] = [];
            while (true) {
                const val = await that.next();
                if (val.done) {
                    if (foundEle) {
                        yield eles;
                    }
                    break;
                }
                foundEle = true;
                if (chunks < limit && val.value === awaited) {
                    yield eles;
                    eles = [];
                    chunks++;
                } else {
                    eles.push(val.value);
                }
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Splits an iterator on a predicate.
     *
     * @param pred The predicate to split with.
     * @param limit The maximum number of chunks to make.
     * @returns The iterator with the split chunks.
     */
    splitPred(
        pred: (elem: T) => PromiseOrValue<boolean>,
        limit: number = Infinity
    ): AsyncIterPlus<T[]> {
        const that = this;
        async function* ret() {
            let foundEle = false;
            let chunks = 1;
            let eles: T[] = [];
            while (true) {
                const val = await that.next();
                if (val.done) {
                    if (foundEle) {
                        yield eles;
                    }
                    break;
                }
                foundEle = true;
                if (chunks < limit && (await pred(val.value))) {
                    yield eles;
                    eles = [];
                    chunks++;
                } else {
                    eles.push(val.value);
                }
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Splits an iterator on an element,
     * including the matched element as the last element of the chunk.
     *
     * Unlike the exclusive split,
     * this does not create an empty chunk on the end when ending with the matched element.
     *
     * @param ele The element to split on.
     * @param limit The maximum number of chunks to make.
     * @returns The iterator with the split chunks.
     */
    splitInclusive(
        elem: PromiseOrValue<T>,
        limit: number = Infinity
    ): AsyncIterPlus<T[]> {
        const that = this;
        async function* ret() {
            const awaited = await elem;
            let foundEle = false;
            let chunks = 1;
            let eles: T[] = [];
            while (true) {
                const val = await that.next();
                if (val.done) {
                    if (foundEle && eles.length > 0) {
                        yield eles;
                    }
                    break;
                }
                foundEle = true;
                eles.push(val.value);
                if (chunks < limit && val.value === awaited) {
                    yield eles;
                    eles = [];
                    chunks++;
                }
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Splits an iterator on a predicate,
     * including the matched element as the last element of the chunk.
     *
     * Unlike the exclusive split,
     * this does not create an empty chunk on the end when ending with the matched element.
     *
     * @param pred The predicate to split with.
     * @param limit The maximum number of chunks to make.
     * @returns The iterator with the split chunks.
     */
    splitPredInclusive(
        pred: (elem: T) => PromiseOrValue<boolean>,
        limit: number = Infinity
    ): AsyncIterPlus<T[]> {
        const that = this;
        async function* ret() {
            let foundEle = false;
            let chunks = 1;
            let eles: T[] = [];
            while (true) {
                const val = await that.next();
                if (val.done) {
                    if (foundEle && eles.length > 0) {
                        yield eles;
                    }
                    break;
                }
                foundEle = true;
                eles.push(val.value);
                if (chunks < limit && (await pred(val.value))) {
                    yield eles;
                    eles = [];
                    chunks++;
                }
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Returns an iterator yielding overlapping windows of the iterator.
     *
     * If there aren't enough elements to fill a window,
     * no windows will be yielded.
     *
     * @param windowSize The window size.
     * @param interval The increment between the starts of windows. Defaults to 1.
     * @returns An iterator that yields the windows.
     */
    windows(windowSize: number, interval: number = 1): AsyncIterPlus<T[]> {
        const that = this;
        async function* ret() {
            const eles: CircularBuffer<T> = new CircularBuffer();
            for (let i = 0; i < windowSize; i++) {
                const val = await that.next();
                if (val.done) {
                    return;
                }
                eles.pushEnd(val.value);
            }
            while (true) {
                yield eles.toArray();
                for (let i = 0; i < interval; i++) {
                    const val = await that.next();
                    if (val.done) {
                        return;
                    }
                    eles.popStart();
                    eles.pushEnd(val.value);
                }
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Removes elements of an iterator that are equal to the previous one.
     * @returns An iterator with no consecutive duplicates.
     */
    dedup(): AsyncIterPlus<T> {
        const that = this;
        async function* ret() {
            const val = await that.next();
            if (val.done) {
                return;
            }
            yield val.value;
            let prev = val.value;
            for await (const item of that) {
                if (item !== prev) {
                    yield item;
                }
                prev = item;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Removes elements of an iterator that are equal to the previous one with a key.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @returns An iterator with no consecutive duplicates.
     */
    dedupWith<K>(key: (elem: T) => PromiseOrValue<K>): AsyncIterPlus<T> {
        const that = this;
        async function* ret() {
            const val = await that.next();
            if (val.done) {
                return;
            }
            yield val.value;
            let prev = await key(val.value);
            for await (const item of that) {
                const keyItem = await key(item);
                if (keyItem !== prev) {
                    yield item;
                }
                prev = keyItem;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Removes elements of an iterator that are equal to the previous one with a comparison function.
     *
     * @param cmp A function that checks if elements are equal.
     * @returns An iterator with no consecutive duplicates.
     */
    dedupBy(
        cmp: (first: T, second: T) => PromiseOrValue<boolean>
    ): AsyncIterPlus<T> {
        const that = this;
        async function* ret() {
            const val = await that.next();
            if (val.done) {
                return;
            }
            yield val.value;
            let prev = val.value;
            for await (const item of that) {
                if (!cmp(prev, item)) {
                    yield item;
                }
                prev = item;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Intersperses an element between every element of the iterator.
     *
     * @param elem The element to intersperse.
     * @returns The new iterator.
     */
    intersperse(elem: PromiseOrValue<T>): AsyncIterPlus<T> {
        const that = this;
        async function* ret() {
            const awaited = await elem;
            const val = await that.next();
            if (val.done) {
                return;
            }
            yield val.value;
            for await (const item of that) {
                yield awaited;
                yield item;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Intersperses multiple elements between every element of the iterator.
     *
     * @param elems The elements to intersperse.
     * @returns The new iterator.
     */
    intersperseMultiple(elems: AsyncIterable<T>): AsyncIterPlus<T> {
        const that = this;
        async function* ret() {
            const awaited: T[] = [];
            for await (const item of elems) {
                awaited.push(item);
            }
            const val = await that.next();
            if (val.done) {
                return;
            }
            yield val.value;
            for await (const item of that) {
                yield* awaited;
                yield item;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Joins an iterator of iterables with an element.
     *
     * @typeParam K The internal type.
     * @param elem The element to join with.
     * @returns The joined iterator.
     */
    join<K>(
        this: AsyncIterPlus<Iterable<K> | AsyncIterable<K>>,
        elem: PromiseOrValue<K>
    ): AsyncIterPlus<K> {
        const that = this;
        async function* ret() {
            const awaited = await elem;
            const val = await that.next();
            if (val.done) {
                return;
            }
            yield* val.value;
            for await (const item of that) {
                yield awaited;
                yield* item;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Joins an iterator of iterables with multiple elements.
     *
     * @typeParam K The internal type.
     * @param elems The elements to intersperse.
     * @returns The joined iterator.
     */
    joinMultiple<K>(
        this: AsyncIterPlus<Iterable<K> | AsyncIterable<K>>,
        elems: AsyncIterable<K>
    ): AsyncIterPlus<K> {
        const that = this;
        async function* ret() {
            const awaited: K[] = [];
            for await (const item of elems) {
                awaited.push(item);
            }
            const val = await that.next();
            if (val.done) {
                return;
            }
            yield* val.value;
            for await (const item of that) {
                yield* awaited;
                yield* item;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Converts an iterator of key-value pairs into an object.
     *
     * @typeParam K The key type.
     * @typeParam V The value type.
     * @param duplicate How to handle duplicate keys.
     * `"overwrite"` replaces values with the new value.
     * `"maintain"` maintains the old value.
     * `"error"` throws an error.
     * Defaults to `"overwrite"`.
     * @throws A RangeError if `duplicate` is `"error"` and a duplicate key is encountered.
     * @returns The generated object.
     */
    async toObject<K, V>(
        this: AsyncIterPlus<[K, V]>,
        duplicate: "overwrite" | "maintain" | "error" = "overwrite"
    ): Promise<{[key: string]: V}> {
        const ret: {[key: string]: V} = {};
        for await (const [key, val] of this) {
            if (duplicate !== "overwrite" && key in ret) {
                if (duplicate === "error") {
                    throw new RangeError("Duplicate key encountered.");
                } else if (duplicate === "maintain") {
                    // do nothing
                } else {
                    ret[key as any] = val;
                }
            } else {
                ret[key as any] = val;
            }
        }
        return ret;
    }

    /**
     * Converts an iterator of key-value pairs into a map.
     *
     * @typeParam K The key type.
     * @typeParam V The value type.
     * @param duplicate How to handle duplicate keys.
     * `"overwrite"` replaces values with the new value.
     * `"maintain"` maintains the old value.
     * `"error"` throws an error.
     * Defaults to `"overwrite"`.
     * @throws A RangeError if `duplicate` is `"error"` and a duplicate key is encountered.
     * @returns The generated map.
     */
    async toMap<K, V>(
        this: AsyncIterPlus<[K, V]>,
        duplicate: "overwrite" | "maintain" | "error" = "overwrite"
    ): Promise<Map<K, V>> {
        const ret: Map<K, V> = new Map();
        for await (const [key, val] of this) {
            if (duplicate !== "overwrite" && ret.has(key)) {
                if (duplicate === "error") {
                    throw new RangeError("Duplicate key encountered.");
                } else if (duplicate === "maintain") {
                    // do nothing
                } else {
                    ret.set(key, val);
                }
            } else {
                ret.set(key, val);
            }
        }
        return ret;
    }

    /**
     * Converts an iterator into a set.
     *
     * @returns The generated set.
     */
    async toSet(): Promise<Set<T>> {
        const ret: Set<T> = new Set();
        for await (const val of this) {
            ret.add(val);
        }
        return ret;
    }

    /**
     * Converts an iterator into an array.
     *
     * @returns The generated array.
     */
    async toArray(): Promise<T[]> {
        const ret: T[] = [];
        for await (const item of this) {
            ret.push(item);
        }
        return ret;
    }

    /**
     * Interleaves one or more iterables with this iterator.
     *
     * @param iters The iterables to interleave with this one.
     *
     * @returns The interleaved iterator, yielding elements in the iterators in order.
     */
    interleave(...iters: AsyncIterable<T>[]): AsyncIterPlus<T> {
        const that = this;
        async function* ret() {
            const iterList = [
                that,
                ...iters.map((v) => v[Symbol.asyncIterator]()),
            ].map((v) => ({
                done: false,
                iter: v,
            }));
            while (true) {
                let found = false;
                for (const obj of iterList) {
                    if (obj.done) {
                        continue;
                    }
                    found = true;
                    const val = await obj.iter.next();
                    if (val.done) {
                        obj.done = true;
                        continue;
                    }
                    yield val.value;
                }
                if (!found) {
                    break;
                }
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Runs a function for every element of the iterator, keeping track of an accumulator.
     *
     * @typeParam A The type of the accumulator.
     * @typeParam V The resulting type.
     * @param func The mapping function.
     * @param initializer The initial accumulator.
     * @returns The mapped iterator.
     */
    mapAccum<A, V>(
        func: (accum: A, elem: T) => PromiseOrValue<[A, V]>,
        initializer: A
    ): AsyncIterPlus<V> {
        const that = this;
        async function* ret() {
            let accum: A = initializer;
            for await (const elem of that) {
                const [newAccum, newElem] = await func(accum, elem);
                yield newElem;
                accum = newAccum;
            }
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Counts the number of items in this iterator that match a predicate.
     *
     * @param pred The predicate function.
     * @returns The number of matched items in the iterator.
     */
    async countIf(pred: (elem: T) => PromiseOrValue<boolean>): Promise<number> {
        let ret: number = 0;
        for await (const item of this) {
            if (await pred(item)) {
                ret++;
            }
        }
        return ret;
    }

    /**
     * Runs a function for every element of the iterator, keeping track of an accumulator.
     *
     * @typeParam A The type of the accumulator.
     * @param func The reducing function.
     * @param initializer The initial accumulator.
     * @returns The iterator containing all intermediate accumulators.
     */
    scan<A>(
        func: (accum: A, elem: T) => PromiseOrValue<A>,
        initializer: A
    ): AsyncIterPlus<A>;
    /**
     * Runs a function for every element of the iterator, keeping track of an accumulator.
     *
     * Uses the first element as the initial accumulator,
     * and it will be skipped over in the scan.
     *
     * @param func The reducing function.
     * @throws If the iterator is empty,
     * then an error will be thrown.
     * @returns The iterator containing all intermediate accumulators.
     */
    scan(func: (accum: T, elem: T) => PromiseOrValue<T>): AsyncIterPlus<T>;
    scan<A>(
        func: (accum: A, elem: T) => PromiseOrValue<A>,
        initializer?: A
    ): AsyncIterPlus<A> {
        const that = this;
        async function* ret() {
            let accum: A;
            if (initializer === undefined) {
                const next = await that.next();
                if (next.done) {
                    throw new TypeError(
                        "Scan of empty iterator with no initializer."
                    );
                }
                accum = (next.value as unknown) as A;
            } else {
                accum = initializer as A;
            }
            for await (const elem of that) {
                yield accum;
                accum = await func(accum, elem);
            }
            yield accum;
        }
        return new AsyncIterPlus(ret());
    }

    /**
     * Checks if this iterator is equal to another,
     * while they both yield elements, using a comparison function.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * However, if the first iterator terminates,
     * a value will still be yielded from the second so that `headEquals` is commutative.
     *
     * @typeParam O The type of the other iterable.
     * @param other Iterable to compare to.
     * @param cmp A function that checks if elements are equal.
     * @returns If the two iterators are equal.
     */
    async headEqualsBy<O>(
        other: AsyncIterable<O>,
        cmp: (first: T, second: O) => PromiseOrValue<boolean>
    ): Promise<boolean> {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (a.done || b.done) {
                return true;
            } else {
                const eq = await cmp(a.value, b.value);
                if (!eq) {
                    return false;
                }
            }
        }
    }

    /**
     * Checks if this iterator is equal to another,
     * while they both yield elements, using a key.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * However, if the first iterator terminates,
     * a value will still be yielded from the second so that `headEquals` is commutative.
     *
     * @typeParam K The type of the Key.
     * @param other Iterable to compare to.
     * @param key The key function.
     * @returns If the two iterators are equal.
     */
    async headEqualsWith<K>(
        other: AsyncIterable<T>,
        key: (elem: T) => PromiseOrValue<K>
    ): Promise<boolean> {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (a.done || b.done) {
                return true;
            } else {
                const eq = (await key(a.value)) === (await key(b.value));
                if (!eq) {
                    return false;
                }
            }
        }
    }
    /**
     * Checks if this iterator is equal to another,
     * while they both yield elements.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * However, if the first iterator terminates,
     * a value will still be yielded from the second so that `headEquals` is commutative.
     *
     * @param other Iterable to compare to.
     * @returns If the two iterators are equal.
     */
    async headEquals(other: AsyncIterable<T>): Promise<boolean> {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (a.done || b.done) {
                return true;
            }
            const eq = a.value === b.value;
            if (!eq) {
                return false;
            }
        }
    }

    /**
     * Checks if this iterator is equal to another,
     * while the second iterator still yields elements, using a comparison function.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @typeParam O The type of the other iterable.
     * @param other Iterable to compare to.
     * @param cmp A function that checks if elements are equal.
     * @returns If the first iterator starts with the second iterator.
     */
    async hasPrefixBy<O>(
        other: AsyncIterable<O>,
        cmp: (first: T, second: O) => PromiseOrValue<boolean>
    ): Promise<boolean> {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (b.done) {
                return true;
            }
            if (a.done) {
                return false;
            }
            const eq = await cmp(a.value, b.value);
            if (!eq) {
                return false;
            }
        }
    }

    /**
     * Checks if this iterator is equal to another,
     * while the second iterator still yields elements, with a key function.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @typeParam K The type of the Key.
     * @param other Iterable to compare to.
     * @param key The key function.
     * @returns If the first iterator starts with the second iterator.
     */
    async hasPrefixWith<K>(
        other: AsyncIterable<T>,
        key: (elem: T) => PromiseOrValue<K>
    ): Promise<boolean> {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (b.done) {
                return true;
            }
            if (a.done) {
                return false;
            }
            const eq = (await key(a.value)) === (await key(b.value));
            if (!eq) {
                return false;
            }
        }
    }

    /**
     * Checks if this iterator is equal to another,
     * while the second iterator still yields elements.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @param other Iterable to compare to.
     * @returns If the first iterator starts with the second iterator.
     */
    async hasPrefix(other: AsyncIterable<T>): Promise<boolean> {
        const iter = other[Symbol.asyncIterator]();
        while (true) {
            const a = await this.next();
            const b = await iter.next();
            if (b.done) {
                return true;
            }
            if (a.done) {
                return false;
            }
            const eq = a.value === b.value;
            if (!eq) {
                return false;
            }
        }
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
