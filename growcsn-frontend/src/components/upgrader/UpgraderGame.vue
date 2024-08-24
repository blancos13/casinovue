<template>
    <div class="upgrader-game">
        <div class="game-controls">
            <div class="controls-title">USE YOUR BALANCE TO UPGRADE</div>
            <div class="controls-amount">
                <div class="amount-input">
                    <input v-model="upgraderAmount" v-on:input="upgraderValidateInput" type="text" placeholder="BET AMOUNT" />
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="input-buttons">
                        <button v-on:click="upgraderSetAmount('1/2')">
                            <div class="button-inner">1/2</div>
                        </button>
                        <button v-on:click="upgraderSetAmount('2x')">
                            <div class="button-inner">2x</div>
                        </button>
                        <button v-on:click="upgraderSetAmount('max')">
                            <div class="button-inner">MAX</div>
                        </button>
                    </div>
                </div>
                <input v-model="upgraderAmount" type="range" v-bind:min="0.01" v-bind:max="100000" step="0.01" v-bind:style="{ 
                    'background-image': '-webkit-gradient(linear, left top, right top, color-stop(' + upgraderGetPercentageAmount + '%, #164368), color-stop(' + upgraderGetPercentageAmount + '%, rgba(0, 0, 0, 0.35)))' 
                }">
            </div>
            <button v-on:click="upgraderFairButton()" class="button-fair">
                <div class="button-inner">
                    <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0001 2.30199V3.8031H10.941C9.76198 3.80425 8.60479 3.48508 7.59306 2.87967L6.25388 2.07004C6.17599 2.02293 6.0867 1.99803 5.99567 1.99803C5.90465 1.99803 5.81535 2.02293 5.73747 2.07004L4.40266 2.8753C3.39067 3.48009 2.23365 3.79922 1.05471 3.79872H3.60219e-10V2.30199C-5.0177e-06 2.16926 0.0524184 2.04191 0.145859 1.94765C0.239299 1.85339 0.36619 1.79986 0.49891 1.7987H1.05909C2.32857 1.79901 3.574 1.45247 4.66087 0.796506L6.00005 0L7.33485 0.800882C8.42243 1.45521 9.6674 1.80162 10.9366 1.80308H11.5012C11.6328 1.80533 11.7584 1.85862 11.8515 1.9517C11.9446 2.04478 11.9979 2.17037 12.0001 2.30199Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.941 4.81404C9.58091 4.8134 8.2466 4.44276 7.08102 3.74182L6.00005 3.08536L4.91908 3.72869C3.75456 4.43362 2.42034 4.80878 1.05909 4.81404H0V6.12696C0.00306513 7.64623 0.438442 9.13326 1.25526 10.4143C2.07207 11.6953 3.23659 12.7174 4.61273 13.3612L6.00005 14.0045L7.37862 13.3612C8.75673 12.7191 9.92335 11.6976 10.7418 10.4164C11.5603 9.13521 11.9968 7.64729 12.0001 6.12696V4.81404H10.941ZM6.25388 9.19044C6.16095 9.27977 6.03705 9.32966 5.90815 9.32966C5.77924 9.32966 5.65534 9.27977 5.56241 9.19044L4.16196 7.78999L4.86656 7.08539L5.9169 8.13135L7.66746 6.38079L8.37206 7.08539L6.25388 9.19044Z" />
                    </svg>
                    FAIRNESS
                </div>
            </button>
        </div>
        <div class="game-mid">
            <div class="mid-spinner">
                <div class="spinner-graph">
                    <svg width="280px" height="280px" viewBox="0 0 32.75 32.75" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16.365" cy="16.365" r="15.91549430918954" v-bind:stroke-dasharray="99 +' '+ (100 - 99)"></circle>
                    </svg>
                </div>
                <div class="spinner-inner">
                    CHANCE
                    <div class="inner-chance">
                        0.00<span>%</span>
                    </div>
                    <div class="inner-tickets">
                        0.00000 - 1.00000
                    </div>
                </div>
            </div>
            <button v-on:click="upgraderToggleButton()" class="button-toggle" v-bind:class="{ 'button-under': upgraderMode === 'under' }">
                <IconUpgraderModeGradient />
                <span>ROLL</span>
                {{upgraderMode.toUpperCase()}}
            </button>
            <button class="button-upgrade">
                <div class="button-inner">
                    <IconUpgraderGradient />
                    <IconUpgraderGradient />
                    <span>UPGRADE</span>
                </div>
            </button>
        </div>
        <div class="game-items">
            <div class="items-title">SELECT ITEMS TO UPGRADE</div>
            <div class="items-image">
                <svg width="136" height="86" viewBox="0 0 136 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M47.3304 86L20.9692 83.5775L4.19383 74.493L0 60.5634L4.19383 49.662L12.5815 39.9718L16.7753 37.5493L23.3656 32.7042L29.3568 30.2817L32.9515 21.1972L35.9471 10.2958L44.3348 3.02817L47.3304 2.42254L61.7093 1.21127L79.6828 0L94.0617 1.21127L107.242 4.23944L110.238 6.66197L113.233 18.7746L120.423 21.1972L130.608 26.6479L136 35.7324L134.802 48.4507L127.013 58.7465L108.441 70.8592L78.4846 81.1549L47.3304 86Z" fill="url(#paint0_linear_4806_774)" fill-opacity="0.27"/>
                    <defs>
                        <linearGradient id="paint0_linear_4806_774" x1="68" y1="0" x2="68" y2="86" gradientUnits="userSpaceOnUse">
                            <stop/>
                            <stop offset="1" stop-opacity="0.28"/>
                        </linearGradient>
                    </defs>
                </svg>

            </div>
            <div class="items-info"></div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconUpgraderModeGradient from '@/components/icons/IconUpgraderModeGradient';
    import IconUpgraderGradient from '@/components/icons/IconUpgraderGradient';

    export default {
        name: 'UpgraderGame',
        components: {
            IconUpgraderModeGradient,
            IconUpgraderGradient
        },
        data() {
            return {
                upgraderAmount: null,
                upgraderMode: 'under'
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'modalsSetShow'
            ]),
            upgraderFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            upgraderValidateInput() {
                this.upgraderAmount = this.upgraderAmount.replace(',', '.').replace(/[^\d.]/g, '');
                this.upgraderAmount = this.upgraderAmount.indexOf('.') >= 0 ? this.upgraderAmount.substr(0, this.upgraderAmount.indexOf('.')) + '.' + this.upgraderAmount.substr((this.upgraderAmount.indexOf('.') + 1), 2).replace('.', '') : this.upgraderAmount;
            },
            upgraderSetAmount(action) {
                let amount = Math.floor(this.upgraderAmount * 1000);

                if(action === '1/2') {
                    amount = Math.floor(amount / 2);
                } else if(action === '2x') {
                    amount = Math.floor(amount * 2);
                } else if(action === 'max') {
                    amount = this.authUser.user.balance <= 1000000 ? this.authUser.user.balance : 1000000;
                }

                this.upgraderAmount = parseFloat(Math.floor(amount / 10) / 100).toFixed(2);
            },
            upgraderFairButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                this.modalsSetShow('FairSeed')
            },
            upgraderToggleButton() {
                this.upgraderMode = this.upgraderMode === 'under' ? 'over' : 'under';
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'authUser'
            ]),
            upgraderGetPercentageAmount() {
                let amount = 50;

                return amount;
            }
        }
    }
