<template>
    <div class="admin-rain">
        <div class="rain-list">
            <div class="list-header">
                <div class="header-type">TYPE</div>
                <div class="header-amount">AMOUNT</div>
                <div class="header-state">STATE</div>
                <div class="header-option">OPTION</div>
            </div>
            <div class="list-content">
                <transition name="fade" mode="out-in">
                    <div v-if="adminRainList.data === null || adminRainList.loading === true" class="content-loading" key="loading">
                        <LoadingAnimation />
                    </div>
                    <div v-else-if="adminRainList.data.length > 0" class="content-list" key="data">

                        <AdminRainElement v-for="rain in adminRainList.data" v-bind:key="rain._id" v-bind:rain="rain" />

                    </div>
                    <div v-else class="content-empty" key="empty">No rains found.</div>
                </transition>
            </div>
            <div class="list-pagination">
                <button v-on:click="adminSetPage(adminRainList.page - 1)" class="button-prev" v-bind:disabled="adminRainList.page <= 1">
                    <div class="button-inner">
                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.2788 4.30337C11.2297 4.2954 11.18 4.29173 11.1302 4.29237H2.66447L2.84907 4.20651C3.02951 4.12111 3.19366 4.00487 3.33417 3.86307L5.70819 1.48906C6.02085 1.19059 6.07339 0.710444 5.83269 0.351417C5.55254 -0.0311676 5.0153 -0.114237 4.63269 0.165907C4.60178 0.188552 4.5724 0.213237 4.54479 0.2398L0.251817 4.53278C-0.0836794 4.8679 -0.0839745 5.41152 0.251146 5.74702C0.251361 5.74723 0.251602 5.74747 0.251817 5.74769L4.54479 10.0407C4.88056 10.3755 5.42418 10.3747 5.75903 10.039C5.78538 10.0125 5.80999 9.98443 5.83269 9.95481C6.07339 9.59578 6.02085 9.11564 5.70819 8.81717L3.33847 6.43886C3.21249 6.31275 3.06766 6.20701 2.90917 6.12547L2.65159 6.00956H11.083C11.5216 6.02585 11.9064 5.71946 11.9888 5.28834C12.0647 4.82027 11.7468 4.3793 11.2788 4.30337Z" />
                        </svg>
                    </div>
                </button>
                <div class="pagination-info">
                    PAGE <span class="text-green-gradient">{{adminRainList.page}}</span> / {{Math.ceil(adminRainList.count / 12) <= 0 ? '1' : Math.ceil(adminRainList.count / 12)}}
                </div>
                <button v-on:click="adminSetPage(adminRainList.page + 1)" class="button-next" v-bind:disabled="adminRainList.page >= Math.ceil(adminRainList.count / 12)">
                    <div class="button-inner">
                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.721245 4.30337C0.770346 4.2954 0.820037 4.29173 0.869755 4.29237H9.33553L9.15093 4.20651C8.97049 4.12111 8.80634 4.00487 8.66583 3.86307L6.29181 1.48906C5.97915 1.19059 5.92661 0.710444 6.16731 0.351417C6.44746 -0.0311676 6.9847 -0.114237 7.36731 0.165907C7.39822 0.188552 7.4276 0.213237 7.45521 0.2398L11.7482 4.53278C12.0837 4.8679 12.084 5.41152 11.7489 5.74702C11.7486 5.74723 11.7484 5.74747 11.7482 5.74769L7.45521 10.0407C7.11944 10.3755 6.57582 10.3747 6.24097 10.039C6.21462 10.0125 6.19001 9.98443 6.16731 9.95481C5.92661 9.59578 5.97915 9.11564 6.29181 8.81717L8.66153 6.43886C8.78751 6.31275 8.93234 6.20701 9.09083 6.12547L9.34841 6.00956H0.917005C0.478396 6.02585 0.0935841 5.71946 0.0111866 5.28834C-0.0647192 4.82027 0.253177 4.3793 0.721245 4.30337Z" />
                        </svg>
                    </div>
                </button>
            </div>
        </div>
        <div class="rain-filters">
            <AdminFilterSearch />

            <div class="filter-actions">
                <div class="actions-input">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <input v-model="adminAmount" type="text" placeholder="Enter rain amount here..." v-bind:disabled="adminChange === false" />
                </div>
                <button v-on:click="adminChange === true ? adminUpdateButton() : adminSetChange(!adminChange)" class="button-update" v-bind:class="[
                    { 'button-save': adminChange === true }
                ]" v-bind:disabled="socketSendLoading !== null">
                    <transition name="fade" mode="out-in">
                        <ButtonLoading v-if="socketSendLoading === 'AdminRainAmount'" key="loading" />
                        <div v-else class="button-content" key="content">{{ adminChange === true ? 'SAVE' : 'UPDATE' }} RAIN AMOUNT</div>
                    </transition>
                </button>
            </div>
            <div class="filter-stats">
                <div class="stats-pot">
                    <div class="pot-title">RAIN POT</div>
                    <div class="pot-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="amount-value">
                            <span>{{adminFormatValue(generalRain.site.amount).split('.')[0]}}</span>.{{adminFormatValue(generalRain.site.amount).split('.')[1]}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import LoadingAnimation from '@/components/LoadingAnimation';
    import ButtonLoading from '@/components/ButtonLoading';
    import AdminRainElement from '@/components/admin/AdminRainElement';
    import AdminFilterSearch from '@/components/admin/AdminFilterSearch';

    export default {
        name: 'AdminRain',
        components: {
            LoadingAnimation,
            ButtonLoading,
            AdminRainElement,
            AdminFilterSearch
        },
        data() {
            return {
                adminChange: false,
                adminAmount: null
            }
        },
        methods: {
            ...mapActions(['adminGetRainListSocket', 'adminSetRainListPage', 'adminSetFilterSearch', 'adminSendRainAmountSocket']),
            adminFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            adminSetPage(page) {
                if(this.adminRainList.page === page) { return; }
                if(page < 1 || page > Math.ceil(this.adminRainList.count / 12)) { return; }

                this.adminSetRainListPage(page);

                const data = { page: this.adminRainList.page, search: this.adminFilterSearch };
                this.adminGetRainListSocket(data);
            },
            adminSetChange(value) {
                this.adminChange = value;
            },
            adminUpdateButton() {
                const amount = Math.floor(this.adminAmount * 1000);

                if(amount === null || isNaN(amount) === true || amount < 0) {
                    this.notificationShow({type: 'error', message: 'Your entered amount is invalid.'});
                    return;
                }

                const data = { amount: amount };
                this.adminSendRainAmountSocket(data);

                this.adminChange = false;
            }
        },
        computed: {
            ...mapGetters(['socketSendLoading', 'adminRainList', 'adminFilterSearch', 'generalRain'])
        },
        watch: {
            'generalRain.site': {
                deep: true,
                handler(data, dataOld) {
                    if(this.adminChange === false) { 
                        this.adminAmount = parseFloat(Math.floor(this.generalRain.site.amount / 10) / 100).toFixed(2); 
                    }
                }
            }
        },
        created() {
            this.adminAmount = parseFloat(Math.floor(this.generalRain.site.amount / 10) / 100).toFixed(2);

            if(this.adminRainList.loading === false) {
                const data = { page: this.adminRainList.page, search: this.adminFilterSearch };
                this.adminGetRainListSocket(data);
            }
        },
        beforeRouteLeave(to, from, next) {
            this.adminSetFilterSearch('');
            next();
        }
    }
</script>

<style scoped>
    .admin-rain {
        width: 100%;
        display: flex;
    }

    .admin-rain .rain-list {
        width: calc(100% - 350px);
        padding-top: 15px;
        padding-right: 30px;
    }

    .admin-rain .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        font-size: 14px;
        font-weight: 700;
        color: #8bacc8;
    }

    .admin-rain .header-type,
    .admin-rain .header-state {
        width: 25%;
    }

    .admin-rain .header-amount {
        width: 30%;
    }

    .admin-rain .header-option {
        width: 20%;
        display: flex;
        justify-content: flex-end;
    }

    .admin-rain .list-content {
        width: 100%;
        margin-top: 20px;
        padding: 20px 0;
        border-top: 1px solid rgba(24, 72, 109, 0.5);
        border-bottom: 1px solid rgba(24, 72, 109, 0.5);
    }

    .admin-rain .content-loading {
        width: 100%;
        height: 330px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .admin-rain .content-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .admin-rain .content-loading.fade-leave-to {
        opacity: 0;
    }

    .admin-rain .content-list {
        width: 100%;
    }

    .admin-rain .content-empty {
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

    .admin-rain .content-list.fade-enter-active,
    .admin-rain .content-empty.fade-enter-active {
        transition: opacity 0.5s;
    }

    .admin-rain .content-list.fade-enter-from,
    .admin-rain .content-empty.fade-enter-from {
        opacity: 0;
    }

    .admin-rain .list-pagination {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 25px;
    }

    .admin-rain .list-pagination button {
        width: 52px;
        height: 37px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .admin-rain .list-pagination button:disabled {
        cursor: not-allowed;
    }

    .admin-rain .list-pagination button:before {
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

    .admin-rain .list-pagination button:disabled:before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #05253e 100%);
    }

    .admin-rain .list-pagination button:after {
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

    .admin-rain .list-pagination button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(3, 20, 34, 0.27);
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .admin-rain .list-pagination button:disabled .button-inner {
        background: rgba(3, 20, 34, 0.27);
        box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.35);
    }

    .admin-rain .list-pagination button .button-inner svg {
        fill: #00ffc2;
    }

    .admin-rain .list-pagination button:disabled .button-inner svg {
        fill: #7a93ac;
    }

    .admin-rain .pagination-info {
        font-size: 12px;
        font-weight: 800;
        color: #5e768e;
    }

    .admin-rain .rain-filters {
        width: 350px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .admin-rain .filter-actions {
        width: 100%;
        margin-top: 20px;
    }

    .admin-rain .actions-input {
        width: 100%;
        position: relative;
    }

    .admin-rain .actions-input img {
        width: 19px;
        height: 19px;
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translate(0, -50%);
    }

    .admin-rain .actions-input input {
        width: 100%;
        height: 47px;
        padding: 0 15px 0 43px;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background: rgba(19, 66, 88, 0.25);
        border: 1px dashed rgba(46, 93, 119, 0.5);
    }

    .admin-rain .filter-actions input::placeholder {
        color: #49687d;
    }

    .admin-rain .filter-actions button.button-update {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 12px;
        border-radius: 5px;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
    }

    .admin-rain .filter-actions button.button-update.button-save {
        background: #f55046;
    }

    .admin-rain .filter-actions button.button-update .button-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .admin-rain .filter-actions button.button-update .button-loading.fade-leave-to {
        opacity: 0;
    }

    .admin-rain .filter-actions button.button-update .button-content {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    .admin-rain .filter-actions button.button-update .button-content.fade-enter-active {
        transition: opacity 0.5s;
    }

    .admin-rain .filter-actions button.button-update .button-content.fade-enter-from {
        opacity: 0;
    }

    .admin-rain .filter-stats {
        width: 300px;
        margin-top: 25px;
        padding-top: 25px;
        border-top: 1px dashed #1a4060;
    }

    .admin-rain .stats-pot {
        width: 100%;
        height: 160px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        background: radial-gradient(60% 55% at 50% 100%, rgba(1, 246, 185, 0.2) 0%, rgba(1, 247, 185, 0) 100%);
        border: 1px dashed #073054;
    }

    .admin-rain .pot-title {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    .admin-rain .pot-amount {
        display: flex;
        align-items: center;
        margin-top: 12px;
    }

    .admin-rain .pot-amount img {
        width: 24px;
        height: 24px;
        margin-right: 12px;
    }

    .admin-rain .amount-value {
        font-size: 20px;
        font-weight: 600;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%), #a6cae8;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .admin-rain .amount-value span {
        font-size: 32px;
        font-weight: 800;
    }

    @media only screen and (max-width: 1250px) {

        .admin-rain {
            flex-direction: column-reverse;
        }

        .admin-rain .rain-list {
            width: 100%;
            padding-top: 0;
            padding-right: 0;
        }

        .admin-rain .list-header {
            display: none;
        }

        .admin-rain .rain-filters {
            width: 100%;
        }

        .admin-rain .filter-stats {
            width: 100%;
        }

    }
</style>
