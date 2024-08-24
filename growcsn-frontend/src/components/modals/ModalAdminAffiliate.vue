<template>
    <div class="modal-admin-affiliate">
        <div class="affiliate-title">
            <span class="gradient-green">ADMIN AFFILIATE</span>
        </div>
        <div class="affiliate-avatar" v-bind:class="[
            'avatar-' + adminGetLevelColor,
            'avatar-' + modalsData.affiliate.rank
        ]">
            <AvatarImage v-bind:image="modalsData.affiliate.avatar" />
        </div>
        <div class="affiliate-username">
            <span v-html="modalsData.affiliate.username"></span>
            <BoxLevel v-if="['admin', 'mod'].includes(modalsData.affiliate.rank) === false" v-bind:level="adminGetLevel" v-bind:color="adminGetLevelColor" />
            <BoxRank v-if="adminGetRank !== null" v-bind:rank="adminGetRank" />
        </div>
        <div class="affiliate-date">Member since {{modalGetDate}}</div>
        <div class="affiliate-id">{{modalsData.affiliate._id}}</div>
        <div class="affiliate-settings">
            <div class="settings-element element-toggle">
                <div class="element-name">AFFILIATE LOCK</div>
                <button v-on:click="adminBlockToggle" v-bind:class="{ 'button-active': modalsData.affiliate.limits.blockAffiliate === true }" v-bind:disabled="socketSendLoading !== null"></button>
            </div>
            <div class="settings-element element-button">
                <div class="element-name">CLEAR AFFILIATES</div>
                <button v-on:click="adminClearButton">
                    <div class="button-inner">CLEAR</div>
                </button>
            </div>
            <div class="settings-element element-text">
                <div class="element-name">SET AFFILIATE CODE</div>
                <div class="element-input">
                    <input v-model="modalCode" type="text" />
                    <button v-on:click="adminCodeButton">
                        <div class="button-inner">UPDATE</div>
                    </button>
                </div>
            </div>
            <div class="settings-element element-number">
                <div class="element-name">SET AVAILABLE EARNINGS</div>
                <div class="element-input">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <input v-model="modalAvailable" type="text" />
                    <button v-on:click="adminAvailableToggle">
                        <div class="button-inner">UPDATE</div>
                    </button>
                </div>
            </div>
        </div>
        <div class="affiliate-stats">
            <div class="stats-element">
                <div class="element-inner">
                    TOTAL REFERRED
                    <div class="inner-amount">
                        <div class="amount-value">
                            <span>{{modalsData.affiliate.affiliates.referred}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="stats-element">
                <div class="element-inner">
                    TOTAL DEPOSITED
                    <div class="inner-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="amount-value">
                            <span>{{modalFormatValue(modalsData.affiliate.affiliates.deposit).split('.')[0]}}</span>.{{modalFormatValue(modalsData.affiliate.affiliates.deposit).split('.')[1]}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="stats-element element-profit">
                <div class="element-inner">
                    TOTAL EARNED
                    <div class="inner-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="amount-value">
                            <span>{{modalFormatValue(modalsData.affiliate.affiliates.earned).split('.')[0]}}</span>.{{modalFormatValue(modalsData.affiliate.affiliates.earned).split('.')[1]}}
                        </div>
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
        name: 'ModalAdminAffiliate',
        components: {
            AvatarImage,
            BoxLevel,
            BoxRank
        },
        data() {
            return {
                modalCode: null,
                modalAvailable: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'adminSendAffiliateBlockSocket', 
                'adminSendAffiliateClearSocket', 
                'adminSendAffiliateCodeSocket', 
                'adminSendAffiliateAvailableSocket'
            ]),
            modalFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString();
            },
            adminBlockToggle() {
                const data = { userId: this.modalsData.affiliate._id, block: !this.modalsData.affiliate.limits.affiliateBlock };
                this.adminSendAffiliateBlockSocket(data);
            },
            adminClearButton() {
                const data = { userId: this.modalsData.affiliate._id };
                this.adminSendAffiliateClearSocket(data);
            },
            adminCodeButton() {
                if(this.modalCode !== null && this.modalCode.trim() !== '' && (this.modalCode.trim().length <= 3 || this.modalCode.trim().length > 20)) {
                    this.notificationShow({ type: 'error', message: 'Your entered affiliate code is invalid.' });
                    return;
                }

                this.modalCode = this.modalCode.trim() === '' ? null : this.modalCode;

                const data = { userId: this.modalsData.affiliate._id, code: this.modalCode };
                this.adminSendAffiliateCodeSocket(data);
            },
            adminAvailableToggle() {
                const amount = Math.floor(this.modalAvailable * 1000);

                if(amount === null || isNaN(amount) === true || amount < 0) {
                    this.notificationShow({type: 'error', message: 'Your entered available earnings amount is invalid.'});
                    return;
                }

                const data = { userId: this.modalsData.affiliate._id, amount: amount };
                this.adminSendAffiliateAvailableSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading', 
                'modalsData'
            ]),
            adminGetLevel() {
                let level = Math.floor(Math.pow(this.modalsData.affiliate.xp / 1000 / 100, 1 / 3));
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
                const betAmount = this.modalsData.affiliate.stats.bet / 1000;
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

                if(this.modalsData.affiliate.rank !== 'user') { rank = this.modalsData.affiliate.rank; }

                return rank;
            },
            modalGetDate() {
                const date = new Date(this.modalsData.affiliate.createdAt);
                return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
            }
        },
        watch: {
            'modalsData': {
                handler(data, oldData) {
                    this.modalCode = this.modalsData.affiliate.affiliates.code;
                    this.modalAvailable = parseFloat(Math.floor(this.modalsData.affiliate.affiliates.available / 10) / 100).toFixed(2);
                },
                deep: true
            }
        },
        created() {
            this.modalCode = this.modalsData.affiliate.affiliates.code;
            this.modalAvailable = parseFloat(Math.floor(this.modalsData.affiliate.affiliates.available / 10) / 100).toFixed(2);
        }
    }
