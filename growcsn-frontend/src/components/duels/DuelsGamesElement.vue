<template>
    <button v-on:click="duelsGameButton" class="duels-games-element" v-bind:class="{ 
        'element-full': game.bets.length >= game.playerCount,
        'element-completed': game.state === 'completed'
    }">
        <div class="element-info">
            <div class="info-bet">
                BET:
                <div class="bet-box">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="box-value">
                        <span>{{duelsFormatValue(game.amount).split('.')[0]}}</span>.{{duelsFormatValue(game.amount).split('.')[1]}}
                    </div>
                    /
                    <div class="box-value">
                        <span>{{duelsFormatValue(Math.floor(game.amount * game.playerCount * 0.95)).split('.')[0]}}</span>.{{duelsFormatValue(Math.floor(game.amount * game.playerCount * 0.95)).split('.')[1]}}
                    </div>
                </div>
            </div>
            <div class="info-creator" v-bind:class="[
                'creator-' + duelsGetRank(game.bets[0].user),
                'creator-' + duelsGetLevelColor(game.bets[0].user)
            ]">
                CREATED BY:
                <div class="creator-avatar">
                    <AvatarImage v-bind:image="game.bets[0].user.avatar" />
                </div>
                <span v-html="game.bets[0].user.username"></span>
            </div>
        </div>
        <div class="element-users">
            <div class="users-inner">
                <IconUserGradient />
                <div v-if="game.bets.length >= game.playerCount" class="inner-full">
                    <span class="gradient-green">{{game.playerCount}}</span>
                </div>
                <div v-else class="inner-waiting">
                    <span>{{game.bets.length}}</span>/{{game.playerCount}}
                </div>
            </div>
            <div class="users-progress" v-bind:style="{ 'height': (100 / game.playerCount) * game.bets.length + '%' }"></div>
        </div>
    </button>
</template>

<script>
    import { mapActions } from 'vuex';
    import IconUserGradient from '@/components/icons/IconUserGradient';
    import AvatarImage from '@/components/AvatarImage';

    export default {
        name: 'DuelsGamesElement',
        components: {
            IconUserGradient,
            AvatarImage
        },
        props: [
            'game'
        ],
        methods: {
            ...mapActions([
                'modalsSetShow', 
                'duelsSetGameData'
            ]),
            duelsFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            duelsGetRank(user) {
                let rank = user.rakeback;

                if(user.rank !== 'user') { rank = user.rank; }

                return rank;
            },
            duelsGetLevelColor(user) {
                let color = '';

                if(user.level >= 2 && user.level < 26) { color = 'blue'; }
                else if(user.level >= 26 && user.level < 51) { color = 'green'; }
                else if(user.level >= 51 && user.level < 76) { color = 'orange'; }
                else if(user.level >= 76 && user.level < 100) { color = 'red'; }
                else if(user.level >= 100) { color = 'purple'; }

                return color;
            },
            duelsGameButton() {
                this.duelsSetGameData(this.game);
                this.modalsSetShow('DuelsGame');
            }
        }
    }
</script>

