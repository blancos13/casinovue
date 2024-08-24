<template>
    <div class="modal-two-step">
        <div class="step-title">
            <span class="gradient-green">2FA INPUT</span>
        </div>
        <div class="step-info">For security reasons we require our users to have two factor authentication enabled when trading</div>
        <div class="step-input">
            <div class="input-title">To proceed please input the 2FA code below</div>
            <div class="input-container">
                <input v-model="modalCode" type="text" />
            </div>
        </div>
        <div class="step-buttons">
            <button v-on:click="modalVerifyButton()" class="button-verify" v-bind:disabled="socketSendLoading !== null">
                <div class="button-inner">
                    <transition name="fade" mode="out-in">
                        <ButtonLoading v-if="socketSendLoading === 'LimitedVerify'" key="loading" />
                        <div v-else class="inner-content" key="content">VERIFY 2FA</div>
                    </transition>
                </div>
            </button>
        </div>
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
        data() {
            return {
                modalCode: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'cashierSendLimitedEnableSocket'
            ]),
            modalVerifyButton() {
                if(this.modalCode === null || this.modalCode.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered 2fa code is invalid.' });
                    return;
                }

                const data = { challengeId: this.modalsData.challengeId, twoStepId: this.modalsData.twoStepId, twoStepCode: this.modalCode.trim() };
                this.cashierSendLimitedEnableSocket(data);
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
    .modal-two-step {
        width: 773px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 44px 48px 44px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% -31.45%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, #07263d 0%, #07243a 100%);
    }

    .modal-two-step .step-title {
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-two-step .step-info {
        width: 100%;
        margin-top: 30px;
        padding: 0 40px;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        color: #db7d48;
    }

    .modal-two-step .step-input {
        width: 100%;
        position: relative;
        margin-top: 30px;
        padding: 25px 0;
        border-top: 1px dashed rgba(51, 83, 97, 0.5);
        border-bottom: 1px dashed rgba(51, 83, 97, 0.5);
    }

    .modal-two-step .input-title {
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        color: #467187;
    }

    .modal-two-step .input-container {
        width: 100%;
        height: 72px;
        position: relative;
        margin-top: 25px;
        padding: 1px;
    }

    .modal-two-step .input-container::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 25%, 100% 75%, calc(100% - 14px) 100%, 14px 100%, 0 75%, 0 25%);
    }

    .modal-two-step .input-container input {
        width: 100%;
        height: 100%;
        padding: 0 45px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: #072435;
        clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 25%, 100% 75%, calc(100% - 14px) 100%, 14px 100%, 0 75%, 0 25%);
    }

    .modal-two-step .step-buttons {
        margin-top: 35px;
    }

    .modal-two-step .step-buttons button.button-verify {
        width: 200px;
        height: 48px;
        filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35)), drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15));
    }

    .modal-two-step .step-buttons button.button-verify .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .modal-two-step .step-buttons button.button-verify .button-loading.fade-enter-active {
        transition: opacity 0.5s;
    }

    .modal-two-step .step-buttons button.button-verify .button-loading.fade-enter-from {
        opacity: 0;
    }

    .modal-two-step .step-buttons button.button-verify .inner-content {
        display: flex;
        align-items: center;
        text-transform: uppercase;
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 793px) {

        .modal-two-step {
            width: calc(100vw - 20px);
        }

    }
</style>