</script>

<style scoped>
    .modal-admin-affiliate {
        width: 770px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 30px 30px 30px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% 0%, rgba(0, 255, 194, 0.15) 0%, rgba(7, 38, 61, 0) 80%), 
                    linear-gradient(256deg, #07263d 0%, #07243a 100%);
    }

    .modal-admin-affiliate .affiliate-title {
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-admin-affiliate .affiliate-avatar {
        width: 95px;
        height: 95px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-top: 20px;
        border-radius: 50%;
        border: 2px solid #9e9e9e;
        overflow: hidden;
    }

    .modal-admin-affiliate .affiliate-avatar.avatar-blue {
        border: 2px solid #559ee4;
    }

    .modal-admin-affiliate .affiliate-avatar.avatar-green {
        border: 2px solid #b8e92d;
    }

    .modal-admin-affiliate .affiliate-avatar.avatar-orange {
        border: 2px solid #fca311;
    }

    .modal-admin-affiliate .affiliate-avatar.avatar-red {
        border: 2px solid #ff4e4e;
    }

    .modal-admin-affiliate .affiliate-avatar.avatar-purple {
        border: 2px solid #6953f1;
    }
    
    .modal-admin-affiliate .affiliate-avatar.avatar-mod {
        border: 2px solid #ffb703;
    }

    .modal-admin-affiliate .affiliate-avatar.avatar-admin {
        border: 2px solid #0dd4b1;
    }

    .modal-admin-affiliate .affiliate-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    .modal-admin-affiliate .affiliate-username {
        display: flex;
        align-items: center;
        margin-top: 18px;
        font-size: 22px;
        font-weight: 700;
        color: #ffffff;
    }

    .modal-admin-affiliate .affiliate-date {
        margin-top: 3px;
        font-size: 14px;
        font-weight: 400;
        color: #49687d;
    }

    .modal-admin-affiliate .affiliate-id {
        margin-top: 5px;
        font-size: 14px;
        font-weight: 400;
        color: #db7d48;
    }

    .modal-admin-affiliate .affiliate-settings {
        width: 100%;
        margin-top: 25px;
    }

    .modal-admin-affiliate .settings-element {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
        padding: 0 20px;
        border-radius: 5px;
        background-color: rgba(19, 66, 88, 0.3);
    }

    .modal-admin-affiliate .settings-element:first-of-type {
        margin-top: 0;
    }

    .modal-admin-affiliate .element-name {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #bbbfd0;
    }

    .modal-admin-affiliate .settings-element.element-toggle button {
        width: 45px;
        height: 15px;
        position: relative;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .modal-admin-affiliate .settings-element.element-toggle button:disabled {
        cursor: not-allowed;
    }

    .modal-admin-affiliate .settings-element.element-toggle button::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #072435;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .modal-admin-affiliate .settings-element.element-toggle button::after {
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

    .modal-admin-affiliate .settings-element.element-toggle button.button-active::after {
        transform: translate(20px, 0);
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
    }

    .modal-admin-affiliate .settings-element.element-text .element-input,
    .modal-admin-affiliate .settings-element.element-number .element-input {
        position: relative;
        display: flex;
        align-items: center;
    }

    .modal-admin-affiliate .settings-element.element-number .element-input img {
        width: 15px;
        height: 15px;
        position: absolute;
        top: 9px;
        left: 15px;
    }

    .modal-admin-affiliate .settings-element.element-text .element-input input,
    .modal-admin-affiliate .settings-element.element-number .element-input input {
        width: 220px;
        height: 33px;
        margin-right: 20px;
        padding: 0 15px;
        border-radius: 5px;
        font-size: 12px;
        font-weight: 600;
        color: #db7d48;
        background: rgba(10, 36, 52, 0.5);
    }

    .modal-admin-affiliate .settings-element.element-number .element-input input {
        padding: 0 15px 0 37px;
        color: #ffffff;
    }

    .modal-admin-affiliate .settings-element.element-button button,
    .modal-admin-affiliate .settings-element.element-text .element-input button,
    .modal-admin-affiliate .settings-element.element-number .element-input button {
        width: 60px;
        height: 30px;
        filter: drop-shadow(0px 4px 25px rgba(1, 236, 174, 0.15)) drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .modal-admin-affiliate .settings-element.element-button button  .button-inner,
    .modal-admin-affiliate .settings-element.element-text .element-input button .button-inner,
    .modal-admin-affiliate .settings-element.element-number .element-input button .button-inner {
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

    .modal-admin-affiliate .affiliate-stats {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 35px;
    }

    .modal-admin-affiliate .stats-element {
        width: calc(50% - 17px);
        height: 78px;
        position: relative;
        padding: 1px;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .modal-admin-affiliate .stats-element:first-of-type {
        margin-right: 34px;
    }

    .modal-admin-affiliate .stats-element:last-of-type {
        margin-top: 35px;
    }

    .modal-admin-affiliate .stats-element::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 25%, 100% 75%, calc(100% - 16px) 100%, 16px 100%, 0 75%, 0 25%);
    }

    .modal-admin-affiliate .stats-element.element-profit::before {
        background: linear-gradient(180deg, #04131f 25%, #00ffc2 100%);
    }

    .modal-admin-affiliate .stats-element.element-negative::before {
        background: linear-gradient(180deg, #04131f 25%, #cf5048 100%);
    }

    .modal-admin-affiliate .element-inner {
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

    .modal-admin-affiliate .stats-element.element-profit .element-inner {
        background: radial-gradient(81.75% 81.75% at 50% 50%, rgba(0, 255, 194, 0.05) 0%, rgba(0, 0, 0, 0) 100%), #072435;
    }

    .modal-admin-affiliate .stats-element.element-negative .element-inner {
        background: radial-gradient(81.75% 81.75% at 50% 50%, rgba(207, 80, 72, 0.05) 0%, rgba(0, 0, 0, 0) 100%), #072435;
    }

    .modal-admin-affiliate .inner-amount {
        display: flex;
        align-items: center;
    }

    .modal-admin-affiliate .inner-amount img {
        width: 20px;
        height: 20px;
        margin-right: 12px;
    }

    .modal-admin-affiliate .amount-value {
        font-size: 14px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .modal-admin-affiliate .amount-value span {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
    }

    @media only screen and (max-width: 790px) {

        .modal-admin-affiliate {
            width: calc(100vw - 20px);
            padding: 35px 10px 30px 10px;
        }

    }
</style>
