<template>
    <div class="rewards-code">
        <div class="code-inner">
            <div class="inner-bg">
                <img src="@/assets/img/rewards_banner.png" alt="banner" />
            </div>
            <div class="inner-image">
                <img src="@/assets/img/chest_coins.png" alt="chest" />
            </div>
            <div class="inner-title">EARN FREE REWARDS</div>
            <div class="inner-info">Start your journey on GrowCsn with a little bonus! Redeem a code to earn a free 10 Robux.</div>
            <div class="inner-input">
                <div class="input-content">
                    <img src="@/assets/img/icons/coin.svg" alt="coin" />
                    <input v-model="rewardsCode" type="text" placeholder="Enter a code..." />
                    <button v-on:click="rewardsClaimButton()" class="button-claim">
                        <div class="button-inner">CLAIM</div>
                    </button>
                </div>
                <div class="input-info">
                    Don't have a code? Use code <span>ROLL</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'RewardsCode',
        data() {
            return {
                rewardsCode: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'modalsSetShow', 
                'modalsSetData'
            ]),
            rewardsClaimButton() {
                if(this.rewardsCode === null || this.rewardsCode.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered code is invalid.' });
                    return;
                }

                this.modalsSetData({ typeCaptcha: 'affiliatesClaim', data: { code: this.rewardsCode } });
                this.modalsSetShow('Captcha');
            }
        }
    }
</script>

<style scoped>
    .rewards-code {
        width: calc(50% - 6px);
        height: 208px;
        position: relative;
        margin-right: 12px;
        padding: 1px;
        border-radius: 36px;
        background: linear-gradient(0deg, rgba(252, 163, 17, 0.35) 0%, rgba(252, 163, 17, 0.2) 100%);
    }

    .rewards-code .code-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 22px 230px 22px 35px;
        border-radius: 36px;
        background: linear-gradient(0deg, rgba(252, 163, 17, 0.12) 0%, rgba(0, 0, 0, 0) 100%), 
                    radial-gradient(50% 40% at 50% 0%, rgba(252, 163, 17, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(90deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.15) 100%), 
                    linear-gradient(270deg, rgba(3, 26, 46, 0.05) 50%, rgba(70, 99, 122, 0.05) 100%), #021c30;
    }

    .rewards-code .inner-bg {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 36px;
        overflow: hidden;
        mix-blend-mode: luminosity;
        z-index: 0;
    }

    .rewards-code .inner-bg img {
        height: 100%;
    }

    .rewards-code .inner-image {
        width: 231px;
        height: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        right: 0;
    }

    .rewards-code .inner-title {
        font-size: 26px;
        font-weight: 900;
        color: #fca311;
    }

    .rewards-code .inner-info {
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
    }

    .rewards-code .inner-input {

    }

    .rewards-code .input-content {
        width: 280px;
        height: 44px;
        position: relative;
    }

    .rewards-code .input-content input {
        width: 100%;
        height: 100%;
        padding: 0 73px 0 42px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        background: rgba(253, 168, 14, 0.05);
        border: 1px solid rgba(253, 168, 14, 0.27);
    }

    .rewards-code .input-content input::placeholder {
        color: #c1c1c1;
    }

    .rewards-code .input-content img {
        width: 16px;
        height: 16px;
        position: absolute;
        top: 50%;
        left: 15px; 
        transform: translate(0, -50%);
    }

    .rewards-code button.button-claim {
        width: 68px;
        height: 30px;
        position: absolute;
        top: 50%;
        right: 5px;
        transform: translate(0, -50%);
        transition: all .2s;
    }

    .button-claim:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .button-claim:active {
        transition-duration: .2s;
        scale: .9;
    }

    .rewards-code button.button-claim .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        font-weight: 800;
        color: #ffffff;
        background: #fca311;
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .rewards-code .input-info {
        margin-top: 8px;
        font-size: 11px;
        font-weight: 700;
        color: #ffffff;
    }

    .rewards-code .input-info span {
        color: #02be81;
    }

    @media only screen and (max-width: 1150px) {

        .rewards-code {
            width: 100%;
            margin-bottom: 12px;
        }

    }

    @media only screen and (max-width: 600px) {

        .rewards-code .code-inner {
            padding: 22px 20px 22px 35px;
        }

        .rewards-code .inner-image {
            display: none;
        }

    }
</style>