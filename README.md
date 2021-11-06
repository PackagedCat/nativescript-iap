# In-app purchase plugin for NativeScript

## Installation
Run the following command from the root of your project:

```
ns plugin add nativescript-iap
```

## Configuration
In order for your in-app purchases to be recognized by the plugin, you must configure those on the Google/AppStore side.

## Usage

### Setup hook

Before starting purchase you need hook up to the `purchaseUpdated` event. This way you will receive information about the transaction state while it is executing and take necessary action when the transaction completes. You can set the hook once as global handler to process the all incoming purchases.

```typescript
import inAppPurchase, { PurchaseEventData } from "nativescript-iap";

inAppPurchase.on("purchaseUpdated", async (data: PurchaseEventData) => {
    for (const transaction of data.transactions) {
        if (transaction.state === TransactionState.purchased
            || transaction.state === TransactionState.restored) {
            // Deliver the content or unlock the purchased functionality
        } else if (transaction.state === TransactionState.failed) {
            // Notify user about it
            console.error(transaction.error);
        }

        // You must finish transaction otherwise the purchase being refunded
        await inAppPurchase.finishTransaction(transaction);
    }
});
```

### Getting the products

To get the actual products call `getProducts` with array of the products identifiers (in Google Play products ID calls SKU):

```typescript
import inAppPurchase from "nativescript-iap";

const products = await inAppPurchase.getProducts(["your.product.id", "your.product.id"]);
```

### Purchasing the product

```typescript
import inAppPurchase, { PurchaseError } from "nativescript-iap";

try {
    await inAppPurchase.purchase(product);
} catch (error) {
    if (error instanceof PurchaseError) {
        switch (error.code) {
            case PurchaseErrorCode.unknown:
                // ...
                break;
            case PurchaseErrorCode.canceled:
                // ...
                break;
            case PurchaseErrorCode.itemAlreadyOwned: // On Android only
                // ...
                break;
            case PurchaseErrorCode.itemUnavailable: // On Android only
                // ...
                break;
            case PurchaseErrorCode.userNotAuthorized: // On iOS only
                // ...
                break;
            default: //Unknow error
                // ...
                break;
        }
    }

    // Handle the error
}
```

### Restoring the purchased products

```typescript
import inAppPurchase from "nativescript-iap";
// All restored purchases will be handled by the "purchaseUpdated" hook.
await inAppPurchase.restorePurchases();
```

### (ANDROID ONLY) Consuming the purchased product

```typescript
import inAppPurchase from "nativescript-iap";

await inAppPurchase.consumePurchase(transaction);
```

### Showing the price consent dialog

```typescript
import inAppPurchase from "nativescript-iap";

// Gettings the product with updated price

const products = await inAppPurchase.getProducts(["product_id_with_updated_price"]);

await inAppPurchase.showPriceConsent(product[0]);
```

## API
[InAppPurchase](docs/InAppPurchase.md) - `class` Represents the class for making in-app purchase.

[Product](docs/Product.md) - `class` Represents information about a product.

[ProductType](docs/ProductType.md) - `enum` Represents the product type.

[PurchaseError](docs/PurchaseError.md) - `class` Represents the error class wich can throws in `purchase` method.  

[PurchaseErrorCode](docs/PurchaseErrorCode.md) - `enum` Represents the error codes for `PurchaseError`.

[PurchaseEventData](docs/PurchaseEventData.md) - `interface` Represents the data of the `purchaseUpdated` event.  

[SubscriptionPeriod](docs/SubscriptionPeriod.md) - `enum` Represents the subscription period duration.

[Transaction](docs/Transaction.md) - `class` Represents an in-app purchase transaction.

[TransactionState](docs/TransactionState.md) - `enum` Represents the states of the transaction.