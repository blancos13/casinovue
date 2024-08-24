<template>
    <div class="blackjack-seat-element">
        <div class="element-user">
            <button v-if="player === undefined" v-on:click="$parent.blackjackJoinButton(seat)" class="button-join">TAKE<br /> SEAT</button>
            <div v-else class="user-info">
                <div class="user-avatar">
                    <AvatarImage v-bind:image="player.user.avatar" />
                </div>
                <span v-html="player.user.username"></span>
            </div>
        </div>
        <div class="element-game" v-bind:class="{ 'game-completed': table.game.state === 'completed' }">
            <div v-if="['running', 'completed'].includes(table.game.state) === true && player !== undefined" class="game-stack">

                <div v-if="player.bet.actions.includes('split') === false" class="stack-single">
                    <transition-group name="player" tag="div" class="single-cards">
                        <BlackjackCard v-for="(card, index) of player.bet.cards" v-bind:key="index + card.suit + card.rank" v-bind:card="card" />
                    </transition-group>
                    <BlackjackValue 
                        v-bind:value="blackjackGetCardValue(player.bet.cards)" 
                        v-bind:state="blackjackGetCardState(player.bet.cards)"  
                        v-bind:class="{
                            'value-active': blackjackIsActive,
                            'value-blackjack': player.bet.cards.length === 2 && blackjackGetCardValue(player.bet.cards) === 21 
                        }" 
                    />
                </div>
                <div v-else class="stack-split">
                    <div class="split-left">
                        <transition-group name="player" tag="div" class="left-cards">
                            <BlackjackCard v-for="(card, index) of player.bet.cardsLeft" v-bind:key="index + card.suit + card.rank" v-bind:card="card" />
                        </transition-group>
                        <BlackjackValue 
                            v-bind:value="blackjackGetCardValue(player.bet.cardsLeft)" 
                            v-bind:state="blackjackGetCardState(player.bet.cardsLeft)" 
                            v-bind:class="{ 
                                'value-active': blackjackIsActive && (player.bet.actions.includes('stand') === true || blackjackGetCardValue(player.bet.cardsRight) >= 21),
                                'value-blackjack': player.bet.cardsLeft.length === 2 && blackjackGetCardValue(player.bet.cardsLeft) === 21  
                            }" 
                        />
                    </div>
                    <div class="split-right">
                        <transition-group name="player" tag="div" class="right-cards">
                            <BlackjackCard v-for="(card, index) of player.bet.cardsRight" v-bind:key="index + card.suit + card.rank" v-bind:card="card" />
                        </transition-group>
                        <BlackjackValue 
                            v-bind:value="blackjackGetCardValue(player.bet.cardsRight)" 
                            v-bind:state="blackjackGetCardState(player.bet.cardsRight)"
                            v-bind:class="{ 
                                'value-active': blackjackIsActive && player.bet.actions.includes('stand') === false && blackjackGetCardValue(player.bet.cardsRight) < 21,
                                'value-blackjack': player.bet.cardsRight.length === 2 && blackjackGetCardValue(player.bet.cardsRight) === 21  
                            }" 
                        />
                    </div>
                </div>

            </div>
            <div class="game-actions">
                <button v-on:click="$parent.blackjackBetButton(seat, 'sideLeft')" class="button-side">
                    <transition name="slide-fade" mode="in-out">
                        <div v-if="blackjackGetAmount.sideLeft >= (100 * 1000)" class="button-chip" key="orange-chip">
                            <img src="@/assets/img/blackjack/chip-orange.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.sideLeft / 1000)}}</div>
                        </div>
                        <div v-else-if="blackjackGetAmount.sideLeft >= (10 * 1000)" class="button-chip" key="blue-chip">
                            <img src="@/assets/img/blackjack/chip-blue.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.sideLeft / 1000)}}</div>
                        </div>
                        <div v-else-if="blackjackGetAmount.sideLeft >= (1 * 1000)" class="button-chip" key="purple-chip">
                            <img src="@/assets/img/blackjack/chip-purple.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.sideLeft / 1000)}}</div>
                        </div>
                        <div v-else-if="blackjackGetAmount.sideLeft >= (0.1 * 1000)" class="button-chip" key="red-chip">
                            <img src="@/assets/img/blackjack/chip-red.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.sideLeft / 1000)}}</div>
                        </div>
                    </transition>
                </button>
                <button v-if="this.table.game.type === 'standard'" v-on:click="$parent.blackjackBetButton(player.seat, 'main')" class="button-main">
                    <transition name="slide-fade" mode="in-out">
                        <div v-if="blackjackGetAmount.main >= (100 * 1000)" class="button-chip" key="orange-chip">
                            <img src="@/assets/img/blackjack/chip-orange.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.main / 1000)}}</div>
                        </div>
                        <div v-else-if="blackjackGetAmount.main >= (10 * 1000)" class="button-chip" key="blue-chip">
                            <img src="@/assets/img/blackjack/chip-blue.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.main / 1000)}}</div>
                        </div>
                        <div v-else-if="blackjackGetAmount.main >= (1 * 1000)" class="button-chip" key="purple-chip">
                            <img src="@/assets/img/blackjack/chip-purple.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.main / 1000)}}</div>
                        </div>
                        <div v-else-if="blackjackGetAmount.main >= (0.1 * 1000)" class="button-chip" key="red-chip">
                            <img src="@/assets/img/blackjack/chip-red.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.main / 1000)}}</div>
                        </div>
                    </transition>
                </button>
                <button v-else v-on:click="$parent.blackjackBetButton(player.seat, 'main')" class="button-main">
                    <transition name="slide-fade" mode="in-out">
                        <div v-if="blackjackGetAmount.main >= (500 * 1000)" class="button-chip" key="orange-chip">
                            <img src="@/assets/img/blackjack/chip-orange.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.main / 1000)}}</div>
                        </div>
                        <div v-else-if="blackjackGetAmount.main >= (200 * 1000)" class="button-chip" key="blue-chip">
                            <img src="@/assets/img/blackjack/chip-blue.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.main / 1000)}}</div>
                        </div>
                        <div v-else-if="blackjackGetAmount.main >= (100 * 1000)" class="button-chip" key="purple-chip">
                            <img src="@/assets/img/blackjack/chip-purple.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.main / 1000)}}</div>
                        </div>
                        <div v-else-if="blackjackGetAmount.main >= (50 * 1000)" class="button-chip" key="red-chip">
                            <img src="@/assets/img/blackjack/chip-red.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.main / 1000)}}</div>
                        </div>
                    </transition>
                </button>
                <button v-on:click="$parent.blackjackBetButton(seat, 'sideRight')" class="button-side">
                    <transition name="slide-fade" mode="in-out">
                        <div v-if="blackjackGetAmount.sideRight >= (100 * 1000)" class="button-chip" key="orange-chip">
                            <img src="@/assets/img/blackjack/chip-orange.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.sideRight / 1000)}}</div>
                        </div>
                        <div v-else-if="blackjackGetAmount.sideRight >= (10 * 1000)" class="button-chip" key="blue-chip">
                            <img src="@/assets/img/blackjack/chip-blue.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.sideRight / 1000)}}</div>
                        </div>
                        <div v-else-if="blackjackGetAmount.sideRight >= (1 * 1000)" class="button-chip" key="purple-chip">
                            <img src="@/assets/img/blackjack/chip-purple.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.sideRight / 1000)}}</div>
                        </div>
                        <div v-else-if="blackjackGetAmount.sideRight >= (0.1 * 1000)" class="button-chip" key="red-chip">
                            <img src="@/assets/img/blackjack/chip-red.png" />
                            <div class="chip-amount">{{blackjackFormatAmount(blackjackGetAmount.sideRight / 1000)}}</div>
                        </div>
                    </transition>
                </button>
            </div>
        </div>
        <div class="element-win">
            
        </div>
    </div>
