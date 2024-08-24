<template>
    <div class="modal-link-roblox">
        <div class="roblox-title">
            <span class="gradient-green">LINK ROBLOX</span>
        </div>
        <div v-if="authStep === 'captcha'" class="roblox-captcha">
            <iframe
                v-bind:src="modalsData.captchaUrl"
                width="320"
                height="320"
            />
        </div>
        <div v-else-if="authStep === 'twostep'" class="roblox-twostep">
            <div class="twostep-title">FILL IN YOUR 2FA CODE</div>
            <div class="twostep-input">
                <input v-model="modalTwoStepCode" type="text" placeholder="ENTER 2FA CODE" />
            </div>
        </div>
        <div v-else-if="modalTab === 'credentials'" class="roblox-login">
            <div class="login-element">
                <div class="element-title">USERNAME</div>
                <div class="element-input">
                    <input v-model="modalUsername" type="text" placeholder="ENTER USERNAME" />
                </div>
            </div>
            <div class="login-element">
                <div class="element-title">PASSWORD</div>
                <div class="element-input">
                    <input v-model="modalPassword" type="password" placeholder="ENTER PASSWORD" />
                </div>
            </div>
        </div>
        <div v-else class="roblox-cookie">
            <div class="cookie-title">FILL IN YOUR .ROBLOSECURITY COOKIE</div>
            <div class="cookie-input">
                <input v-model="modalCookie" type="text" placeholder="ENTER .ROBLOSECURITY COOKIE" />
            </div>
        </div>
        <div class="roblox-buttons">
            <button v-on:click="modalSetTab(modalTab === 'credentials' ? 'cookie' : 'credentials')" class="button-toggle" v-bind:class="{ 
                'button-active': modalTab === 'cookie' 
            }" v-bind:disabled="authSendLoginLoading === true || authStep !== 'login'">
                <div class="button-inner">.ROBLOSECURITY</div>
            </button>
            <button v-on:click="modalActionButton()" class="button-action" v-bind:disabled="authSendLoginLoading === true || authStep === 'captcha'">
                <div class="button-inner">
                    <transition name="fade" mode="out-in">
                        <ButtonLoading v-if="authSendLoginLoading === true" />
                        <div v-else class="inner-content">LINK ROBLOX</div>
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
        name: 'ModalLinkRoblox',
        components: {
            ButtonLoading
        },
        data() {
            return {
                modalTab: 'credentials',
                modalUsername: null,
                modalPassword: null,
                modalTwoStepCode: null,
                modalCookie: null
            }
        },
        methods: {
            ...mapActions([
                'modalsSetShow', 
                'authSendRoblox', 
                'authSendRobloxTwoStep', 
                'authSendRobloxCookie'
            ]),
            modalSetTab(tab) {
                this.modalTab = tab;
            },
            modalActionButton() {
                if(this.modalTab === 'cookie') {
                    if(this.modalCookie === null || this.modalCookie.trim() === '') {
                        return;
                    }

                    const data = { cookie: this.modalCookie.trim() };
                    this.authSendRobloxCookie(data);
                } else if(this.authStep === 'login') {
                    if(this.modalUsername === null || this.modalUsername.trim() === '') {
                        return;
                    }

                    if(this.modalPassword === null || this.modalPassword.trim() === '') {
                        return;
                    }

                    const data = { step: 'login', username: this.modalUsername, password: this.modalPassword };
                    this.authSendRoblox(data);
                } else if(this.authStep === 'twostep') {
                    if(this.modalTwoStepCode === null || this.modalTwoStepCode.trim() === '') {
                        return;
                    }

                    const data = { ...this.modalsData, code: this.modalTwoStepCode.trim() };
                    this.authSendRobloxTwoStep(data);
                }       
            }
        },
        computed: {
            ...mapGetters([
                'modalsShow', 
                'modalsData', 
                'authSendLoginLoading', 
                'authStep'
            ])
        },
        mounted() {
            window.addEventListener('message', (event) => {
                event = typeof(event.data) === 'object' ? event.data : JSON.parse(event.data);

                if(event.eventId === 'challenge-completed') {
                    const data = { step: 'captcha', username: this.loginUsername, password: this.loginPassword, challengeId: this.modalsData.challengeId, captchaId: this.modalsData.captchaId, captchaToken: event.payload.sessionToken, secureAuthenticationIntent: this.modalsData.secureAuthenticationIntent };
                    this.authSendRoblox(data);
                }
            });
        }
    }
