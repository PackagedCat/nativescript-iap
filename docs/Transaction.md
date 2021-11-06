# `Transaction` - class

Represents an in-app purchase transaction.

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

The native value representing the transaction.  
On iOS - `SKPaymentTransaction`  
On Android - `com.android.billingclient.api.Purchase` or `com.android.billingclient.api.PurchaseHistoryRecord` for restored transaction 
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
state: TransactionState
```
</td>

<td>

Gets the current state of the transaction.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
productId: string
```
</td>

<td>

The in-app product identifier that triggerred this transaction. 
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

Gets the unique order identifier for the transaction.  
*Note* On Android returns null if the transaction was restored.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
date: Date
```
</td>

<td>

Gets the date the product was purchased.  
</td>

</tr>

</table>