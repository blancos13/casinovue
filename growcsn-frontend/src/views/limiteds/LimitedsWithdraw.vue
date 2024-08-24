<template>
    <div class="limiteds-withdraw">
        <transition name="fade" mode="out-in">
            <div v-if="cashierGetItems === null || cashierLimitedData.loading === true" class="withdraw-loading" key="loading">
                <LoadingAnimation />
            </div>
            <div v-else-if="cashierGetItems.length > 0" class="withdraw-list" key="data">
                <div class="data-list">

                    <CashierItemElement v-for="item in cashierGetItems" v-bind:key="item.uniqueId" v-bind:item="item" />
                    
                </div>
            </div>
            <div v-else class="withdraw-empty" key="empty">No items found.</div>
        </transition>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import LoadingAnimation from '@/components/LoadingAnimation';
    import CashierItemElement from '@/components/cashier/CashierItemElement';

    export default {
        name: 'LimitedsWithdraw',
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
                let items = this.cashierLimitedData.withdraw;

                if(items !== null) {
                    items = items.filter((element) => element.user !== this.authUser.user._id);
                    items = items.filter((item) => item.items.some((element) => element.name.toLowerCase().includes(this.cashierFilterSearch.toLowerCase().trim()) === true) === true);

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
    .limiteds-withdraw {
        width: 100%;
    }

    .limiteds-withdraw .withdraw-loading {
        width: 100%;
        height: 600px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .limiteds-withdraw .withdraw-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .limiteds-withdraw .withdraw-loading.fade-leave-to {
        opacity: 0;
    }

    .limiteds-withdraw .withdraw-list {
        width: 100%;
    }

    .limiteds-withdraw .withdraw-empty {
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

    .limiteds-withdraw .withdraw-list.fade-enter-active,
    .limiteds-withdraw .withdraw-empty.fade-enter-active {
        transition: opacity 0.5s;
    }

    .limiteds-withdraw .withdraw-list.fade-enter-from,
    .limiteds-withdraw .withdraw-empty.fade-enter-from {
        opacity: 0;
    }
</style>