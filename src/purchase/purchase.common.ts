import { EventData, Observable } from "@nativescript/core";
import { Transaction } from "../transaction/transaction";
import { Product } from "../product/product";

export enum PurchaseErrorCode {
    unknown = "unknown",
    canceled = "canceled",
    itemAlreadyOwned = "item_already_owned",
    itemUnavailable = "item_unavailable",
    userNotAuthorized = "user_not_authorized"
}

export class PurchaseError extends Error {
    public code: PurchaseErrorCode;
    public nativeError: any;

    constructor(code: PurchaseErrorCode, message: string, nativeError?: any) {
        super(message);
        this.code = code;
        this.nativeError = nativeError;
    }
}

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