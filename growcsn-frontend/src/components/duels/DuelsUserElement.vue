<template>
    <div class="duels-user-element" v-bind:class="{ 
        'element-rolling': duelsIsRolling === true, 
        'element-winner': (duelsGame.state === 'completed' || duelsGame.winner !== undefined) && bet._id === duelsGame.winner._id 
    }">
        <div v-if="bet === undefined" class="element-placeholder">
            <button v-if="duelsGame.bets.length === index - 1" v-on:click="duelsActionButton()" v-bind:disabled="socketSendLoading !== null">
                <div class="button-inner">{{ authUser.user !== null && authUser.user._id === duelsGame.bets[0].user._id ? 'CALL BOT' : 'JOIN' }}</div>
            </button>
        </div>
        <div v-else class="element-content">
            <div class="content-top">
                <div class="top-user" v-bind:class="[
                    'user-' + (bet.bot === true ? 'bot' : duelsGetRank(bet.user)),
                    'user-' + (bet.bot === true ? '' : duelsGetLevelColor(bet.user))
                ]">
                    <div class="user-avatar">
                        <AvatarImage v-bind:image="bet.bot ? null : bet.user.avatar" />
                    </div>
                    <span v-html="bet.bot === true ? duelsGetBotName : bet.user.username"></span>
                </div>
                <div class="top-roll">
                    <div class="roll-inner">
                        <svg v-if="bet.roll === undefined || duelsIsRolling === true" width="11" height="3" viewBox="0 0 11 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 1.16211C0 0.779297 0.102539 0.489909 0.307617 0.293945C0.512695 0.0979818 0.811198 0 1.20312 0C1.58138 0 1.87305 0.10026 2.07812 0.300781C2.28776 0.501302 2.39258 0.788411 2.39258 1.16211C2.39258 1.52214 2.28776 1.80697 2.07812 2.0166C1.86849 2.22168 1.57682 2.32422 1.20312 2.32422C0.820312 2.32422 0.524089 2.22396 0.314453 2.02344C0.104818 1.81836 0 1.53125 0 1.16211Z" />
                            <path d="M3.99219 1.16211C3.99219 0.779297 4.09473 0.489909 4.2998 0.293945C4.50488 0.0979818 4.80339 0 5.19531 0C5.57357 0 5.86523 0.10026 6.07031 0.300781C6.27995 0.501302 6.38477 0.788411 6.38477 1.16211C6.38477 1.52214 6.27995 1.80697 6.07031 2.0166C5.86068 2.22168 5.56901 2.32422 5.19531 2.32422C4.8125 2.32422 4.51628 2.22396 4.30664 2.02344C4.09701 1.81836 3.99219 1.53125 3.99219 1.16211Z" />
                            <path d="M7.98438 1.16211C7.98438 0.779297 8.08691 0.489909 8.29199 0.293945C8.49707 0.0979818 8.79557 0 9.1875 0C9.56575 0 9.85742 0.10026 10.0625 0.300781C10.2721 0.501302 10.377 0.788411 10.377 1.16211C10.377 1.52214 10.2721 1.80697 10.0625 2.0166C9.85286 2.22168 9.5612 2.32422 9.1875 2.32422C8.80469 2.32422 8.50846 2.22396 8.29883 2.02344C8.08919 1.81836 7.98438 1.53125 7.98438 1.16211Z" />
                        </svg>
                        <span v-else v-bind:class="{ 'gradient-green': (duelsGame.state === 'completed' || duelsGame.winner !== undefined) && bet._id === duelsGame.winner._id }">{{parseFloat(bet.roll / 100).toFixed(2)}}</span>
                    </div>
                </div>
            </div>
            <div class="content-bottom">
                <span v-if="duelsIsRolling === true" class="gradient-green">ROLLING</span>
                <div v-else class="bottom-chance">
                    CHANCE:
                    <span>{{parseFloat(100 / duelsGame.playerCount).toFixed(2)}}%</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AvatarImage from '@/components/AvatarImage';

    export default {
        name: 'DuelsUserElement',
        components: {
            AvatarImage
        },
        props: [
            'duelsGame', 
            'index', 
            'bet'
        ],
        methods: {
            ...mapActions([
                'notificationShow',
                'duelsSendBotSocket', 
                'duelsSendJoinSocket'
            ]),
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
            duelsActionButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                const data = { gameId: this.duelsGame._id };
                if(this.authUser.user._id === this.duelsGame.bets[0].user._id) { this.duelsSendBotSocket(data); } 
                else { this.duelsSendJoinSocket(data); }
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading', 
                'authUser'
            ]),
            duelsGetBotName() {
                const names = ['Specter', 'Lorenz', 'Gio', 'Cup', 'Dip', 'Fowntain', 'Levrock26', 'Chunkeh', 'Mateheus'];

                return names[this.index - 2];
            },
            duelsIsRolling() {
                return this.bet !== undefined && this.duelsGame.state === 'rolling' && this.duelsGame.winner === undefined && this.duelsGame.bets.filter((element) => element.roll !== undefined).length === this.index;
            }
        }
    }
