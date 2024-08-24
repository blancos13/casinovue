<template>
    <div class="cashier-withdraw">
        <div class="withdraw-section">
            <div class="section-title">Growtopia</div>

            <CashierElement v-on:click.native="modalRobuxButton()" type="roblox" method="robux" v-bind:enabled="generalSettings.robux.withdraw.enabled" />
            <CashierElement v-on:click.native="modalLimitedsButton()" type="roblox" method="limiteds" v-bind:enabled="generalSettings.limited.withdraw.enabled" />

        </div>
        <div class="withdraw-section">
            <div class="section-title">Crypto & Fiat</div>

            <CashierElement v-on:click.native="modalGiftButton()" type="fiat" method="gift" v-bind:enabled="generalSettings.gift.withdraw.enabled" />
            <CashierElement v-on:click.native="modalCryptoButton('btc')" type="crypto" method="btc" v-bind:enabled="generalSettings.crypto.withdraw.enabled" />
            <CashierElement v-on:click.native="modalCryptoButton('eth')" type="crypto" method="eth" v-bind:enabled="generalSettings.crypto.withdraw.enabled" />
            <CashierElement v-on:click.native="modalCryptoButton('ltc')" type="crypto" method="ltc" v-bind:enabled="generalSettings.crypto.withdraw.enabled" />

        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import CashierElement from '@/components/cashier/CashierElement';

    export default {
        name: 'CashierWithdraw',
        components: {
            CashierElement
        },
        methods: {
            ...mapActions([
                'modalsSetShow', 
                'modalsSetData'
            ]),
            modalRobuxButton() {
                this.modalsSetShow(null);
                this.modalsSetData({ typeCashier: 'withdraw' });

                setTimeout(() => { this.modalsSetShow('Robux'); }, 200);
            },
            modalLimitedsButton() {
                this.modalsSetShow(null);
                this.modalsSetData({ typeCashier: 'withdraw' });

                this.$router.push({ name: 'LimitedsWithdraw' });
            },
            modalGiftButton() {
                this.modalsSetShow(null);
                this.modalsSetData({ typeCashier: 'withdraw' });

                setTimeout(() => { this.modalsSetShow('Gift'); }, 200);
            },
            modalCryptoButton(currency) {
                this.modalsSetShow(null);
                this.modalsSetData({ typeCashier: 'withdraw', currency: currency });

                setTimeout(() => { this.modalsSetShow('Crypto'); }, 200);
            }
        },
        computed: {
            ...mapGetters([
                'generalSettings'
            ])
        }
    }
</script>

<style scoped>
    .cashier-withdraw {
        width: 100%;
    }

    .cashier-withdraw .withdraw-section {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-top: 25px;
    }

    .cashier-withdraw .withdraw-section:last-child {
        padding-bottom: 0;
        border-bottom: none;
    }

    .cashier-withdraw .section-title {
        width: 100%;
        font-size: 14px;
        font-weight: 700;
        color: #5191b1;
    }

    @media only screen and (max-width: 800px) {

        .cashier-withdraw .section-content {
            justify-content: flex-start;
        }

    }
</style>
