<template>
    <div class="modal-claim">
        <div class="claim-header">
            <div class="header-icon">
                <img src="@/assets/img/gift.png" alt="gift" />
            </div>
            <span class="gradient-green">CLAIM FREE DLS</span>
        </div>
        <div class="claim-info">Claim free dls by inviting users, playing on our games or by being active in our discord!</div>
        <div class="claim-input input-affiliate">
            <div class="input-title">Affiliate Code</div>
            <div class="input-info">
                Don't have an affiliate code? Use code "<span>ROLL</span>" for a free
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <span>10 Robux</span>
            </div>
            <div class="input-content">
                <input v-model="modalAffiliateCode" type="text" placeholder="Enter a affiliate code..." />
                <button v-on:click="modalAffiliateButton()" class="button-claim">
                    <div class="button-inner">CLAIM</div>
                </button>
            </div>
        </div>
        <div class="claim-input">
            <div class="input-title">Promotional Code</div>
            <div class="input-info">
                Be active on our Discord to get access to new promotional codes.
            </div>
            <div class="input-content">
                <input v-model="modalPromoCode" type="text" placeholder="Enter a promo code..." />
                <button v-on:click="modalPromoButton()" class="button-claim">
                    <div class="button-inner">CLAIM</div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'ModalClaim',
        data() {
            return {
                modalAffiliateCode: null,
                modalPromoCode: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'modalsSetShow', 
                'modalsSetData'
            ]),
            modalAffiliateButton() {
                if(this.modalAffiliateCode === null || this.modalAffiliateCode.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered affiliate code is invalid.' });
                    return;
                }

                this.modalsSetShow(null);

                setTimeout(() => {
                    this.modalsSetData({ typeCaptcha: 'affiliatesClaim', data: { code: this.modalAffiliateCode } });
                    this.modalsSetShow('Captcha');
                }, 200);
            },
            modalPromoButton() {
                if(this.modalPromoCode === null || this.modalPromoCode.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered promo code is invalid.' });
                    return;
                }

                this.modalsSetShow(null);

                setTimeout(() => {
                    this.modalsSetData({ typeCaptcha: 'promoClaim', data: { code: this.modalPromoCode } });
                    this.modalsSetShow('Captcha');
                }, 200);
            }
        },
        computed: {
            ...mapGetters([ 
                'modalsData'
            ])
        },
        created() {
            if(this.modalsData !== null && this.modalsData.code !== undefined) {
                this.modalAffiliateCode = this.modalsData.code;
            }
        }
    }
</script>

<style scoped>
    .modal-claim {
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

    .modal-claim .claim-header {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .modal-claim .header-icon {
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: linear-gradient(255deg, rgba(0, 255, 194, 0.2)0%, rgba(0, 170, 109, 0.2) 100%);
    }

    .modal-claim .header-icon img {
        width: 48px;
        height: 48px;
    }

    .modal-claim .claim-header span {
        margin-top: 20px;
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-claim .claim-info {
        width: 100%;
        margin-top: 12px;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .modal-claim .claim-input {
        width: 100%;
        margin-top: 25px;
    }

    .modal-claim .claim-input.input-affiliate {
        margin-top: 35px;
    }

    .modal-claim .input-title {
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
    }

    .modal-claim .input-info {
        display: flex;
        flex-wrap: wrap;
        margin-top: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #5191b1;
    }

    .modal-claim .input-info span {
        font-weight: 700;
        color: #ffffff;
    }

    .modal-claim .input-info img {
        width: 20px;
        height: 20px;
        margin: 0 5px;
    }

    .modal-claim .input-content {
        width: 100%;
        position: relative;
        margin-top: 16px;
    }

    .modal-claim .input-content input {
        width: 100%;
        height: 56px;
        padding: 0 98px 0 20px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background: #071f2e;
    }

    .modal-claim .input-content input::placeholder {
        color: #57819b;
    }

    .modal-claim button.button-claim {
        width: 90px;
        height: 42px;
        position: absolute;
        top: 50%;
        right: 8px;
        transform: translate(0, -50%);
        transition: all .2s;
    }
    .button-claim:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .button-claim:active {
        transition-duration: .2s;
        scale: .9;
    }


    .modal-claim button.button-claim .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    @media only screen and (max-width: 740px) {

        .modal-claim {
            width: calc(100vw - 20px);
            padding: 35px 10px 30px 10px;
        }

    }

    @media only screen and (max-width: 500px) {

        .modal-claim {
            padding: 65px 10px 30px 10px;
        }

    }
</style>
