import { ProductBase, ProductType, SubscriptionPeriod } from "./product.common";

export * from "./product.common";

export class Product extends ProductBase {
    constructor(nativeObject: com.android.billingclient.api.SkuDetails) {
        super(nativeObject);

        this.id = nativeObject.getSku();
        this.iconUrl = nativeObject.getIconUrl();
        this.description = nativeObject.getDescription();
        this.title = nativeObject.getTitle();
        this.price = nativeObject.getPriceAmountMicros() / 1000000;
        this.priceFormatted = nativeObject.getPrice();
        this.priceCurrencyCode = nativeObject.getPriceCurrencyCode();

        switch (nativeObject.getSubscriptionPeriod()) {
            case "P1M":
                this.subscriptionPeriod = SubscriptionPeriod.month;
                break;
            case "P6M":
                this.subscriptionPeriod = SubscriptionPeriod.sixMonth;
                break;
            case "P3M":
                this.subscriptionPeriod = SubscriptionPeriod.threeMonth;
                break;
            case "P1W":
                this.subscriptionPeriod = SubscriptionPeriod.week;
                break;
            case "P3W":
                this.subscriptionPeriod = SubscriptionPeriod.threeWeek;
                break;
            case "P1Y":
                this.subscriptionPeriod = SubscriptionPeriod.year;
                break;
        }

        this.type = nativeObject.getType() === "inapp" ? ProductType.inApp : ProductType.subs;
    }
}
