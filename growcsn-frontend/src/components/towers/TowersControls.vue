<template>
    <div class="towers-controls">
        <div class="controls-mode">
            <button v-on:click="towersSetRisk('easy')" v-bind:class="{ 'button-active': towersRisk === 'easy' }" v-bind:disabled="towersGame !== null && towersGame.state !== 'completed'">
                <div class="button-inner">EASY</div>
            </button>
            <button v-on:click="towersSetRisk('medium')" v-bind:class="{ 'button-active': towersRisk === 'medium' }" v-bind:disabled="towersGame !== null && towersGame.state !== 'completed'">
                <div class="button-inner">MEDIUM</div>
            </button>
            <button v-on:click="towersSetRisk('hard')" v-bind:class="{ 'button-active': towersRisk === 'hard' }" v-bind:disabled="towersGame !== null && towersGame.state !== 'completed'">
                <div class="button-inner">HARD</div>
            </button>
        </div>
        <div class="controls-amount">
            <input v-model="towersAmount" v-on:input="towersValidateInput" type="text" placeholder="BET AMOUNT" v-bind:disabled="towersGame !== null && towersGame.state !== 'completed'" />
            <img src="@/assets/img/icons/coin.svg" alt="icon" />
            <div class="amount-buttons">
                <button v-on:click="towersSetAmount('2x')" v-bind:disabled="towersGame !== null && towersGame.state !== 'completed'">
                    <div class="button-inner">2x</div>
                </button>
                <button v-on:click="towersSetAmount('max')" v-bind:disabled="towersGame !== null && towersGame.state !== 'completed'">
                    <div class="button-inner">MAX</div>
                </button>
            </div>
        </div>
        <div class="controls-bottom">
            <div class="bottom-info">
                <button v-on:click="towersFairButton()">
                    <div class="button-inner">
                        <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0001 2.30199V3.8031H10.941C9.76198 3.80425 8.60479 3.48508 7.59306 2.87967L6.25388 2.07004C6.17599 2.02293 6.0867 1.99803 5.99567 1.99803C5.90465 1.99803 5.81535 2.02293 5.73747 2.07004L4.40266 2.8753C3.39067 3.48009 2.23365 3.79922 1.05471 3.79872H3.60219e-10V2.30199C-5.0177e-06 2.16926 0.0524184 2.04191 0.145859 1.94765C0.239299 1.85339 0.36619 1.79986 0.49891 1.7987H1.05909C2.32857 1.79901 3.574 1.45247 4.66087 0.796506L6.00005 0L7.33485 0.800882C8.42243 1.45521 9.6674 1.80162 10.9366 1.80308H11.5012C11.6328 1.80533 11.7584 1.85862 11.8515 1.9517C11.9446 2.04478 11.9979 2.17037 12.0001 2.30199Z" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.941 4.81404C9.58091 4.8134 8.2466 4.44276 7.08102 3.74182L6.00005 3.08536L4.91908 3.72869C3.75456 4.43362 2.42034 4.80878 1.05909 4.81404H0V6.12696C0.00306513 7.64623 0.438442 9.13326 1.25526 10.4143C2.07207 11.6953 3.23659 12.7174 4.61273 13.3612L6.00005 14.0045L7.37862 13.3612C8.75673 12.7191 9.92335 11.6976 10.7418 10.4164C11.5603 9.13521 11.9968 7.64729 12.0001 6.12696V4.81404H10.941ZM6.25388 9.19044C6.16095 9.27977 6.03705 9.32966 5.90815 9.32966C5.77924 9.32966 5.65534 9.27977 5.56241 9.19044L4.16196 7.78999L4.86656 7.08539L5.9169 8.13135L7.66746 6.38079L8.37206 7.08539L6.25388 9.19044Z" />
                        </svg>
                        FAIRNESS
                    </div>
                </button>
                <button v-on:click="towersMuteButton()">
                    <div class="button-inner">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5.99999C9 4.82334 8.32 3.80665 7.33334 3.31665V4.78999L8.97 6.42665C8.99 6.28665 9 6.14334 9 5.99999Z" />
                            <path d="M10.6667 6.00001C10.6667 6.62666 10.53 7.21666 10.3067 7.76001L11.3167 8.77001C11.75 7.94001 12 7.00001 12 6.00001C12 3.14666 10.0033 0.760007 7.33334 0.153351V1.53001C9.26 2.10335 10.6667 3.88666 10.6667 6.00001Z" />
                            <path d="M6 0.666656L4.60666 2.06L6 3.45334V0.666656Z" />
                            <path d="M0.85 0L0 0.85L3.15 4H0V8H2.66666L6 11.3333V6.85L8.83666 9.68666C8.39 10.03 7.88666 10.3067 7.33331 10.4733V11.85C8.24997 11.64 9.08666 11.22 9.78997 10.6433L11.15 12L12 11.15L6 5.15L0.85 0Z" />
                        </svg>
                        {{ soundTowers === 1 ? 'MUTE' : 'UNMUTE' }}
                    </div>
                </button>
            </div>
            <button v-if="towersGame === null || towersGame.state === 'completed'" v-on:click="towersBetButton()" class="button-bet" v-bind:class="{ 'button-lose': towersGame !== null && towersGame.state === 'completed' && towersGame.payout <= 0 }" v-bind:disabled="socketSendLoading !== null">
                <div class="button-inner">
                    <transition name="fade" mode="out-in">
                        <ButtonLoading v-if="socketSendLoading === 'TowersBet'" />
                        <div v-else class="inner-content">
                            <IconSkull v-if="towersGame !== null && towersGame.state === 'completed' && towersGame.payout <= 0" />
                            <span>{{ towersGame !== null && towersGame.state === 'completed' && towersGame.payout <= 0 ? 'PLAY AGAIN' : 'PLACE BET' }}</span>
                        </div>
                    </transition>
                </div>
            </button>
            <button v-else v-on:click="towersCashoutButton()" class="button-cashout" v-bind:disabled="socketSendLoading !== null">
                <div class="button-inner">
                    <transition name="fade" mode="out-in">
                        <ButtonLoading v-if="socketSendLoading === 'TowersCashout'" />
                        <div v-else class="inner-content">
                            CASHOUT
                            <div class="content-amount">
                                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                                <div class="amount-value">
                                    <span>{{ towersFormatValue(towersGetCashoutAmount).split('.')[0] }}</span>.{{ towersFormatValue(towersGetCashoutAmount).split('.')[1] }}
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import ButtonLoading from '@/components/ButtonLoading';
    import IconSkull from '@/components/icons/IconSkull';

    export default {
        name: 'TowersControls',
        components: {
            ButtonLoading,
            IconSkull
        },
        data() {
            return {
                towersAmount: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'soundSetTowers',
                'modalsSetShow',
                'towersSetRisk',
                'towersSendBetSocket',
                'towersSendCashoutSocket'
            ]),
            towersFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            towersValidateInput() {
                this.towersAmount = this.towersAmount.replace(',', '.').replace(/[^\d.]/g, '');
                this.towersAmount = this.towersAmount.indexOf('.') >= 0 ? this.towersAmount.substr(0, this.towersAmount.indexOf('.')) + '.' + this.towersAmount.substr((this.towersAmount.indexOf('.') + 1), 2).replace('.', '') : this.towersAmount;
            },
            towersSetAmount(action) {
                let amount = Math.floor(this.towersAmount * 1000);

                if(action === '2x') {
                    amount = Math.floor(amount * 2);
                } else if(action === 'max') {
                    amount = this.authUser.user.balance <= 1000000 ? this.authUser.user.balance : 1000000;
                }

                this.towersAmount = parseFloat(Math.floor(amount / 10) / 100).toFixed(2);
            },
            towersBetButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                const amount = Math.floor(this.towersAmount * 1000);

                if(isNaN(amount) === true || amount <= 0) {
                    this.notificationShow({type: 'error', message: 'Your entered bet amount is invalid.'});
                    return;
                }

                const data = { amount: amount, risk: this.towersRisk };
                this.towersSendBetSocket(data);
            },
            towersCashoutButton() {
                const data = {};
                this.towersSendCashoutSocket(data);
            },
            towersFairButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                this.modalsSetShow('FairSeed')
            },
            towersMuteButton() {
                if(this.soundTowers === 1) {
                    this.soundSetTowers(0);
                } else {
                    this.soundSetTowers(1);
                }
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'soundTowers',
                'authUser',
                'towersRisk',
                'towersGame'
            ]),
            towersGetCashoutAmount() {
                const multiplierPerRow = this.towersGame.risk === 'easy' ? 1.425 : this.towersGame.risk === 'medium' ? 1.90 : 2.85;
                return Math.floor(this.towersGame.amount * Math.pow(multiplierPerRow, this.towersGame.revealed.length));
            }
        }
    }
