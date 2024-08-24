<template>
    <div class="affiliates-code">
        <div class="code-icons">
            <IconShare />
            <IconShare />
        </div>
        <div class="code-inner">
            <div class="inner-info">
                <div class="info-text">
                    <span class="gradient-green">COPY AND SHARE YOUR REFERRAL CODE</span>
                    <div class="text-link">
                        https://growcsn.com/?a={{ affiliatesData.data !== null && affiliatesData.data.code !== undefined ? affiliatesData.data.code : '' }}
                        <button v-if="affiliatesData.data !== null && affiliatesData.data.code !== undefined" v-on:click="affiliatesCopyButton" class="button-copy">
                            <IconCopy />
                        </button>
                    </div>
                </div>
            </div>
            <div class="inner-input">
                <input v-model="affiliatesCode" type="text" placeholder="SET YOUR REFERRAL CODE" />
                <button v-on:click="affiliatesCodeButton" class="button-code" v-bind:disabled="socketSendLoading !== null">
                    <div class="button-inner">
                        <transition name="fade" mode="out-in">
                            <ButtonLoading v-if="socketSendLoading === 'AffiliatesCode'" key="loading" />
                            <div v-else class="inner-content" key="content">SET CODE</div>
                        </transition>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconShare from '@/components/icons/IconShare';
    import IconCopy from '@/components/icons/IconCopy';
    import ButtonLoading from '@/components/ButtonLoading';

    export default {
        name: 'AffiliatesCode',
        components: {
            IconShare,
            IconCopy,
            ButtonLoading
        },
        data() {
           return {
               affiliatesCode: ''
           }
       },
       methods: {
            ...mapActions(['notificationShow', 'affiliatesSendCodeSocket']),
            affiliatesCopyButton() {
                const el = document.createElement('textarea');
                el.value = ' https://growcsn.com/?a=' + (this.affiliatesData.data !== null && this.affiliatesData.data.code !== undefined ? this.affiliatesData.data.code : '');
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);

                this.notificationShow({ type: 'success', message: 'Copied to your clipboard.' });
            },
            affiliatesCodeButton() {
                if(this.affiliatesCode === null || this.affiliatesCode.trim() === '' || this.affiliatesCode.trim().length < 2) {
                    this.notificationShow({ type: 'error', message: 'Your entered affiliate code is invalid.' });
                    return;
                }

                const data = { code: this.affiliatesCode };
                this.affiliatesSendCodeSocket(data);
            }
        },
        computed: {
            ...mapGetters(['socketSendLoading', 'affiliatesData'])
        },
        watch: {
            'affiliatesData.data': {
                handler(data, oldData) {
                    if(this.affiliatesData.data !== null) {
                        this.affiliatesCode = this.affiliatesData.data.code !== undefined ? this.affiliatesData.data.code : '';
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped>
    .affiliates-code {
        width: 955px;
        height: 111px;
        position: relative;
        margin-top: 25px;
        padding: 1px;
    }

    .affiliates-code::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 15px;
        background: linear-gradient(180deg, rgba(20, 68, 104, 0) 0%, #144468 100%);
        z-index: -1;
    }

    .affiliates-code::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 15px;
        background: linear-gradient(255deg, #07263d 0%, #07243a 100%);
        z-index: -1;
    }

    .affiliates-code .code-icons {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 15px;
        overflow: hidden;
        z-index: 0;
    }

    .affiliates-code .code-icons svg:nth-child(1) {
        width: 144px;
        height: 153px;
        position: absolute;
        top: 50%;
        left: -30px;
        transform: translate(0, -50%);
        fill: rgba(22, 59, 87, 0.08);
    }

    .affiliates-code .code-icons svg:nth-child(2) {
        position: absolute;
        top: 50%;
        left: 35px;
        transform: translate(0, -50%);
        fill: url(#icon-share-gradient-1);
    }

    .affiliates-code .code-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 35px 0 121px;
        border-radius: 15px;
    }

    .affiliates-code .inner-info {
        display: flex;
        align-items: center;
    }

    .affiliates-code .info-text span {
        font-size: 14px;
        font-weight: 800;
    }

    .affiliates-code .text-link {
        height: 21px;
        display: flex;
        align-items: center;
        margin-top: 10px;
        font-size: 14px;
        font-weight: 400;
        color: #49687d;
        z-index: 2;
    }

    .affiliates-code .text-link button.button-copy {
        margin-left: 12px;
        z-index: 1;
    }

    .affiliates-code .text-link button.button-copy svg {
        fill: #49687d;
        transition: fill 0.3s ease;
    }

    .affiliates-code .text-link button.button-copy:hover svg {
        fill: #ffffff;
    }

    .affiliates-code .inner-input {
        width: 380px;
        height: 61px;
        position: relative;
        padding: 1px;
    }

    .affiliates-code .inner-input::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(11px 0, calc(100% - 11px) 0, 100% 25%, 100% 75%, calc(100% - 11px) 100%, 11px 100%, 0 75%, 0 25%);
    }

    .affiliates-code .inner-input input {
        width: 100%;
        height: 100%;
        padding: 0 83px 0 15px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background-color: #07253b;
        clip-path: polygon(11px 0, calc(100% - 11px) 0, 100% 25%, 100% 75%, calc(100% - 11px) 100%, 11px 100%, 0 75%, 0 25%);
    }

    .affiliates-code .inner-input input::placeholder {
        font-size: 11px;
        color: #5e768e;
    }

    .affiliates-code .inner-input button.button-code {
        width: 77px;
        height: 33px;
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translate(0, -50%);
        filter: drop-shadow(0px 2px 10px rgba(1, 230, 169, 0.15)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
        transition: all .2s;
    }
    .affiliates-code .inner-input button.button-code:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .affiliates-code .inner-input button.button-code:active {
        transition-duration: .2s;
        scale: .9;
    }


    .affiliates-code .inner-input button.button-code:disabled {
        cursor: not-allowed;
    }

    .affiliates-code .inner-input button.button-code .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .affiliates-code .inner-input button.button-code .button-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .affiliates-code .inner-input button.button-code .button-loading.fade-leave-to {
        opacity: 0;
    }

    .affiliates-code .inner-input button.button-code .inner-content {
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
    }

    .affiliates-code .inner-input button.button-code .inner-content.fade-enter-active {
        transition: opacity 0.5s;
    }

    .affiliates-code .inner-input button.button-code .inner-content.fade-enter-from {
        opacity: 0;
    }

    @media only screen and (max-width: 975px) {

        .affiliates-code {
            width: 100%;
        }

    }

    @media only screen and (max-width: 925px) {

        .affiliates-code {
            height: auto;
        }

        .affiliates-code .code-inner {
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 15px 10px 121px;
        }

        .affiliates-code .inner-input {
            width: 100%;
            margin-top: 20px;
        }

    }

    @media only screen and (max-width: 500px) {

        .affiliates-code .code-icons svg:nth-child(2) {
            display: none;
        }

        .affiliates-code .code-inner {
            padding: 10px 20px;
        }

    }
</style>
