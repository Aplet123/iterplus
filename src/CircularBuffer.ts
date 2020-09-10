export class CircularBuffer<T> {
    private start: number;
    private end: number;
    private data: T[];
    private len: number;

    constructor(init: Iterable<T> = []) {
        const data = [];
        for (const elem of init) {
            data.push(elem);
        }
        const totlen = data.length;
        // initialize to a minimum length of 32 to get table doubling started faster
        while (data.length < 32) {
            data.push((null as unknown) as T);
        }
        this.data = data;
        this.start = 0;
        this.end = totlen % data.length;
        this.len = totlen;
    }

    size(): number {
        return this.len;
    }

    get(ind: number): T {
        if (ind < 0 || ind >= this.size()) {
            throw new RangeError("Index out of bounds.");
        }
        return this.data[(this.start + ind) % this.data.length];
    }

    set(ind: number, val: T) {
        if (ind < 0 || ind >= this.size()) {
            throw new RangeError("Index out of bounds.");
        }
        this.data[(this.start + ind) % this.data.length] = val;
    }

    *[Symbol.iterator](): Generator<T> {
        for (
            let i = this.start;
            i != this.end;
            i = (i + 1) % this.data.length
        ) {
            yield this.data[i];
        }
    }

    private possiblyExpand() {
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

    private possiblyShrink() {
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

    pushEnd(val: T) {
        this.possiblyExpand();
        this.data[this.end] = val;
        this.end = (this.end + 1) % this.data.length;
        this.len++;
    }

    pushStart(val: T) {
        this.possiblyExpand();
        this.start = (this.start - 1 + this.data.length) % this.data.length;
        this.data[this.start] = val;
        this.len++;
    }

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
}
