import { EventData, Observable } from "@nativescript/core";
import { Product } from "../product/product";
import { Transaction } from "../transaction/transaction";

/**
 * Represents the error codes for PurchaseError.
 */
export enum PurchaseErrorCode {
    /**
     * Unknow error during the API action.
     */
    unknown = "unknown",

    /**
     * User pressed back or canceled a dialog.
     */
    canceled = "canceled",

    /**
     * Failure to purchase since item is already owned.
     */
     productAlreadyOwned = "product_already_owned",

    /**
     * Requested product is not available for purchase.
     */
    productNotAvailable = "product_not_available",

    /**
     * iOS only: The user is not allowed to authorize payments.
     */
    userNotAuthorized = "user_not_authorized"
}

export class PurchaseError extends Error {
    public code: PurchaseErrorCode;
    public nativeError: any;

    constructor(code: PurchaseErrorCode, message: string, nativeError?: any);
}

export interface PurchaseEventData extends EventData {
    transactions: Transaction[];
}

export class InAppPurchase extends Observable {
    public nativeObject: any;

    /**
     * Consumes a given in-app product. Consuming can only be done on an item that's owned,
     * and as a result of consumption, the user will no longer own it.
     * @param transaction The transaction to consume.
     */
    public consumePurchase(transaction: Transaction): Promise<void>;

    /**
     * Notifies the store that the app finished processing the transaction.
     * @param transaction The transaction to finish.
     * 
     * @summary
     * All purchases require finish, regardless of whether it succeeded or failed.
     * Failure to complete a succeeded purchase will result in that purchase being refunded. 
     */
    public finishTransaction(transaction: Transaction): Promise<void>;

    /**
     * Retrieves localized information from the store about a specified list of products.
     * @param productIds Products identifiers
     */
    public getProducts(productsIds: string[]): Promise<Product[]>;

    /**
     * Initiates the purchase for a product.
     * @param product Purchased product.
     */
    public purchase(product: Product): Promise<void>;

    /**
     * Restores previously completed purchases.
     * 
     * @summary
     * Use this method to restore completed transactions that is,
     * transactions for which you have already called completePuchase. 
     * Not restoring a non-renewing subscription or a consumable product.
     */
    public restorePurchases(): Promise<void>;

    /**
     * Shows the price consent sheet if the user has not yet responded to a subscription price increase.
     * @param product Required only on Android: The product that has the pending price change.
     */
    public showPriceConsent(product?: Product): Promise<void>;

    public on(eventNames: string, callback: (data: EventData) => void, thisArg?: any);
    public on(eventName: "purchaseUpdated", callback: (data: PurchaseEventData) => void, thisArg?: any);
}

declare const inAppPurchase: InAppPurchase;
export default inAppPurchase;