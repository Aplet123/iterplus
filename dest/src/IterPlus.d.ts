/**
 * Tests if an object is an iterator.
 * @param obj The object to test for.
 * @returns If `obj` is an iterator.
 */
export declare function isIter(obj: any): obj is Iterator<unknown>;
/**
 * Tests if an object is iterable.
 * @param obj The object to test for.
 * @returns If `obj` is an iterable.
 */
export declare function canIter(obj: any): obj is Iterable<unknown>;
/**
 * Dirty workaround for Prettier moving comments.
 */
declare type CurIter<T> = Iterator<T>;
/**
 * Dirty workaround for Prettier moving comments.
 */
declare type CurIterable<T> = Iterable<T>;
/**
 * Typescript-abusing type that wraps every type in a tuple type with an array.
 */
declare type ArrayMap<T extends unknown[]> = {
    [K in keyof T]: T[K][];
};
/**
 * Typescript-abusing type that wraps every type in a tuple type with an Iterable.
 */
declare type IterableMap<T extends unknown[]> = {
    [K in keyof T]: CurIterable<T[K]>;
};
/**
 * The value of null to use.
 *
 * Defaults to `null`.
 */
export declare const nullVal: null;
/**
 * The type of null to use.
 */
export declare type Null = typeof nullVal;
/**
 * A wrapper around an iterator to add additional functionality. The types intentionally ignore return value.
 *
 * Many of the methods consume elements of the iterator,
 * so use `tee` the iterator into two first if you want to preserve elements.
 *
 * @typeParam T The item type of the iterator.
 */
