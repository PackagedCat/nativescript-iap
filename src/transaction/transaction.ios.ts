import { TransactionBase, TransactionState } from "./transaction.common";

export * from "./transaction.common";

export class Transaction extends TransactionBase<SKPaymentTransaction> {
    constructor(nativeObject: SKPaymentTransaction) {
        super(nativeObject);

        if (nativeObject.originalTransaction) {
            this.date = nativeObject.originalTransaction.transactionDate;
        } else {
            this.date = nativeObject.transactionDate;
        }

        this.id = nativeObject.transactionIdentifier;

        switch (nativeObject.transactionState) {
            case SKPaymentTransactionState.Deferred:
                this.state = TransactionState.deferred;
                break;
            case SKPaymentTransactionState.Purchased:
                this.state = TransactionState.purchased;
                break;
            case SKPaymentTransactionState.Purchasing:
                this.state = TransactionState.purchasing;
                break;
            case SKPaymentTransactionState.Restored:
                this.state = TransactionState.restored;
                break;
        }

        if (nativeObject.payment) {
            this.productId = nativeObject.payment.productIdentifier;
            this.quantity = nativeObject.payment.quantity;
        }
    }
}
