<template>
    <Page>
        <ActionBar title="Product list" />
        <GridLayout
            rows="*,auto"
        >
            <ListView
                for="item in items"
                @itemTap="onItemTap"
            >
                <v-template>
                    <StackLayout padding="20,10">
                        <Label
                            textWrap="true"
                            :text="item.title"
                        />
                        <Label
                            class="footnote"
                            textWrap="true"
                            :text="item.description"
                        />
                    </StackLayout>
                </v-template>
            </ListView>

            <StackLayout
                row="1"
            >
                <button
                    text="Restore purchases"
                    @tap="onRestorePurchasesTap"
                />
            </StackLayout>

            <GridLayout
                v-if="isLoading && items.length === 0"
                rowSpan="2"
            >
                <StackLayout
                    horizontalAlignment="center"
                    verticalAlignment="center"
                >
                    <ActivityIndicator
                        width="100"
                        height="100"
                        :busy="isLoading"
                    />
                    <Label
                        marginTop="10"
                        text="Loading products..."
                    />
                </StackLayout>
            </GridLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import Vue from "vue";
import inAppPurchase, { PurchaseEventData, Product, PurchaseError, TransactionState, PurchaseErrorCode } from "nativescript-iap";

export default Vue.extend({
    data() {
        return {
            items: new Array<Product>(),
            isLoading: false
        };
    },
    mounted() {
        this.refresh();
        inAppPurchase.on("purchaseUpdated", this.onPurchaseUpdated);
    },
    methods: {
        async refresh() {
            if (this.isLoading) {
                return;
            }

            this.isLoading = true;
            try {
                this.items = await inAppPurchase.getProducts(["product_1", "product_2"]);
            } catch (error) {
                console.error(error);
            }
            this.isLoading = false;
        },
        async onItemTap(args: any) {
            try {
                await inAppPurchase.purchase(args.item);
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

                    alert(error.message);
                } else {
                    console.error(error);
                }
            }
        },
        onPurchaseUpdated(data: PurchaseEventData) {
            for (const transaction of data.transactions) {
                if (transaction.state === TransactionState.purchased) {
                    // Delivering the content
                } else if (transaction.state === TransactionState.failed) {
                    console.error(transaction);
                }

                inAppPurchase.finishTransaction(transaction);
            }
        },
        async onRestorePurchasesTap() {
            if (this.isLoading) {
                return;
            }

            this.isLoading = true;

            await inAppPurchase.restorePurchases();

            this.isLoading = false;
        }
    }
});
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }
</style>
