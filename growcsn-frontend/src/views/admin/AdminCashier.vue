<template>
    <div class="admin-cashier">
        <div class="cashier-list">
            <div class="list-header">
                <div class="header-user">USERNAME</div>
                <div class="header-method">METHOD</div>
                <div class="header-type">TYPE</div>
                <div class="header-amount">AMOUNT</div>
                <div class="header-option">OPTION</div>
            </div>
            <div class="list-content">
                <transition name="fade" mode="out-in">
                    <div v-if="adminCashierList.data === null || adminCashierList.loading === true" class="content-loading" key="loading">
                        <LoadingAnimation />
                    </div>
                    <div v-else-if="adminCashierList.data.length > 0" class="content-list" key="data">

                        <AdminCashierElement v-for="transaction in adminCashierList.data" v-bind:key="transaction._id" v-bind:transaction="transaction" />

                    </div>
                    <div v-else class="content-empty" key="empty">No transactions found.</div>
                </transition>
            </div>
            <div class="list-pagination">
                <button v-on:click="adminSetPage(adminCashierList.page - 1)" class="button-prev" v-bind:disabled="adminCashierList.page <= 1">
                    <div class="button-inner">
                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.2788 4.30337C11.2297 4.2954 11.18 4.29173 11.1302 4.29237H2.66447L2.84907 4.20651C3.02951 4.12111 3.19366 4.00487 3.33417 3.86307L5.70819 1.48906C6.02085 1.19059 6.07339 0.710444 5.83269 0.351417C5.55254 -0.0311676 5.0153 -0.114237 4.63269 0.165907C4.60178 0.188552 4.5724 0.213237 4.54479 0.2398L0.251817 4.53278C-0.0836794 4.8679 -0.0839745 5.41152 0.251146 5.74702C0.251361 5.74723 0.251602 5.74747 0.251817 5.74769L4.54479 10.0407C4.88056 10.3755 5.42418 10.3747 5.75903 10.039C5.78538 10.0125 5.80999 9.98443 5.83269 9.95481C6.07339 9.59578 6.02085 9.11564 5.70819 8.81717L3.33847 6.43886C3.21249 6.31275 3.06766 6.20701 2.90917 6.12547L2.65159 6.00956H11.083C11.5216 6.02585 11.9064 5.71946 11.9888 5.28834C12.0647 4.82027 11.7468 4.3793 11.2788 4.30337Z" />
                        </svg>
                    </div>
                </button>
                <div class="pagination-info">
                    PAGE <span class="text-green-gradient">{{adminCashierList.page}}</span> / {{Math.ceil(adminCashierList.count / 12) <= 0 ? '1' : Math.ceil(adminCashierList.count / 12)}}
                </div>
                <button v-on:click="adminSetPage(adminCashierList.page + 1)" class="button-next" v-bind:disabled="adminCashierList.page >= Math.ceil(adminCashierList.count / 12)">
                    <div class="button-inner">
                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.721245 4.30337C0.770346 4.2954 0.820037 4.29173 0.869755 4.29237H9.33553L9.15093 4.20651C8.97049 4.12111 8.80634 4.00487 8.66583 3.86307L6.29181 1.48906C5.97915 1.19059 5.92661 0.710444 6.16731 0.351417C6.44746 -0.0311676 6.9847 -0.114237 7.36731 0.165907C7.39822 0.188552 7.4276 0.213237 7.45521 0.2398L11.7482 4.53278C12.0837 4.8679 12.084 5.41152 11.7489 5.74702C11.7486 5.74723 11.7484 5.74747 11.7482 5.74769L7.45521 10.0407C7.11944 10.3755 6.57582 10.3747 6.24097 10.039C6.21462 10.0125 6.19001 9.98443 6.16731 9.95481C5.92661 9.59578 5.97915 9.11564 6.29181 8.81717L8.66153 6.43886C8.78751 6.31275 8.93234 6.20701 9.09083 6.12547L9.34841 6.00956H0.917005C0.478396 6.02585 0.0935841 5.71946 0.0111866 5.28834C-0.0647192 4.82027 0.253177 4.3793 0.721245 4.30337Z" />
                        </svg>
                    </div>
                </button>
            </div>
        </div>
        <div class="cashier-filters">
            <AdminFilterSearch />

            <div class="filters-generate">
                <AdminFilterAmount />
                <input v-model="adminCount" type="number" placeholder="Enter card count..." />
                <textarea v-model="adminGetCodes" rows="10" disabled></textarea>

                <button v-on:click="adminGenerateButton()">GENERATE GIFT CARD</button>
            </div>
            <div class="filters-stats">
                <div class="stats-deposit">
                    <div class="deposit-title">DEPOSIT QUEUE</div>
                    <div class="deposit-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <span class="gradient-green">0</span>
                    </div>
                </div>
                <div class="stats-withdraw">
                    <div class="withdraw-title">WITHDRAW QUEUE</div>
                    <div class="withdraw-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <span>0</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import LoadingAnimation from '@/components/LoadingAnimation';
    import AdminCashierElement from '@/components/admin/AdminCashierElement';
    import AdminFilterSearch from '@/components/admin/AdminFilterSearch';
    import AdminFilterAmount from '@/components/admin/AdminFilterAmount';

    export default {
        name: 'AdminAffiliates',
        components: {
            LoadingAnimation,
            AdminCashierElement,
            AdminFilterSearch,
            AdminFilterAmount
        },
        data() {
            return {
                adminCount: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'adminSetFilterSearch',
                'adminSetCashierListPage',
                'adminGetCashierListSocket',
                'adminSendCashierCreateSocket'
            ]),
            adminSetPage(page) {
                if(this.adminCashierList.page === page) { return; }
                if(page < 1 || page > Math.ceil(this.adminCashierList.count / 12)) { return; }

                this.adminSetCashierListPage(page);

                const data = { page: this.adminCashierList.page, search: this.adminFilterSearch };
                this.adminGetCashierListSocket(data);
            },
            adminGenerateButton() {
                const amount = Math.floor(Number(this.adminFilterAmount) * 1000);

                if(isNaN(this.adminCount) === true || this.adminCount <= 0) {
                    this.notificationShow({type: 'error', message: 'Your entered card count is invalid.'});
                    return;
                }

                const data = { reward: amount, count: this.adminCount };
                this.adminSendCashierCreateSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'adminFilterSearch', 
                'adminFilterAmount', 
                'adminCashierList'
            ]),
            adminGetCodes() {
                let codes = '';

                if(this.adminCashierList.codes !== null) {
                    for(const code of this.adminCashierList.codes) {
                        const formated = code.code.substring(0, 4) + '-' + code.code.substring(4, 8) + '-' + code.code.substring(8, 12) + '-' + code.code.substring(12, 16);

                        if(codes.length !== 0) { codes = codes + ',\n' + formated; } 
                        else { codes = formated; }
                    }
                }

                return  codes;
            }
        },
        created() {
            if(this.adminCashierList.loading === false) {
                const data = { page: this.adminCashierList.page, search: this.adminFilterSearch };
                this.adminGetCashierListSocket(data);
            }
        },
        beforeRouteLeave(to, from, next) {
            this.adminSetFilterSearch('');
            next();
        }
    }
