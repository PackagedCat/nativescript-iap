import { ProductBase, ProductType, SubscriptionPeriod } from "./product.common";

export * from "./product.common";

export class Product extends ProductBase {
    constructor(nativeObject: com.android.billingclient.api.SkuDetails) {
        super(nativeObject);
        
        this._id = nativeObject.getSku();
        this._iconUrl = nativeObject.getIconUrl();
        this._description = nativeObject.getDescription();
        this._title = nativeObject.getTitle();
        this._price = nativeObject.getPriceAmountMicros() / 1000000;
        this._priceFormatted = nativeObject.getPrice();
        this._priceCurrencyCode = nativeObject.getPriceCurrencyCode();
        
        switch (nativeObject.getSubscriptionPeriod()) {
            case "P1M":
                this._subscriptionPeriod = SubscriptionPeriod.month;
                break;
            case "P6M":
                this._subscriptionPeriod = SubscriptionPeriod.sixMonth;
                break;
            case "P3M":
                this._subscriptionPeriod = SubscriptionPeriod.threeMonth;
                break;
            case "P1W":
                this._subscriptionPeriod = SubscriptionPeriod.week;
                break;
            case "P3W":
                this._subscriptionPeriod = SubscriptionPeriod.threeWeek;
                break;
            case "P1Y":
                this._subscriptionPeriod = SubscriptionPeriod.year;
                break;
        }

        this._type = nativeObject.getType() === "inapp" ? ProductType.inApp : ProductType.subs;
    }
}