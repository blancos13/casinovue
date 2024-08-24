<template>
    <div class="battles-game" v-bind:class="['game-' + battlesGetPlayerCount, 'game-' + (battlesGameData.game !== null ? battlesGameData.game.state : '')]">
        <transition name="fade" mode="out-in">
            <div v-if="socketBattles.connected === false || battlesGameData.loading === true" class="game-loading" key="loading">
                <div class="loading-element"></div>
                <div class="loading-bets">
                    <div class="bets-element"></div>
                    <div class="bets-element"></div>
                </div>
            </div>
            <div v-else class="game-content" key="data">
                <BattlesSpinner />

                <div class="content-bets">

                    <BattlesBetElement v-for="(bet, index) in battlesGetBets" v-bind:key="index" v-bind:pos="index" v-bind:bet="bet" />

                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import BattlesSpinner from '@/components/battles/BattlesSpinner';
    import BattlesBetElement from '@/components/battles/BattlesBetElement';

    export default {
        name: 'BattlesGame',
        components: {
            BattlesSpinner,
            BattlesBetElement
        },
        methods: {
            ...mapActions([
                'battlesSetGameData',
                'battlesGetGameDataSocket'
            ])
        },
        computed: {
            ...mapGetters([
                'socketBattles',
                'battlesGames',
                'battlesHistory',
                'battlesGameData'
            ]),
            battlesGetPlayerCount() {
                let count = 2;

                if(this.battlesGameData.game !== null) { count = this.battlesGameData.game.playerCount; }

                return count;
            },
            battlesGetBets() {
                let bets = [];

                for(let bet = 0; bet < this.battlesGameData.game.playerCount; bet++) {
                    const index = this.battlesGameData.game.bets.findIndex((element) => element.slot === bet);

                    bets.push(index !== -1 ? this.battlesGameData.game.bets[index] : null);
                }

                return bets;
            }
        },
        watch: {
            'socketBattles.connected': {
                handler() {
                    if(this.socketBattles.connected === true) {
                        const data = { gameId: this.$route.params.gameId };
                        this.battlesGetGameDataSocket(data);
                    }
                }
            }
        },
        created() {
            const data = { gameId: this.$route.params.gameId };
            this.battlesGetGameDataSocket(data);
        },
        beforeRouteUpdate(to, from) {
            const data = { gameId: to.params.gameId };
            this.battlesGetGameDataSocket(data);
        }
    }
</script>

<style scoped>
    .battles-game {
        width: 100%;
        margin-top: 15px;
    }

    .battles-game .game-loading {
        width: 100%;
    }

    .battles-game .game-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .battles-game .game-loading.fade-leave-to {
        opacity: 0;
    }

    .battles-game .loading-bets {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 35px;
        padding-top: 35px;
        border-top: 1px solid rgba(28, 71, 182, 0.15);
    }

    .battles-game .loading-element {
        width: 100%;
        height: 274px;
        position: relative;
        background: rgba(2, 21, 36, 0.35);
        clip-path: polygon(24px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(50% - 8px), calc(100% - 8px) 50%, 100% calc(50% + 8px), 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 24px), 0 calc(50% + 8px), 8px 50%, 0 calc(50% - 8px), 0 24px);
    }

    .battles-game .bets-element {
        width: calc(50% - 9px);
        height: 400px;
        position: relative;
        background: rgba(2, 21, 36, 0.35);
        overflow: hidden;
    }

    .battles-game .loading-element:after,
    .battles-game .bets-element:after {
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

    .battles-game .game-content {
        width: 100%;
    }

    .battles-game .game-content.fade-enter-active {
        transition: opacity 0.5s;
    }

    .battles-game .game-content.fade-enter-from {
        opacity: 0;
    }

    .battles-game .content-bets {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 35px;
        padding-top: 35px;
        border-top: 1px solid rgba(28, 71, 182, 0.15);
    }

    @keyframes loading_animation {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(100%); }
    }
</style>