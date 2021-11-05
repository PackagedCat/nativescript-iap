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

    protected _id!: string;
    public get id() {
        return this._id;
    } 

    protected _iconUrl?: string;
    public get iconUrl() {
        return this._iconUrl;
    } 

    protected _isDownloadable?: boolean;
    public get isDownloadable() {
        return this._isDownloadable;
    } 

    protected _isFamilyShareable?: boolean;
    public get isFamilyShareable() {
        return this._isFamilyShareable;
    } 

    protected _title!: string;
    public get title() {
        return this._title;
    }

    protected _description!: string;
    public get description() {
        return this._description;
    }

    protected _price!: number;
    public get price() {
        return this._price;
    }

    protected _priceFormatted!: string;
    public get priceFormatted() {
        return this._priceFormatted;
    }

    protected _priceCurrencyCode!: string;
    public get priceCurrencyCode() {
        return this._priceCurrencyCode;
    }

    protected _type!: ProductType;
    public get type() {
        return this._type;
    }

    protected _subscriptionGroupId?: string;
    public get subscriptionGroupId() {
        return this._subscriptionGroupId;
    }

    protected _subscriptionPeriod?: SubscriptionPeriod;
    public get subscriptionPeriod() {
        return this._subscriptionPeriod;
    }
    
    constructor(nativeObject: any) {
        this.nativeObject = nativeObject;
    }
}