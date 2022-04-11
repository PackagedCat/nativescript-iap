import { InAppPurchaseBase, ProductsRevokedEventData, PurchaseError, PurchaseErrorCode, PurchaseErrorMessage, PurchaseEventData } from "./purchase.common";
import { Product } from "../product/product";
import { Transaction } from "../transaction/transaction";

export * from "./purchase.common";

@NativeClass
class SKPaymentTransactionObserverImpl extends NSObject implements SKPaymentTransactionObserver {
    public static ObjCProtocols = [SKPaymentTransactionObserver];

    private _owner!: WeakRef<InAppPurchase>;

    public static initWithOnwer(owner: InAppPurchase) {
        const observer = <SKPaymentTransactionObserverImpl>SKPaymentTransactionObserverImpl.new();
        observer._owner = new WeakRef<InAppPurchase>(owner);
        return observer;
    }

    public paymentQueueDidRevokeEntitlementsForProductIdentifiers(queue: SKPaymentQueue, productIdentifiers: string[]): void {
        const owner = this._owner.get();
        if (owner == null) {
            return;
        }

        owner.notify<ProductsRevokedEventData>({
            eventName: InAppPurchase.productsRevokedEvent,
            object: owner,
            productIds: productIdentifiers
        });
    }

    public paymentQueueRestoreCompletedTransactionsFailedWithError(queue: SKPaymentQueue, error: NSError): void {
        const owner = this._owner.get();
        if (owner == null) {
            return;
        }

        owner.rejectCurrentProcces(new PurchaseError(
            PurchaseErrorCode.unknown,
            error.description || PurchaseErrorMessage.unknown,
            error
        ));
    }

    public paymentQueueRestoreCompletedTransactionsFinished(): void {
        const owner = this._owner.get();
        if (owner == null) {
            return;
        }

        owner.resolveCurrentProcces();
    }

    public paymentQueueUpdatedTransactions(queue: SKPaymentQueue, nativeTransactions: NSArray<SKPaymentTransaction>) {
        const owner = this._owner.get();
        if (owner == null) {
            return;
        }

        const transactions = new Array<Transaction>();
        for (let i = 0; i < nativeTransactions.count; i++) {
            const nativeTransaction = nativeTransactions[i];
            if (nativeTransaction.transactionState === SKPaymentTransactionState.Failed) {
                switch (nativeTransaction.error.code) {
                    case SKErrorCode.PaymentCancelled:
                        owner.rejectCurrentProcces(new PurchaseError(
                            PurchaseErrorCode.canceled,
                            PurchaseErrorMessage.canceled,
                            nativeTransaction.error
                        ));
                        break;
                    case SKErrorCode.StoreProductNotAvailable:
                        owner.rejectCurrentProcces(new PurchaseError(
                            PurchaseErrorCode.productNotAvailable,
                            PurchaseErrorMessage.productNotAvailable,
                            nativeTransaction.error
                        ));
                        break;
                    case 3532: // Product already onwed
                        owner.rejectCurrentProcces(new PurchaseError(
                            PurchaseErrorCode.productAlreadyOwned,
                            PurchaseErrorMessage.productAlreadyOwned,
                            nativeTransaction.error
                        ));
                        break;
                    default:
                        owner.rejectCurrentProcces(new PurchaseError(
                            PurchaseErrorCode.unknown,
                            PurchaseErrorMessage.unknown,
                            nativeTransaction.error
                        ));
                        break;
                }

                queue.finishTransaction(nativeTransaction);
                return;
            } else {
                transactions.push(new Transaction(nativeTransaction));

                if (nativeTransaction.transactionState === SKPaymentTransactionState.Purchased) {
                    owner.resolveCurrentProcces();
                }
            }
        }

        owner.notify<PurchaseEventData>({
            eventName: InAppPurchase.purchaseUpdatedEvent,
            object: owner,
            transactions: transactions
        });
    }
}

@NativeClass
class SKProductsRequestDelegateImpl extends NSObject implements SKProductsRequestDelegate {
    public static ObjCProtocols = [SKProductsRequestDelegate];

