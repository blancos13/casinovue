<template>
    <div class="modal-captcha">
        <div class="captcha-title">
            <span class="gradient-green">COMPLETE CAPTCHA</span>
        </div>
        <div class="captcha-content">
            <VueHcaptcha 
                ref="modalCaptcha" 
                v-bind:sitekey="modalCaptchaKey" 
                @verify="modalOnVerify" 
                @expired="modalOnExpire"
                @challengeExpired="modalOnExpire"
            />
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import VueHcaptcha from '@hcaptcha/vue-hcaptcha';

    export default {
        name: 'ModalTip',
        components: {
            VueHcaptcha
        },
        data() {
            return {
                modalCaptchaKey: process.env.VUE_APP_HCAPTCHA_KEY
            }
        },
        methods: {
            ...mapActions([
                'modalsSetShow', 
                'authSendCredentialsLogin',
                'authSendCredentialsRegister',
                'authSendCredentialsRequest',
                'authSendCredentialsReset',
                'affiliatesSendClaimCodeSocket', 
                'generalSendPromoClaimSocket', 
                'cashierSendGiftRedeemSocket', 
                'generalSendRainJoinSocket'
            ]),
            modalOnVerify(token, eKey) {
                const data = { ...this.modalsData.data, captcha: token };

                if(this.modalsData.typeCaptcha === 'credentialsLogin') {
                    this.authSendCredentialsLogin(data);
                } else if(this.modalsData.typeCaptcha === 'credentialsRegister') {
                    this.authSendCredentialsRegister(data);
                } else if(this.modalsData.typeCaptcha === 'credentialsRequest') {
                    this.authSendCredentialsRequest(data);
                } else if(this.modalsData.typeCaptcha === 'credentialsReset') {
                    this.authSendCredentialsReset(data);
                } else if(this.modalsData.typeCaptcha === 'affiliatesClaim') {
                    this.affiliatesSendClaimCodeSocket(data);
                } else if(this.modalsData.typeCaptcha === 'promoClaim') {
                    this.generalSendPromoClaimSocket(data);
                } else if(this.modalsData.typeCaptcha === 'giftRedeem') {
                    this.cashierSendGiftRedeemSocket(data);
                } else if(this.modalsData.typeCaptcha === 'rainJoin') {
                    this.generalSendRainJoinSocket(data);
                }

                this.modalsSetShow(null);
            },
            modalOnExpire() {
                this.modalsSetShow(null);
            }
        },
        computed: {
            ...mapGetters([ 
                'modalsData'
            ])
        },
        mounted() {
            this.$refs.modalCaptcha.reset();
        }
    }
</script>

<style scoped>
    .modal-captcha {
        width: 773px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 0 48px 0;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% -31.45%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, #07263d 0%, #07243a 100%);
    }

    .modal-captcha .captcha-title {
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-captcha .captcha-content {
        width: 303px;
        height: 76px;
        margin-top: 35px;
        border-radius: 4px;
        background-color: #1a4f63;
    }

    @media only screen and (max-width: 793px) {

        .modal-captcha {
            width: calc(100vw - 20px);
            padding: 85px 20px 48px 20px;
        }

    }
</style>
