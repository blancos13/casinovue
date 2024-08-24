<template>
    <div class="modal-crypto" v-bind:class="[ 'crypto-' + modalsData.currency]">
        <div class="crypto-header">
            <button v-on:click="modalBackButton()" class="button-back">
                <div class="button-inner">
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.47974 9.5176L5.47974 0.482354C5.47974 0.0547936 4.96343 -0.16302 4.65688 0.143533L0.139218 4.66115C-0.0463292 4.8467 -0.0463292 5.15325 0.139218 5.33888L4.65688 9.8565C4.96343 10.163 5.47974 9.94516 5.47974 9.5176Z" />
                    </svg>
                </div>
            </button>
            <img v-bind:src="require('@/assets/img/cashier/' + modalsData.currency + '.png')" />
            <div class="header-text">
                {{ modalGetName }}
                <div class="text-amount">${{ modalFormatValue(cashierCryptoData.prices !== null ? cashierCryptoData.prices[this.modalsData.currency].price : 0) }}</div>
            </div>
        </div>
        
        <CashierCryptoDeposit v-if="modalsData.typeCashier === 'deposit'" />
        <CashierCryptoWithdraw v-else />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import CashierCryptoDeposit from '@/components/cashier/CashierCryptoDeposit';
    import CashierCryptoWithdraw from '@/components/cashier/CashierCryptoWithdraw';

    export default {
        name: 'ModalCrypto',
        components: {
            CashierCryptoDeposit,
            CashierCryptoWithdraw
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'modalsSetShow', 
                'modalsSetData',
                'cashierGetCryptoDataSocket'
            ]),
            modalFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            modalBackButton() {
                this.modalsSetShow(null);

                setTimeout(() => { this.modalsSetShow('Cashier'); }, 200);
            }
        },
        computed: {
            ...mapGetters([ 
                'modalsData', 
                'cashierCryptoData'
            ]),
            modalGetName() {
                let name = this.modalsData.currency.toUpperCase();

                if(this.modalsData.currency === 'btc') {
                    name = 'Bitcoin';
                } else if(this.modalsData.currency === 'eth') {
                    name = 'Ethereum';
                }  else if(this.modalsData.currency === 'ltc') {
                    name = 'Litecoin';
                }

                return name;
            }
        },
        created() {
            if(this.cashierCryptoData.loading === false) {
                const data = {};
                this.cashierGetCryptoDataSocket(data);
            }
        }
    }
</script>

<style scoped>
    .modal-crypto {
        width: 820px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 25px 35px 40px 35px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% -30%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(255deg, #07263d 0%, #07243a 100%);
    }

    .modal-crypto .crypto-header {
        width: 100%;
        display: flex;
        align-items: center;
        padding-bottom: 25px;
        border-bottom: 1px solid #335361;
    }

    .modal-crypto button.button-back {
        width: 46px;
        height: 34px;
        margin-right: 15px;
    }

    .modal-crypto button.button-back .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #0d4557;
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .modal-crypto button.button-back .button-inner svg {
        fill: #75adc2;
        transition: fill 0.3s ease;
    }

    .modal-crypto button.button-back:hover .button-inner svg {
        fill: #ffffff;
    }

    .modal-crypto .crypto-header img {
        width: 44px;
        height: 44px;
        margin-right: 15px;
    }

    .modal-crypto .header-text {
        font-size: 14px;
        font-weight: 800;
    }

    .modal-crypto.crypto-btc .header-text {
        color: #f7931a;
    }

    .modal-crypto.crypto-eth .header-text {
        color: #627eea;
    }

    .modal-crypto.crypto-ltc .header-text {
        color: #527fc6;
    }

    .modal-crypto.crypto-usdt .header-text {
        color: #27a17c;
    }

    .modal-crypto.crypto-usdc .header-text {
        color: #2775ca;
    }

    .modal-crypto .text-amount {
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
    }

    @media only screen and (max-width: 840px) {

        .modal-crypto {
            width: calc(100vw - 20px);
            padding: 25px 15px 40px 15px;
        }

    }
</style>
