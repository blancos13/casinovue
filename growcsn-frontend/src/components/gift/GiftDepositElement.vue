<template>
    <a target="_blank" class="gift-deposit-element">
        <img v-bind:src="require('@/assets/img/cashier/gift/gift_' + amount + '.webp')" />
    </a>
</template>

<script>
    export default {
        name: 'GiftDepositElement',
        props: [
            'amount'
        ]
    }
</script>

<style scoped>
    a.gift-deposit-element {
        width: calc(33.33% - 10px);
        height: 165px;
        display: flex;
        justify-content: center;
        margin-top: 15px;
        margin-right: 15px;
        border-radius: 15px;
        overflow: hidden;
    }

    a.gift-deposit-element:nth-child(3n) {
        margin-right: 0;
    }

    a.gift-deposit-element img {
        height: 100%;
    }

    @media only screen and (max-width: 650px) {

        a.gift-deposit-element {
            height: 130px;
        }

    }

    @media only screen and (max-width: 500px) {

        a.gift-deposit-element {
            width: calc(50% - 7.5px);
        }

        a.gift-deposit-element:nth-child(3n) {
            margin-right: 15px;
        }

        a.gift-deposit-element:nth-child(2n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 425px) {

        a.gift-deposit-element {
            height: 130px;
        }

    }
</style>