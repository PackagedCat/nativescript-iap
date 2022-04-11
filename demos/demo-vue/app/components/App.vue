<template>
    <page>
        <action-bar title="Product list" />
        <grid-layout
            rows="*,auto"
        >
            <list-view
                for="item in items"
                @itemTap="onItemTap"
            >
                <v-template>
                    <stack-layout padding="20,10">
                        <label
                            textWrap="true"
                            :text="item.title"
                        />
                        <label
                            class="footnote"
                            textWrap="true"
                            :text="item.id"
                        />
                        <label
                            class="footnote"
                            textWrap="true"
                            :text="item.description"
                        />
                    </stack-layout>
                </v-template>
            </list-view>

            <stack-layout
                row="1"
            >
                <button
                    text="Restore purchases"
                    @tap="onRestorePurchasesTap"
                />
            </stack-layout>

            <grid-layout
                v-if="isLoading"
                rowSpan="2"
                backgroundColor="#00000030"
            >
                <stack-layout
                    horizontalAlignment="center"
                    verticalAlignment="center"
                >
                    <activity-indicator
                        width="100"
                        height="100"
                        :busy="isLoading"
                    />
                    <label
                        marginTop="10"
                        horizontalAlignment="center"
                        text="Loading..."
                    />
                </stack-layout>
            </grid-layout>
        </grid-layout>
    </page>
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
                this.items = await inAppPurchase.getProducts(["subscription.year.autorenew"]);
            } catch (error) {
                console.error(error);
            }

            this.isLoading = false;
        },
        async onItemTap(args: any) {
            if (this.isLoading) {
                return;
            }

            this.isLoading = true;

            try {
                await inAppPurchase.purchase(args.item);
            } catch (error) {
                if (error instanceof PurchaseError) {
                    switch (error.code) {
                        case PurchaseErrorCode.canceled:
                            // ...
                            break;
                        case PurchaseErrorCode.productAlreadyOwned:
                            // ...
                            break;
                        case PurchaseErrorCode.productNotAvailable:
                            // ...
                            break;
                        case PurchaseErrorCode.userNotAuthorized: // On iOS only
                            // ...
                            break;
                        default: // Unknow error
                            // ...
                            break;
                    }

                    alert(error.message);
                } else {
                    console.error("purchase", error);
                }
            }

            this.isLoading = false;
        },
        onPurchaseUpdated(data: PurchaseEventData) {
            for (const transaction of data.transactions) {
                switch (transaction.state) {
                    case TransactionState.purchasing:
                        // ...
                        break;
                    case TransactionState.purchased:
                    case TransactionState.restored:
                        // Delivering the content
                        break;
                    case TransactionState.deferred:
                        // ...
                        break;
                    case TransactionState.refunded:
                        // ...
                        break;
                }

                inAppPurchase.finishTransaction(transaction);
            }
        },
        async onRestorePurchasesTap() {
            if (this.isLoading) {
                return;
            }

            this.isLoading = true;

            try {
                await inAppPurchase.restorePurchases();
            } catch (error) {
                console.error(error);
            }

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
