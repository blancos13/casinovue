<template>
    <div class="modal-admin-confirm">
        <div class="confirm-title">
            <span class="gradient-green">ADMIN CONFIRM</span>
        </div>
        <div class="confirm-info">{{ modalsData.messageConfirm }}</div>
        <button v-on:click="modalConfirmButton()" class="button-confirm" v-bind:disabled="socketSendLoading !== null">
            <div class="button-inner">CONFIRM ACTION</div>
        </button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'ModalAdminConfirm',
        methods: {
            ...mapActions([
                'modalsSetShow', 
                'adminSendCashierRobuxCancelSocket',
                'adminSendCashierCryptoActionSocket'
            ]),
            modalConfirmButton() {
                const data = { ...this.modalsData.data };

                if(this.modalsData.typeConfirm === 'robuxCancel') {
                    this.adminSendCashierRobuxCancelSocket(data);
                } else if(this.modalsData.typeConfirm === 'cryptoAction') {
                    this.adminSendCashierCryptoActionSocket(data);
                }

                this.modalsSetShow(null);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'modalsData'
            ])
        }
    }
</script>

<style scoped>
    .modal-admin-confirm {
        width: 720px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 30px 30px 30px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% 0%, rgba(0, 255, 194, 0.25) 0%, rgba(7, 38, 61, 0) 80%), 
                    linear-gradient(256deg, #07263d 0%, #07243a 100%);
    }

    .modal-admin-confirm .confirm-title {
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-admin-confirm .confirm-info {
        width: 100%;
        margin-top: 12px;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .modal-admin-confirm button.button-confirm {
        width: 200px;
        height: 48px;
        margin-top: 20px;
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
    }

    .modal-admin-confirm button.button-confirm .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 75%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    @media only screen and (max-width: 740px) {

        .modal-admin-confirm {
            width: calc(100vw - 20px);
            padding: 35px 10px 30px 10px;
        }

    }

    @media only screen and (max-width: 500px) {

        .modal-admin-confirm {
            padding: 65px 10px 30px 10px;
        }

    }
</style>