</script>

<style scoped>
    .modal-link-roblox {
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

    .modal-link-roblox .roblox-title {
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-link-roblox .roblox-login {
        width: 100%;
        margin-top: 35px;
    }

    .modal-link-roblox .roblox-twostep,
    .modal-link-roblox .roblox-cookie,
    .modal-link-roblox .login-element {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 35px;
    }

    .modal-link-roblox .login-element:first-child {
        margin-top: 0;
    }

    .modal-link-roblox .twostep-title,
    .modal-link-roblox .cookie-title,
    .modal-link-roblox .element-title {
        font-size: 14px;
        font-weight: 800;
        color: #bbbfd0;
    }

    .modal-link-roblox .twostep-input,
    .modal-link-roblox .cookie-input,
    .modal-link-roblox .element-input {
        width: 100%;
        height: 78px;
        position: relative;
        margin-top: 20px;
        padding: 1px;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .modal-link-roblox .twostep-input:before,
    .modal-link-roblox .cookie-input:before,
    .modal-link-roblox .element-input:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 25%, 100% 75%, calc(100% - 16px) 100%, 16px 100%, 0 75%, 0 25%);
    }

    .modal-link-roblox .twostep-input input,
    .modal-link-roblox .cookie-input input,
    .modal-link-roblox .element-input input {
        width: 100%;
        height: 100%;
        padding: 0 115px 0 25px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: #072435;
        clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 25%, 100% 75%, calc(100% - 16px) 100%, 16px 100%, 0 75%, 0 25%);
    }

    .modal-link-roblox .twostep-input input::placeholder,
    .modal-link-roblox .cookie-input input::placeholder,
    .modal-link-roblox .element-input input::placeholder {
        color: #5e768e;
    }

    .modal-link-roblox .roblox-buttons {
        display: flex;
        align-items: center;
        margin-top: 35px;
    }

    .modal-link-roblox button.button-toggle {
        width: 200px;
        height: 54px;
        position: relative;
        margin-right: 20px;
        padding: 1px;
        filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
        transition: filter 0.3s ease;
        z-index: 1;
    }

    .modal-link-roblox button.button-toggle.button-active {
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15)) 
                drop-shadow(0px 2px 25px rgba(15, 41, 63, 0.35));
    }

    .modal-link-roblox button.button-action {
        width: 180px;
        height: 54px;
        position: relative;
        filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35)) drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15));
    }

    .modal-link-roblox button.button-toggle::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #1a4f63;
        clip-path: polygon(11px 0, calc(100% - 11px) 0, 100% 25%, 100% 75%, calc(100% - 11px) 100%, 11px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .modal-link-roblox button.button-toggle.button-active::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e0a3 100%);
    }

    .modal-link-roblox button.button-toggle::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-color: #07243a;
        clip-path: polygon(11px 0, calc(100% - 11px) 0, 100% 25%, 100% 75%, calc(100% - 11px) 100%, 11px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .modal-link-roblox button.button-toggle .button-inner,
    .modal-link-roblox button.button-action .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 800;
        clip-path: polygon(11px 0, calc(100% - 11px) 0, 100% 25%, 100% 75%, calc(100% - 11px) 100%, 11px 100%, 0 75%, 0 25%);
    }

    .modal-link-roblox button.button-toggle .button-inner {
        color: #bbbfd0;
        background-color: #1a4f63;
    }

    .modal-link-roblox button.button-toggle.button-active .button-inner {
        color: #00ffc2;
        background: radial-gradient(60% 60% at 50% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(255deg, rgba(0, 255, 194, 0.05) 0%, rgba(0, 170, 109, 0.05) 100%);
    }

    .modal-link-roblox button.button-action .button-inner {
        color: #ffffff;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%);
    }

    @media only screen and (max-width: 793px) {

        .modal-link-roblox {
            width: calc(100vw - 20px);
            padding: 35px 10px 48px 10px;
        }

    }

    @media only screen and (max-width: 500px) {

        .modal-link-roblox {
            padding: 55px 10px 48px 10px;
        }

    }
</style>