</script>

<style scoped>
    .admin-cashier {
        width: 100%;
        display: flex;
    }

    .admin-cashier .cashier-list {
        width: calc(100% - 350px);
        padding-top: 15px;
        padding-right: 30px;
    }

    .admin-cashier .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        font-size: 14px;
        font-weight: 700;
        color: #8bacc8;
    }

    .admin-cashier .header-user {
        width: 30%;
    }

    .admin-cashier .header-method,
    .admin-cashier .header-type {
        width: 15%;
    }

    .admin-cashier .header-amount {
        width: 25%;
    }

    .admin-cashier .header-option {
        width: 15%;
        display: flex;
        justify-content: flex-end;
    }

    .admin-cashier .list-content {
        width: 100%;
        margin-top: 20px;
        padding: 20px 0;
        border-top: 1px solid rgba(24, 72, 109, 0.5);
        border-bottom: 1px solid rgba(24, 72, 109, 0.5);
    }

    .admin-cashier .content-loading {
        width: 100%;
        height: 330px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .admin-cashier .content-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .admin-cashier .content-loading.fade-leave-to {
        opacity: 0;
    }

    .admin-cashier .content-list {
        width: 100%;
    }

    .admin-cashier .content-empty {
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

    .admin-cashier .content-list.fade-enter-active,
    .admin-cashier .content-empty.fade-enter-active {
        transition: opacity 0.5s;
    }

    .admin-cashier .content-list.fade-enter-from,
    .admin-cashier .content-empty.fade-enter-from {
        opacity: 0;
    }

    .admin-cashier .list-pagination {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 25px;
    }

    .admin-cashier .list-pagination button {
        width: 52px;
        height: 37px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .admin-cashier .list-pagination button:disabled {
        cursor: not-allowed;
    }

    .admin-cashier .list-pagination button:before {
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

    .admin-cashier .list-pagination button:disabled:before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #05253e 100%);
    }

    .admin-cashier .list-pagination button:after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #001a2f;
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .admin-cashier .list-pagination button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(3, 20, 34, 0.27);
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .admin-cashier .list-pagination button:disabled .button-inner {
        background: rgba(3, 20, 34, 0.27);
        box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.35);
    }

    .admin-cashier .list-pagination button .button-inner svg {
        fill: #00ffc2;
    }

    .admin-cashier .list-pagination button:disabled .button-inner svg {
        fill: #7a93ac;
    }

    .admin-cashier .pagination-info {
        font-size: 12px;
        font-weight: 800;
        color: #5e768e;
    }

    .admin-cashier .cashier-filters {
        width: 350px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .admin-cashier .filters-generate {
        width: 100%;
        margin-top: 20px;
    }

    .admin-cashier .filters-generate input,
    .admin-cashier .filters-generate textarea {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 12px;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background: rgba(19, 66, 88, 0.25);
        border: 1px dashed rgba(46, 93, 119, 0.5);
    }

    .admin-cashier .filters-generate input {
        height: 47px;
        padding: 0 15px;
    }

    .admin-cashier .filters-generate textarea {
        padding: 5px 15px;
        resize: none;
    }

    .admin-cashier .filters-generate input::placeholder {
        color: #49687d;
    }

    .admin-cashier .filters-generate button {
        width: 100%;
        height: 47px;
        margin-top: 12px;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
    }

    .admin-cashier .filters-stats {
        width: 300px;
        margin-top: 25px;
        padding-top: 25px;
        border-top: 1px dashed #1a4060;
    }

    .admin-cashier .stats-deposit,
    .admin-cashier .stats-withdraw {
        width: 100%;
        height: 160px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        border: 1px dashed #073054;
    }

    .admin-cashier .stats-deposit {
        background: radial-gradient(60% 55% at 50% 100%, rgba(1, 246, 185, 0.2) 0%, rgba(1, 247, 185, 0) 100%);
    }

    .admin-cashier .stats-withdraw {
        margin-top: 15px;
        background: radial-gradient(80% 70% at 50% 100%, rgba(245, 80, 70, 0.2) 0%, rgba(245, 80, 70, 0) 100%);
    }

    .admin-cashier .deposit-title,
    .admin-cashier .withdraw-title {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    .admin-cashier .deposit-amount,
    .admin-cashier .withdraw-amount {
        display: flex;
        align-items: center;
        margin-top: 12px;
    }

    .admin-cashier .deposit-amount img,
    .admin-cashier .withdraw-amount img {
        width: 24px;
        height: 24px;
        margin-right: 12px;
    }

    .admin-cashier .deposit-amount span,
    .admin-cashier .withdraw-amount span {
        font-size: 32px;
        font-weight: 800;
        color: #f55046;
    }

    @media only screen and (max-width: 1250px) {

        .admin-cashier {
            flex-direction: column-reverse;
        }

        .admin-cashier .cashier-list {
            width: 100%;
            padding-top: 0;
            padding-right: 0;
        }

        .admin-cashier .list-header {
            display: none;
        }

        .admin-cashier .cashier-filters {
            width: 100%;
        }

        .admin-cashier .filters-stats {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

        .admin-cashier .stats-deposit,
        .admin-cashier .stats-withdraw {
            width: calc(50% - 7.5px)
        }

        .admin-cashier .stats-withdraw {
            margin-top: 0;
        }

    }
</style>
