/**
 * A circular buffer with constant time push and pop on both ends.
 *
 * @typeParam T The type of item contained inside.
 */
export class CircularBuffer<T> {
    /**
     * The index of the start of the buffer.
     */
    private start: number;
    /**
     * The index of the end of the buffer.
     */
    private end: number;
    /**
     * The data contained in the buffer.
     */
    private data: T[];
    /**
     * The number of data elements in the buffer.
     */
    private len: number;

    /**
     * Constructs a new `CircularBuffer` from a dataset.
     *
     * @param init The initial data.
     * @param capcity The initial capacity to allocate.
     */
    constructor(init: Iterable<T> = [], capacity: number = 32) {
        let data = [...init];
        const totlen = data.length;
        // initialize to a minimum length of 32 to get table doubling started faster
        if (data.length < capacity) {
            data = data.concat(Array(capacity - data.length).fill(null));
        }
        this.data = data;
        this.start = 0;
        this.end = totlen % data.length;
        this.len = totlen;
    }

    /**
     * Returns the number of elements in the buffer.
     *
     * @returns The number of elements.
     */
    size(): number {
        return this.len;
    }

    /**
     * Returns the number of elements allocated.
     *
     * @returns The number of elements allocated.
     */
    capacity(): number {
        return this.data.length;
    }

    /**
     * Gets an element from the buffer. Errors on out of bound access.
     *
     * @param ind The index to get.
     * @returns The element at the index.
     */
    get(ind: number): T {
        if (ind < 0 || ind >= this.size()) {
            throw new RangeError("Index out of bounds.");
        }
        return this.data[(this.start + ind) % this.data.length];
    }

    /**
     * Utility function to get the last element of the buffer. Errors on an empty buffer.
     *
     * @returns The element at the back.
     */
    getEnd(): T {
        const size = this.size();
        if (size === 0) {
            throw new RangeError("Cannot get back of empty circular buffer.");
        }
        return this.data[(this.end - 1 + this.data.length) % this.data.length];
    }

    /**
     * Sets an element in the buffer. Errors on out of bounds access.
     *
     * @param ind The index to set.
     * @param val The value to set to.
     */
    set(ind: number, val: T) {
        if (ind < 0 || ind >= this.size()) {
            throw new RangeError("Index out of bounds.");
        }
        this.data[(this.start + ind) % this.data.length] = val;
    }

    /**
     * Utility function to set the last element of the buffer. Errors on an empty buffer.
     *
     * @param val The value to set to.
     */
    setEnd(val: T) {
        const size = this.size();
        if (size === 0) {
            throw new RangeError("Cannot set back of empty circular buffer.");
        }
        this.data[(this.end - 1 + this.data.length) % this.data.length] = val;
    }

    /**
     * Generates an iterator for the buffer.
     *
     * @returns An iterator.
     */
    *[Symbol.iterator](): Generator<T> {
        for (
            let i = this.start;
            i != this.end;
            i = (i + 1) % this.data.length
        ) {
            yield this.data[i];
        }
    }

    /**
     * Returns a shallow-copied array of the data.
     *
     * This is faster than collecting the iterator.
     *
     * @returns The array.
     */
    toArray(): T[] {
        if (this.start <= this.end) {
            return this.data.slice(this.start, this.end);
        }
        if (this.end === 0) {
            return this.data.slice(this.start);
        }
        return this.data.slice(this.start).concat(this.data.slice(0, this.end));
    }

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
    resizeTo(capacity: number) {
        const newData = new Array(capacity);
        let i = 0;
        for (const elem of this) {
            newData[i] = elem;
            i++;
        }
        this.start = 0;
        this.end = i;
        this.data = newData;
    }

    /**
     * Expands the buffer if needed.
     */
    private possiblyExpand() {
        if (this.size() >= this.data.length - 1) {
            this.resizeTo(this.data.length * 2);
        }
    }

    /**
     * Shrinks the buffer if needed.
     */
    private possiblyShrink() {
        if (this.size() * 4 <= this.data.length) {
            this.resizeTo(Math.ceil(this.data.length / 2));
        }
    }

    /**
     * Pushes a value to the end of the buffer.
     *
     * @param val The value to push.
     */
    pushEnd(val: T) {
        this.possiblyExpand();
        this.data[this.end] = val;
        this.end = (this.end + 1) % this.data.length;
        this.len++;
    }

    /**
     * Pushes a value to the start of the buffer.
     *
     * @param val The value to push.
     */
    pushStart(val: T) {
        this.possiblyExpand();
        this.start = (this.start - 1 + this.data.length) % this.data.length;
        this.data[this.start] = val;
        this.len++;
    }

    /**
     * Pops a value from the start of the buffer.
     *
     * @returns The popped value.
     */
    popEnd(): T {
        if (this.size() == 0) {
            throw new RangeError("Index out of bounds.");
        }
        this.end = (this.end - 1 + this.data.length) % this.data.length;
        const ret = this.data[this.end];
        this.possiblyShrink();
        this.len--;
        return ret;
    }

    /**
     * Pops a value from the end of the buffer.
     *
     * @returns The popped value.
     */
    popStart(): T {
        if (this.size() == 0) {
            throw new RangeError("Index out of bounds.");
        }
        const ret = this.data[this.start];
        this.start = (this.start + 1) % this.data.length;
        this.possiblyShrink();
        this.len--;
        return ret;
    }

    /**
     * Clears the buffer, setting its length to 0.
     *
     * This doesn't deallocate any space.
     */
    clear() {
        this.start = 0;
        this.end = 0;
        this.len = 0;
    }
}
