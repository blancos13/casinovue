<template>
    <div class="mines-controls">
        <div class="controls-top">
            <div class="top-amount">
                <input v-model="minesAmount" v-on:input="minesValidateInput" type="text" placeholder="BET AMOUNT" v-bind:disabled="minesGame !== null && minesGame.state !== 'completed'" />
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="amount-buttons">
                    <button v-on:click="minesSetAmount('2x')" v-bind:disabled="minesGame !== null && minesGame.state !== 'completed'">
                        <div class="button-inner">2x</div>
                    </button>
                    <button v-on:click="minesSetAmount('max')" v-bind:disabled="minesGame !== null && minesGame.state !== 'completed'">
                        <div class="button-inner">MAX</div>
                    </button>
                </div>
            </div>
            <div class="top-slider">
                <input v-model="minesAmount" type="range" min="0" v-bind:max="authUser.user !== null ? (authUser.user.balance / 1000) : 0" step="0.01" v-bind:disabled="minesGame !== null && minesGame.state !== 'completed'" />
            </div>
            <div class="top-mines">
                <div class="mines-title">AMOUNT OF MINES</div>
                <div class="mines-content">
                    <button v-on:click="minesSetCount(1)" v-bind:class="{ 'button-active': minesIsCount(1) === true }" v-bind:disabled="minesGame !== null && minesGame.state !== 'completed'">
                        <div class="button-inner">1</div>
                    </button>
                    <button v-on:click="minesSetCount(3)" v-bind:class="{ 'button-active': minesIsCount(3) === true }" v-bind:disabled="minesGame !== null && minesGame.state !== 'completed'">
                        <div class="button-inner">3</div>
                    </button>
                    <button v-on:click="minesSetCount(5)" v-bind:class="{ 'button-active': minesIsCount(5) === true }" v-bind:disabled="minesGame !== null && minesGame.state !== 'completed'">
                        <div class="button-inner">5</div>
                    </button>
                    <button v-on:click="minesSetCount(10)" v-bind:class="{ 'button-active': minesIsCount(10) === true }" v-bind:disabled="minesGame !== null && minesGame.state !== 'completed'">
                        <div class="button-inner">10</div>
                    </button>
                    <div class="content-input">
                        <input v-model="minesCount" type="number" min="1" max="24" placeholder="..." v-bind:disabled="minesGame !== null && minesGame.state !== 'completed'" />
                    </div>
                </div>
            </div>
            <button v-if="minesGame === null || minesGame.state === 'completed'" v-on:click="minesBetButton()" class="button-bet" v-bind:disabled="socketSendLoading !== null">
                <div class="button-inner">
                    <transition name="fade" mode="out-in">
                        <ButtonLoading v-if="socketSendLoading === 'MinesBet'" />
                        <div v-else class="inner-content">PLACE BET</div>
                    </transition>
                </div>
            </button>
            <button v-else v-on:click="minesCashoutButton()" class="button-cashout" v-bind:disabled="socketSendLoading !== null">
                <div class="button-inner">
                    <transition name="fade" mode="out-in">
                        <ButtonLoading v-if="socketSendLoading === 'MinesCashout'" />
                        <div v-else class="inner-content">
                            CASHOUT
                            <div class="content-amount">
                                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                                <div class="amount-value">
                                    <span>{{ minesFormatValue(minesGetCashoutAmount).split('.')[0] }}</span>.{{ minesFormatValue(minesGetCashoutAmount).split('.')[1] }}
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </button>
            <button v-on:click="minesRevealButton()" class="button-auto" v-bind:disabled="socketSendLoading !== null || minesGame === null || minesGame.state === 'completed'">
                <div class="button-inner">AUTO-SELECT MINE</div>
            </button>
        </div>
        <div class="controls-info">
            <button v-on:click="minesFairButton()">
                <div class="button-inner">
                    <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0001 2.30199V3.8031H10.941C9.76198 3.80425 8.60479 3.48508 7.59306 2.87967L6.25388 2.07004C6.17599 2.02293 6.0867 1.99803 5.99567 1.99803C5.90465 1.99803 5.81535 2.02293 5.73747 2.07004L4.40266 2.8753C3.39067 3.48009 2.23365 3.79922 1.05471 3.79872H3.60219e-10V2.30199C-5.0177e-06 2.16926 0.0524184 2.04191 0.145859 1.94765C0.239299 1.85339 0.36619 1.79986 0.49891 1.7987H1.05909C2.32857 1.79901 3.574 1.45247 4.66087 0.796506L6.00005 0L7.33485 0.800882C8.42243 1.45521 9.6674 1.80162 10.9366 1.80308H11.5012C11.6328 1.80533 11.7584 1.85862 11.8515 1.9517C11.9446 2.04478 11.9979 2.17037 12.0001 2.30199Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.941 4.81404C9.58091 4.8134 8.2466 4.44276 7.08102 3.74182L6.00005 3.08536L4.91908 3.72869C3.75456 4.43362 2.42034 4.80878 1.05909 4.81404H0V6.12696C0.00306513 7.64623 0.438442 9.13326 1.25526 10.4143C2.07207 11.6953 3.23659 12.7174 4.61273 13.3612L6.00005 14.0045L7.37862 13.3612C8.75673 12.7191 9.92335 11.6976 10.7418 10.4164C11.5603 9.13521 11.9968 7.64729 12.0001 6.12696V4.81404H10.941ZM6.25388 9.19044C6.16095 9.27977 6.03705 9.32966 5.90815 9.32966C5.77924 9.32966 5.65534 9.27977 5.56241 9.19044L4.16196 7.78999L4.86656 7.08539L5.9169 8.13135L7.66746 6.38079L8.37206 7.08539L6.25388 9.19044Z" />
                    </svg>
                    FAIRNESS
                </div>
            </button>
            <button v-on:click="minesMuteButton()">
                <div class="button-inner">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 5.99999C9 4.82334 8.32 3.80665 7.33334 3.31665V4.78999L8.97 6.42665C8.99 6.28665 9 6.14334 9 5.99999Z" />
                        <path d="M10.6667 6.00001C10.6667 6.62666 10.53 7.21666 10.3067 7.76001L11.3167 8.77001C11.75 7.94001 12 7.00001 12 6.00001C12 3.14666 10.0033 0.760007 7.33334 0.153351V1.53001C9.26 2.10335 10.6667 3.88666 10.6667 6.00001Z" />
                        <path d="M6 0.666656L4.60666 2.06L6 3.45334V0.666656Z" />
                        <path d="M0.85 0L0 0.85L3.15 4H0V8H2.66666L6 11.3333V6.85L8.83666 9.68666C8.39 10.03 7.88666 10.3067 7.33331 10.4733V11.85C8.24997 11.64 9.08666 11.22 9.78997 10.6433L11.15 12L12 11.15L6 5.15L0.85 0Z" />
                    </svg>
                    {{ soundMines === 1 ? 'MUTE' : 'UNMUTE' }}
                </div>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import ButtonLoading from '@/components/ButtonLoading';

    export default {
        name: 'MinesControls',
        components: {
            ButtonLoading
        },
        data() {
            return {
                minesAmount: null,
                minesCount: 1
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'soundSetMines',
                'modalsSetShow',
                'minesSendBetSocket',
                'minesSendRevealSocket',
                'minesSendCashoutSocket'
            ]),
            minesFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            minesValidateInput() {
                this.minesAmount = this.minesAmount.replace(',', '.').replace(/[^\d.]/g, '');
                this.minesAmount = this.minesAmount.indexOf('.') >= 0 ? this.minesAmount.substr(0, this.minesAmount.indexOf('.')) + '.' + this.minesAmount.substr((this.minesAmount.indexOf('.') + 1), 2).replace('.', '') : this.minesAmount;
            },
            minesIsCount(count) {
                return Number(this.minesCount) === count;
            },
            minesSetAmount(action) {
                let amount = Math.floor(this.minesAmount * 1000);

                if(action === '2x') {
                    amount = Math.floor(amount * 2);
                } else if(action === 'max') {
                    amount = this.authUser.user.balance <= 1000000 ? this.authUser.user.balance : 1000000;
                }

                this.minesAmount = parseFloat(Math.floor(amount / 10) / 100).toFixed(2);
            },
            minesSetCount(value) {
                this.minesCount = value;
            },
            minesBetButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                const amount = Math.floor(this.minesAmount * 1000);
                const minesCount = Math.floor(this.minesCount);

                if(isNaN(amount) === true || amount <= 0) {
                    this.notificationShow({type: 'error', message: 'Your entered bet amount is invalid.'});
                    return;
                }

                if(isNaN(minesCount) === true || minesCount < 1 || minesCount > 24) {
                    this.notificationShow({type: 'error', message: 'Your entered mines count is invalid.'});
                    return;
                }

                const data = { amount: amount, minesCount: minesCount };
                this.minesSendBetSocket(data);
            },
            minesRevealButton() {
                let tile = Math.floor(Math.random() * (24 - this.minesGame.revealed.length));

                while(true) { 
                    if(this.minesGame.revealed.some((element) => element.tile === tile) === true) { tile = tile + 1; } 
                    else { break; }
                }

                const data = { tile: tile };
                this.minesSendRevealSocket(data);
            },
            minesCashoutButton() {
                const data = {};
                this.minesSendCashoutSocket(data);
            },
            minesFairButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                this.modalsSetShow('FairSeed')
            },
            minesMuteButton() {
                if(this.soundMines === 1) {
                    this.soundSetMines(0);
                } else {
                    this.soundSetMines(1);
                }
            },
            minesFactorialNumber(number) {
                let value = number;
                for (let i = number; i > 1; i--) {
                    value = value * (i - 1);
                }
                return value;
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'soundMines',
                'authUser',
                'minesGame'
            ]),
            minesGetCashoutAmount() {
                let multiplier = 0;

                if(this.minesGame !== null && this.minesGame.revealed.length >= 1) {
                    const first = 25 === this.minesGame.revealed.length ? 1 : this.minesFactorialNumber(25) / (this.minesFactorialNumber(this.minesGame.revealed.length) * this.minesFactorialNumber(25 - this.minesGame.revealed.length));
                    const second = (25 - this.minesGame.minesCount) === this.minesGame.revealed.length ? 1 : this.minesFactorialNumber(25 - this.minesGame.minesCount) / (this.minesFactorialNumber(this.minesGame.revealed.length) * this.minesFactorialNumber((25 - this.minesGame.minesCount) - this.minesGame.revealed.length));

                    multiplier = 0.95 * (first / second);
                    multiplier = multiplier < 1 ? 1.01 : multiplier;
                    multiplier = Math.round(multiplier * 100) / 100;
                }

                return Math.floor(this.minesGame.amount * multiplier);
            }
        }
    }
