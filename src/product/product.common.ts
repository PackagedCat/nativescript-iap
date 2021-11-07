export enum ProductType {
    inApp = "in_app",
    subs = "subscription"
}

export enum SubscriptionPeriod {
    day = "day",
    month = "month",
    sixMonth = "six-month",
    threeMonth = "three-month",
    threeWeek = "three-week",
    week = "week",
    year = "year"
}

export class ProductBase {
    public nativeObject: any;

    public id!: string;

    public iconUrl?: string;

    public isDownloadable?: boolean;

    public isFamilyShareable?: boolean;

    public title!: string;

    public description!: string;

    public price!: number;

    public priceFormatted!: string;

    public priceCurrencyCode!: string;

    public type!: ProductType;

    public subscriptionGroupId?: string;

    public subscriptionPeriod?: SubscriptionPeriod;
    
    constructor(nativeObject: any) {
        this.nativeObject = nativeObject;
    }
}