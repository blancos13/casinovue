<template>
    <div class="modal-vault">
        <div class="vault-header">
            <div class="header-icon">
                <div class="icon-inner">
                    <img src="@/assets/img/vault.png" alt="vault" />
                </div>
            </div>
            <div class="header-title">
                <span>GrowCsn</span> VAULT
            </div>
        </div>
        <div class="vault-stats">
            <div class="stats-balance">
                <div class="balance-title">BALANCE</div>
                <div class="balance-inner">
                    <img src="@/assets/img/icons/coin.svg" alt="coin" />
                    <AmountNumber v-bind:amount="authUser.user.balance" />
                </div>
            </div>
            <div class="stats-vaulted">
                <div class="vaulted-title">VAULTED</div>
                <div class="vaulted-inner">
                    <img src="@/assets/img/icons/coin.svg" alt="coin" />
                    <AmountNumber v-bind:amount="authUser.user.vault.amount" />
                </div>
            </div>
        </div>
        <div class="vault-amount">
            <img src="@/assets/img/icons/coin.svg" alt="coin" />
            <input v-model="modalAmount" v-on:input="modalValidateInput" type="text" placeholder="Enter transfer amount..." />
        </div>
        <button v-on:click="modalDepositButton()" class="button-deposit" v-bind:disabled="socketSendLoading !== null">
            <div class="button-inner">DEPOSIT TO VAULT</div>
        </button>
        <button v-on:click="modalWithdrawButton()" class="button-withdraw" v-bind:disabled="socketSendLoading !== null">
            <div class="button-inner">WITHDRAW FROM VAULT</div>
        </button>
        <div class="vault-footer">
            <div v-if="modalCountdownText === null" class="footer-unlocked">
                <div class="unlocked-title">LOCK VAULT FOR</div>
                <div class="unlocked-content">
                    <select v-model="modalTime">
                        <option value="10">10 Minutes</option>
                        <option value="30">30 Minutes</option>
                        <option value="60">1 Hour</option>
                        <option value="360">6 Hours</option>
                        <option value="720">12 Hours</option>
                        <option value="1440">1 Day</option>
                    </select>
                    <button v-on:click="modalLockButton()" class="button-lock" v-bind:disabled="socketSendLoading !== null">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.23077 8.51212C4.23077 -1.45159 15.3077 -1.55635 15.3077 8.51212M4.23077 8.51212H1V19H19V8.51212H15.3077M4.23077 8.51212H15.3077" stroke-width="2"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div v-else class="footer-locked">
                <div class="locked-title">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.33333 6.42542C3.33333 -0.770594 11.3333 -0.846256 11.3333 6.42542M3.33333 6.42542H1V14H14V6.42542H11.3333M3.33333 6.42542H11.3333" stroke-width="2"/>
                    </svg>
                    The Vault is locked!
                </div>
                <div class="locked-time">
                    <span>{{ modalCountdownText }}</span> remaining
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AmountNumber from '@/components/AmountNumber';

    export default {
        name: 'ModalVault',
        components: {
            AmountNumber
        },
        data() {
            return {
                modalAmount: null,
                modalTime: '10',
                modalCountdownText: null,
                modalCountdownRepeater: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'modalsSetShow', 
                'modalsSetData',
                'generalSendVaultDepositSocket',
                'generalSendVaultWithdrawSocket',
                'generalSendVaultLockSocket'
            ]),
            modalFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            modalValidateInput() {
                this.modalAmount = this.modalAmount.replace(',', '.').replace(/[^\d.]/g, '');
                this.modalAmount = this.modalAmount.indexOf('.') >= 0 ? this.modalAmount.substr(0, this.modalAmount.indexOf('.')) + '.' + this.modalAmount.substr((this.modalAmount.indexOf('.') + 1), 2).replace('.', '') : this.modalAmount;
            },
            modalStartCountdown() {
                const timeExpire = new Date(this.authUser.user.vault.expireAt).getTime();
                const timeLeft = (timeExpire - (new Date().getTime() + this.generalTimeDiff)) / 1000;

                let timeLeftHours = Math.floor(timeLeft / 3600);
                let timeLeftMinutes = Math.floor((timeLeft % 3600) / 60);
                let timeLeftSeconds = Math.floor(timeLeft % 60);

                timeLeftMinutes = timeLeftMinutes < 10 ? '0' + timeLeftMinutes : timeLeftMinutes;
                timeLeftSeconds = timeLeftSeconds < 10 ? '0' + timeLeftSeconds : timeLeftSeconds;

                if(timeLeft <= 0) { this.modalCountdownText = null; } 
                else {
                    this.modalCountdownText = timeLeftHours + ':' + timeLeftMinutes + ':' + timeLeftSeconds;
                    this.modalCountdownRepeater = requestAnimationFrame(this.modalStartCountdown); 
                }
            },
            modalDepositButton() {
                const data = { amount: Math.floor(this.modalAmount * 1000) };
                this.generalSendVaultDepositSocket(data);
            },
            modalWithdrawButton() {
                const data = { amount: Math.floor(this.modalAmount * 1000) };
                this.generalSendVaultWithdrawSocket(data);
            },
            modalLockButton() {
                const data = { time: Math.floor(1000 * 60 * Number(this.modalTime)) };
                this.generalSendVaultLockSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'generalTimeDiff',
                'modalsData',
                'authUser'
            ])
        },
        watch: {
            'authUser.user': {
                deep: true,
                handler() {
                    if(this.authUser.user.vault.expireAt !== undefined) { this.modalStartCountdown(); }
                }
            }
        },
        created() {
            if(this.authUser.user.vault.expireAt !== undefined) { this.modalStartCountdown(); }
        },
        beforeDestroy() {
            clearInterval(this.modalCountdownRepeater);
        }
    }
