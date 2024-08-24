<template>
    <div class="profile-games-element">
        <div class="element-date">
            <div class="date-title">DATE</div>
            <div class="date-content">
                {{ new Date(bet.createdAt).toLocaleString('en-US', { hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit' }) }}
            </div>
        </div>
        <div class="element-game">
            <div class="game-title">GAME</div>
            <div class="game-content">
                {{bet.method.charAt(0).toUpperCase() + bet.method.slice(1)}}
            </div>
        </div>
        <div class="element-verify">
            <div class="verify-title">VERIFY</div>
            <div class="verify-content">
                <button v-on:click="profileVerifyButton()">
                    <div class="button-inner">VERIFY</div>
                </button>
            </div>
        </div>
        <div class="element-amount">
            <div class="amount-title">AMOUNT</div>
            <div class="amount-content">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="content-value" v-bind:class="{ 'value-positive': (bet.payout - profileGetAmount) >= 0 }">
                    <span>{{profileFormatValue(bet.payout - profileGetAmount).split('.')[0]}}</span>.{{profileFormatValue(bet.payout - profileGetAmount).split('.')[1]}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'ProfileGamesElement',
        props: ['bet'],
        methods: {
            ...mapActions([
                'modalsSetData', 
                'modalsSetShow'
            ]),
            profileFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            profileVerifyButton() {
                this.modalsSetData({ game: (['mines', 'mines', 'unbox'].includes(this.bet.method) === true ? this.bet : this.bet.game) });
                this.modalsSetShow('FairGame');
            }
        },
        computed: {
            profileGetAmount() {
                let amount = this.bet.amount;

                if(this.bet.method === 'blackjack') {
                    amount = Math.floor(this.bet.amount.main + this.bet.amount.sideLeft + this.bet.amount.sideRight);
                    if(this.bet.actions.includes('split') === true) { amount = Math.floor(amount + this.bet.amount.main); }
                }

                return amount;
            }
        }
    }
</script>

<style scoped>
    .profile-games-element {
        width: 100%;
        height: 47px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
        background: rgba(19, 66, 88, 0.1);
    }

    .profile-games-element:nth-child(odd) {
        background: rgba(19, 66, 88, 0.25);
    }

    .profile-games-element .element-date {
        width: 35%;
        display: flex;
        flex-direction: column;
    }

    .profile-games-element .element-game {
        width: 25%;
        display: flex;
        flex-direction: column;
    }

    .profile-games-element .element-verify {
        width: 20%;
        display: flex;
        flex-direction: column;
    }

    .profile-games-element .element-amount {
        width: 20%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .profile-games-element .date-title,
    .profile-games-element .game-title,
    .profile-games-element .verify-title,
    .profile-games-element .amount-title {
        display: none;
        font-size: 13px;
        font-weight: 600;
        color: #8bacc8;
    }

    .profile-games-element .date-content {
        font-size: 14px;
        font-weight: 400;
        color: #bbbfd0;
    }

    .profile-games-element .game-content {
        font-size: 14px;
        font-weight: 400;
        color: #bbbfd0;
    }

    .profile-games-element .verify-content button {
        width: 68px;
        height: 29px;
    }

    .profile-games-element .verify-content button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .profile-games-element .amount-content {
        display: flex;
        align-items: center;
    }

    .profile-games-element .amount-content img {
        width: 18px;
        height: 18px;
        margin-right: 10px;
    }

    .profile-games-element .content-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .profile-games-element .content-value span {
        font-size: 14px;
        font-weight: 800;
    }

    .profile-games-element .content-value.value-positive span {
        color: #ffffff;
    }

    @media only screen and (max-width: 725px) {

        .profile-games-element {
            height: auto;
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 20px;
        }

        .profile-games-element .element-date,
        .profile-games-element .element-game,
        .profile-games-element .element-verify,
        .profile-games-element .element-amount {
            width: 100%;
        }

        .profile-games-element .element-game,
        .profile-games-element .element-verify,
        .profile-games-element .element-amount {
            margin-top: 10px;
        }

        .profile-games-element .date-title,
        .profile-games-element .game-title,
        .profile-games-element .verify-title,
        .profile-games-element .amount-title {
            display: block;
        }

        .profile-games-element .date-content,
        .profile-games-element .game-content,
        .profile-games-element .verify-content,
        .profile-games-element .amount-content {
            margin-top: 5px;
        }

        .profile-games-element .element-amount {
            align-items: flex-start;
        }

    }
</style>
