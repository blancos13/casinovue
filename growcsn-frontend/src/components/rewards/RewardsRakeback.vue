<template>
    <div class="rewards-rakeback">
        <div class="rakeback-inner">
            <div class="inner-image">
                <img src="@/assets/img/chest_gems.png" alt="chest" />
            </div>
            <div class="inner-header">
                <span>RAKEBACK</span>
                <div v-if="rewardsGetRakebackInfo !== null" class="header-rank" v-bind:class="[
                    'rank-' + rewardsGetRakebackInfo.name
                ]">
                    <span>{{rewardsGetRakebackInfo.name}}</span>
                    <BoxRank v-bind:rank="rewardsGetRakebackInfo.name" />
                </div>
                <div v-else class="header-unranked">
                    <span>UNRANKED</span>
                    <svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.30664 0.384521C4.8457 0.384521 5.26172 0.542724 5.55469 0.85913C5.84766 1.1814 5.99414 1.64722 5.99414 2.25659C5.99414 2.83667 5.84766 3.28198 5.55469 3.59253C5.26172 3.90308 4.8457 4.05835 4.30664 4.05835C3.7793 4.05835 3.36621 3.89722 3.06738 3.57495C2.77441 3.25854 2.62793 2.81909 2.62793 2.25659C2.62793 1.67651 2.77441 1.21948 3.06738 0.885497C3.36035 0.551513 3.77344 0.384521 4.30664 0.384521ZM11.25 0.384521C11.7832 0.384521 12.1963 0.545654 12.4893 0.86792C12.7822 1.19019 12.9287 1.65308 12.9287 2.25659C12.9287 2.83667 12.7822 3.28198 12.4893 3.59253C12.1963 3.90308 11.7832 4.05835 11.25 4.05835C10.7227 4.05835 10.3096 3.90015 10.0107 3.58374C9.71191 3.26733 9.5625 2.82495 9.5625 2.25659C9.5625 1.65894 9.71191 1.19604 10.0107 0.86792C10.3096 0.545654 10.7227 0.384521 11.25 0.384521Z" />
                        <path d="M7.96289 5.48218C9.66211 5.48218 11.1943 5.69019 12.5596 6.1062C13.9248 6.52222 15.0908 7.13452 16.0576 7.94312L16.0576 10.8083C15.0322 10.0701 13.8252 9.50171 12.4365 9.10327C11.0479 8.70483 9.5625 8.50561 7.98047 8.50561C6.45117 8.50561 4.99805 8.69897 3.62109 9.08569C2.25 9.47241 1.04297 10.0408 -4.54872e-07 10.7908L-3.30397e-07 7.94311C0.925781 7.14038 2.0625 6.52808 3.41016 6.1062C4.75781 5.69019 6.27539 5.48218 7.96289 5.48218Z" />
                    </svg>
                </div>
            </div>
            <div class="inner-info">
                Increase your tier to earn more gems!<br>
                You currently earn <span>{{rewardsGetRakebackInfo === null ? '0.00' : rewardsGetRakebackInfo.percentage}}%</span> rakeback on all bets
            </div>
            <div class="inner-bar">
                <div class="bar-progress" v-bind:style="{ 'width': rewardsGetRakebackProgress + '%' }"></div>
            </div>
            <div class="inner-bottom">
                <button v-on:click="rewardsClaimButton()" class="button-claim" v-bind:disabled="socketSendLoading !== null">
                    <div class="button-inner">CLAIM</div>
                </button>
                <div class="bottom-earnings">
                    <span>Available Earnings</span>
                    <div class="earnings-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="coin" />
                        <div class="amount-value">
                            <span>{{rewardsFormatValue(authUser.user.rakeback.available).split('.')[0]}}</span>.{{rewardsFormatValue(authUser.user.rakeback.available).split('.')[1]}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import BoxRank from '@/components/BoxRank';

    export default {
        name: 'RewardsRakeback',
        components: {
            BoxRank
        },
        methods: {
            ...mapActions([
                'rakebackSendClaimSocket'
            ]),
            rewardsFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            rewardsClaimButton() {
                const data = {};
                this.rakebackSendClaimSocket(data);
            }
        },  
        computed: {
            ...mapGetters([
                'authUser', 
                'socketSendLoading'
            ]),
            rewardsGetRakebackInfo() {
                const xp = this.authUser.user.xp / 1000;
                let info = null;

                if(xp >= 100000 && xp < 250000) { info = { name: 'bronze', percentage: 0.05 }; }
                else if(xp >= 250000 && xp < 500000) { info = { name: 'silver', percentage: 0.1 }; }
                else if(xp >= 500000 && xp < 1000000) { info = { name: 'gold', percentage: 0.15 }; }
                else if(xp >= 1000000 && xp < 2000000) { info = { name: 'platinum', percentage: 0.2 }; }
                else if(xp >= 2000000) { info = { name: 'titanium', percentage: 0.25 }; }

                return info;
            },
            rewardsGetRakebackProgress() {
                let progress = 0;

                if(this.rewardsGetRakebackInfo !== null) { progress = 100 / 0.25 * this.rewardsGetRakebackInfo.percentage; }

                return progress;
            }
        }
    }
</script>

<style scoped>
    .rewards-rakeback {
        width: calc(50% - 6px);
        height: 208px;
        position: relative;
        padding: 1px;
        border-radius: 36px;
        background: linear-gradient(0deg, rgba(252, 163, 17, 0.35) 0%, rgba(252, 163, 17, 0.2) 100%);
    }
    
    .rewards-rakeback .rakeback-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 22px 20px 22px 185px;
        border-radius: 36px;
        background: linear-gradient(0deg, rgba(252, 163, 17, 0.12) 0%, rgba(0, 0, 0, 0) 100%), 
                    radial-gradient(50% 40% at 50% 0%, rgba(252, 163, 17, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(90deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.15) 100%), 
                    linear-gradient(270deg, rgba(3, 26, 46, 0.05) 50%, rgba(70, 99, 122, 0.05) 100%), #021c30;
    }

    .rewards-rakeback .inner-image {
        width: 186px;
        height: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
    }

    .rewards-rakeback .inner-header {
        display: flex;
        align-items: center;
    }

    .rewards-rakeback .inner-header span {
        margin-right: 8px;
        font-size: 26px;
        font-weight: 900;
        color: #fca311;
    }

    .rewards-rakeback .header-rank,
    .rewards-rakeback .header-unranked {
        display: flex;
        align-items: center;
    }

    .rewards-rakeback .header-rank span,
    .rewards-rakeback .header-unranked span {
        text-transform: uppercase;
        font-style: italic;
        font-size: 14px;
        font-weight: 600;
        color: #db7d48;
    }

    .rewards-rakeback .header-rank.rank-bronze span {
        background: linear-gradient(255deg, #d0833f 0%, #a3a3b4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .rewards-rakeback .header-rank.rank-silver span {
        background: linear-gradient(255deg, #c0c0c0 0%, #a3a3b4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .rewards-rakeback .header-rank.rank-gold span {
        background: linear-gradient(255deg, #ffa24b 0%, #a3a3b4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .rewards-rakeback .header-rank.rank-platinum span {
        background: linear-gradient(255deg, #0c88ff 0%, #a3a3b4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .rewards-rakeback .header-rank.rank-titanium span {
        background: linear-gradient(255deg, #8674f2 0%, #a3a3b4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .rewards-rakeback .inner-info {
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
    }

    .rewards-rakeback .inner-info span {
        color: #02be81;
    }

    .rewards-rakeback .inner-bar {
        width: 280px;
        height: 5px;
        border-radius: 2px;
        background: rgba(253, 168, 14, 0.05);
    }

    .rewards-rakeback .bar-progress {
        height: 100%;
        border-radius: 2px;
        background: #fda80e;
    }

    .rewards-rakeback .inner-bottom {
        display: flex;
        align-items: center;
    }

    .rewards-rakeback button.button-claim {
        width: 86px;
        height: 42px;
        margin-right: 14px;
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


    .rewards-rakeback button.button-claim .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
        background: #fca311;
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .rewards-rakeback .bottom-earnings {

    }

    .rewards-rakeback .bottom-earnings span {
        font-size: 14px;
        font-weight: 600;
        color: #fca311;
    }

    .rewards-rakeback .earnings-amount {
        display: flex;
        align-items: center;
        margin-top: 3px;
    }

    .rewards-rakeback .earnings-amount img {
        width: 16px;
        height: 16px;
        margin-right: 6px;
    }

    .rewards-rakeback .amount-value {
        width: 14px;
        margin-right: 6px;
    }

    .rewards-rakeback .amount-value {
        font-size: 12px;
        font-weight: 500;
        color: #c1c1c1;
    }

    .rewards-rakeback .amount-value span {
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
    }

    @media only screen and (max-width: 1150px) {

        .rewards-rakeback {
            width: 100%;
        }

    }

    @media only screen and (max-width: 600px) {

        .rewards-rakeback .rakeback-inner {
            padding: 22px 20px 22px 35px;
        }

        .rewards-rakeback .inner-image {
            display: none;
        }

    }
</style>