</script>

<style scoped>
    .duels-user-element {
        width: 100%;
        height: 81px;
        margin-top: 5px;
        padding: 8px 15px;
        border-radius: 5px;
        background: rgba(19, 66, 88, 0.25);
        border: 1px solid rgba(20, 68, 104, 0.35);
        transition: background-color 0.3s ease;
    }

    .duels-user-element.element-rolling {
        background-color: #062b46;
    }

    .duels-user-element:first-of-type {
        margin-top: 0;
    }

    .duels-user-element .element-placeholder {
        height: 43px;
        display: flex;
        justify-content: flex-end;
        padding-bottom: 7px;
        border-bottom: 1px solid #0c324e;
    }

    .duels-user-element .element-placeholder button {
        width: 80px;
        height: 35px;
    }

    .duels-user-element .element-placeholder button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .duels-user-element .content-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 7px;
        border-bottom: 1px solid #0c324e;
    }

    .duels-user-element .content-top span {
        margin-left: 4px;
        font-weight: 600;
        color: #5e768e;
    }

    .duels-user-element .top-user {
        display: flex;
        align-items: center;
    }

    .duels-user-element .user-avatar {
        width: 25px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-right: 10px;
        border-radius: 50%;
        border: 1px solid #9e9e9e;
        overflow: hidden;
    }

    .duels-user-element .top-user.user-blue .user-avatar {
        border: 1px solid #559ee4;
    }

    .duels-user-element .top-user.user-green .user-avatar {
        border: 1px solid #b8e92d;
    }

    .duels-user-element .top-user.user-orange .user-avatar {
        border: 1px solid #fca311;
    }

    .duels-user-element .top-user.user-red .user-avatar {
        border: 1px solid #ff4e4e;
    }

    .duels-user-element .top-user.user-purple .user-avatar {
        border: 1px solid #6953f1;
    }

    .duels-user-element .top-user.user-partner .user-avatar {
        border: 1px solid #eca822;
    }

    .duels-user-element .top-user.user-mod .user-avatar {
        border: 1px solid #ffb703;
    }

    .duels-user-element .top-user.user-bot .user-avatar,
    .duels-user-element .top-user.user-admin .user-avatar {
        border: 1px solid #00ffc2;
    }

    .duels-user-element .user-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    .duels-user-element .top-user span {
        max-width: 130px;
        font-size: 15px;
        font-weight: 600;
        color: #ffffff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .duels-user-element .top-roll {
        width: 70px;
        height: 35px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .duels-user-element .top-roll::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(20, 68, 104, 0) 0%, #144468 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .duels-user-element.element-winner .top-roll::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e0a3 100%);
    }

    .duels-user-element.element-winner .top-roll::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-color: #052640;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .duels-user-element .roll-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(255deg, #04243e 0%, #0c314d 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .duels-user-element.element-winner .roll-inner {
        background: radial-gradient(140% 80% at 85% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, rgba(0, 255, 194, 0.05) 0%, rgba(0, 170, 109, 0.05) 100%);
    }

    .duels-user-element .roll-inner svg {
        fill: #ffffff;
    }

    .duels-user-element .roll-inner span {
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
    }

    .duels-user-element.element-winner .roll-inner span {
        font-weight: 800;
    }

    .duels-user-element .content-bottom {
        display: flex;
        align-items: center;
        margin-top: 6px;
        font-size: 10px;
        font-weight: 800;
    }

    .duels-user-element .bottom-chance {
        color: #7a93ac;
    }

    .duels-user-element .bottom-chance span {
        margin-left: 4px;
        font-weight: 600;
        color: #5e768e;
    }
</style>
