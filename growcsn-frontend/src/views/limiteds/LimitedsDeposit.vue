<template>
    <div class="limiteds-deposit">
        <transition name="fade" mode="out-in">
            <div v-if="cashierGetItems === null || cashierLimitedData.loading === true" class="deposit-loading" key="loading">
                <LoadingAnimation />
            </div>
            <div v-else-if="cashierGetItems.length > 0" class="deposit-list" key="data">
                <div class="data-list">

                    <CashierItemElement v-for="item in cashierGetItems" v-bind:key="item.uniqueId" v-bind:item="item" />
                    
                </div>
            </div>
            <div v-else class="deposit-empty" key="empty">No items found.</div>
        </transition>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import LoadingAnimation from '@/components/LoadingAnimation';
    import CashierItemElement from '@/components/cashier/CashierItemElement';

    export default {
        name: 'LimitedsDeposit',
        components: {
            LoadingAnimation,
            CashierItemElement
        },
        computed: {
            ...mapGetters([
                'authUser',
                'cashierFilterSearch',
                'cashierFilterAmountMin',
                'cashierFilterAmountMax',
                'cashierFilterSort', 
                'cashierLimitedData'
            ]),
            cashierGetItems() {
                let items = this.cashierLimitedData.deposit;

                if(items !== null) {
                    items = items.filter((element) => this.cashierLimitedData.withdraw.some((transaction) => transaction.items.some((item) => item.uniqueId === element.uniqueId) === true) === false);
                    items = items.filter((element) => element.name.toLowerCase().includes(this.cashierFilterSearch.toLowerCase().trim()) === true);

                    if(this.cashierFilterSort === 'Highest') {
                        items.sort((a, b) => { return b.amount - a.amount; });
                    } else {
                        items.sort((a, b) => { return a.amount - b.amount; });
                    }

                    if(this.cashierFilterAmountMin.trim() !== '' && isNaN(this.cashierFilterAmountMin) !== true) {
                        items = items.filter((element) => element.amount >= Math.floor(this.cashierFilterAmountMin * 1000));
                    }

                    if(this.cashierFilterAmountMax.trim() !== '' && isNaN(this.cashierFilterAmountMax) !== true) {
                        items = items.filter((element) => element.amount <= Math.floor(this.cashierFilterAmountMax * 1000));
                    }

                    items = items.slice(0, this.cashierLimitedData.page * 60);
                }

                return items;
            }
        }
    }
</script>

<style scoped>
    .limiteds-deposit {
        width: 100%;
    }

    .limiteds-deposit .deposit-loading {
        width: 100%;
        height: 600px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .limiteds-deposit .deposit-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .limiteds-deposit .deposit-loading.fade-leave-to {
        opacity: 0;
    }

    .limiteds-deposit .deposit-list {
        width: 100%;
    }

    .limiteds-deposit .deposit-empty {
        width: 100%;
        height: 600px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
    }

    .limiteds-deposit .deposit-list.fade-enter-active,
    .limiteds-deposit .deposit-empty.fade-enter-active {
        transition: opacity 0.5s;
    }

    .limiteds-deposit .deposit-list.fade-enter-from,
    .limiteds-deposit .deposit-empty.fade-enter-from {
        opacity: 0;
    }
</style>