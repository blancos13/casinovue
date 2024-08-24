<template>
    <button v-on:click="modalItemButton" class="limiteds-element">
        <div class="element-inner">
            <div class="inner-name">{{limited.name}}</div>
            <img v-bind:src="limited.image" />
            <div class="inner-amount">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="amount-value">
                    <span>{{modalFormatValue(limited.price).split('.')[0]}}</span>.{{modalFormatValue(limited.price).split('.')[1]}}
                </div>
            </div>
        </div>
    </button>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'LimitedsElement',
        props: [
            'limited'
        ],
        methods: {
            ...mapActions([
                'modalsSetData', 
                'modalsSetShow'
            ]),
            modalFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            modalItemButton() {
                this.modalsSetShow(null);

                setTimeout(() => { 
                    this.modalsSetData({ typeCashier: this.modalsData.typeCashier, limited: this.limited });
                    this.modalsSetShow('LimitedsItem'); 
                }, 200);
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
    button.limiteds-element {
        width: calc(20% - 8px);
        height: 235px;
        position: relative;
        margin-top: 10px;
        margin-right: 10px;
        padding: 1px;
        z-index: 1;
    }

    button.limiteds-element:nth-child(1),
    button.limiteds-element:nth-child(2),
    button.limiteds-element:nth-child(3),
    button.limiteds-element:nth-child(4),
    button.limiteds-element:nth-child(5) {
        margin-top: 0;
    }

    button.limiteds-element:nth-child(5n) {
        margin-right: 0;
    }

    .modal-limiteds-item button.limiteds-element {
        width: 100%;
        margin-top: 0;
        margin-right: 0;
        cursor: default;
    }

    button.limiteds-element::before {
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

    button.limiteds-element:hover::before,
    button.limiteds-element.element-active::before {
        background: linear-gradient(180deg, rgba(0, 255, 194, 0), #00ffc2 100%);
        border: none;
    }

    button.limiteds-element:hover::after,
    button.limiteds-element.element-active::after {
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

    button.limiteds-element .element-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 20px 10px;
        border-radius: 20px;
        background: linear-gradient(255deg, rgba(0, 255, 194, 0.02) 0%, rgba(0, 170, 109, 0.02) 100%), radial-gradient(80% 80% at 50% 50%, rgba(0, 255, 194, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
        box-shadow: inset 0px 5px 50px rgba(0, 0, 0, 0.25);
    }

    button.limiteds-element:hover .element-inner,
    button.limiteds-element.element-active .element-inner {
        background: linear-gradient(255deg, rgba(0, 255, 194, 0.02) 0%, rgba(0, 170, 109, 0.02) 100%), radial-gradient(80% 80% at 50% 50%, rgba(0, 255, 194, 0.35) 0%, rgba(0, 0, 0, 0) 100%);
    }

    button.limiteds-element .element-inner img {
        width: 110px;
    }

    button.limiteds-element .inner-name {
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        color: #bbbfd0;
    }

    button.limiteds-element .inner-amount {
        display: flex;
        align-items: center;
    }

    button.limiteds-element .inner-amount img {
        width: 21px;
        height: 21px;
        margin-right: 8px;
    }

    button.limiteds-element .amount-value {
        font-size: 12px;
        font-weight: 600;
        color: #c1c1c1;
    }

    button.limiteds-element .amount-value span {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 900px) {

        button.limiteds-element {
            width: calc(25% - 7.5px);
        }

        button.limiteds-element:nth-child(5) {
            margin-top: 10px;
        }

        button.limiteds-element:nth-child(5n) {
            margin-right: 10px;
        }

        button.limiteds-element:nth-child(4n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 700px) {

        button.limiteds-element {
            width: calc(33.33% - 6.66px);
        }

        button.limiteds-element:nth-child(4) {
            margin-top: 10px;
        }

        button.limiteds-element:nth-child(4n) {
            margin-right: 10px;
        }

        button.limiteds-element:nth-child(3n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 550px) {

        button.limiteds-element {
            width: calc(50% - 5px);
        }

        button.limiteds-element:nth-child(3) {
            margin-top: 10px;
        }

        button.limiteds-element:nth-child(3n) {
            margin-right: 10px;
        }

        button.limiteds-element:nth-child(2n) {
            margin-right: 0;
        }

    }
</style>
