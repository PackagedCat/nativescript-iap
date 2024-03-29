# `PurchaseErrorCode` - class

Represents the error codes for `PurchaseError`.

<table>

<tr>
<th></th>
<th></th>
</tr>

<!--  -->
<tr>

<td>

```typescript
unknown: "unknown"
```
</td>

<td>

Unknow error during the API action.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
canceled: "canceled"
```
</td>

<td>

User pressed back or canceled a dialog.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
productAlreadyOwned: "product_already_owned"
```
</td>

<td>

Failure to purchase since item is already owned.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
productUnavailable: "product_not_available"
```
</td>

<td>

Requested product is not available for purchase.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
userNotAuthorized: "user_not_authorized"
```
</td>

<td>

iOS only: The user is not allowed to authorize payments.
</td>

</tr>

</table>