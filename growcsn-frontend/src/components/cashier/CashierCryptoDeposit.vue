<template>
    <div class="cashier-crypto-deposit">
        <div class="deposit-info">
            <div class="info-qrcode">
                <transition name="fade" mode="out-in">
                    <div v-if="cashierCryptoData.loading === true" class="qrcode-loading" key="loading"></div>
                    <div v-else class="qrcode-content" key="data">
                        <QRCode v-bind:value="cashierCryptoData.addresses[modalsData.currency]" v-bind:options="{ width: 140, height: 140, margin: 0 }" />
                    </div>
                </transition>
            </div>
            <div class="info-text">
                <div class="text-header">
                    <img v-bind:src="require('@/assets/img/cashier/' + modalsData.currency + '.png')" />
                    {{cashierGetName}}
                </div>
                <p>Always double-check the address and the amount before sending. We cannot recover funds sent to the wrong address.The final amount is calculated once your deposit confirms on the network.</p>
                <p>Scan the QR code or copy the address and send your desired amount. <span>Minimum 0.01 {{modalsData.currency.toUpperCase()}}.</span> Your deposit will be confirmed after {{cashierGetConfirmations}} confirmation on the network.</p>
            </div>
        </div>
        <div class="deposit-rate">
            <div class="rate-title">Currency Conversion</div>
            <div class="rate-content">
                <div class="content-element">
                    <transition name="fade" mode="out-in">
                        <div v-if="cashierCryptoData.loading === true" class="element-loading" key="loading"></div>
                        <div v-else class="element-content" key="data">
                            <img src="@/assets/img/icons/coin.svg" alt="icon" />
                            <input v-model="cashierCoinAmount" v-on:input="modalCoinInput" type="text" />
                        </div>
                    </transition>
                </div>
                <span>=</span>
                <div class="content-element element-crypto">
                    <transition name="fade" mode="out-in">
                        <div v-if="cashierCryptoData.loading === true" class="element-loading" key="loading"></div>
                        <div v-else class="element-content" key="data">
                            <img v-bind:src="require('@/assets/img/cashier/' + modalsData.currency + '.png')" />
                            <input v-model="cashierCryptoAmount" v-on:input="modalCryptoInput" type="text" />
                        </div>
                    </transition>
                </div>
                <span>=</span>
                <div class="content-element">
                    <transition name="fade" mode="out-in">
                        <div v-if="cashierCryptoData.loading === true" class="element-loading" key="loading"></div>
                        <div v-else class="element-content" key="data">
                            <span class="text-green-gradient">$</span>
                            <input v-model="cashierFiatAmount" v-on:input="modalFiatInput" type="text" />
                        </div>
                    </transition>
                </div>
            </div>
        </div>
        <div class="deposit-address">
            <div class="address-title">Your Wallet Address</div>
            <div class="address-input">
                <transition name="fade" mode="out-in">
                    <div v-if="cashierCryptoData.loading === true" class="input-loading" key="loading"></div>
                    <div v-else class="input-content" key="data">
                        <input v-model="cashierCryptoData.addresses[modalsData.currency]" type="text" />
                        <button v-on:click="modalCopyButton()">
                            <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.5083 8.74064C12.2654 8.49634 11.9961 8.27977 11.7054 8.09492C10.9354 7.60186 10.0403 7.33985 9.12591 7.33985C7.85684 7.33749 6.63934 7.84172 5.74354 8.74064L1.39771 13.0899C0.503433 13.9859 0.000801741 15.1999 9.90297e-07 16.4658C-0.00168059 19.1074 2.1384 21.2503 4.78008 21.252C6.04719 21.2564 7.26357 20.7545 8.15905 19.858L11.7464 16.2707C11.8116 16.206 11.848 16.1179 11.8475 16.0261C11.8464 15.8374 11.6925 15.6854 11.5038 15.6864H11.3672C10.6177 15.6891 9.87486 15.5451 9.18061 15.2628C9.05269 15.2101 8.90567 15.2399 8.80822 15.3379L6.22872 17.9208C5.42773 18.7218 4.12907 18.7218 3.32808 17.9208C2.52709 17.1199 2.52709 15.8212 3.32808 15.0202L7.69101 10.6607C8.49136 9.86138 9.7879 9.86138 10.5882 10.6607C11.1276 11.1684 11.969 11.1684 12.5083 10.6607C12.7404 10.4285 12.8811 10.1204 12.9047 9.79291C12.9296 9.40154 12.7853 9.01827 12.5083 8.74064Z" />
                                <path d="M19.0989 2.15102C17.2308 0.282992 14.2022 0.282992 12.3341 2.15102L8.75016 5.73154C8.65175 5.83043 8.62336 5.97917 8.67842 6.10737C8.73283 6.23593 8.85999 6.31845 8.99956 6.31577H9.12595C9.87458 6.31441 10.6162 6.45946 11.3091 6.74285C11.437 6.7955 11.5841 6.76579 11.6815 6.6677L14.2542 4.09845C15.0552 3.29746 16.3538 3.29746 17.1548 4.09845C17.9558 4.89944 17.9558 6.1981 17.1548 6.99909L13.9501 10.2004L13.9227 10.2311L12.8021 11.3449C12.0018 12.1443 10.7052 12.1443 9.90488 11.3449C9.3655 10.8373 8.52415 10.8373 7.9848 11.3449C7.75127 11.5789 7.61045 11.8897 7.58847 12.2195C7.56349 12.6109 7.70782 12.9942 7.9848 13.2718C8.38026 13.669 8.84293 13.9928 9.35141 14.2285C9.42315 14.2626 9.4949 14.29 9.56665 14.3207C9.63839 14.3515 9.71355 14.3754 9.78529 14.4027C9.85704 14.4301 9.93219 14.454 10.0039 14.4745L10.2055 14.5291C10.3422 14.5633 10.4789 14.5906 10.6189 14.6145C10.7876 14.6396 10.9576 14.6555 11.128 14.6623H11.3671H11.3876L11.5926 14.6384C11.6678 14.635 11.7464 14.6179 11.8352 14.6179H11.9514L12.1871 14.5838L12.2964 14.5633L12.4946 14.5223H12.5322C13.3714 14.3115 14.1377 13.877 14.7495 13.265L19.0987 8.91576C20.9669 7.04773 20.9669 4.01905 19.0989 2.15102Z" />
                            </svg>
                        </button>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import QRCode from '@/components/QRCode';

    export default {
        name: 'CashierCryptoDeposit',
        components: {
            QRCode
        },
        data() {
            return {
                cashierCryptoAmount: 0,
                cashierCoinAmount: 0,
                cashierFiatAmount: 0
            }
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'modalsSetShow', 
                'modalsSetData'
            ]),
            modalCoinInput() {
                this.cashierFiatAmount = parseFloat((this.cashierCoinAmount / 1000) * 3).toFixed(2);
                this.cashierCryptoAmount = parseFloat(1 / (this.cashierCryptoData.prices[this.modalsData.currency].price / 1000) * this.cashierFiatAmount).toFixed(8);
            },
            modalFiatInput() {
                this.cashierCoinAmount = parseFloat((this.cashierFiatAmount / 3) * 1000).toFixed(2);;
                this.cashierCryptoAmount = parseFloat(1 / (this.cashierCryptoData.prices[this.modalsData.currency].price / 1000) * this.cashierFiatAmount).toFixed(8)
            },
            modalCryptoInput() {
                this.cashierFiatAmount = parseFloat(this.cashierCryptoAmount * (this.cashierCryptoData.prices[this.modalsData.currency].price / 1000)).toFixed(2);
                this.cashierCoinAmount = parseFloat((this.cashierFiatAmount / 3) * 1000).toFixed(2);
            },
            modalCopyButton() {
                const el = document.createElement('textarea');
                el.value = this.cashierCryptoData.addresses[this.modalsData.currency];
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);

                this.notificationShow({ type: 'success', message: 'Copied to your clipboard.' });
            }
        },
        computed: {
            ...mapGetters([
                'modalsShow', 
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
            cashierGetConfirmations() {
                let confirmations = 13;

                if(this.modalsData.currency === 'btc') {
                    confirmations = 1;
                } else if(this.modalsData.currency === 'ltc') {
                    confirmations = 6;
                }

                return confirmations;
            }
        },
        watch: {
            'cashierCryptoData.prices': {
                handler() {
                    this.cashierCoinAmount = parseFloat((100 / 3) * 1000).toFixed(2);
                    this.cashierFiatAmount = parseFloat(100).toFixed(2);
                    this.cashierCryptoAmount = parseFloat(1 / (this.cashierCryptoData.prices[this.modalsData.currency].price / 1000) * 100).toFixed(8);
                },
                deep: true
            }
        }
    }
</script>

<style scoped>
    .cashier-crypto-deposit {
        width: 100%;
        margin-top: 20px;
    }

    .cashier-crypto-deposit .deposit-info {
        display: flex;
        align-items: center;
    }

    .cashier-crypto-deposit .info-qrcode {
        width: 150px;
        height: 150px;
        background-color: #ffffff;
    }

    .cashier-crypto-deposit .qrcode-loading {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
    }

    .cashier-crypto-deposit .qrcode-loading::after {
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
        background: linear-gradient(to right, #dddddd 0%, #aaaaaa 50%, #dddddd 100%);
    }

    .cashier-crypto-deposit .qrcode-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .cashier-crypto-deposit .qrcode-loading.fade-leave-to {
        opacity: 0;
    }

    .cashier-crypto-deposit .qrcode-content {
        width: 100%;
        height: 100%;
        padding: 5px;
    }

    .cashier-crypto-deposit .info-text {
        width: calc(100% - 166px);
        margin-left: 16px;
        padding: 18px;
        border-radius: 8px;
        background: #082435;
    }

    .cashier-crypto-deposit .info-text p {
        margin-top: 13px;
        font-size: 12px;
        font-family: 600;
        color: #396682;
    }

    .cashier-crypto-deposit .info-text p:first-of-type {
        margin-top: 9px;
        color: #4d87aa;
    }

    .cashier-crypto-deposit .info-text p span {
        color: #4d87aa;
    }

    .cashier-crypto-deposit .text-header {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
    }

    .modal-crypto.crypto-btc .cashier-crypto-deposit .text-header {
        color: #f7931a;
    }

    .modal-crypto.crypto-eth .cashier-crypto-deposit .text-header {
        color: #627eea;
    }

    .modal-crypto.crypto-ltc .cashier-crypto-deposit .text-header {
        color: #527fc6;
    }

    .modal-crypto.crypto-usdt .cashier-crypto-deposit .text-header {
        color: #27a17c;
    }

    .modal-crypto.crypto-usdc .cashier-crypto-deposit .text-header {
        color: #2775ca;
    }

    .cashier-crypto-deposit .text-header img {
        width: 30px;
        height: 30px;
        margin-right: 12px;
    }

    .cashier-crypto-deposit .deposit-rate {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-top: 35px;
    }

    .cashier-crypto-deposit .deposit-rate,
    .cashier-crypto-deposit .deposit-address {
        width: 100%;
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .cashier-crypto-deposit .rate-title,
    .cashier-crypto-deposit .address-title {
        font-size: 14px;
        font-weight: 700;
        color: #57819b;
    }

    .cashier-crypto-deposit .rate-content {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-top: 11px;
    }

    .cashier-crypto-deposit .rate-content span {
        margin: 0 10px;
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .cashier-crypto-deposit .content-element {
        width: 200px;
        height: 50px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .cashier-crypto-deposit .content-element::before {
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

    .cashier-crypto-deposit .content-element::after {
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

    .cashier-crypto-deposit .element-loading {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        clip-path: polygon(13px 0, calc(100% - 13px) 0, 100% 25%, 100% 75%, calc(100% - 13px) 100%, 13px 100%, 0 75%, 0 25%);
    }

    .cashier-crypto-deposit .element-loading::after {
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

    .cashier-crypto-deposit .element-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .cashier-crypto-deposit .element-loading.fade-leave-to {
        opacity: 0;
    }

    .cashier-crypto-deposit .element-content {
        width: 100%;
        height: 100%;
    }

    .cashier-crypto-deposit .element-content input {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 12px 0 44px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: transparent;
    }

    .cashier-crypto-deposit .element-content img,
    .cashier-crypto-deposit .element-content span {
        position: absolute;
        top: 50%;
        left: 12px;
        transform: translate(0, -50%);
        z-index: 1;
    }

    .cashier-crypto-deposit .element-content img {
        width: 22px;
        height: 22px;
    }

    .cashier-crypto-deposit .element-content span {
        font-weight: 800;
        font-size: 17px;
    }

    .cashier-crypto-deposit .address-input {
        width: 100%;
        height: 60px;
        margin-top: 11px;
        border-radius: 8px;
        background: #071F2e;
    }

    .cashier-crypto-deposit .input-loading {
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        clip-path: polygon(13px 0, calc(100% - 13px) 0, 100% 25%, 100% 75%, calc(100% - 13px) 100%, 13px 100%, 0 75%, 0 25%);
    }

    .cashier-crypto-deposit .input-loading::after {
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

    .cashier-crypto-deposit .input-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .cashier-crypto-deposit .input-loading.fade-leave-to {
        opacity: 0;
    }

    .cashier-crypto-deposit .input-content {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .cashier-crypto-deposit .input-content input {
        width: 100%;
        height: 63px;
        padding: 0 45px 0 25px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background: transparent;
    }

    .cashier-crypto-deposit .input-content button {
        height: 23px;
        position: absolute;
        top: 50%;
        right: 22px;
        transform: translate(0, -50%);
    }

    .cashier-crypto-deposit .input-content button svg {
        fill: #57819b;
        transition: fill 0.3s ease;
    }

    .cashier-crypto-deposit .input-content button:hover svg {
        fill: #ffffff;
    }

    @keyframes loading_animation {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(100%); }
    }

    @media only screen and (max-width: 750px) {

        .cashier-crypto-deposit .deposit-rate {
            width: 100%;
        }

        .cashier-crypto-deposit .rate-content span:nth-of-type(2) {
            display: none;
        }

        .cashier-crypto-deposit .content-element {
            width: calc(50% - 15.3px);
        }

        .cashier-crypto-deposit .content-element:last-of-type {
            width: 100%;
            margin-top: 10px;
        }

    }

    @media only screen and (max-width: 500px) {

        .cashier-crypto-deposit .deposit-info {
            flex-direction: column;
        }

        .cashier-crypto-deposit .info-text {
            width: 100%;
            margin-top: 16px;
            margin-left: 0;
        }

    }
</style>