import { IterPlus as SyncIterPlus } from "./IterPlus";
import { PromiseOrValue } from "./util";
/**
 * Tests if an object is an iterator.
 * @param obj The object to test for.
 * @returns If `obj` is an iterator.
 */
export declare function isAsyncIter(obj: any): obj is AsyncIterator<unknown>;
/**
 * Tests if an object is iterable.
 * @param obj The object to test for.
 * @returns If `obj` is an iterable.
 */
export declare function canAsyncIter(obj: any): obj is AsyncIterable<unknown>;
/**
 * Dirty workaround for Prettier moving comments.
 */
declare type CurIter<T> = AsyncIterator<T>;
/**
 * Dirty workaround for Prettier moving comments.
 */
declare type CurIterable<T> = AsyncIterable<T>;
/**
 * Typescript-abusing type that wraps every type in a tuple type with an array.
 */
declare type ArrayMap<T extends unknown[]> = {
    [K in keyof T]: T[K][];
};
/**
 * Typescript-abusing type that wraps every type in a tuple type with an Iterable.
 */
declare type AsyncIterableMap<T extends unknown[]> = {
    [K in keyof T]: CurIterable<T[K]>;
};
/**
 * The type of null to use.
 */
import { Null } from "./IterPlus";
/**
 * A wrapper around an iterator to add additional functionality. The types intentionally ignore return value.
 *
 * Many of the methods consume elements of the iterator,
 * so use `tee` the iterator into two first if you want to preserve elements.
 *
 * @typeParam T The item type of the iterator.
 */