</template>

<script>
    import AvatarImage from '@/components/AvatarImage';
    import BlackjackCard from '@/components/blackjack/BlackjackCard';
    import BlackjackValue from '@/components/blackjack/BlackjackValue';

    export default {
        name: 'BlackjackSeatElement',
        components: {
            AvatarImage,
            BlackjackCard,
            BlackjackValue
        },
        props: [
            'table',
            'seat', 
            'player'
        ],
        methods: {
            blackjackGetCardValue(cards) {
                let value = 0;
                let aces = false;

                for(const card of cards) {
                    if(card.rank === 'A') {
                        value = value + 1;
                        aces = true;
                    } else if(card.rank == 'K' || card.rank == 'Q' || card.rank == 'J') {
                        value = value + 10;
                    } else if(card.rank != 'hidden') {
                        value = value + Math.floor(card.rank);
                    }
                }

                if(aces == true && value <= 11) {
                    value = value + 10;
                }

                return value;
            },
            blackjackGetCardState(cards) {
                let state = '';

                if(this.table.game.state === 'completed' && (this.blackjackGetCardValue(cards) > this.blackjackGetCardValue(this.table.game.dealerCards) || this.blackjackGetCardValue(this.table.game.dealerCards) > 21) && this.blackjackGetCardValue(cards) <= 21) { state = 'won'; }
                else if(this.blackjackGetCardValue(cards) > 21 || (this.table.game.state === 'completed' && this.blackjackGetCardValue(cards) < this.blackjackGetCardValue(this.table.game.dealerCards) && this.blackjackGetCardValue(this.table.game.dealerCards) <= 21)) { state = 'lose'; }

                return state;
            },
            blackjackFormatAmount(amount) {
                if(amount >= 1000) { amount = parseFloat(amount / 1000) + 'K'; }
                return amount;
            }
        },
        computed: {
            blackjackIsActive() {
                return this.table.playersPos === this.seat;
            },
            blackjackGetAmount() {
                let amount = {
                    main: 0,
                    sideLeft: 0,
                    sideRight: 0
                };

                if(this.player !== undefined && this.player.bet !== null) {
                    amount.main = this.player.bet.amount.main;
                    amount.sideLeft = this.player.bet.amount.sideLeft;
                    amount.sideRight = this.player.bet.amount.sideRight;
                }

                return amount;
            }
        }
    }
