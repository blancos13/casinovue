<template>
    <div class="unbox-controls">
        <div class="controls-count">
            <button v-on:click="unboxSetCount(1)" v-bind:class="{ 'button-active': unboxCount === 1 }" v-bind:disabled="socketSendLoading !== null || unboxRunning === true">
                <div class="button-inner">1</div>
            </button>
            <button v-on:click="unboxSetCount(2)" v-bind:class="{ 'button-active': unboxCount === 2 }" v-bind:disabled="socketSendLoading !== null || unboxRunning === true">
                <div class="button-inner">2</div>
            </button>
            <button v-on:click="unboxSetCount(3)" v-bind:class="{ 'button-active': unboxCount === 3 }" v-bind:disabled="socketSendLoading !== null || unboxRunning === true">
                <div class="button-inner">3</div>
            </button>
            <button v-on:click="unboxSetCount(4)" v-bind:class="{ 'button-active': unboxCount === 4 }" v-bind:disabled="socketSendLoading !== null || unboxRunning === true">
                <div class="button-inner">4</div>
            </button>
        </div>
        <div class="controls-bet">
            <button v-on:click="unboxBetButton()" class="button-bet" v-bind:disabled="socketSendLoading !== null || unboxRunning === true">
                <div class="button-inner">
                    OPEN CASE
                    <div class="inner-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="amount-value">
                            <span>{{ unboxFormatValue(unboxBoxData.box.amount * unboxCount).split('.')[0] }}</span>.{{ unboxFormatValue(unboxBoxData.box.amount * unboxCount).split('.')[1] }}
                        </div>
                    </div>
                </div>
            </button>
            <button v-on:click="unboxDemoButton()" class="button-demo" v-bind:disabled="socketSendLoading !== null || unboxRunning === true">
                <div class="button-inner">DEMO SPIN</div>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'UnboxControls',
        methods: {
            ...mapActions([
                'notificationShow',
                'unboxSetCount',
                'unboxSetRunnning',
                'unboxSetGames',
                'unboxSendBetSocket'
            ]),
            unboxFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            unboxBetButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                const data = { boxId: this.unboxBoxData.box._id, unboxCount: this.unboxCount };
                this.unboxSendBetSocket(data);
            },
            unboxDemoButton() {
                let games = [];

                for(let i = 0; i < this.unboxCount; i++) {
                    games.push({ demo: true, outcome: Math.floor(Math.random() * (100000 - 1 + 1)) + 1, updatedAt: new Date() });
                }

                this.unboxSetRunnning(true);
                this.unboxSetGames(games);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'authUser',
                'unboxCount',
                'unboxRunning',
                'unboxBoxData'
            ])
        }
    }
</script>

<style scoped>
    .unbox-controls {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 25px;
    }

    .unbox-controls .controls-count,
    .unbox-controls .controls-bet {
        display: flex;
        align-items: center;
    }

    .unbox-controls .controls-count button {
        width: 48px;
        height: 44px;
        position: relative;
        margin-right: 6px;
        padding: 1px;
        filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.15));
        z-index: 1;
    }

    .unbox-controls .controls-count button:last-child {
        margin-right: 0;
    }

    .unbox-controls .controls-count button::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #07253b;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .unbox-controls .controls-count button.button-active::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e0a3 100%);
    }

    .unbox-controls .controls-count button.button-active::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-color: #07253b;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .unbox-controls .controls-count button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
        color: #5e768e;
        background-color: #07253b;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .unbox-controls .controls-count button.button-active .button-inner {
        color: #00fff2;
        background: radial-gradient(81.75% 81.75% at 50% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(256.23deg, rgba(0, 255, 194, 0.05) 0%, rgba(0, 170, 109, 0.05) 100%);
    }

    .unbox-controls .controls-bet button.button-bet {
        width: 240px;
        height: 45px;
        position: relative;
        margin-right: 12px;
        padding: 1px;
        transition: all .2s;
    }  

    .unbox-controls .controls-bet button.button-bet:hover {
        transition-duration: .2s;
        opacity: .8;
    }
    .unbox-controls .controls-bet button.button-bet:active {
        transition-duration: .2s;
        scale: .9;
    }
    .unbox-controls .controls-bet button.button-bet:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 170, 109, 0) 0%, #00ffc2 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .unbox-controls .controls-bet button.button-bet .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);    
    }
    .unbox-controls .controls-bet button.button-bet .inner-amount {
        display: flex;
        align-items: center;
        margin-left: 8px;
    }

    .unbox-controls .controls-bet button.button-bet .inner-amount img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
    }

    .unbox-controls .controls-bet button.button-bet .amount-value {
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.75);
    }

    .unbox-controls .controls-bet button.button-bet .amount-value span {
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
    }

    .unbox-controls .controls-bet button.button-demo {
        width: 107px;
        height: 45px;
        transition: all .2s;
    }
    .unbox-controls .controls-bet button.button-demo:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .unbox-controls .controls-bet button.button-demo:active {
        transition-duration: .2s;
        scale: .9;
    }

    .unbox-controls .controls-bet button.button-demo .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #bbbfd0;
        background: #214059;
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
        transition: color 0.3s ease;
    }

    .unbox-controls .controls-bet button.button-demo:hover .button-inner {
        color: #ffffff;
    }

    @media only screen and (max-width: 650px) {

        .unbox-controls {
            flex-direction: column;
        }

        .unbox-controls .controls-bet {
            margin-top: 15px;
        }

    }
</style>