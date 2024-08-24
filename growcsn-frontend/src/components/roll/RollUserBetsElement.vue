<template>
    <div class="roll-user-bets-element">
        <div class="element-info">
            <div class="info-bet">
                BET:
                <div class="bet-box">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="box-value">
                        <span>{{rollFormatValue(bet.amount).split('.')[0]}}</span>.{{rollFormatValue(bet.amount).split('.')[1]}}
                    </div>
                    {{parseFloat(bet.multiplier / 100).toFixed(2)}}x
                </div>
            </div>
            <div class="info-payout">
                PAYOUT:
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="payout-value">
                    <span>{{rollFormatValue(Math.floor(bet.amount * (bet.multiplier / 100))).split('.')[0]}}</span>.{{rollFormatValue(Math.floor(bet.amount * (bet.multiplier / 100))).split('.')[1]}}
                </div>
            </div>
        </div>
        <div class="element-percentage">
            <div class="percentage-text">{{parseFloat(9500 / bet.multiplier).toFixed(2)}}%</div>
            <div class="percentage-progress" v-bind:style="{ 'height': (9500 / bet.multiplier) + '%' }"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'RollUserBetsElement',
        props: ['bet'],
        methods: {
            rollFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        }
    }
</script>

<style scoped>
    .roll-user-bets-element {
        width: calc(25% - 7.5px);
        height: 125px;
        display: flex;
        margin-top: 10px;
        margin-right: 10px;
        border-radius: 15px;
        background: radial-gradient(285% 150% at 50% 50%, #001c33 0%, #000e1a 100%);
        box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.15);
    }

    .roll-user-bets-element:nth-child(1),
    .roll-user-bets-element:nth-child(2),
    .roll-user-bets-element:nth-child(3),
    .roll-user-bets-element:nth-child(4) {
        margin-top: 0;
    }

    .roll-user-bets-element:nth-child(4n) {
        margin-right: 0;
    }

    .roll-user-bets-element .element-info {
        width: calc(100% - 60px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px 0 18px 15px;
    }

    .roll-user-bets-element .info-bet,
    .roll-user-bets-element .info-payout {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: #5e768e;
    }

    .roll-user-bets-element .bet-box {
        height: 48px;
        display: flex;
        align-items: center;
        margin-left: 15px;
        padding: 0 15px;
        border-radius: 5px;
        font-size: 12px;
        font-weight: 700;
        color: #7a93ac;
        background: rgba(14, 49, 75, 0.4);
        border: 1px solid rgba(20, 68, 104, 0.35);
    }

    .roll-user-bets-element .bet-box img,
    .roll-user-bets-element .info-payout img {
        width: 14px;
        height: 14px;
        margin-right: 5px;
    }

    .roll-user-bets-element .info-payout img {
        margin: 0 5px 0 15px;
    }

    .roll-user-bets-element .box-value,
    .roll-user-bets-element .payout-value  {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .roll-user-bets-element .box-value  {
        margin-right: 5px;
    }

    .roll-user-bets-element .box-value span,
    .roll-user-bets-element .payout-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .roll-user-bets-element .element-percentage {
        width: 60px;
        height: 100%;
        position: relative;
        display: flex;
        align-items: flex-end;
        border-radius: 15px;
        background: #001424;
        overflow: hidden;
    }

    .roll-user-bets-element .percentage-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 11px;
        font-weight: 700;
        color: #ffffff;
    }

    .roll-user-bets-element .percentage-progress {
        width: 100%;
        background: linear-gradient(0deg, #008149, #008149), #001424;
    }

    @media only screen and (max-width: 1800px) {

        .roll-user-bets-element {
            width: calc(33.33% - 6.66px);
        }

        .roll-user-bets-element:nth-child(4) {
            margin-top: 10px;
        }

        .roll-user-bets-element:nth-child(4n) {
            margin-right: 10px;
        }

        .roll-user-bets-element:nth-child(3n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 900px) {

        .roll-user-bets-element {
            width: calc(50% - 5px);
        }

        .roll-user-bets-element:nth-child(3) {
            margin-top: 10px;
        }

        .roll-user-bets-element:nth-child(3n) {
            margin-right: 10px;
        }

        .roll-user-bets-element:nth-child(2n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 600px) {

        .roll-user-bets-element {
            width: 100%;
            margin-right: 0!important;
        }

        .roll-user-bets-element:nth-child(2) {
            margin-top: 10px;
        }

    }
</style>
