<template>
    <div class="cashier-selected-element" v-bind:class="{
        'element-bundle': cashierGetRouteName.includes('Withdraw') === true && this.selected.items.length > 1
    }">
        <div class="element-info">
            <div class="info-name">{{ cashierGetName }}</div>
            <div class="info-amount">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="amount-value">
                    <span>{{cashierFormatValue(selected.amount).split('.')[0]}}</span>.{{cashierFormatValue(selected.amount).split('.')[1]}}
                </div>
            </div>
        </div>
        <div class="element-image">
            <div v-for="(image, index) in cashierGetImages" v-bind:key="index" class="image-element">
                <img v-bind:src="image" />
            </div>
        </div>
        <button v-on:click="cashierRemoveLimitedDataSelected(selected)" class="button-remove">
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1.33333H7.01811L6.80144 0.6836C6.66504 0.274733 6.28384 0 5.85287 0H4.14713C3.71613 0 3.33496 0.274733 3.19824 0.6836L2.98182 1.33333H1C0.448578 1.33333 0 1.78191 0 2.33333V3C0 3.37129 0.334244 3.33333 0.692956 3.33333C3.77193 3.33333 6.56351 3.33333 9.66667 3.33333C9.85091 3.33333 10 3.18424 10 3V2.33333C10 1.78191 9.55142 1.33333 9 1.33333ZM3.68473 1.33333L3.83073 0.894533C3.87631 0.758133 4.00358 0.666667 4.14713 0.666667H5.85287C5.99642 0.666667 6.12371 0.758133 6.16896 0.894533L6.31511 1.33333H3.68473Z" />
                <path d="M0.748047 4.04445L1.27954 10.4683C1.32674 10.9868 1.7548 11.3778 2.27531 11.3778H7.72454C8.24505 11.3778 8.67311 10.9868 8.72062 10.4653L9.25182 4.04445H0.748047ZM3.33325 9.71112C3.33325 10.1505 2.66658 10.1523 2.66658 9.71112V5.04445C2.66658 4.60505 3.33325 4.60325 3.33325 5.04445V9.71112ZM5.33325 9.71112C5.33325 10.1505 4.66658 10.1523 4.66658 9.71112V5.04445C4.66658 4.60505 5.33325 4.60325 5.33325 5.04445V9.71112ZM7.33325 9.71112C7.33325 10.1505 6.66658 10.1523 6.66658 9.71112V5.04445C6.66658 4.8602 6.81567 4.71112 6.99991 4.71112C7.18416 4.71112 7.33325 4.8602 7.33325 5.04445V9.71112Z" />
            </svg>
        </button>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'CashierSelectedElement',
        props: [
            'selected'
        ],
        methods: {
            ...mapActions([
                'cashierRemoveLimitedDataSelected'
            ]),
            cashierFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        },
        computed: {
            cashierGetRouteName() {
                return this.$route.name;
            },
            cashierGetName() {
                let name = this.selected.name;

                if(this.cashierGetRouteName.includes('Withdraw') === true) {
                    name = this.selected.items.length > 1 ? (this.selected.items.length + ' ITEM BUNDLE') : this.selected.items[0].name;
                }

                return name;
            },
            cashierGetImages() {
                let images = [this.selected.image];

                if(this.cashierGetRouteName.includes('Withdraw') === true) {
                    images = this.selected.items.map((element) => element.image);
                }

                return images;
            }
        }
    }
</script>

<style scoped>
    .cashier-selected-element {
        width: 100%;
        height: 93px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 6px;
        padding: 18px 25px 18px 15px;
        border-radius: 10px;
        background: linear-gradient(0deg, #031f34 0%, #031f34 100%), 
                    radial-gradient(80% 80% at 50% 50%, rgba(0, 255, 194, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
        border: 1px solid rgba(22, 83, 95, 0.5);
    }

    .cashier-selected-element:first-child {
        margin-top: 0;
    }

    .cashier-selected-element .element-info {
        width: 100px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .cashier-selected-element .info-name {
        font-size: 10px;
        font-weight: 700;
        color: #bbbfd0;
    }

    .cashier-selected-element .info-amount {
        display: flex;
        align-items: center;
    }

    .cashier-selected-element .info-amount img {
        width: 14px;
        height: 14px;
        margin-right: 6px;
    }

    .cashier-selected-element .amount-value {
        font-size: 10px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .cashier-selected-element .amount-value span {
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
    }

    .cashier-selected-element .element-image {
        width: 57px;
        height: 57px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .cashier-selected-element.element-bundle .element-image {
        justify-content: space-between;
        align-content: space-between;
    }

    .cashier-selected-element .image-element {
        width: 72px;
        height: 72px;
    }

    .cashier-selected-element.element-bundle .image-element {
        width: 27px;
        height: 27px;
        padding: 1px;
        border-radius: 6px;
        background: linear-gradient(0deg, #031f34 0%, #031f34 100%), 
                    radial-gradient(80% 80% at 50% 50%, rgba(0, 255, 194, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
        border: 1px solid rgba(22, 83, 95, 0.5);
        box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.25) inset;
    }

    .cashier-selected-element .element-image img {
        height: 100%;
    }

    .cashier-selected-element button.button-remove svg {
        fill: #25445b;
        transition: fill 0.3s ease;
    }

    .cashier-selected-element button.button-remove:hover svg {
        fill: #ffffff;
    }
</style>