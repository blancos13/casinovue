<template>
    <div class="blackjack-controls-bet">
        PLACE YOUR BETS
        <div class="bet-timer">
            STARTING IN <span>{{parseFloat(blackjackTimer).toFixed(2)}}s</span>
        </div>
        <div class="bet-container">
            <div class="container-amount">
                <button v-on:click="$parent.blackjackSetChip(0)" class="button-red" v-bind:class="{ 'button-active': blackjackChip === 0 }">{{ table.game.type === 'standard' ? '0.1' : '50'}}</button>
                <button v-on:click="$parent.blackjackSetChip(1)" class="button-purple" v-bind:class="{ 'button-active': blackjackChip === 1 }">{{ table.game.type === 'standard' ? '1' : '100'}}</button>
                <button v-on:click="$parent.blackjackSetChip(2)" class="button-blue" v-bind:class="{ 'button-active': blackjackChip === 2 }">{{ table.game.type === 'standard' ? '10' : '200'}}</button>
                <button v-on:click="$parent.blackjackSetChip(3)" class="button-orange" v-bind:class="{ 'button-active': blackjackChip === 3 }">{{ table.game.type === 'standard' ? '100' : '500'}}</button>
            </div>
            <div class="container-buttons">
                <button v-on:click="blackjackClearButton()" class="button-clear" v-bind:disabled="socketSendLoading !== null">
                    <div class="button-inner">CLEAR</div>
                </button>
                <button v-on:click="blackjackRedoButton()" class="button-redo" v-bind:disabled="socketSendLoading !== null">
                    <div class="button-inner">REDO BET</div>
                </button>
                <button v-on:click="blackjackMaxButton()" class="button-max" v-bind:disabled="socketSendLoading !== null">
                    <div class="button-inner">MAX BET</div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'BlackjackControlsBet',
        props: [
            'table', 
            'blackjackChip'
        ],
        data() {
            return {
                blackjackTimerRepeater: null,
                blackjackTimer: 10
            }
        },
        methods: {
            ...mapActions([
                'blackjackSendClearSocket',
                'blackjackSendBetSocket'
            ]),
            blackjackStartTimer() {
                const timeEnding = new Date(this.table.game.updatedAt).getTime() + (1000 * 10);
                this.blackjackTimer = (timeEnding - (new Date().getTime() + this.generalTimeDiff)) / 1000;

                if(this.blackjackTimer <= 0) {
                    this.blackjackTimer = 0;
                } else {
                    this.blackjackTimerRepeater = requestAnimationFrame(this.blackjackStartTimer);
                }
            },
            blackjackClearButton() {
                const data = { table: this.table.table };
                this.blackjackSendClearSocket(data);
            },
            blackjackRedoButton() {
                const data = { table: this.table.table, bets: this.blackjackRecent };
                this.blackjackSendBetSocket(data);
            },
            blackjackMaxButton() {
                let bets = [];

                for(const player of this.table.players.filter((element) => element.user._id === this.authUser.user._id)) {
                    const amountCurrent = player.bet !== null ? player.bet.amount.main + player.bet.amount.sideLeft + player.bet.amount.sideRight : 0;
                    const amountBet = Math.floor(((this.table.game.type === 'standard' ? 50000 : 100000) * 1000) - amountCurrent);
                    if(amountBet >= 10) { bets.push({ seat: player.seat, amount: { main: amountBet, sideLeft: 0, sideRight: 0 } }); }
                }

                const data = { table: this.table.table, bets: bets };
                this.blackjackSendBetSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'generalTimeDiff',
                'authUser',
                'blackjackRecent'
            ])
        },
        watch: {
            'table': {
                handler(data, oldData) {
                    if(this.table.game.state === 'countdown' || (this.table.game.state === 'running' && this.table.playerPos !== null)) {
                        this.blackjackStartTimer();
                    }
                },
                deep: true
            }
        },
        beforeUnmount() {
            cancelAnimationFrame(this.blackjackTimerRepeater);
        },
        created() {
            if(this.table.game.state === 'countdown' || (this.table.game.state === 'running' && this.table.playerPos !== null)) {
                this.blackjackStartTimer();
            }
        }
    }
</script>

<style scoped>
    .blackjack-controls-bet {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 160px;
        /* font-family: 'Rubik'; */
        text-align: center;
        font-size: 34px;
        font-weight: 900;
        color: #ffffff;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        z-index: 1;
    }
    @media only screen and (max-width: 540px) {
        .blackjack-controls-bet {
            scale: 1.3;     
            margin-top: 130px;       
        }
    }

    .blackjack-controls-bet .bet-timer {
        display: flex;
        margin-top: 5px;
        font-size: 22px;
        font-weight: 600;
        color: #ffffff;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }

    .blackjack-controls-bet .bet-timer span {
        width: 72px;
        display: flex;
        margin-left: 5px;
        color: #ffd600;
    }

    .blackjack-controls-bet .bet-container {
        width: 400px;
        height: 140px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 10px;
        background-image: url('~@/assets/img/blackjack/action-chips.webp');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .blackjack-controls-bet .container-amount {
        width: 100%;
        height: 96px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .blackjack-controls-bet .container-amount button {
        width: 63px;
        height: 63px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 25px;
        border-radius: 50%;
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
        filter: drop-shadow(0px 4px 15px rgba(0, 0, 0, 0.75));
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        transition: opacity 0.3s ease;
        opacity: 0.4;
    }

    .blackjack-controls-bet .container-amount button:last-of-type {
        margin-right: 0;
    }

    .blackjack-controls-bet .container-amount button.button-active {
        opacity: 1;
    }

    .blackjack-controls-bet .container-amount button.button-red {
        background-image: url('~@/assets/img/blackjack/chip-red.png');
    }

    .blackjack-controls-bet .container-amount button.button-purple {
        background-image: url('~@/assets/img/blackjack/chip-purple.png');
    }

    .blackjack-controls-bet .container-amount button.button-blue {
        background-image: url('~@/assets/img/blackjack/chip-blue.png');
    }

    .blackjack-controls-bet .container-amount button.button-orange {
        background-image: url('~@/assets/img/blackjack/chip-orange.png');
    }

    .blackjack-controls-bet .container-buttons {
        display: flex;
        align-items: center;
    }

    .blackjack-controls-bet .container-buttons button {
        width: 104px;
        height: 31px;
    }

    .blackjack-controls-bet .container-buttons button.button-clear {
        width: 57px;
        margin-right: 10px;
    }

    .blackjack-controls-bet .container-buttons button.button-redo {
        width: 73px;
        margin-right: 10px;
    }

    .blackjack-controls-bet .container-buttons button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .blackjack-controls-bet .container-buttons button.button-clear .button-inner,
    .blackjack-controls-bet .container-buttons button.button-redo .button-inner {
        color: #bbbfd0;
        background: #214059;
        transition: color 0.3s ease;
    }

    .blackjack-controls-bet .container-buttons button.button-max .button-inner {
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 50%);
    }

    .blackjack-controls-bet .container-buttons button:hover.button-clear .button-inner,
    .blackjack-controls-bet .container-buttons button:hover.button-redo .button-inner {
        color: #ffffff;
    }
</style>
