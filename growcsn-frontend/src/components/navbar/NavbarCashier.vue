<template>
    <div class="navbar-cashier">
        <button v-on:click="modalsSetShow('Cashier')" class="button-cashier">
            <div class="button-inner">
                <IconCashier />
                <span>CASHIER</span>
            </div>
        </button>
        <div class="cashier-balance">
            <button v-on:click="modalsSetShow('Claim')" class="button-free">
                <div class="button-inner">FREE DLS</div>
            </button>
            <div class="balance-inner">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <AmountNumber v-bind:amount="authUser.user.balance" />
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AmountNumber from '@/components/AmountNumber';
    import IconCashier from '@/components/icons/IconCashier';

    export default {
        name: 'NavbarCashier',
        components: {
            AmountNumber,
            IconCashier
        },
        methods: {
            ...mapActions([
                'modalsSetShow'
            ])
        },
        computed: {
            ...mapGetters([
                'authUser'
            ]),
            navbarGetBalance() {
               return parseFloat(Math.floor(this.authUser.user.balance / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
           }
        }
    }
</script>

<style scoped>
    .navbar-cashier {
        display: flex;
        align-items: center;
    }

    .navbar-cashier button.button-cashier {
        height: 50px;
        position: relative;
        margin-right: 15px;
        padding: 1px;
        filter: drop-shadow(0px 4px 25px rgba(255, 153, 0, 0.38));
        transition: all .2s;
    }

    .button-cashier:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .button-cashier:active {
        transition-duration: .2s;
        scale: .9;
    }
    .navbar-cashier button.button-cashier::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(255, 230, 0, 0) 0%, #ffe600 100%);
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .navbar-cashier button.button-cashier .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 25px 0 14px;
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #fca311 0%, #ffb703 100%);
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .navbar-cashier button.button-cashier .button-inner svg {
        margin-right: 22px;
        fill: #ffffff;
    }

    .navbar-cashier .cashier-balance {
        width: 190px;
        height: 50px;
        position: relative;
        padding: 1px;
        filter: drop-shadow(0px 4px 25px #0f293f);
    }

    .navbar-cashier .cashier-balance::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
        z-index: 0;
    }

    .navbar-cashier .cashier-balance button.button-free {
        height: 21px;
        position: absolute;
        top: -11px;
        right: 0;
        filter: drop-shadow(0px 0px 15px rgba(13, 235, 176, 0.35));
        z-index: 1;
    }

    .navbar-cashier .cashier-balance button.button-free .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 7px;
        font-size: 10px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .navbar-cashier .balance-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px;
        background-color: #021726;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
        z-index: 1;
    }

    .navbar-cashier .balance-inner img {
        width: 24px;
        height: 24px;
    }

    .navbar-cashier .inner-value {
        font-size: 12px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .navbar-cashier .inner-value span {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 1175px) {

        .navbar-cashier button.button-cashier {
            height: 38px;
        }

        .navbar-cashier button.button-cashier .button-inner {
            padding: 0 13px;
        }

        .navbar-cashier button.button-cashier .button-inner svg {
            width: 14px;
        }


        .navbar-cashier button.button-cashier .button-inner svg {
            margin-right: 0;
        }

        .navbar-cashier button.button-cashier .button-inner span {
            display: none;
        }


        .navbar-cashier .cashier-balance {
            width: auto;
            height: 38px;
        }

        .navbar-cashier .cashier-balance button.button-free {
            height: 16px;
            top: -8px;
        }

        .navbar-cashier .cashier-balance button.button-free .button-inner {
            padding: 0 6px;
            font-size: 8px;
        }

        .navbar-cashier .balance-inner {
            padding: 0 12px 0 5px;
        }

        .navbar-cashier .balance-inner img {
            width: 18px;
            height: 18px;
            margin-right: 10px;
        }

    }
</style>
