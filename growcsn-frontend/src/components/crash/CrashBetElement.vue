<template>
    <div class="crash-bet-element">
        <div class="element-user">
            <div class="user-avatar">
                <AvatarImage v-bind:image="bet.user.avatar" />
            </div>
            <span v-html="bet.user.username"></span>
        </div>
        <div class="element-info">
            <div v-if="bet.multiplier !== undefined" class="info-multiplier">
                <span class="gradient-green">{{parseFloat(bet.multiplier / 100).toFixed(2)}}x</span>
            </div>
            <div class="info-amount">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="amount-value">
                    <span>{{crashGetAmount.split('.')[0]}}</span>.{{crashGetAmount.split('.')[1]}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AvatarImage from '@/components/AvatarImage';

    export default {
        name: 'CrashBetElement',
        components: {
            AvatarImage
        },
        props: ['bet'],
        computed: {
            crashGetAmount() {
                let amount = parseFloat(Math.floor(this.bet.amount / 10) / 100).toFixed(2).toString();

                if(this.bet.multiplier !== undefined) {
                    amount = '+' + parseFloat(Math.floor((this.bet.amount * (this.bet.multiplier / 100)) / 10) / 100).toFixed(2).toString();
                }

                return amount;
            }
        }
    }
</script>

<style scoped>
    .crash-bet-element {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
    }

    .crash-bet-element:first-of-type {
        margin-top: 0;
    }

    .crash-bet-element .element-user {
        display: flex;
        align-items: center;
        font-size: 13px;
        font-weight: 600;
        color: #ffffff;
    }

    .crash-bet-element .user-avatar {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-right: 8px;
        border-radius: 50%;
        border: 1px solid #9e9e9e;
        overflow: hidden;
    }

    .crash-bet-element .user-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    .crash-bet-element .element-info {
        display: flex;
        align-items: center;
    }

    .crash-bet-element .info-multiplier {
        margin-right: 8px;
        font-size: 12px;
        font-weight: 700;
    }

    .crash-bet-element .info-amount {
        display: flex;
        align-items: center;
    }

    .crash-bet-element .info-amount img {
        width: 12px;
        height: 12px;
        margin-right: 4px;
    }

    .crash-bet-element .amount-value {
        font-size: 8px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .crash-bet-element .amount-value span {
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
    }
</style>