export declare class IterPlus<T> implements CurIter<T>, /* o:Async- */ Iterable<T> {
    /**
     * The internal iterator that this wraps around.
     */
    protected internal: Iterator<T>;
    /**
     * Instantiates an `IterPlus` from any iterator.
     *
     * @param iter The iterator to wrap around.
     */
    constructor(iter: Iterator<T>);
    /**
     * Yields the next element in the iterator.
     *
     * @returns The next element.
     */
    next(): IteratorResult<T>;
    /**
     * Returns the next value, or null if the iterator ended.
     *
     * @returns The next value, or null if the iterator ended.
     */
    nextVal(): /* o:Promise<- */ T | Null;
    /**
     * Makes the iterator work as an iterable.
     *
     * @returns The same iterator.
     */
    [Symbol.iterator](): Iterator<T>;
    /**
     * Generates an empty iterator.
     *
     * @typeParam T The item yielded by the iterator.
     * @returns The generated iterator.
     */
    static empty<T>(): IterPlus<T>;
    /**
     * Generates an iterator that yields values from a function and ends once the function returns null.
     *
     * @typeParam T The item type of the iterator.
     * @param func The function to yield values, or null to end the iterator.
     * @returns The generated iterator.
     */
    static fromFunction<T>(func: () => /* o:PromiseOrValue<- */ T | Null): IterPlus<T>;
    /**
     * Generates an iterator that lazily yields a single value.
     *
     * @typeParam T The item type of the iterator.
     * @param func The function to generate a single value.
     * @returns The generated iterator.
     */
    static onceWith<T>(func: () => T): IterPlus<T>;
    /**
     * Generates an iterator that yields a single value.
     *
     * @typeParam T The item type of the iterator.
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static once<T>(val: T): IterPlus<T>;
    /**
     * Generates an iterator that endlessly calls a function.
     *
     * @typeParam T The item type of the iterator.
     * @param func The function to generate values.
     * @returns The generated iterator.
     */
    static repeatWith<T>(func: () => T): IterPlus<T>;
    /**
     * Generates an iterator that endlessly repeats a value.
     *
     * @typeParam T The item type of the iterator.
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static repeat<T>(val: T): IterPlus<T>;
    /**
     * Generates an iterator that generates values based on the previous value.
     *
     * @typeParam T The item type of the iterator.
     * @param first The initial value.
     * @param func The function to generate new values.
     * @returns The generated iterator.
     */
    static successors<T>(first: T | Null, func: (prev: T) => T | Null): IterPlus<T>;
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
    static cycle<T>(data: Iterable<T>): IterPlus<T>;
    /**
     * Generates an iterator that iterates through lexicographically sorted combinations without repetition of a dataset.
     *
     * @typeParam T The item type of the iterator.
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinations<T>(data: T[], count?: number): IterPlus<T[]>;
    /**
     * Generates an iterator that iterates through lexicographically sorted combinations with repetition of a dataset.
     *
     * @typeParam T The item type of the iterator.
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinationsWithRepetition<T>(data: T[], count?: number): IterPlus<T[]>;
    /**
     * Generates an iterator that iterates through lexicographically sorted permutations without repetition of a dataset.
     *
     * @typeParam T The item type of the iterator.
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutations<T>(data: T[], count?: number): IterPlus<T[]>;
    /**
     * Generates an iterator that iterates through lexicographically sorted permutations with repetition of a dataset.
     *
     * @typeParam T The item type of the iterator.
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutationsWithRepetition<T>(data: T[], count?: number): IterPlus<T[]>;
    /**
     * Generates an iterator that iterates through the lexicographically sorted powerset of a dataset.
     *
     * @typeParam T The item type of the iterator.
     * @param data The data to get the powerset of.
     * @return The generated iterator.
     */
    static powerset<T>(data: T[]): IterPlus<T[]>;
    /**
     * Generates an iterator that generates a lexicographically sorted cartesian product.
     *
     * @typeParam T The item type of the iterator.
     * @param data The iterators to take the product of.
     * @returns The generated iterator.
     */
    static product<T extends unknown[]>(...data: ArrayMap<T>): IterPlus<T>;
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
    every(pred: (elem: T) => boolean): boolean;
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
    some(pred: (elem: T) => boolean): boolean;
    /**
     * Concatenates one or more iterables to this iterator,
     * creating an iterator that yields their elements in sequentual order.
     *
     * @param iters The iterables to chain to this one.
     * @returns The generated iterator.
     */
    concat(...iters: Iterable<T>[]): IterPlus<T>;
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
    compareBy<O>(other: Iterable<O>, cmp: (first: T, second: O) => number): number;
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
    compareWith<K>(other: Iterable<T>, key: (elem: T) => K): number;
    /**
     * Lexicographically compares this iterator with another.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @param other Iterable to compare to.
     * @returns -1 if this is less than the other, 0 if it's equal, and 1 if it's greater than.
     */
    compare(other: Iterable<T>): number;
    /**
     * Collects the items in this iterator into an array.
     *
     * @returns An array with the items in the iterator.
     */
    collect(): T[];
    /**
     * Counts the number of items in this iterator.
     *
     * @returns The number of items in the iterator.
     */
    count(): number;
    /**
     * Generates an iterator that yields a 2 element array with the index and the element.
     *
     * @returns The generated iterator.
     */
    enumerate(): IterPlus<[number, T]>;
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
    equalsBy<O>(other: Iterable<O>, cmp: (first: T, second: O) => boolean): boolean;
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
    equalsWith<K>(other: Iterable<T>, key: (elem: T) => K): boolean;
    /**
     * Checks if this iterator is equal to another.
     *
     * This function is short-circuiting,
     * so it stops on the first inequality.
     *
     * @param other Iterable to compare to.
     * @returns If the two iterators are equal.
     */
    equals(other: Iterable<T>): boolean;
    /**
     * Generates an iterator that only yields elements that match a predicate.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    filter(pred: (elem: T) => boolean): IterPlus<T>;
    /**
     * Generates a mapped iterator that yields non-null elements.
     *
     * @typeParam K The resulting type.
     * @typeParam N The type of the null value.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    filterMap<K>(func: (elem: T) => /* o:PromiseOrValue<- */ K | Null): IterPlus<K>;
    /**
     * Finds an element that satisfies a predicate.
     *
     * This function is short-circuiting,
     * so it stops on the first match.
     *
     * @param pred The predicate function.
     * @returns The element, or null if none was found.
     */
    find(pred: (elem: T) => boolean): /* o:Promise<- */ T | Null;
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
    findMap<K>(func: (elem: T) => /* o:PromiseOrValue<- */ K | Null): /* o:Promise<- */ K | Null;
    /**
     * Flattens an iterator of iterables,
     * yielding an iterator that sequentially produces their elements.
     *
     * @typeParam K The internal type.
     * @returns The generated iterator.
     */
    flatten<K>(this: IterPlus</* o:Iterable<K> | Async- */ Iterable<K>>): IterPlus<K>;
    /**
     * Lazily maps an iterator, creating a new iterator where each element has been modified by a function.
     *
     * If you want to immediately run a function on all elements of the iterator, use `forEach` instead.
     *
     * @typeParam K The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    map<K>(func: (elem: T) => K): IterPlus<K>;
    /**
     * Maps an iterator of iterables,
     * and calls a function with the contents of the iterable as the argument.
     *
     * @typeParam K The iterable type.
     * @typeParam R The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    starmap<K, R>(this: IterPlus<Iterable<K>>, func: (...args: K[]) => R): IterPlus<R>;
    /**
     * Maps then flattens an iterator.
     *
     * @typeParam K The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    flatMap<K>(func: (elem: T) => Iterable<K>): IterPlus<K>;
    /**
     * Runs a function for every element of the iterator, keeping track of an accumulator.
     *
     * @typeParam A The type of the accumulator.
     * @param func The reducing function.
     * @param initializer The initial accumulator.
     * @returns The final accumulator.
     */
    reduce<A>(func: (accum: A, elem: T) => A, initializer: A): A;
    /**
     * Runs a function for every element of the iterator, keeping track of an accumulator.
     *
     * @param func The reducing function.
     * @param initializer The initial accumulator.
     * If not provided, the first element of the iterator will be used instead,
     * and the first element will be skipped over in the reduction.
     *
     * @throws If an initializer is not provided and the iterator is empty,
     * then an error will be thrown.
     *
     * @returns The final accumulator.
     */
    reduce(func: (accum: T, elem: T) => T, initializer?: T): T;
    /**
     * Runs a function on each element of an iterator.
     *
     * This is equivalent to running a for loop on the iterator.
     * If you want to obtain the values, consider using `.map(func).collect()` instead.
     *
     * @param func The function to run.
     */
    forEach(func: (elem: T) => unknown): void;
    /**
     * Generates an iterator that is guaranteed to never yield a value after finishing.
     *
     * @returns The generated iterator.
     */
    fuse(): IterPlus<T>;
    /**
     * Lazily runs functions on an iterator, returning a new iterator with unmodified elements.
     *
     * This function is primarily used as a debugging tool to inspect elements in the middle of an iterator function chain.
     *
     * @param func The function to call.
     * @returns The generated iterator.
     */
    inspect(func: (elem: T) => unknown): IterPlus<T>;
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
    isPartitioned(pred: (elem: T) => boolean): boolean;
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
    isSortedBy(cmp: (first: T, second: T) => number): boolean;
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
    isSortedWith<K>(key: (elem: T) => K): boolean;
    /**
     * Determines if an iterator is sorted increasingly.
     *
     * This function is short-circuiting,
     * so it stops on the first non-sorted element.
     *
     * @returns If the iterator is sorted.
     */
    isSorted(): boolean;
    /**
     * Finds the last element in an iterator.
     *
     * @returns The last element of the iterator, or null if the iterator is empty.
     */
    last(): /* o:Promise<- */ T | Null;
    /**
     * Lazily maps an iterator until it encounters null.
     *
     * @typeParam K The resulting type.
     * @param func The mapping function.
     * @returns The generated iterator.
     */
    mapWhile<K>(func: (elem: T) => /* o:PromiseOrValue<- */ K | Null): IterPlus<K>;
    /**
     * Finds the maximum value of an iterator with a comparison function.
     *
     * @param cmp A function that should return a negative for less than, zero for equal to,
     * and positive for greater than.
     * @param overwrite If `true`, elements will be counted as the new maximum if they are equal to the maximum.
     * Defaults to `false`.
     * @returns The maximum element, or null if the iterator is empty.
     */
    maxBy(cmp: (first: T, second: T) => number, overwrite?: boolean): /* o:Promise<- */ T | null;
    /**
     * Finds the maximum value of an iterator with a key.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @param overwrite If `true`, elements will be counted as the new maximum if they are equal to the maximum.
     * Defaults to `false`.
     * @returns The maximum element, or null if the iterator is empty.
     */
    maxWith<K>(key: (elem: T) => K, overwrite?: boolean): /* o:Promise<- */ T | null;
    /**
     * Finds the maximum value of an iterator.
     *
     * @param overwrite If `true`, elements will be counted as the new maximum if they are equal to the maximum.
     * Defaults to `false`.
     * @returns The maximum element, or null if the iterator is empty.
     */
    max(overwrite?: boolean): /* o:Promise<- */ T | Null;
    /**
     * Finds the minimum value of an iterator with a comparison function.
     *
     * @param cmp A function that should return a negative for less than, zero for equal to,
     * and positive for greater than.
     * @param overwrite If `true`, elements will be counted as the new minimum if they are equal to the minimum.
     * Defaults to `false`.
     * @returns The minimum element, or null if the iterator is empty.
     */
    minBy(cmp: (first: T, second: T) => number, overwrite?: boolean): /* o:Promise<- */ T | null;
    /**
     * Finds the minimum value of an iterator with a key.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     * @param overwrite If `true`, elements will be counted as the new minimum if they are equal to the minimum.
     * Defaults to `false`.
     * @returns The minimum element, or null if the iterator is empty.
     */
    minWith<K>(key: (elem: T) => K, overwrite?: boolean): /* o:Promise<- */ T | null;
    /**
     * Finds the minimum value of an iterator.
     *
     * @param overwrite If `true`, elements will be counted as the new minimum if they are equal to the minimum.
     * Defaults to `false`.
     * @returns The minimum element, or null if the iterator is empty.
     */
    min(overwrite?: boolean): /* o:Promise<- */ T | Null;
    /**
     * Finds the nth element in an iterator.
     *
     * @param n The number element to get.
     * @returns The nth element of the iterator, or null if the iterator is too short.
     */
    nth(n: number): /* o:Promise<- */ T | Null;
    /**
     * Partitions an iterator into two groups.
     *
     * @param pred The predicate function.
     * @returns An array with two elements:
     *  - The elements where the predicate returned true.
     *  - The elements where the predicate returned false.
     */
    partition(pred: (elem: T) => boolean): [T[], T[]];
    /**
     * Generates a `Peekable` iterator.
     *
     * @returns The peekable iterator.
     */
    peekable(): Peekable<T>;
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
    findIndex(pred: (elem: T) => boolean): number;
    /**
     * Returns the product of all elements in the iterator.
     *
     * @returns The product, or 1 if the iterator is empty.
     */
    product(this: /* o:Async- */ IterPlus<number> | /* o:Async- */ IterPlus<bigint>): T;
    /**
     * Returns the sum of all elements in the iterator.
     *
     * @returns The sum, or 0 if the iterator is empty.
     */
    sum(): T extends number ? number : T extends bigint ? bigint : string;
    /**
     * Consumes the iterator and reverses it.
     *
     * This has to immediately resolve every element in the iterator,
     * so it is equivalent to collecting to an array and revsersing the array,
     * so it is very inefficient on memory and should be avoided.
     *
     * @returns The reversed iterator.
     */
    reverse(): IterPlus<T>;
    /**
     * Skips the first n elements of an iterator.
     *
     * @param n The number of elements to skip.
     * @returns The generated iterator.
     */
    skip(n: number): IterPlus<T>;
    /**
     * Skips elements of an iterator while a predicate is met.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    skipWhile(pred: (elem: T) => boolean): IterPlus<T>;
    /**
     * Takes the first n elements of an iterator.
     *
     * @param n The number of elements to take.
     * @returns The generated iterator.
     */
    take(n: number): IterPlus<T>;
    /**
     * Takes elements of an iterator while a predicate is met.
     *
     * @param pred The predicate function.
     * @returns The generated iterator.
     */
    takeWhile(pred: (elem: T) => boolean): IterPlus<T>;
    /**
     * "Unzips" an iterator of tuples into a tuple of arrays.
     *
     * @typeParam K The tuple type.
     * @returns A tuple with the individual elements.
     */
    unzip<K extends unknown[]>(this: IterPlus<K>): ArrayMap<K>;
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
    zipWith<K extends unknown[], R>(func: (...args: [T, ...K]) => R, ...iters: IterableMap<K>): IterPlus<R>;
    /**
     * Zips one or more iterables with this iterator.
     *
     * @typeParam K The types of the other iterables.
     * @param iters The iterables to zip with this one.
     * @returns The generated iterator.
     */
    zip<K extends unknown[]>(...iters: IterableMap<K>): IterPlus<[T, ...K]>;
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
    tee(count?: number): IterPlus<T>[];
    /**
     * Returns the average of all elements in the iterator.
     *
     * @throws A RangeError on an empty iterator.
     *
     * @returns The average.
     */
    average(this: /* o:Async- */ IterPlus<number> | /* o:Async- */ IterPlus<bigint>): T;
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
     *
     * @returns An iterator that yields the chunks.
     */
    chunks(chunkSize: number): IterPlus<T[]>;
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
     *
     * @returns An iterator that yields the chunks.
     */
    chunksExact(chunkSize: number): IterPlus<T[]>;
    /**
     * Creates an iterator that repeats the contents of the current iterator a certain number of times.
     *
     * @param n The number of times to repeat.
     *
     * @returns An iterator that repeats itself n times.
     */
    repeat(n: number): IterPlus<T>;
    /**
     * Creates an iterator that's rotated left a certain amount,
     * so elements at the start end up at the end.
     *
     * This **does not** handle negative numbers due to right rotation being significantly slower.
     * If you want negatives, please do the checks yourself and use rotateRight when appropriate.
     *
     * @throws A RangeError when the amount is negative.
     *
     * @param amount Amount to rotate by.
     *
     * @returns The rotated iterator.
     */
    rotateLeft(amount: number): IterPlus<T>;
    /**
     * Creates an iterator that's rotated right a certain amount,
     * so elements at the end end up at the start.
     *
     * **Due to the one-directional nature of iterators, this is not lazy and therefore much slower than `rotateLeft`.**
     *
     * This **does not** handle negative numbers to be consistent with `rotateLeft`.
     * If you want negatives, please do the checks yourself and use rotateRight when appropriate.
     *
     * @throws A RangeError when the amount is negative.
     *
     * @param amount Amount to rotate by.
     *
     * @returns The rotated iterator.
     */
    rotateRight(amount: number): IterPlus<T>;
    /**
     * Splits an iterator on an element.
     *
     * @param ele The element to split on.
     * @param limit The maximum number of chunks to make.
     *
     * @returns The iterator with the split chunks.
     */
    split(elem: T, limit?: number): IterPlus<T[]>;
    /**
     * Splits an iterator on a predicate.
     *
     * @param pred The predicate to split with.
     * @param limit The maximum number of chunks to make.
     *
     * @returns The iterator with the split chunks.
     */
    splitPred(pred: (elem: T) => boolean, limit?: number): IterPlus<T[]>;
    /**
     * Splits an iterator on an element,
     * including the matched element as the last element of the chunk.
     *
     * Unlike the exclusive split,
     * this does not create an empty chunk on the end when ending with the matched element.
     *
     * @param ele The element to split on.
     * @param limit The maximum number of chunks to make.
     *
     * @returns The iterator with the split chunks.
     */
    splitInclusive(elem: T, limit?: number): IterPlus<T[]>;
    /**
     * Splits an iterator on a predicate,
     * including the matched element as the last element of the chunk.
     *
     * Unlike the exclusive split,
     * this does not create an empty chunk on the end when ending with the matched element.
     *
     * @param pred The predicate to split with.
     * @param limit The maximum number of chunks to make.
     *
     * @returns The iterator with the split chunks.
     */
    splitPredInclusive(pred: (elem: T) => boolean, limit?: number): IterPlus<T[]>;
    /**
     * Returns an iterator yielding overlapping windows of the iterator.
     *
     * If there aren't enough elements to fill a window,
     * no windows will be yielded.
     *
     * @param windowSize The window size.
     * @param interval The increment between the starts of windows. Defaults to 1.
     *
     * @returns An iterator that yields the windows.
     */
    windows(windowSize: number, interval?: number): IterPlus<T[]>;
    /**
     * Removes elements of an iterator that are equal to the previous one.
     *
     * @returns An iterator with no consecutive duplicates.
     */
    dedup(): IterPlus<T>;
    /**
     * Removes elements of an iterator that are equal to the previous one with a key.
     *
     * @typeParam K The type of the key.
     * @param key The key function.
     *
     * @returns An iterator with no consecutive duplicates.
     */
    dedupWith<K>(key: (elem: T) => K): IterPlus<T>;
    /**
     * Removes elements of an iterator that are equal to the previous one with a comparison function.
     *
     * @param cmp A function that checks if elements are equal.
     *
     * @returns An iterator with no consecutive duplicates.
     */
    dedupBy(cmp: (first: T, second: T) => boolean): IterPlus<T>;
    /**
     * Intersperses an element between every element of the iterator.
     *
     * @param elem The element to intersperse.
     *
     * @returns The new iterator.
     */
    intersperse(elem: T): IterPlus<T>;
    /**
     * Intersperses multiple elements between every element of the iterator.
     *
     * @param elems The elements to intersperse.
     *
     * @returns The new iterator.
     */
    intersperseMultiple(elems: Iterable<T>): IterPlus<T>;
    /**
     * Joins an iterator of iterables with an element.
     *
     * @typeParam K The internal type.
     * @param elem The element to join with.
     *
     * @returns The joined iterator.
     */
    join<K>(this: IterPlus</* o:Iterable<K> | Async- */ Iterable<K>>, elem: K): IterPlus<K>;
    /**
     * Joins an iterator of iterables with multiple elements.
     *
     * @typeParam K The internal type.
     * @param elems The elements to intersperse.
     *
     * @returns The joined iterator.
     */
    joinMultiple<K>(this: IterPlus</* o:Iterable<K> | Async- */ Iterable<K>>, elems: Iterable<K>): IterPlus<K>;
}
/**
 * An iterator with a `peek`. method that can look one element in advance.
 *
 * Do not instantiate this directly, instead use the `peekable` method in `IterPlus` or `AsyncIterPlus`.
 *
 * @typeParam T The item type of the iterator.
 */
export declare class Peekable<T>/* r:extends Async- */  extends IterPlus<T> {
    private storedVal;
    constructor(iter: Iterator<T>);
    /**
     * Yields the next element in the iterator.
     *
     * @returns The next element.
     */
    next(): IteratorResult<T>;
    /**
     * Peeks the next element in the iterator and does not consume it.
     *
     * @returns The next element.
     */
    peek(): IteratorResult<T>;
}
export {};
