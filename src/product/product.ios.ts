import { ProductBase, ProductType, SubscriptionPeriod } from "./product.common";

export * from "./product.common";

export class Product extends ProductBase {
    constructor(nativeObject: SKProduct) {
        super(nativeObject);

        this.id = nativeObject.productIdentifier;
        this.isDownloadable = nativeObject.isDownloadable;
        this.isFamilyShareable = nativeObject.isFamilyShareable;
        this.description = nativeObject.localizedDescription;
        this.title = nativeObject.localizedTitle;
        this.price = nativeObject.price.doubleValue;

        const formatter = NSNumberFormatter.alloc().init();
        formatter.numberStyle = NSNumberFormatterStyle.CurrencyStyle;
        formatter.locale = nativeObject.priceLocale;
        this.priceFormatted = formatter.stringFromNumber(nativeObject.price as any);

        this.priceCurrencyCode = nativeObject.priceLocale.objectForKey(NSLocaleCurrencyCode);
        this.subscriptionGroupId = nativeObject.subscriptionGroupIdentifier;

        if (nativeObject.subscriptionPeriod != null) {
            switch (nativeObject.subscriptionPeriod.unit) {
                case SKProductPeriodUnit.Day:
                    this.subscriptionPeriod = SubscriptionPeriod.day;
                    break;
                case SKProductPeriodUnit.Month:
                    this.subscriptionPeriod = SubscriptionPeriod.month;
                    break;
                case SKProductPeriodUnit.Week:
                    this.subscriptionPeriod = SubscriptionPeriod.week;
                    break;
                case SKProductPeriodUnit.Year:
                    this.subscriptionPeriod = SubscriptionPeriod.year;
                    break;
            }
            this.type = ProductType.subs;
        } else {
            this.type = ProductType.inApp;
        }
    }
}
