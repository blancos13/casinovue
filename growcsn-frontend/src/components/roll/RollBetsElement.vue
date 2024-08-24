<template>
    <div class="roll-bets-element">
        <div class="element-user">
            <div class="user-avatar">
                <AvatarImage v-bind:image="bet.user.avatar" />
            </div>
            <span v-html="bet.user.username"></span>
        </div>
        <div class="element-info">
            {{parseFloat(bet.multiplier / 100).toFixed(2)}}x
            <img src="@/assets/img/icons/coin.svg" alt="icon" />
            <div class="amount-value">
                <span>{{rollFormatValue(bet.amount).split('.')[0]}}</span>.{{rollFormatValue(bet.amount).split('.')[1]}}
            </div>
        </div>
    </div>
</template>

<script>
    import AvatarImage from '@/components/AvatarImage';

    export default {
        name: 'RollBetsElement',
        components: {
            AvatarImage
        },
        props: ['bet'],
        methods: {
            rollFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString();
            }
        }
    }
</script>

<style scoped>
    .roll-bets-element {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 5px;
        padding: 0 10px;
        border-radius: 5px;
        background-color: rgba(19, 66, 88, 0.25);
        border: 1px solid rgba(20, 68, 104, 0.35);
    }

    .roll-bets-element:first-of-type {
        margin-top: 0;
    }

    .bets-highest .roll-bets-element {
        background-color: rgba(19, 66, 88, 0.5);
        border: 1px solid rgba(19, 66, 88, 0.5);
    }

    .roll-bets-element .element-user {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .bets-highest .roll-bets-element .element-user {
        font-size: 14px;
        color: #ffffff;
    }

    .roll-bets-element .user-avatar {
        width: 22px;
        height: 22px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-right: 8px;
        border-radius: 50%;
        border: 1px solid #9e9e9e;
        overflow: hidden;
    }

    .roll-bets-element .user-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    .roll-bets-element .element-info {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: #7a93ac;
    }

    .roll-bets-element .element-info img {
        width: 12px;
        height: 12px;
        margin: 0 6px;
    }

    .roll-bets-element .amount-value {
        font-size: 8px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .roll-bets-element .amount-value span {
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
    }
</style>
