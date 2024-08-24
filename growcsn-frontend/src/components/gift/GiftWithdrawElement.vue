<template>    
    <button v-on:click="giftItemButton()" class="gift-withdraw-element">
        <div class="element-inner">
            <div class="inner-name">{{item.name}}</div>
            <img v-bind:src="item.image" />
            <div class="inner-amount">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="amount-value">
                    <span>{{giftFormatValue(item.amount).split('.')[0]}}</span>.{{giftFormatValue(item.amount).split('.')[1]}}
                </div>
            </div>
        </div>
    </button>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'GiftWithdrawElement',
        props: ['item'],
        methods: {
            ...mapActions([
                'modalsSetData', 
                'modalsSetShow'
            ]),
            giftFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            giftItemButton() {
                alert('What should happen? :D');
            }
        },
        computed: {
            ...mapGetters([
                'modalsData'
            ])
        }
    }
</script>

<style scoped>
    button.gift-withdraw-element {
        width: calc(20% - 8px);
        height: 235px;
        position: relative;
        margin-top: 10px;
        margin-right: 10px;
        padding: 1px;
        z-index: 1;
    }

    button.gift-withdraw-element:nth-child(5n) {
        margin-right: 0;
    }

    button.gift-withdraw-element::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 20px;
        border: 1px solid rgba(22, 83, 95, 0.5);
        z-index: -1;
    }

    button.gift-withdraw-element:hover::before,
    button.gift-withdraw-element.element-active::before {
        background: linear-gradient(180deg, rgba(0, 255, 194, 0), #00ffc2 100%);
        border: none;
    }

    button.gift-withdraw-element:hover::after,
    button.gift-withdraw-element.element-active::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 20px;
        background-color: #063343;
        z-index: -1;
    }

    button.gift-withdraw-element .element-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 20px 10px;
        border-radius: 20px;
        background: linear-gradient(255deg, rgba(0, 255, 194, 0.02) 0%, rgba(0, 170, 109, 0.02) 100%), 
                    radial-gradient(80% 80% at 50% 50%, rgba(0, 255, 194, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
        box-shadow: inset 0px 5px 50px rgba(0, 0, 0, 0.25);
    }

    button.gift-withdraw-element:hover .element-inner,
    button.gift-withdraw-element.element-active .element-inner {
        background: linear-gradient(225deg, rgba(0, 255, 194, 0.02) 0%, rgba(0, 170, 109, 0.02) 100%), 
                    radial-gradient(55% 55% at 50% 50%, rgba(0, 255, 194, 0.25) 0%, rgba(0, 0, 0, 0) 100%);;
    }

    button.gift-withdraw-element .element-inner img {
        height: 110px;
    }

    button.gift-withdraw-element .inner-name {
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        color: #bbbfd0;
    }

    button.gift-withdraw-element .inner-amount {
        display: flex;
        align-items: center;
    }

    button.gift-withdraw-element .inner-amount img {
        width: 21px;
        height: 21px;
        margin-right: 8px;
    }

    button.gift-withdraw-element .amount-value {
        font-size: 12px;
        font-weight: 600;
        color: #c1c1c1;
    }

    button.gift-withdraw-element .amount-value span {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 900px) {

        button.gift-withdraw-element {
            width: calc(25% - 7.5px);
        }

        button.gift-withdraw-element:nth-child(5n) {
            margin-right: 10px;
        }

        button.gift-withdraw-element:nth-child(4n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 700px) {

        button.gift-withdraw-element {
            width: calc(33.33% - 6.66px);
        }

        button.gift-withdraw-element:nth-child(4n) {
            margin-right: 10px;
        }

        button.gift-withdraw-element:nth-child(3n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 550px) {

        button.gift-withdraw-element {
            width: calc(50% - 5px);
        }

        button.gift-withdraw-element:nth-child(3n) {
            margin-right: 10px;
        }

        button.gift-withdraw-element:nth-child(2n) {
            margin-right: 0;
        }

    }
</style>