<template>
    <div class="duels-games">
        <div class="games-my">
            <div class="my-header">
                <div class="header-title">
                    <span class="gradient-green">MY GAMES</span>
                    ({{duelsGetGames.user.length}})
                </div>
            </div>
            <div class="my-content">
                <transition name="fade" mode="out-in">
                    <div v-if="socketDuels.connected === false" class="content-loading" key="loading">

                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>

                    </div>
                    <div v-else-if="duelsGetGames.user.length > 0" class="content-list" key="data">

                        <DuelsGamesElement v-for="game of duelsGetGames.user" v-bind:key="game._id" v-bind:game="game" />

                    </div>
                    <div v-else class="content-empty" key="empty">You dont have any active duels. Start by creating one!</div>
                </transition>
            </div>
        </div>
        <div class="games-all">
            <div class="all-header">
                <div class="header-title">
                    <span>ALL GAMES</span>
                    ({{duelsGetGames.all.length}})
                </div>
                <div class="header-actions">
                    <DuelsFilterSort />
                </div>
            </div>
            <div class="all-content">
                <transition name="fade" mode="out-in">
                    <div v-if="socketDuels.connected === false" class="content-loading" key="loading">

                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>

                    </div>
                    <div v-else-if="duelsGetGames.all.length > 0" class="content-list" key="data">

                        <DuelsGamesElement v-for="game of duelsGetGames.all" v-bind:key="game._id" v-bind:game="game" />

                    </div>
                    <div v-else class="content-empty" key="empty">There are no duels. Be the first by creating one!</div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import DuelsFilterSort from '@/components/duels/DuelsFilterSort';
    import DuelsGamesElement from '@/components/duels/DuelsGamesElement';

    export default {
        name: 'DuelsGames',
        components: {
            DuelsFilterSort,
            DuelsGamesElement
        },
        methods: {

        },
        computed: {
            ...mapGetters([
                'socketDuels', 
                'authUser', 
                'duelsFilterSort', 
                'duelsGames', 
                'duelsHistory'
            ]),
            duelsGetGames() {
                let games = { user: [], all: [] };

                for(const game of this.duelsGames) {
                    if(this.authUser.user !== null && game.bets.some((element) => element.user._id === this.authUser.user._id) === true) {
                        games.user.push(game);
                    } else {
                        games.all.push(game);
                    }
                }

                if(this.duelsFilterSort === 'HIGHEST PRICE') { games.all.sort(function(a, b) { return b.amount - a.amount; }); }
                else if(this.duelsFilterSort === 'LOWEST PRICE') { games.all.sort(function(a, b) { return a.amount - b.amount; }); }
                else if(this.duelsFilterSort === 'PARTICIPANTS') { games.all.sort(function(a, b) { return b.bets.length - a.bets.length; }); }
                else { games.all.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); }); }

                games.all = [...games.all, ...this.duelsHistory];

                return games;
            }
        }
    }
</script>

<style scoped>
    .duels-games {
        width: 1160px;
        margin-top: 30px;
    }

    .duels-games .games-my,
    .duels-games .games-all {
        width: 100%;
    }

    .duels-games .games-all {
        margin-top: 26px;
        padding-bottom: 20px;
        border-bottom: 1px solid #0c324e;
    }

    .duels-games .my-header,
    .duels-games .all-header {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .duels-games .my-header::before,
    .duels-games .all-header::before {
        content: '';
        height: 1px;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(0, -50%);
        background-color: #0c324e;
    }

    .duels-games .my-header::before {
        left: 120px;
    }

    .duels-games .all-header::before {
        left: 125px;
        right: 177px;
    }

    .duels-games .header-title {
        font-size: 12px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .duels-games .header-title span {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    .duels-games .header-actions {
        display: flex;
        align-items: center;
    }

    .duels-games .header-actions button.button-history {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: #5e768e;
        transition: color 0.3s ease;
    }

    .duels-games .header-actions button.button-history:hover {
        color: #ffffff;
    }

    .duels-games .header-actions button.button-history svg {
        margin-right: 8px;
        fill: #5e768e;
        transition: fill 0.3s ease;
    }

    .duels-games .header-actions button.button-history:hover svg {
        fill: #ffffff;
    }

    .duels-games .my-content {
        width: 100%;
        min-height: 75px;
        display: flex;
        flex-wrap: wrap;
        margin-top: 25px;
    }

    .duels-games .all-content {
        max-height: 409px;
        margin-top: 25px;
        margin-right: -25px;
        padding-right: 20px;
        overflow-y: scroll;
    }

    .duels-games .all-content::-webkit-scrollbar {
        width: 5px;
        height: 0;
    }

    .duels-games .all-content::-webkit-scrollbar-track {
        background-color: #0e3351;
    }

    .duels-games .all-content::-webkit-scrollbar-thumb {
        background-color: #517795;
    }

    .duels-games .content-loading {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .duels-games .content-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .duels-games .content-loading.fade-leave-to {
        opacity: 0;
    }

    .duels-games .loading-placeholder {
        width: calc(33.33% - 13.33px);
        height: 123px;
        position: relative;
        margin-top: 0;
        margin-right: 20px;
        border-radius: 15px;
        overflow: hidden;
        background: radial-gradient(285% 150% at 50% 50%, #001323 0%, #000e1a 100%);
    }

    .duels-games .loading-placeholder::after {
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

    .duels-games .loading-placeholder:nth-child(3n) {
        margin-right: 0;
    }

    .duels-games .content-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .duels-games .content-empty {
        width: 100%;
        height: 75px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
        background-color: rgba(2, 21, 39, 0.5);
    }

    .duels-games .content-list.fade-enter-active,
    .duels-games .content-empty.fade-enter-active {
        transition: opacity 0.5s;
    }

    .duels-games .content-list.fade-enter-from,
    .duels-games .content-empty.fade-enter-from {
        opacity: 0;
    }

    @keyframes loading_animation {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(100%); }
    }

    @media only screen and (max-width: 1250px) {

        .duels-games .all-content {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 1180px) {

        .duels-games {
            width: 100%;
        }

    }

    @media only screen and (max-width: 1050px) {

        .duels-games .loading-placeholder {
            width: calc(50% - 10px);
        }

        .duels-games .loading-placeholder:nth-child(3n) {
            margin-top: 20px;
            margin-right: 20px;
        }

        .duels-games .loading-placeholder:nth-child(2n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 700px) {

        .duels-games .loading-placeholder {
            width: 100%;
            margin-right: 0!important;
        }

        .duels-games .loading-placeholder:nth-child(2) {
            margin-top: 20px;
        }

    }
</style>
