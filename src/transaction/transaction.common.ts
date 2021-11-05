export abstract class TransactionBase<T> {
    public _nativeObject: T;
    public get nativeObject() {
        return this._nativeObject;
    }

    protected _date!: Date;
    public get date() {
        return this._date;
    }
    
    protected _id!: string;
    public get id() {
        return this._id;
    }

    protected _state!: TransactionState;
    public get state() {
        return this._state;
    }

    protected _productId!: string;
    public get productId() {
        return this._productId;
    }

    protected _quantity!: number;
    public get quantity() {
        return this._quantity;
    }

    constructor(nativeObject: T) {
        this._nativeObject = nativeObject;
    }
}

export enum TransactionState {
	purchasing = "purchasing",
	purchased = "purchased",
	failed = "failed",
	restored = "restored",
	deferred = "deferred",
    refunded = "refunded"
}
