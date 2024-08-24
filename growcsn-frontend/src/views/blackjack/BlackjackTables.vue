<template>
    <div class="blackjack-tables">
        <div class="tables-header">

            <div class="header-left">
                <router-link to="/blackjack" class="link-back">
                    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 16.18L8 0.820004C8 0.0931494 7.24623 -0.277135 6.79868 0.244006L0.203166 7.92398C-0.0677208 8.23941 -0.0677208 8.76055 0.203166 9.07611L6.79867 16.7561C7.24623 17.2771 8 16.9068 8 16.18Z" />
                        <rect x="6" y="5" width="12" height="7" rx="1" />
                    </svg>
                </router-link>
                <div class="left-title">
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
            </div>

            <div class="header-available">
                SHOW AVAILABLE LOBBIES
                <div v-on:click="blackjackToggleShowAvailable" class="available-toggle" v-bind:class="{ 'toggle-active': blackjackShowAvailable === true }"></div>
            </div>

        </div>
        <div class="tables-content">
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

                    <BlackjackTablesElement v-for="table of blackjackGetTables.standard" v-bind:key="table.table" v-bind:table="table" />

                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconUserGradient from '@/components/icons/IconUserGradient';
    import BlackjackTablesElement from '@/components/blackjack/BlackjackTablesElement';

    export default {
        name: 'BlackjackTables',
        components: {
            IconUserGradient,
            BlackjackTablesElement
        },
        data() {
            return {
                blackjackShowAvailable: false
            }
        },
        methods: {
            blackjackToggleShowAvailable() {
                this.blackjackShowAvailable = !this.blackjackShowAvailable;
            }
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
    .blackjack-tables {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 45px 10px;
    }

    .blackjack-tables .tables-header {
        width: 1300px;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 25px;
        border-bottom: 1px solid #133047;
    }

    .blackjack-tables .header-left {
        display: flex;
        align-items: center;
    }

    .blackjack-tables .header-left a.link-back {
        margin-right: 20px;
    }

    .blackjack-tables .header-left a.link-back svg {
        fill: #c1c1c1;
    }

    .blackjack-tables .left-title {
        display: flex;
        align-items: center;
    }

    .blackjack-tables .left-title svg {
        margin-right: 12px;
    }

    .blackjack-tables .left-title span {
        font-size: 28px;
        font-weight: 900;
    }

    .blackjack-tables .title-limits {
        display: flex;
        align-items: center;
        margin-left: 15px;
        /* font-family: 'Rubik', sans-serif; */
        font-weight: 400;
        font-size: 28px;
        color: #c1c1c1;
    }

    .blackjack-tables .limits-value {
        /* font-family: 'Open Sans', sans-serif; */
        font-size: 12px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .blackjack-tables .limits-value span {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    .blackjack-tables .title-limits img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
    }

    .blackjack-tables .header-available {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 700;
        color: #607c92;
    }

    .blackjack-tables .available-toggle {
        width: 45px;
        height: 15px;
        position: relative;
        margin-left: 12px;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
        cursor: pointer;
    }

    .blackjack-tables .available-toggle::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #000d16;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .blackjack-tables .available-toggle::after {
        content: '';
        width: 25px;
        height: 19px;
        position: absolute;
        top: -2px;
        left: 0;
        background: #1c5064;
        clip-path: polygon(3px 0, calc(100% - 3px) 0, 100% 25%, 100% 75%, calc(100% - 3px) 100%, 3px 100%, 0 75%, 0 25%);
        transition: all 0.3s ease;
    }

    .blackjack-tables .available-toggle.toggle-active::after {
        transform: translate(20px, 0);
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
    }

    .blackjack-tables .tables-content {
        width: 1300px;
        margin: 25px -25px 0 -25px;
    }

    .blackjack-tables .content-loading {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .blackjack-tables .content-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .blackjack-tables .content-loading.fade-leave-to {
        opacity: 0;
    }

    .blackjack-tables .loading-placeholder {
        width: calc(20% - 8px);
        height: 150px;
        position: relative;
        margin-top: 10px;
        margin-right: 10px;
        overflow: hidden;
        background: radial-gradient(285% 150% at 50% 50%, #001323 0%, #000e1a 100%);
        clip-path: polygon(25px 0, calc(100% - 25px) 0, 100% 25%, 100% 75%, calc(100% - 25px) 100%, 25px 100%, 0 75%, 0 25%);
    }

    .blackjack-tables .loading-placeholder:nth-child(1),
    .blackjack-tables .loading-placeholder:nth-child(2),
    .blackjack-tables .loading-placeholder:nth-child(3),
    .blackjack-tables .loading-placeholder:nth-child(4),
    .blackjack-tables .loading-placeholder:nth-child(5) {
        margin-top: 0;
    }

    .blackjack-tables .loading-placeholder:nth-child(5n) {
        margin-right: 0;
    }

    .blackjack-tables .loading-placeholder::after {
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

    .blackjack-tables .content-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .blackjack-tables .content-list.fade-enter-active {
        transition: opacity 0.5s;
    }

    .blackjack-tables .content-list.fade-enter-from {
        opacity: 0;
    }

    @keyframes loading_animation {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(100%); }
    }

    @media only screen and (max-width: 1700px) {

        .blackjack-tables .tables-header {
            width: 100%;
        }

        .blackjack-tables .tables-content {
            width: 100%;
        }

    }

    @media only screen and (max-width: 1050px) {

        .blackjack-tables .loading-placeholder {
            width: calc(25% - 7.5px);
        }

        .blackjack-tables .loading-placeholder:nth-child(5) {
            margin-top: 10px;
        }

        .blackjack-tables .loading-placeholder:nth-child(5n) {
            margin-right: 10px;
        }

        .blackjack-tables .loading-placeholder:nth-child(4n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 950px) {

        .blackjack-tables {
            padding: 25px 10px 45px 10px;
        }

    }

    @media only screen and (max-width: 900px) {

        .blackjack-tables .loading-placeholder {
            width: calc(33.33% - 6.66px);
        }

        .blackjack-tables .loading-placeholder:nth-child(4) {
            margin-top: 10px;
        }

        .blackjack-tables .loading-placeholder:nth-child(4n) {
            margin-right: 10px;
        }

        .blackjack-tables .loading-placeholder:nth-child(3n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 850px) {

        .blackjack-tables .tables-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .blackjack-tables .header-available {
            margin-top: 20px;
        }

    }

    @media only screen and (max-width: 700px) {

        .blackjack-tables .loading-placeholder {
            width: calc(50% - 5px);
        }

        .blackjack-tables .loading-placeholder:nth-child(3) {
            margin-top: 10px;
        }

        .blackjack-tables .loading-placeholder:nth-child(3n) {
            margin-right: 10px;
        }

        .blackjack-tables .loading-placeholder:nth-child(2n) {
            margin-right: 0;
        }

    }
</style>
