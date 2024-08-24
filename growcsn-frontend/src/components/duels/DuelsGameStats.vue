<template>
    <div class="duels-game-stats">
        <div class="stats-buy">
            BUY IN
            <div class="buy-amount">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="amount-value">
                    <span>{{duelsFormatValue(duelsGame.amount).split('.')[0]}}</span>.{{duelsFormatValue(duelsGame.amount).split('.')[1]}}
                </div>
            </div>
        </div>
        <div class="stats-winnings">
            <span class="gradient-green">POTENTIAL WINNINGS</span>
            <div class="winnings-amount">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="amount-value">
                    <span>{{duelsFormatValue(Math.floor(duelsGame.amount * duelsGame.playerCount * 0.95)).split('.')[0]}}</span>.{{duelsFormatValue(Math.floor(duelsGame.amount * duelsGame.playerCount * 0.95)).split('.')[1]}}
                </div>
            </div>
        </div>
        <div class="stats-players">
            <IconUserGradient />
            <div class="players-amount">
                PLAYERS:
                <div class="amount-value">
                    <span>{{duelsGame.playerCount}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import IconUserGradient from '@/components/icons/IconUserGradient';

    export default {
        name: 'DuelsGameStats',
        props: [
            'duelsGame'
        ],
        components: {
            IconUserGradient,
        },
        methods: {
            duelsFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        }
    }
</script>

<style scoped>
    .duels-game-stats {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 35px;
    }

    .duels-game-stats .stats-buy,
    .duels-game-stats .stats-winnings,
    .duels-game-stats .stats-players {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: #5e768e;
    }

    .duels-game-stats .stats-winnings {
        font-weight: 700;
    }

    .duels-game-stats .stats-buy,
    .duels-game-stats .stats-winnings {
        position: relative;
        margin-right: 15px;
        padding-right: 15px;
    }

    .duels-game-stats .stats-buy::after,
    .duels-game-stats .stats-winnings::after {
        content: '';
        width: 1px;
        height: 24px;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(0, -50%);
        background-color: #144468;
    }

    .duels-game-stats .buy-amount,
    .duels-game-stats .winnings-amount,
    .duels-game-stats .players-amount {
        display: flex;
        align-items: center;
        margin-left: 12px;
    }

    .duels-game-stats .buy-amount img,
    .duels-game-stats .winnings-amount img {
        width: 20px;
        height: 20px;
    }

    .duels-game-stats .stats-players svg {
        width: 17px;
        height: 19px;
    }

    .duels-game-stats .amount-value {
        margin-left: 8px;
        font-size: 10px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .duels-game-stats .amount-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 700px) {

        .duels-game-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }

        .duels-game-stats .stats-buy {
            display: flex;
            justify-content: flex-end;
            grid-column: 1 / 1;
        }

        .duels-game-stats .stats-players {
            grid-column: 2 / 2;
        }

        .duels-game-stats .stats-winnings {
            width: 100%;
            display: flex;
            justify-content: center;
            grid-column: 1 / 3;
            grid-row: 2 / 2;
            margin-top: 20px;
        }

        .duels-game-stats .stats-winnings::after {
            display: none;
        }

    }
</style>
