<template>
    <div class="modal-chat-user">
        <div class="user-title">
            <span class="gradient-green">USER</span>
        </div>
        <div class="user-avatar">
            <transition name="fade" mode="out-in">
                <div v-if="generalUserInfo.data === null || generalUserInfo.loading === true" class="avatar-loading"></div>
                <div v-else class="avatar-content" v-bind:class="[
                    'content-' + modalGetLevelColor,
                    'content-' + generalUserInfo.data.rank
                ]">
                    <AvatarImage v-bind:image="generalUserInfo.data.avatar" />
                </div>
            </transition>
        </div>
        <div class="user-username">
            <transition name="fade" mode="out-in">
                <div v-if="generalUserInfo.data === null || generalUserInfo.loading === true" class="username-loading"></div>
                <div v-else class="username-content">
                    <span v-html="generalUserInfo.data.username"></span>
                    <BoxLevel v-if="['admin', 'mod', 'partner'].includes(generalUserInfo.data.rank) === false" v-bind:level="generalUserInfo.data.level" v-bind:color="modalGetLevelColor" />
                    <BoxRank v-if="modalGetRank !== null" v-bind:rank="modalGetRank" />
                </div>
            </transition>
        </div>
        <div class="user-date">
            <transition name="fade" mode="out-in">
                <div v-if="generalUserInfo.data === null || generalUserInfo.loading === true" class="date-loading"></div>
                <div v-else class="date-content">Member since {{modalGetDate}}</div>
            </transition>
        </div>
        <div class="user-actions">
            <button v-on:click="modalTipButton" class="button-tip">
                <div class="button-inner">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    TIP USER
                </div>
            </button>
            <a v-if="generalUserInfo.data.roblox !== undefined" v-bind:href="'https://www.roblox.com/users/' + generalUserInfo.data.roblox.id + '/profile'" target="_blank" class="link-account">
                <div class="link-inner">VIEW ACCOUNT</div>
            </a>
        </div>
        <div class="user-stats">
            <div class="stats-element">
                <div class="element-inner">
                    TOTAL DEPOSITED
                    <div class="inner-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div v-if="generalUserInfo.data.stats !== null" class="amount-value">
                            <span>{{modalFormatValue(generalUserInfo.data.stats.deposit).split('.')[0]}}</span>.{{modalFormatValue(generalUserInfo.data.stats.deposit).split('.')[1]}}
                        </div>
                        <div v-else class="amount-hidden">HIDDEN</div>
                    </div>
                </div>
            </div>
            <div class="stats-element">
                <div class="element-inner">
                    TOTAL WITHDRAWN
                    <div class="inner-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div v-if="generalUserInfo.data.stats !== null" class="amount-value">
                            <span>{{modalFormatValue(generalUserInfo.data.stats.withdraw).split('.')[0]}}</span>.{{modalFormatValue(generalUserInfo.data.stats.withdraw).split('.')[1]}}
                        </div>
                        <div v-else class="amount-hidden">HIDDEN</div>
                    </div>
                </div>
            </div>
            <div class="stats-element element-profit" v-bind:class="{ 'element-negative': generalUserInfo.data.stats !== null && (generalUserInfo.data.stats.withdraw - generalUserInfo.data.stats.deposit) < 0 }">
                <div class="element-inner">
                    TOTAL PROFIT
                    <div class="inner-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div v-if="generalUserInfo.data.stats !== null" class="amount-value">
                            <span>{{modalFormatValue(generalUserInfo.data.stats.withdraw - generalUserInfo.data.stats.deposit).split('.')[0]}}</span>.{{modalFormatValue(generalUserInfo.data.stats.withdraw - generalUserInfo.data.stats.deposit).split('.')[1]}}
                        </div>
                        <div v-else class="amount-hidden">HIDDEN</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AvatarImage from '@/components/AvatarImage';
    import BoxLevel from '@/components/BoxLevel';
    import BoxRank from '@/components/BoxRank';

    export default {
        name: 'ModalChatUser',
        components: {
            AvatarImage,
            BoxLevel,
            BoxRank
        },
        methods: {
            ...mapActions([
                'modalsSetShow', 
                'modalsSetData'
            ]),
            modalFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            modalTipButton() {
                this.modalsSetShow(null);

                setTimeout(() => { this.modalsSetShow('Tip'); }, 300);
            }
        },
        computed: {
            ...mapGetters([ 
                'generalUserInfo'
            ]),
            modalGetLevelColor() {
                let color = '';

                if(this.generalUserInfo.data.level >= 2 && this.generalUserInfo.data.level < 26) { color = 'blue'; }
                else if(this.generalUserInfo.data.level >= 26 && this.generalUserInfo.data.level < 51) { color = 'green'; }
                else if(this.generalUserInfo.data.level >= 51 && this.generalUserInfo.data.level < 76) { color = 'orange'; }
                else if(this.generalUserInfo.data.level >= 76 && this.generalUserInfo.data.level < 100) { color = 'red'; }
                else if(this.generalUserInfo.data.level >= 100) { color = 'purple'; }

                return color;
            },
            modalGetRank() {
                let rank = this.generalUserInfo.data.rakeback;

                if(this.generalUserInfo.data.rank !== 'user') { rank = this.generalUserInfo.data.rank; }

                return rank;
            },
            modalGetDate() {
                const date = new Date(this.generalUserInfo.data.createdAt);
                return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
            }
        }
    }
