<template>
    <div class="blackjack-overview">
        <div class="overview-standard">
            <div class="standard-header">
                <div class="header-title">
                    <IconUserGradient />
                    <span class="gradient-green">STANDARD TABLES</span>
                    <div class="title-limits">
                        (
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="limits-value">
                            <span>0</span>.10 <span>- 1,000</span>.00
                        </div>
                        )
                    </div>
                </div>
                <router-link to="/blackjack/tables" class="link-all">
                    <IconTables />
                    VIEW ALL TABLES
                </router-link>
            </div>
            <div class="standard-content">
                <transition name="fade" mode="out-in">
                    <div v-if="socketBlackjack.connected === false" class="content-loading" key="loading">

                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>

                    </div>
                    <div v-else class="content-list" key="data">

                        <BlackjackTablesElement v-for="table of blackjackGetTables.standard.slice(0, 10)" v-bind:key="table.table" v-bind:table="table" />

                    </div>
                </transition>
            </div>
        </div>
        <div class="overview-whale">
            <div class="whale-header">
                <div class="header-title">
                    <IconWhaleGradient />
                    <span class="gradient-yellow">WHALE TABLES</span>
                    <div class="title-limits">
                        (
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="limits-value">
                            <span>50</span>.00 <span>- 1,000</span>.00
                        </div>
                        )
                    </div>
                </div>
            </div>
            <div class="whale-content">
                <transition name="fade" mode="out-in">
                    <div v-if="socketBlackjack.connected === false" class="content-loading" key="loading">

                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>

                    </div>
                    <div v-else class="content-list" key="data">

                        <BlackjackTablesElement v-for="table of blackjackGetTables.whale" v-bind:key="table.table" v-bind:table="table" />

                    </div>
                </transition>
            </div>
        </div>

        <Bets />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import Bets from '@/components/bets/Bets';
    import IconTables from '@/components/icons/IconTables';
    import IconUserGradient from '@/components/icons/IconUserGradient';
    import IconWhaleGradient from '@/components/icons/IconWhaleGradient';
    import BlackjackTablesElement from '@/components/blackjack/BlackjackTablesElement';

    export default {
        name: 'BlackjackOverview',
        components: {
            Bets,
            IconTables,
            IconUserGradient,
            IconWhaleGradient,
            BlackjackTablesElement
        },
        computed: {
            ...mapGetters(['socketBlackjack', 'blackjackTables']),
            blackjackGetTables() {
                let tables = { standard: [], whale: [] };

                for(const table of this.blackjackTables) {
                    if(table.game.type === 'standard') { tables.standard.push(table); }
                    else { tables.whale.push(table); }
                }

                return tables;
            }
        }
    }
</script>

<style scoped>
    .blackjack-overview {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 45px 10px;
    }

    .blackjack-overview .overview-standard,
    .blackjack-overview .overview-whale {
        width: 1300px;
    }

    .blackjack-overview .overview-whale {
        margin-top: 50px;
    }

    .blackjack-overview .standard-header,
    .blackjack-overview .whale-header {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 25px;
        border-bottom: 1px solid #133047;
    }

    .blackjack-overview .header-title {
        display: flex;
        align-items: center;
    }

    .blackjack-overview .header-title svg {
        margin-right: 12px;
    }

    .blackjack-overview .header-title span {
        font-size: 28px;
        font-weight: 900;
    }

    .blackjack-overview .title-limits {
        display: flex;
        align-items: center;
        margin-left: 15px;
        /* font-family: 'Rubik', sans-serif; */
        font-weight: 400;
        font-size: 28px;
        color: #c1c1c1;
    }

    .blackjack-overview .limits-value {
        /* font-family: 'Open Sans', sans-serif; */
        font-size: 12px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .blackjack-overview .limits-value span {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    .blackjack-overview .title-limits img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
    }

    .blackjack-overview .standard-header a.link-all {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: #607c92;
    }

    .blackjack-overview .standard-header a.link-all svg {
        margin-right: 10px;
        display: flex;
        align-items: center;
        fill: #607c92;
    }

    .blackjack-overview .standard-content,
    .blackjack-overview .whale-content {
        margin: 25px -25px 0 -25px;
    }

    .blackjack-overview .content-loading {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .blackjack-overview .content-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .blackjack-overview .content-loading.fade-leave-to {
        opacity: 0;
    }

    .blackjack-overview .loading-placeholder {
        width: calc(20% - 8px);
        height: 150px;
        position: relative;
        margin-top: 10px;
        margin-right: 10px;
        overflow: hidden;
        background: radial-gradient(285% 150% at 50% 50%, #001323 0%, #000e1a 100%);
        clip-path: polygon(25px 0, calc(100% - 25px) 0, 100% 25%, 100% 75%, calc(100% - 25px) 100%, 25px 100%, 0 75%, 0 25%);
    }

    .blackjack-overview .loading-placeholder:nth-child(1),
    .blackjack-overview .loading-placeholder:nth-child(2),
    .blackjack-overview .loading-placeholder:nth-child(3),
    .blackjack-overview .loading-placeholder:nth-child(4),
    .blackjack-overview .loading-placeholder:nth-child(5) {
        margin-top: 0;
    }

    .blackjack-overview .loading-placeholder:nth-child(5n) {
        margin-right: 0;
    }

    .blackjack-overview .loading-placeholder::after {
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

    .blackjack-overview .content-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .blackjack-overview .content-list.fade-enter-active {
        transition: opacity 0.5s;
    }

    .blackjack-overview .content-list.fade-enter-from {
        opacity: 0;
    }

    @keyframes loading_animation {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(100%); }
    }

    @media only screen and (max-width: 1700px) {

        .blackjack-overview .overview-standard,
        .blackjack-overview .overview-whale {
            width: 100%;
        }

        .blackjack-overview .standard-content,
        .blackjack-overview .whale-content {
            margin: 25px 0 0 0;
        }

    }

    @media only screen and (max-width: 1050px) {

        .blackjack-overview .loading-placeholder {
            width: calc(25% - 7.5px);
        }

        .blackjack-overview .loading-placeholder:nth-child(5) {
            margin-top: 10px;
        }

        .blackjack-overview .loading-placeholder:nth-child(5n) {
            margin-right: 10px;
        }

        .blackjack-overview .loading-placeholder:nth-child(4n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 950px) {

        .blackjack-overview {
            padding: 25px 10px 443px 10px;
        }

    }

    @media only screen and (max-width: 900px) {

        .blackjack-overview .loading-placeholder {
            width: calc(33.33% - 6.66px);
        }

        .blackjack-overview .loading-placeholder:nth-child(4) {
            margin-top: 10px;
        }

        .blackjack-overview .loading-placeholder:nth-child(4n) {
            margin-right: 10px;
        }

        .blackjack-overview .loading-placeholder:nth-child(3n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 850px) {

        .blackjack-overview .standard-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .blackjack-overview .standard-header a.link-all {
            margin-top: 20px;
        }

    }

    @media only screen and (max-width: 700px) {

        .blackjack-overview .loading-placeholder {
            width: calc(50% - 5px);
        }

        .blackjack-overview .loading-placeholder:nth-child(3) {
            margin-top: 10px;
        }

        .blackjack-overview .loading-placeholder:nth-child(3n) {
            margin-right: 10px;
        }

        .blackjack-overview .loading-placeholder:nth-child(2n) {
            margin-right: 0;
        }

    }
</style>
