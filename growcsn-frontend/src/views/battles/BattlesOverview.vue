<template>
    <div class="battles-overview">
        <div class="overview-header">
            <div class="header-players">PLAYERS</div>
            <div class="header-cases">CASES</div>
            <div class="header-right">
                <div class="right-amount">AMOUNT</div>
                <div class="right-action">ACTION</div>
            </div>
        </div>
        <div class="overview-content">
            <transition name="fade" mode="out-in">
                <div v-if="socketBattles.connected === false" class="content-loading" key="loading">

                    <div class="loading-placeholder"></div>
                    <div class="loading-placeholder"></div>
                    <div class="loading-placeholder"></div>
                    <div class="loading-placeholder"></div>

                </div>
                <div v-else-if="battlesGetGames.length > 0" class="content-list" key="data">

                    <BattlesGameElement v-for="game of battlesGetGames" v-bind:key="game._id" v-bind:game="game" />

                </div>
                <div v-else class="content-empty" key="empty">There are no battles.</div>
            </transition>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import BattlesGameElement from '@/components/battles/BattlesGameElement';

    export default {
        name: 'BattlesOverview',
        components: {
            BattlesGameElement
        },
        computed: {
            ...mapGetters([
                'socketBattles',
                'battlesGames',
                'battlesHistory',
                'battlesFilterSortGames'
            ]),
            battlesGetGames() {
                let games = this.battlesGames;

                if(this.battlesFilterSortGames === 'price') { games.sort(function(a, b) { return b.amount - a.amount; }); }
                else { games.sort(function(a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); }); }

                games = [...games, ...this.battlesHistory];

                return games;
            }
        }
    }
</script>

<style scoped>
    .battles-overview {
        width: 100%;
    }

    .battles-overview .overview-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .battles-overview .header-players,
    .battles-overview .header-cases,
    .battles-overview .header-right {
        font-size: 13px;
        font-weight: 700;
        color: #5e768e;
    }

    .battles-overview .header-players {
        width: 450px;
    }

    .battles-overview .header-cases {
        width: calc(100% - 825px);
    }

    .battles-overview .header-right {
        width: 375px;
        display: flex;
        justify-content: space-between;
        padding-left: 25px;
    }

    .battles-overview .header-action {
        display: flex;
        justify-content: flex-end;
    }

    .battles-overview .overview-content {
        width: 100%;
        margin-top: 20px;
    }

    .battles-overview .content-loading,
    .battles-overview .content-list {
        width: 100%;
    }


    .battles-overview .content-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .battles-overview .content-loading.fade-leave-to {
        opacity: 0;
    }

    .battles-overview .loading-placeholder {
        width: 100%;
        height: 95px;
        position: relative;
        margin-top: 8px;
        background: linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.09) 50%, rgba(5, 29, 48, 0.35) 100%);
        border: 1px solid #0a273f;
        overflow: hidden;
    }

    .battles-overview .loading-placeholder:first-child {
        margin-top: 0;
    }

    .battles-overview .loading-placeholder:after {
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

    .battles-overview .content-empty {
        width: 100%;
        height: 220px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
    }

    .battles-overview .content-list.fade-enter-active,
    .battles-overview .content-empty.fade-enter-active {
        transition: opacity 0.5s;
    }

    .battles-overview .content-list.fade-enter-from,
    .battles-overview .content-empty.fade-enter-from {
        opacity: 0;
    }

    @keyframes loading_animation {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(100%); }
    }

    @media only screen and (max-width: 1100px) {

        .battles-overview .header-players {
            width: auto;
        }

        .battles-overview .header-cases,
        .battles-overview .right-amount {
            
            display: none;
        }

        .battles-overview .header-right {
            width: auto;
            padding-left: 0;
        }    

    }
</style>