    private _owner!: WeakRef<InAppPurchase>;

    public static initWithOnwer(owner: InAppPurchase) {
        const observer = <SKProductsRequestDelegateImpl>SKProductsRequestDelegateImpl.new();
        observer._owner = new WeakRef<InAppPurchase>(owner);
        return observer;
    }

    productsRequestDidReceiveResponse(request: SKProductsRequest, response: SKProductsResponse): void {
        const owner = this._owner.get();
        if (owner == null) {
            return;
        }

        const products = new Array<Product>();
        for (let i = 0; i < response.products.count; i++) {
            products.push(new Product(response.products[i]));
        }

        owner.resolveCurrentProcces(products);
    }
}

export class InAppPurchase extends InAppPurchaseBase {
    public nativeObject: SKPaymentQueue;

    private _transactionObserver: SKPaymentTransactionObserverImpl;
    private _isCanMakePayment = false;

    private _currentProccessPromiseResolve?: (value: any | PromiseLike<any>) => void;
    private _currentProccessPromiseReject?: (reason?: any) => void;

    constructor() {
        super();

        this._transactionObserver = SKPaymentTransactionObserverImpl.initWithOnwer(this);
        this.nativeObject = SKPaymentQueue.defaultQueue();
        this.nativeObject.addTransactionObserver(this._transactionObserver);
    }

    private setCurrentProccessPromise(resolve: (value: any | PromiseLike<any>) => void, reject: (reason?: any) => void) {
        if (this._currentProccessPromiseResolve != null) {
            reject("Another purchase proccess in progress");
            return;
        }

        this._currentProccessPromiseResolve = resolve;
        this._currentProccessPromiseReject = reject;
    }

    public resolveCurrentProcces(value?: any | PromiseLike<any>) {
        this._currentProccessPromiseResolve?.(value);

        this._currentProccessPromiseResolve = undefined;
        this._currentProccessPromiseReject = undefined;
    }

    public rejectCurrentProcces(value: any | PromiseLike<any>) {
        this._currentProccessPromiseReject?.(value);

        this._currentProccessPromiseResolve = undefined;
        this._currentProccessPromiseReject = undefined;
    }

    private checkAuthorization() {
        if (this._isCanMakePayment) {
            return true;
        }

        if (SKPaymentQueue.canMakePayments()) {
            this._isCanMakePayment = true;
        } else {
            throw new PurchaseError(
                PurchaseErrorCode.userNotAuthorized,
                PurchaseErrorMessage.userNotAuthorized
            );
        }
    }

    /** Android only */
    public consumePurchase(): Promise<void> {
        return Promise.resolve();
    }

    public finishTransaction(transaction: Transaction): Promise<void> {
        return new Promise((resolve, reject) => {
            this.setCurrentProccessPromise(resolve, reject);
            this.checkAuthorization();

            this.nativeObject.finishTransaction(transaction.nativeObject);
        });
    }

    public getProducts(productsIds: string[]): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            this.setCurrentProccessPromise(resolve, reject);
            this.checkAuthorization();

            const nativeProductIds = NSSet.setWithArray(productsIds);
            const productsRequest = SKProductsRequest.alloc().initWithProductIdentifiers(nativeProductIds);

            const productsRequestDelegate = SKProductsRequestDelegateImpl.initWithOnwer(this);
            productsRequest.delegate = productsRequestDelegate;
            productsRequest.start();
        });
    }

    public restorePurchases(): Promise<void> {
        this.checkAuthorization();

        this.nativeObject.restoreCompletedTransactions();
        return Promise.resolve();
    }

    public purchase(product: Product): Promise<void> {
        return new Promise((resolve, reject) => {
            this.setCurrentProccessPromise(resolve, reject);
            this.checkAuthorization();

            const payment = SKPayment.paymentWithProduct(product.nativeObject);
            this.nativeObject.addPayment(payment);
        });
    }

    public showPriceConsent(): Promise<void> {
        this.checkAuthorization();

        this.nativeObject.showPriceConsentIfNeeded();
        return Promise.resolve();
    }
}

export default new InAppPurchase();
