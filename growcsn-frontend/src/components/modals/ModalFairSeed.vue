<template>
    <div class="modal-fair-seed">
        <div class="seed-header">
            <div class="header-icon">
                <img src="@/assets/img/fair.png" alt="fair" />
            </div>
            <span class="gradient-green">PROVABLY FAIR</span>
        </div>
        <div class="seed-element">
            <div class="element-title">ACTIVE CLIENT SEED</div>
            <div class="element-content">
                <span v-if="userSeedData.data !== null">{{userSeedData.data.seed.seedClient}}</span>
                <button v-on:click="modalCopyButton(userSeedData.data.seed.seedClient)" class="button-copy">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.16493 13.7385C4.51414 13.7385 3.17051 12.3949 3.17051 10.7441V3.52246H1.93758C0.868744 3.52246 0 4.39108 0 5.45991V14.9715C0 16.0403 0.868744 16.909 1.93758 16.909H10.7445C11.8133 16.909 12.6821 16.0403 12.6821 14.9715V13.7385H6.16493Z" />
                        <path d="M15.5004 1.93758C15.5004 0.867325 14.6331 0 13.563 0H6.16512C5.09486 0 4.22754 0.867325 4.22754 1.93758V10.7445C4.22754 11.8147 5.09486 12.6821 6.16512 12.6821H13.563C14.6331 12.6821 15.5004 11.8147 15.5004 10.7445V1.93758Z" />
                    </svg>
                </button>
            </div>
        </div>
        <div class="seed-element">
            <div class="element-title">ACTIVE SERVER SEED(HASHED)</div>
            <div class="element-content">
                <span v-if="userSeedData.data !== null">{{userSeedData.data.seed.hash}}</span>
                <button v-on:click="modalCopyButton(userSeedData.data.seed.hash)" class="button-copy">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.16493 13.7385C4.51414 13.7385 3.17051 12.3949 3.17051 10.7441V3.52246H1.93758C0.868744 3.52246 0 4.39108 0 5.45991V14.9715C0 16.0403 0.868744 16.909 1.93758 16.909H10.7445C11.8133 16.909 12.6821 16.0403 12.6821 14.9715V13.7385H6.16493Z" />
                        <path d="M15.5004 1.93758C15.5004 0.867325 14.6331 0 13.563 0H6.16512C5.09486 0 4.22754 0.867325 4.22754 1.93758V10.7445C4.22754 11.8147 5.09486 12.6821 6.16512 12.6821H13.563C14.6331 12.6821 15.5004 11.8147 15.5004 10.7445V1.93758Z" />
                    </svg>
                </button>
            </div>
        </div>
        <div class="seed-element element-input">
            <div class="element-title">NEXT CLIENT SEED</div>
            <div class="element-content">
                <input v-model="modalClientSeed" type="text" />
                <button v-on:click="modalCycleButton()" class="button-cycle" v-bind:disabled="socketSendLoading !== null">
                    <div class="button-inner">CYCLE</div>
                </button>
            </div>
        </div>
        <div class="seed-element">
            <div class="element-title">NEXT SERVER SEED(HASHED)</div>
            <div class="element-content">
                <span v-if="userSeedData.data !== null">{{userSeedData.data.seedNext.hash}}</span>
                <button v-on:click="modalCopyButton(userSeedData.data.seedNext.hash)" class="button-copy">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.16493 13.7385C4.51414 13.7385 3.17051 12.3949 3.17051 10.7441V3.52246H1.93758C0.868744 3.52246 0 4.39108 0 5.45991V14.9715C0 16.0403 0.868744 16.909 1.93758 16.909H10.7445C11.8133 16.909 12.6821 16.0403 12.6821 14.9715V13.7385H6.16493Z" />
                        <path d="M15.5004 1.93758C15.5004 0.867325 14.6331 0 13.563 0H6.16512C5.09486 0 4.22754 0.867325 4.22754 1.93758V10.7445C4.22754 11.8147 5.09486 12.6821 6.16512 12.6821H13.563C14.6331 12.6821 15.5004 11.8147 15.5004 10.7445V1.93758Z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'ModalFairSeed',
        data() {
            return {
                modalClientSeed: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'userGetSeedSocket',
                'userSendSeedSocket'
            ]),
            modalCopyButton(value) {
                const el = document.createElement('textarea');
                el.value = value;
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);

                this.notificationShow({ type: 'success', message: 'Copied to your clipboard.' });
            },
            modalCycleButton() {
                const data = { seedClient: this.modalClientSeed.trim() };
                this.userSendSeedSocket(data);
            }
        },  
        computed: {
            ...mapGetters([
                'socketSendLoading', 
                'userSeedData'
            ])
        },
        watch: {
            'userSeedData': {
                deep: true,
                handler() {
                    if(this.userSeedData.loading === false && this.userSeedData.data !== null) {
                        this.modalClientSeed = this.userSeedData.data.seedNext.seedClient;
                    }
                }
            }
        },
        created() {
            if(this.userSeedData.loading === false) {
                if(this.userSeedData.data === null) {
                    const data = {};
                    this.userGetSeedSocket(data);
                } else { this.modalClientSeed = this.userSeedData.data.seedNext.seedClient; }
            }
        }
    }
</script>

<style scoped>
    .modal-fair-seed {
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

    .modal-fair-seed .seed-header {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .modal-fair-seed .header-icon {
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: linear-gradient(255deg, rgba(0, 255, 194, 0.2)0%, rgba(0, 170, 109, 0.2) 100%);
    }

    .modal-fair-seed .header-icon img {
        width: 48px;
        height: 48px;
    }

    .modal-fair-seed .seed-header span {
        margin-top: 20px;
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-fair-seed .seed-element {
        width: 100%;
        margin-top: 25px;
    }

    .modal-fair-seed .seed-element:first-of-type {
        margin-top: 0;
    }

    .modal-fair-seed .element-title {
        font-weight: 16;
        font-weight: 700;
        color: #ffffff;
    }

    .modal-fair-seed .element-content {
        width: 100%;
        height: 56px;
        position: relative;
        display: flex;
        align-items: center;
        margin-top: 12px;
        padding: 0 52px 0 20px;
        border-radius: 8px;
        background: #071f2e;
    }

    .modal-fair-seed .element-content span {
        font-size: 16px;
        font-weight: 600;
        color: #5e768e;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .modal-fair-seed .element-content input {
        width: 100%;
        height: 100%;
        font-size: 16px;
        font-weight: 600;
        color: #5e768e;
        background: transparent;
    }

    .modal-fair-seed button.button-cycle {
        width: 90px;
        height: 42px;
        position: absolute;
        top: 50%;
        right: 8px;
        transform: translate(0, -50%);
        transition: all .2s;
    }
    .modal-fair-seed button.button-cycle:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .modal-fair-seed button.button-cycle:active {
        transition-duration: .2s;
        scale: .9;
    }

    .modal-fair-seed button.button-cycle .button-inner {
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

    .modal-fair-seed .element-content button.button-copy {
        position: absolute;
        top: 50%;
        right: 22px;
        transform: translate(0, -50%);
    }

    .modal-fair-seed .element-content button.button-copy svg {
        width: 20px;
        height: auto;
        fill: #49687d;
        transition: fill 0.3s ease;
    }

    .modal-fair-seed .element-content button.button-copy:hover svg {
        fill: #ffffff;
    }

    @media only screen and (max-width: 740px) {

        .modal-fair-seed {
            width: calc(100vw - 20px);
            padding: 35px 10px 30px 10px;
        }

    }
</style>