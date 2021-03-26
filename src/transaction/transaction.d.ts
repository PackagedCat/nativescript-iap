export class Transaction {
    public nativeObject: any;

    /**
     * Gets the date the product was purchased.
     */
    public date: Date;

    /**
     * Gets the transaction error.
     */
    public error: PurchaseError;

    /**
     * Gets the unique order identifier for the transaction.
     * @summary On Android returns null if the transaction was restored.
     */
    public id: string;

    /**
     * Gets the current state of the transaction.
     */
    public state: TransactionState;

    /**
     * Gets the product Id.
     */
    public productId: string;

    constructor(nativeValue: any);
}

/**
 * Represents the states of transaction.
 */
export enum TransactionState {
	purchasing = 0,
	purchased = 1,
	failed = 2,
	restored = 3,
	deferred = 4,
    refunded = 5
}

/**
 * Represents the error codes for PurchaseError.
 */
export enum PurchaseErrorCode {
    /**
     * Unknow error during the API action.
     */
    unknown = 0,

    /**
     * User pressed back or canceled a dialog.
     */
    canceled = 1,

    /**
     * Android only: Failure to purchase since item is already owned.
     */
    itemAlreadyOwned = 2,

    /**
     * Requested product is not available for purchase.
     */
    itemUnavailable = 3,

    /**
     * iOS only: The user is not allowed to authorize payments.
     */
    userNotAuthorized = 4
}

export class PurchaseError extends Error {
    public code: number;

    constructor(code: PurchaseErrorCode, message: string);
}