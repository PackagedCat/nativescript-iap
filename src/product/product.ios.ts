import { ProductBase, ProductType, SubscriptionPeriod } from "./product.common";

export * from "./product.common";

export class Product extends ProductBase {
    constructor(nativeObject: SKProduct) {
        super(nativeObject);

        this._id = nativeObject.productIdentifier;
        this._isDownloadable = nativeObject.isDownloadable;
        this._isFamilyShareable = nativeObject.isFamilyShareable;
        this._description = nativeObject.localizedDescription;
        this._title = nativeObject.localizedTitle;
        this._price = nativeObject.price.doubleValue;

        const formatter = NSNumberFormatter.alloc().init();
        formatter.numberStyle = NSNumberFormatterStyle.CurrencyStyle;
        formatter.locale = nativeObject.priceLocale;
        this._priceFormatted = formatter.stringFromNumber(nativeObject.price as any);

        this._priceCurrencyCode = nativeObject.priceLocale.objectForKey(NSLocaleCurrencyCode);
        this._subscriptionGroupId = nativeObject.subscriptionGroupIdentifier;

        if (nativeObject.subscriptionPeriod != null) {
            switch (nativeObject.subscriptionPeriod.unit) {
                case SKProductPeriodUnit.Day:
                    this._subscriptionPeriod = SubscriptionPeriod.day;
                    break;
                case SKProductPeriodUnit.Month:
                    this._subscriptionPeriod = SubscriptionPeriod.month;
                    break;
                case SKProductPeriodUnit.Week:
                    this._subscriptionPeriod = SubscriptionPeriod.week;
                    break;
                case SKProductPeriodUnit.Year:
                    this._subscriptionPeriod = SubscriptionPeriod.year;
                    break;
            }
            this._type = ProductType.subs;
        }
        else {
            this._type = ProductType.inApp;
        }
    }
}