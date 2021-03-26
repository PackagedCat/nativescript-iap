<template>
    <Page>
        <ActionBar title="Product list"/>
        <GridLayout>
            <ListView
                for="item in items"
                @itemTap="onItemTap">
                <v-template>
                    <StackLayout padding="20,10">
                        <Label
                            textWrap="true"
                            :text="item.title" />
                        <Label
                            class="footnote"
                            textWrap="true"
                            :text="item.description" />
                    </StackLayout>
                </v-template>
            </ListView>

            <GridLayout v-if="isLoading && items.length === 0">
                <StackLayout
                    horizontalAlignment="center"
                    verticalAlignment="center">
                    <ActivityIndicator
                        width="100"
                        height="100"
                        :busy="isLoading"/>
                    <Label
                        marginTop="10"
                        text="Loading products..."/>
                </StackLayout>
            </GridLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import inAppPurchase, { PurchaseEventData, TransactionState } from 'nativescript-iap';
export default {
    data() {
        return {
            items: [],
            isLoading: false
        }
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
        onItemTap(args) {
            inAppPurchase.purchase(args.item);
        },
        onPurchaseUpdated(data: PurchaseEventData) {
            for (const transaction of data.transactions) {
                if (transaction.state === TransactionState.purchased) {
                    // Delivering the content
                } else if (transaction.state === TransactionState.failed) {
                    console.error(transaction.error);
                }

                inAppPurchase.finishTransaction(transaction);
            }
        }
    }
}
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
