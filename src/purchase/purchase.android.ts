import { Application, Utils } from "@nativescript/core";
import { InAppPurchaseBase, PurchaseEventData } from "./purchase.common";
import { Product } from "../product/product";
import { PurchaseError, PurchaseErrorCode, Transaction, TransactionState } from "../transaction/transaction";

export * from "./purchase.common";

const context = Utils.ad.getApplicationContext();

export class InAppPurchase extends InAppPurchaseBase {
    public nativeObject: com.android.billingclient.api.BillingClient;

    constructor() {
        super();

        const purchasesUpdatedListener = new com.android.billingclient.api.PurchasesUpdatedListener({
            onPurchasesUpdated: this.onPurchasesUpdated.bind(this)
        });

        this.nativeObject = com.android.billingclient.api.BillingClient.newBuilder(context)
            .enablePendingPurchases()
            .setListener(purchasesUpdatedListener)
            .build();
    }

    //#region Native methods

    private async onPurchasesUpdated(billingResult: com.android.billingclient.api.BillingResult, purchases: java.util.List<com.android.billingclient.api.Purchase>) {
        if (billingResult.getResponseCode() == com.android.billingclient.api.BillingClient.BillingResponseCode.OK && purchases != null) {
            const nativeTransactions = purchases.toArray();
            const transactions = new Array<Transaction>();
    
            for (let i = 0; i < nativeTransactions.length; i++) {
                const transaction = new Transaction(nativeTransactions[i]);
                switch (billingResult.getResponseCode()) {
                    case com.android.billingclient.api.BillingClient.BillingResponseCode.USER_CANCELED:
                        transaction.error = new PurchaseError(
                            PurchaseErrorCode.canceled,
                            billingResult.getDebugMessage() ?? "User canceled");
                        break;
                    case com.android.billingclient.api.BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED:
                        transaction.error = new PurchaseError(
                            PurchaseErrorCode.itemAlreadyOwned,
                            billingResult.getDebugMessage() ?? "Item already owned");
                        break;
                    case com.android.billingclient.api.BillingClient.BillingResponseCode.ITEM_UNAVAILABLE:
                        transaction.error = new PurchaseError(
                            PurchaseErrorCode.itemUnavailable,
                            billingResult.getDebugMessage() ?? "Item unavailable");
                        break;
                }
    
                transactions.push(transaction);
            }
    
            this.notify({
                eventName: InAppPurchase.purchaseUpdatedEvent,
                object: this,
                transactions: transactions
            } as PurchaseEventData);

        } else if (billingResult.getResponseCode() == com.android.billingclient.api.BillingClient.BillingResponseCode.USER_CANCELED) {
            // Handle an error caused by a user cancelling the purchase flow.
            this.notify({
                eventName: InAppPurchase.purchaseUpdatedEvent,
                object: this,
                transactions: [{
                    state: TransactionState.failed,
                    error: new PurchaseError(PurchaseErrorCode.canceled, billingResult.getDebugMessage())
                }]
            });
        } else {
            // Handle any other error codes.
        }
    }

    private async connectAsync() {
        return new Promise<boolean>((resolve, reject) => {
            if (this.nativeObject.isReady()) {
                return resolve(true);
            }

            this.nativeObject.startConnection(new com.android.billingclient.api.BillingClientStateListener({
                onBillingSetupFinished(billingResult) {
                    if (billingResult.getResponseCode() === com.android.billingclient.api.BillingClient.BillingResponseCode.OK) {
                        resolve(true);
                    } else {
                        reject(billingResult.getDebugMessage());
                    }
                },
                onBillingServiceDisconnected() {
                    //
                }
            }));
        });
    }

    private async getNativeProducts(productIds: string[], skuType: string) {
        return new Promise<androidNative.Array<com.android.billingclient.api.SkuDetails>>((resolve, reject) => {
            const params = com.android.billingclient.api.SkuDetailsParams.newBuilder()
                .setSkusList(java.util.Arrays.asList(productIds))
                .setType(skuType)
                .build();

            this.nativeObject.querySkuDetailsAsync(
                params,
                new com.android.billingclient.api.SkuDetailsResponseListener({
                    onSkuDetailsResponse(billingResult, skuDetailsList) {
                        if (billingResult.getResponseCode() === com.android.billingclient.api.BillingClient.BillingResponseCode.OK) {
                            const nativeProducts = skuDetailsList.toArray();                            
                            resolve(nativeProducts);
                        } else {
                            reject(billingResult.getDebugMessage());
                        }
                    }
                }));
        });
    }

