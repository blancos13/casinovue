<template>
    <div class="modal-reset">
        <div class="reset-title">
            <span class="gradient-green">RESET PASSWORD</span>
        </div>
        <div class="reset-element">
            <div class="element-title">NEW PASSWORD</div>
            <div class="element-content">
                <input v-model="modalPassword" type="password" placeholder="ENTER PASSWORD..." />
            </div>
        </div>
        <div class="reset-element">
            <div class="element-title">REPEAT PASSWORD</div>
            <div class="element-content">
                <input v-model="modalPasswordConfirm" type="password" placeholder="ENTER PASSWORD..." />
            </div>
        </div>
        <button v-on:click="modalResetButton()" class="button-reset">
            <div class="button-inner">SET NEW PASSWORD</div>
        </button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'ModalReset',
        data() {
            return {
                modalPassword: null,
                modalPasswordConfirm: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'modalsSetShow',
                'modalsSetData'
            ]),
            modalResetButton() {
                if(this.modalPassword === null || this.modalPassword.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered password is invalid.' });
                    return;
                }

                if(this.modalPassword !== this.modalPasswordConfirm) {
                    this.notificationShow({ type: 'error', message: 'Your entered passwords does not match.' });
                    return;
                }

                this.modalsSetData({ typeCaptcha: 'credentialsReset', data: { ...this.modalsData, password: this.modalPassword } });
                this.modalsSetShow(null);

                setTimeout(() => { this.modalsSetShow('Captcha'); }, 200);
            }
        },
        computed: {
            ...mapGetters([ 
                'modalsData'
            ])

        }
    }
</script>

<style scoped>
    .modal-reset {
        width: 773px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 80px 48px 80px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% 0%, rgba(0, 255, 194, 0.2) 0%, rgba(7, 38, 61, 0) 80%), 
                    linear-gradient(256deg, #07263d 0%, #07243a 100%);
    }

    .modal-reset .reset-title {
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-reset .reset-element {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 35px;
    }

    .modal-reset .element-title {
        font-size: 14px;
        font-weight: 800;
        color: #bbbfd0;
    }

    .modal-reset .element-content {
        width: 100%;
        height: 72px;
        position: relative;
        margin-top: 20px;
        padding: 1px;
    }

    .modal-reset .element-content::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 25%, 100% 75%, calc(100% - 14px) 100%, 14px 100%, 0 75%, 0 25%);
    }

    .modal-reset .element-content input {
        width: 100%;
        height: 100%;
        padding: 0 15px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: #072435;
        clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 25%, 100% 75%, calc(100% - 14px) 100%, 14px 100%, 0 75%, 0 25%);
    }

    .modal-reset .element-content input::placeholder {
        color: #5e768e;
    }

    .modal-reset button.button-reset {
        width: 300px;
        height: 54px;
        margin-top: 35px;
    }

    .modal-reset button.button-reset .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(11px 0, calc(100% - 11px) 0, 100% 25%, 100% 75%, calc(100% - 11px) 100%, 11px 100%, 0 75%, 0 25%);
    }

    @media only screen and (max-width: 793px) {

        .modal-reset {
            width: calc(100vw - 20px);
            padding: 35px 10px 48px 10px;
        }

    }

    @media only screen and (max-width: 500px) {

        .modal-reset {
            padding: 55px 10px 48px 10px;
        }

        .modal-reset button.button-reset {
            width: 100%;
        }

    }
</style>