</script>

<style scoped>
    .blackjack-seat-element {
        position: absolute;
    }

    .blackjack-seat-element:nth-child(1) {
        top: 48%;
        left: -20px;
    }

    .blackjack-seat-element:nth-child(2) {
        top: 82%;
        left: 150px;
    }

    .blackjack-seat-element:nth-child(3) {
        top: 92%;
        left: 50%;
        transform: translate(-50%, 0);
    }

    .blackjack-seat-element:nth-child(4) {
        top: 82%;
        right: 150px;
    }

    .blackjack-seat-element:nth-child(5) {
        top: 48%;
        right: -20px;
    }

    .blackjack-seat-element .element-user {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    @media only screen and (max-width: 540px) {
        .blackjack-seat-element .element-user {
            scale: 1.2;            
        }
    }

    .blackjack-seat-element .element-user button.button-join {
        width: 98px;
        height: 98px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
        background-color: #003f35;
        border: 1px dashed #44edc7;
    }

    .blackjack-seat-element .user-info{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .blackjack-seat-element .user-info span {
        margin-top: 10px;
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
    }

    .blackjack-seat-element .user-avatar {
        width: 98px;
        height: 98px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        border-radius: 50%;
        background-color: #000f1b;
        border: 2px solid #9e9e9e;
        overflow: hidden;
    }

    .blackjack-seat-element .user-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    .blackjack-seat-element .element-game {
        position: absolute;
    }

    .blackjack-seat-element:nth-child(1) .element-game {
        top: -15px;
        right: -110px;
        transform: rotate(59deg);
    }

    .blackjack-seat-element:nth-child(2) .element-game {
        top: -75px;
        left: 85px;
        transform: rotate(30deg);
    }

    .blackjack-seat-element:nth-child(3) .element-game {
        top: -105px;
    }

    .blackjack-seat-element:nth-child(4) .element-game {
        top: -75px;
        right: 85px;
        transform: rotate(-30deg);
    }

    .blackjack-seat-element:nth-child(5) .element-game {
        top: -15px;
        left: -110px;
        transform: rotate(-59deg);
    }

    .blackjack-seat-element .game-stack {
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translate(-50%, 0);
    }

    .blackjack-seat-element .stack-single {

    }

    .blackjack-seat-element .stack-split {
        position: relative;
    }

    .blackjack-seat-element .split-left {
        position: absolute;
        bottom: 0;
        left: -95px;
    }

    .blackjack-seat-element .split-right {
        position: absolute;
        bottom: 0;
        right: -70px;
    }

    .blackjack-seat-element .single-cards {
        position: relative;
        width: 80px;
    }


    .blackjack-seat-element .left-cards,
    .blackjack-seat-element .right-cards {
        position: relative;
        width: 73px;
    }

    .blackjack-seat-element .player-enter-active {
        transition: all 0.6s;
    }

    .blackjack-seat-element .player-enter {
        transform: translate(5px, -25px);
        opacity: 0;
    }

    .blackjack-seat-element .game-actions {
        width: 100px;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-image: url('~@/assets/img/blackjack-bet.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;        
    }
    @media only screen and (max-width: 540px) {
        .blackjack-seat-element .game-actions {
            scale: 1.2;            
        }
    }

    .blackjack-seat-element .game-actions button.button-main {
        width: 60px;
        height: 60px;
        position: relative;
        border-radius: 50%;
    }

    .blackjack-seat-element .game-actions button.button-side {
        width: 20px;
        height: 45px;
        position: relative;
    }

    .blackjack-seat-element .game-actions button.button-main .button-chip {
        width: 50px;
        height: 50px;
        position: absolute;
        top: 5px;
        left: 5px;
    }

    .blackjack-seat-element .game-actions button.button-side .button-chip {
        width: 27px;
        height: 27px;
        position: absolute;
        top: 9px;
    }

    .blackjack-seat-element .game-actions button.button-side:first-of-type .button-chip {
        left: -12.5px;
    }

    .blackjack-seat-element .game-actions button.button-side:last-of-type .button-chip {
        right: -12.5px;
    }

    .blackjack-seat-element .game-actions button.button-main .slide-fade-enter-active,
    .blackjack-seat-element .game-actions button.button-side .slide-fade-enter-active {
        transition: all 0.5s ease;
    }

    .blackjack-seat-element .game-actions button.button-main .slide-fade-enter,
    .blackjack-seat-element .game-actions button.button-side .slide-fade-enter {
        transform: translateY(-20px);
        opacity: 0;
    }

    .blackjack-seat-element .game-actions button.button-main .button-chip img,
    .blackjack-seat-element .game-actions button.button-side .button-chip img {
        width: 100%;
        height: 100%;
    }

    .blackjack-seat-element .game-actions button.button-main .chip-amount,
    .blackjack-seat-element .game-actions button.button-side .chip-amount {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
    }

    .blackjack-seat-element .game-actions button.button-side .chip-amount {
        font-size: 8px;
    }

    @media only screen and (max-width: 1200px) {

        .blackjack-seat-element:nth-child(1) {
            left: 10px;
        }

        .blackjack-seat-element:nth-child(5) {
            right: 10px;
        }

    }
</style>
