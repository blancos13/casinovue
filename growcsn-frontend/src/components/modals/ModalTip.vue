<template>
    <div class="modal-tip">
        <div class="tip-title">
            <span class="gradient-green">TIP USERS</span>
        </div>
        <div class="tip-avatar">
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
        <div class="tip-username">
            <transition name="fade" mode="out-in">
                <div v-if="generalUserInfo.data === null || generalUserInfo.loading === true" class="username-loading"></div>
                <div v-else class="username-content">
                    <span v-html="generalUserInfo.data.username"></span>
                    <BoxLevel v-if="['admin', 'mod', 'partner'].includes(generalUserInfo.data.rank) === false" v-bind:level="generalUserInfo.data.level" v-bind:color="modalGetLevelColor" />
                    <BoxRank v-if="modalGetRank !== null" v-bind:rank="modalGetRank" />
                </div>
            </transition>
        </div>
        <div class="tip-date">
            <transition name="fade" mode="out-in">
                <div v-if="generalUserInfo.data === null || generalUserInfo.loading === true" class="date-loading"></div>
                <div v-else class="date-content">Member since {{modalGetDate}}</div>
            </transition>
        </div>
        <div class="tip-input">
            <input v-model="modalAmount" v-on:input="modalValidateInput" type="text" placeholder="TIP AMOUNT" />
            <img src="@/assets/img/icons/coin.svg" alt="icon" />
            <button v-on:click="modalTipButton" class="button-tip" v-bind:disabled="socketSendLoading !== null">
                <div class="button-inner">
                    <transition name="fade" mode="out-in">
                        <ButtonLoading v-if="socketSendLoading === 'UserTip'" key="loading" />
                        <div v-else class="inner-content" key="content">TIP</div>
                    </transition>
                </div>
            </button>
        </div>
        <div class="tip-info">Please note that this action is irreversable and you are the only one responsible. We cannot and will not refund any tips, therefore double check your tip amount and verify who you are tipping to.</div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AvatarImage from '@/components/AvatarImage';
    import BoxLevel from '@/components/BoxLevel';
    import BoxRank from '@/components/BoxRank';
    import ButtonLoading from '@/components/ButtonLoading';

    export default {
        name: 'ModalTip',
        components: {
            AvatarImage,
            BoxLevel,
            BoxRank,
            ButtonLoading
        },
        data() {
            return {
                modalAmount: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'userSendUserTipSocket'
            ]),
            modalValidateInput() {
                this.modalAmount = this.modalAmount.replace(/[^\d.]/g, '');
            },
            modalTipButton() {
                const amount = Math.floor(this.modalAmount * 1000);

                if(amount === undefined || isNaN(amount) === true || amount < 10) {
                    this.notificationShow({ type: 'error', message: 'Your entered tip amount is invalid.' });
                    return;
                }

                const data = { receiverId: this.generalUserInfo.data._id, amount: amount };
                this.userSendUserTipSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading', 
                'modalsData', 
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
                let rank = null;

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
    .modal-tip {
        width: 773px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 20px 48px 20px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% -31.45%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, #07263d 0%, #07243a 100%);
    }

    .modal-tip .tip-title {
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-tip .tip-avatar {
        margin-top: 35px;
    }

    .modal-tip .avatar-loading,
    .modal-tip .username-loading,
    .modal-tip .date-loading {
        position: relative;
        overflow: hidden;
        background-color: #072435;
    }

    .modal-tip .avatar-loading {
        width: 95px;
        height: 95px;
        border-radius: 50%;
    }

    .modal-tip .username-loading {
        width: 150px;
        height: 30px;
        border-radius: 5px;
    }

    .modal-tip .date-loading {
        width: 110px;
        height: 19px;
        border-radius: 5px;
    }

    .modal-tip .avatar-loading::after,
    .modal-tip .username-loading::after,
    .modal-tip .date-loading::after {
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

    .modal-tip .avatar-loading.fade-leave-active,
    .modal-tip .username-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .modal-tip .avatar-loading.fade-leave-to,
    .modal-tip .username-loading.fade-leave-to {
        opacity: 0;
    }

    .modal-tip .avatar-content {
        width: 95px;
        height: 95px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        border-radius: 50%;
        border: 2px solid #9e9e9e;
        overflow: hidden;
    }

    .modal-tip .avatar-content.content-blue {
        border: 2px solid #559ee4;
    }

    .modal-tip .avatar-content.content-green {
        border: 2px solid #b8e92d;
    }

    .modal-tip .avatar-content.content-orange {
        border: 2px solid #fca311;
    }

    .modal-tip .avatar-content.content-red {
        border: 2px solid #ff4e4e;
    }

    .modal-tip .avatar-content.content-purple {
        border: 2px solid #6953f1;
    }

    .modal-tip .avatar-content.content-partner {
        border: 2px solid #eca822;
    }

    .modal-tip .avatar-content.content-mod {
        border: 2px solid #ffb703;
    }

    .modal-tip .avatar-content.content-admin {
        border: 2px solid #00ffc2;
    }

    .modal-tip .avatar-content .avatar-image {
        width: 100%;
        height: 100%;
    }

    .modal-tip .tip-username {
        margin-top: 18px;
    }

    .modal-tip .username-content {
        display: flex;
        align-items: center;
        font-size: 22px;
        font-weight: 700;
        color: #ffffff;
    }

    .modal-tip .username-content.fade-enter-active {
        transition: opacity 0.5s;
    }

    .modal-tip .username-content.fade-enter-from {
        opacity: 0;
    }

    .modal-tip .tip-date {
        margin-top: 5px;
    }

    .modal-tip .date-content {
        font-size: 14px;
        font-weight: 400;
        color: #49687d;
    }

    .modal-tip .date-content.fade-enter-active {
        transition: opacity 0.5s;
    }

    .modal-tip .date-content.fade-enter-from {
        opacity: 0;
    }

    .modal-tip .tip-input {
        width: 448px;
        height: 72px;
        position: relative;
        margin-top: 35px;
        padding: 1px;
    }

    .modal-tip .tip-input::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 25%, 100% 75%, calc(100% - 14px) 100%, 14px 100%, 0 75%, 0 25%);
    }

    .modal-tip .tip-input input {
        width: 100%;
        height: 100%;
        padding: 0 127px 0 45px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: #072435;
        clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 25%, 100% 75%, calc(100% - 14px) 100%, 14px 100%, 0 75%, 0 25%);
    }

    .modal-tip .tip-input input::placeholder {
        color: #5e768e;
    }

    .modal-tip .tip-input img {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translate(0, -50%);
    }

    .modal-tip .tip-input button.button-tip {
        width: 92px;
        height: 39px;
        position: absolute;
        top: 50%;
        right: 25px;
        transform: translate(0, -50%);
        filter: drop-shadow(0px 2px 10px rgba(1, 230, 169, 0.15)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
        transition: all .2s;
    }
    .modal-tip .tip-input button.button-tip:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .modal-tip .tip-input button.button-tip:active {
        transition-duration: .2s;
        scale: .9;
    }
    .modal-tip .tip-input button.button-tip .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .modal-tip .tip-input button.button-tip .button-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .modal-tip .tip-input button.button-tip .button-loading.fade-leave-to {
        opacity: 0;
    }

    .modal-tip .tip-input button.button-tip .inner-content {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    .modal-tip .tip-input button.button-tip .inner-content.fade-enter-active {
        transition: opacity 0.5s;
    }

    .modal-tip .tip-input button.button-tip .inner-content.fade-enter-from {
        opacity: 0;
    }

    .modal-tip .tip-info {
        width: 100%;
        margin-top: 35px;
        padding: 0 42px;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: #49687d;
    }

    @keyframes loading_animation {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(100%); }
    }

    @media only screen and (max-width: 793px) {

        .modal-tip {
            width: calc(100vw - 20px);
        }

    }

    @media only screen and (max-width: 508px) {

        .modal-tip .tip-input {
            width: 100%;
        }

        .modal-tip .tip-info {
            padding: 0;
        }

    }
</style>
