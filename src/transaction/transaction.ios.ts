import { TransactionBase, TransactionState } from "./transaction.common";

export * from "./transaction.common";

export class Transaction extends TransactionBase<SKPaymentTransaction> {
    constructor(nativeObject: SKPaymentTransaction) {
        super(nativeObject);

        if (nativeObject.originalTransaction) {
            this._date = nativeObject.originalTransaction.transactionDate;
        } else {
            this._date = nativeObject.transactionDate;
        }

        this._id = nativeObject.transactionIdentifier;

        switch (nativeObject.transactionState) {
            case SKPaymentTransactionState.Deferred:
                this._state = TransactionState.deferred;
                break;
            case SKPaymentTransactionState.Failed:
                this._state = TransactionState.failed;
                break;
            case SKPaymentTransactionState.Purchased:
                this._state = TransactionState.purchased;
                break;
            case SKPaymentTransactionState.Purchasing:
                this._state = TransactionState.purchasing;
                break;
            case SKPaymentTransactionState.Restored:
                this._state = TransactionState.restored;
                break;
        }

        if (nativeObject.payment) {
            this._productId = nativeObject.payment.productIdentifier;
            this._quantity = nativeObject.payment.quantity;
        }
    }
}