<template>
    <div class="cashier-limited-selected" v-bind:class="{ 'selected-open': cashierOpen === true }">
        <button v-on:click="cashierSelectedButton(true)" class="button-open">
            <div class="button-inner">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                    <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
                </svg>
            </div>
        </button>
        <button v-on:click="cashierSelectedButton(false)" class="button-close">
            <IconClose />
        </button>
        <div class="selected-header">
            SELECTED ITEMS
        </div>
        <div class="selected-content">
            <div class="content-list">

                <CashierSelectedElement v-for="selected in cashierGetSelected" v-bind:key="selected.uniqueId" v-bind:selected="selected" /> 

            </div>
            <div class="content-button">
                <button v-on:click="cashierActionButton()" class="button-action" v-bind:disabled="socketSendLoading !== null">
                    <div class="button-inner">
                        <transition name="fade" mode="out-in">
                            <ButtonLoading v-if="['LimitedEnable', 'LimitedDeposit', 'LimitedWithdraw'].includes(socketSendLoading) === true" />
                            <div v-else class="inner-content">
                                {{cashierGetRouteName.replace('Limiteds', '').toUpperCase()}}
                            </div>
                        </transition>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconClose from '@/components/icons/IconClose';
    import ButtonLoading from '@/components/ButtonLoading';
    import CashierSelectedElement from '@/components/cashier/CashierSelectedElement';

    export default {
        name: 'CashierLimitedSelected',
        components: {
            IconClose,
            ButtonLoading,
            CashierSelectedElement
        },
        data() {
            return {
                cashierOpen: false
            }
        },
        methods: {
            ...mapActions([
                'cashierSendLimitedEnableSocket',
                'cashierSendLimitedDepositSocket',
                'cashierSendLimitedWithdrawSocket'
            ]),
            cashierSelectedButton(value) {
                this.cashierOpen = value;
            },
            cashierActionButton() {
                if(
                    this.authUser.user.verifiedAt === undefined || 
                    (new Date().getTime() + this.generalTimeDiff) >= new Date(this.authUser.user.verifiedAt).getTime() + ( 1000 * 60 * 30)
                ) {
                    const data = {};
                    this.cashierSendLimitedEnableSocket(data);
                } else if(this.cashierGetRouteName.includes('Deposit') === true) {
                    let items = [];

                    for(let item of this.cashierLimitedData.selected) { items.push({ uniqueId: item.uniqueId }); }

                    const data = { items: items };
                    this.cashierSendLimitedDepositSocket(data);
                } else {
                    const data = { transactionId: this.cashierLimitedData.selected[0]._id };
                    this.cashierSendLimitedWithdrawSocket(data);
                }
            }
        },
        computed: {
            ...mapGetters([
                'generalTimeDiff',
                'socketSendLoading',
                'authUser',
                'cashierLimitedData'
            ]),
            cashierGetRouteName() {
                return this.$route.name;
            },
            cashierGetSelected() {
                let selected = this.cashierLimitedData.selected;

                selected.sort((a, b) => { return b.amount - a.amount; });

                return selected;
            }
        }
    }
</script>

<style scoped>
    .cashier-limited-selected {
        width: 280px;
    }

    .cashier-limited-selected button.button-open {
        width: 50px;
        height: 50px;
        position: absolute;
        display: none;
        bottom: 50px;
        left: -65px;
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
    }

    .cashier-limited-selected button.button-open .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 75%);
        clip-path: polygon(25% 0, 75% 0, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0 75%, 0 25%);
    }

    .cashier-limited-selected button.button-open .button-inner svg {
        width: 19px;
        height: 19px;
        margin-top: 3px;
        fill: #ffffff;
    }

    .cashier-limited-selected button.button-close {
        position: absolute;
        display: none;
        top: 3px;
        left: 10px;
        z-index: 1;
    }

    .cashier-limited-selected button.button-close svg {
        fill: #6e95b6;
    }

    .cashier-limited-selected .selected-header {
        width: 100%;
        height: 77px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: 20px;
        font-size: 14px;
        font-weight: 800;
        color: #6e95b6;
    }

    .cashier-limited-selected .selected-header:after {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        bottom: 0;
        left: 0;
        background: linear-gradient(270deg, rgba(24, 72, 109, 0.00) 0%, rgba(24, 72, 109, 0.18) 50%, rgba(24, 72, 109, 0.00) 100%);
    }

    .cashier-limited-selected .selected-content {
        width: 100%;
        height: 630px;
        margin-top: 25px;
        padding: 20px 0 25px 0;
        border-radius: 15px;
        background: rgba(24, 72, 109, 0.12);
        border: 1px solid rgba(11, 51, 84, 0.5);
    }

    .cashier-limited-selected .content-list {
        width: 100%;
        height: calc(100% - 71px);
        padding: 0 15px;
        overflow: scroll;
    }

    .cashier-limited-selected .content-button {
        width: 100%;
        position: relative;
        margin-top: 5px;
        padding: 25px 25px 0 25px;
    }

    .cashier-limited-selected .content-button:before {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(270deg, rgba(24, 72, 109, 0) 0%, rgba(24, 72, 109, 0.18) 50%, rgba(24, 72, 109, 0) 100%);
    }

    .cashier-limited-selected button.button-action {
        width: 100%;
        height: 41px;
    }

    .cashier-limited-selected button.button-action .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .cashier-limited-selected button.button-action .button-loading.fade-leave-active {
        transition: opacity 0.1s;
    }

    .cashier-limited-selected button.button-action .button-loading.fade-leave-to {
        opacity: 0;
    }

    .cashier-limited-selected button.button-action .inner-content {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .cashier-limited-selected button.button-action .inner-content.fade-enter-active {
        transition: opacity 0.1s;
    }

    .cashier-limited-selected button.button-action .inner-content.fade-enter {
        opacity: 0;
    }

    @media only screen and (max-width: 1100px) {

        .cashier-limited-selected {
            position: fixed;
            top: 80px;
            bottom: 0;
            right: 0;
            transform: translateX(280px);
            background: #07233a;
            transition: transform 0.3s ease;
            z-index: 10;
        }

        .cashier-limited-selected button.button-open {
            display: block;
        }

        .cashier-limited-selected.selected-open button.button-open {
            display: none;
        }

        .cashier-limited-selected button.button-close {
            display: block;
        }

        .cashier-limited-selected.selected-open {
            transform: translateX(0);
        }

        .cashier-limited-selected .selected-header {
            height: 60px;
        }

        .cashier-limited-selected .selected-content {
            height: calc(100% - 60px);
            margin-top: 0;
            background: none;
            border: none;
        }

    }
</style>