<template>
    <div class="duels-game-winner">
        <span class="gradient-green">DUEL WINNER:</span>
        <div v-if="duelsGame.state !== 'completed'" class="winner-placeholder"></div>
        <div v-else class="winner-content">
            <div class="content-inner">
                <div class="inner-user" v-bind:class="[
                    'user-' + (duelsGame.winner.bot === true ? 'bot' : duelsGetRank(duelsGame.winner.user)),
                    'user-' + (duelsGame.winner.bot === true ? '' : duelsGetLevelColor(duelsGame.winner.user))
                ]">
                    <div class="user-avatar">
                        <AvatarImage v-bind:image="duelsGame.winner.bot ? null : duelsGame.winner.user.avatar" />
                    </div>
                    <span v-html="duelsGame.winner.bot === true ? duelsGetBotName : duelsGame.winner.user.username"></span>
                </div>
                <div class="inner-roll">
                    <div class="roll-inner">
                        <span class="gradient-green">{{parseFloat(duelsGame.winner.roll / 100).toFixed(2)}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AvatarImage from '@/components/AvatarImage';

    export default {
        name: 'DuelsGameWinner',
        props: [
            'duelsGame'
        ],
        components: {
            AvatarImage
        },
        methods: {
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
            }
        },
        computed: {
            duelsGetBotName() {
                const pos = this.duelsGame.bets.findIndex((element) => element._id === this.duelsGame.winner._id);
                const names = ['Specter', 'Lorenz', 'Gio', 'Cup', 'Dip', 'Fowntain', 'Levrock26', 'Chunkeh', 'Mateheus'];
                
                return names[pos - 1];
            }
        }
    }
</script>

<style scoped>
    .duels-game-winner {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 25px;
        font-size: 14px;
        font-weight: 800;
    }

    .duels-game-winner .winner-placeholder,
    .duels-game-winner .winner-content {
        width: 460px;
        height: 78px;
        margin-top: 25px;
        border-radius: 8px;
    }

    .duels-game-winner .winner-placeholder {
        border: 1px solid #0b3354;
    }

    .duels-game-winner .winner-content {
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .duels-game-winner .winner-content:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 8px;
        background: linear-gradient(180deg, rgba(0, 255, 194, 0) 0%, #00ffc2 100%);
        z-index: -1;
    }

    .modal-duels-game .winner-content:after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 8px;
        background-color: #001c33;
        z-index: -1;
    }

    .modal-duels-game .content-inner {
        width: 100%;
        height:  100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 25px;
        border-radius: 8px;
        background: linear-gradient(255deg, rgba(0, 255, 194, 0.02) 0%, rgba(0, 170, 109, 0.02) 100%), radial-gradient(170% 170% at 50% 50%, rgba(0, 255, 194, 0.15) 0%, rgba(0, 0, 0, 0) 100%);
        box-shadow: inset 0px 5px 50px rgba(0, 0, 0, 0.25);
        z-index: 1;
    }

    .modal-duels-game .inner-user {
        display: flex;
        align-items: center;
    }

    .modal-duels-game .user-avatar {
        width: 41px;
        height: 41px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-right: 12px;
        border-radius: 50%;
        background-color: #001c33;
        border: 1px solid #9e9e9e;
        overflow: hidden;
    }

    .modal-duels-game .inner-user.user-blue .user-avatar {
        border: 1px solid #559ee4;
    }

    .modal-duels-game .inner-user.user-green .user-avatar {
        border: 1px solid #b8e92d;
    }

    .modal-duels-game .inner-user.user-orange .user-avatar {
        border: 1px solid #fca311;
    }

    .modal-duels-game .inner-user.user-red .user-avatar {
        border: 1px solid #ff4e4e;
    }

    .modal-duels-game .inner-user.user-purple .user-avatar {
        border: 1px solid #6953f1;
    }

    .modal-duels-game .inner-user.user-partner .user-avatar {
        border: 1px solid #eca822;
    }

    .modal-duels-game .inner-user.user-mod .user-avatar {
        border: 1px solid #ffb703;
    }

    .modal-duels-game .inner-user.user-bot .user-avatar,
    .modal-duels-game .inner-user.user-admin .user-avatar {
        border: 1px solid #00ffc2;
    }

    .modal-duels-game .user-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    .modal-duels-game .inner-user span {
        width: 100px;
        font-size: 18px;
        font-weight: 600;
        color: #ffffff;
    }

    .modal-duels-game .inner-roll {
        width: 70px;
        height: 35px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .modal-duels-game .inner-roll::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 255, 194, 0) 0%, #00ffc2 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .modal-duels-game .inner-roll::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-color: #001c33;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .modal-duels-game .roll-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        background: radial-gradient(130% 80% at 80% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, rgba(0, 255, 194, 0.05) 0%, rgba(0, 170, 109, 0.05) 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    @media only screen and (max-width: 510px) {

        .duels-game-winner {
            width: 100%;
        }

        .duels-game-winner .winner-placeholder,
        .duels-game-winner .winner-content {
            width: 100%;
        }

    }   
</style>
