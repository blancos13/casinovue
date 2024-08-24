<template>
    <div class="banner-rain">
        <div class="rain-text">
            <div class="text-header">
                RAIN
                <button v-on:click="rainSetDropdownTip(true)" class="button-tip">
                    <div class="button-inner">
                        <IconRain />
                        <span class="gradient-green">TIP RAIN</span>
                    </div>
                </button>
            </div>
            <div class="text-info">Rain is distributed every <span>30 minutes</span> via the chat. Play and tip the rain to contribute towards the rain!</div>
            <div class="text-bottom">
                <div class="bottom-timer">
                    <IconTimerGradient />
                    <div class="timer-value">
                        <span>{{rainTimer.split(':')[0]}}</span>m
                        <span>{{rainTimer.split(':')[1]}}</span>s
                    </div>
                </div>
                <div class="bottom-amount">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="amount-value">
                        <span>{{rainFormatValue(generalRain.site.amount).split('.')[0]}}</span>.{{rainFormatValue(generalRain.site.amount).split('.')[1]}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconRain from '@/components/icons/IconRain';
    import IconTimerGradient from '@/components/icons/IconTimerGradient';

    export default {
        name: 'BannerRain',
        components: {
            IconRain,
            IconTimerGradient
        },
        data() {
            return {
                rainTimerInterval: null,
                rainTimer: '00:00'
            }
        },
        methods: {
            ...mapActions(['rainSetDropdownTip']),
            helloTest() {
                console.log('hahahahahha');
            },
            rainFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            rainStartTimer() {
                const endingTime = new Date(this.generalRain.site.updatedAt).getTime() + (1000 * 60 * (this.generalRain.site.state === 'running' ? 2 : 30));
                let timeLeft = Math.floor((endingTime - (new Date().getTime() + this.generalTimeDiff)) / 1000);
                timeLeft = this.generalRain.site.state === 'pending' ? 60 * 2 : timeLeft <= 0 ? 0 : timeLeft;

                let timeMinutes = Math.floor((timeLeft % (60 * 60)) / 60);
                timeMinutes = timeMinutes < 10 ? '0' + timeMinutes : timeMinutes;
                let timeSeconds = Math.floor(timeLeft % 60);
                timeSeconds = timeSeconds < 10 ? '0' + timeSeconds : timeSeconds;

                this.rainTimer = timeMinutes.toString() + ':' + timeSeconds.toString();
            }
        },
        computed: {
            ...mapGetters(['generalTimeDiff', 'generalRain']),
        },
        beforeDestroy() {
            clearInterval(this.rainTimerInterval);
        },
        created() {
            this.rainTimerInterval = setInterval(() => { this.rainStartTimer(); }, 500);
        }
    }
</script>

<style scoped>
    .banner-rain {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 40px 20px 25px;
        background: linear-gradient(100deg, rgba(2, 243, 127, 0.74) 0%, rgba(2, 216, 113, 0.65) 7%, rgba(0, 0, 0, 0) 50%),
                    linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
                    radial-gradient(110% 110% at 50% 30%, #005e3e 0%, #021729 100%);
        overflow: hidden;
        z-index: 1;
    }

    .banner-rain::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-image: url('~@/assets/img/banner-rain-bg.png');
        mix-blend-mode: luminosity;
        opacity: 0.5;
        z-index: -1;
    }

    .banner-rain img {
        width: 115px;
    }

    .banner-rain .rain-text {
        width: calc(100% - 115px);
        padding-right: 40px;
    }

    .banner-rain .text-header {
        display: flex;
        align-items: center;
        line-height: 48px;
        font-size: 48px;
        font-weight: 900;
        color: #ffffff;
        text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2), 0px 3px 0px #1c4d3e;
    }

    .banner-rain .text-header button.button-tip {
        width: 115px;
        height: 37px;
        position: relative;
        margin-left: 17px;
        padding: 1px;
        filter: drop-shadow(0px 2px 1px rgba(0, 0, 0, 0.35)) drop-shadow(0px 2px 10px rgba(1, 230, 169, 0.15)) drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .banner-rain .text-header button.button-tip::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e1a4 100%);
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .banner-rain .text-header button.button-tip .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        font-weight: 800;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.13) -90%, rgba(0, 33, 24, 0.15) -40%, rgba(0, 99, 73, 0.15) 230%, rgba(1, 193, 143, 0.1) 65%, rgba(1, 237, 176, 0.06) 100%), #0d262c;
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .banner-rain .text-header button.button-tip .button-inner svg {
        width: 17px;
        margin-right: 8px;
    }

    .banner-rain .text-info {
        margin-top: 10px;
        font-size: 12px;
        font-weight: 500;
        color: #a6d6c8;
        /* font-family: 'Rubik'; */
    }

    .banner-rain .text-info span {
        color: #01f4b7;
    }

    .banner-rain .text-bottom {
        margin-top: 15px;
        display: flex;
    }

    .banner-rain .bottom-timer,
    .banner-rain .bottom-amount {
        width: 120px;
        height: 37px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
    }

    .banner-rain .bottom-timer {
        margin-right: 8px;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.12) -100%, rgba(0, 33, 24, 0.15) -50%, rgba(0, 99, 73, 0.144986) 25%, rgba(1, 193, 143, 0.1) 65%, rgba(1, 237, 176, 0.07) 100%);
        border: 0.5px solid #34b49e;
    }

    .banner-rain .bottom-timer svg {
        width: 16px;
        margin-right: 8px;
    }

    .banner-rain .bottom-amount {
        background: rgba(143, 103, 5, 0.2);
        border: 0.5px solid #ffcc51;
    }

    .banner-rain .bottom-amount img {
        width: 17px;
        height: 17px;
        margin-right: 8px;
    }

    .banner-rain .timer-value,
    .banner-rain .amount-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .banner-rain .timer-value span,
    .banner-rain .amount-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 600px) {

        .banner-rain img {
            display: none;
        }

        .banner-rain .rain-text {
            width: 100%;
            padding-right: 0;
        }
    }
</style>
