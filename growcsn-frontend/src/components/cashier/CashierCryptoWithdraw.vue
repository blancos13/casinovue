<template>
    <div class="cashier-crypto-withdraw">
        <div class="withdraw-amount">
            <div class="amount-header">
                <img v-bind:src="require('@/assets/img/cashier/' + modalsData.currency + '.png')" />
                {{cashierGetName}}
            </div>
            <p>Enter the amount of Robux you would like to withdraw. The network fees will be deducted from your withdraw amount. Average network fees are <span>${{ modalFormatValue(cashierGetFee) }}</span>.</p>
            <div class="amount-inputs">
                <div class="inputs-element">
                    <transition name="fade" mode="out-in">
                        <div v-if="cashierCryptoData.loading === true" class="element-loading" key="loading"></div>
                        <div v-else class="element-content" key="data">
                            <img src="@/assets/img/icons/coin.svg" alt="icon" />
                            <input v-model="cashierCoinAmount" v-on:input="cashierCoinInput" type="text" />
                        </div>
                    </transition>
                </div>
                <span>=</span>
                <div class="inputs-element element-crypto">
                    <transition name="fade" mode="out-in">
                        <div v-if="cashierCryptoData.loading === true" class="element-loading" key="loading"></div>
                        <div v-else class="element-content" key="data">
                            <img v-bind:src="require('@/assets/img/cashier/' + modalsData.currency + '.png')" />
                            <input v-model="cashierCryptoAmount" v-on:input="cashierCryptoInput" type="text" />
                        </div>
                    </transition>
                </div>
                <span>=</span>
                <div class="inputs-element">
                    <transition name="fade" mode="out-in">
                        <div v-if="cashierCryptoData.loading === true" class="element-loading" key="loading"></div>
                        <div v-else class="element-content" key="data">
                            <span class="text-green-gradient">$</span>
                            <input v-model="cashierFiatAmount" v-on:input="cashierFiatInput" type="text" />
                        </div>
                    </transition>
                </div>
            </div>
        </div>
        <div class="withdraw-address">
            <div class="address-inner">
                <div class="inner-title">{{cashierGetName}} Withdraw Address</div>
                <p>This action is irreversible. Please ensure the provided information is correct.</p>
                <input v-model="cashierAddress" type="text" placeholder="Enter your address...">
            </div>
        </div>
        <button v-on:click="cashierWithdrawButton()" class="button-withdraw" v-bind:disabled="socketSendLoading !== null">
            <div class="button-inner">
                <transition name="fade" mode="out-in">
                    <ButtonLoading v-if="socketSendLoading === 'CryptoWithdraw'" />
                    <div v-else class="inner-content">CONFIRM CRYPTO WITHDRAW</div>
                </transition>
            </div>
        </button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import ButtonLoading from '@/components/ButtonLoading';

    export default {
        name: 'CashierCryptoWithdraw',
        components: {
            ButtonLoading
        },
        data() {
            return {
                cashierCoinAmount: 0,
                cashierCryptoAmount: 0,
                cashierFiatAmount: 0,
                cashierAddress: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'cashierSendCryptoWithdrawDepositSocket'
            ]),
            modalFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            cashierCoinInput() {
                this.cashierFiatAmount = parseFloat((this.cashierCoinAmount / 1000) * 2.5).toFixed(2);
                this.cashierCryptoAmount = parseFloat(1 / (this.cashierCryptoData.prices[this.modalsData.currency].price / 1000) * this.cashierFiatAmount).toFixed(8);
            },
            cashierCryptoInput() {
                this.cashierFiatAmount = parseFloat(this.cashierCryptoAmount * (this.cashierCryptoData.prices[this.modalsData.currency].price / 1000)).toFixed(2);
                this.cashierCoinAmount = parseFloat((this.cashierFiatAmount / 2.5) * 1000).toFixed(2);
            },
            cashierFiatInput() {
                this.cashierCoinAmount = parseFloat((this.cashierFiatAmount / 2.5) * 1000).toFixed(2);;
                this.cashierCryptoAmount = parseFloat(1 / (this.cashierCryptoData.prices[this.modalsData.currency].price / 1000) * this.cashierFiatAmount).toFixed(8)
            },
            cashierWithdrawButton() {
                const amount = Math.floor(this.cashierCoinAmount * 1000);

                if(this.cashierAddress === null || this.cashierAddress.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'You need to enter a valid ' + this.modalsData.currency + ' withdraw address.' });
                    return;
                }

                const data = { currency: this.modalsData.currency, amount: amount, address: this.cashierAddress };
                this.cashierSendCryptoWithdrawDepositSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'modalsData',
                'cashierCryptoData'
            ]),
            cashierGetName() {
                let name = this.modalsData.currency.toUpperCase();

                if(this.modalsData.currency === 'btc') {
                    name = 'Bitcoin';
                } else if(this.modalsData.currency === 'eth') {
                    name = 'Ethereum';
                }  else if(this.modalsData.currency === 'ltc') {
                    name = 'Litecoin';
                }

                return name;
            },
            cashierGetFee() {
                let fee = 1000;

                if(this.modalsData.currency === 'eth') {
                    fee = 2000;
                }  else if(this.modalsData.currency === 'ltc') {
                    fee = 250;
                }

                return fee;
            }
        },
        watch: {
            'cashierCryptoData.prices': {
                handler() {
                    this.cashierCoinAmount = parseFloat((100 / 2.5) * 1000).toFixed(2);
                    this.cashierCryptoAmount = parseFloat(1 / (this.cashierCryptoData.prices[this.modalsData.currency].price / 1000) * 100).toFixed(8);
                    this.cashierFiatAmount = parseFloat(100).toFixed(2);
                },
                deep: true
            }
        }
    }
