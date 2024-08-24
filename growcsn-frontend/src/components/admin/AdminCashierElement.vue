<template>
    <div class="admin-cashier-element">
        <div class="element-section section-user">
            <div class="section-title">USERNAME</div>
            <div class="section-content">
                <div class="content-avatar">
                    <AvatarImage v-bind:image="transaction.user.avatar" />
                </div>
                <div v-html="transaction.user.username" class="content-username"></div>
                <div class="content-rank" v-bind:class="['rank-' + transaction.user.rank]">{{transaction.user.rank.toUpperCase()}}</div>
            </div>
        </div>
        <div class="element-section section-method">
            <div class="section-title">METHOD</div>
            <div class="section-content">
                {{ transaction.method.charAt(0).toUpperCase() + transaction.method.slice(1) }}
            </div>
        </div>
        <div class="element-section section-type" v-bind:class="[ 'type-' + transaction.type ]">
            <div class="section-title">TYPE</div>
            <div class="section-content">
                {{ transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1) }}
            </div>
        </div>
        <div class="element-section section-amount">
            <div class="section-title">AMOUNT</div>
            <div class="section-content">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="content-value">
                    <span>{{adminFormatValue(transaction.amount).split('.')[0]}}</span>.{{adminFormatValue(transaction.amount).split('.')[1]}}
                </div>
            </div>
        </div>
        <div class="element-section section-option">
            <div class="section-title">OPTION</div>
            <div class="section-content">
                <button v-if="transaction.method === 'crypto'" v-on:click="adminApproveButton()">
                    APPROVE
                </button>
                <button v-else v-on:click="adminCancelButton()">
                    CANCEL
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AvatarImage from '@/components/AvatarImage';

    export default {
        name: 'AdminCashierElement',
        props: [
            'transaction'
        ],
        components: {
            AvatarImage
        },
        methods: {
            ...mapActions([
                'modalsSetData',
                'modalsSetShow',
                'adminSendCashierCancelSocket'
            ]),
            adminFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            adminApproveButton() {
                this.modalsSetData({ transaction: this.transaction });
                this.modalsSetShow('AdminCrypto');
            },
            adminCancelButton() {
                this.modalsSetData({ typeConfirm: 'robuxCancel', messageConfirm: 'Please confirm that you want cancel the DLS transaction.', data: { offerId: this.transaction._id } });
                this.modalsSetShow('AdminConfirm');
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading'
            ])
        }
    }
</script>

<style scoped>
    .admin-cashier-element {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
        background: rgba(19, 66, 88, 0.25);
    }

    .admin-cashier-element:nth-child(even) {
        background: rgba(19, 66, 88, 0.1);
    }

    .admin-cashier-element .element-section {
        display: flex;
        flex-direction: column;
    }

    .admin-cashier-element .element-section.section-user {
        width: 30%;
    }

    .admin-cashier-element .element-section.section-method,
    .admin-cashier-element .element-section.section-type,
    .admin-cashier-element .element-section.section-option {
        width: 15%;
    }

    .admin-cashier-element .element-section.section-amount {
        width: 25%;
    }

    .admin-cashier-element .section-title {
        display: none;
        font-size: 13px;
        font-weight: 600;
        color: #8bacc8;
    }

    .admin-cashier-element .section-content {
        display: flex;
        align-items: center;
    }

    .admin-cashier-element .element-section.section-method .section-content,
    .admin-cashier-element .element-section.section-type .section-content {
        font-size: 14px;
        font-weight: 400;
        color: #bbbfd0;
    }

    .admin-cashier-element .element-section.section-type.type-deposit .section-content {
        color: #00ffc2;
    }

    .admin-cashier-element .element-section.section-type.type-withdraw .section-content {
        color: #f55046;
    }

    .admin-cashier-element .element-section.section-option .section-content {
        justify-content: flex-end;
    }

    .admin-cashier-element .element-section.section-user .content-avatar {
        width: 26px;
        height: 26px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        border-radius: 50%;
        border: 1px solid #9e9e9e;
        overflow: hidden;
    }

    .admin-cashier-element .element-section.section-user .content-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    .admin-cashier-element .element-section.section-user .content-username {
        margin-left: 10px;
        font-size: 14px;
        font-weight: 400;
        color: #bbbfd0;
    }

    .admin-cashier-element .element-section.section-user .content-rank {
        margin-left: 12px;
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
    }

    .admin-cashier-element .element-section.section-user .content-rank.rank-mod {
        color: #ffb703;
    }
    
    .admin-cashier-element .element-section.section-user .content-rank.rank-admin {
        color: #0dd4b1;
    }

    .admin-cashier-element .element-section.section-amount .section-content img {
        width: 18px;
        height: 18px;
        margin-right: 10px;
    }

    .admin-cashier-element .element-section.section-amount .content-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .admin-cashier-element .element-section.section-amount .content-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .admin-cashier-element .element-section.section-option .section-content button {
        display: flex;
        align-items: center;
        margin-right: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
        transition: all 0.3s ease;
    }

    .admin-cashier-element .element-section.section-option .section-content button:last-child {
        margin-right: 0;
    }

    .admin-cashier-element .element-section.section-option .section-content button:hover {
        color: #ffffff;
    }

    .admin-cashier-element .element-section.section-option .section-content button svg {
        margin-right: 8px;
        fill: #bbbfd0;
        transition: fill 0.3s ease;
    }

    .admin-cashier-element .element-section.section-option .section-content button:hover svg {
        fill: #ffffff;
    }

    @media only screen and (max-width: 1250px) {

        .admin-cashier-element {
            height: auto;
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 20px;
        }

        .admin-cashier-element .element-section {
            width: 100%!important;
            margin-top: 10px;
        }

        .admin-cashier-element .element-section.section-user {
            margin-top: 0;
        }

        .admin-cashier-element .element-section.section-option {
            align-items: flex-start;
        }

        .admin-cashier-element .section-title {
            display: block;
        }

        .admin-cashier-element .section-content {
            margin-top: 5px;
        }

    }
</style>
