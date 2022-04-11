export abstract class TransactionBase<T> {
    public nativeObject: T;

    public date!: Date;

    public id!: string;

    public state!: TransactionState;

    public productId!: string;

    public quantity!: number;

    constructor(nativeObject: T) {
        this.nativeObject = nativeObject;
    }
}

export enum TransactionState {
    purchasing = "purchasing",
    purchased = "purchased",
    restored = "restored",
    deferred = "deferred",
    refunded = "refunded"
}
