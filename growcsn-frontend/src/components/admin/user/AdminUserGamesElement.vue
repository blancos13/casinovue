<template>
    <div class="admin-user-games-element">
        <div class="element-section section-date">
            <div class="section-title">DATE</div>
            <div class="section-content">
                {{ new Date(game.createdAt).toLocaleString('en-US', { hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit' }) }}
            </div>
        </div>
        <div class="element-section section-game">
            <div class="section-title">GAME</div>
            <div class="section-content">
                {{game.method.charAt(0).toUpperCase() + game.method.slice(1)}}
            </div>
        </div>
        <div class="element-section section-id">
            <div class="section-title">GAME ID</div>
            <div class="section-content">
                {{game._id}}
            </div>
        </div>
        <div class="element-section section-amount">
            <div class="section-title">AMOUNT</div>
            <div class="section-content">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="content-value" v-bind:class="{ 'value-positive': (game.payout - adminGetAmount) >= 0 }">
                    <span>{{adminFormatValue(game.payout - adminGetAmount).split('.')[0]}}</span>.{{adminFormatValue(game.payout - adminGetAmount).split('.')[1]}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AdminUserGamesElement',
        props: [
            'game'
        ],
        methods: {
            adminFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        },
        computed: {
            adminGetAmount() {
                let amount = this.game.amount;

                if(this.game.method === 'blackjack') {
                    amount = Math.floor(this.game.amount.main + this.game.amount.sideLeft + this.game.amount.sideRight);
                    if(this.game.actions.includes('split') === true) { amount = Math.floor(amount + this.game.amount.main); }
                }

                return amount;
            }
        }
    }
</script>

<style scoped>
    .admin-user-games-element {
        width: 100%;
        height: 47px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
    }

    .admin-user-games-element:nth-child(odd) {
        background-color: rgba(19, 66, 88, 0.25);
    }

    .admin-user-games-element .element-section {
        display: flex;
        flex-direction: column;
    }

    .admin-user-games-element .element-section.section-date {
        width: 30%;
    }

    .admin-user-games-element .element-section.section-game {
        width: 14%;
    }

    .admin-user-games-element .element-section.section-id {
        width: 37%;
    }

    .admin-user-games-element .element-section.section-amount {
        width: 19%;
    }

    .admin-user-games-element .section-title {
        display: none;
        font-size: 13px;
        font-weight: 600;
        color: #8bacc8;
    }

    .admin-user-games-element .section-content {
        display: flex;
        align-items: center;
    }

    .admin-user-games-element .element-section.section-date .section-content,
    .admin-user-games-element .element-section.section-game .section-content,
    .admin-user-games-element .element-section.section-id .section-content {
        font-size: 14px;
        font-weight: 400;
        color: #bbbfd0;
    }

    .admin-user-games-element .element-section.section-amount .section-content {
        justify-content: flex-end;
    }

    .admin-user-games-element .element-section.section-amount .section-content img {
        width: 18px;
        height: 18px;
        margin-right: 10px;
    }

    .admin-user-games-element .element-section.section-amount .content-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .admin-user-games-element .element-section.section-amount .content-value span {
        font-size: 14px;
        font-weight: 800;
    }

    .admin-user-games-element .element-section.section-amount .content-value.value-positive span {
        color: #ffffff;
    }

    @media only screen and (max-width: 725px) {

        .admin-user-games-element {
            height: auto;
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 20px;
        }

        .admin-user-games-element .element-section {
            width: 100%!important;
            margin-top: 10px;
        }

        .admin-user-games-element .element-section.section-date {
            margin-top: 0;
        }

        .admin-user-games-element .element-section.section-amount {
            align-items: flex-start;
        }

        .admin-user-games-element .section-title {
            display: block;
        }

        .admin-user-games-element .section-content {
            margin-top: 5px;
        }

    }
</style>
