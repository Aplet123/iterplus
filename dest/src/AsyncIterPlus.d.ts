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
 * A wrapper around an iterator to add additional functionality. The types intentionally ignore return value.
 */
export declare class AsyncIterPlus<T> implements CurIter<T>, AsyncIterable<T> {
    /**
     * The internal iterator that this wraps around.
     */
    private internal;
    constructor(iter: AsyncIterator<T>);
    next(): Promise<IteratorResult<T>>;
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
     * @param func The function to yield values, or null to end the iterator.
     * @returns The generated iterator.
     */
    static fromFunction<T>(func: () => Promise<T | null>): AsyncIterPlus<T>;
    /**
     * Generates an iterator that lazily yields a single value.
     *
     * @param func The function to generate a single value.
     * @returns The generated iterator.
     */
    static onceWith<T>(func: () => Promise<T>): AsyncIterPlus<T>;
    /**
     * Generates an iterator that yields a single value.
     *
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static once<T>(val: Promise<T>): AsyncIterPlus<T>;
    /**
     * Generates an iterator that endlessly calls a function.
     *
     * @param func The function to generate values.
     * @returns The generated iterator.
     */
    static repeatWith<T>(func: () => Promise<T>): AsyncIterPlus<T>;
    /**
     * Generates an iterator that endlessly repeats a value.
     *
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static repeat<T>(val: Promise<T>): AsyncIterPlus<T>;
    /**
     * Generates an iterator that generates values based on the previous value.
     *
     * @param first The initial value.
     * @param func The function to generate new values.
     * @returns The generated iterator.
     */
    static successors<T>(first: T | null, func: (prev: T) => T | null): AsyncIterPlus<T>;
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
    static cycle<T>(data: AsyncIterable<T>): AsyncIterPlus<T>;
    /**
     * Generates an iterator that iterates through lexicographically sorted combinations without repetition of a dataset.
     *
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinations<T>(data: T[], count?: number): AsyncIterPlus<T[]>;
    /**
     * Generates an iterator that iterates through lexicographically sorted combinations with repetition of a dataset.
     *
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinationsWithRepetition<T>(data: T[], count?: number): AsyncIterPlus<T[]>;
    /**
     * Generates an iterator that iterates through lexicographically sorted permutations without repetition of a dataset.
     *
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutations<T>(data: T[], count?: number): AsyncIterPlus<T[]>;
    /**
     * Generates an iterator that iterates through lexicographically sorted permutations with repetition of a dataset.
     *
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutationsWithRepetition<T>(data: T[], count?: number): AsyncIterPlus<T[]>;
}
export {};
