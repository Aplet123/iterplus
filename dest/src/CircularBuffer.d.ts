export declare class CircularBuffer<T> {
    private start;
    private end;
    private data;
    private len;
    constructor(init?: Iterable<T>);
    size(): number;
    get(ind: number): T;
    set(ind: number, val: T): void;
    [Symbol.iterator](): Generator<T>;
    private possiblyExpand;
    private possiblyShrink;
    pushEnd(val: T): void;
    pushStart(val: T): void;
    popEnd(): T;
    popStart(): T;
}
