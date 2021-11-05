import { TransactionBase, TransactionState } from "./transaction.common";

export * from "./transaction.common";

export class Transaction extends TransactionBase<com.android.billingclient.api.Purchase | com.android.billingclient.api.PurchaseHistoryRecord> {
    constructor(nativeObject: com.android.billingclient.api.Purchase | com.android.billingclient.api.PurchaseHistoryRecord) {
        super(nativeObject);

        this._date = new Date(nativeObject.getPurchaseTime());
        this._id = nativeObject.getPurchaseToken();

        if (nativeObject instanceof com.android.billingclient.api.PurchaseHistoryRecord) {
            this._state = TransactionState.restored;
        } else {
            switch (nativeObject.getPurchaseState()) {
                case com.android.billingclient.api.Purchase.PurchaseState.PURCHASED:
                    this._state = TransactionState.purchased;
                    break;
                case com.android.billingclient.api.Purchase.PurchaseState.PENDING:
                    this._state = TransactionState.purchasing;
                    break;
                default:
                    this._state = TransactionState.failed;
                    break;
            }
        }
        
        this._productId = this.nativeObject.getSkus().get(0);
        this._quantity = nativeObject.getQuantity();
    }
} 