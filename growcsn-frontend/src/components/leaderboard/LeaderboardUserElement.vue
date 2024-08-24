<template>
    <div class="leaderboard-user-element">
        <div class="element-crown">
            <img src="@/assets/img/crown_2.png" />
        </div>
        <div class="element-inner">
            <div class="inner-pos">{{position}}</div>
            <div class="inner-user" v-bind:class="[
                winner.user === null === undefined || winner.user === null ? 
                    'user-hidden' :
                    ['user-' + leaderboardGetRank(winner.user), 'user-' + leaderboardGetLevelColor(winner.user)]
            ]">
                <div class="user-avatar">
                    <AvatarImage v-bind:image="winner.user !== undefined && winner.user !== null ? winner.user.avatar : ''" />
                </div>
                <span v-html="leaderboardGetUsername"></span>
            </div>
            <div class="inner-prize">
                <div class="prize-title">PRIZE</div>
                <div class="prize-content">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="content-value">
                        <span>{{leaderboardFormatValue(winner.prize).split('.')[0]}}</span>.{{leaderboardFormatValue(winner.prize).split('.')[1]}}
                    </div>
                </div>
            </div>
            <div class="inner-wagered">
                <div class="wagered-title">WAGERED</div>
                <div class="wagered-content">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="content-value">
                        <span>{{leaderboardFormatValue(winner.points).split('.')[0]}}</span>.{{leaderboardFormatValue(winner.points).split('.')[1]}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AvatarImage from '@/components/AvatarImage';

    export default {
        name: 'LeaderboardUserElement',
        components: {
            AvatarImage
        },
        props: [
            'position', 
            'winner'
        ],
        methods: {
            leaderboardFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');;
            },
            leaderboardGetRank(user) {
                let rank = user.rakeback;

                if(user.rank !== 'user') { rank = user.rank; }

                return rank;
            },
            leaderboardGetLevelColor(user) {
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
            leaderboardGetUsername() {
                let username = 'Empty';

                if(this.winner.user !== undefined && this.winner.user !== null) { username = this.winner.user.username; }
                else if(this.winner.user === null) { username = 'Anonymous'; }

                return username;
            }
        }
    }
</script>

<style scoped>
    .leaderboard-user-element {
        width: 900px;
        height: 60px;
        position: relative;
        margin-top: 10px;
        padding: 1px;
    }

    .leaderboard-user-element:nth-child(1) {
        width: 955px;
        margin-top: 0;
    }

    .leaderboard-user-element:nth-child(2) {
        width: 940px;
    }

    .leaderboard-user-element:nth-child(3) {
        width: 920px;
    }

    .leaderboard-user-element::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 5px;
        background: linear-gradient(180deg, rgba(20, 68, 104, 0) 0%, #144468 100%);
        z-index: -1
    }

    .leaderboard-user-element::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 5px;
        background-color: #052239;
        z-index: -1;
    }

    .leaderboard-user-element:nth-child(1)::before {
        background: linear-gradient(180deg, rgba(0, 255, 194, 0) 0%, #00ffc2 100%);
    }

    .leaderboard-user-element:nth-child(2)::before {
        background: linear-gradient(180deg, rgba(255, 230, 0, 0) 0%, #ffe600 100%);
    }

    .leaderboard-user-element:nth-child(3)::before {
        background: linear-gradient(180deg, rgba(141, 165, 187, 0) 0%, #6c89c3 100%);
    }

    .leaderboard-user-element .element-crown {
        display: none;
        position: absolute;
        top: -20px;
        left: -10px;
        z-index: 2;
    }

    .leaderboard-user-element:nth-child(1) .element-crown {
        display: block;
    }

    .leaderboard-user-element .element-crown img {
        width: 38px;
    }

    .leaderboard-user-element .element-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 25px 0 35px;
        border-radius: 5px;
        background-color: rgba(2, 21, 39, 0.25);
    }

    .leaderboard-user-element:nth-child(1) .element-inner {
        background: radial-gradient(163.2% 163.2% at 50% -31.45%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, rgba(0, 255, 194, 0.15) 0%, rgba(0, 170, 109, 0.15) 100%);
    }

    .leaderboard-user-element:nth-child(2) .element-inner {
        background: radial-gradient(163.2% 163.2% at 50% -31.45%, rgba(239, 162, 13, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, rgba(252, 163, 17, 0.15) 0%, rgba(255, 183, 3, 0.15) 100%);
    }

    .leaderboard-user-element:nth-child(3) .element-inner {
        background: radial-gradient(163.2% 163.2% at 50% -31.45%, rgba(108, 137, 196, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, rgba(70, 97, 151, 0.15) 0%, rgba(108, 137, 195, 0.15) 100%);
    }

    .leaderboard-user-element .inner-pos {
        width: 5%;
        font-size: 18px;
        font-weight: 600;
        color: #5f7f99;
    }

    .leaderboard-user-element:nth-child(1) .inner-pos {
        font-weight: 800;
        color: #00ba77;
    }

    .leaderboard-user-element:nth-child(2) .inner-pos {
        font-weight: 800;
        color: #ffb703;
    }

    .leaderboard-user-element:nth-child(3) .inner-pos {
        font-weight: 800;
        color: #6c89c3;
    }

    .leaderboard-user-element .inner-user {
        width: 59%;
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
    }

    .leaderboard-user-element .inner-user.user-hidden {
        font-style: italic;
    }

    .leaderboard-user-element .user-avatar {
        width: 34px;
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-right: 10px;
        border-radius: 50%;
        border: 1px solid #9e9e9e;
        overflow: hidden;
    }

    .leaderboard-user-element .inner-user.user-blue .user-avatar {
        border: 1px solid #559ee4;
    }

    .leaderboard-user-element .inner-user.user-green .user-avatar {
        border: 1px solid #b8e92d;
    }

    .leaderboard-user-element .inner-user.user-orange .user-avatar {
        border: 1px solid #fca311;
    }

    .leaderboard-user-element .inner-user.user-red .user-avatar {
        border: 1px solid #ff4e4e;
    }

    .leaderboard-user-element .inner-user.user-purple .user-avatar {
        border: 1px solid #6953f1;
    }

    .leaderboard-user-element .inner-user.user-partner .user-avatar {
        border: 1px solid #eca822;
    }

    .leaderboard-user-element .inner-user.user-mod .user-avatar {
        border: 1px solid #ffb703;
    }

    .leaderboard-user-element .inner-user.user-admin .user-avatar {
        border: 1px solid #00ffc2;
    }

    .leaderboard-user-element .user-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    .leaderboard-user-element .inner-prize,
    .leaderboard-user-element .inner-wagered {
        width: 18%;
        display: flex;
        flex-direction: column;
    }

    .leaderboard-user-element .prize-title,
    .leaderboard-user-element .wagered-title {
        display: none;
        font-size: 12px;
        font-weight: 800;
        color: #8bacc8;
    }

    .leaderboard-user-element:nth-child(1) .prize-title,
    .leaderboard-user-element:nth-child(1) .wagered-title {
        color: #00ba77;
    }

    .leaderboard-user-element:nth-child(2) .prize-title,
    .leaderboard-user-element:nth-child(2) .wagered-title {
        color: #ffb703;
    }

    .leaderboard-user-element:nth-child(3) .prize-title,
    .leaderboard-user-element:nth-child(3) .wagered-title {
        color: #6c89c3;
    }

    .leaderboard-user-element .prize-content,
    .leaderboard-user-element .wagered-content {
        width: 100%;
        display: flex;
        align-items: center;
    }

    .leaderboard-user-element .inner-prize img,
    .leaderboard-user-element .inner-wagered img {
        width: 18px;
        height: 18px;
        margin-right: 10px;
    }

    .leaderboard-user-element .content-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .leaderboard-user-element .content-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 975px) {

        .leaderboard-user-element {
            width: 100%;
        }

        .leaderboard-user-element:nth-child(1) {
            width: 100%;
        }

        .leaderboard-user-element:nth-child(2) {
            width: 100%;
        }

        .leaderboard-user-element:nth-child(3) {
            width: 100%;
        }

    }

    @media only screen and (max-width: 700px) {

        .leaderboard-user-element {
            height: auto;
        }

        .leaderboard-user-element .element-inner {
            display: grid;
            grid-template-columns: 30px calc(50% - 15px) calc(50% - 15px);
            grid-template-rows: auto auto;
            padding: 15px 25px 15px 35px;
        }

        .leaderboard-user-element .inner-pos {
            width: 30px;
            grid-column: 1;
            grid-row: 1;
        }

        .leaderboard-user-element .inner-user {
            width: 100%;
            grid-column: 2 / 4;
            grid-row: 1;
        }

        .leaderboard-user-element .inner-prize {
            width: 100%;
            grid-column: 2;
            grid-row: 2;
            margin-top: 20px;
        }

        .leaderboard-user-element .inner-wagered {
            width: 100%;
            grid-column: 3;
            grid-row: 2;
            margin-top: 20px;
        }

        .leaderboard-user-element .prize-title,
        .leaderboard-user-element .wagered-title {
            display: block;
        }

        .leaderboard-user-element .prize-content,
        .leaderboard-user-element .wagered-content {
            margin-top: 5px;
        }

    }
</style>
