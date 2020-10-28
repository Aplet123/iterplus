"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularBuffer = void 0;
/**
 * A circular buffer with constant time push and pop on both ends.
 *
 * @typeParam T The type of item contained inside.
 */
class CircularBuffer {
    /**
     * Constructs a new `CircularBuffer` from a dataset.
     *
     * @param init The initial data.
     */
    constructor(init = []) {
        const data = [];
        for (const elem of init) {
            data.push(elem);
        }
        const totlen = data.length;
        // initialize to a minimum length of 32 to get table doubling started faster
        while (data.length < 32) {
            data.push(null);
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
    size() {
        return this.len;
    }
    /**
     * Gets an element from the buffer. Errors on out of bound access.
     *
     * @param ind The index to get.
     * @returns The element at the index.
     */
    get(ind) {
        if (ind < 0 || ind >= this.size()) {
            throw new RangeError("Index out of bounds.");
        }
        return this.data[(this.start + ind) % this.data.length];
    }
    /**
     * Sets an element in the buffer. Errors on out of bounds access.
     *
     * @param ind The index to set.
     * @param val The value to set to.
     */
    set(ind, val) {
        if (ind < 0 || ind >= this.size()) {
            throw new RangeError("Index out of bounds.");
        }
        this.data[(this.start + ind) % this.data.length] = val;
    }
    /**
     * Generates an iterator for the buffer.
     *
     * @returns An iterator.
     */
    *[Symbol.iterator]() {
        for (let i = this.start; i != this.end; i = (i + 1) % this.data.length) {
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
    toArray() {
        if (this.start < this.end) {
            return this.data.slice(this.start, this.end);
        }
        return [
            ...this.data.slice(this.start),
            ...this.data.slice(0, this.end),
        ];
    }
    /**
     * Expands the buffer if needed.
     */
    possiblyExpand() {
        if (this.size() >= this.data.length - 1) {
            const newData = new Array(this.data.length * 2);
            let i = 0;
            for (const elem of this) {
                newData[i] = elem;
                i++;
            }
            this.start = 0;
            this.end = i;
            this.data = newData;
        }
    }
    /**
     * Shrinks the buffer if needed.
     */
    possiblyShrink() {
        if (this.size() * 4 <= this.data.length) {
            const newData = new Array(Math.floor(this.data.length / 2));
            let i = 0;
            for (const elem of this) {
                newData[i] = elem;
                i++;
            }
            this.start = 0;
            this.end = i;
            this.data = newData;
        }
    }
    /**
     * Pushes a value to the end of the buffer.
     *
     * @param val The value to push.
     */
    pushEnd(val) {
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
    pushStart(val) {
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
    popEnd() {
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
    popStart() {
        if (this.size() == 0) {
            throw new RangeError("Index out of bounds.");
        }
        const ret = this.data[this.start];
        this.start = (this.start + 1) % this.data.length;
        this.possiblyShrink();
        this.len--;
        return ret;
    }
}
exports.CircularBuffer = CircularBuffer;
//# sourceMappingURL=CircularBuffer.js.map