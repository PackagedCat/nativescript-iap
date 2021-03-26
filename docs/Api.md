# API

## `InAppPurchase` - class

### Methods

**finishTransaction(transaction: `Transaction`)**: *Promise\<void\>*  
Notifies the store that the app finished processing the transaction.

All purchases require finish, regardless of whether it succeeded or failed Failure to complete a succeeded purchase will result in that purchase being refunded. 

**getProducts(productsIds: string[])**: *Promise\<Product[]\>*  
Retrieves localized information from the store about a specified list of products.

**purchase(product: `Product`)**: *void*  
Initiates the purchase for a product.

**restorePurchases()**: *Promise\<void\>*  
Restores previously completed purchases.

Use this method to restore completed transactions that is,
transactions for which you have already called completePuchase. 
Not restoring a non-renewing subscription or a consumable product.

**showPriceConsent(product?: `Product`)**: *Promise\<void\>*  
Shows the price consent sheet if the user has not yet responded to a subscription price increase.
Param `product` required only on Android.

### Events
**purchaseUpdated**  
Triggered a buy/restore transaction changes its state. You receive a `Transaction` object where you can check the status and other properties  *(see below)* of the transaction. 

## `Product` - class
### Properties

**nativeObject**  
The native value representing the product.  
On iOS - `SKProduct`  
On Android - `com.android.billingclient.api.SkuDetails`

**id**: *string*  
Gets product ID.

**iconUrl?**: *string*  
Android only: Gets the icon of the product if present.

**isDownloadable?**: *boolean*  
iOS only: Gets a value that indicates whether the App Store has downloadable content for this product.

**isFamilyShareable?**: *boolean*  
iOS only: Gets a value that indicates whether the product is available for family sharing in App Store Connect.

**title**: *string*  
Gets the localized title of the product.

**description**: *string*
Gets the localized description of the product.

**price**: *number*  
Gets the product price in the local currency.

**priceFormatted**: *string*  
Gets formatted price of the item, including its currency sign. The price does not include tax.

**priceCurrencyCode**: *string*  
Gets ISO 4217 currency code for price and original price.

**subscriptionGroupId?**: *string*  
iOS only: Gets subscription group ID.

**subscriptionPeriod?**: *string*  
Gets subscription period.

**type**: *`ProductType`*  
Gets the product type (in app or subscription).

## `ProductType` - enum
Represents the subscription period duration.  

**inApp**: *0*  
A type of in-app products.

**subs**: *1*  
A type of subscription products.

## `SubscriptionPeriod` - enum
Represents the subscription period duration.  

**day**: *0*  
iOS only: An interval lasting one day.

**month**: *1*  
An interval lasting one month.

**sixMonth**: *2*  
Android only: An interval lasting six month.

**threeMonth**: *3*  
Android only: An interval lasting three month.

**threeWeek**: *4*  
Android only: An interval lasting three week.

**week**: *5*  
An interval lasting one week.

**year**: *6*  
An interval lasting one year.

## `Transaction` - class
### Properties
**nativeObject**  
The native value representing the transaction.  
On iOS - `SKPaymentTransaction`  
On Android - `com.android.billingclient.api.Purchase` or `com.android.billingclient.api.PurchaseHistoryRecord` for restored transaction 

**state**: *`TransactionState`*  
Gets the current state of the transaction.

**productId**: *string*  
The in-app product identifier that triggerred this transaction. 

**id**: *string*  
Gets the unique order identifier for the transaction.  
*Note* On Android returns null if the transaction was restored.

**date**: *Date*  
Gets the date the product was purchased.  

## `TransactionState` - enum
Represents the states of transaction.

**purchasing**: *0*  
**purchased**: *1*  
**failed**: *2*  
**restored**: *3*  
**deferred**: *4*  
**refunded**: *5*  