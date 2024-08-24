<template>
    <div class="affiliates-stats">
        <div class="stats-element">
            <div class="element-inner">
                <transition name="fade" mode="out-in">
                    <div v-if="affiliatesData.data === null || affiliatesData.loading === true" class="inner-loading" key="loading"></div>
                    <div v-else class="inner-content" key="content">
                        <div class="content-name">TOTAL REFERRALS</div>
                        <div class="content-amount">
                            {{affiliatesData.data.referred}}
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <div class="stats-element">
            <div class="element-inner">
                <transition name="fade" mode="out-in">
                    <div v-if="affiliatesData.data === null || affiliatesData.loading === true" class="inner-loading" key="loading"></div>
                    <div v-else class="inner-content" key="content">
                        <div class="content-name">TOTAL WAGERED</div>
                        <div class="content-amount">
                            <img src="@/assets/img/icons/coin.svg" alt="icon" />
                            <div class="amount-value">
                                <span>{{affiliatesFormatValue(affiliatesData.data.earned / 0.005).split('.')[0]}}</span>.{{affiliatesFormatValue(affiliatesData.data.earned / 0.005).split('.')[1]}}
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <div class="stats-element">
            <div class="element-inner">
                <transition name="fade" mode="out-in">
                    <div v-if="affiliatesData.data === null || affiliatesData.loading === true" class="inner-loading" key="loading"></div>
                    <div v-else class="inner-content" key="content">
                        <div class="content-name">TOTAL EARNED</div>
                        <div class="content-amount">
                            <img src="@/assets/img/icons/coin.svg" alt="icon" />
                            <div class="amount-value">
                                <span>{{affiliatesFormatValue(affiliatesData.data.earned).split('.')[0]}}</span>.{{affiliatesFormatValue(affiliatesData.data.earned).split('.')[1]}}
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <div class="stats-element element-available">
            <div class="element-inner">
                <transition name="fade" mode="out-in">
                    <div v-if="affiliatesData.data === null || affiliatesData.loading === true" class="inner-loading" key="loading"></div>
                    <div v-else class="inner-content" key="content">
                        <div class="content-info">
                            <span class="gradient-green">AVAILABLE COMMISSION</span>
                            <div class="info-amount">
                                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                                <div class="amount-value">
                                    <span>{{affiliatesFormatValue(affiliatesData.data.available).split('.')[0]}}</span>.{{affiliatesFormatValue(affiliatesData.data.available).split('.')[1]}}
                                </div>
                            </div>
                        </div>
                        <button v-on:click="affiliatesClaimButton" class="button-claim" v-bind:disabled="socketSendLoading === 'AffiliatesClaimEarnings'">
                            <div class="button-inner">
                                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                                CLAIM EARNINGS
                            </div>
                        </button>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import ButtonLoading from '@/components/ButtonLoading';

    export default {
        name: 'AffiliatesStats',
        components: {
            ButtonLoading
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'affiliatesSendClaimEarningsSocket'
            ]),
            affiliatesFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            affiliatesClaimButton() {
                if(this.socketSendLoading !== null) { return; }

                if(this.affiliatesData.data === null || this.affiliatesData.data.available < 10000) {
                    this.notificationShow({ type: 'error', message: 'You’ll need a minimum of 10 Robux in earnings to claim.' });
                    return;
                }

                const data = {};
                this.affiliatesSendClaimEarningsSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading', 
                'affiliatesData'
            ])
        }
    }
</script>

<style scoped>
    .affiliates-stats {
        width: 955px;
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
    }

    .affiliates-stats .stats-element {
        width: calc(50% - 11px);
        height: 80px;
        position: relative;
        margin-right: 22px;
        padding: 1px;
        z-index: 1;
    }

    .affiliates-stats .stats-element:nth-child(2n) {
        margin-right: 0;
    }

    .affiliates-stats .stats-element:nth-child(3),
    .affiliates-stats .stats-element:nth-child(4) {
        margin-top: 20px;
    }

    .affiliates-stats .stats-element::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 15px;
        background: linear-gradient(180deg, rgba(20, 68, 104, 0) 0%, #144468 100%);
        z-index: -1;
    }

    .affiliates-stats .stats-element.element-available::before {
        background: linear-gradient(180deg, rgba(0, 255, 194, 0) 0%, #00ffc2 100%);
    }

    .affiliates-stats .stats-element.element-available::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 15px;
        background-color: #05233b;
        z-index: -1;
    }

    .affiliates-stats .element-inner {
        width: 100%;
        height: 100%;
        border-radius: 15px;
        background: linear-gradient(255deg, #07263d 0%, #07243a 100%);
    }

    .affiliates-stats .stats-element.element-available .element-inner {
        background: linear-gradient(256deg, rgba(0, 255, 194, 0.05) 0%, rgba(0, 170, 109, 0.05) 100%), radial-gradient(81.75% 81.75% at 50% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
    }

    .affiliates-stats .inner-loading {
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: 15px;
        overflow: hidden;
    }

    .affiliates-stats .inner-loading::after {
        width: 100%;
        height: 100%;
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        animation-name: loading_animation;
        animation-duration: 1s;
        animation-timing-function: ease;
        animation-iteration-count: infinite;
        background: linear-gradient(to right, #ffffff00 0%, rgba(255, 255, 255, 0.1) 50%, #ffffff00 100%);
    }

    .affiliates-stats .inner-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .affiliates-stats .inner-loading.fade-leave-to {
        opacity: 0;
    }

    .affiliates-stats .inner-content {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 25px;
    }

    .affiliates-stats .inner-content.fade-enter-active {
        transition: opacity 0.5s;
    }

    .affiliates-stats .inner-content.fade-enter-from {
        opacity: 0;
    }

    .affiliates-stats .content-name {
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
    }

    .affiliates-stats .content-amount {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
    }

    .affiliates-stats .content-amount img {
        width: 19px;
        height: 19px;
        margin-right: 10px;
    }

    .affiliates-stats .amount-value {
        font-size: 12px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .affiliates-stats .amount-value span {
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
    }

    .affiliates-stats .stats-element.element-available .content-info {
        font-size: 12px;
        font-weight: 800;
    }

    .affiliates-stats .stats-element.element-available .info-amount {
        display: flex;
        align-items: center;
        margin-top: 10px;
    }

    .affiliates-stats .stats-element.element-available .info-amount img {
        width: 19px;
        height: 19px;
        margin-right: 10px;
    }

    .affiliates-stats .stats-element.element-available button.button-claim {
        width: 172px;
        height: 44px;
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
        transition: all .2s;
    }

    .affiliates-stats .stats-element.element-available button.button-claim:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .affiliates-stats .stats-element.element-available button.button-claim:active {
        transition-duration: .2s;
        scale: .9;
    }

    .affiliates-stats .stats-element.element-available button.button-claim:disabled {
        cursor: not-allowed;
    }

    .affiliates-stats .stats-element.element-available button.button-claim .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .affiliates-stats .stats-element.element-available button.button-claim img {
        width: 19px;
        height: 19px;
        margin-right: 10px;
    }

    @keyframes loading_animation {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(100%); }
    }

    @media only screen and (max-width: 975px) {

        .affiliates-stats {
            width: 100%;
        }

    }

    @media only screen and (max-width: 850px) {

        .affiliates-stats .stats-element {
            width: 100%;
            margin-top: 10px!important;
            margin-right: 0!important;
        }

        .affiliates-stats .stats-element:first-of-type {
            margin-top: 0!important;
        }

    }
</style>
