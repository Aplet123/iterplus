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
 * Typescript-abusing type that wraps every type in a tuple type with an array.
 */
declare type ArrayMap<T extends unknown[]> = {
    [K in keyof T]: T[K][];
};
/**
 * A wrapper around an iterator to add additional functionality. The types intentionally ignore return value.
 */
export declare class IterPlus<T> implements CurIter<T>, /* o:Async- */ Iterable<T> {
    /**
     * The internal iterator that this wraps around.
     */
    private internal;
    constructor(iter: Iterator<T>);
    next(): IteratorResult<T>;
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
     * @param func The function to yield values, or null to end the iterator.
     * @returns The generated iterator.
     */
    static fromFunction<T>(func: () => /* o:Promise<- */ T | null): IterPlus<T>;
    /**
     * Generates an iterator that lazily yields a single value.
     *
     * @param func The function to generate a single value.
     * @returns The generated iterator.
     */
    static onceWith<T>(func: () => T): IterPlus<T>;
    /**
     * Generates an iterator that yields a single value.
     *
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static once<T>(val: T): IterPlus<T>;
    /**
     * Generates an iterator that endlessly calls a function.
     *
     * @param func The function to generate values.
     * @returns The generated iterator.
     */
    static repeatWith<T>(func: () => T): IterPlus<T>;
    /**
     * Generates an iterator that endlessly repeats a value.
     *
     * @param val The value to yield.
     * @returns The generated iterator.
     */
    static repeat<T>(val: T): IterPlus<T>;
    /**
     * Generates an iterator that generates values based on the previous value.
     *
     * @param first The initial value.
     * @param func The function to generate new values.
     * @returns The generated iterator.
     */
    static successors<T>(first: T | null, func: (prev: T) => T | null): IterPlus<T>;
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
    static cycle<T>(data: Iterable<T>): IterPlus<T>;
    /**
     * Generates an iterator that iterates through lexicographically sorted combinations without repetition of a dataset.
     *
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinations<T>(data: T[], count?: number): IterPlus<T[]>;
    /**
     * Generates an iterator that iterates through lexicographically sorted combinations with repetition of a dataset.
     *
     * @param data The data to generate combinations from.
     * @param count The number of elements in each combination.
     * @returns The generated iterator.
     */
    static combinationsWithRepetition<T>(data: T[], count?: number): IterPlus<T[]>;
    /**
     * Generates an iterator that iterates through lexicographically sorted permutations without repetition of a dataset.
     *
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutations<T>(data: T[], count?: number): IterPlus<T[]>;
    /**
     * Generates an iterator that iterates through lexicographically sorted permutations with repetition of a dataset.
     *
     * @param data The data to generate permutations from.
     * @param count The number of elements in each permutations.
     * @returns The generated iterator.
     */
    static permutationsWithRepetition<T>(data: T[], count?: number): IterPlus<T[]>;
    /**
     * Generates an iterator that generates a lexicographically sorted cartesian product.
     *
     * @param data The iterators to take the product of.
     * @returns The generated iterator.
     */
    static product<T extends unknown[]>(...data: ArrayMap<T>): IterPlus<T>;
    /**
     * Checks if every element in the iterator matches a predicate.
     *
     * This function is short-circuiting,
     * so if any element returns false,
     * the function immediately returns false.
     *
     * @param pred The predicate function.
     * @returns If every element satisfies the predicate.
     */
    every(pred: (elem: T) => boolean): boolean;
}
export {};
