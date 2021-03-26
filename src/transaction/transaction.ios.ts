import { PurchaseError, PurchaseErrorCode, TransactionBase, TransactionState } from "./transaction.common";

export * from "./transaction.common";

export class Transaction extends TransactionBase {
    constructor(nativeValue: SKPaymentTransaction) {
        super(nativeValue);

        if (nativeValue.transactionDate) {
            this.date = nativeValue.transactionDate;
        }

        switch (nativeValue.transactionState) {
            case SKPaymentTransactionState.Deferred:
                this.state = TransactionState.deferred;
                break;

            case SKPaymentTransactionState.Failed:
                this.state = TransactionState.failed;
                this.error = this.convertNativeError(nativeValue.error);
                break;

            case SKPaymentTransactionState.Purchased:
                this.state = TransactionState.purchased;
                break;

            case SKPaymentTransactionState.Purchasing:
                this.state = TransactionState.purchasing;
                break;

            case SKPaymentTransactionState.Restored:
                this.state = TransactionState.restored;
                this.date = nativeValue.originalTransaction.transactionDate;
                break;
        }

        if (nativeValue.payment) {
            this.productId = nativeValue.payment.productIdentifier;
        }

        this.id = nativeValue.transactionIdentifier;
    }

    private convertNativeError(nativeError: NSError) {
        let error = new PurchaseError(
            PurchaseErrorCode.unknown,
            "Unknow error"
        );

        switch (nativeError.code) {
            case SKErrorCode.PaymentCancelled:
                error = new PurchaseError(
                    PurchaseErrorCode.canceled,
                    nativeError.description
                );
                break;
            case SKErrorCode.StoreProductNotAvailable:
                error = new PurchaseError(
                    PurchaseErrorCode.itemUnavailable,
                    nativeError.description
                );
                break;
        }

        return error;
    }
}