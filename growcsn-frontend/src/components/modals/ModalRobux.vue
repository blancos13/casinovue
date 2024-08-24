<template>
    <div class="modal-robux">
        <button v-on:click="modalBackButton" class="button-back">
            <div class="button-inner">BACK</div>
        </button>
        <div class="robux-title">
            <span class="gradient-green">{{modalsData.typeCashier}} ROBUX</span>
        </div>
        <div class="robux-amount">
            <input v-model="modalAmount" v-on:input="modalValidateInput()" type="text" placeholder="AMOUNT OF ROBUX" />
            <img src="@/assets/img/icons/coin.svg" alt="icon" />
            <button v-on:click="modalClearButton()">
                <div class="button-inner">CLEAR</div>
            </button>
        </div>
        <div class="robux-info">
            <div v-if="modalsData.typeCashier === 'deposit'" class="info-deposit">
                Enter your desired DLS amount that you want to deposit. Make sure the amount doesn’t exceed your Robux balance of your Growtopia Account.
            </div>
            <div v-else class="info-withdraw">
                Growtopia imposes a 30% fee on every transaction, therefore you will receive
                <div class="withdraw-amount">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />{{Math.floor(modalGetAmount * 100 * 0.7) / 100}}
                </div>
                in your account. We do not receive any of this fee, and have no way to stop it.
            </div>
        </div>
        <button v-on:click="modalActionButton()" class="button-action" v-bind:disabled="socketSendLoading !== null">
            <div class="button-inner">
                <transition name="fade" mode="out-in">
                    <ButtonLoading v-if="socketSendLoading === 'RobuxDeposit' || socketSendLoading === 'RobuxWithdraw'" />
                    <div v-else class="inner-content">
                        {{modalsData.typeCashier}}
                        <div class="content-amount">
                            <img src="@/assets/img/icons/coin.svg" alt="icon" />
                            {{modalGetAmount}}
                        </div>
                    </div>
                </transition>
            </div>
        </button>
        <div class="robux-offers">
            <div class="offers-header">
                <div class="header-date">DATE</div>
                <div class="header-amount">AMOUNT</div>
                <div class="header-state">STATE</div>
                <div class="header-action">ACTION</div>
            </div>
            <div class="offers-content">
                <transition name="fade" mode="out-in">
                    <div v-if="cashierRobuxData.offers === null || cashierRobuxData.loading === true" class="content-loading" key="loading">
                        <LoadingAnimation />
                    </div>
                    <div v-else-if="cashierRobuxData.offers.length > 0" class="content-list" key="data">

                        <CashierRobuxElement v-for="offer in cashierRobuxData.offers" v-bind:key="offer._id" v-bind:offer="offer" />

                    </div>
                    <div v-else class="content-empty" key="empty">No offers found.</div>
                </transition>
            </div>
            <div class="offers-pagination">
                <button v-on:click="modalSetPage(cashierRobuxData.page - 1)" class="button-prev" v-bind:disabled="cashierRobuxData.page <= 1">
                    <div class="button-inner">
                        <IconLeftGradient />
                    </div>
                </button>
                <div class="pagination-info">
                    PAGE <span class="gradient-green">{{cashierRobuxData.page}}</span> / {{Math.ceil(cashierRobuxData.count / 8) <= 0 ? '1' : Math.ceil(cashierRobuxData.count / 8)}}
                </div>
                <button v-on:click="modalSetPage(cashierRobuxData.page + 1)" class="button-next" v-bind:disabled="cashierRobuxData.page >= Math.ceil(cashierRobuxData.count / 8)">
                    <div class="button-inner">
                        <IconRightGradient />
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import ButtonLoading from '@/components/ButtonLoading';
    import LoadingAnimation from '@/components/LoadingAnimation';
    import IconLeftGradient from '@/components/icons/IconLeftGradient';
    import IconRightGradient from '@/components/icons/IconRightGradient';
    import CashierRobuxElement from '@/components/cashier/CashierRobuxElement';

    export default {
        name: 'ModalRobux',
        components: {
            ButtonLoading,
            LoadingAnimation,
            IconLeftGradient,
            IconRightGradient,
            CashierRobuxElement
        },
        data() {
            return {
                modalAmount: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'modalsSetShow',
                'cashierSetRobuxDataPage',
                'cashierGetRobuxDataSocket',
                'cashierSendRobuxDepositSocket', 
                'cashierSendRobuxWithdrawSocket'
            ]),
            modalValidateInput() {
                this.modalAmount = this.modalAmount.replace(/[^0-9]/g, '');
            },
            modalBackButton() {
                this.modalsSetShow(null);
                setTimeout(() => { this.modalsSetShow('Cashier'); }, 200);
            },
            modalClearButton() {
                this.modalAmount = null;
            },
            modalActionButton() {
                const amount = Math.floor(this.modalAmount * 1000);

                if(amount === null || isNaN(amount) === true || amount <= 0) {
                    this.notificationShow({type: 'error', message: 'Your entered ' + this.modalsData.type + ' amount is invalid.'});
                    return;
                }

                const data = { amount: amount };
                if(this.modalsData.typeCashier === 'deposit') { this.cashierSendRobuxDepositSocket(data); }
                else { this.cashierSendRobuxWithdrawSocket(data); }

                this.modalAmount = null;
            },
            modalSetPage(page) {
                if(this.cashierRobuxData.page === page) { return; }
                if(page < 1 || page > Math.ceil(this.cashierRobuxData.count / 8)) { return; }

                this.cashierSetRobuxDataPage(page);

                const data = { page: this.cashierRobuxData.page, type: this.modalsData.typeCashier };
                this.cashierGetRobuxDataSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',  
                'modalsData', 
                'cashierRobuxData'
            ]),
            modalGetAmount() {
                let amount = Math.floor(this.modalAmount * 100) / 100;

                if(amount === null || isNaN(amount) === true) {
                    amount = 0;
                }

                return amount;
            }
        },
        created() {
            this.cashierSetRobuxDataPage(1);

            if(this.cashierRobuxData.loading === false) {
                const data = { page: this.cashierRobuxData.page, type: this.modalsData.typeCashier };
                this.cashierGetRobuxDataSocket(data);
            }
        }
    }
