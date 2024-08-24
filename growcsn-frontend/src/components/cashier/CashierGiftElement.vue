<template>
    <a target="_blank" class="cashier-gift-element">
        <img v-bind:src="require('@/assets/img/cashier/gift/gift_' + amount + '.png')" />
    </a>
</template>

<script>
    export default {
        name: 'CashierGiftElement',
        props: ['amount']
    }
</script>

<style scoped>
    a.cashier-gift-element {
        width: calc(33.33% - 16.66px);
        height: 165px;
        display: flex;
        justify-content: center;
        margin-top: 25px;
        margin-right: 25px;
        border-radius: 15px;
        overflow: hidden;
    }

    a.cashier-gift-element:nth-child(1),
    a.cashier-gift-element:nth-child(2),
    a.cashier-gift-element:nth-child(3) {
        margin-top: 0;
    }

    a.cashier-gift-element:nth-child(3n) {
        margin-right: 0;
    }

    a.cashier-gift-element img {
        height: 100%;
    }

    @media only screen and (max-width: 650px) {

        a.cashier-gift-element {
            width: calc(50% - 12.5px);
        }

        a.cashier-gift-element:nth-child(3) {
            margin-top: 25px;
        }

        a.cashier-gift-element:nth-child(3n) {
            margin-right: 25px;
        }

        a.cashier-gift-element:nth-child(2n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 450px) {

        a.cashier-gift-element {
            width: 100%;
            margin-right: 0!important;
        }

        a.cashier-gift-element:nth-child(2) {
            margin-top: 25px;
        }

    }
</style>
