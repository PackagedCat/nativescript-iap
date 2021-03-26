/**
 * Represents the product types.
 */
export enum ProductType {
    /**
     * A type of in-app products.
     */
    inApp = 0,

    /**
     * A type of subscription products.
     */
    subs = 1
}

/**
 * Represents the subscription period duration.
 */
export enum SubscriptionPeriod {
    /**
     * iOS only: An interval lasting one day.
     */
    day = 0,

    /**
     * An interval lasting one month.
     */
    month = 1,

    /**
     * Android only: An interval lasting six month.
     */
    sixMonth = 2,

    /**
     * Android only: An interval lasting three month.
     */
    threeMonth = 3,

    /**
     * Android only: An interval lasting three week.
     */
    threeWeek = 4,

    /**
     * An interval lasting one week.
     */
    week = 5,

    /**
     * An interval lasting one year.
     */
    year = 6
}

export class Product {
    public nativeObject: any;

    /**
     * Gets product ID.
     */
    public id: string;

    /**
     * Android only: Gets the icon of the product if present.
     */
    public iconUrl?: string;
    
    /**
     * iOS only: Gets a value that indicates
     * whether the App Store has downloadable content for this product.
     */
    public isDownloadable?: boolean;

    /**
     * iOS only: Gets a value that indicates whether
     * the product is available for family sharing in App Store Connect.
     */
    public isFamilyShareable?: boolean;

    /**
     * Gets the localized title of the product.
     */
    public title: string;

    /**
     * Gets the localized description of the product.
     */
    public description: string;

    /**
     * Gets the product price in the local currency.
     */
    public price: number;

    /**
     * Gets formatted price of the item, including its currency sign. The price does not include tax.
     */
    public priceFormatted: string;

    /**
     * Gets ISO 4217 currency code for price and original price.
     */
    public priceCurrencyCode: string;

    /**
     * iOS only: Gets subscription group ID.
     */
    public subscriptionGroupId?: string;

    /**
     * Gets subscription period.
     */
    public subscriptionPeriod?: string;

    /**
     * Gets the product type (in app or subscription).
     */
    public type: ProductType;
    
    constructor(nativeValue: any);
}