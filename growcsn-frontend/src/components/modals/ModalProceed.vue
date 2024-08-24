<template>
    <div class="modal-proceed">
        <button v-on:click="modalBackButton()" class="button-back">
            <div class="button-inner">BACK</div>
        </button>
        <div class="proceed-title">
            <span class="gradient-green">{{modalsData.provider.toUpperCase()}}</span>
        </div>
        <div class="proceed-info">You will be directed to a third party provider that processes {{ modalsData.provider === 'skinify' ? 'steam item' : 'credit card' }} payments for growcsn. All the information you enter on their site is protected and encrypted.</div>
        <button v-on:click="modalProceedButton()" class="button-proceed" v-bind:disabled="socketSendLoading !== null">
            <div class="button-inner">
                <transition name="fade" mode="out-in">
                    <ButtonLoading v-if="socketSendLoading === 'SteamDeposit' || socketSendLoading === 'CreditDeposit'" key="loading" />
                    <div v-else class="inner-content" key="content">PROCEED</div>
                </transition>
            </div>
        </button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import ButtonLoading from '@/components/ButtonLoading';

    export default {
        name: 'ModalTip',
        components: {
            ButtonLoading
        },
        methods: {
            ...mapActions([
                'modalsSetShow', 
                'cashierSendSteamDepositSocket',
                'cashierSendCreditDepositSocket'
            ]),
            modalBackButton() {
                this.modalsSetShow(null);
                setTimeout(() => { this.modalsSetShow('Cashier'); }, 200);
            },
            modalProceedButton() {
                if(this.modalsData.provider === 'skinify') {
                    const data = { game: this.modalsData.game };
                    this.cashierSendSteamDepositSocket(data);
                } else {
                    const data = {};
                    this.cashierSendCreditDepositSocket(data);
                }
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',  
                'modalsData', 
                'generalUserInfo'
            ])
        }
    }
</script>

<style scoped>
    .modal-proceed {
        width: 600px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 30px 48px 30px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% -30%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(255deg, #07263d 0%, #07243a 100%);
    }

    .modal-proceed button.button-back {
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

    .modal-proceed button.button-back .button-inner {
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

    .modal-proceed button.button-back:hover .button-inner {
        color: #ffffff;
    }

    .modal-proceed .proceed-title {
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

     .modal-proceed .proceed-info {
        margin-top: 12px;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .modal-proceed button.button-proceed {
        width: 240px;
        height: 48px;
        margin-top: 35px;
        filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35)), 
                drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15));
    }

    .modal-proceed button.button-proceed .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .modal-proceed button.button-proceed .button-loading.fade-enter-active {
        transition: opacity 0.5s;
    }

    .modal-proceed button.button-proceed .button-loading.fade-enter-from {
        opacity: 0;
    }

    .modal-proceed button.button-proceed .inner-content {
        display: flex;
        align-items: center;
        text-transform: uppercase;
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 620px) {

        .modal-proceed {
            width: calc(100vw - 20px);
            padding: 35px 10px 48px 10px;
        }

    }
</style>