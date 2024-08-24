<template>
    
    <div class="login-credentials">

        <div v-if="tab === 'register'" class="credentials-element">
            <div class="credentials-element">
                <div class="element-title">USERNAME</div>
                <div class="element-input">
                    <input v-model="loginUsername" type="text" placeholder="ENTER USERNAME" />
                </div>
            </div>
        </div>

        <div class="credentials-element">
            <div class="element-title">EMAIL</div>
            <div class="element-input">
                <input v-model="loginEmail" type="text" placeholder="ENTER EMAIL" />
            </div>
        </div>
        <div class="credentials-element">
            <div class="element-title">PASSWORD</div>
            <div class="element-input">
                <input v-model="loginPassword" type="password" placeholder="ENTER PASSWORD" />
                <button v-if="tab === 'login'" v-on:click="$parent.modalSetTab('forgot')" class="button-forgot">
                    <div class="button-inner">
                        <span>FORGOT PASSWORD</span>
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                            <!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                            <path d="M224 64c44.2 0 80 35.8 80 80v48H144V144c0-44.2 35.8-80 80-80zM80 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H368V144C368 64.5 303.5 0 224 0S80 64.5 80 144zM256 320v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V320c0-17.7 14.3-32 32-32s32 14.3 32 32z"/>
                        </svg>
                    </div>
                </button>
            </div>
        </div>


        <div v-if="tab === 'register'" class="credentials-element">
            
            <div class="element-title">PASSWORD CONFIRM</div>
            <div class="element-input">
                <input v-model="loginPasswordConfirm" type="password" placeholder="ENTER PASSWORD AGAIN" />
            </div>
        </div>
        <div class="credentials-info">
            By accessing growcsn.com, I attest that I am at least 18 years old and have read and agree with the <button v-on:click="loginTermsButton()" class="button-terms">Terms of Service</button>.
        </div>
        <div class="credentials-buttons">
            <button v-on:click="$parent.modalSetTab(tab === 'login' ? 'register' : 'login')" class="button-toggle" v-bind:class="{ 'button-active': tab === 'register' }">
                <div class="button-inner">REGISTER</div>
            </button>
            <button v-on:click="loginActionButton()" class="button-action" v-bind:disabled="authSendLoginLoading === true">
                <div class="button-inner">{{tab.toUpperCase()}}</div>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'LoginCredentials',
        props: ['tab'],
        data() {
            return {
                loginUsername: null,
                loginEmail: null,
                loginPassword: null,
                loginPasswordConfirm: null
            }
        },
        methods: {
            ...mapActions([
                'modalsSetShow',
                'modalsSetData',
                'notificationShow',
                'authSendCredentialsLogin',
                'authSendCredentialsRegister'
            ]),
            loginActionButton() {
                if(this.loginEmail === null || this.loginEmail.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered email is invalid.' });
                    return;
                }

                if(this.loginPassword === null || this.loginPassword.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered password is invalid.' });
                    return;
                }

                if(this.tab === 'register') {
                    if(this.loginPassword !== this.loginPasswordConfirm) {
                        this.notificationShow({ type: 'error', message: 'Your entered passwords does not match.' });
                        return;
                    }
                    this.modalsSetData({ typeCaptcha: 'credentialsRegister', data: { username: this.loginUsername, email: this.loginEmail, password: this.loginPassword } });
                } else {
                    this.modalsSetData({ typeCaptcha: 'credentialsLogin', data: { username: this.loginUsername, email: this.loginEmail, password: this.loginPassword } });
                }

                setTimeout(() => { this.modalsSetShow('Captcha'); }, 200);
            },
            loginTermsButton() {
                this.modalsSetShow(null);
                setTimeout(() => { this.modalsSetShow('Terms'); }, 300);
            }
        },
        computed: {
            ...mapGetters([ 
                'authSendLoginLoading'
            ])
        }
    }
</script>

