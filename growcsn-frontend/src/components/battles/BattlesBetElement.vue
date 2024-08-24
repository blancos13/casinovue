<template>
    <div class="battles-bet-element" v-bind:class="{ 
        'element-winner': battlesGameData.game.state === 'completed' && bet.payout > 0, 
        'element-lost': battlesGameData.game.state === 'completed' && bet.payout <= 0 
    }">
        <div class="element-top">
            <div class="top-inner">

                <div v-if="bet !== null" class="inner-info">
                    <div class="info-user" v-bind:class="[
                        'user-' + (bet.bot === true ? 'bot' : battlesGetRank(bet.user)),
                        'user-' + battlesGetLevelColor(bet.user)
                    ]">
                        <div class="user-avatar">
                            <AvatarImage v-bind:image="bet.bot ? null : bet.user.avatar" />
                        </div>
                        <span v-html="bet.bot === true ? battlesGetBotName : bet.user.username"></span>
                    </div>
                    <div class="info-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="amount-value">
                            <span>{{ battlesFormatValue(battlesGetOutcomeAmount).split('.')[0] }}</span>.{{ battlesFormatValue(battlesGetOutcomeAmount).split('.')[1] }}
                        </div>
                    </div>
                </div>
                <div v-else class="inner-actions">
                    <div v-if="battlesGameData.game.options.funding > 0" class="actions-funding">
                        <div class="funding-inner">
                            <span>-{{ battlesGameData.game.options.funding }}%</span>
                        </div>
                    </div>

                    <button v-on:click="authUser.user !== null && authUser.user._id === battlesGameData.game.bets[0].user._id ? battlesBotButton() : battlesJoinButton()" class="button-join" v-bind:disabled="socketSendLoading !== null">
                        <div class="button-inner">
                            <transition name="fade" mode="out-in">
                                <ButtonLoading v-if="socketSendLoading === 'BattlesJoin' || socketSendLoading === 'BattlesCall'" />
                                <div v-else class="inner-content">
                                    <div v-if="authUser.user !== null && authUser.user._id === battlesGameData.game.bets[0].user._id" class="content-bot">
                                        <img src="https://cdn.discordapp.com/attachments/1121562847294533732/1206030406122475530/Group_450.png?ex=65da8657&is=65c81157&hm=961997a76c957771f364dafe71e397946a3022a507ff466ef6d548feab249163&" />
                                    </div>
                                    <svg v-else width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.47861 8.33238L6.15342 11.0087L5.08395 12.0789L6.15493 13.1499L5.08471 14.2201L3.21144 12.3469L1.07023 14.4881L0 13.4178L2.14121 11.2759L0.267935 9.40336L1.33816 8.33313L2.40839 9.4026L3.47861 8.33238ZM0.413256 0.456299L3.09715 0.458569L12.0412 9.40336L13.1122 8.33313L14.1824 9.40336L12.3099 11.2766L14.4503 13.4178L13.3801 14.4881L11.2389 12.3469L9.36561 14.2201L8.29539 13.1499L9.36561 12.0789L0.415526 3.12884L0.413256 0.456299ZM11.3554 0.456299L14.0371 0.458569L14.0386 3.12505L10.971 6.19192L8.29463 3.51636L11.3554 0.456299Z" />
                                    </svg>

                                    {{ authUser.user !== null && authUser.user._id === battlesGameData.game.bets[0].user._id ? 'CALL BOT' : 'JOIN BATTLE' }}
                                </div>
                            </transition>
                        </div>
                    </button>
                </div>
            </div>
        </div>
        <div class="element-items">
            <div class="items-list">

                <BattlesItemElement v-for="(item, index) in battlesGetOutcomeItems" v-bind:key="index" v-bind:item="item" />
                
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AvatarImage from '@/components/AvatarImage';
    import ButtonLoading from '@/components/ButtonLoading';
    import BattlesItemElement from '@/components/battles/BattlesItemElement';

    export default {
        name: 'BattlesBetElement',
        components: {
            AvatarImage,
            ButtonLoading,
            BattlesItemElement
        },
        props: [
            'pos', 
            'bet'
        ],
        methods: {
            ...mapActions([
                'notificationShow',
                'battlesSendBotSocket',
                'battlesSendJoinSocket'
            ]),
            battlesFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            battlesGetRank(user) {
                let rank = user.rakeback;

                if(user.rank !== 'user') { rank = user.rank; }

                return rank;
            },
            battlesGetLevelColor(user) {
                let color = '';

                if(user.level >= 2 && user.level < 26) { color = 'blue'; }
                else if(user.level >= 26 && user.level < 51) { color = 'green'; }
                else if(user.level >= 51 && user.level < 76) { color = 'orange'; }
                else if(user.level >= 76 && user.level < 100) { color = 'red'; }
                else if(user.level >= 100) { color = 'purple'; }

                return color;
            },
            battlesGetItemsFormated(items) {
                let pos = 0;

                for(let item of items) {
                    pos = pos + item.tickets;

                    if(pos < 1000 - 1) { item.color = 'yellow'; }
                    else if(pos < 5000 - 1) { item.color = 'red'; }
                    else if(pos < 20000 - 1) { item.color = 'green'; }
                    else if(pos < 50000 - 1) { item.color = 'purple'; }
                    else { item.color = 'blue'; }
                }

                return items;
            },
            battlesBotButton() {
                const data = { gameId: this.battlesGameData.game._id };
                this.battlesSendBotSocket(data);
            },
            battlesJoinButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                const data = { gameId: this.battlesGameData.game._id, slot: this.pos };
                this.battlesSendJoinSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'authUser',
                'battlesGameData'
            ]),
            battlesGetBotName() {
                let name = 'Redcliff';

                if(this.pos === 2) { name = 'Redcliff Jr.'; }
                else if(this.pos === 3) { name = ' Redcliff Sr.'; }

                return name;
            },
            battlesGetBoxes() {
                let boxes = [];

                if(this.battlesGameData.game !== null) {
                    for(const box of this.battlesGameData.game.boxes) {
                        for(let i = 0; i < box.count; i++) { boxes.push(box.box); }
                    }
                }

                return boxes;
            },
            battlesGetOutcomeItems() {
                let items = [];

                if(this.bet !== null) {
                    for(const [index, outcome] of (this.battlesGameData.game.state === 'completed' ? this.bet.outcomes : this.bet.outcomes.slice(0, -1)).entries()) {
                        let pos = 0;

                        for(const item of this.battlesGetItemsFormated(this.battlesGetBoxes[index].items)) {
                            pos = pos + item.tickets;
                            if(outcome <= pos) { items.push(item); break; }
                        }
                    }
                }

                return items.reverse();
            },
            battlesGetOutcomeAmount() {
                let amount = 0;

                for(const item of this.battlesGetOutcomeItems) { amount = amount + item.item.amountFixed; }

                return amount;
            }
        }
    }
