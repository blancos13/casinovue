<template>
    <div class="rain-tip-dropdown" v-bind:class="{ 'dropdown-open': rainDropdownTip === true }">
        <button v-on:click="rainSetDropdownTip(!rainDropdownTip)" class="button-toggle">
            <div class="button-inner">
                <IconRain />
                <span class="gradient-green">TIP RAIN</span>
                <div class="inner-amount">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="amount-value">
                        <span>{{rainFormatValue(generalRain.site.amount).split('.')[0]}}</span>.{{rainFormatValue(generalRain.site.amount).split('.')[1]}}
                    </div>
                </div>
                <IconDropdown/>
            </div>
        </button>
        <div class="dropdown-window">
            <div class="window-inner">
                <div class="inner-timer">
                    <IconTimer />
                    <div class="timer-value">
                        <span>{{rainTimer.split(':')[0]}}</span>m
                        <span>{{rainTimer.split(':')[1]}}</span>s
                    </div>
                </div>
                <div class="inner-info">
                    Half of the rain pot is split evenly amongst players while the other half is split amongst levels.
                </div>
                <div class="inner-input">
                    <input v-model="rainAmount" v-on:input="rainValidateInput" type="text" placeholder="TIP AMOUNT" />
                    <button v-on:click="rainTipButton" class="button-tip">
                        <div class="button-inner">TIP</div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconRain from '@/components/icons/IconRain';
    import IconDropdown from '@/components/icons/IconDropdown';
    import IconTimer from '@/components/icons/IconTimer';

    export default {
        name: 'RainTipDropdown',
        components: {
            IconRain,
            IconDropdown,
            IconTimer
        },
        data() {
            return {
                rainTimerInterval: null,
                rainTimer: '00:00',
                rainAmount: ''
            }
        },
        methods: {
            ...mapActions(['notificationShow', 'rainSetDropdownTip', 'generalSendRainTipSocket']),
            rainFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            rainValidateInput() {
                this.rainAmount = this.rainAmount.replace(/[^\d.]/g, '');
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
           },
           rainTipButton() {
                if(this.socketSendLoading !== null) { return; }

                const amount = Math.floor(this.rainAmount * 1000);

                if(amount === undefined || isNaN(amount) === true || amount <= 0) {
                    this.notificationShow({ type: 'error', message: 'Your entered rain tip amount is invalid.' });
                    return;
                }

                const data = { amount: amount };
                this.generalSendRainTipSocket(data);

                this.rainAmount = null;
                this.rainSetDropdownTip(false);
           }
        },
        computed: {
            ...mapGetters(['socketSendLoading', 'authUser', 'generalTimeDiff', 'rainDropdownTip', 'generalRain']),
        },
        created() {
            let self = this;
            document.addEventListener('click', function(event) {
                if(!self.$el.contains(event.target) && event.path !== undefined && event.path.some((element) => element._prevClass === 'button-tip') === false && self.rainDropdownTip === true) {
                    self.rainSetDropdownTip(false);
                }
            });

            this.rainTimerInterval = setInterval(() => { this.rainStartTimer(); }, 500);
        }
    }
</script>

<style scoped>
    .rain-tip-dropdown {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        margin-top: 16px;
        z-index: 10;
    }

    .rain-tip-dropdown button.button-toggle {
        height: 40px;
        position: relative;
        padding: 1px;
        filter: drop-shadow(0px 2px 10px rgba(1, 230, 169, 0.15)) drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
        z-index: 2;
    }

    .rain-tip-dropdown button.button-toggle::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e1a4 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .rain-tip-dropdown button.button-toggle .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 20px;
        font-size: 14px;
        font-weight: 800;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.128) 0%, rgba(0, 33, 24, 0.132) 25%, rgba(0, 99, 73, 0.144986) 60%, rgba(1, 193, 143, 0.0925409) 80%, rgba(1, 237, 176, 0.068) 100%) #064552;
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
        transition: all .3s;
    }
    .rain-tip-dropdown button.button-toggle .button-inner:hover {
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.128) 0%, rgba(1, 49, 36, 0.132) 25%, rgba(0, 99, 73, 0.144986) 60%, rgba(3, 206, 152, 0.093) 80%, rgba(1, 237, 176, 0.068) 100%) #0b5564;
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }
    /* .rain-tip-dropdown button.button-toggle .button-inner:active {
        transition-duration: .2s;
        scale: .9;
    } */

    .rain-tip-dropdown button.button-toggle .button-inner svg:first-of-type {
        width: 20px;
        margin-right: 9px;
    }

    .rain-tip-dropdown button.button-toggle .button-inner svg:last-of-type {
        width: 7px;
        margin-left: 17px;
        fill: url(#icon-dropdown-gradient) #a6cae8;
        transition: all 0.3s ease;
    }

    .rain-tip-dropdown.dropdown-open button.button-toggle .button-inner svg:last-of-type {
        transform: rotate(180deg);
    }

    .rain-tip-dropdown button.button-toggle .inner-amount {
        display: flex;
        align-items: center;
        margin-left: 8px;
    }

    .rain-tip-dropdown button.button-toggle .inner-amount img {
        width: 13px;
        height: 13px;
        margin-right: 5px;
    }

    .rain-tip-dropdown button.button-toggle .amount-value {
        font-size: 8px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .rain-tip-dropdown button.button-toggle .amount-value span {
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
    }

    .rain-tip-dropdown .dropdown-window {
        height: 0;
        position: absolute;
        top: 20px;
        left: -15px;
        right: -15px;
        padding: 0 15px;
        transition: height 0.2s ease;
        overflow: hidden;
        z-index: 1;
    }

    .rain-tip-dropdown.dropdown-open .dropdown-window {
       height: 172px;
       padding: 0 15px 15px 15px;
    }

    .rain-tip-dropdown .window-inner {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 31px 14px 15px 14px;
        border-radius: 15px;
        background: radial-gradient(163.2% 163.2% at 50% -31.45%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(256.23deg, #07263d 0%, #07243a 100%);
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    }

    .rain-tip-dropdown .inner-timer {
        display: flex;
        align-items: center;
    }

    .rain-tip-dropdown .inner-timer svg {
        margin-right: 8px;
        fill: #ffffff;
    }

    .rain-tip-dropdown .timer-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .rain-tip-dropdown .timer-value span {
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
    }

    .rain-tip-dropdown .inner-info {
        width: 100%;
        margin-top: 6px;
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .rain-tip-dropdown .inner-input {
        width: 250px;
        height: 40px;
        position: relative;
        margin-top: 15px;
        padding: 1px;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .rain-tip-dropdown .inner-input::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .rain-tip-dropdown .inner-input input {
        width: 100%;
        height: 100%;
        padding: 0 80px 0 15px;
        font-size: 10px;
        font-weight: 600;
        color: #ffffff;
        background-color: #072435;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .rain-tip-dropdown .inner-input input::placeholder {
        color: #5e768e;
    }

    .rain-tip-dropdown button.button-tip {
        width: 50px;
        height: 22px;
        position: absolute;
        top: 50%;
        right: 18px;
        transform: translate(0, -50%);
        filter: drop-shadow(0px 2px 10px rgba(1, 230, 169, 0.15)) drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
        transition: all .2s;
    }
    .rain-tip-dropdown button.button-tip:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .rain-tip-dropdown button.button-tip:active {
        transition-duration: .2s;
        scale: .9;
    }

    .rain-tip-dropdown button.button-tip .button-inner {
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
</style>
