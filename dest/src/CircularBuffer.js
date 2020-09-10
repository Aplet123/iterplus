"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularBuffer = void 0;
class CircularBuffer {
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
    size() {
        return this.len;
    }
    get(ind) {
        if (ind < 0 || ind >= this.size()) {
            throw new RangeError("Index out of bounds.");
        }
        return this.data[(this.start + ind) % this.data.length];
    }
    set(ind, val) {
        if (ind < 0 || ind >= this.size()) {
            throw new RangeError("Index out of bounds.");
        }
        this.data[(this.start + ind) % this.data.length] = val;
    }
    *[Symbol.iterator]() {
        for (let i = this.start; i != this.end; i = (i + 1) % this.data.length) {
            yield this.data[i];
        }
    }
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
    possiblyShrink() {
        if (this.size() <= this.data.length / 3) {
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
    pushEnd(val) {
        this.possiblyExpand();
        this.data[this.end] = val;
        this.end = (this.end + 1) % this.data.length;
        this.len++;
    }
    pushStart(val) {
        this.possiblyExpand();
        this.start = (this.start - 1 + this.data.length) % this.data.length;
        this.data[this.start] = val;
        this.len++;
    }
    popEnd() {
        if (this.size() == 0) {
            throw new RangeError("Index out of bounds.");
        }
        this.end = (this.end - 1 + this.data.length) % this.data.length;
        const ret = this.data[this.end];
        // this.possiblyShrink();
        this.len--;
        return ret;
    }
    popStart() {
        if (this.size() == 0) {
            throw new RangeError("Index out of bounds.");
        }
        const ret = this.data[this.start];
        this.start = (this.start + 1) % this.data.length;
        // this.possiblyShrink();
        this.len--;
        return ret;
    }
}
exports.CircularBuffer = CircularBuffer;
//# sourceMappingURL=CircularBuffer.js.map