</script>

<style scoped>
    .mines-controls {
        width: 270px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px 15px;
        border-radius: 15px;
        background: #051f33;
        border: 1px solid rgba(20, 68, 104, 0.35);
    }

    .mines-controls .controls-top {
        width: 100%;
    }

    .mines-controls .top-amount {
        width: 100%;
        height: 50px;
        position: relative;
        padding: 1px;
    }

    .mines-controls .top-amount::before {
        content: '';
        width: 100%;
        height: 50px;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .mines-controls .top-amount input {
        width: 100%;
        height: 100%;
        padding: 0 100px 0 43px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background-color: #062137;
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .mines-controls .top-amount input::placeholder {
        color: #5e768e;
    }

    .mines-controls .top-amount img {
        width: 19px;
        height: 19px;
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translate(0, -50%);
    }

    .mines-controls .amount-buttons {
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translate(0, -50%);
    }

    .mines-controls .amount-buttons button {
        width: 36px;
        height: 27px;
        margin-right: 5px;
        transition: all .2s;
    }

    .amount-buttons button:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .amount-buttons button:active {
        transition-duration: .2s;
        scale: .9;
    }

    .mines-controls .amount-buttons button:last-of-type {
        margin-right: 0;
    }

    .mines-controls .amount-buttons button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .mines-controls .top-slider {
        width: 100%;
        margin-top: 15px;
    }

    .mines-controls .top-slider input {
        width: 100%;
        height: 15px;
        position: relative;
        -webkit-appearance: none;
        -moz-apperance: none;
        background-color: transparent;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .mines-controls .top-slider input::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #051824;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .mines-controls .top-slider input::-webkit-slider-thumb {
        width: 25px;
        height: 19px;
        -webkit-appearance: none;
        appearance: none;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(3px 0, calc(100% - 3px) 0, 100% 25%, 100% 75%, calc(100% - 3px) 100%, 3px 100%, 0 75%, 0 25%);
        cursor: pointer;
   }

   .mines-controls .top-slider input::-moz-range-thumb {
       width: 25px;
       height: 19px;
       background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
       clip-path: polygon(3px 0, calc(100% - 3px) 0, 100% 25%, 100% 75%, calc(100% - 3px) 100%, 3px 100%, 0 75%, 0 25%);
       cursor: pointer;
   }

    .mines-controls .top-mines {
        width: 100%;
        margin-top: 15px;
    }

    .mines-controls .mines-title {
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
    }

    .mines-controls .mines-content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
    }

    .mines-controls .mines-content button {
        width: calc(20% - 4.8px);
        height: 40px;
        position: relative;
        padding: 1px;
        filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.15));
        z-index: 1;
    }

    .mines-controls .mines-content button::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #07253b;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .mines-controls .mines-content button.button-active::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e0a3 100%);
    }

    .mines-controls .mines-content button.button-active::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-color: #07253b;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .mines-controls .mines-content button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
        background-color: #07253b;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .mines-controls .mines-content button.button-active .button-inner {
        color: #00fff2;
        background: radial-gradient(81.75% 81.75% at 50% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(256.23deg, rgba(0, 255, 194, 0.05) 0%, rgba(0, 170, 109, 0.05) 100%);
    }

    .mines-controls .content-input {
        width: calc(20% - 4.8px);
        height: 40px;
        position: relative;
        padding: 1px;
    }

    .mines-controls .content-input::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .mines-controls .content-input input {
        width: 100%;
        height: 100%;
        padding: 0 5px;
        text-align: center;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background-color: #07253b;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    } 
    
    .mines-controls .content-input input::placeholder {
        color: #5e768e;
    }

    .mines-controls button.button-bet,
    .mines-controls button.button-cashout,
    .mines-controls button.button-auto {
        width: 100%;
        height: 44px;
        position: relative;
        z-index: 1;
    }
    .button-bet {
        transition: all .2s;
    }
    .button-bet:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .button-bet:active {
        transition-duration: .2s;
        scale: .9;
    }
    .mines-controls button.button-bet,
    .mines-controls button.button-cashout {
        margin-top: 25px;
        padding: 1px;
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15)) drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .mines-controls button.button-auto {
        margin-top: 13px;
        filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1));
    }

    .mines-controls button.button-bet::before,
    .mines-controls button.button-cashout::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 170, 109, 0) 0%, #00ffc2 100%);
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .mines-controls button.button-cashout::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-color: #07253b;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .mines-controls button.button-bet .button-inner,
    .mines-controls button.button-cashout .button-inner,
    .mines-controls button.button-auto .button-inner {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .mines-controls button.button-bet .button-inner {
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
    }

    .mines-controls button.button-cashout .button-inner {
        background: linear-gradient(255deg, rgba(0, 255, 194, 0.35) -20%, rgba(0, 170, 109, 0.35) 100%);
    }

    .mines-controls button.button-auto .button-inner {
        font-size: 14px;
        font-weight: 700;
        color: #bbbfd0;
        background: #214059;
        transition: color 0.3s ease;
    }

    .mines-controls button.button-auto:enabled:hover .button-inner {
        color: #ffffff;
    }

    .mines-controls button.button-bet .button-loading.fade-leave-active,
    .mines-controls button.button-cashout .button-loading.fade-leave-active {
        transition: opacity 0.1s;
    }

    .mines-controls button.button-bet .button-loading.fade-leave-to,
    .mines-controls button.button-cashout .button-loading.fade-leave-to {
        opacity: 0;
    }

    .mines-controls button.button-bet .inner-content.fade-enter-active,
    .mines-controls button.button-cashout .inner-content.fade-enter-active {
        transition: opacity 0.1s;
    }

    .mines-controls button.button-bet .inner-content.fade-enter,
    .mines-controls button.button-cashout .inner-content.fade-enter {
        opacity: 0;
    }

    .mines-controls button.button-bet .inner-content,
    .mines-controls button.button-cashout .inner-content {
        display: flex;
        align-items: center;
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
    }

    .mines-controls button.button-cashout .content-amount {
        display: flex;
        align-items: center;
        margin-left: 11px;
    }

    .mines-controls button.button-cashout .content-amount img {
        width: 13px;
        height: 13px;
        margin-right: 6px;
    }

    .mines-controls button.button-cashout .amount-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .mines-controls button.button-cashout .amount-value span {
        font-size: 13px;
        font-weight: 800;
        color: #ffffff;
    }

    .mines-controls .controls-info {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .mines-controls .controls-info button {
        width: calc(50% - 6px);
        height: 32px;
        filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1));
    }

    .mines-controls .controls-info button:first-of-type {
        margin-right: 12px;
    }

    .mines-controls .controls-info button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: #bbbfd0;
        background: #214059;
        transition: color 0.3s ease;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .mines-controls .controls-info button .button-inner:hover {       
        background: #345c7c;
        transition: all .2s;
    }

    .mines-controls .controls-info button:hover .button-inner {
        color: #ffffff;
    }

    .mines-controls .controls-info button .button-inner svg {
        margin-right: 6px;
        fill: #bbbfd0;
        transition: fill 0.3s ease;
    }

    .mines-controls .controls-info button:hover .button-inner svg {
        fill: #ffffff;
    }

    @media only screen and (max-width: 850px) {

        .mines-controls {
            width: 100%;
            margin-top: 8px;
        }

        .mines-controls .controls-info {
            margin-top: 18px;
        }

    }
</style>