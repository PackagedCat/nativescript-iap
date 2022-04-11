import { TransactionBase, TransactionState } from "./transaction.common";

export * from "./transaction.common";

export class Transaction extends TransactionBase<com.android.billingclient.api.Purchase | com.android.billingclient.api.PurchaseHistoryRecord> {
    constructor(nativeObject: com.android.billingclient.api.Purchase | com.android.billingclient.api.PurchaseHistoryRecord) {
        super(nativeObject);

        this.date = new Date(nativeObject.getPurchaseTime());
        this.id = nativeObject.getPurchaseToken();

        if (nativeObject instanceof com.android.billingclient.api.PurchaseHistoryRecord) {
            this.state = TransactionState.restored;
        } else {
            switch (nativeObject.getPurchaseState()) {
                case com.android.billingclient.api.Purchase.PurchaseState.PURCHASED:
                    this.state = TransactionState.purchased;
                    break;
                case com.android.billingclient.api.Purchase.PurchaseState.PENDING:
                    this.state = TransactionState.purchasing;
                    break;
            }
        }

        this.productId = this.nativeObject.getSkus().get(0);
        this.quantity = nativeObject.getQuantity();
    }
}
