<template>
    <div class="battles-header-overview">
        <div class="overview-title">
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.05531 11.2261L8.94249 15.0407L7.38828 16.5662L8.94469 18.0927L7.38938 19.6181L4.66703 16.9481L1.55531 20L0 18.4746L3.11172 15.4215L0.389378 12.7526L1.94469 11.2271L3.5 12.7515L5.05531 11.2261ZM0.600566 0L4.50094 0.00323644L17.4989 12.7526L19.0553 11.2271L20.6106 12.7526L17.8894 15.4226L21 18.4746L19.4447 20L16.333 16.9481L13.6106 19.6181L12.0553 18.0927L13.6106 16.5662L0.603866 3.80927L0.600566 0ZM16.5024 0L20.3994 0.00323644L20.4016 3.80387L15.9436 8.1752L12.0542 4.36162L16.5024 0Z" fill="white"/>
                <path d="M5.05531 11.2261L8.94249 15.0407L7.38828 16.5662L8.94469 18.0927L7.38938 19.6181L4.66703 16.9481L1.55531 20L0 18.4746L3.11172 15.4215L0.389378 12.7526L1.94469 11.2271L3.5 12.7515L5.05531 11.2261ZM0.600566 0L4.50094 0.00323644L17.4989 12.7526L19.0553 11.2271L20.6106 12.7526L17.8894 15.4226L21 18.4746L19.4447 20L16.333 16.9481L13.6106 19.6181L12.0553 18.0927L13.6106 16.5662L0.603866 3.80927L0.600566 0ZM16.5024 0L20.3994 0.00323644L20.4016 3.80387L15.9436 8.1752L12.0542 4.36162L16.5024 0Z" fill="url(#paint0_linear_3319_16458)"/>
                <defs>
                    <linearGradient id="paint0_linear_3319_16458" x1="60.7566" y1="-0.804659" x2="8.70414" y2="31.7497" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#00FFC2"/>
                        <stop offset="1" stop-color="#00AA6D"/>
                    </linearGradient>
                </defs>
            </svg>
            BATTLES LOBBY
        </div>
        <div class="overview-info">
            <div class="info-amount">
                <div class="amount-container">
                    <div class="container-inner">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="inner-value">
                            <span>{{ battlesFormatValue(battlesGetAmountTotal).split('.')[0] }}</span>.{{ battlesFormatValue(battlesGetAmountTotal).split('.')[1] }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="info-count">
                <span>{{ battlesGames.length }}</span> BATTLES
            </div>
            <div class="info-sort">
                <BattlesFilterSort />
            </div>
        </div>
        <router-link to="/battles/create" class="link-create">
            <div class="link-inner">
                <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.47861 7.85824L6.15342 10.5285L5.08395 11.5963L6.15493 12.6649L5.08471 13.7327L3.21144 11.8636L1.07023 14L0 12.9322L2.14121 10.7951L0.267935 8.9268L1.33816 7.859L2.40839 8.92605L3.47861 7.85824ZM0.413256 0L3.09715 0.00226551L12.0412 8.9268L13.1122 7.859L14.1824 8.9268L12.3099 10.7958L14.4503 12.9322L13.3801 14L11.2389 11.8636L9.36561 13.7327L8.29539 12.6649L9.36561 11.5963L0.415526 2.66649L0.413256 0ZM11.3554 0L14.0371 0.00226551L14.0386 2.66271L10.971 5.72264L8.29463 3.05313L11.3554 0Z" />
                </svg>
                CREATE
            </div>
        </router-link>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import BattlesFilterSort from '@/components/battles/BattlesFilterSort';

    export default {
        name: 'BattlesHeaderOverview',
        components: {
            BattlesFilterSort
        },
        methods: {
            battlesFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        },
        computed: {
            ...mapGetters([
                'battlesGames'
            ]),
            battlesGetAmountTotal() {
                let amount = 0;

                for(const game of this.battlesGames) { amount = Math.floor(amount + game.amount); }

                return amount;
            }
        }
    }
</script>

<style scoped>
    .battles-header-overview {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 20px;
    }

    .battles-header-overview .overview-title {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
    }

    .battles-header-overview .overview-title svg {
        margin-right: 10px;
    }

    .battles-header-overview .overview-info {
        width: calc(100% - 292px);
        display: flex;
        align-items: center;
    }

    .battles-header-overview .info-amount,
    .battles-header-overview .info-count,
    .battles-header-overview .info-sort {
        position: relative;
        display: flex;
        align-items: center;
        margin-left: 25px;
        padding-left: 25px;
    }

    .battles-header-overview .info-amount:before,
    .battles-header-overview .info-count:before,
    .battles-header-overview .info-sort:before {
        content: '';
        width: 1px;
        height: 27px;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
        background: linear-gradient(0deg, rgba(97, 112, 241, 0) 0%, rgba(64, 92, 212, 0.5) 50%, rgba(28, 71, 182, 0) 100%);
    }

    .battles-header-overview .amount-container {
        height: 43px;
        position: relative;
        padding: 1px;
    }

    .battles-header-overview .amount-container:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #0a2943;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .battles-header-overview .container-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 24px;
        background: #04192a;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .battles-header-overview .container-inner img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
    }

    .battles-header-overview .inner-value {
        font-size: 11px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .battles-header-overview .inner-value span {
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
    }

    .battles-header-overview .info-count {
        font-size: 15px;
        font-weight: 800;
        color: #5e768e;
    }

    .battles-header-overview .info-count span {
        color: #0dd4b1;
        margin-right: 5px;
    }

    .battles-header-overview a.link-create {
        width: 118px;
        height: 47px;
        position: relative;
        padding: 1px;
    }
    .battles-header-overview a.link-create:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .battles-header-overview a.link-create:active {
        transition-duration: .2s;
        scale: .9;
    }

    .battles-header-overview a.link-create:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 170, 109, 0) 0%, #00ffc2 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .battles-header-overview a.link-create .link-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .battles-header-overview a.link-create .link-inner svg {
        margin-right: 8px;
        fill: #ffffff;
    }

    @media only screen and (max-width: 1050px) {

        .battles-header-overview {
            display: grid;
            grid-template-columns: auto 118px;
            grid-template-rows: auto auto;
        }

        .battles-header-overview .overview-title {
            grid-row: 1 / 1;
            margin-bottom: 20px;
        }

        .battles-header-overview .overview-info {
            width: auto;
            grid-row: 2 / 2;
            margin-left: 0;
        }

        .battles-header-overview .info-amount {
            margin-left: 0;
            padding-left: 0;
        }

        .battles-header-overview .info-amount:before {
            display: none;
        }

        .battles-header-overview a.link-create {
            grid-row: 2 / 2;
        }

    }

    @media only screen and (max-width: 900px) {

        .battles-header-overview {
            align-items: center;
        }

        .battles-header-overview .overview-title {
            grid-column: 1 / 1;
            grid-row: 1 / 1;
            margin-bottom: 0;
        }

        .battles-header-overview .overview-info {
            grid-column: 1 / 3;
            grid-row: 2 / 2;
            margin-top: 25px;
        }

        .battles-header-overview a.link-create {
            grid-column: 2 / 2;
            grid-row: 1 / 1;
        }

    }

    @media only screen and (max-width: 700px) {

        .battles-header-overview .overview-info {
            flex-wrap: wrap;
        }

        .battles-header-overview .info-sort {
            width: 100%;
            margin-top: 10px;
            margin-left: 0;
            padding-left: 0;
        }

        .battles-header-overview .info-sort:before {
            display: none;
        }

    }
</style>