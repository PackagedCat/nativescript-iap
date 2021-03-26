import { EventData, Observable } from "@nativescript/core";
import { Transaction } from "../transaction/transaction";
import { Product } from "../product/product";

export interface PurchaseEventData extends EventData {
    transactions: Transaction[];
}

export abstract class InAppPurchaseBase extends Observable {
    public static purchaseUpdatedEvent = "purchaseUpdated";

    public abstract nativeObject: any;

    public abstract finishTransaction(transaction: Transaction): Promise<void>;
    public abstract getProducts(productIds: string[]): Promise<Product[]>;
    public abstract purchase(product: Product): Promise<void>;
    public abstract restorePurchases(): Promise<void>;
    public abstract showPriceConsent(product?: Product): Promise<void>;
}