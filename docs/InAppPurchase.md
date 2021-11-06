# `InAppPurchase` - class

Represents the class for making in-app purchase.

## Methods

<br/>

### finishTransaction

```typescript
finishTransaction(transaction: Transaction): Promise<void>
```
  
Notifies the store that the app finished processing the transaction.

All purchases require finish, regardless of whether it succeeded or failed Failure to complete a succeeded purchase will result in that purchase being refunded. 

<br/>

### consumePurchase

```typescript
consumePurchase(transaction: Transaction): Promise<void>
```

Android only: Consumes the purchase represented by the given transaction.

Resolves if `getResponseCode() === BillingResponseCode.OK`
else it rejects with an Object: `{ code: Number, error: String }`.

<br/>

### getProducts

```typescript
getProducts(productsIds: string[]): Promise<Product[]>
```

Retrieves localized information from the store about a specified list of products.

<br/>

### purchase

```typescript
purchase(product: Product): void
```

Initiates the purchase for a product.

<br/>

### restorePurchases

```typescript
restorePurchases(): Promise<void>
```

Restores previously completed purchases.

Use this method to restore completed transactions that is,
transactions for which you have already called completePuchase. 
Not restoring a non-renewing subscription or a consumable product.

<br/>

### showPriceConsent

```typescript
showPriceConsent(product?: Product): Promise<void>
```

Shows the price consent sheet if the user has not yet responded to a subscription price increase.
Param Product required only on Android.

<br/>

## Events

<br/>

### purchaseUpdated

```typescript
on(eventName: "purchaseUpdated", callback: (data: PurchaseEventData) => void, thisArg?: any)
```

Triggered a buy/restore transaction changes its state. You receive a Transaction object where you can check the status and other properties of the transaction. 