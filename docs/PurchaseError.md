# `PurchaseError` - class

Represents the error class wich can throws in `purchase` method.  

<table>

<tr>
<th></th>
<th></th>
</tr>

<!--  -->
<tr>

<td>

```typescript
code: PurchaseErrorCode
```
</td>

<td>

Gets the pruchase error code.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
message: string
```
</td>

<td>

Gets the pruchase error message.
</td>

</tr>

<!--  -->
<tr>

<td>

```typescript
nativeError: any
```
</td>

<td>

Gets the native pruchase error object.

On iOS: `SKError`

On Android - `com.android.billingclient.api.BillingResult`
</td>

</tr>

</table>