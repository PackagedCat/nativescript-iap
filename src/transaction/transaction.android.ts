import { TransactionBase, TransactionState } from "./transaction.common";

export * from "./transaction.common";

export class Transaction extends TransactionBase {
    constructor(nativeValue: com.android.billingclient.api.Purchase | com.android.billingclient.api.PurchaseHistoryRecord) {
        super(nativeValue);
        
        this.date = new Date(nativeValue.getPurchaseTime());
        if (nativeValue instanceof com.android.billingclient.api.PurchaseHistoryRecord) {
            this.state = TransactionState.restored;
        } else {
            this.id = nativeValue.getOrderId();

            switch (nativeValue.getPurchaseState()) {
                case com.android.billingclient.api.Purchase.PurchaseState.UNSPECIFIED_STATE:
                    this.state = TransactionState.failed;
                    break;
    
                case com.android.billingclient.api.Purchase.PurchaseState.PURCHASED:
                    this.state = TransactionState.purchased;
                    break;
    
                case com.android.billingclient.api.Purchase.PurchaseState.PENDING:
                    this.state = TransactionState.purchasing;
                    break;
            }
        }

        this.productId = nativeValue.getSku();
    }
} 