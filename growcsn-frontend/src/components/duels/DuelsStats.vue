<template>
    <div class="duels-stats">
        <div class="stats-animation">
            <div v-on:click="duelsSetFilterAnimation(duelsFilterAnimation === 'fast' ? 'normal' : 'fast')" class="animation-toggle" v-bind:class="{ 'toggle-active': duelsFilterAnimation === 'fast' }"></div>
            FAST ANIMATION
        </div>
        <div class="stats-info">
            <div class="info-buy">
                YOUR BUY IN
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="buy-value">
                    <span>{{duelsFormatValue(duelsGetStats.bet).split('.')[0]}}</span>.{{duelsFormatValue(duelsGetStats.bet).split('.')[1]}}
                </div>
            </div>
            <div class="info-winnings">
                <span class="gradient-green">POTENTIAL WINNINGS</span>
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="winnings-value">
                    <span>{{duelsFormatValue(duelsGetStats.potential).split('.')[0]}}</span>.{{duelsFormatValue(duelsGetStats.potential).split('.')[1]}}
                </div>
            </div>
            <div class="info-edge">
                HOUSE EDGE
                <div class="edge-value">
                    <span>5</span>.00%
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'DuelsStats',
        methods: {
            ...mapActions([
                'duelsSetFilterAnimation'
            ]),
            duelsFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        },
        computed: {
            ...mapGetters([
                'authUser', 
                'duelsFilterAnimation', 
                'duelsGames'
            ]),
            duelsGetStats() {
                let stats = { bet: 0, potential: 0 };

                for(const game of this.duelsGames) {
                    if(this.authUser.user !== null && game.bets.some((element) => element.user._id === this.authUser.user._id) === true) {
                        let betAmount = 0;
                        let potentialAmount = Math.floor(game.amount * game.playerCount * 0.95);

                        for(const bet of game.bets) {
                            if(this.authUser.user._id === bet.user._id) {
                                betAmount = Math.floor(betAmount + bet.amount);
                                potentialAmount = Math.floor(potentialAmount - bet.amount);
                            }
                        }

                        stats.bet = Math.floor(stats.bet + betAmount);
                        stats.potential = Math.floor(stats.potential + potentialAmount);
                    }
                }

                return stats;
            }
        }
    }
</script>

<style scoped>
    .duels-stats {
        width: 1160px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 30px;
    }

    .duels-stats .stats-animation {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: #5e768e;
    }

    .duels-stats .animation-toggle {
        width: 45px;
        height: 15px;
        position: relative;
        margin-right: 12px;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
        cursor: pointer;
    }

    .duels-stats .animation-toggle::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #000d16;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .duels-stats .animation-toggle::after {
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

    .duels-stats .animation-toggle.toggle-active::after {
        transform: translate(20px, 0);
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
    }

    .duels-stats .stats-info {
        display: flex;
        align-items: center;
    }

    .duels-stats .info-buy,
    .duels-stats .info-winnings,
    .duels-stats .info-edge {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
    }

    .duels-stats .info-buy,
    .duels-stats .info-winnings {
        position: relative;
        margin-right: 15px;
        padding-right: 15px;
    }

    .duels-stats .info-buy::before,
    .duels-stats .info-winnings::before {
        content: '';
        width: 1px;
        height: 24px;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(0, -50%);
        background-color: #144468;
    }

    .duels-stats .info-winnings span {
        font-weight: 700;
    }

    .duels-stats .info-buy img,
    .duels-stats .info-winnings img {
        width: 19px;
        height: 19px;
        margin-left: 12px;
    }

    .duels-stats .buy-value,
    .duels-stats .winnings-value,
    .duels-stats .edge-value {
        margin-left: 8px;
        font-size: 10px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .duels-stats .edge-value {
        margin-left: 12px;
    }

    .duels-stats .buy-value span,
    .duels-stats .winnings-value span,
    .duels-stats .edge-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 1180px) {

        .duels-stats {
            width: 100%;
        }

    }

    @media only screen and (max-width: 950px) {

        .duels-stats {
            flex-direction: column-reverse;
            align-items: flex-start;
        }

        .duels-stats .stats-animation {
            margin-top: 20px;
        }

    }
</style>
