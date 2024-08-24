<template>
    <div class="modal-credit">
        <button v-on:click="modalBackButton()" class="button-back">
            <div class="button-inner">BACK</div>
        </button>
        <div class="credit-title">
            <span class="gradient-green">How to Deposit?</span>
        </div>
        <div class="thecss">
            <p>Enter the generated world in Growtopia.</p>
      <p>Make sure that the world owner is in the world before dropping your locks.</p>
      <p>Drop the amount of Diamond Locks locks you wish to deposit next to the white door.</p>
      <p>You should see your balance update on the site within a few seconds.</p>
      <p>If it did not update, message support.</p>
        </div>

        <div class="credit-amount">
            <div class="amount-buttons">
                <button v-on:click="modalAmountButton(0)" v-bind:class="{ 'button-active': [10000, 5000, 1000, 100, 10, 1].includes(modalAmount) !== true }">
                    <div class="button-inner">
                        Custom
                    </div>
                </button>
                <button v-on:click="modalAmountButton(10000)" v-bind:class="{ 'button-active': modalAmount === 10000 }">
                    <div class="button-inner">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        10,000
                    </div>
                </button>
                <button v-on:click="modalAmountButton(5000)" v-bind:class="{ 'button-active': modalAmount === 5000 }">
                    <div class="button-inner">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        5,000
                    </div>
                </button>
                <button v-on:click="modalAmountButton(1000)" v-bind:class="{ 'button-active': modalAmount === 1000 }">
                    <div class="button-inner">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        1,000
                    </div>
                </button>
                <button v-on:click="modalAmountButton(100)" v-bind:class="{ 'button-active': modalAmount === 100 }">
                    <div class="button-inner">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        100
                    </div>
                </button>
                <button v-on:click="modalAmountButton(10)" v-bind:class="{ 'button-active': modalAmount === 10 }">
                    <div class="button-inner">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        10
                    </div>
                </button>
                <button v-on:click="modalAmountButton(1)" v-bind:class="{ 'button-active': modalAmount === 1 }">
                    <div class="button-inner">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        1
                    </div>
                </button>
            </div>
            <div class="amount-input">
                <div class="input-info">
                    <div class="info-inner">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        DLS AMOUNT
                    </div>
                </div>
                <input v-model="modalAmount" v-on:input="modalValidateInput" type="text" />
            </div>
        </div>
        <div class="amount-input">
                <div class="input-info">
                    <div class="info-inner">
                        GROWID
                    </div>
                </div>
                <input v-on:input="modalValidateInput" type="text" />
            </div>
        <div class="credit-button">
            <button v-on:click="modalDepositButton()" class="button-deposit" v-bind:disabled="socketSendLoading !== null">
                <div class="button-inner">
                    <transition name="fade" mode="out-in">
                        <ButtonLoading v-if="socketSendLoading === 'CreditDeposit'" key="loading" />
                        <div v-else class="inner-content" key="content">Start Deposit</div>
                    </transition>
                </div>
            </button>
        </div>
        <div class="credit-info">
            Minimum deposit is 0.20 Dls.
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import ButtonLoading from '@/components/ButtonLoading';

    export default {
        name: 'ModalCredit',
        components: {
            ButtonLoading
        },
        data() {
            return {
                modalAmount: 0
            }
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'modalsSetShow',
                'cashierSendCreditDepositSocket'
            ]),
            modalValidateInput() {
                this.modalAmount = Number(this.modalAmount.replace(',', '').replace('.', '').replace(/[^\d.]/g, ''));
            },
            modalBackButton() {
                this.modalsSetShow(null);
                setTimeout(() => { this.modalsSetShow('Cashier'); }, 200);
            },
            modalAmountButton(amount) {
                this.modalAmount = amount;
            },
            modalDepositButton() {
                const data = { amount: Math.floor(this.modalAmount * 1000) };
                this.cashierSendCreditDepositSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading', 
                'modalsData'
            ]),
            modalGetAmountFiat() {
                let amount = parseFloat((this.modalAmount / 1000) * 3).toFixed(2);

                if(this.modalAmount === null || isNaN(this.modalAmount) || this.modalAmount <= 0) { amount = 0; }

                return amount;
            }
        }
    }
</script>

