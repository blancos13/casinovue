<template>
    <div class="modal-gift">
        <button v-on:click="modalBackButton" class="button-back">
            <div class="button-inner">BACK</div>
        </button>
        <div class="gift-title">
            <span class="gradient-green">{{ modalsData.typeCashier === 'deposit' ? 'PURCHASE & REDEEM GIFT CARDS' : 'WITHDRAW GIFT CARDS' }}</span>
        </div>
        
        <GiftDeposit v-if="modalsData.typeCashier === 'deposit'" />
        <GiftWithdraw v-else />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import GiftDeposit from '@/components/gift/GiftDeposit';
    import GiftWithdraw from '@/components/gift/GiftWithdraw';

    export default {
        name: 'ModalGift',
        components: {
            GiftDeposit,
            GiftWithdraw
        },
        methods: {
            ...mapActions([ 
                'modalsSetShow', 
                'modalsSetData'
            ]),
            modalBackButton() {
                this.modalsSetShow(null);

                setTimeout(() => { this.modalsSetShow('Cashier'); }, 200);
            }
        },
        computed: {
            ...mapGetters([ 
                'modalsData'
            ])
        }
    }
</script>

<style scoped>
    .modal-gift {
        width: 900px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 30px 35px 30px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% -30%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(255deg, #07263d 0%, #07243a 100%);
    }

    .modal-gift button.button-back {
        height: 33px;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 15px;
        left: 20px;
        filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1));
        z-index: 1;
    }

    .modal-gift button.button-back .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 12px;
        font-size: 14px;
        font-weight: 800;
        color: #75adc2;
        background-color: #1a4f63;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
        transition: color 0.3s ease;
    }

    .modal-gift button.button-back:hover .button-inner {
        color: #ffffff;
    }

    .modal-gift .gift-title {
        text-align: center;
        text-transform: uppercase;
        font-size: 32px;
        font-weight: 900;
    }

    @media only screen and (max-width: 920px) {

        .modal-gift {
            width: calc(100vw - 20px);
            padding: 65px 10px 35px 10px;
        }

    }

    @media only screen and (max-width: 500px) {

        .modal-gift .gift-input {
            height: auto;
        }

        .modal-gift .gift-input button {
            width: 100%;
            position: static;
            margin-top: 10px;
            transform: translate(0, 0);
        }

    }
</style>