</script>

<style scoped>
    .battles-bet-element {
        width: calc(50% - 9px);
    }

    .battles-game.game-3 .battles-bet-element {
        width: calc(33.33% - 10px);
    }

    .battles-game.game-4 .battles-bet-element {
        width: calc(25% - 4.5px);
    }

    .battles-bet-element .element-top {
        width: 100%;
        height: 65px;
        margin-bottom: 15px;
        padding: 1px;
        background: #0a273f;
    }

    .battles-bet-element.element-winner .element-top {
        background: linear-gradient(270deg, rgba(1, 229, 168, 0.7) 0%, rgba(0, 0, 0, 0) 45%), #0a273f;
    }

    .battles-bet-element.element-lost .element-top {
        background: linear-gradient(270deg, rgba(245, 80, 70, 0.7) 0%, rgba(0, 0, 0, 0) 45%), #0a273f;
    }

    .battles-bet-element .top-inner {
        width: 100%;
        height: 100%;
        background: linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.1) 50%, rgba(5, 29, 48, 0.35) 100%), #041f35;
    }

    .battles-bet-element.element-winner .top-inner {
        background: linear-gradient(223deg, rgba(1, 232, 171, 0.2) 0%, rgba(0, 0, 0, 0) 50%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.1) 50%, rgba(5, 29, 48, 0.35) 100%), #041f35;
    }

    .battles-bet-element.element-lost .top-inner {
        background: linear-gradient(223deg, rgba(235, 42, 42, 0.2) 0%, rgba(0, 0, 0, 0) 50%),
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.1) 50%, rgba(5, 29, 48, 0.35) 100%), #041f35;
    }

    .battles-bet-element .inner-info {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
    }

    .battles-bet-element .info-user {
        display: flex;
        align-items: center;
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
    }

    .battles-bet-element.element-winner .info-user span {
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent; 
    }

    .battles-bet-element.element-lost .info-user span {
        color: #f55046;
    }

    .battles-bet-element .user-avatar {
        width: 37px;
        height: 37px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-right: 13px;
        border-radius: 50%;
        border: 2px solid #9e9e9e;
        overflow: hidden;
    }

    .battles-bet-element .info-user.user-blue .user-avatar {
        border: 2px solid #559ee4;
    }

    .battles-bet-element .info-user.user-green .user-avatar {
        border: 2px solid #b8e92d;
    }

    .battles-bet-element .info-user.user-orange .user-avatar {
        border: 2px solid #fca311;
    }

    .battles-bet-element .info-user.user-red .user-avatar {
        border: 2px solid #ff4e4e;
    }

    .battles-bet-element .info-user.user-purple .user-avatar {
        border: 2px solid #6953f1;
    }

    .battles-bet-element .info-user.user-partner .user-avatar {
        border: 2px solid #eca822;
    }

    .battles-bet-element .info-user.user-mod .user-avatar {
        border: 2px solid #ffb703;
    }

    .battles-bet-element .info-user.user-bot .user-avatar,
    .battles-bet-element .info-user.user-admin .user-avatar {
        border: 2px solid #00ffc2;
    }

    .battles-bet-element .user-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    .battles-bet-element .info-amount {
        display: flex;
        align-items: center;
    }

    .battles-bet-element .info-amount img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
    }

    .battles-bet-element .amount-value {
        font-size: 11px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .battles-bet-element .amount-value span {
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
    }

    .battles-bet-element .inner-actions {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .battles-bet-element .actions-funding {
        width: 48px;
        height: 21px;
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translate(0, -50%);
        padding: 1px;
        filter: drop-shadow(0px 1px 15px rgba(1, 230, 169, 0.63));
    }

    .battles-bet-element .actions-funding:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #01c98c;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .battles-bet-element .funding-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(242deg, rgba(0, 255, 194, 0.44) 16%, rgba(0, 231, 170, 0.22) 32%, rgba(0, 218, 157, 0.1) 50%, rgba(0, 195, 134, 0.26) 80%, rgba(0, 170, 109, 0.44) 100%), 
                    linear-gradient(180deg, #073137 0%, #082538 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .battles-bet-element .funding-inner span {
        font-size: 11px;
        font-weight: 800;
        background: linear-gradient(239deg, #00ffc2 -100%, #00aa6d 120%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .battles-bet-element button.button-join {
        width: 150px;
        height: 35px;
        position: relative;
        padding: 1px;
    }

    .battles-bet-element.top-actions button.button-join:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 170, 109, 0) 0%, #00ffc2 100%);
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .battles-bet-element button.button-join .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .battles-bet-element button.button-join .button-loading.fade-leave-active {
        transition: opacity 0.1s;
    }

    .battles-bet-element button.button-join .button-loading.fade-leave-to {
        opacity: 0;
    }

    .battles-bet-element button.button-join .inner-content.fade-enter-active {
        transition: opacity 0.1s;
    }

    .battles-bet-element button.button-join .inner-content.fade-enter {
        opacity: 0;
    }

    .battles-bet-element button.button-join .inner-content {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .battles-bet-element button.button-join .inner-content svg {
        margin-right: 8px;
        fill: #ffffff;
    }

    .battles-bet-element button.button-join .content-bot {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        margin-right: 6px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid #4adeaf;
        overflow: hidden;
    }

    .battles-bet-element button.button-join .content-bot img {
        width: 17px;
        transform: scaleX(-1);
        margin-top: -3px; /* Yukarıya doğru 10 piksel kaydırır */

    }

    .battles-bet-element .element-items {
        width: 100%;
        height: 400px;
        padding: 4px;
        overflow-x: scroll;
        background: rgba(2, 21, 36, 0.35);
        border: 1px solid #0a273f;
    }

    .battles-bet-element .items-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    @media only screen and (max-width: 1250px) {

        .battles-game.game-4 .battles-bet-element {
            width: calc(50% - 3px);
        }

        .battles-game.game-4 .battles-bet-element .element-items {
            display: none;
        }

    }

    @media only screen and (max-width: 1150px) {

        .battles-game.game-3 .battles-bet-element {
            width: calc(50% - 3px);
        }

        .battles-game.game-3 .battles-bet-element .element-items {
            display: none;
        }

    }

    @media only screen and (max-width: 850px) {

        .battles-bet-element {
            width: 100%!important;
        }

        .battles-bet-element .element-items {
            display: none;
        }

    }
</style>