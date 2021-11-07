import { EventData, Observable } from "@nativescript/core";
import { Transaction } from "../transaction/transaction";
import { Product } from "../product/product";

export enum PurchaseErrorCode {
    unknown = "unknown",
    canceled = "canceled",
    productAlreadyOwned = "product_already_owned",
    productNotAvailable = "product_not_available",
    userNotAuthorized = "user_not_authorized"
}

export enum PurchaseErrorMessage {
    unknown = "Unknow error.",
    canceled = "Canceled by the user.",
    productAlreadyOwned = "The product not available.",
    productNotAvailable = "The product already onwed.",
    userNotAuthorized = "The user not authorized."
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