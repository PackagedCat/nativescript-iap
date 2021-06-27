import { InAppPurchaseBase, PurchaseEventData } from "./purchase.common";
import { Product } from "../product/product";
import { PurchaseError, PurchaseErrorCode, Transaction, TransactionState } from "../transaction/transaction";

export * from "./purchase.common";

@NativeClass
class SKPaymentTransactionObserverImpl extends NSObject implements SKPaymentTransactionObserver {
    public static ObjCProtocols = [SKPaymentTransactionObserver];
    private _onwer: WeakRef<InAppPurchase>;

    private _completePromiseResolve: (value: void | PromiseLike<void>) => void;
    private _completePromiseReject: (reason?: any) => void;

    public static initWithOnwer(owner: InAppPurchase) {
        const observer = <SKPaymentTransactionObserverImpl>SKPaymentTransactionObserverImpl.new();
        observer._onwer = new WeakRef<InAppPurchase>(owner);
        return observer;
    }

    public setComplitePromise(resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void) {
        this._completePromiseResolve = resolve;
        this._completePromiseReject = reject;
    }

	public paymentQueueRestoreCompletedTransactionsFailedWithError(queue: SKPaymentQueue, error: NSError): void {
        if (this._completePromiseReject != null) {
            this._completePromiseReject(new PurchaseError(
                PurchaseErrorCode.unknown,
                error.description
            ));

            this._completePromiseResolve = null;
            this._completePromiseReject = null;
        }
    }

	public paymentQueueRestoreCompletedTransactionsFinished(queue: SKPaymentQueue): void {
        if (this._completePromiseResolve != null) {
            this._completePromiseResolve();

            this._completePromiseResolve = null;
            this._completePromiseReject = null;
        }
    }

    public paymentQueueUpdatedTransactions(queue: SKPaymentQueue, nativeTransactions: NSArray<SKPaymentTransaction>) {
        const onwer = this._onwer.get();
        if (onwer == null) {
            return;
        }

        const transactions = new Array<Transaction>();
        for (let i = 0; i < nativeTransactions.count; i++) {
            transactions.push(new Transaction(nativeTransactions[i]));
        }

        onwer.notify<PurchaseEventData>({
            eventName: InAppPurchase.purchaseUpdatedEvent,
            object: onwer,
            transactions: transactions
        });
    }
}

@NativeClass
class SKProductsRequestDelegateImpl extends NSObject implements SKProductsRequestDelegate {
    public static ObjCProtocols = [SKProductsRequestDelegate];
    private _resolve: (value: Product[] | PromiseLike<Product[]>) => void;

    public static initWithPromise(resolve: (value: Product[] | PromiseLike<Product[]>) => void) {
        const observer = <SKProductsRequestDelegateImpl>SKProductsRequestDelegateImpl.new();
        observer._resolve = resolve;
        return observer;
    }

    productsRequestDidReceiveResponse(request: SKProductsRequest, response: SKProductsResponse): void {
        const products = new Array<Product>();
        for (let i = 0; i < response.products.count; i++) {
            products.push(new Product(response.products[i]));
        }

        this._resolve(products);
    }
}

export class InAppPurchase extends InAppPurchaseBase {
    public nativeObject: SKPaymentQueue;
    
    private _transactionObserver: SKPaymentTransactionObserverImpl;
    private _isCanMakePayment = false;

    constructor() {
        super();

        this._transactionObserver = SKPaymentTransactionObserverImpl.initWithOnwer(this);
        this.nativeObject = SKPaymentQueue.defaultQueue();
        this.nativeObject.addTransactionObserver(this._transactionObserver);
    }

    private checkAuthorization() {
        if (this._isCanMakePayment) {
            return true;
        }

        if (SKPaymentQueue.canMakePayments()) {
            return this._isCanMakePayment = true;
        } else {
            throw new PurchaseError(
                PurchaseErrorCode.userNotAuthorized,
                "User not authorized"
            );
        }
    }

    /** Android only */
    public consumePurchase(transaction: Transaction): Promise<void> {
        return Promise.resolve();
    }

    public finishTransaction(transaction: Transaction): Promise<void> {
        return new Promise((resolve, reject) => {
            if (transaction.state === TransactionState.restored) {
                resolve();
                return;
            }
            
            this._transactionObserver.setComplitePromise(resolve, reject);
            this.nativeObject.finishTransaction(transaction.nativeObject);
        });
    }

    public getProducts(productsIds: string[]): Promise<Product[]> {
        return new Promise((resolve) => {
            this.checkAuthorization();

            const nativeProductIds = NSSet.setWithArray(productsIds);
            const productsRequest = SKProductsRequest.alloc().initWithProductIdentifiers(nativeProductIds);

            const productsRequestDelegate = SKProductsRequestDelegateImpl.initWithPromise(resolve);
            productsRequest.delegate = productsRequestDelegate;
            productsRequest.start();
        });
    }

    public restorePurchases(): Promise<void> {
        this.nativeObject.restoreCompletedTransactions();
        return Promise.resolve();
    }

    public purchase(product: Product): Promise<void> {
        this.checkAuthorization();

        const payment = SKPayment.paymentWithProduct(product.nativeObject);
        this.nativeObject.addPayment(payment);

        return Promise.resolve();
    }

    public showPriceConsent(product?: Product): Promise<void> {
        this.nativeObject.showPriceConsentIfNeeded();
        return Promise.resolve();
    }
}

export default new InAppPurchase();