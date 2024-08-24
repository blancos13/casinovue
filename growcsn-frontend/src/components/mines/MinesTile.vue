<template>
    <div class="mines-tile">
        <transition name="fade" mode="out-in">
            <div v-if="minesGame !== null && minesGetRevealedTile === 'coin'" class="tile-coin">
                <div class="coin-box">
                    <div class="box-inner">       
                        <img src="@/assets/img/mines/knight.png" />
                    </div>
                </div>
            </div>
            <div v-else-if="minesGame !== null && minesGetRevealedTile === 'mine'" class="tile-mine">
                <img src="@/assets/img/mines/mine.png" />
            </div>
            <button v-else v-on:click="minesRevealTile()" class="button-reveal" v-bind:disabled="socketSendLoading !== null || minesGame === null || minesGame.state === 'completed'">
                <!-- <div class="coin-multiplier">1.02x</div> -->
            </button>
        </transition>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'MinesTile',
        props: ['tile'],
        methods: {
            ...mapActions([
                'notificationShow', 
                'minesSendRevealSocket'
            ]),
            minesFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            minesRevealTile() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                if(this.minesGame === null) {
                    this.notificationShow({type: 'error', message: 'You have no running mines game at the moment.' });
                    return;
                }

                const data = { tile: this.tile };
                this.minesSendRevealSocket(data);
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
                'authUser', 
                'minesGame'
            ]),
            minesGetRevealedTile() {
                let revealed = null;

                if(this.minesGame.state === 'completed' && this.minesGame.deck[this.tile] === 'mine') {
                    revealed = this.minesGame.deck[this.tile];
                } else {
                    const index = this.minesGame.revealed.findIndex((element) => element.tile === this.tile);
                    if(index !== -1) { revealed = this.minesGame.revealed[index].value }
                }

                return revealed;
            },
            minesGetTilePayout() {
                const index = this.minesGame.revealed.findIndex((element) => element.tile === this.tile);

                const first = 25 === (index + 1) ? 1 : this.minesFactorialNumber(25) / (this.minesFactorialNumber(index + 1) * this.minesFactorialNumber(25 - (index + 1)));
                const second = (25 - this.minesGame.minesCount) === (index + 1) ? 1 : this.minesFactorialNumber(25 - this.minesGame.minesCount) / (this.minesFactorialNumber(index + 1) * this.minesFactorialNumber((25 - this.minesGame.minesCount) - (index + 1)));

                let multiplier = 0.95 * (first / second);
                multiplier = multiplier < 1 ? 1 : multiplier;

                return Math.floor(this.minesGame.amount * multiplier);
            }
        }
    }
</script>

<style scoped>
    .mines-tile {
        width: 95px;
        height: 95px;
        /* border-radius: 7px; */
        /* background: linear-gradient(0deg, rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0.20)), 
                    radial-gradient(160% 160% at 50% -30%, rgba(0, 194, 255, 0.32) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(255deg, #07263d 0%, #07243a 100%); */
        /* background: #043952;
        box-shadow: 0px 2px 5px rgba(7, 26, 41, 0.25); */
        /* border: 0.78px solid #7e7c7c; */
    }
    .mines-tile .tile-coin.fade-enter-active,
    .mines-tile .tile-mine.fade-enter-active {
        transition: transform 0.3s;
    }

    .mines-tile .tile-coin.fade-enter,
    .mines-tile .tile-mine.fade-enter {
        transform: scale(0);
    }

    .mines-tile button.button-reveal.fade-leave-active {
        transition: transform 0.1s;
    }

    .mines-tile button.button-reveal.fade-leave-to {
        transform: scale(0);
    }

    .mines-tile .tile-coin,
    .mines-tile .tile-mine {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .mines-tile .tile-coin {
        border-radius: 10px;
        border-bottom: 5px solid #A67B30;
        background: #E59914;
        /* after:block after:pt-[100%] hover:duration-200 hover:bg-[#383233] hover:translate-y-[-4px] */
    }
    .button-reveal::after {
        display: block;
        padding-top: 100%;
    }
    .button-reveal:hover {
        transition-duration: .2s;
        background: #0c4d6b;
        transform: translateY(-2px);
    }
    .button-reveal:active {
        transition-duration: .2s;
        background: #083e57;
        transform: translateY(2px);
    }

    .mines-tile .tile-mine {
        border-radius: 10px;
        border-bottom: 5px solid #460E1D;
        background: #3F1B1A;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    }

    .mines-tile .coin-box {
        width: 100%;
        height: 100%;
        position: relative;
        padding: 1px;
        /* border-radius: 7px;
        box-shadow: 0px 2px 5px rgba(7, 26, 41, 0.25); */
        z-index: 1;
    }

    .mines-tile .coin-box::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 7px;
        /* background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e0a3 100%); */
        z-index: -1;
    }

    .mines-tile .coin-box::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 7px;
        /* background: #07243a; */
        z-index: -1;
    }

    .mines-tile .box-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;        
        border-radius: 7px;       
        overflow: hidden;
        position: relative; 
    }

    .mines-tile .box-inner img {
        width: 45px;
        transform: scaleX(-1);
    }

    .mines-tile .inner-payout {
        display: flex;
        align-items: center;
        position: absolute;
        top: 5px;
    }

    .mines-tile .inner-payout img {
        width: 12px;
        height: 12px;
        margin-right: 4px;
        margin-bottom: 1px;
    }

    .mines-tile .payout-value {
        font-size: 11px;
        font-weight: 600;
        color: #555;
    }

    .mines-tile .payout-value span {
        font-size: 12px;
        font-weight: 800;
        color: #444;
    }

    .mines-tile .tile-mine img {
        width: 45%;
    }

    .mines-tile button.button-reveal {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        border-bottom: 5px solid #0A2B4B;
        background: #07253B;
    }

    .mines-tile button.button-reveal img {
        width: 48px;
        transform: rotate(-4deg);
        mix-blend-mode: luminosity;
        opacity: 0.13;
        transition: transform 0.3s ease;
    }

    .mines-tile button.button-reveal:enabled:hover img {
        transform: scale(1.08);
    }

    @media only screen and (max-width: 575px) {

        .mines-tile {
           width: 70px;
           height: 70px;
        }

        .mines-tile .tile-coin,
        .mines-tile .tile-mine {
            padding: 6px;
        }

        .mines-tile .box-inner img {
            width: 30px;
        }

        .mines-tile .inner-payout img {
            width: 9px;
            height: 9px;
        }

        .mines-tile .payout-value {
            font-size: 8px;
        }

        .mines-tile .payout-value span {
            font-size: 10px;
        }

        .mines-tile button.button-reveal img {
            width: 40px;
        }
        .mines-tile .inner-payout {     
            top: 0px;
        }

    }

    @media only screen and (max-width: 425px) {

        .mines-tile {
            width: 60px;
            height: 60px;
        }

        .mines-tile .box-inner img {
            width: 26px;
        }

        .mines-tile .inner-payout img {
            width: 7px;
            height: 7px;
        }

        .mines-tile .payout-value {
            font-size: 6px;
        }

        .mines-tile .payout-value span {
            font-size: 8px;
        }

        .mines-tile button.button-reveal img {
            width: 36px;
        }

    }

    @media only screen and (max-width: 350px) {

        .mines-tile {
            width: 50px;
            height: 50px;
        }

    }

    .coin-multiplier {
        color: #A4A4A4;
        text-shadow: 0px 5.385px 5.385px rgba(0, 0, 0, 0.25);
        /* font-family: Kanit; */
        font-size: 14.247px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }
</style>