export declare class AsyncIterPlus<T> implements CurIter<T>, AsyncIterable<T> {
    /**
     * The internal iterator that this wraps around.
     */
    protected internal: AsyncIterator<T>;
    /**
     * Instantiates an `IterPlus` from any iterator.
     *
     * @param iter The iterator to wrap around.
     */
    constructor(iter: AsyncIterator<T>);
    /**
     * Yields the next element in the iterator.
     *
     * @returns The next element.
     */
    next(): Promise<IteratorResult<T>>;
    /**
     * Returns the next value, or null if the iterator ended.
     *
     * @returns The next value, or null if the iterator ended.
     */
    nextVal(): Promise<T | Null>;
    /**
     * Makes the iterator work as an iterable.
     *
     * @returns The same iterator.
     */
    [Symbol.asyncIterator](): AsyncIterator<T>;
    /**
     * Generates an empty iterator.
     *
     * @typeParam T The item yielded by the iterator.
     * @returns The generated iterator.
     */
    static empty<T>(): AsyncIterPlus<T>;
    /**
     * Generates an iterator that yields values from a function and ends once the function returns null.
     *
     * @typeParam T The item type of the iterator.
     * @param func The function to yield values, or null to end the iterator.
     * @returns The generated iterator.
     */
    static fromFunction<T>(func: () => PromiseOrValue<T | Null>): AsyncIterPlus<T>;
    /**
     * Generates an iterator that lazily yields a single value.
     *
     * @typeParam T The item type of the iterator.
     * @param func The function to generate a single value.
     * @returns The generated iterator.
     */
    static onceWith<T>(func: () => PromiseOrValue<T>): AsyncIterPlus<T>;
    /**
     * Generates an iterator that yields a single value.
     *
     * @typeParam T The item type of the iterator.
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static once<T>(val: PromiseOrValue<T>): AsyncIterPlus<T>;
    /**
     * Generates an iterator that endlessly calls a function.
     *
     * @typeParam T The item type of the iterator.
     * @param func The function to generate values.
     * @returns The generated iterator.
     */
    static repeatWith<T>(func: () => PromiseOrValue<T>): AsyncIterPlus<T>;
    /**
     * Generates an iterator that endlessly repeats a value.
     *
     * @typeParam T The item type of the iterator.
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static repeat<T>(val: PromiseOrValue<T>): AsyncIterPlus<T>;
    /**
     * Generates an iterator that generates values based on the previous value.
     *
     * @typeParam T The item type of the iterator.
     * @param first The initial value.
     * @param func The function to generate new values.
     * @returns The generated iterator.
     */
    static successors<T>(first: PromiseOrValue<T | Null>, func: (prev: T) => PromiseOrValue<T | Null>): AsyncIterPlus<T>;
    static unfold<T, A>(func: (accum: A) => PromiseOrValue<[T, A] | Null>, init: PromiseOrValue<A>): AsyncIterPlus<T>;
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
    static cycle<T>(data: AsyncIterable<T>): AsyncIterPlus<T>;
    /**
     * Generates an iterator that iterates through lexicographically sorted combinations without repetition of a dataset.
     *
     * @typeParam T The item type of the iterator.
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinations<T>(data: T[], count?: number): AsyncIterPlus<T[]>;
    /**
     * Generates an iterator that iterates through lexicographically sorted combinations with repetition of a dataset.
     *
     * @typeParam T The item type of the iterator.
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinationsWithRepetition<T>(data: T[], count?: number): AsyncIterPlus<T[]>;
    /**
     * Generates an iterator that iterates through lexicographically sorted permutations without repetition of a dataset.
     *
     * @typeParam T The item type of the iterator.
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutations<T>(data: T[], count?: number): AsyncIterPlus<T[]>;
    /**
     * Generates an iterator that iterates through lexicographically sorted permutations with repetition of a dataset.
     *
     * @typeParam T The item type of the iterator.
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutationsWithRepetition<T>(data: T[], count?: number): AsyncIterPlus<T[]>;
    /**
     * Generates an iterator that iterates through the lexicographically sorted powerset of a dataset.
     *
     * @typeParam T The item type of the iterator.
     * @param data The data to get the powerset of.
     * @return The generated iterator.
     */
    static powerset<T>(data: T[]): AsyncIterPlus<T[]>;
    /**
     * Generates an iterator that generates a lexicographically sorted cartesian product.
     *
     * @typeParam T The item type of the iterator.
     * @param data The iterators to take the product of.
     * @returns The generated iterator.
     */
    static product<T extends unknown[]>(...data: ArrayMap<T>): AsyncIterPlus<T>;
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
    every(pred: (elem: T) => PromiseOrValue<boolean>): Promise<boolean>;
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
    some(pred: (elem: T) => PromiseOrValue<boolean>): Promise<boolean>;
    /**
     * Concatenates one or more iterables to this iterator,
     * creating an iterator that yields their elements in sequentual order.
     *
     * @param iters The iterables to chain to this one.
     * @returns The generated iterator.
     */
    concat(...iters: AsyncIterable<T>[]): AsyncIterPlus<T>;
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
    compareBy<O>(other: AsyncIterable<O>, cmp: (first: T, second: O) => PromiseOrValue<number>): Promise<number>;
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
    compareWith<K>(other: AsyncIterable<T>, key: (elem: T) => PromiseOrValue<K>): Promise<number>;
    /**
     * Lexicographically compares this iterator with another.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @param other Iterable to compare to.
     * @returns -1 if this is less than the other, 0 if it's equal, and 1 if it's greater than.
     */
    compare(other: AsyncIterable<T>): Promise<number>;
    /**
     * Collects the items in this iterator into an array.
     *
     * @returns An array with the items in the iterator.
     */
    collect(): Promise<T[]>;
    /**
     * Calls a specified collector function with this iterator as its only argument.
     *
     * @param collector The collector to use.
     * @returns The return value of the collector.
     */
    collectWith<R>(collector: (iter: AsyncIterPlus<T>) => R): R;
    /**
     * Calls a specified constructor with this iterator as its only argument.
     *
     * @param ctor The constructor to use.
     * @returns The constructed value.
     */
    construct<R>(ctor: new (item: AsyncIterPlus<T>) => R): R;
    /**
     * Counts the number of items in this iterator.
     *
     * @returns The number of items in the iterator.
     */
    count(): Promise<number>;
    /**
     * Generates an iterator that yields a 2 element array with the index and the element.
     *
     * @returns The generated iterator.
     */
    enumerate(): AsyncIterPlus<[number, T]>;
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
    equalsBy<O>(other: AsyncIterable<O>, cmp: (first: T, second: O) => PromiseOrValue<boolean>): Promise<boolean>;
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
    equalsWith<K>(other: AsyncIterable<T>, key: (elem: T) => PromiseOrValue<K>): Promise<boolean>;
    /**
     * Checks if this iterator is equal to another.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @param other Iterable to compare to.
     * @returns If the two iterators are equal.
     */
    equals(other: AsyncIterable<T>): Promise<boolean>;
    /**
     * Generates an iterator that only yields elements that match a predicate.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    filter(pred: (elem: T) => PromiseOrValue<boolean>): AsyncIterPlus<T>;
    /**
     * Generates a mapped iterator that yields non-null elements.
     *
     * @typeParam K The resulting type.
     * @typeParam N The type of the null value.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    filterMap<K>(func: (elem: T) => PromiseOrValue<K | Null>): AsyncIterPlus<K>;
    /**
     * Finds an element that satisfies a predicate.
     *
     * This function is short-circuiting,
     * so it stops on the first match.
     *
     * @param pred The predicate function.
     * @returns The element, or null if none was found.
     */
    find(pred: (elem: T) => PromiseOrValue<boolean>): Promise<T | Null>;
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
    findMap<K>(func: (elem: T) => PromiseOrValue<K | Null>): Promise<K | Null>;
    /**
     * Flattens an iterator of iterables,
     * yielding an iterator that sequentially produces their elements.
     *
     * @typeParam K The internal type.
     * @returns The generated iterator.
     */
    flatten<K>(this: AsyncIterPlus<Iterable<K> | AsyncIterable<K>>): AsyncIterPlus<K>;
    /**
     * Lazily maps an iterator, creating a new iterator where each element has been modified by a function.
     *
     * If you want to immediately run a function on all elements of the iterator, use `forEach` instead.
     *
     * @typeParam K The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    map<K>(func: (elem: T) => PromiseOrValue<K>): AsyncIterPlus<K>;
    /**
     * Maps an iterator of iterables,
     * and calls a function with the contents of the iterable as the argument.
     *
     * @typeParam K The iterable type.
     * @typeParam R The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    starmap<K, R>(this: AsyncIterPlus<Iterable<K>>, func: (...args: K[]) => PromiseOrValue<R>): AsyncIterPlus<R>;
    /**
     * Maps then flattens an iterator.
     *
     * @typeParam K The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    flatMap<K>(func: (elem: T) => Iterable<K> | AsyncIterable<K> | Promise<Iterable<K> | AsyncIterable<K>>): AsyncIterPlus<K>;
    /**
     * Runs a function for every element of the iterator, keeping track of an accumulator.
     *
     * @typeParam A The type of the accumulator.
     * @param func The reducing function.
     * @param initializer The initial accumulator.
     * @returns The final accumulator.
     */
    reduce<A>(func: (accum: A, elem: T) => PromiseOrValue<A>, initializer: A): Promise<A>;
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
    /**
     * Runs a function on each element of an iterator.
     *
     * This is equivalent to running a for loop on the iterator.
     * If you want to obtain the values, consider using `.map(func).collect()` instead.
     *
     * @param func The function to run.
     */
    forEach(func: (elem: T) => PromiseOrValue<unknown>): Promise<void>;
    /**
     * Generates an iterator that is guaranteed to never yield a value after finishing.
     *
     * @returns The generated iterator.
     */
    fuse(): AsyncIterPlus<T>;
    /**
     * Lazily runs functions on an iterator, returning a new iterator with unmodified elements.
     *
     * This function is primarily used as a debugging tool to inspect elements in the middle of an iterator function chain.
     *
     * @param func The function to call.
     * @returns The generated iterator.
     */
    inspect(func: (elem: T) => PromiseOrValue<unknown>): AsyncIterPlus<T>;
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
    isPartitioned(pred: (elem: T) => PromiseOrValue<boolean>): Promise<boolean>;
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
    isSortedBy(cmp: (first: T, second: T) => PromiseOrValue<number>): Promise<boolean>;
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
    isSortedWith<K>(key: (elem: T) => PromiseOrValue<K>): Promise<boolean>;
    /**
     * Determines if an iterator is sorted increasingly.
     *
     * This function is short-circuiting,
     * so it stops on the first non-sorted element.
     *
     * @returns If the iterator is sorted.
     */
    isSorted(): Promise<boolean>;
    /**
     * Finds the last element in an iterator.
     *
     * @returns The last element of the iterator, or null if the iterator is empty.
     */
    last(): Promise<T | Null>;
    /**
     * Lazily maps an iterator until it encounters null.
     *
     * @typeParam K The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    mapWhile<K>(func: (elem: T) => PromiseOrValue<K | Null>): AsyncIterPlus<K>;
    /**
     * Finds the maximum value of an iterator with a comparison function.
     *
     * @param cmp A function that should return a negative for less than, zero for equal to,
     * and positive for greater than.
     * @param overwrite If `true`, elements will be counted as the new maximum if they are equal to the maximum.
     * Defaults to `false`.
     * @returns The maximum element, or null if the iterator is empty.
     */
    maxBy(cmp: (first: T, second: T) => PromiseOrValue<number>, overwrite?: boolean): Promise<T | null>;
    /**
     * Finds the maximum value of an iterator with a key.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @param overwrite If `true`, elements will be counted as the new maximum if they are equal to the maximum.
     * Defaults to `false`.
     * @returns The maximum element, or null if the iterator is empty.
     */
    maxWith<K>(key: (elem: T) => PromiseOrValue<K>, overwrite?: boolean): Promise<T | null>;
    /**
     * Finds the maximum value of an iterator.
     *
     * @param overwrite If `true`, elements will be counted as the new maximum if they are equal to the maximum.
     * Defaults to `false`.
     * @returns The maximum element, or null if the iterator is empty.
     */
    max(overwrite?: boolean): Promise<T | Null>;
    /**
     * Finds the minimum value of an iterator with a comparison function.
     *
     * @param cmp A function that should return a negative for less than, zero for equal to,
     * and positive for greater than.
     * @param overwrite If `true`, elements will be counted as the new minimum if they are equal to the minimum.
     * Defaults to `false`.
     * @returns The minimum element, or null if the iterator is empty.
     */
    minBy(cmp: (first: T, second: T) => PromiseOrValue<number>, overwrite?: boolean): Promise<T | null>;
    /**
     * Finds the minimum value of an iterator with a key.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @param overwrite If `true`, elements will be counted as the new minimum if they are equal to the minimum.
     * Defaults to `false`.
     * @returns The minimum element, or null if the iterator is empty.
     */
    minWith<K>(key: (elem: T) => PromiseOrValue<K>, overwrite?: boolean): Promise<T | null>;
    /**
     * Finds the minimum value of an iterator.
     *
     * @param overwrite If `true`, elements will be counted as the new minimum if they are equal to the minimum.
     * Defaults to `false`.
     * @returns The minimum element, or null if the iterator is empty.
     */
    min(overwrite?: boolean): Promise<T | Null>;
    /**
     * Finds the nth element in an iterator.
     *
     * @param n The number element to get.
     * @returns The nth element of the iterator, or null if the iterator is too short.
     */
    nth(n: number): Promise<T | Null>;
    /**
     * Partitions an iterator into two groups.
     *
     * @param pred The predicate function.
     * @returns An array with two elements:
     *  - The elements where the predicate returned true.
     *  - The elements where the predicate returned false.
     */
    partition(pred: (elem: T) => PromiseOrValue<boolean>): Promise<[T[], T[]]>;
    /**
     * Generates a `Peekable` iterator.
     *
     * @returns The peekable iterator.
     */
    peekable(): AsyncPeekable<T>;
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
    findIndex(pred: (elem: T) => PromiseOrValue<boolean>): Promise<number>;
    /**
     * Returns the product of all elements in the iterator.
     *
     * @param empty The default value for an empty iterator. Defaults to 1.
     * @returns The product.
     */
    product(this: AsyncIterPlus<number>, empty?: number): Promise<number>;
    /**
     * Returns the product of all elements in the iterator.
     *
     * @param empty The default value for an empty iterator.
     * **For bigint iterators it's advised to explicitly set this to 1n or another bigint.**
     * @returns The product.
     */
    product(this: AsyncIterPlus<bigint>, empty: bigint): Promise<bigint>;
    /**
     * Returns the sum of all elements in the iterator.
     *
     * @param empty The default value for an empty iterator. Defaults to 0.
     * @returns The sum.
     */
    sum(this: AsyncIterPlus<number>, empty?: number): Promise<number>;
    /**
     * Returns the sum of all elements in the iterator.
     *
     * @param empty The default value for an empty iterator.
     * **For bigint iterators it's advised to explicitly set this to 0n or another bigint.**
     * @returns The sum.
     */
    sum(this: AsyncIterPlus<bigint>, empty: bigint): Promise<bigint>;
    /**
     * Returns the sum of all elements in the iterator.
     *
     * @param empty The default value for an empty iterator.
     * **For string iterators it's advised to explicitly set this to "" or another string.**
     * @returns The sum.
     */
    sum(this: AsyncIterPlus<string>, empty: string): Promise<string>;
    /**
     * Consumes the iterator and reverses it.
     *
     * This has to immediately resolve every element in the iterator,
     * so it is equivalent to collecting to an array and revsersing the array,
     * so it is very inefficient on memory and should be avoided.
     *
     * @returns The reversed iterator.
     */
    reverse(): Promise<SyncIterPlus<T>>;
    /**
     * Skips the first n elements of an iterator.
     *
     * @param n The number of elements to skip.
     * @returns The generated iterator.
     */
    skip(n: number): AsyncIterPlus<T>;
    /**
     * Skips elements of an iterator while a predicate is met.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    skipWhile(pred: (elem: T) => PromiseOrValue<boolean>): AsyncIterPlus<T>;
    /**
     * Takes the first n elements of an iterator.
     *
     * @param n The number of elements to take.
     * @returns The generated iterator.
     */
    take(n: number): AsyncIterPlus<T>;
    /**
     * Takes elements of an iterator while a predicate is met.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    takeWhile(pred: (elem: T) => PromiseOrValue<boolean>): AsyncIterPlus<T>;
    /**
     * "Unzips" an iterator of tuples into a tuple of arrays.
     *
     * @typeParam K The tuple type.
     * @returns A tuple with the individual elements.
     */
    unzip<K extends unknown[]>(this: AsyncIterPlus<K>): Promise<ArrayMap<K>>;
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
    zipWith<K extends unknown[], R>(func: (...args: [T, ...K]) => PromiseOrValue<R>, ...iters: AsyncIterableMap<K>): AsyncIterPlus<R>;
    /**
     * Zips one or more iterables with this iterator.
     *
     * @typeParam K The types of the other iterables.
     * @param iters The iterables to zip with this one.
     * @returns The generated iterator.
     */
    zip<K extends unknown[]>(...iters: AsyncIterableMap<K>): AsyncIterPlus<[T, ...K]>;
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
    tee(count?: number): AsyncIterPlus<T>[];
    /**
     * Returns the average of all elements in the iterator.
     *
     * @throws A RangeError on an empty iterator.
     * @returns The average.
     */
    average(this: AsyncIterPlus<number> | AsyncIterPlus<bigint>): Promise<T>;
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
    chunks(chunkSize: number): AsyncIterPlus<T[]>;
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
    chunksExact(chunkSize: number): AsyncIterPlus<T[]>;
    /**
     * Creates an iterator that repeats the contents of the current iterator a certain number of times.
     *
     * @param n The number of times to repeat.
     * @returns An iterator that repeats itself n times.
     */
    repeat(n: number): AsyncIterPlus<T>;
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
    rotateLeft(amount: number): AsyncIterPlus<T>;
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
    rotateRight(amount: number): AsyncIterPlus<T>;
    /**
     * Splits an iterator on an element.
     *
     * @param ele The element to split on.
     * @param limit The maximum number of chunks to make.
     * @returns The iterator with the split chunks.
     */
    split(elem: PromiseOrValue<T>, limit?: number): AsyncIterPlus<T[]>;
    /**
     * Splits an iterator on a predicate.
     *
     * @param pred The predicate to split with.
     * @param limit The maximum number of chunks to make.
     * @returns The iterator with the split chunks.
     */
    splitPred(pred: (elem: T) => PromiseOrValue<boolean>, limit?: number): AsyncIterPlus<T[]>;
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
    splitInclusive(elem: PromiseOrValue<T>, limit?: number): AsyncIterPlus<T[]>;
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
    splitPredInclusive(pred: (elem: T) => PromiseOrValue<boolean>, limit?: number): AsyncIterPlus<T[]>;
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
    windows(windowSize: number, interval?: number): AsyncIterPlus<T[]>;
    /**
     * Removes elements of an iterator that are equal to the previous one.
     * @returns An iterator with no consecutive duplicates.
     */
    dedup(): AsyncIterPlus<T>;
    /**
     * Removes elements of an iterator that are equal to the previous one with a key.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @returns An iterator with no consecutive duplicates.
     */
    dedupWith<K>(key: (elem: T) => PromiseOrValue<K>): AsyncIterPlus<T>;
    /**
     * Removes elements of an iterator that are equal to the previous one with a comparison function.
     *
     * @param cmp A function that checks if elements are equal.
     * @returns An iterator with no consecutive duplicates.
     */
    dedupBy(cmp: (first: T, second: T) => PromiseOrValue<boolean>): AsyncIterPlus<T>;
    /**
     * Intersperses an element between every element of the iterator.
     *
     * @param elem The element to intersperse.
     * @returns The new iterator.
     */
    intersperse(elem: PromiseOrValue<T>): AsyncIterPlus<T>;
    /**
     * Intersperses multiple elements between every element of the iterator.
     *
     * @param elems The elements to intersperse.
     * @returns The new iterator.
     */
    intersperseMultiple(elems: AsyncIterable<T>): AsyncIterPlus<T>;
    /**
     * Joins an iterator of iterables with an element.
     *
     * @typeParam K The internal type.
     * @param elem The element to join with.
     * @returns The joined iterator.
     */
    join<K>(this: AsyncIterPlus<Iterable<K> | AsyncIterable<K>>, elem: PromiseOrValue<K>): AsyncIterPlus<K>;
    /**
     * Joins an iterator of iterables with multiple elements.
     *
     * @typeParam K The internal type.
     * @param elems The elements to intersperse.
     * @returns The joined iterator.
     */
    joinMultiple<K>(this: AsyncIterPlus<Iterable<K> | AsyncIterable<K>>, elems: AsyncIterable<K>): AsyncIterPlus<K>;
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
    toObject<K, V>(this: AsyncIterPlus<[K, V]>, duplicate?: "overwrite" | "maintain" | "error"): Promise<{
        [key: string]: V;
    }>;
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
    toMap<K, V>(this: AsyncIterPlus<[K, V]>, duplicate?: "overwrite" | "maintain" | "error"): Promise<Map<K, V>>;
    /**
     * Converts an iterator into a set.
     *
     * @returns The generated set.
     */
    toSet(): Promise<Set<T>>;
    /**
     * Converts an iterator into an array.
     *
     * @returns The generated array.
     */
    toArray(): Promise<T[]>;
    /**
     * Interleaves one or more iterables with this iterator.
     *
     * @param iters The iterables to interleave with this one.
     *
     * @returns The interleaved iterator, yielding elements in the iterators in order.
     */
    interleave(...iters: AsyncIterable<T>[]): AsyncIterPlus<T>;
    /**
     * Runs a function for every element of the iterator, keeping track of an accumulator.
     *
     * @typeParam A The type of the accumulator.
     * @typeParam V The resulting type.
     * @param func The mapping function.
     * @param initializer The initial accumulator.
     * @returns The mapped iterator.
     */
    mapAccum<A, V>(func: (accum: A, elem: T) => PromiseOrValue<[A, V]>, initializer: A): AsyncIterPlus<V>;
    /**
     * Counts the number of items in this iterator that match a predicate.
     *
     * @param pred The predicate function.
     * @returns The number of matched items in the iterator.
     */
    countIf(pred: (elem: T) => PromiseOrValue<boolean>): Promise<number>;
    /**
     * Runs a function for every element of the iterator, keeping track of an accumulator.
     *
     * @typeParam A The type of the accumulator.
     * @param func The reducing function.
     * @param initializer The initial accumulator.
     * @returns The iterator containing all intermediate accumulators.
     */
    scan<A>(func: (accum: A, elem: T) => PromiseOrValue<A>, initializer: A): AsyncIterPlus<A>;
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
    headEqualsBy<O>(other: AsyncIterable<O>, cmp: (first: T, second: O) => PromiseOrValue<boolean>): Promise<boolean>;
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
     * @typeParam K The type of the key.
     * @param other Iterable to compare to.
     * @param key The key function.
     * @returns If the two iterators are equal.
     */
    headEqualsWith<K>(other: AsyncIterable<T>, key: (elem: T) => PromiseOrValue<K>): Promise<boolean>;
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
    headEquals(other: AsyncIterable<T>): Promise<boolean>;
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
    hasPrefixBy<O>(other: AsyncIterable<O>, cmp: (first: T, second: O) => PromiseOrValue<boolean>): Promise<boolean>;
    /**
     * Checks if this iterator is equal to another,
     * while the second iterator still yields elements, with a key function.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @typeParam K The type of the key.
     * @param other Iterable to compare to.
     * @param key The key function.
     * @returns If the first iterator starts with the second iterator.
     */
    hasPrefixWith<K>(other: AsyncIterable<T>, key: (elem: T) => PromiseOrValue<K>): Promise<boolean>;
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
    hasPrefix(other: AsyncIterable<T>): Promise<boolean>;
    /**
     * Checks if every element in this iterator is equal, using a comparison function.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @param cmp A function that checks if elements are equal.
     * @returns If every element is equal, or true if the iterator has one or less elements.
     */
    allEqualBy(cmp: (first: T, second: T) => PromiseOrValue<boolean>): Promise<boolean>;
    /**
     * Checks if every element in this iterator is equal, using a key function.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @returns If every element is equal, or true if the iterator has one or less elements.
     */
    allEqualWith<K>(key: (elem: T) => PromiseOrValue<K>): Promise<boolean>;
    /**
     * Checks if every element in this iterator is equal.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @returns If every element is equal, or true if the iterator has one or less elements.
     */
    allEqual(): Promise<boolean>;
    /**
     * Removes duplicates from an iterator, including non-consecutive ones, with a comparison function.
     *
     * Unlike `nubWith` and `nub`, this does not use a set, so it is significantly slower.
     *
     * @param cmp A function that checks if elements are equal.
     * @returns The nubbed iterator.
     */
    nubBy(cmp: (first: T, second: T) => PromiseOrValue<boolean>): AsyncIterPlus<T>;
    /**
     * Removes duplicates from an iterator, including non-consecutive ones, with a key function.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @returns The nubbed iterator.
     */
    nubWith<K>(key: (elem: T) => PromiseOrValue<K>): AsyncIterPlus<T>;
    /**
     * Removes duplicates from an iterator, including non-consecutive ones.
     *
     * @returns The nubbed iterator.
     */
    nub(): AsyncIterPlus<T>;
    /**
     * Groups elements of an iterator together with a key function.
     *
     * @typeParam K The type of the key.
     * @param cmp A function that checks if elements are equal.
     * @returns An object mapping keys to arrays of matching items.
     */
    group<K extends string | number | symbol>(key: (elem: T) => PromiseOrValue<K>): Promise<Record<K, T[]>>;
    /**
     * Tallies elements of an iterator together with a key function.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @returns An object mapping keys to the number of times they appeared.
     */
    tallyWith<K extends string | number | symbol>(key: (elem: T) => PromiseOrValue<K>): Promise<Record<K, number>>;
    /**
     * Tallies elements of an iterator together.
     *
     * @returns An object mapping keys to the number of times they appeared.
     */
    tally(this: AsyncIterPlus<string | number | symbol>): Promise<Record<string, number>>;
    /**
     * Globs elements of an iterator together, with a comparison function.
     *
     * @param cmp A function that checks if elements are equal.
     * @returns An iterator where every element is an array of consecutively equal elements.
     */
    globBy(cmp: (first: T, second: T) => PromiseOrValue<boolean>): AsyncIterPlus<T[]>;
    /**
     * Globs elements of an iterator together, with a key function.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @returns An iterator where every element is an array of consecutively equal elements.
     */
    globWith<K>(key: (elem: T) => PromiseOrValue<K>): AsyncIterPlus<T[]>;
    /**
     * Globs elements of an iterator together.
     *
     * @returns An iterator where every element is an array of consecutively equal elements.
     */
    glob(): AsyncIterPlus<T[]>;
    /**
     * Steps through an iterator by a certain amount, starting from the first.
     *
     * A step of 2 would yield the first element, then the third, then the fifth, and so on.
     *
     * @param step The step size.
     * @returns An iterator that advances by the given step size.
     */
    stepBy(step: number): AsyncIterPlus<T>;
    /**
     * Drops elements from the iterator **from the end**.
     *
     * This uses memory proportional to the number of elements dropped,
     * as the iterator must look ahead and store elements to know that it has not reached the end.
     *
     * @param n The number of elements to drop.
     * @returns An iterator with the specified number of elements removed from the end.
     */
    dropEnd(n: number): AsyncIterPlus<T>;
}
/**
 * An iterator with a `peek`. method that can look one element in advance.
 *
 * Do not instantiate this directly, instead use the `peekable` method in `IterPlus` or `AsyncIterPlus`.
 *
 * @typeParam T The item type of the iterator.
 */
export declare class AsyncPeekable<T> extends AsyncIterPlus<T> {
    private storedVal;
    constructor(iter: AsyncIterator<T>);
    /**
     * Yields the next element in the iterator.
     *
     * @returns The next element.
     */
    next(): Promise<IteratorResult<T>>;
    /**
     * Peeks the next element in the iterator and does not consume it.
     *
     * @returns The next element as an iterator result.
     */
    peek(): Promise<IteratorResult<T>>;
    /**
     * Peeks the next element in the iterator and does not consume it.
     *
     * Nullable version of `peek`.
     *
     * @returns The next element, or `null` if the iterator is finished.
     */
    peekVal(): Promise<T | Null>;
    /**
     * Checks if there's a value cached from a previous `peek`.
     *
     * Will return `true` even if the cached value is the end of the iterator.
     *
     * @returns If there's a value cached.
     */
    hasCached(): boolean;
}
export {};
