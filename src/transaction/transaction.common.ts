export class TransactionBase {
    public nativeObject: any;

    public date: Date;
    public error: PurchaseError;
    public id: string;
    public state: TransactionState;
    public productId: string;

    constructor(nativeObject: any) {
        this.nativeObject = nativeObject;
    }
}

export enum TransactionState {
	purchasing = 0,
	purchased = 1,
	failed = 2,
	restored = 3,
	deferred = 4,
    refunded = 5
}

export enum PurchaseErrorCode {
    unknown = 0,
    canceled = 1,
    itemAlreadyOwned = 2,
    itemUnavailable = 3,
    userNotAuthorized = 4
}

export class PurchaseError extends Error {
    public code: number;

    constructor(code: PurchaseErrorCode, message: string) {
        super(message);
        this.code = code;
    }
}