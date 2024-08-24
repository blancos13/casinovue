<template>
    <div class="roll-game">
        <div class="game-timer">
            <div class="timer-text">{{rollText}}</div>
            <div class="timer-progress" v-bind:style="{ 'width': (100 / 13) * rollTimer + '%' }"></div>
        </div>
        <div class="game-spinner">
            <div class="spinner-selector"></div>
            <div class="spinner-inner">

                <div class="inner-reel" v-bind:style="rollReelStyle">

                    <RollCard v-for="(multiplier, index) in rollGetMultipliers" v-bind:key="index" v-bind:multiplier="multiplier" />

                </div>

            </div>
        </div>
        <div class="game-win">
            <transition name="fade-slide" mode="out-in">
                <RollGameWin v-if="rollWin === true && rollGetWinAmount > 0" v-bind:winAmount="rollGetWinAmount" v-bind:multiplier="rollGame.outcome" />
            </transition>
        </div>
    </div>
</template>

<script>
    import CryptoJS from 'crypto-js';
    import { mapGetters } from 'vuex';
    import RollCard from '@/components/roll/RollCard';
    import RollGameWin from '@/components/roll/RollGameWin';

    export default {
        name: 'RollGame',
        components: {
            RollCard,
            RollGameWin
        },
        data() {
            return {
                rollTimerRepeater: null,
                rollTimer: 0,
                rollText: 'LOADING...',
                rollReelStyle: { transform: 'translateX(0px)', transition: 'none' },
                rollWin: false
            }
        },
        methods: {
            rollIsHashDivisible(combined, mod) {
                let val = 0;

                let o = combined.length % 4;
                for (let i = o > 0 ? o - 4 : 0; i < combined.length; i += 4) {
                    val = ((val << 16) + parseInt(combined.substring(i, i + 4), 16)) % mod;
                }

                return val === 0;
            },
            rollStartTimer() {
                const timeEnding = new Date(this.rollGame.createdAt).getTime() + (1000 * 13);
                this.rollTimer = (timeEnding - (new Date().getTime() + this.generalTimeDiff)) / 1000;

                this.rollText = 'ROLLING IN ' + (this.rollTimer).toFixed(2) + 's';

                if(this.rollTimer <= 0) {
                    this.rollTimer = 0;
                    this.rollText = 'ROLLING...';
                } else {
                    this.rollTimerRepeater = requestAnimationFrame(this.rollStartTimer);
                }
            }
        },
        computed: {
            ...mapGetters([
                'generalTimeDiff', 
                'authUser', 
                'rollGame', 
                'rollBets', 
                'rollHistory'
            ]),
            rollGetMultipliers() {
                let multipliers = [];

                if(this.rollGame !== null) {
                    for(let row = 0; row < 3; row++) {

                        for(let card = 0; card < 20; card++) {
                            if(row === 0 && card === 9) {
                                multipliers.push(this.rollHistory[0].outcome / 100);
                            } else if((this.rollGame.state === 'rolling' || this.rollGame.state === 'completed') && row === 2 && card === 9) {
                                multipliers.push(this.rollGame.outcome / 100);
                            } else {
                                const gameId = row === 0 ? this.rollHistory[0]._id : this.rollGame._id;
                                const mod = parseInt(100 / (0.05 * 100));
                                let combined = CryptoJS.SHA256(card + gameId).toString();

                                if(this.rollIsHashDivisible(combined, mod) === true) {
                                    multipliers.push(1);
                                    continue;
                                }

                                const h = parseInt(combined.slice(0, 52 / 4), 16);
                                const e = Math.pow(2, 52);

                                multipliers.push(Math.floor((100 * e - h) / (e - h)) / 100);
                            }
                        }

                    }
                }

                return multipliers;
            },
            rollGetWinAmount() {
                let win = 0;

                if(this.authUser.user !== null && this.rollGame.outcome !== undefined) {
                    for(const bet of this.rollBets.filter((element) => element.user._id === this.authUser.user._id)) {
                        if(this.rollGame.outcome >= bet.multiplier) {
                            win = win + Math.floor(bet.amount * (bet.multiplier / 100));
                        }
                    }
                }

                return win;
            }
        },
        watch: {
            'rollGame': {
                handler(data, oldData) {
                    if(data.state === 'created') {
                        this.rollWin = false;

                        const offset = Math.abs(parseInt(this.rollHistory[0]._id.substr(0, 8), 16)) % 9;
                        this.rollReelStyle = { transform: 'translateX(' + (2987.1 - (offset * 13.9)) + 'px)', transition: 'none' };

                        this.rollStartTimer();
                    } else if(data.state === 'rolling') {
                        const offset = Math.abs(parseInt(data._id.substr(0, 8), 16)) % 9;

                        const timeEnding = new Date(this.rollGame.updatedAt).getTime() + 5000;
                        let timeLeft = timeEnding - (new Date().getTime() + this.generalTimeDiff);
                        timeLeft = timeLeft > 0 ? timeLeft : 0;

                        this.rollReelStyle = { transform: 'translateX(' + (-2732.9 - (offset * 13.9)) + 'px)', transition: 'transform ' + timeLeft / 1000 + 's cubic-bezier(0.05, 0.85, 0.25, 1)' };

                        setTimeout(() => { this.rollWin = true; }, timeLeft);
                    } else {
                        this.rollTimer = 0;
                        this.rollText = 'ROLLING...';
                    }
                },
                deep: true
            }
        },
        beforeDestroy() {
            cancelAnimationFrame(this.rollTimerRepeater);
        }
    }
