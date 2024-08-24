<template>
    <button v-on:click="cashierItemButton()" class="cashier-item-element" v-bind:class="{ 
        'element-active': 
            (cashierGetRouteName.includes('Deposit') === true && cashierLimitedData.selected.some((element) => element.uniqueId === item.uniqueId) === true) ||
            cashierLimitedData.selected.some((element) => element._id === item._id) === true,
        'element-bundle': cashierGetRouteName.includes('Withdraw') === true && this.item.items.length > 1
    }">
        <div class="element-inner">
            <div class="inner-name">{{ cashierGetName }}</div>
            <div class="inner-image">
                <div v-for="(image, index) in cashierGetImages" v-bind:key="index" class="image-element">
                    <img v-bind:src="image" />
                </div>
            </div>
            <div class="inner-amount">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="amount-value">
                    <span>{{cashierFormatValue(item.amount).split('.')[0]}}</span>.{{cashierFormatValue(item.amount).split('.')[1]}}
                </div>
            </div>
        </div>
    </button>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'CashierItemElement',
        props: [
            'item'
        ],
        methods: {
            ...mapActions([
                'modalsSetData', 
                'modalsSetShow',
                'cashierAddLimitedDataSelected',
                'cashierRemoveLimitedDataSelected'
            ]),
            cashierFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            cashierItemButton() {
                if(this.modalsShow === 'Gift') {
                    this.modalsSetShow(null);

                    setTimeout(() => { 
                        this.modalsSetData({ typeCashier: this.modalsData.typeCashier, limited: this.limited });
                        this.modalsSetShow('LimitedsItem'); 
                    }, 200);
                } else if(
                    (this.cashierGetRouteName.includes('Deposit') === true && this.cashierLimitedData.selected.some((element) => element.uniqueId === this.item.uniqueId) === true) ||
                    this.cashierLimitedData.selected.some((element) => element._id === this.item._id) === true
                ) {
                    this.cashierRemoveLimitedDataSelected(this.item); 
                } else if(this.cashierLimitedData.selected.length <= (this.cashierGetRouteName === 'LimitedsDeposit' ? 3 : 0)) {
                    this.cashierAddLimitedDataSelected(this.item);
                }
            }
        },
        computed: {
            ...mapGetters([
                'modalsShow',
                'modalsData',
                'cashierLimitedData'
            ]),
            cashierGetRouteName() {
                return this.$route.name;
            },
            cashierGetName() {
                let name = this.item.name;

                if(this.cashierGetRouteName.includes('Withdraw') === true) {
                    name = this.item.items.length > 1 ? (this.item.items.length + ' ITEM BUNDLE') : this.item.items[0].name;
                }

                return name;
            },
            cashierGetImages() {
                let images = [this.item.image];

                if(this.cashierGetRouteName.includes('Withdraw') === true) {
                    images = this.item.items.map((element) => element.image);
                }

                return images;
            }
        }
    }
</script>

<style scoped>
    button.cashier-item-element {
        width: calc(16.66% - 6.66px);
        height: 200px;
        position: relative;
        margin-top: 8px;
        margin-right: 8px;
        padding: 1px;
        z-index: 1;
    }

    button.cashier-item-element:nth-child(6n) {
        margin-right: 0;
    }

    .modal-limiteds-item button.cashier-item-element {
        width: 100%;
        margin-top: 0;
        margin-right: 0;
        cursor: default;
    }

    button.cashier-item-element::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 16px;
        background: rgba(22, 83, 95, 0.5);
        z-index: -1;
    }

    button.cashier-item-element:hover::before,
    button.cashier-item-element.element-active::before {
        background: linear-gradient(180deg, rgba(0, 255, 194, 0), #00ffc2 100%);
        border: none;
    }

    button.cashier-item-element:hover::after,
    button.cashier-item-element.element-active::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 16px;
        background: #063343;
        z-index: -1;
    }

    button.cashier-item-element .element-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 16px 10px;
        border-radius: 16px;
        background: linear-gradient(0deg, #031f34 0%, #031f34 100%), 
                    radial-gradient(80% 80% at 50% 50%, rgba(0, 255, 194, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
        box-shadow: 0px 4px 40px 0px rgba(0, 0, 0, 0.25) inset;
    }

    button.cashier-item-element .inner-image {
        width: 112px;
        height: 112px;
        display: flex;
        flex-wrap: wrap;
    }

    button.cashier-item-element.element-bundle .inner-image {
        justify-content: space-between;
        align-content: space-between;
    }

    button.cashier-item-element .image-element {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button.cashier-item-element.element-bundle .image-element {
        width: 54px;
        height: 54px;
        padding: 4px;
        border-radius: 8px;
        background: linear-gradient(0deg, #031f34 0%, #031f34 100%), 
                    radial-gradient(80% 80% at 50% 50%, rgba(0, 255, 194, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
        border: 1px solid rgba(22, 83, 95, 0.5);
        box-shadow: 0px 3px 30px 0px rgba(0, 0, 0, 0.25) inset;
    }

    button.cashier-item-element .image-element img {
        width: 100%;
    }

    button.cashier-item-element .inner-name {
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        color: #bbbfd0;
    }

    button.cashier-item-element .inner-amount {
        display: flex;
        align-items: center;
    }

    button.cashier-item-element .inner-amount img {
        width: 18px;
        height: 18px;
        margin-right: 7px;
    }

    button.cashier-item-element .amount-value {
        font-size: 11px;
        font-weight: 600;
        color: #c1c1c1;
    }

    button.cashier-item-element .amount-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 1250px) {

        button.cashier-item-element {
            width: calc(20% - 6.4px);
        }

        button.cashier-item-element:nth-child(6n) {
            margin-right: 8px;
        }

        button.cashier-item-element:nth-child(5n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 900px) {

        button.cashier-item-element {
            width: calc(25% - 6px);
        }

        button.cashier-item-element:nth-child(5n) {
            margin-right: 8px;
        }

        button.cashier-item-element:nth-child(4n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 650px) {

        button.cashier-item-element {
            width: calc(33.33% - 5.33px);
        }

        button.cashier-item-element:nth-child(4n) {
            margin-right: 8px;
        }

        button.cashier-item-element:nth-child(3n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 500px) {

        button.cashier-item-element {
            width: calc(50% - 4px);
        }

        button.cashier-item-element:nth-child(3n) {
            margin-right: 8px;
        }

        button.cashier-item-element:nth-child(2n) {
            margin-right: 0;
        }

    }
</style>