# `Product` - class

Represents information about a product.

## Properties

<table>

<tr>
<th></th>
<th></th>
</tr>

<!--  -->
<tr>

<td>

```typescript
nativeObject: any
```
</td>

<td>

The native value representing the product.  
On iOS - `SKProduct`  
On Android - `com.android.billingclient.api.SkuDetails`
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
id: string
```
</td>

<td>

Gets product ID.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
iconUrl?: string
```
</td>

<td>

Android only: Gets the icon of the product if present.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
isDownloadable?: boolean
```
</td>

<td>

iOS only: Gets a value that indicates whether the App Store has downloadable content for this product.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
isFamilyShareable?: boolean
```
</td>

<td>

iOS only: Gets a value that indicates whether the product is available for family sharing in App Store Connect.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
title: string
```
</td>

<td>

Gets the localized title of the product.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
description: string
```
</td>

<td>

Gets the localized description of the product.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
price: number
```
</td>

<td>

Gets the product price in the local currency.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
priceFormatted: string
```
</td>

<td>

Gets formatted price of the item, including its currency sign. The price does not include tax.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
priceCurrencyCode: string
```
</td>

<td>

Gets ISO 4217 currency code for price and original price.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
subscriptionGroupId?: string
```
</td>

<td>

iOS only: Gets subscription group ID.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
subscriptionPeriod?: string
```
</td>

<td>

Gets subscription period.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
type: ProductType
```
</td>

<td>

Gets the product type (in app or subscription).
</td>

</tr>

</table>