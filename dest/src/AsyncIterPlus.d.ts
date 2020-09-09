/**
 * A value that an iterator yields. Intentionally ignores the return value.
 */
export declare type AsyncIterYield<T> = Promise<{
    done: false;
    value: T;
} | {
    done: true;
    value: unknown;
}>;
/**
 * A Javascript iterator. Intentionally ignores the return value.
 *
 * @typeParam T The type of item yielded by the iterator.
 */
export interface AsyncIter<T> {
    /**
     * A function that yields the next item of the iterator.
     */
    next(): AsyncIterYield<T>;
}
/**
 * An iterable object.
 *
 * @typeParam T The type of item yielded by the iterator generated by the iterable.
 */
export interface CanAsyncIter<T> {
    /**
     * A function that generates an iterator.
     */
    [Symbol.asyncIterator](): AsyncIter<T>;
}
/**
 * Tests if an object is an iterator.
 * @param obj The object to test for.
 * @returns If `obj` is an iterator.
 */
export declare function isAsyncIter(obj: any): obj is AsyncIter<unknown>;
/**
 * Tests if an object is iterable.
 * @param obj The object to test for.
 * @returns If `obj` is an iterable.
 */
export declare function canAsyncIter(obj: any): obj is CanAsyncIter<unknown>;
/**
 * A wrapper around an iterator to add additional functionality.
 */
export declare class AsyncIterPlus<T> implements AsyncIter<T>, CanAsyncIter<T>, AsyncIterator<T>, AsyncIterable<T> {
    /**
     * The internal iterator that this wraps around.
     */
    private internal;
    constructor(iter: AsyncIter<T>);
    next(): AsyncIterYield<T>;
    [Symbol.asyncIterator](): AsyncIter<T>;
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
}
