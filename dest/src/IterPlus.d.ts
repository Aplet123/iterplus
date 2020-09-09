/**
 * A value that an iterator yields. Intentionally ignores the return value.
 */
export declare type IterYield<T> = /* o:Promise<- */ {
    done: false;
    value: T;
} | {
    done: true;
    value: unknown;
};
/**
 * A Javascript iterator. Intentionally ignores the return value.
 *
 * @typeParam T The type of item yielded by the iterator.
 */
export interface Iter<T> {
    /**
     * A function that yields the next item of the iterator.
     */
    next(): IterYield<T>;
}
/**
 * An iterable object.
 *
 * @typeParam T The type of item yielded by the iterator generated by the iterable.
 */
export interface CanIter<T> {
    /**
     * A function that generates an iterator.
     */
    [Symbol.iterator](): Iter<T>;
}
/**
 * Tests if an object is an iterator.
 * @param obj The object to test for.
 * @returns If `obj` is an iterator.
 */
export declare function isIter(obj: any): obj is Iter<unknown>;
/**
 * Tests if an object is iterable.
 * @param obj The object to test for.
 * @returns If `obj` is an iterable.
 */
export declare function canIter(obj: any): obj is CanIter<unknown>;
/**
 * A wrapper around an iterator to add additional functionality.
 */
export declare class IterPlus<T> implements Iter<T>, CanIter<T>, Iterator<T>, Iterable<T> {
    /**
     * The internal iterator that this wraps around.
     */
    private internal;
    constructor(iter: Iter<T>);
    next(): IterYield<T>;
    [Symbol.iterator](): Iter<T>;
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
     * @param func The function to yield values, or null to end the iterator.
     * @returns The generated iterator.
     */
    static fromFunction<T>(func: () => /* o:Promise<- */ T | null): IterPlus<T>;
}