</script>

<style scoped>
    .modal-chat-user {
        width: 773px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 0 48px 0;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% -31.45%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, #07263d 0%, #07243a 100%);
    }

    .modal-chat-user .user-title {
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-chat-user .user-avatar {
        margin-top: 35px;
    }

    .modal-chat-user .avatar-loading,
    .modal-chat-user .username-loading,
    .modal-chat-user .date-loading {
        position: relative;
        overflow: hidden;
        background-color: #072435;
    }

    .modal-chat-user .avatar-loading {
        width: 95px;
        height: 95px;
        border-radius: 50%;
    }

    .modal-chat-user .username-loading {
        width: 150px;
        height: 30px;
        border-radius: 5px;
    }

    .modal-chat-user .date-loading {
        width: 110px;
        height: 19px;
        border-radius: 5px;
    }

    .modal-chat-user .avatar-loading::after,
    .modal-chat-user .username-loading::after,
    .modal-chat-user .date-loading::after {
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

    .modal-chat-user .avatar-loading.fade-leave-active,
    .modal-chat-user .username-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .modal-chat-user .avatar-loading.fade-leave-to,
    .modal-chat-user .username-loading.fade-leave-to {
        opacity: 0;
    }

    .modal-chat-user .avatar-content {
        width: 95px;
        height: 95px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        border-radius: 50%;
        border: 2px solid #9e9e9e;
        overflow: hidden;
    }

    .modal-chat-user .avatar-content.content-blue {
        border: 2px solid #559ee4;
    }

    .modal-chat-user .avatar-content.content-green {
        border: 2px solid #b8e92d;
    }

    .modal-chat-user .avatar-content.content-orange {
        border: 2px solid #fca311;
    }

    .modal-chat-user .avatar-content.content-red {
        border: 2px solid #ff4e4e;
    }

    .modal-chat-user .avatar-content.content-purple {
        border: 2px solid #6953f1;
    }

    .modal-chat-user .avatar-content.content-partner {
        border: 2px solid #eca822;
    }

    .modal-chat-user .avatar-content.content-mod {
        border: 2px solid #ffb703;
    }

    .modal-chat-user .avatar-content.content-admin {
        border: 2px solid #00ffc2;
    }

    .modal-chat-user .avatar-content .avatar-image {
        width: 100%;
        height: 100%;
    }

    .modal-chat-user .user-username {
        margin-top: 18px;
    }

    .modal-chat-user .username-content {
        display: flex;
        align-items: center;
        font-size: 22px;
        font-weight: 700;
        color: #ffffff;
    }

    .modal-chat-user .username-content.fade-enter-active {
        transition: opacity 0.5s;
    }

    .modal-chat-user .username-content.fade-enter-from {
        opacity: 0;
    }

    .modal-chat-user .user-date {
        margin-top: 5px;
    }

    .modal-chat-user .date-content {
        font-size: 14px;
        font-weight: 400;
        color: #49687d;
    }

    .modal-chat-user .date-content.fade-enter-active {
        transition: opacity 0.5s;
    }

    .modal-chat-user .date-content.fade-enter-from {
        opacity: 0;
    }

    .modal-chat-user .user-actions {
        display: flex;
        align-items: center;
        margin-top: 30px;
    }

    .modal-chat-user .user-actions button.button-tip,    
    .modal-chat-user .user-actions a.link-account {
        width: 144px;
        height: 48px;
        filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
        transition: all .2s;
    }

    .modal-chat-user .user-actions button.button-tip:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .modal-chat-user .user-actions button.button-tip:active {
        transition-duration: .2s;
        scale: .9;
    }


    .modal-chat-user .user-actions button.button-tip {
        margin-right: 15px;
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15)) drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .modal-chat-user .user-actions button.button-tip .button-inner,
    .modal-chat-user .user-actions a.link-account .link-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .modal-chat-user .user-actions button.button-tip .button-inner {
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
    }

    .modal-chat-user .user-actions a.link-account .link-inner {
        color: #bbbfd0;
        background-color: #1a4f63;
        transition: color 0.3s ease;
    }

    .modal-chat-user .user-actions a.link-account:hover .link-inner {
        color: #ffffff;
    }

    .modal-chat-user .user-actions button.button-tip .button-inner img {
        width: 22px;
        height: 22px;
        margin-right: 10px;
    }

    .modal-chat-user .user-stats {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 50px;
        padding: 0 66px;
    }

    .modal-chat-user .stats-element {
        width: calc(50% - 17px);
        height: 78px;
        position: relative;
        padding: 1px;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .modal-chat-user .stats-element:first-of-type {
        margin-right: 34px;
    }

    .modal-chat-user .stats-element:last-of-type {
        margin-top: 35px;
    }

    .modal-chat-user .stats-element::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 25%, 100% 75%, calc(100% - 16px) 100%, 16px 100%, 0 75%, 0 25%);
    }

    .modal-chat-user .stats-element.element-profit::before {
        background: linear-gradient(180deg, #04131f 25%, #00ffc2 100%);
    }

    .modal-chat-user .stats-element.element-negative::before {
        background: linear-gradient(180deg, #04131f 25%, #cf5048 100%);
    }

    .modal-chat-user .element-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
        background-color: #072435;
        clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 25%, 100% 75%, calc(100% - 16px) 100%, 16px 100%, 0 75%, 0 25%);
    }

    .modal-chat-user .stats-element.element-profit .element-inner {
        background: radial-gradient(81.75% 81.75% at 50% 50%, rgba(0, 255, 194, 0.05) 0%, rgba(0, 0, 0, 0) 100%), #072435;
    }

    .modal-chat-user .stats-element.element-negative .element-inner {
        background: radial-gradient(81.75% 81.75% at 50% 50%, rgba(207, 80, 72, 0.05) 0%, rgba(0, 0, 0, 0) 100%), #072435;
    }

    .modal-chat-user .inner-amount {
        display: flex;
        align-items: center;
    }

    .modal-chat-user .inner-amount img {
        width: 20px;
        height: 20px;
        margin-right: 12px;
    }

    .modal-chat-user .amount-value {
        font-size: 14px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .modal-chat-user .amount-value span {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
    }

    @keyframes loading_animation {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(100%); }
    }

    @media only screen and (max-width: 793px) {

        .modal-chat-user {
            width: calc(100vw - 20px);
        }

        .modal-chat-user .user-stats {
            padding: 0 20px;
        }

    }

    @media only screen and (max-width: 650px) {

        .modal-chat-user .stats-element {
            width: 100%;
            margin-top: 15px!important;
        }

        .modal-chat-user .stats-element:first-of-type {
            margin-top: 0!important;
            margin-right: 0;
        }

    }
</style>
