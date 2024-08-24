<template>
    <div class="profile-transactions-element">
        <div class="element-date">
            <div class="date-title">DATE</div>
            <div class="date-content">
                {{ new Date(transaction.createdAt).toLocaleString('en-US', { hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit' }) }}
            </div>
        </div>
        <div class="element-method">
            <div class="method-title">METHOD</div>
            <div class="method-content">
                {{profileGetMethod}}
            </div>
        </div>
        <div class="element-type">
            <div class="type-title">TYPE</div>
            <div class="type-content">
                {{profileGetType}}
            </div>
        </div>
        <div class="element-amount">
            <div class="amount-title">AMOUNT</div>
            <div class="amount-content">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="content-value" v-bind:class="{ 'value-positive': profileGetAmount > 0 }">
                    <span>{{profileFormatValue(profileGetAmount).split('.')[0]}}</span>.{{profileFormatValue(profileGetAmount).split('.')[1]}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'ProfileTransactionsElement',
        props: [
            'transaction'
        ],
        methods: {
            profileFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        },
        computed: {
            ...mapGetters([
                'authUser'
            ]),
            profileGetMethod() {
                let method = this.transaction.method.charAt(0).toUpperCase() + this.transaction.method.slice(1);

                if(this.transaction.method === 'tip') { method = this.authUser.user._id === this.transaction.sender.user ? 'Tip Sent' : 'Tip Received'; }
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
            profileGetType() {
                let type = null;

                if(this.transaction.method === 'robux' || this.transaction.method === 'limited') { type = this.authUser.user._id === this.transaction.deposit.user ? 'Deposit' : 'Withdraw'; } 
                else if(this.transaction.method === 'balance' || this.transaction.method === 'tip') { type = 'Currency'; } 
                else { type = this.transaction.type.charAt(0).toUpperCase() + this.transaction.type.slice(1) }

                return type;
            },
            profileGetAmount() {
                let amount = this.transaction.amount;

                if(this.transaction.method === 'tip' && this.authUser.user._id === this.transaction.sender.user) { amount = -this.transaction.amount; }

                return amount;
            }
        }
    }
</script>

<style scoped>
    .profile-transactions-element {
        width: 100%;
        height: 47px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
        background: rgba(19, 66, 88, 0.1);
    }

    .profile-transactions-element:nth-child(odd) {
        background-color: rgba(19, 66, 88, 0.25);
    }

    .profile-transactions-element .element-date {
        width: 30%;
        display: flex;
        flex-direction: column;
    }

    .profile-transactions-element .element-method {
        width: 30%;
        display: flex;
        flex-direction: column;
    }

    .profile-transactions-element .element-type {
        width: 20%;
        display: flex;
        flex-direction: column;
    }

    .profile-transactions-element .element-amount {
        width: 20%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .profile-transactions-element .date-title,
    .profile-transactions-element .method-title,
    .profile-transactions-element .type-title,
    .profile-transactions-element .amount-title {
        display: none;
        font-size: 13px;
        font-weight: 600;
        color: #8bacc8;
    }

    .profile-transactions-element .date-content,
    .profile-transactions-element .method-content,
    .profile-transactions-element .type-content {
        font-size: 14px;
        font-weight: 400;
        color: #bbbfd0;
    }

    .profile-transactions-element .amount-content {
        display: flex;
        align-items: center;
    }

    .profile-transactions-element .amount-content img {
        width: 18px;
        height: 18px;
        margin-right: 10px;
    }

    .profile-transactions-element .content-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .profile-transactions-element .content-value span {
        font-size: 14px;
        font-weight: 800;
    }

    .profile-transactions-element .content-value.value-positive span {
        color: #ffffff;
    }

    @media only screen and (max-width: 725px) {

        .profile-transactions-element {
            height: auto;
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 20px;
        }

        .profile-transactions-element .element-date,
        .profile-transactions-element .element-method,
        .profile-transactions-element .element-type,
        .profile-transactions-element .element-amount {
            width: 100%;
        }

        .profile-transactions-element .element-method,
        .profile-transactions-element .element-type,
        .profile-transactions-element .element-amount {
            margin-top: 10px;
        }

        .profile-transactions-element .date-title,
        .profile-transactions-element .method-title,
        .profile-transactions-element .type-title,
        .profile-transactions-element .amount-title {
            display: block;
        }

        .profile-transactions-element .date-content,
        .profile-transactions-element .method-content,
        .profile-transactions-element .type-content,
        .profile-transactions-element .amount-content {
            margin-top: 5px;
        }

        .profile-transactions-element .element-amount {
            align-items: flex-start;
        }

    }
</style>