</script>

<style scoped>
    .modal-robux {
        width: 900px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 50px 35px 50px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% -30%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(255deg, #07263d 0%, #07243a 100%);
    }

    .modal-robux button.button-back {
        height: 33px;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 15px;
        left: 20px;
        filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1));
        z-index: 1;
    }

    .modal-robux button.button-back .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 12px;
        font-size: 14px;
        font-weight: 800;
        color: #75adc2;
        background-color: #1a4f63;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
        transition: color 0.3s ease;
    }

    .modal-robux button.button-back:hover .button-inner {
        color: #ffffff;
    }

    .modal-robux .robux-title {
        text-align: center;
        text-transform: uppercase;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-robux .robux-amount {
        width: 448px;
        height: 72px;
        position: relative;
        margin-top: 35px;
        padding: 1px;
    }

    .modal-robux .robux-amount::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 25%, 100% 75%, calc(100% - 14px) 100%, 14px 100%, 0 75%, 0 25%);
    }

    .modal-robux .robux-amount input {
        width: 100%;
        height: 100%;
        padding: 0 127px 0 45px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: #072435;
        clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 25%, 100% 75%, calc(100% - 14px) 100%, 14px 100%, 0 75%, 0 25%);
    }

    .modal-robux .robux-amount input::placeholder {
        color: #5e768e;
    }

    .modal-robux .robux-amount img {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translate(0, -50%);
    }

    .modal-robux .robux-amount button {
        width: 92px;
        height: 39px;
        position: absolute;
        top: 50%;
        right: 25px;
        transform: translate(0, -50%);
        filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
    }

    .modal-robux .robux-amount button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 800;
        color: #bbbfd0;
        background: #1a4f63;
        transition: color 0.3s ease;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .modal-robux .robux-amount button:hover .button-inner {
        color: #ffffff;
    }

    .modal-robux .robux-info {
        width: 630px;
        margin-top: 32px;
    }

    .modal-robux .info-deposit,
    .modal-robux .info-withdraw {
        width: 100%;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        color: #db7d48;
    }

    .modal-robux .withdraw-amount {
        position: relative;
        display: inline-block;
        margin-left: 4px;
        padding-left: 21px;
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
    }

    .modal-robux .withdraw-amount img {
        width: 16px;
        height: 16px;
        position: absolute;
        top: 4px;
        left: 0;
    }

    .modal-robux button.button-action {
        height: 48px;
        margin-top: 30px;
        filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35)), 
                drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15));
    }

    .modal-robux button.button-action .button-inner {
        width: 100%;
        min-width: 175px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 32px;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .modal-robux button.button-action .button-loading.fade-enter-active {
        transition: opacity 0.5s;
    }

    .modal-robux button.button-action .button-loading.fade-enter-from {
        opacity: 0;
    }

    .modal-robux button.button-action .inner-content {
        display: flex;
        align-items: center;
        text-transform: uppercase;
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    .modal-robux button.button-action .content-amount {
        display: flex;
        align-items: center;
        margin-left: 8px;
        font-weight: 700;
    }

    .modal-robux button.button-action .content-amount img {
        width: 16px;
        height: 16px;
        margin-right: 7px;
    }

    .modal-robux .robux-offers {
        width: 100%;
        margin-top: 35px;
        padding-top: 25px;
        border-top: 1px solid rgba(24, 72, 109, 0.5);
    }

    .modal-robux .offers-header {
        width: 100%;
        display: flex;
        padding: 0 20px;
    }

    .modal-robux .header-date,
    .modal-robux .header-amount,
    .modal-robux .header-state,
    .modal-robux .header-action {
        font-size: 14px;
        font-weight: 700;
        color: #8bacc8;
    }

    .modal-robux .header-date,
    .modal-robux .header-amount {
        width: 30%;
    }

    .modal-robux .header-state {
        width: 15%;
    }

    .modal-robux .header-action {
        width: 25%;
        display: flex;
        justify-content: flex-end;
    }

    .modal-robux .offers-content {
        width: 100%;
        margin-top: 25px;
    }

    .modal-robux .content-loading {
        width: 100%;
        height: 235px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-robux .content-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .modal-robux .content-loading.fade-leave-to {
        opacity: 0;
    }

    .modal-robux .content-list {
        width: 100%;
    }

    .modal-robux .content-empty {
        width: 100%;
        height: 192px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
    }

    .modal-robux .content-list.fade-enter-active,
    .modal-robux .content-empty.fade-enter-active {
        transition: opacity 0.5s;
    }

    .modal-robux .content-list.fade-enter-from,
    .modal-robux .content-empty.fade-enter-from {
        opacity: 0;
    }

    .modal-robux .offers-pagination {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid rgba(24, 72, 109, 0.5);
    }

    .modal-robux .offers-pagination button {
        width: 52px;
        height: 37px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .modal-robux .offers-pagination button:disabled {
        cursor: not-allowed;
    }

    .modal-robux .offers-pagination button:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #01fabd 0%, #01b376 100%);
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .modal-robux .offers-pagination button:disabled:before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #05253e 100%);
    }

    .modal-robux .offers-pagination button:after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #07253c;
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .modal-robux .offers-pagination button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(255deg, rgba(0, 255, 194, 0.1) 0%, rgba(0, 170, 109, 0.1) 100%), rgba(0, 0, 0, 0.1);
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .modal-robux .offers-pagination button:disabled .button-inner {
        background: rgba(3, 20, 34, 0.27);
        box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.35);
    }

    .modal-robux .offers-pagination button.button-prev .button-inner svg {
        fill: url(#icon-left-gradient-1);
    }

    .modal-robux .offers-pagination button.button-next .button-inner svg {
        fill: url(#icon-right-gradient-1);
    }

    .modal-robux .offers-pagination button:disabled .button-inner svg {
        fill: #7a93ac;
    }

    .modal-robux .pagination-info {
        font-size: 12px;
        font-weight: 800;
        color: #5e768e;
    }

    @media only screen and (max-width: 920px) {

        .modal-robux {
            width: calc(100vw - 20px);
            padding: 85px 20px 48px 20px;
        }

    }

    @media only screen and (max-width: 800px) {

        .modal-robux .robux-amount,
        .modal-robux .robux-info {
            width: 100%;
        }

        .modal-robux .offers-header {
            display: none;
        }

        .modal-robux .offers-content {
            margin-top: 0;
        }

    }
</style>
