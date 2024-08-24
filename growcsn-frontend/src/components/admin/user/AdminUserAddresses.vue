<template>
    <div class="admin-user-addresses">
        <div class="addresses-head">
            <div class="head-date">DATE</div>
            <div class="head-address">ADDRESS</div>
        </div>
        <div class="addresses-content">
            <div class="content-list">

                <AdminUserAddressesElement v-for="address in modalsData.user.ips.slice((this.adminPage - 1) * 12, this.adminPage * 12)" v-bind:key="address._id" v-bind:address="address" />

            </div>
        </div>
        <div class="addresses-pagination">
            <button v-on:click="adminSetPage(adminPage - 1)" class="button-prev" v-bind:disabled="adminPage <= 1">
                <div class="button-inner">
                    <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.2788 4.30337C11.2297 4.2954 11.18 4.29173 11.1302 4.29237H2.66447L2.84907 4.20651C3.02951 4.12111 3.19366 4.00487 3.33417 3.86307L5.70819 1.48906C6.02085 1.19059 6.07339 0.710444 5.83269 0.351417C5.55254 -0.0311676 5.0153 -0.114237 4.63269 0.165907C4.60178 0.188552 4.5724 0.213237 4.54479 0.2398L0.251817 4.53278C-0.0836794 4.8679 -0.0839745 5.41152 0.251146 5.74702C0.251361 5.74723 0.251602 5.74747 0.251817 5.74769L4.54479 10.0407C4.88056 10.3755 5.42418 10.3747 5.75903 10.039C5.78538 10.0125 5.80999 9.98443 5.83269 9.95481C6.07339 9.59578 6.02085 9.11564 5.70819 8.81717L3.33847 6.43886C3.21249 6.31275 3.06766 6.20701 2.90917 6.12547L2.65159 6.00956H11.083C11.5216 6.02585 11.9064 5.71946 11.9888 5.28834C12.0647 4.82027 11.7468 4.3793 11.2788 4.30337Z" />
                    </svg>
                </div>
            </button>
            <div class="pagination-info">
                PAGE <span class="text-green-gradient">{{adminPage}}</span> / {{Math.ceil(modalsData.user.ips.length / 14) <= 0 ? '1' : Math.ceil(modalsData.user.ips.length / 14)}}
            </div>
            <button v-on:click="adminSetPage(adminPage + 1)" class="button-next" v-bind:disabled="adminPage >= Math.ceil(modalsData.user.ips.length / 14)">
                <div class="button-inner">
                    <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.721245 4.30337C0.770346 4.2954 0.820037 4.29173 0.869755 4.29237H9.33553L9.15093 4.20651C8.97049 4.12111 8.80634 4.00487 8.66583 3.86307L6.29181 1.48906C5.97915 1.19059 5.92661 0.710444 6.16731 0.351417C6.44746 -0.0311676 6.9847 -0.114237 7.36731 0.165907C7.39822 0.188552 7.4276 0.213237 7.45521 0.2398L11.7482 4.53278C12.0837 4.8679 12.084 5.41152 11.7489 5.74702C11.7486 5.74723 11.7484 5.74747 11.7482 5.74769L7.45521 10.0407C7.11944 10.3755 6.57582 10.3747 6.24097 10.039C6.21462 10.0125 6.19001 9.98443 6.16731 9.95481C5.92661 9.59578 5.97915 9.11564 6.29181 8.81717L8.66153 6.43886C8.78751 6.31275 8.93234 6.20701 9.09083 6.12547L9.34841 6.00956H0.917005C0.478396 6.02585 0.0935841 5.71946 0.0111866 5.28834C-0.0647192 4.82027 0.253177 4.3793 0.721245 4.30337Z" />
                    </svg>
                </div>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import AdminUserAddressesElement from '@/components/admin/user/AdminUserAddressesElement';

    export default {
        name: 'AdminUserAddresses',
        components: {
            AdminUserAddressesElement
        },
        data() {
            return {
                adminPage: 1
            }
        },
        methods: {
            adminSetPage(page) {
                this.adminPage = page;
            }
        },
        computed: {
            ...mapGetters([
                'modalsShow', 
                'modalsData'
            ])
        },
        created() {
            console.log(this.modalsData.user.ips.slice((this.adminPage - 1) * 12, this.adminPage * 12));
        }
    }
</script>

<style scoped>
    .admin-user-addresses {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .admin-user-addresses .addresses-head {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 30px 20px 20px;
        border-bottom: 1px solid rgba(24, 72, 109, 0.5);
    }

    .admin-user-addresses .head-date,
    .admin-user-addresses .head-address {
        width: 50%;
        font-size: 14px;
        font-weight: 700;
        color: #8bacc8;
    }

    .admin-user-addresses .head-address {
        text-align: right;
    }

    .admin-user-addresses .addresses-content {
        width: 100%;
        padding: 20px 0;
        border-bottom: 1px solid rgba(24, 72, 109, 0.5);
    }

    .admin-user-games .content-list {
        width: 100%;
        height: 330px;
        padding-right: 10px;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .admin-user-addresses .addresses-pagination {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 25px;
    }

    .admin-user-addresses .addresses-pagination button {
        width: 52px;
        height: 37px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .admin-user-addresses .addresses-pagination button:disabled {
        cursor: not-allowed;
    }

    .admin-user-addresses .addresses-pagination button:before {
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

    .admin-user-addresses .addresses-pagination button:disabled:before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #05253e 100%);
    }

    .admin-user-addresses .addresses-pagination button:after {
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

    .admin-user-addresses .addresses-pagination button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(255deg, rgba(0, 255, 194, 0.1) 0%, rgba(0, 170, 109, 0.1) 100%), rgba(0, 0, 0, 0.1);
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .admin-user-addresses .addresses-pagination button:disabled .button-inner {
        background: rgba(3, 20, 34, 0.27);
        box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.35);
    }

    .admin-user-addresses .addresses-pagination button .button-inner svg {
        fill: #00ffc2;
    }

    .admin-user-addresses .addresses-pagination button:disabled .button-inner svg {
        fill: #7a93ac;
    }

    .admin-user-addresses .pagination-info {
        font-size: 12px;
        font-weight: 800;
        color: #5e768e;
    }

    @media only screen and (max-width: 725px) {

        .admin-user-addresses .addresses-head {
            padding: 0;
        }

        .admin-user-addresses .head-date,
        .admin-user-addresses .head-address {
            display: none;
        }

    }
</style>