<style scoped>
    button.duels-games-element {
        width: calc(33.33% - 13.33px);
        height: 123px;
        display: flex;
        justify-content: space-between;
        margin-right: 20px;
        margin-top: 20px;
        border-radius: 15px;
        background: radial-gradient(285% 150% at 50% 50%, #001323 0%, #000e1a 100%);
        box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s ease;
    }

    button.duels-games-element:nth-child(1),
    button.duels-games-element:nth-child(2),
    button.duels-games-element:nth-child(3) {
        margin-top: 0;
    }

    button.duels-games-element:nth-child(3n) {
        margin-right: 0;
    }

    button.duels-games-element.element-completed {
        opacity: 0.6;
    }

    button.duels-games-element:hover {
        transform: scale(1.02);
    }

    button.duels-games-element .element-info {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px 0 18px 12px;
    }

    button.duels-games-element .info-bet,
    button.duels-games-element .info-creator {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: #5e768e;
    }

    button.duels-games-element .bet-box {
        height: 48px;
        display: flex;
        align-items: center;
        margin-left: 15px;
        padding: 0 15px;
        border-radius: 5px;
        font-size: 12px;
        font-weight: 700;
        color: #7a93ac;
        background-color: rgba(14, 49, 75, 0.4);
        border: 1px solid rgba(20, 68, 104, 0.35);
    }

    button.duels-games-element .bet-box img {
        width: 14px;
        height: 14px;
        margin-right: 5px;
    }

    button.duels-games-element .box-value  {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    button.duels-games-element .box-value:first-of-type  {
        margin-right: 5px;
    }

    button.duels-games-element .box-value:last-of-type  {
        margin-left: 5px;
    }

    button.duels-games-element .box-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    button.duels-games-element .creator-avatar {
        width: 26px;
        height: 26px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-left: 12px;
        border-radius: 50%;
        border: 1px solid #9e9e9e;
        overflow: hidden;
    }

    button.duels-games-element .info-creator.creator-blue .creator-avatar {
        border: 1px solid #559ee4;
    }

    button.duels-games-element .info-creator.creator-green .creator-avatar {
        border: 1px solid #b8e92d;
    }

    button.duels-games-element .info-creator.creator-orange .creator-avatar {
        border: 1px solid #fca311;
    }

    button.duels-games-element .info-creator.creator-red .creator-avatar {
        border: 1px solid #ff4e4e;
    }

    button.duels-games-element .info-creator.creator-purple .creator-avatar {
        border: 1px solid #6953f1;
    }

    button.duels-games-element .info-creator.creator-partner .creator-avatar {
        border: 1px solid #eca822;
    }

    button.duels-games-element .info-creator.creator-mod .creator-avatar {
        border: 1px solid #ffb703;
    }

    button.duels-games-element .info-creator.creator-admin .creator-avatar {
        border: 1px solid #00ffc2;
    }

    button.duels-games-element .creator-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    button.duels-games-element .info-creator span {
        margin-left: 10px;
        font-size: 14px;
        font-weight: 400;
        color: #bbbfd0;
    }

    button.duels-games-element .element-users {
        width: 62px;
        height: 100%;
        position: relative;
        display: flex;
        align-items: flex-end;
        border-radius: 15px;
        background: radial-gradient(130% 50% at 50% 50%, #091e2f 0%, #001424 100%);
        overflow: hidden;
        z-index: 1;
    }

    button.duels-games-element.element-full .element-users::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 15px;
        background: linear-gradient(180deg, rgba(0, 255, 194, 0.1) 0%, #01e0a3 100%);
        z-index: -1;
    }

    button.duels-games-element.element-full .element-users::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 15px;
        background-color: #001424;
        z-index: -1;
    }

    button.duels-games-element .users-inner {
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        border-radius: 15px;
    }

    button.duels-games-element.element-full .users-inner {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        top: 1px;
        left: 1px;
        background: radial-gradient(140% 80% at 85% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, rgba(0, 255, 194, 0.05) 0%, rgba(0, 170, 109, 0.05) 100%);
    }

    button.duels-games-element .users-inner svg {
        width: 16px;
        height: 18px;
    }

    button.duels-games-element .inner-full,
    button.duels-games-element .inner-waiting {
        margin-top: 3px;
        font-size: 12px;
        font-weight: 600;
        color: #c1c1c1;
    }

    button.duels-games-element .inner-full span,
    button.duels-games-element .inner-waiting span {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    button.duels-games-element .users-progress {
        width: 100%;
        background-color: #15334a;
    }

    button.duels-games-element.element-full .users-progress {
        display: none;
    }

    @media only screen and (max-width: 1050px) {

        button.duels-games-element {
            width: calc(50% - 10px);
        }

        button.duels-games-element:nth-child(3) {
            margin-top: 20px;
        }

        button.duels-games-element:nth-child(3n) {
            margin-right: 20px;
        }

        button.duels-games-element:nth-child(2n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 700px) {

        button.duels-games-element {
            width: 100%;
            margin-right: 0!important;
        }

        button.duels-games-element:nth-child(2) {
            margin-top: 20px;
        }

    }
</style>
