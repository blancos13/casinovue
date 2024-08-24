<template>
    <div class="modal-admin-user">
        <div class="user-title">
            <span class="gradient-green">ADMIN USER</span>
        </div>
        <div class="user-nav">
            <button v-on:click="modalSetTab('Profile')" class="button-nav" v-bind:class="{ 'button-active': modalTab === 'Profile' }">
                <div class="button-inner">
                    <span>PROFILE</span>
                </div>
            </button>
            <button v-on:click="modalSetTab('Transactions')" class="button-nav" v-bind:class="{ 'button-active': modalTab === 'Transactions' }">
                <div class="button-inner">
                    <span>TRANSACTIONS</span>
                </div>
            </button>
            <button v-on:click="modalSetTab('Games')" class="button-nav" v-bind:class="{ 'button-active': modalTab === 'Games' }">
                <div class="button-inner">
                    <span>GAMES</span>
                </div>
            </button>
            <button v-on:click="modalSetTab('Addresses')" class="button-nav" v-bind:class="{ 'button-active': modalTab === 'Addresses' }">
                <div class="button-inner">
                    <span>ADDRESSES</span>
                </div>
            </button>
            <button v-on:click="modalSetTab('Settings')" class="button-nav" v-bind:class="{ 'button-active': modalTab === 'Settings' }">
                <div class="button-inner">
                    <span>SETTINGS</span>
                </div>
            </button>
        </div>
        <div class="user-content">

            <component v-bind:is="'AdminUser' + modalTab" />

        </div>
    </div>
</template>

<script>
    import AdminUserProfile from '@/components/admin/user/AdminUserProfile';
    import AdminUserTransactions from '@/components/admin/user/AdminUserTransactions';
    import AdminUserGames from '@/components/admin/user/AdminUserGames';
    import AdminUserAddresses from '@/components/admin/user/AdminUserAddresses';
    import AdminUserSettings from '@/components/admin/user/AdminUserSettings';

    export default {
        name: 'ModalAdminUser',
        components: {
            AdminUserProfile,
            AdminUserTransactions,
            AdminUserGames,
            AdminUserAddresses,
            AdminUserSettings
        },
        data() {
            return {
                modalTab: 'Profile'
            }
        },
        methods: {
            modalSetTab(tab) {
                this.modalTab = tab;
            }
        }
    }
</script>

<style scoped>
    .modal-admin-user {
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

    .modal-admin-user .user-title {
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-admin-user .user-nav {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 35px;
    }

    .modal-admin-user .user-nav button.button-nav {
        width: calc(20% - 16px);
        height: 54px;
        position: relative;
        margin-right: 20px;
        transition: all 0.3s ease;
    }

    .modal-admin-user .user-nav button.button-nav::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #1a4f63;
        clip-path: polygon(11px 0, calc(100% - 11px) 0, 100% 25%, 100% 75%, calc(100% - 11px) 100%, 11px 100%, 0 75%, 0 25%);
        z-index: 0;
    }

    .modal-admin-user .user-nav button.button-nav.button-active::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-color: #063543;
        clip-path: polygon(11px 0, calc(100% - 11px) 0, 100% 25%, 100% 75%, calc(100% - 11px) 100%, 11px 100%, 0 75%, 0 25%);
        z-index: 0;
    }

    .modal-admin-user .user-nav button.button-nav.button-active::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e0a3 100%);
    }

    .modal-admin-user .user-nav button.button-nav:last-of-type {
        margin-right: 0;
    }

    .modal-admin-user .user-nav button.button-nav .button-inner {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 1px;
        left: 1px;
        background-color: #1a4f63;
        clip-path: polygon(11px 0, calc(100% - 11px) 0, 100% 25%, 100% 75%, calc(100% - 11px) 100%, 11px 100%, 0 75%, 0 25%);
        z-index: 1;
    }

    .modal-admin-user .user-nav button.button-nav.button-active .button-inner {
        background: radial-gradient(81.75% 81.75% at 50% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(256.23deg, rgba(0, 255, 194, 0.05) 0%, rgba(0, 170, 109, 0.05) 100%);
    }

    .modal-admin-user .user-nav button.button-nav .button-inner span {
        font-size: 12px;
        font-weight: 700;
        color: #bbbfd0;
    }

    .modal-admin-user .user-nav button.button-nav.button-active .button-inner span {
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%), #a6cae8;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .modal-admin-user .user-content {
        width: 100%;
        margin-top: 35px;
    }

    @media only screen and (max-width: 790px) {

        .modal-admin-user {
            width: calc(100vw - 20px);
            padding: 35px 10px 30px 10px;
        }

    }

    @media only screen and (max-width: 600px) {

        .modal-admin-user .user-nav {
            flex-wrap: wrap;
        }

        .modal-admin-user .user-nav button.button-nav {
            width: calc(50% - 5px);
            margin-top: 10px;
            margin-right: 10px;
        }

        .modal-admin-user .user-nav button.button-nav:nth-child(1),
        .modal-admin-user .user-nav button.button-nav:nth-child(2) {
            margin-top: 0;
        }

        .modal-admin-user .user-nav button.button-nav:nth-child(2n) {
            margin-right: 0;
        }

    }
</style>
