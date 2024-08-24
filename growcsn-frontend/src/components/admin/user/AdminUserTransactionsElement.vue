<template>
    <div class="admin-user-transactions-element">
        <div class="element-section section-date">
            <div class="section-title">DATE</div>
            <div class="section-content">
                {{ new Date(transaction.createdAt).toLocaleString('en-US', { hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit' }) }}
            </div>
        </div>
        <div class="element-section section-method">
            <div class="section-title">METHOD</div>
            <div class="section-content">
                {{adminGetMethod}}
                <button v-on:click="adminInfoButton()" class="button-info">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="element-section section-type" v-bind:class="['type-' + transaction.state]">
            <div class="section-title">TYPE</div>
            <div class="section-content">
                {{adminGetType}}
                <span>({{ transaction.state }})</span>
            </div>
        </div>
        <div class="element-section section-amount">
            <div class="section-title">AMOUNT</div>
            <div class="section-content">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="content-value" v-bind:class="{ 'value-positive': adminGetAmount > 0 }">
                    <span>{{adminFormatValue(adminGetAmount).split('.')[0]}}</span>.{{adminFormatValue(adminGetAmount).split('.')[1]}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'AdminUserTransactionsElement',
        props: [
            'transaction'
        ],
        methods: {
            adminFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            adminInfoButton() {
                alert(JSON.stringify(this.transaction));
            }
        },
        computed: {
            ...mapGetters([
                'modalsData'
            ]),
            adminGetMethod() {
                let method = this.transaction.method.charAt(0).toUpperCase() + this.transaction.method.slice(1);

                if(this.transaction.method === 'tip') { method = this.modalsData.user._id === this.transaction.sender.user._id ? 'Tip Sent' : 'Tip Received'; }
                else if(this.transaction.type === 'affiliateCodeClaim') { method = 'Affiliate Code'; }
                else if(this.transaction.type === 'affiliateEarningClaim') { method = 'Affiliate Earnings'; }
                else if(this.transaction.type === 'promoCodeClaim') { method = 'Promo Code'; }
                else if(this.transaction.type === 'rakebackClaim') { method = 'Rakeback Earnings'; }
                else if(this.transaction.type === 'rainCreate') { method = 'Rain Host'; }
                else if(this.transaction.type === 'rainTip') { method = 'Rain Tip'; }
                else if(this.transaction.type === 'rainPayout') { method = 'Rain Payout'; }
                else if(this.transaction.type === 'adminAdjust') { method = 'Admin Adjustment'; }

                return method;
            },
            adminGetType() {
                let type = null;

                if(this.transaction.method === 'robux' || this.transaction.method === 'limited') { type = this.modalsData.user._id === this.transaction.deposit.user ? 'Deposit' : 'Withdraw'; }
                else if(this.transaction.method === 'balance' || this.transaction.method === 'tip') { type = 'Currency'; }
                else { type = this.transaction.type.charAt(0).toUpperCase() + this.transaction.type.slice(1); }

                return type;
            },
            adminGetAmount() {
                let amount = this.transaction.amount;

                if(this.transaction.method === 'tip' && this.modalsData.user._id === this.transaction.sender.user) { amount = -this.transaction.amount; }

                return amount;
            }
        }
    }
</script>

<style scoped>
    .admin-user-transactions-element {
        width: 100%;
        height: 47px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
    }

    .admin-user-transactions-element:nth-child(odd) {
        background-color: rgba(19, 66, 88, 0.25);
    }

    .admin-user-transactions-element .element-section {
        display: flex;
        flex-direction: column;
    }

    .admin-user-transactions-element .element-section.section-date {
        width: 30%;
    }

    .admin-user-transactions-element .element-section.section-method {
        width: 30%;
    }

    .admin-user-transactions-element .element-section.section-type {
        width: 20%;
    }

    .admin-user-transactions-element .element-section.section-amount {
        width: 20%;
    }

    .admin-user-transactions-element .section-title {
        display: none;
        font-size: 13px;
        font-weight: 600;
        color: #8bacc8;
    }

    .admin-user-transactions-element .section-content {
        display: flex;
        align-items: center;
    }

    .admin-user-transactions-element .element-section.section-date .section-content,
    .admin-user-transactions-element .element-section.section-method .section-content,
    .admin-user-transactions-element .element-section.section-type .section-content {
        font-size: 14px;
        font-weight: 400;
        color: #bbbfd0;
    }

    .admin-user-transactions-element .element-section.section-method button.button-info {
        margin-left: 6px;
    }

    .admin-user-transactions-element .element-section.section-method button.button-info svg {
        fill: #bbbfd0;
        transition: fill 0.3s ease;
    }

    .admin-user-transactions-element .element-section.section-method button.button-info:hover svg {
        fill: #ffffff;
    }

    .admin-user-transactions-element .element-section.section-type .section-content span {
        font-size: 9px;
    }

    .admin-user-transactions-element .element-section.section-type.type-sent .section-content span {
        color: #ffb703;
    }

    .admin-user-transactions-element .element-section.section-type.type-canceled .section-content span {
        color: #ff4545;
    }

    .admin-user-transactions-element .element-section.section-type.type-completed .section-content span {
        color: #00aa6d ;
    }

    .admin-user-transactions-element .element-section.section-amount .section-content {
        justify-content: flex-end;
    }

    .admin-user-transactions-element .element-section.section-amount .section-content img {
        width: 18px;
        height: 18px;
        margin-right: 10px;
    }

    .admin-user-transactions-element .element-section.section-amount .content-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .admin-user-transactions-element .element-section.section-amount .content-value span {
        font-size: 14px;
        font-weight: 800;
    }

    .admin-user-transactions-element .element-section.section-amount .content-value.value-positive span {
        color: #ffffff;
    }

    @media only screen and (max-width: 725px) {

        .admin-user-transactions-element {
            height: auto;
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 20px;
        }

        .admin-user-transactions-element .element-section {
            width: 100%!important;
            margin-top: 10px;
        }

        .admin-user-transactions-element .element-section.section-date {
            margin-top: 0;
        }

        .admin-user-transactions-element .element-section.section-amount {
            align-items: flex-start;
        }

        .admin-user-transactions-element .section-title {
            display: block;
        }

        .admin-user-transactions-element .section-content {
            margin-top: 5px;
        }

    }
</style>
