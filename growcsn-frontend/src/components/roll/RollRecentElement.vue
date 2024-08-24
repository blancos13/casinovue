<template>
    <button class="roll-recent-element">
        <div class="element-amount">
            <img src="@/assets/img/icons/coin.svg" alt="icon" />
            <div class="amount-value">
                <span>{{rollFormatValue(bet.amount).split('.')[0]}}</span>.{{rollFormatValue(bet.amount).split('.')[1]}}
            </div>
        </div>
        {{parseFloat(bet.multiplier / 100).toFixed(2)}}x
    </button>
</template>

<script>
    export default {
        name: 'RollRecentElement',
        props: ['bet'],
        methods: {
            rollFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString();
            }
        }
    }
</script>

<style scoped>
    button.roll-recent-element {
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 7px;
        padding: 0 15px;
        border-radius: 5px;
        font-size: 12px;
        font-weight: 700;
        color: #7a93ac;
        background: rgba(14, 49, 75, 0.4);
        border: 1px solid rgba(20, 68, 104, 0.35);
        transition: transform 0.3s ease;
    }

    button.roll-recent-element:last-of-type {
        margin-right: 0;
    }

    button.roll-recent-element:hover {
        transform: scale(1.02);
    }

    button.roll-recent-element .element-amount {
        display: flex;
        align-items: center;
    }

    button.roll-recent-element .element-amount img {
        width: 14px;
        height: 14px;
        margin-right: 6px;
    }

    button.roll-recent-element .amount-value {
        margin-right: 5px;
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    button.roll-recent-element .amount-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 750px) {

        button.roll-recent-element {
            width: calc(33.33% - 4.66px);
            margin-top: 7px;
            margin-right: 7px;
        }

        button.roll-recent-element:nth-child(1),
        button.roll-recent-element:nth-child(2),
        button.roll-recent-element:nth-child(3) {
            margin-top: 0;
        }

        .roll-recent-element:nth-child(3n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 650px) {

        button.roll-recent-element {
            width: calc(50% - 3.5px);
            margin-right: 7px;
        }

        button.roll-recent-element:nth-child(3) {
            margin-top: 7px;
        }

        button.roll-recent-element:nth-child(3n) {
            margin-right: 7px;
        }

        button.roll-recent-element:nth-child(2n) {
            margin-right: 0;
        }

    }
</style>
