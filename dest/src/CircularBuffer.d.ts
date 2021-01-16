/**
 * A circular buffer with constant time push and pop on both ends.
 *
 * @typeParam T The type of item contained inside.
 */
export declare class CircularBuffer<T> {
    /**
     * The index of the start of the buffer.
     */
    private start;
    /**
     * The index of the end of the buffer.
     */
    private end;
    /**
     * The data contained in the buffer.
     */
    private data;
    /**
     * The number of data elements in the buffer.
     */
    private len;
    /**
     * Constructs a new `CircularBuffer` from a dataset.
     *
     * @param init The initial data.
     * @param capcity The initial capacity to allocate.
     */
    constructor(init?: Iterable<T>, capacity?: number);
    /**
     * Returns the number of elements in the buffer.
     *
     * @returns The number of elements.
     */
    size(): number;
    /**
     * Returns the number of elements allocated.
     *
     * @returns The number of elements allocated.
     */
    capacity(): number;
    /**
     * Gets an element from the buffer. Errors on out of bound access.
     *
     * @param ind The index to get.
     * @returns The element at the index.
     */
    get(ind: number): T;
    /**
     * Utility function to get the last element of the buffer. Errors on an empty buffer.
     *
     * @returns The element at the back.
     */
    getEnd(): T;
    /**
     * Sets an element in the buffer. Errors on out of bounds access.
     *
     * @param ind The index to set.
     * @param val The value to set to.
     */
    set(ind: number, val: T): void;
    /**
     * Utility function to set the last element of the buffer. Errors on an empty buffer.
     *
     * @param val The value to set to.
     */
    setEnd(val: T): void;
    /**
     * Generates an iterator for the buffer.
     *
     * @returns An iterator.
     */
    [Symbol.iterator](): Generator<T>;
    /**
     * Returns a shallow-copied array of the data.
     *
     * This is faster than collecting the iterator.
     *
     * @returns The array.
     */
    toArray(): T[];
    /**
     * Resizes the buffer to a certain capacity.
     *
     * This function also makes the buffer contiguous,
     * so `toArray` will return faster.
     *
     * If the capacity is too small,
     * then it will automatically be scaled up to the length of the buffer.
     *
     * @param capacity The capacity to expand to.
     */
    resizeTo(capacity: number): void;
    /**
     * Expands the buffer if needed.
     */
    private possiblyExpand;
    /**
     * Shrinks the buffer if needed.
     */
    private possiblyShrink;
    /**
     * Pushes a value to the end of the buffer.
     *
     * @param val The value to push.
     */
    pushEnd(val: T): void;
    /**
     * Pushes a value to the start of the buffer.
     *
     * @param val The value to push.
     */
    pushStart(val: T): void;
    /**
     * Pops a value from the start of the buffer.
     *
     * @returns The popped value.
     */
    popEnd(): T;
    /**
     * Pops a value from the end of the buffer.
     *
     * @returns The popped value.
     */
    popStart(): T;
    /**
     * Clears the buffer, setting its length to 0.
     *
     * This doesn't deallocate any space.
     */
    clear(): void;
}