</script>

<style scoped>
    .cashier-crypto-withdraw {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }

    .cashier-crypto-withdraw .withdraw-address {
        width: 100%;
        margin-top: 20px;
        padding: 20px 0;
        border-top: 1px solid rgba(97, 112, 241, 0.15);
        border-bottom: 1px solid rgba(97, 112, 241, 0.15);
    }

    .cashier-crypto-withdraw .withdraw-amount,
    .cashier-crypto-withdraw .address-inner {
        width: 100%;
        padding: 15px 20px;
        border-radius: 8px;
        background: #082435;
    }

    .cashier-crypto-withdraw .address-inner {
        border: 1px solid #123850;
    }

    .cashier-crypto-withdraw .amount-header {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
    }

    .cashier-crypto-withdraw .withdraw-amount p,
    .cashier-crypto-withdraw .address-inner p {
        margin-top: 5px;
        font-size: 12px;
        font-weight: 600;
        color: #5e87a0;
    }

    .modal-crypto.crypto-btc .cashier-crypto-withdraw p span,
    .modal-crypto.crypto-btc .cashier-crypto-withdraw .amount-header {
        color: #f7931a;
    }

    .modal-crypto.crypto-eth .cashier-crypto-withdraw p span,
    .modal-crypto.crypto-eth .cashier-crypto-withdraw .amount-header {
        color: #627eea;
    }

    .modal-crypto.crypto-ltc .cashier-crypto-withdraw p span,
    .modal-crypto.crypto-ltc .cashier-crypto-withdraw .amount-header {
        color: #527fc6;
    }

    .modal-crypto.crypto-usdt .cashier-crypto-withdraw p span,
    .modal-crypto.crypto-usdt .cashier-crypto-withdraw .amount-header {
        color: #27a17c;
    }

    .modal-crypto.crypto-usdc .cashier-crypto-withdraw p span,
    .modal-crypto.crypto-usdc .cashier-crypto-withdraw .amount-header {
        color: #2775ca;
    }

    .cashier-crypto-withdraw .amount-header img {
        width: 30px;
        height: 30px;
        margin-right: 13px;
    }

    .cashier-crypto-withdraw .amount-inputs {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-top: 15px;
    }

    .cashier-crypto-withdraw .amount-inputs span {
        margin: 0 10px;
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .cashier-crypto-withdraw .inputs-element {
        width: 200px;
        height: 50px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .cashier-crypto-withdraw .inputs-element::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .cashier-crypto-withdraw .inputs-element::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #072435;
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .cashier-crypto-withdraw .element-loading {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        clip-path: polygon(13px 0, calc(100% - 13px) 0, 100% 25%, 100% 75%, calc(100% - 13px) 100%, 13px 100%, 0 75%, 0 25%);
    }

    .cashier-crypto-withdraw .element-loading::after {
        width: 100%;
        height: 100%;
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        animation-name: loading_animation;
        animation-duration: 1s;
        animation-timing-function: ease;
        animation-iteration-count: infinite;
        background: linear-gradient(to right, #ffffff00 0%, rgba(255, 255, 255, 0.1) 50%, #ffffff00 100%);
    }

    .cashier-crypto-depwithdrawosit .element-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .cashier-crypto-withdraw .element-loading.fade-leave-to {
        opacity: 0;
    }

    .cashier-crypto-withdraw .element-content {
        width: 100%;
        height: 100%;
    }

    .cashier-crypto-withdraw .element-content input {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 12px 0 44px;
        font-size: 15px;
        font-weight: 600;
        color: #ffffff;
        background-color: transparent;
    }

    .cashier-crypto-withdraw .element-content img,
    .cashier-crypto-withdraw .element-content span {
        position: absolute;
        top: 50%;
        left: 12px;
        transform: translate(0, -50%);
        z-index: 1;
    }

    .cashier-crypto-withdraw .element-content img {
        width: 22px;
        height: 22px;
    }

    .cashier-crypto-withdraw .element-content span {
        font-weight: 800;
        font-size: 17px;
    }

    .cashier-crypto-withdraw .inner-title {
        font-size: 14px;
        font-weight: 800;
        color: #5e87a0;
    }

    .cashier-crypto-withdraw .address-inner input {
        width: 100%;
        height: 49px;
        margin-top: 15px;
        padding: 0 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        background: #071f2e;
        border: 1px dashed #1a4864;
    }

    .cashier-crypto-withdraw .address-inner input::placeholder {
        color: #5e87a0;
    }

    .cashier-crypto-withdraw button.button-withdraw {
        width: 300px;
        height: 54px;
        margin-top: 35px;
    }

    .cashier-crypto-withdraw button.button-withdraw .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(11px 0, calc(100% - 11px) 0, 100% 25%, 100% 75%, calc(100% - 11px) 100%, 11px 100%, 0 75%, 0 25%);
    }

    .cashier-crypto-withdraw button.button-withdraw .inner-content {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    .cashier-crypto-withdraw button.button-withdraw .button-loading.fade-leave-active,
    .cashier-crypto-withdraw button.button-withdraw .inner-content.fade-enter-active {
        transition: opacity 0.5s;
    }

    .cashier-crypto-withdraw button.button-withdraw .button-loading.fade-leave-to,
    .cashier-crypto-withdraw button.button-withdraw .inner-content.fade-enter-from {
        opacity: 0;
    }

    @media only screen and (max-width: 750px) {

        .cashier-crypto-withdraw .amount-inputs {
            width: 100%;
        }

        .cashier-crypto-withdraw .amount-inputs span:nth-of-type(2) {
            display: none;
        }

        .cashier-crypto-withdraw .inputs-element {
            width: calc(50% - 15.3px);
        }

        .cashier-crypto-withdraw .inputs-element:last-of-type {
            width: 100%;
            margin-top: 10px;
        }

    }

    @media only screen and (max-width: 330px) {

        .cashier-crypto-withdraw button.button-withdraw {
            width: 100%;
        }

    }
</style>