    private getNativePurchaseHistory(skuType: string) {
        return new Promise<androidNative.Array<com.android.billingclient.api.SkuDetails>>((resolve, reject) => {
            this.nativeObject.queryPurchaseHistoryAsync(
                skuType,
                new com.android.billingclient.api.PurchaseHistoryResponseListener({
                    onPurchaseHistoryResponse(billingResult, purchaseHistoryRecordList) {
                        if (billingResult.getResponseCode() === com.android.billingclient.api.BillingClient.BillingResponseCode.OK) {
                            const nativeHistory = purchaseHistoryRecordList.toArray();                            
                            resolve(nativeHistory);
                        } else {
                            reject(billingResult.getDebugMessage());
                        }
                    }
                }));
        });
    }

    //#endregion

    public finishTransaction(transaction: Transaction): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (transaction.state === TransactionState.restored) {
                resolve();
                return;
            }

            const acknowledgePurchaseParams = com.android.billingclient.api.AcknowledgePurchaseParams.newBuilder()
                .setPurchaseToken(transaction.nativeObject.getPurchaseToken())
                .build();

            this.nativeObject.acknowledgePurchase(
                acknowledgePurchaseParams,
                new com.android.billingclient.api.AcknowledgePurchaseResponseListener({
                    onAcknowledgePurchaseResponse(billingResult) {
                        if (billingResult.getResponseCode() === com.android.billingclient.api.BillingClient.BillingResponseCode.OK) {
                            resolve();
                        } else {
                            reject({
                                code: billingResult.getResponseCode(),
                                error: billingResult.getDebugMessage()
                            });
                        }
                    }
                }));
        });
    }

    public consumePurchase(transaction: Transaction): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const consumeParams = com.android.billingclient.api.ConsumeParams.newBuilder()
                .setPurchaseToken(transaction.nativeObject.getPurchaseToken())
                .build();

            this.nativeObject.consumeAsync(
                consumeParams,
                new com.android.billingclient.api.ConsumeResponseListener({
                    onConsumeResponse(billingResult) {
                        if (billingResult.getResponseCode() === com.android.billingclient.api.BillingClient.BillingResponseCode.OK) {
                            resolve();
                        } else {
                            reject({ 
                                code: billingResult.getResponseCode(),
                                error: billingResult.getDebugMessage()
                            });
                        }
                    }
                }));
        });
    }

    public async getProducts(productsIds: string[]): Promise<Product[]> {
        await this.connectAsync();

        const products = new Array<Product>();

        let nativeProducts = await this.getNativeProducts(productsIds, com.android.billingclient.api.BillingClient.SkuType.INAPP);
        for (let i = 0; i < nativeProducts.length; i++) {
            products.push(new Product(nativeProducts[i]));
        }

        nativeProducts = await this.getNativeProducts(productsIds, com.android.billingclient.api.BillingClient.SkuType.SUBS);
        for (let i = 0; i < nativeProducts.length; i++) {
            products.push(new Product(nativeProducts[i]));
        }

        return products;
    }

    public async purchase(product: Product): Promise<void> {
        await this.connectAsync();

        const billingFlowParams = com.android.billingclient.api.BillingFlowParams.newBuilder()
            .setSkuDetails(product.nativeObject)
            .build();

        const activity = Application.android.foregroundActivity || Application.android.startActivity;
        this.nativeObject.launchBillingFlow(activity, billingFlowParams);
    }

    public async restorePurchases(): Promise<void> {
        await this.connectAsync();

        const transactions = new Array<Transaction>();

        let nativeTransactions = await this.getNativePurchaseHistory(com.android.billingclient.api.BillingClient.SkuType.INAPP);
        for (let i = 0; i < nativeTransactions.length; i++) {
            transactions.push(new Transaction(nativeTransactions[i]));
        }
        
        nativeTransactions = await this.getNativePurchaseHistory(com.android.billingclient.api.BillingClient.SkuType.SUBS);
        for (let i = 0; i < nativeTransactions.length; i++) {
            transactions.push(new Transaction(nativeTransactions[i]));
        }

        this.notify<PurchaseEventData>({
            eventName: InAppPurchase.purchaseUpdatedEvent,
            object: this,
            transactions: transactions
        });
    }

    public async showPriceConsent(product?: Product): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (product == null) {
                reject("The parameter \"product\" must not be null.");
                return;
            }

            const activity = Application.android.foregroundActivity || Application.android.startActivity;
            this.nativeObject.launchPriceChangeConfirmationFlow(
                activity,
                com.android.billingclient.api.PriceChangeFlowParams.newBuilder()
                    .setSkuDetails(product.nativeObject)
                    .build(),
                new com.android.billingclient.api.PriceChangeConfirmationListener({
                    onPriceChangeConfirmationResult(billingResult) {
                        if (billingResult.getResponseCode() === com.android.billingclient.api.BillingClient.BillingResponseCode.OK) {
                            resolve();
                        } else {
                            reject(billingResult.getDebugMessage());
                        }
                    }
                }));
        });
    }
}

export default new InAppPurchase();