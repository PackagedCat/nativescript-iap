export class Transaction {
    public nativeObject: any;

    /**
     * Gets the date the product was purchased.
     */
    public date: Date;

    /**
     * Gets the unique order identifier for the transaction.
     */
    public id: string;

    /**
     * Gets the current state of the transaction.
     */
    public state: TransactionState;

    /**
     * Gets the product ID.
     */
    public productId: string[];

    /**
     * Gets the quantity of the purchased product.
     */
    public quantity: string[];

    constructor(nativeObject: any);
}

/**
 * Represents the states of transaction.
 */
export enum TransactionState {
	purchasing = "purchasing",
	purchased = "purchased",
	restored = "restored",
	deferred = "deferred",
    refunded = "refunded"
}
