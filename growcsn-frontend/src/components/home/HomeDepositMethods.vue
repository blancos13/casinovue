<template>
   
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'HomeDepositMethods',
        methods: {
            ...mapActions(['notificationShow', 'modalsSetShow']),
            homeCashierButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                this.modalsSetShow('Cashier');
            }
        },
        computed: {
            ...mapGetters(['authUser'])
        }

    }
</script>

<style scoped>
    .home-deposit-methods {
        width: 1250px;
        position: relative;
        margin-top: 85px;
    }

    .home-deposit-methods::before {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(90deg, rgba(2, 25, 44, 0) 0%, #3a3882 calc(50% - 110px), rgba(2, 25, 44, 0) calc(50% - 108px), rgba(2, 25, 44, 0) calc(50% + 108px), #3a3882 calc(50% + 110px), rgba(2, 25, 44, 0) 100%);
        z-index: -1;
    }

    .home-deposit-methods::after {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        bottom: 0;
        left: 0;
        background: linear-gradient(90deg, rgba(3, 28, 49, 0) 0%, #483d96 50%, rgba(3, 28, 49, 0) 100%);
        z-index: 0;
    }

    .home-deposit-methods .methods-title {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        white-space: nowrap;
        font-size: 18px;
        font-weight: 800;
    }

    .home-deposit-methods .methods-content {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding: 30px 0;
        background: radial-gradient(50% 40% at 50% 90%, rgba(82, 68, 166, 0.45) 0%, rgba(26, 4, 54, 0) 100%);
    }

    .home-deposit-methods button.button-method {
        width: 12.5%;
        height: 105px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
    }

    .home-deposit-methods button.button-method.method-placeholder {
        color: #5c6f7f;
        text-shadow: -1px 1px 0 #223a4e, 1px 1px 0 #223a4e, 1px -1px 0 #223a4e, -1px -1px 0 #223a4e;
    }

    .home-deposit-methods button.button-method::before {
        content: '';
        width: 2px;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        background: linear-gradient(0deg, rgba(3, 28, 49, 0) 0%, #483d96 50%, rgba(3, 28, 49, 0) 100%);
    }

    .home-deposit-methods button.button-method:last-of-type::before {
        background: none;
    }

    .home-deposit-methods button.button-method img {
        height: 61px;
    }

    @media only screen and (max-width: 1600px) {

        .home-deposit-methods {
            width: 100%;
        }

    }

    @media only screen and (max-width: 950px) {

        .home-deposit-methods button.button-method {
            height: 80px;
            font-size: 11px;
        }

        .home-deposit-methods button.button-method img {
            height: 40px;
        }

    }

    @media only screen and (max-width: 750px) {

        .home-deposit-methods button.button-method {
            width: 25%;
        }

        .home-deposit-methods button.button-method:nth-child(1),
        .home-deposit-methods button.button-method:nth-child(2),
        .home-deposit-methods button.button-method:nth-child(3),
        .home-deposit-methods button.button-method:nth-child(4) {
            margin-bottom: 20px;
        }

        .home-deposit-methods button.button-method:nth-child(4)::before {
            display: none;
        }

    }
</style>
