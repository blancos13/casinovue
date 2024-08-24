<template>
    <div class="modal-link">
        <div class="link-title">
            <span class="gradient-green">LINK EMAIL</span>
        </div>
        <div class="link-element">
            <div class="element-title">EMAIL</div>
            <div class="element-content">
                <input v-model="modalEmail" type="text" placeholder="ENTER EMAIL..." />
            </div>
        </div>
        <div class="link-element">
            <div class="element-title">PASSWORD</div>
            <div class="element-content">
                <input v-model="modalPassword" type="password" placeholder="ENTER PASSWORD..." />
            </div>
        </div>
        <div class="link-element">
            <div class="element-title">REPEAT PASSWORD</div>
            <div class="element-content">
                <input v-model="modalPasswordConfirm" type="password" placeholder="ENTER PASSWORD..." />
            </div>
        </div>
        <button v-on:click="modalLinkButton()" class="button-link" v-bind:disabled="authSendLoginLoading">
            <div class="button-inner">LINK EMAIL</div>
        </button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'ModalLink',
        data() {
            return {
                modalEmail: null,
                modalPassword: null,
                modalPasswordConfirm: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'modalsSetShow',
                'modalsSetData',
                'authSendCredentialsLink'
            ]),
            modalLinkButton() {
                if(this.modalEmail === null || this.modalEmail.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered email is invalid.' });
                    return;
                }

                if(this.modalPassword === null || this.modalPassword.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered password is invalid.' });
                    return;
                }

                if(this.modalPassword !== this.modalPasswordConfirm) {
                    this.notificationShow({ type: 'error', message: 'Your entered passwords does not match.' });
                    return;
                }

                const data = { email: this.modalEmail, password: this.modalPassword };
                this.authSendCredentialsLink(data);
            }
        },
        computed: {
            ...mapGetters([
                'authSendLoginLoading', 
                'modalsData'
            ])

        }
    }
</script>

<style scoped>
    .modal-link {
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

    .modal-link .link-title {
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-link .link-element {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 35px;
    }

    .modal-link .element-title {
        font-size: 14px;
        font-weight: 800;
        color: #bbbfd0;
    }

    .modal-link .element-content {
        width: 100%;
        height: 72px;
        position: relative;
        margin-top: 20px;
        padding: 1px;
    }

    .modal-link .element-content::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 25%, 100% 75%, calc(100% - 14px) 100%, 14px 100%, 0 75%, 0 25%);
    }

    .modal-link .element-content input {
        width: 100%;
        height: 100%;
        padding: 0 15px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: #072435;
        clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 25%, 100% 75%, calc(100% - 14px) 100%, 14px 100%, 0 75%, 0 25%);
    }

    .modal-link .element-content input::placeholder {
        color: #5e768e;
    }

    .modal-link button.button-link {
        width: 300px;
        height: 54px;
        margin-top: 35px;
    }

    .modal-link button.button-link .button-inner {
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

        .modal-link {
            width: calc(100vw - 20px);
            padding: 35px 10px 48px 10px;
        }

    }

    @media only screen and (max-width: 500px) {

        .modal-link {
            padding: 55px 10px 48px 10px;
        }

        .modal-link button.button-reset {
            width: 100%;
        }

    }
</style>