</script>

<style scoped>
    .upgrader-game {
        width: 1200px;
        display: flex;
    }

    .upgrader-game .game-controls,
    .upgrader-game .game-items {
        width: 360px;
        height: 360px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 35px 25px 20px 25px;
        border-radius: 15px;
        background: rgba(12, 63, 103, 0.2);
        border: 1px dashed rgba(62, 109, 146, 0.35);
    }

    .upgrader-game .controls-title,
    .upgrader-game .items-title {
        text-align: center;
        font-size: 15px;
        font-weight: 700;
        color: #5e768e;
    }

    .upgrader-game .controls-amount {
        width: 100%;
    }

    .upgrader-game .amount-input {
        width: 100%;
        height: 50px;
        position: relative;
        padding: 1px;
    }

    .upgrader-game .amount-input::before {
        content: '';
        width: 100%;
        height: 50px;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .upgrader-game .amount-input input {
        width: 100%;
        height: 100%;
        padding: 0 100px 0 43px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background-color: #031a2d;
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .upgrader-game .amount-input input::placeholder {
        color: #5e768e;
    }

    .upgrader-game .amount-input img {
        width: 19px;
        height: 19px;
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translate(0, -50%);
    }

    .upgrader-game .controls-amount input[type='range'] {
        width: 100%;
        height: 10px;
        margin-top: 16px;
        border-radius: 5px;
        outline: none;
        -webkit-appearance: none;
        -moz-apperance: none;
        background: rgba(0, 0, 0, 0.35);
        transition: all 0.03s ease;
    }

    .upgrader-game .controls-amount input[type='range']::-webkit-slider-thumb {
        width: 16px;
        height: 16px;
        border-radius: 100%;
        background-color: #ffffff;
        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;
    }

    .upgrader-game .controls-amount input[type='range']::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 100%;
        background-color: #ffffff;
        cursor: pointer;
    }

    .upgrader-game .input-buttons {
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translate(0, -50%);
    }

    .upgrader-game .input-buttons button {
        width: 36px;
        height: 27px;
        margin-right: 5px;
    }

    .upgrader-game .input-buttons button:last-of-type {
        margin-right: 0;
    }

    .upgrader-game .input-buttons button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 11px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .upgrader-game button.button-fair {
        width: 112px;
        height: 32px;
    }

    .upgrader-game button.button-fair .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: #bbbfd0;
        background: #214059;
        transition: color 0.3s ease;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .upgrader-game button.button-fair:hover .button-inner {
        color: #ffffff;
    }

    .upgrader-game button.button-fair .button-inner svg {
        margin-right: 6px;
        fill: #bbbfd0;
        transition: fill 0.3s ease;
    }

    .upgrader-game button.button-fair:hover .button-inner svg {
        fill: #ffffff;
    }

    .upgrader-game .game-mid {
        width: calc(100% - 720px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }

    .upgrader-game .mid-spinner {
        width: 265px;
        height: 265px;
        position: relative;
        border-radius: 50%;
        padding: 1px;
        background: rgba(0, 0, 0, 0.25);
        border: 1px dashed rgba(62, 109, 146, 0.35);
    }

    .upgrader-game .spinner-graph {
        width: 270px;
        height: 270px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .upgrader-game .spinner-graph svg {
        fill: none;
        stroke-width: 0.3;
        stroke-dashoffset: 25;
        stroke: #00ffc2;
    }

    .upgrader-game .spinner-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        font-weight: 700;
        color: #bbbfd0;
    }

    .upgrader-game .inner-chance {
        font-size: 24px;
        font-weight: 700;
        color: #ffffff;
    }

    .upgrader-game .inner-chance span {
        color: #00ffc2;
    }

    .upgrader-game .inner-tickets {
        font-size: 12px;
        font-weight: 600;
        color: rgba(187, 191, 208, 0.5);
    }

    .upgrader-game button.button-toggle {
        display: flex;
        align-items: center;
        margin-top: 19px;
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
    }

    .upgrader-game button.button-toggle span {
        margin-right: 4px;
        color: #00ffc2;
    }

    .upgrader-game button.button-toggle svg {
        margin-right: 5px;
    }

    .upgrader-game button.button-toggle.button-under svg {
        transform: rotate(180deg);
    }

    .upgrader-game button.button-upgrade {
        width: 230px;
        height: 48px;
        position: relative;
        margin-top: 14px;
        padding: 1px;
    }

    .upgrader-game button.button-upgrade:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #325baa;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .upgrader-game button.button-upgrade .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(90deg, rgba(97, 138, 241, 0.1) 0%, rgba(28, 99, 182, 0.1) 100%),
                    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%), #05233a;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .upgrader-game button.button-upgrade .button-inner svg:nth-child(1) {
        width: 52px;
        height: 38px;
        position: absolute;
        top: 50%;
        left: 35px;
        transform: translate(0, -50%);
        opacity: 0.08;
        z-index: -1;
    }

    .upgrader-game button.button-upgrade .button-inner svg:nth-child(2) {
        margin-right: 6px;
    }

    .upgrader-game button.button-upgrade .button-inner span {
        font-size: 14px;
        font-weight: 800;
        background: linear-gradient(90deg, #618AF1 0%, #1C63B6 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
</style>