</script>

<style scoped>
    .roll-game {
        width: 100%;
        position: relative;
    }

    .roll-game .game-timer {
        width: 100%;
        height: 36px;
        position: relative;
        display: flex;
        padding: 5px;
        border-radius: 5px;
        background-color: #041120;
    }

    .roll-game .timer-text {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
        transform: translate(-50%, -50%);
    }

    .roll-game .timer-progress {
        height: 100%;
        border-radius: 5px;
        background: linear-gradient(255deg, #3b7eb7 0%, #145081 100%);
    }

    .roll-game .game-spinner {
        width: 100%;
        height: 230px;
        position: relative;
        margin-top: 20px;
    }

    .roll-game .spinner-selector {
        width: 3px;
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #ffffff;
        z-index: 1;
    }

    .roll-game .spinner-selector::before {
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: -6px;
        border-left: 7.5px solid transparent;
        border-right: 7.5px solid transparent;
        border-top: 14px solid #ffffff;
    }

    .roll-game .spinner-selector::after {
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        bottom: 0;
        left: -6px;
        border-left: 7.5px solid transparent;
        border-right: 7.5px solid transparent;
        border-bottom: 14px solid #ffffff;
    }

    .roll-game .spinner-inner {
        height: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        top: 50%;
        left: -25px;
        right: -25px;
        transform: translate(0, -50%);
        padding:  15px 0;
        overflow-x: hidden;
    }

    .roll-game .spinner-inner::before {
        content: '';
        width: 20px;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(90deg, rgba(2, 25, 44, 0.5) 0%, rgba(2, 25, 44, 0) 100%);
        z-index: 1;
    }

    .roll-game .spinner-inner::after {
        content: '';
        width: 20px;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        background: linear-gradient(90deg, rgba(2, 25, 44, 0) 0%, rgba(2, 25, 44, 0.5) 100%);
        z-index: 1;
    }

    .roll-game .inner-reel {
        height: 100%;
        display: flex;
    }

    .roll-game .game-win {
        position: absolute;
        top: 170px;
        left: 50%;
        transform: translate(-50%, 0);
        z-index: 10;
    }

    .roll-game .game-win .fade-slide-enter-active,
    .roll-game .game-win .fade-slide-leave-active {
         transition: all 0.3s ease;
    }

    .roll-game .game-win .fade-slide-enter,
    .roll-game .game-win .fade-slide-leave-to {
        transform: translateY(-30px);
        opacity: 0;
    }
</style>