<style scoped>
    .login-credentials {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .login-credentials .credentials-element {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 35px;
    }

    .login-credentials .credentials-element:first-child {
        margin-top: 0;
    }

    .login-credentials .element-title {
        font-size: 14px;
        font-weight: 800;
        color: #bbbfd0;
    }

    .login-credentials .element-input {
        width: 100%;
        height: 78px;
        position: relative;
        margin-top: 20px;
        padding: 1px;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .login-credentials .element-input::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 25%, 100% 75%, calc(100% - 16px) 100%, 16px 100%, 0 75%, 0 25%);
    }

    .login-credentials .element-input input {
        width: 100%;
        height: 100%;
        padding: 0 177px 0 25px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: #072435;
        clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 25%, 100% 75%, calc(100% - 16px) 100%, 16px 100%, 0 75%, 0 25%);
    }

    .login-credentials .element-input input::placeholder {
        color: #5e768e;
    }

    .login-credentials button.button-forgot {
        height: 46px;
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translate(0, -50%);
        transition: all .2s;
    }
    .login-credentials button.button-forgot:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .login-credentials button.button-forgot:active {
        transition-duration: .2s;
        scale: .9;
    }

    .login-credentials button.button-forgot::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #1a4f63;
        clip-path: polygon(11px 0, calc(100% - 11px) 0, 100% 25%, 100% 75%, calc(100% - 11px) 100%, 11px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .login-credentials button.button-forgot::after {
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

    .login-credentials button.button-forgot .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 15px;
        background: #1a4f63;
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
    }

    .login-credentials button.button-forgot .button-inner span {
        font-size: 13px;
        font-weight: 800;
        color: #bbbfd0;
    }

    .login-credentials button.button-forgot .button-inner svg {
        width: 17px;
        height: 17px;
        display: none;
        fill: #bbbfd0;
    }

    .login-credentials .credentials-info {
        width: 100%;
        margin-top: 35px;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: #49687d;
    }

    .login-credentials .credentials-info button.button-terms {
        text-decoration: underline;
        font-size: 14px;
        font-weight: 700;
        color: #db7d48;
    }

    .login-credentials .credentials-buttons {
        display: flex;
        align-items: center;
        margin-top: 35px;
    }

    .login-credentials button.button-toggle {
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
    .button-toggle:hover {
        transition-duration: .1s;
        transform: translateY(-1px);
        opacity: 0.8;
    }
    .button-toggle:active {
        transition-duration: .2s;
        transform: translateY(2px);
    }

    .login-credentials button.button-toggle.button-active {
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15)) 
                drop-shadow(0px 2px 25px rgba(15, 41, 63, 0.35));
    }

    .login-credentials button.button-action {
        width: 180px;
        height: 54px;
        position: relative;
        filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35)) drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15));
        transition: all .2s;
    }

    .button-action:hover {
        transition-duration: .1s;
        transform: translateY(-1px);
        opacity: 0.8;
    }
    .button-action:active {
        transition-duration: .2s;
        transform: translateY(2px);
    }

    .login-credentials button.button-toggle::before {
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

    .login-credentials button.button-toggle.button-active::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e0a3 100%);
    }

    .login-credentials button.button-toggle::after {
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

    .login-credentials button.button-toggle .button-inner,
    .login-credentials button.button-action .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 800;
        clip-path: polygon(11px 0, calc(100% - 11px) 0, 100% 25%, 100% 75%, calc(100% - 11px) 100%, 11px 100%, 0 75%, 0 25%);
    }

    .login-credentials button.button-toggle .button-inner {
        color: #bbbfd0;
        background-color: #1a4f63;
    }

    .login-credentials button.button-toggle.button-active .button-inner {
        color: #00ffc2;
        background: radial-gradient(60% 60% at 50% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(255deg, rgba(0, 255, 194, 0.05) 0%, rgba(0, 170, 109, 0.05) 100%);
    }

    .login-credentials button.button-action .button-inner {
        color: #ffffff;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%);
    }

    @media only screen and (max-width: 430px) {

        .login-credentials .element-input input {
            padding: 0 62px 0 25px;
        }


        .login-credentials button.button-forgot .button-inner span {
            display: none;
        }

        .login-credentials button.button-forgot .button-inner svg {
            display: block;
        }

        .login-credentials .credentials-buttons {
            width: 100%;
            flex-direction: column;
        }

        .login-credentials button.button-toggle,
        .login-credentials button.button-action {
            width: 100%;
            transition: all;
            transition-duration: 0.2s;
        }

        .button-action:hover {
            opacity: 0.8;
        }
        .button-action:focus {
            scale: 0.95;
        }

        .login-credentials button.button-toggle {
            margin-bottom: 10px;
            margin-right: 0;
        }

    }
</style>