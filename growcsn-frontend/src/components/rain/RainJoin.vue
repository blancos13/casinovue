<template>
    <div class="rain-join">
        <IconRain class="join-icon" />
        <div class="join-inner">
            <div class="inner-type">
                <div v-if="generalRain.active.type === 'user'" class="type-user">
                    <div class="user-avatar" v-bind:class="[ 
                        'avatar-' + rainGetLevelColor,
                        'avatar-' + generalRain.active.creator.rank
                    ]">
                        <AvatarImage v-bind:image="generalRain.active.creator.avatar" />
                    </div>
                    <div class="user-text">
                        <div v-html="generalRain.active.creator.username" class="text-username"></div>HOSTED A<span class="gradient-green">RAIN</span>
                    </div>
                </div>
                <div v-else class="type-site">
                    <div class="site-avatar">
                        <div class="avatar-inner">
                            <img src="@/assets/img/knight.png" />
                        </div>
                    </div>
                    <div class="site-text">
                        <span class="gradient-green">IT’S RAINING!</span>
                    </div>
                </div>
            </div>
            <div class="inner-info">
                <div class="info-amount">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="amount-value">
                        <span>{{rainFormatValue(generalRain.active.amount).split('.')[0]}}</span>.{{rainFormatValue(generalRain.active.amount).split('.')[1]}}
                    </div>
                </div>
                <div class="info-timer">
                    <IconTimerGradient />
                    <div class="timer-value">
                        <span>{{rainTimer.split(':')[0]}}</span>m
                        <span>{{rainTimer.split(':')[1]}}</span>s
                    </div>
                </div>
            </div>
            <button v-on:click="rainClaimButton()" class="button-claim" v-bind:disabled="rainIsClaimed === true">
                <div class="button-inner">
                    <span>{{rainIsClaimed === true ? 'CLAIMED' : 'CLAIM RAIN'}}</span>
                </div>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconRain from '@/components/icons/IconRain';
    import IconTimerGradient from '@/components/icons/IconTimerGradient';
    import AvatarImage from '@/components/AvatarImage';

    export default {
        name: 'RainJoin',
        components: {
            IconRain,
            IconTimerGradient,
            AvatarImage
        },
        data() {
            return {
                rainTimerInterval: null,
                rainTimer: '00:00'
            }
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'generalClearRainActive', 
                'modalsSetData', 
                'modalsSetShow'
            ]),
            rainFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            rainStartTimer() {
               const endingTime = new Date(this.generalRain.active.updatedAt).getTime() + (1000 * 60 * 2);
               let timeLeft = Math.floor((endingTime - (new Date().getTime() + this.generalTimeDiff)) / 1000);
               timeLeft = timeLeft <= 0 ? 0 : timeLeft;

               if(timeLeft === 0) { this.generalClearRainActive(); }

               let timeMinutes = Math.floor((timeLeft % (60 * 60)) / 60);
               timeMinutes = timeMinutes < 10 ? '0' + timeMinutes : timeMinutes;
               let timeSeconds = Math.floor(timeLeft % 60);
               timeSeconds = timeSeconds < 10 ? '0' + timeSeconds : timeSeconds;

               this.rainTimer = timeMinutes.toString() + ':' + timeSeconds.toString();
           },
           rainClaimButton() {
               if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

               this.modalsSetData({ typeCaptcha: 'rainJoin', data: {} });
               this.modalsSetShow('Captcha');
           }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading', 
                'authUser', 
                'generalTimeDiff', 
                'generalRain'
            ]),
            rainGetLevelColor() {
                let color = '';

                if(this.generalRain.active.creator.level >= 2 && this.generalRain.active.creator.level < 26) { color = 'blue'; }
                else if(this.generalRain.active.creator.level >= 26 && this.generalRain.active.creator.level < 51) { color = 'green'; }
                else if(this.generalRain.active.creator.level >= 51 && this.generalRain.active.creator.level < 76) { color = 'orange'; }
                else if(this.generalRain.active.creator.level >= 76 && this.generalRain.active.creator.level < 100) { color = 'red'; }
                else if(this.generalRain.active.creator.level >= 100) { color = 'purple'; }

                return color;
            },
            rainIsClaimed() {
                return this.authUser.user !== null && this.generalRain.active.participants.some((element) => element.user === this.authUser.user._id) === true;
            }
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
    .rain-join {
        width: 100%;
        height: 130px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .rain-join::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 15px;
        background: linear-gradient(180deg, rgba(0, 255, 194, 0) 0%, #00ffc2 100%);
        z-index: -1;
    }

    .rain-join::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 15px;
        background: #051d30;
        z-index: -1;
    }

    .rain-join .join-icon {
        width: 44px;
        height: 43px;
        position: absolute;
        top: -5px;
        right: -8px;
        transform: rotate(16deg);
    }

    .rain-join .join-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0 16px 0;
        border-radius: 15px;
        background: radial-gradient(225% 225% at 50% -10%, rgba(1, 182, 121, 0.43) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(255deg, rgba(0, 255, 194, 0.05) 0%, rgba(0, 170, 109, 0.05) 90%), rgba(0, 0, 0, 0.34);
    }

    .rain-join .inner-type {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .rain-join .type-user {
        display: flex;
        align-items: center;
        margin-top: 3px;
    }

    .rain-join .user-avatar {
        width: 25px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-right: 8px;
        border-radius: 50%;
        border: 2px solid #9e9e9e;
        overflow: hidden;
    }

    .rain-join .user-avatar.avatar-blue {
        border: 2px solid #559ee4;
    }

    .rain-join .user-avatar.avatar-green {
        border: 2px solid #b8e92d;
    }

    .rain-join .user-avatar.avatar-orange {
        border: 2px solid #fca311;
    }

    .rain-join .user-avatar.avatar-red {
        border: 2px solid #ff4e4e;
    }

    .rain-join .user-avatar.avatar-purple {
        border: 2px solid #6953f1;
    }

    .rain-join .user-avatar.avatar-partner {
        border: 2px solid #eca822;
    }

    .rain-join .user-avatar.avatar-mod {
        border: 2px solid #ffb703;
    }

    .rain-join .user-avatar.avatar-admin {
        border: 2px solid #00ffc2;
    }

    .rain-join .user-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    .rain-join .user-text {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .rain-join .user-text span {
        margin-left: 4px;
    }

    .rain-join .text-username {
        max-width: 65px;
        margin-right: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .rain-join .type-site {
        width: calc(100% - 20px);
        position: relative;
        padding: 4px 0;
    }

    .rain-join .site-avatar {
        width: 34px;
        height: 34px;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
        padding: 1px;
        z-index: 1;
    }

    .rain-join .site-avatar::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 50%;
        background: linear-gradient(180deg, rgba(0, 255, 194, 0) 0%, #00ffc2 100%);
        z-index: -1;
    }

    .rain-join .avatar-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        border-radius: 50%;
        background: #036e57;
        overflow: hidden;
    }

    .rain-join .avatar-inner img {
        height: 34px;
        transform: translate(0, 5px) scale(-1, 1);
    }

    .rain-join .site-text {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 13px;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.34) 0%, rgba(0, 0, 0, 0) 90%);
    }

    .rain-join .site-text span {
        font-size: 16px;
        font-weight: 800;
        text-shadow: 0px 2px 35px rgba(1, 230, 169, 0.59), 0px 4px 25px rgba(15, 41, 63, 0.35);
    }

    .rain-join .inner-info {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 4px;
    }

    .rain-join .info-amount {
        display: flex;
        align-items: center;
        margin-right: 8px;
    }

    .rain-join .info-amount img {
        width: 18px;
        height: 18px;
        margin-right: 6px;
    }

    .rain-join .amount-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .rain-join .amount-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .rain-join .info-timer {
        display: flex;
        align-items: center;
    }

    .rain-join .info-timer svg {
        margin-right: 8px;
    }
    .rain-join .timer-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }
    .rain-join .timer-value span {
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
    }

    .rain-join button.button-claim {
        width: calc(100% - 40px);
        height: 27px;
        position: relative;
        margin-top: 15px;
        padding: 1px;
        filter: drop-shadow(0px 2px 15px rgba(1, 230, 169, 0.15))
                drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
        z-index: 1;
        transition: all .2s;
    }
    .rain-join button.button-claim:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .rain-join button.button-claim:active {
        transition-duration: .2s;
        scale: .9;
    }

    .rain-join button.button-claim:disabled {

    }

    .rain-join button.button-claim::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 255, 194, 0) 0%, #00ffc2 100%);
        clip-path: polygon(3px 0, calc(100% - 3px) 0, 100% 25%, 100% 75%, calc(100% - 3px) 100%, 3px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .rain-join button.button-claim::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #164844;
        clip-path: polygon(3px 0, calc(100% - 3px) 0, 100% 25%, 100% 75%, calc(100% - 3px) 100%, 3px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .rain-join button.button-claim .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;    
        background: linear-gradient(255deg, #00ffc2 20%, #00aa6d 70%);
        clip-path: polygon(3px 0, calc(100% - 3px) 0, 100% 25%, 100% 75%, calc(100% - 3px) 100%, 3px 100%, 0 75%, 0 25%);
    }

    .rain-join button.button-claim:disabled .button-inner {
        background: linear-gradient(265deg, rgba(0, 255, 194, 0.25) 20%, rgba(0, 170, 109, 0.25) 70%);
    }

    .rain-join button.button-claim .button-inner span {
        font-size: 13px;
        font-weight: 800;
        color: #ffffff;
    }

    .rain-join button.button-claim:disabled .button-inner span {
        background: linear-gradient(256.23deg, #00FFC2 0%, #00AA6D 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }
</style>