</script>

<style scoped>
    .modal-vault {
        width: 600px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 30px 30px 30px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% 0%, rgba(0, 255, 194, 0.25) 0%, rgba(7, 38, 61, 0) 80%), 
                    linear-gradient(256deg, #07263d 0%, #07243a 100%);
    }

    .modal-vault .vault-header {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .modal-vault .header-icon {
        width: 88px;
        height: 88px;
        padding: 1px;
        border-radius: 50%;
        background: linear-gradient(180deg, #01C689 0%, #056e67 50%);
    }

    .modal-vault .icon-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: #056e67;
    }

    .modal-vault .icon-inner img {
        width: 74px;
        height: 74px;
    }

    .modal-vault .header-title {
        margin-top: 12px;
        text-align: center;
        font-size: 32px;
        font-weight: 900;
        color: #ffffff;
    }

    .modal-vault .header-title span {
        color: #00cb8e;
    }

    .modal-vault .vault-stats {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

    .modal-vault .vault-stats:before,
    .modal-vault .vault-stats:after {
        content: '';
        width: calc(50% - 180px);
        height: 1px;
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
    }

    .modal-vault .vault-stats:before {
        left: 0;
        background: linear-gradient(270deg, #01c689 0%, rgba(217, 217, 217, 0) 100%);
    }

    .modal-vault .vault-stats:after {
        right: 0;
        background: linear-gradient(90deg, #01C689 0%, rgba(217, 217, 217, 0) 100%);
    }

    .modal-vault .stats-balance,
    .modal-vault .stats-vaulted {
        width: 160px;
        height: 50px;
        position: relative;
        padding: 1px;
        filter: drop-shadow(0px 4px 25px #0f293f);
    }

    .modal-vault .stats-balance {
        margin-right: 12px;
    }

    .modal-vault .stats-balance:before,
    .modal-vault .stats-vaulted:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(1, 198, 137, 0.25);
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
    }

    .modal-vault .balance-title,
    .modal-vault .vaulted-title {
        position: absolute;
        top: -7px;
        left: 8px;
        font-size: 10px;
        font-weight: 800;
        z-index: 1;
    }

    .modal-vault .balance-title {
        color: #00cb8e;
    }

    .modal-vault .vaulted-title {
        color: #fca80d;
    }

    .modal-vault .balance-inner,
    .modal-vault .vaulted-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 13px;
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
    }

    .modal-vault .balance-inner {
        background: #071f2e;
    }

    .modal-vault .vaulted-inner {
        background: #064b50;
    }

    .modal-vault .balance-inner img,
    .modal-vault .vaulted-inner img {
        width: 18px;
        height: 18px;
    }

    .modal-vault .inner-value {
        font-size: 12px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .modal-vault .inner-value span {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    .modal-vault .vault-amount {
        width: 100%;
        margin-top: 25px;
        position: relative;
    }

    .modal-vault .vault-amount img {
        width: 18px;
        height: 18px;
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translate(0, -50%);
    }

    .modal-vault .vault-amount input {
        width: 100%;
        height: 56px;
        padding: 0 20px 0 44px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        background: #071f2e;
    }

    .modal-vault .vault-amount input::placeholder {
        color: #5191b1;
    }

    .modal-vault button.button-deposit,
    .modal-vault button.button-withdraw {
        width: 250px;
        height: 42px;
        margin-top: 30px;
        transition: all .2s;
    }

    .modal-vault button.button-deposit:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .modal-vault button.button-deposit:active {
        transition-duration: .2s;
        scale: .9;
    }

    .modal-vault button.button-withdraw {
        margin-top: 15px;
        padding: 1px;
        background: linear-gradient(0deg, #ffe600 0%, #fca311 100%);
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
        transition: all .2s;
    }

    .modal-vault button.button-withdraw:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .modal-vault button.button-withdraw:active {
        transition-duration: .2s;
        scale: .9;
    }

    .modal-vault button.button-deposit .button-inner,
    .modal-vault button.button-withdraw .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .modal-vault button.button-deposit .button-inner {
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%);
    }

    .modal-vault button.button-withdraw .button-inner {
        background: linear-gradient(250deg, #fca311 0%, #ffb703 100%);
    }

    .modal-vault .vault-footer {
        width: 100%;
        margin-top: 30px;
        padding-top: 25px;
        border-top: 1px solid #173d5a;
    }

    .modal-vault .footer-unlocked {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .modal-vault .unlocked-title {
        font-size: 14px;
        font-weight: 800;
        color: #bbbfcf;
    }

    .modal-vault .unlocked-content {
        width: 100%;
        display: flex;
        margin: 12px;
    }

    .modal-vault .unlocked-content select {
        width: calc(100% - 62px);
        height: 56px;
        padding: 0 15px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 400;
        color: #bbbfcf;
        background: #0b304a;
        -webkit-appearance: none;
        -moz-appearance: none;
    }

    .modal-vault button.button-lock {
        width: 56px;
        height: 56px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 6px;
        border-radius: 8px;
        background: rgba(234, 65, 65, 0.25);
        border: 1px solid rgba(234, 65, 65, 0.5);
    }

    .modal-vault button.button-lock svg {
        stroke: #ea4141;
    }

    .modal-vault .footer-locked {
        width: 100%;
        height: 58px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background: rgba(234, 65, 65, 0.25);
    }

    .modal-vault .locked-title {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #ea4141;
    }

    .modal-vault .locked-title svg {
        margin-right: 10px;
        stroke: #ea4141;
    }

    .modal-vault .locked-time {
        margin-top: 2px;
        font-size: 12px;
        font-weight: 400;
        color: #ea4141;
    }

    .modal-vault .locked-time span {
        color: #ffffff;
    }

    @media only screen and (max-width: 620px) {

        .modal-vault {
            width: calc(100vw - 20px);
            padding: 35px 10px 30px 10px;
        }

    }

    @media only screen and (max-width: 500px) {

        .modal-vault {
            padding: 65px 10px 30px 10px;
        }

    }

    @media only screen and (max-width: 400px) {

        .modal-vault .vault-stats {
            flex-direction: column;
        }

        .modal-vault .vault-stats:before,
        .modal-vault .vault-stats:after {
            display: none;
        }

        .modal-vault .stats-balance,
        .modal-vault .stats-vaulted {
            width: 100%;
        }

        .modal-vault .stats-balance {
            margin-bottom: 12px;
            margin-right: 0;
        }

    }
</style>