</script>

<style scoped>
    .towers-controls {
        width: 100%;
        margin-top: 15px;
        padding: 0 30px;
    }

    .towers-controls .controls-mode {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.04);
    }

    .towers-controls .controls-mode button {
        width: calc(33.33% - 13.33px);
        height: 40px;
        position: relative;
        padding: 1px;
        filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.15));
        z-index: 1;
    }

    .towers-controls .controls-mode button::before {
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

    .controls-mode button:hover {
        background-color: #0f3957;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
        transition: all .2s;
    }

    .towers-controls .controls-mode button.button-active::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e0a3 100%);
    }

    .towers-controls .controls-mode button.button-active::after {
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

    .towers-controls .controls-mode button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        color: #5e768e;
        background-color: #07253b;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .towers-controls .controls-mode button.button-active .button-inner {
        color: #00fff2;
        background: radial-gradient(81.75% 81.75% at 50% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(256.23deg, rgba(0, 255, 194, 0.05) 0%, rgba(0, 170, 109, 0.05) 100%);
    }

    .towers-controls .controls-amount {
        width: 100%;
        height: 50px;
        position: relative;
        margin-top: 15px;
        padding: 1px;
    }

    .towers-controls .controls-amount::before {
        content: '';
        width: 100%;
        height: 50px;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .towers-controls .controls-amount input {
        width: 100%;
        height: 100%;
        padding: 0 100px 0 43px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background-color: #062137;
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .towers-controls .controls-amount input::placeholder {
        color: #5e768e;
    }

    .towers-controls .controls-amount img {
        width: 19px;
        height: 19px;
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translate(0, -50%);
    }

    .towers-controls .amount-buttons {
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translate(0, -50%);
    }

    .towers-controls .amount-buttons button {
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

    .towers-controls .amount-buttons button:last-of-type {
        margin-right: 0;
    }

    .towers-controls .amount-buttons button .button-inner {
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

    .towers-controls .controls-bottom {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
    }

    .towers-controls .bottom-info {
        display: flex;
    }

    .towers-controls .bottom-info button {
        width: 110px;
        height: 32px;
        filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1));
    }

    .towers-controls .bottom-info button:first-of-type {
        margin-right: 12px;
    }

    .towers-controls .bottom-info button .button-inner {
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

    .towers-controls .bottom-info button:hover .button-inner {
        color: #ffffff;
    }

    .towers-controls .bottom-info button .button-inner svg {
        margin-right: 6px;
        fill: #bbbfd0;
        transition: fill 0.3s ease;
    }

    .towers-controls .bottom-info button:hover .button-inner svg {
        fill: #ffffff;
    }

    .towers-controls button.button-bet,
    .towers-controls button.button-cashout {
        width: calc(100% - 257px);
        height: 36px;
        position: relative;
        padding: 1px;
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15)) drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
        z-index: 1;
    }
    .towers-controls button.button-bet {
        transition: all .2s;
    }

    .towers-controls button.button-bet:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .towers-controls button.button-bet:active {
        transition-duration: .2s;
        scale: .9;
    }
    .towers-controls button.button-bet::before,
    .towers-controls button.button-cashout::before {
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

    .towers-controls button.button-bet.button-lose::before {
        background: linear-gradient(180deg, rgba(0, 170, 109, 0) 0%, #f55046 100%);
    }

    .towers-controls button.button-bet.button-lose::after,
    .towers-controls button.button-cashout::after {
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

    .towers-controls button.button-bet .button-inner,
    .towers-controls button.button-cashout .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .towers-controls button.button-bet .button-inner {
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
    }

    .towers-controls button.button-bet.button-lose .button-inner {
        background: 
            linear-gradient(0deg, rgba(245, 80, 70, 0.25), rgba(245, 80, 70, 0.25)), 
            linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), 
            linear-gradient(255deg, #07263d 0%, #07243a 100%);
    }

    .towers-controls button.button-cashout .button-inner {
        background: linear-gradient(255deg, rgba(0, 255, 194, 0.35) -20%, rgba(0, 170, 109, 0.35) 100%);
    }

    .towers-controls button.button-bet .button-loading.fade-leave-active,
    .towers-controls button.button-cashout .button-loading.fade-leave-active {
        transition: opacity 0.1s;
    }

    .towers-controls button.button-bet .button-loading.fade-leave-to,
    .towers-controls button.button-cashout .button-loading.fade-leave-to {
        opacity: 0;
    }

    .towers-controls button.button-bet .inner-content.fade-enter-active,
    .towers-controls button.button-cashout .inner-content.fade-enter-active {
        transition: opacity 0.1s;
    }

    .towers-controls button.button-bet .inner-content.fade-enter,
    .towers-controls button.button-cashout .inner-content.fade-enter {
        opacity: 0;
    }

    .towers-controls button.button-bet .inner-content,
    .towers-controls button.button-cashout .inner-content {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .towers-controls button.button-bet.button-lose .inner-content {
        color: #F55046;
        text-shadow: 0px 0px 32px rgba(238, 29, 17, 0.28);
    }

    .towers-controls button.button-bet.button-lose .inner-content svg {
        width: 12px;
        margin-right: 8px;
    }

    .towers-controls button.button-cashout .content-amount {
        display: flex;
        align-items: center;
        margin-left: 9px;
    }

    .towers-controls button.button-cashout .content-amount img {
        width: 13px;
        height: 13px;
        margin-right: 5px;
    }

    .towers-controls button.button-cashout .amount-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .towers-controls button.button-cashout .amount-value span {
        font-size: 13px;
        font-weight: 800;
        color: #ffffff;
    } 
    
    
    @media only screen and (max-width: 550px) {

        .towers-controls {
            padding: 0 15px;
        }

        .towers-controls .controls-bottom {
            flex-direction: column-reverse;
            margin-top: 16px;
        }

        .towers-controls .bottom-info {
            width: 100%;
            margin-top: 12px;
        }

        .towers-controls .bottom-info button {
            width: calc(50% - 6px);
        }

        .towers-controls button.button-bet,
        .towers-controls button.button-cashout {
            width: 100%;
        }

    }
</style>