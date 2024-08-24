<template>
    <div class="crash-controls">
        <div class="controls-mode">
            <button v-on:click="crashSetMode('manual')" v-bind:class="{ 'button-active': crashMode === 'manual' }">
                <div class="button-inner">
                    <span>MANUAL</span>
                </div>
            </button>
            <button v-on:click="crashSetMode('auto')" v-bind:class="{ 'button-active': crashMode === 'auto' }">
                <div class="button-inner">
                    <span>AUTO</span>
                </div>
            </button>
        </div>
        <div class="controls-amount">
            <input v-model="crashAmount" v-on:input="crashValidateInput" v-on:change="crashFormatInput" type="text" placeholder="BET AMOUNT" v-bind:disabled="crashAutoRunning === true" />
            <img src="@/assets/img/icons/coin.svg" alt="icon" />
            <div class="cashout-buttons">
                <button v-on:click="crashSetInput('crashAmount', '2x')" v-bind:disabled="crashAutoRunning === true">
                    <div class="button-inner">2x</div>
                </button>
                <button v-on:click="crashSetInput('crashAmount', 'max')" class="button-max" v-bind:disabled="crashAutoRunning === true">
                    <div class="button-inner">MAX</div>
                </button>
            </div>
        </div>
        <div class="controls-cashout">
            <input v-model="crashAutoCashout" type="text" placeholder="AUTO CASHOUT" v-bind:disabled="crashAutoRunning === true" />
            <div class="cashout-buttons">
                <button v-on:click="crashSetInput('crashAutoCashout', '2x')" v-bind:disabled="crashAutoRunning === true">
                    <div class="button-inner">2x</div>
                </button>
                <button v-on:click="crashSetInput('crashAutoCashout', '10x')" v-bind:disabled="crashAutoRunning === true">
                    <div class="button-inner">10x</div>
                </button>
            </div>
        </div>
        <div v-if="crashMode === 'manual'" class="controls-manual">
            <button v-if="
                authUser.user !== null &&
                crashGame !== null &&
                crashGame.state !== 'completed' &&
                crashBets.some((element) => element.user._id === authUser.user._id && element.multiplier === undefined) === true
            " v-on:click="crashBetCashout" class="button-cashout" v-bind:disabled="crashGame.state !== 'rolling'">
                <div class="button-inner">{{ crashGame.state !== 'rolling' ? 'STARTING...' : 'CASHOUT' }}</div>
            </button>
            <button v-else v-on:click="crashBetButton" class="button-bet">
                <div class="button-inner">PLACE BET</div>
            </button>
            <div class="manual-bets">
                <div class="bets-header">
                    <div class="header-player">
                        <IconUsers />
                        PLAYERS
                        <span>{{crashGetPlayerCount}}</span>
                    </div>
                    <div class="header-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="amount-value">
                            <span>{{crashFormatValue(crashGetBetsAmount).split('.')[0]}}</span>.{{crashFormatValue(crashGetBetsAmount).split('.')[1]}}
                        </div>
                    </div>
                </div>
                <div class="bets-content">
                    <div class="content-list">

                        <CrashBetElement v-for="bet of crashBets" v-bind:key="bet._id" v-bind:bet="bet" />

                    </div>
                </div>
            </div>
        </div>
        <div v-else class="controls-auto">
            <div class="auto-adjust">
                <div class="adjust-win">
                    <input v-model="crashAutoPercentageWin" type="text" placeholder="% ON WIN" v-bind:disabled="crashAutoRunning === true" />
                </div>
                <div class="adjust-lose">
                    <input v-model="crashAutoPercentageLoss" type="text" placeholder="% ON LOSS" v-bind:disabled="crashAutoRunning === true" />
                </div>
            </div>
            <div class="auto-stop">
                <div class="stop-profit">
                    <input v-model="crashAutoStopProfit" type="text" placeholder="STOP ON PROFIT" v-bind:disabled="crashAutoRunning === true" />
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                </div>
                <div class="stop-lose">
                    <input v-model="crashAutoStopLoss" type="text" placeholder="STOP ON LOSS" v-bind:disabled="crashAutoRunning === true" />
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                </div>
            </div>
            <div class="auto-count">
                <input v-model="crashAutoBetCount" type="text" placeholder="TOTAL BETS" />
            </div>
            <button v-if="crashAutoRunning === true" v-on:click="crashAutoStopButton" class="button-stop">
                <div class="button-inner">STOP AUTO BETTING</div>
            </button>
            <button v-else v-on:click="crashAutoStartButton" class="button-auto">
                <div class="button-inner">START AUTO BETTING</div>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconUsers from '@/components/icons/IconUsers';
    import CrashBetElement from '@/components/crash/CrashBetElement';

    export default {
        name: 'CrashControls',
        components: {
            IconUsers,
            CrashBetElement
        },
        data() {
            return {
                crashMode: 'manual',
                crashAutoRunning: false,
                crashAutoInfinite: false,
                crashAmount: null,
                crashAutoCashout: null,
                crashAutoPercentageWin: null,
                crashAutoPercentageLoss: null,
                crashAutoStopProfit: null,
                crashAutoStopLoss: null,
                crashAutoBetCount: null,
                crashAutoTotalBet: 0,
                crashAutoTotalWon: 0
            }
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'crashSendBetSocket', 
                'crashSendCashoutSocket'
            ]),
            crashFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString();
            },
            crashSetMode(mode) {
                if(mode === 'manual') { this.crashAutoStopButton(); }
                this.crashMode = mode;
            },
            crashValidateInput() {
                this.crashAmount = this.crashAmount.replace(',', '.').replace(/[^\d.]/g, '');
                this.crashAmount = this.crashAmount.indexOf('.') >= 0 ? this.crashAmount.substr(0, this.crashAmount.indexOf('.')) + '.' + this.crashAmount.substr((this.crashAmount.indexOf('.') + 1), 2).replace('.', '') : this.crashAmount;
            },
            crashFormatInput() {
                this.crashAmount = Number(this.crashAmount).toFixed(2);
            },
            crashSetInput(value, action) {
                let amount = Math.floor(this[value] * 1000);

                if(action === '2x') {
                    amount = Math.floor(amount * 2);
                } else if(action === '10x') {
                    amount = Math.floor(amount * 10);
                } else if(action === 'max') {
                    amount = this.authUser.user.balance <= 1000000 ? this.authUser.user.balance : 1000000;
                }

                this[value] = parseFloat(Math.floor(amount / 10) / 100).toFixed(2);
            },
            crashAutoStartButton() {
                const percentageWin = Math.floor(this.crashAutoPercentageWin);
                const percentageLoss = Math.floor(this.crashAutoPercentageLoss);

                if(isNaN(percentageWin) === true || percentageWin < 0 || percentageWin > 100) {
                    this.notificationShow({ type: 'error', message: 'Your entered auto bet win percentage is invalid.' });
                    return;
                }

                if(isNaN(percentageLoss) === true || percentageLoss < 0 || percentageLoss > 100) {
                    this.notificationShow({ type: 'error', message: 'Your entered auto bet loss percentage is invalid.' });
                    return;
                }

                if(isNaN(Math.floor(this.crashAutoStopProfit)) === true) {
                    this.notificationShow({ type: 'error', message: 'Your entered auto bet profit stop is invalid.' });
                    return;
                }

                if(isNaN(Math.floor(this.crashAutoStopLoss)) === true) {
                    this.notificationShow({ type: 'error', message: 'Your entered auto bet loss stop is invalid.' });
                    return;
                }

                if(isNaN(Math.floor(this.crashAutoBetCount)) === true) {
                    this.notificationShow({ type: 'error', message: 'Your entered auto bet count is invalid.' });
                    return;
                }

                if(Math.floor(this.crashAutoBetCount) === 0) {
                    this.crashAutoInfinite = true;
                }

                this.crashAutoRunning = true;
                if(this.crashGame.state === 'created') { this.crashBetButton(); }
            },
            crashAutoStopButton() {
                this.crashAutoTotalBet = 0;
                this.crashAutoTotalWon = 0;
                this.crashAutoInfinite = false;
                this.crashAutoRunning = false;
            },
            crashBetButton() {
                if(this.socketSendLoading !== null) { return; }

                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    this.crashAutoStopButton();
                    return;
                }

                const amount = Math.floor(this.crashAmount * 1000);
                const autoCashout = this.crashAutoCashout === null || this.crashAutoCashout.trim() === '' ? 0 : Math.round(this.crashAutoCashout * 100);

                if(amount === null || isNaN(amount) === true || amount <= 0) {
                    this.notificationShow({type: 'error', message: 'Your entered bet amount is invalid.'});
                    this.crashAutoStopButton();
                    return;
                }

                if(autoCashout === null || isNaN(autoCashout) === true || ((autoCashout !== 0 || this.crashMode === 'auto') && autoCashout <= 100)) {
                    this.notificationShow({type: 'error', message: 'Your entered bet auto cashout is invalid.'});
                    this.crashAutoStopButton();
                    return;
                }

                const data = { amount: amount, autoCashout: autoCashout };
                this.crashSendBetSocket(data);
            },
            crashBetCashout() {
                if(this.socketSendLoading !== null) { return; }

                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                const data = {};
                this.crashSendCashoutSocket(data);
            }
        },
        computed: {
            ...mapGetters(['socketSendLoading', 'authUser', 'crashGame', 'crashBets']),
            crashGetPlayerCount() {
                let players = [];

                for(const bet of this.crashBets) {
                    if(players.includes(bet.user._id) === false) { players.push(bet.user._id); }
                }

                return players.length;
            },
            crashGetBetsAmount() {
                let amount = 0;

                for(const bet of this.crashBets) {
                    amount = Math.floor(amount + bet.amount)
                }

                return amount;
            }
        },
        watch: {
            'crashGame': {
                handler(data, dataOld) {
                    if(data.state === 'created' && this.crashAutoRunning === true) {
                        const profit = Math.floor(this.crashAutoTotalWon - this.crashAutoTotalBet);

                        if(
                            (this.crashAutoInfinite === true || this.crashAutoBetCount > 0) && 
                            (Math.floor(this.crashAutoStopProfit) === 0 || profit <= 0 || profit < this.crashAutoStopProfit) &&
                            (Math.floor(this.crashAutoStopLoss) === 0 || profit >= 0 || Math.abs(profit) < this.crashAutoStopLoss)
                        ) {
                            this.crashBetButton();
                        } else {
                            this.crashAutoStopButton();
                        }
                    }
                },
                deep: true
            },
            'crashBets': {
                deep: true,
                handler(data, dataOld) {
                    const index = data.findIndex((element) => element.user._id === this.authUser.user._id);
                    if(index !== -1 && this.crashMode === 'auto') {
                        const bet = data[index];

                        if(bet.payout !== undefined) {
                            this.crashAutoTotalWon = Math.floor(this.crashAutoTotalWon + bet.payout);
                        } else {
                            if(Math.floor(this.crashAutoBetCount) > 0) { this.crashAutoBetCount = this.crashAutoBetCount - 1; }
                            this.crashAutoTotalBet = Math.floor(this.crashAutoTotalBet + bet.amount);
                        } 
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .crash-controls {
        width: 275px;
        height: 510px;
        padding: 15px;
        border-radius: 15px;
        background-color: #051f33;
        border: 1px solid rgba(20, 68, 104, 0.35);
    }

    .crash-controls .controls-mode {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .crash-controls .controls-mode button {
        width: calc(50% - 7px);
        height: 45px;
        position: relative;
        filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
        transition: all 0.3s ease;
    }

    .controls-mode button:hover {
        transition-duration: .1s;   
        opacity: 0.8;
    }
    .controls-mode button:active {
        transition-duration: .2s;
        scale: .9;
    }

    .crash-controls .controls-mode button::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #214059;
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
    }

    .crash-controls .controls-mode button.button-active::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e0a3 100%);
    }

    .crash-controls .controls-mode button::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-color: #051f33;
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
    }

    .crash-controls .controls-mode button .button-inner {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 1px;
        left: 1px;
        background-color: #214059;
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
        z-index: 1;
    }

    .crash-controls .controls-mode button.button-active .button-inner {
        background: radial-gradient(135.81% 81.75% at 83.06% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, rgba(0, 255, 194, 0.05) -46.99%, rgba(0, 170, 109, 0.05) 100%);
    }

    .crash-controls .controls-mode button .button-inner span {
        font-size: 14px;
        font-weight: 700;
        color: #bbbfd0;
    }

    .crash-controls .controls-mode button.button-active .button-inner span  {
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .crash-controls .controls-amount,
    .crash-controls .controls-cashout {
        width: 100%;
        height: 51px;
        position: relative;
        margin-top: 20px;
    }

    .crash-controls .controls-amount::before,
    .crash-controls .controls-cashout::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .crash-controls .controls-amount input,
    .crash-controls .controls-cashout input {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        padding: 0 90px 0 15px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background-color: #07253b;
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .crash-controls .controls-amount input {
        padding: 0 90px 0 43px;
    }

    .crash-controls .controls-amount input::placeholder,
    .crash-controls .controls-cashout input::placeholder {
        color: #5e768e;
    }

    .crash-controls .amount-buttons,
    .crash-controls .cashout-buttons {
        position: absolute;
        display: flex;
        align-items: center;
        top: 50%;
        right: 15px;
        transform: translate(0, -50%);
    }

    .crash-controls .amount-buttons button,
    .crash-controls .cashout-buttons button {
        width: 35px;
        height: 27px;
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15)) drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
        transition: all .2s;
    }

    .cashout-buttons button:hover {
        transition-duration: .1s;   
        opacity: 0.8;
    }
    .cashout-buttons button:active {
        transition-duration: .2s;
        scale: .95;
    }

    .crash-controls .amount-buttons button:first-of-type,
    .crash-controls .cashout-buttons button:first-of-type {
        margin-right: 5px;
    }

    .crash-controls .amount-buttons button .button-inner,
    .crash-controls .cashout-buttons button .button-inner {
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

    .crash-controls .amount-buttons button.button-max .button-inner {
        font-size: 10px;
    }

    .crash-controls .controls-amount img {
        width: 19px;
        height: 19px;
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translate(0, -50%);
    }

    .crash-controls .controls-manual {
        width: 100%;
        margin-top: 20px;
    }

    .crash-controls .controls-manual button.button-cashout,
    .crash-controls .controls-manual button.button-bet {
        width: 100%;
        height: 50px;
        filter: drop-shadow(0px 4px 25px rgba(252, 163, 17, 0.15)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
        transition: all .2s;
    }

    .button-bet:hover {
        transition-duration: .1s;
        /* transform: translateY(-1px); */
        opacity: 0.8;
    }
    .button-bet:active {
        transition-duration: .1s;
        scale: .9;
    }
    .crash-controls .controls-manual button.button-bet {
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
    }

    .crash-controls .controls-manual button.button-cashout:disabled {
        cursor: not-allowed;
    }

    .crash-controls .controls-manual button.button-cashout .button-inner,
    .crash-controls .controls-manual button.button-bet .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #fca311 0%, #ffb703 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .crash-controls .controls-manual button.button-bet .button-inner {
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
    }

    .crash-controls .manual-bets {
        width: 100%;
        margin-top: 18px;
    }

    .crash-controls .bets-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(24, 72, 109, 0.5);
    }

    .crash-controls .header-player {
        display: flex;
        align-items: center;
        font-size: 10px;
        font-weight: 700;
        color: #7a93ac;
    }

    .crash-controls .header-player svg {
        width: 14px;
        height: 12px;
        margin-right: 8px;
        fill: #7a93ac;
    }

    .crash-controls .header-player svg path {
        fill: #7a93ac;
    }

    .crash-controls .header-player span {
        margin-left: 5px;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%), #ffffff;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .crash-controls .header-amount {
        display: flex;
        align-items: center;
    }

    .crash-controls .header-amount img {
        width: 12px;
        height: 12px;
        margin-right: 8px;
    }

    .crash-controls .amount-value {
        font-size: 8px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .crash-controls .amount-value span {
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
    }

    .crash-controls .bets-content {
        width: 100%;
        height: 167px;
        position: relative;
        margin-top: 10px;
    }

    .crash-controls .bets-content::before {
        content: '';
        width: 100%;
        height: 20px;
        position: absolute;
        bottom: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(5, 31, 51, 0) 0%, #051f33 100%);
        z-index: 1;
    }

    .crash-controls .content-list {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
        scroll-behavior: smooth;
    }

    .crash-controls .content-list::-webkit-scrollbar-track {
        background-color: transparent;
    }

    .crash-controls .content-list::-webkit-scrollbar {
        width: 0;
        height: 0;
    }

    .crash-controls .controls-auto {
        width: 100%;
        margin-top: 20px;
    }

    .crash-controls .auto-adjust,
    .crash-controls .auto-stop {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .crash-controls .auto-stop {
        margin-top: 20px;
    }

    .crash-controls .adjust-win,
    .crash-controls .adjust-lose,
    .crash-controls .stop-profit,
    .crash-controls .stop-lose,
    .crash-controls .auto-count {
        width: calc(50% - 3px);
        height: 51px;
        position: relative;
    }

    .crash-controls .auto-count {
        width: 100%;
        margin-top: 20px;
    }

    .crash-controls .adjust-win::before,
    .crash-controls .adjust-lose::before,
    .crash-controls .stop-profit::before,
    .crash-controls .stop-lose::before,
    .crash-controls .auto-count::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223A4e 100%);
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .crash-controls .adjust-win input,
    .crash-controls .adjust-lose input,
    .crash-controls .stop-profit input,
    .crash-controls .stop-lose input,
    .crash-controls .auto-count input {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        padding: 0 0 0 15px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background-color: #07253b;
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .crash-controls .stop-profit input,
    .crash-controls .stop-lose input {
        padding: 0 0 0 26px;
    }

    .crash-controls .adjust-win input::placeholder,
    .crash-controls .adjust-lose input::placeholder,
    .crash-controls .stop-profit input::placeholder,
    .crash-controls .stop-lose input::placeholder,
    .crash-controls .auto-count input::placeholder {
        font-size: 11px;
        color: #5e768e;
    }

    .crash-controls .stop-profit img,
    .crash-controls .stop-lose img {
        width: 11px;
        height: 11px;
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translate(0, -50%);
    }

    .crash-controls .controls-auto button.button-auto,
    .crash-controls .controls-auto button.button-stop {
        width: 100%;
        height: 50px;
        margin-top: 26px;
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
    }

    .crash-controls .controls-auto button.button-stop {
        filter: drop-shadow(0px 4px 25px rgba(252, 163, 17, 0.15)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
    }

    .crash-controls .controls-auto button.button-auto .button-inner,
    .crash-controls .controls-auto button.button-stop .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .crash-controls .controls-auto button.button-stop .button-inner {
        background: linear-gradient(255deg, #fca311 0%, #ffb703 100%);
    }

    @media only screen and (max-width: 950px) {

        .crash-controls {
            width: 100%;
            height: auto;
            margin-top: 15px;
        }

    }
</style>