<style scoped>
    .modal-credit {
        width: 900px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 30px 50px 30px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% -30%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(255deg, #07263d 0%, #07243a 100%);
    }

    .modal-credit button.button-back {
        height: 33px;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 15px;
        left: 20px;
        filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1));
        z-index: 1;
    }

    .modal-credit button.button-back .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 12px;
        font-size: 14px;
        font-weight: 800;
        color: #75adc2;
        background-color: #1a4f63;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
        transition: color 0.3s ease;
    }

    .modal-credit button.button-back:hover .button-inner {
        color: #ffffff;
    }

    .modal-credit .credit-title {
        text-align: center;
        text-transform: uppercase;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-credit .credit-amount {
        width: 100%;
        margin-top: 35px;
        padding-top: 25px;
        border-top: 1px dashed #335361;
    }

    .modal-credit .amount-buttons {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .modal-credit .amount-buttons button {
        width: calc(14.2% - 13.71px);
        height: 44px;
        position: relative;
        margin-right: 16px;
        padding: 1px;
        z-index: 1;
    }

    .modal-credit .amount-buttons button:last-child {
        margin-right: 0;
    }

    .modal-credit .amount-buttons button:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 5px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #174e64 100%);
        z-index: -1;
    }

    .modal-credit .amount-buttons button.button-active:before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #00ffc2 100%);
    }
    .thecss {
    margin: 0;
    padding: 2rem 0 0 2rem; /* Yukarıdan ve soldan 2rem boşluk bırakır */
    font-size: 1.2rem;
    font-weight: 400; /* Font ağırlığı azaltıldı */
    color: white;
    text-align: left;
    margin-right: 100px;
    font-family: MontSerrat, sans-serif; /* Arial veya sans-serif gibi daha standart bir font kullanılabilir */
}

.thecss p {
    counter-increment: numbers;
    line-height: 1.5rem;
    margin: 0;
    padding: 0;
}

.thecss p:before {
    content: counter(numbers) ". ";
    font-weight: 600;
    margin-right: 5px;
}



    .modal-credit .amount-buttons button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(225deg, rgba(0, 255, 194, 0.01) 0%, rgba(0, 170, 109, 0.01) 100%), #10253c;
        box-shadow: 0px 5px 50px 0px rgba(0, 0, 0, 0.25) inset;
    }

    .modal-credit .amount-buttons button.button-active .button-inner {
        background: linear-gradient(225deg, rgba(0, 255, 194, 0.01) 0%, rgba(0, 170, 109, 0.01) 100%), 
                    radial-gradient(80% 80% at 50% 50%, rgba(0, 255, 194, 0.35) 0%, rgba(0, 0, 0, 0) 100%), #10253c;
    } 

    .modal-credit .amount-buttons button .button-inner img {
        width: 21px;
        height: 21px;
        margin-right: 8px;
    }

    .modal-credit .amount-input {
        width: 100%;
        height: 65px;
        position: relative;
        margin-top: 25px;
        padding: 1px;
        z-index: 1;
    }

    .modal-credit .amount-input:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(13px 0, calc(100% - 13px) 0, 100% 25%, 100% 75%, calc(100% - 13px) 100%, 13px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .modal-credit .amount-input input {
        width: 100%;
        height: 100%;
        padding: 0 15px 0 216px;
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
        background: #072435;
        clip-path: polygon(13px 0, calc(100% - 13px) 0, 100% 25%, 100% 75%, calc(100% - 13px) 100%, 13px 100%, 0 75%, 0 25%);
    }

    .modal-credit .input-info {
        width: 180px;
        height: 37px;
        position: absolute;
        top: 50%;
        left: 15px;
        padding: 1px;
        transform: translate(0, -50%);
        z-index: 1;
    }

    .modal-credit .input-info:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #10374e;
        z-index: -1;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .modal-credit .input-info:after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #072435;
        z-index: -1;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .modal-credit .info-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #49687d;
        background: rgba(12, 49, 71, 0.4);
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .modal-credit .info-inner img {
        width: 15px;
        height: 15px;
        margin-right: 8px;
    }

    .modal-credit .credit-button {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 35px;
        padding-top: 35px;
        border-top: 1px dashed #335361;
    }

    .modal-credit .credit-button button.button-deposit {
        min-width: 165px;
        height: 48px;
    }

    .modal-credit .credit-button button.button-deposit .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .modal-credit .credit-button button.button-deposit .button-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .modal-credit .credit-button button.button-deposit .button-loading.fade-leave-to {
        opacity: 0;
    }

    .modal-credit .credit-button button.button-deposit .inner-content {
        padding: 0 24px;
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    .modal-credit .credit-button button.button-deposit .inner-content.fade-enter-active {
        transition: opacity 0.5s;
    }

    .modal-credit .credit-button button.button-deposit .inner-content.fade-enter-from {
        opacity: 0;
    }

    .modal-credit .credit-info {
        width: 100%;
        margin-top: 35px;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        color: #db7d48;
    }

    @media only screen and (max-width: 920px) {

        .modal-credit {
            width: calc(100vw - 20px);
            padding: 65px 10px 50px 10px;
        }

    }

    @media only screen and (max-width: 775px) {

        .modal-credit .credit-amount {
            padding-top: 19px;
        }

        .modal-credit .amount-buttons button {
            width: calc(33.33% - 8px);
            margin-top: 6px;
            margin-right: 12px;
        }

        .modal-credit .amount-buttons button:first-child {
            display: none;
        }

        .modal-credit .amount-buttons button:nth-child(4),
        .modal-credit .amount-buttons button:last-child {
            margin-right: 0;
        }

    }
</style>