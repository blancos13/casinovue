<template>
    <div class="admin-user-profile">
        <div class="profile-avatar" v-bind:class="[
            'avatar-' + adminGetLevelColor,
            'avatar-' + modalsData.user.rank
        ]">
            <AvatarImage v-bind:image="modalsData.user.avatar" />
        </div>
        <div class="profile-username">
            <span v-html="modalsData.user.username"></span>
            <BoxLevel v-if="['admin', 'mod', 'partner'].includes(modalsData.user.rank) === false" v-bind:level="adminGetLevel" v-bind:color="adminGetLevelColor" />
            <BoxRank v-if="adminGetRank !== null" v-bind:rank="adminGetRank" />
        </div>
        <div class="profile-date">Member since {{adminGetDate}}</div>
        <div class="profile-id">{{modalsData.user._id}}</div>
        <div class="profile-actions">
            <a v-if="modalsData.user.roblox !== undefined" v-bind:href="'https://www.roblox.com/users/' + modalsData.user.roblox.id + '/profile'" target="_blank" class="link-account">
                <div class="button-inner">VIEW ACCOUNT</div>
            </a>
        </div>
        <div class="profile-stats">
            <div class="stats-element">
                <div class="element-inner">
                    TOTAL DEPOSITED
                    <div class="inner-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="amount-value">
                            <span>{{adminFormatValue(modalsData.user.stats.deposit).split('.')[0]}}</span>.{{adminFormatValue(modalsData.user.stats.deposit).split('.')[1]}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="stats-element">
                <div class="element-inner">
                    TOTAL WITHDRAWN
                    <div class="inner-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="amount-value">
                            <span>{{adminFormatValue(modalsData.user.stats.withdraw).split('.')[0]}}</span>.{{adminFormatValue(modalsData.user.stats.withdraw).split('.')[1]}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="stats-element element-profit" v-bind:class="{ 'element-negative': (modalsData.user.stats.withdraw - modalsData.user.stats.deposit) < 0 }">
                <div class="element-inner">
                    TOTAL PROFIT
                    <div class="inner-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="amount-value">
                            <span>{{adminFormatValue(modalsData.user.stats.withdraw - modalsData.user.stats.deposit).split('.')[0]}}</span>.{{adminFormatValue(modalsData.user.stats.withdraw - modalsData.user.stats.deposit).split('.')[1]}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import AvatarImage from '@/components/AvatarImage';
    import BoxLevel from '@/components/BoxLevel';
    import BoxRank from '@/components/BoxRank';

    export default {
        name: 'AdminUserProfile',
        components: {
            AvatarImage,
            BoxLevel,
            BoxRank
        },
        methods: {
            adminFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        },
        computed: {
            ...mapGetters([
                'modalsData'
            ]),
            adminGetLevel() {
                let level = Math.floor(Math.pow(this.modalsData.user.xp / 1000 / 100, 1 / 3));
                return level >= 100 ? 100 : level; 
            },
            adminGetLevelColor() {
                let color = '';

                if(this.adminGetLevel >= 2 && this.adminGetLevel < 26) { color = 'blue'; }
                else if(this.adminGetLevel >= 26 && this.adminGetLevel < 51) { color = 'green'; }
                else if(this.adminGetLevel >= 51 && this.adminGetLevel < 76) { color = 'orange'; }
                else if(this.adminGetLevel >= 76 && this.adminGetLevel < 100) { color = 'red'; }
                else if(this.adminGetLevel >= 100) { color = 'purple'; }

                return color;
            },
            adminGetRakebackName() {
                const betAmount = this.modalsData.user.xp / 1000;
                let rakeback = null;

                if(betAmount >= 100000 && betAmount < 250000) { rakeback = 'bronze'; }
                else if(betAmount >= 250000 && betAmount < 500000) { rakeback = 'silver'; }
                else if(betAmount >= 500000 && betAmount < 1000000) { rakeback = 'gold'; }
                else if(betAmount >= 1000000 && betAmount < 2000000) { rakeback = 'platinum'; }
                else if(betAmount >= 2000000) { rakeback = 'titanium'; }

                return rakeback;
            },
            adminGetRank() {
                let rank = this.adminGetRakebackName;

                if(this.modalsData.user.rank !== 'user') { rank = this.modalsData.user.rank; }

                return rank;
            },
            adminGetDate() {
                const date = new Date(this.modalsData.user.createdAt);
                return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
            }
        }
    }
</script>

<style scoped>
    .admin-user-profile {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .admin-user-profile .profile-avatar {
        width: 95px;
        height: 95px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        border-radius: 50%;
        border: 2px solid #9e9e9e;
        overflow: hidden;
    }

    .admin-user-profile .profile-avatar.avatar-blue {
        border: 2px solid #559ee4;
    }

    .admin-user-profile .profile-avatar.avatar-green {
        border: 2px solid #b8e92d;
    }

    .admin-user-profile .profile-avatar.avatar-orange {
        border: 2px solid #fca311;
    }

    .admin-user-profile .profile-avatar.avatar-red {
        border: 2px solid #ff4e4e;
    }

    .admin-user-profile .profile-avatar.avatar-purple {
        border: 2px solid #6953f1;
    }

    .admin-user-profile .profile-avatar.avatar-partner {
        border: 2px solid #eca822;
    }
    
    .admin-user-profile .profile-avatar.avatar-mod {
        border: 2px solid #ffb703;
    }

    .admin-user-profile .profile-avatar.avatar-admin {
        border: 2px solid #0dd4b1;
    }

    .admin-user-profile .profile-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    .admin-user-profile .profile-username {
        display: flex;
        align-items: center;
        margin-top: 18px;
        font-size: 22px;
        font-weight: 700;
        color: #ffffff;
    }

    .admin-user-profile .username-level {
        width: 38px;
        height: 28px;
        position: relative;
        margin-left: 12px;
    }

    .admin-user-profile .username-level::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #ffb703 100%);
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .admin-user-profile .username-level::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #063141;
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .admin-user-profile .level-inner {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 1px;
        left: 1px;
        font-size: 12px;
        font-weight: 700;
        background-color: rgba(252, 163, 17, 0.05);
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
        z-index: 1;
    }

    .admin-user-profile .profile-date {
        margin-top: 5px;
        font-size: 14px;
        font-weight: 400;
        color: #49687d;
    }

    .admin-user-profile .profile-id {
        margin-top: 5px;
        font-size: 14px;
        font-weight: 400;
        color: #db7d48;
    }

    .admin-user-profile .profile-actions {
        display: flex;
        align-items: center;
        margin-top: 30px;
    }

    .admin-user-profile .profile-actions a.link-account {
        width: 144px;
        height: 48px;
        filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
    }

    .admin-user-profile .profile-actions a.link-account .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        color: #bbbfd0;
        background-color: #1a4f63;
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .admin-user-profile .profile-stats {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 50px;
    }

    .admin-user-profile .stats-element {
        width: calc(50% - 17px);
        height: 78px;
        position: relative;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .admin-user-profile .stats-element:first-of-type {
        margin-right: 34px;
    }

    .admin-user-profile .stats-element:last-of-type {
        margin-top: 35px;
    }

    .admin-user-profile .stats-element::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 25%, 100% 75%, calc(100% - 16px) 100%, 16px 100%, 0 75%, 0 25%);
    }

    .admin-user-profile .stats-element.element-profit::before {
        background: linear-gradient(180deg, #04131f 25%, #00ffc2 100%);
    }

    .admin-user-profile .stats-element.element-negative::before {
        background: linear-gradient(180deg, #04131f 25%, #cf5048 100%);
    }

    .admin-user-profile .element-inner {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        top: 1px;
        left: 1px;
        padding: 0 16px;
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
        background-color: #072435;
        clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 25%, 100% 75%, calc(100% - 16px) 100%, 16px 100%, 0 75%, 0 25%);
        z-index: 1;
    }

    .admin-user-profile .stats-element.element-profit .element-inner {
        background: radial-gradient(81.75% 81.75% at 50% 50%, rgba(0, 255, 194, 0.05) 0%, rgba(0, 0, 0, 0) 100%), #072435;
    }

    .admin-user-profile .stats-element.element-negative .element-inner {
        background: radial-gradient(81.75% 81.75% at 50% 50%, rgba(207, 80, 72, 0.05) 0%, rgba(0, 0, 0, 0) 100%), #072435;
    }

    .admin-user-profile .inner-amount {
        display: flex;
        align-items: center;
    }

    .admin-user-profile .inner-amount img {
        width: 20px;
        height: 20px;
        margin-right: 12px;
    }

    .admin-user-profile .amount-value {
        font-size: 14px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .admin-user-profile .amount-value span {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
    }

    @media only screen and (max-width: 650px) {

        .admin-user-profile .stats-element {
            width: 100%;
            margin-top: 15px!important;
        }

        .admin-user-profile .stats-element:first-of-type {
            margin-top: 0!important;
            margin-right: 0;
        }

    }
</style>
