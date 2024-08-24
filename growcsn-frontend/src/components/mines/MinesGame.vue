<template>
    <div class="mines-game">
        <transition name="slide-fade">
            <div v-if="minesGame !== null && minesGame.state === 'completed' && minesGame.payout > 0" class="game-win">
                <div class="win-inner">
                    <div class="inner-multiplier">
                        <span>x{{parseFloat(minesGetWinMultiplier).toFixed(2)}}</span>
                        YOU WON
                    </div>
                    <div class="inner-payout">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="payout-value">
                            <span>{{minesFormatValue(minesGetPayoutAmount).split('.')[0]}}</span>.{{minesFormatValue(minesGetPayoutAmount).split('.')[1]}}
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <div class="game-inner">
            <MinesTile v-for="tile in 25" v-bind:key="tile" v-bind:tile="tile - 1" />
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import MinesTile from '@/components/mines/MinesTile';

    export default {
        name: 'MinesGame',
        components: {
            MinesTile
        },
        methods: {
            minesFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
                'minesGame'
            ]),
            minesGetWinMultiplier() {
                let multiplier = 0;

                const first = 25 === this.minesGame.revealed.length ? 1 : this.minesFactorialNumber(25) / (this.minesFactorialNumber(this.minesGame.revealed.length) * this.minesFactorialNumber(25 - this.minesGame.revealed.length));
                const second = (25 - this.minesGame.minesCount) === this.minesGame.revealed.length ? 1 : this.minesFactorialNumber(25 - this.minesGame.minesCount) / (this.minesFactorialNumber(this.minesGame.revealed.length) * this.minesFactorialNumber((25 - this.minesGame.minesCount) - this.minesGame.revealed.length));

                multiplier = 0.95 * (first / second);
                multiplier = multiplier < 1 ? 1.01 : multiplier;
                multiplier = Math.round(multiplier * 100) / 100;

                return multiplier;
            },
            minesGetPayoutAmount() {
                return Math.floor(this.minesGame.amount * this.minesGetWinMultiplier);
            }
        }
    }
</script>

<style scoped>
    .mines-game {
        width: calc(100% - 286px);
        position: relative;
        display: flex;
        justify-content: center;
        margin-left: 16px;
        padding: 20px 0;
        border-radius: 25px;
        background: rgba(3, 20, 33, 0.66);
        border: 1px solid rgba(20, 68, 104, 0.35);
        box-shadow: 0px 4px 10px rgba(7, 26, 41, 0.25);
    }

    .mines-game .game-win {
        width: 242px;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 2px;
        backdrop-filter: blur(3px);
        z-index: 5;
    }

    .mines-game .game-win.slide-fade-enter-active {
        transition: all 0.3s;
    }

    .mines-game .game-win.slide-fade-enter {
        transform: translate(-50%, -40%);
        opacity: 0;
    }

    .mines-game .game-win::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 19px;
        background: linear-gradient(180deg, rgba(1, 224, 163, 0.5) 0%, rgba(1, 224, 163, 0.25) 50%, #01e0a3 100%);
        z-index: -1;
    }

    .mines-game .win-inner {
        width: 100%;
        height: 100%;
        padding: 25px 30px;
        border-radius: 18px;
        background: rgba(3, 20, 33, 0.88);
    }

    .mines-game .inner-multiplier {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 19px;
        font-weight: 800;
        color: #ffffff;
    }

    .mines-game .inner-multiplier span {
        font-size: 26px;
        background: linear-gradient(255deg, #00ffc2 -30%, #00aa6d 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .mines-game .inner-payout {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        padding-top: 13px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .mines-game .inner-payout img {
        width: 20px;
        height: 20px;
        margin-right: 8px;
    }

    .mines-game .inner-payout .payout-value {
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .mines-game .inner-payout .payout-value span {
        font-size: 19px;
        font-weight: 800;
        color: #ffffff;
    }

    .mines-game .game-inner {
        width: 507px;
        height: 507px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
    }

    @media only screen and (max-width: 850px) {

        .mines-game {
            width: 100%;
            margin-left: 0;
        }

    }

    @media only screen and (max-width: 575px) {

        .mines-game .game-inner {
            width: 370px;
            height: 370px;
        }

    }

    @media only screen and (max-width: 425px) {

        .mines-game .game-inner {
            width: 320px;
            height: 320px;
        }

    }

    @media only screen and (max-width: 350px) {

        .mines-game .game-inner {
            width: 270px;
            height: 270px;
        }   

    }
</style>