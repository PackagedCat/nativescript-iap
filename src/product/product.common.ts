export enum ProductType {
    inApp = 0,
    subs = 1
}

export enum SubscriptionPeriod {
    day = 0,
    month = 1,
    sixMonth = 2,
    threeMonth = 3,
    threeWeek = 4,
    week = 5,
    year = 6
}

export class ProductBase {
    public nativeObject: any;

    public id: string;
    public iconUrl?: string;
    public isDownloadable?: boolean;
    public isFamilyShareable?: boolean;
    public title: string;
    public description: string;
    public price: number;
    public priceFormatted: string;
    public priceCurrencyCode: string;
    public type: ProductType;
    public subscriptionGroupId?: string;
    public subscriptionPeriod?: SubscriptionPeriod;
    
    constructor(nativeObject: any) {
        this.nativeObject = nativeObject;
    }
}