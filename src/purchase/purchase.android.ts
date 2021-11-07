import { Application, Utils } from "@nativescript/core";
import { InAppPurchaseBase, PurchaseError, PurchaseErrorCode, PurchaseErrorMessage, PurchaseEventData } from "./purchase.common";
import { Product } from "../product/product";
import { Transaction, TransactionState } from "../transaction/transaction";

export * from "./purchase.common";

const context = Utils.ad.getApplicationContext();

export class InAppPurchase extends InAppPurchaseBase {
    public nativeObject: com.android.billingclient.api.BillingClient;
    
    private _purchasePromiseResolve?: (value: void | PromiseLike<void>) => void;
    private _purchasePromiseReject?: (reason?: any) => void;

    constructor() {
        super();

        const purchasesUpdatedListener = new com.android.billingclient.api.PurchasesUpdatedListener({
            onPurchasesUpdated: this.onNativePurchasesUpdated.bind(this)
        });

        this.nativeObject = com.android.billingclient.api.BillingClient.newBuilder(context)
            .enablePendingPurchases()
            .setListener(purchasesUpdatedListener)
            .build();
    }

    //#region Native methods

    private async onNativePurchasesUpdated(billingResult: com.android.billingclient.api.BillingResult, purchases: java.util.List<com.android.billingclient.api.Purchase>) {
        switch (billingResult.getResponseCode()) {
            case com.android.billingclient.api.BillingClient.BillingResponseCode.OK:
                if (purchases != null) {
                    const nativeTransactions = purchases.toArray();
                    const transactions = new Array<Transaction>();
        
                    for (let i = 0; i < nativeTransactions.length; i++) {
                        const transaction = new Transaction(nativeTransactions[i]);
                        transactions.push(transaction);
                    }
        
                    this._purchasePromiseResolve?.();
        
                    this.notify({
                        eventName: InAppPurchase.purchaseUpdatedEvent,
                        object: this,
                        transactions: transactions
                    } as PurchaseEventData);
                }
                break;
            case com.android.billingclient.api.BillingClient.BillingResponseCode.USER_CANCELED:
                this._purchasePromiseReject?.(new PurchaseError(
                    PurchaseErrorCode.canceled,
                    PurchaseErrorMessage.canceled,
                    billingResult
                ));
                break;
            case com.android.billingclient.api.BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED:
                this._purchasePromiseReject?.(new PurchaseError(
                    PurchaseErrorCode.productAlreadyOwned,
                    PurchaseErrorMessage.productAlreadyOwned,
                    billingResult
                ));
                break;
            case com.android.billingclient.api.BillingClient.BillingResponseCode.ITEM_UNAVAILABLE:
                this._purchasePromiseReject?.(new PurchaseError(
                    PurchaseErrorCode.productUnavailable,
                    PurchaseErrorMessage.productUnavailable,
                    billingResult
                ));
                break;
            case com.android.billingclient.api.BillingClient.BillingResponseCode.SERVICE_DISCONNECTED:
            case com.android.billingclient.api.BillingClient.BillingResponseCode.SERVICE_UNAVAILABLE:
            case com.android.billingclient.api.BillingClient.BillingResponseCode.BILLING_UNAVAILABLE:
            case com.android.billingclient.api.BillingClient.BillingResponseCode.DEVELOPER_ERROR:
            case com.android.billingclient.api.BillingClient.BillingResponseCode.ERROR:
                this._purchasePromiseReject?.(new PurchaseError(
                    PurchaseErrorCode.unknown,
                    billingResult.getDebugMessage() || PurchaseErrorMessage.unknown,
                    billingResult
                ));
                break;
        }

        this._purchasePromiseResolve = undefined;
        this._purchasePromiseReject = undefined;
    }

    private connectAsync() {
        return new Promise<void>((resolve, reject) => {
            if (this.nativeObject.isReady()) {
                return resolve();
            }

            this.nativeObject.startConnection(new com.android.billingclient.api.BillingClientStateListener({
                onBillingSetupFinished(billingResult) {
                    if (billingResult.getResponseCode() === com.android.billingclient.api.BillingClient.BillingResponseCode.OK) {
                        resolve();
                    } else {
                        reject(new PurchaseError(
                            PurchaseErrorCode.unknown,
                            billingResult.getDebugMessage() || PurchaseErrorMessage.unknown,
                            billingResult
                        ));
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
                            reject(new PurchaseError(
                                PurchaseErrorCode.unknown,
                                billingResult.getDebugMessage() || PurchaseErrorMessage.unknown,
                                billingResult
                            ));
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
                            reject(new PurchaseError(
                                PurchaseErrorCode.unknown,
                                billingResult.getDebugMessage() || PurchaseErrorMessage.unknown,
                                billingResult
                            ));
                        }
                    }
                }));
        });
    }

    //#endregion

    public finishTransaction(transaction: Transaction): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.connectAsync()
                .then(resolve)
                .catch(reject);

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
                            reject(new PurchaseError(
                                PurchaseErrorCode.unknown,
                                billingResult.getDebugMessage() || PurchaseErrorMessage.unknown,
                                billingResult
                            ));
                        }
                    }
                }));
        });
    }

    public consumePurchase(transaction: Transaction): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.connectAsync()
                .then(resolve)
                .catch(reject);

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
                            reject(new PurchaseError(
                                PurchaseErrorCode.unknown,
                                billingResult.getDebugMessage() || PurchaseErrorMessage.unknown,
                                billingResult
                            ));
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

    public purchase(product: Product): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.connectAsync()
                .then(resolve)
                .catch(reject);

            this._purchasePromiseResolve = resolve;
            this._purchasePromiseReject = reject;

            const billingFlowParams = com.android.billingclient.api.BillingFlowParams.newBuilder()
                .setSkuDetails(product.nativeObject)
                .build();
    
            const activity = Application.android.foregroundActivity || Application.android.startActivity;
            this.nativeObject.launchBillingFlow(activity, billingFlowParams);
        });
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

    public showPriceConsent(product?: Product): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.connectAsync()
                .then(resolve)
                .catch(reject);
    
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
                            reject(new PurchaseError(
                                PurchaseErrorCode.unknown,
                                billingResult.getDebugMessage() || PurchaseErrorMessage.unknown,
                                billingResult
                            ));
                        }
                    }
                }));
        });
    }
}

export default new InAppPurchase();