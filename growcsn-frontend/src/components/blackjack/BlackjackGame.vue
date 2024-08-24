<template>
    <div class="blackjack-game">
        <div class="game-table">
            <img src="@/assets/img/blackjack/table.png" />
        </div>
        <div class="game-inner">
            <div v-if="table.game.state === 'created'" class="inner-created">WAITING FOR PLAYERS TO JOIN...</div>
            <BlackjackControlsBet v-if="
                authUser.user !== null &&
                table.players.some((element) => element.user._id === authUser.user._id) === true &&
                table.game.state === 'countdown'
            " v-bind:table="table" v-bind:blackjackChip="blackjackChip" />
            <BlackjackControlsAction v-else-if="
                authUser.user !== null &&
                table.game.state === 'running' &&
                table.playersPos !== null &&
                (table.playersPos === 'all' || authUser.user._id === blackjackGetPlayer(table.playersPos).user._id) &&
                (new Date().getTime() + generalTimeDiff) <= (new Date(table.game.updatedAt).getTime() + 1000 * 10)
            " v-bind:table="table" />
        </div>
        <div v-if="['running', 'completed'].includes(table.game.state) === true" class="game-dealer">
            <transition-group name="dealer" tag="div" class="dealer-cards">
                <BlackjackCard v-for="(card, index) of table.game.dealerCards" v-bind:key="index + card.suit + card.rank" v-bind:card="card" />
            </transition-group>
            <BlackjackValue 
                v-bind:value="blackjackGetCardValue(table.game.dealerCards)" 
                state=""
                v-bind:class="{ 
                    'value-blackjack': table.game.dealerCards.length === 2 && blackjackGetCardValue(table.game.dealerCards) === 21  
                }" 
                v-bind:style="{ 
                    top: (84 + (table.game.dealerCards.length - 1) * 15) + 'px', 
                    left: (60 + (table.game.dealerCards.length - 1) * 20) + 'px'  
                }"
            />
        </div>
        <div class="game-seats">

            <BlackjackSeatElement v-for="index in 5" v-bind:key="index" v-bind:table="table" v-bind:seat="index - 1" v-bind:player="blackjackGetPlayer(index - 1)" />

        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import BlackjackCard from '@/components/blackjack/BlackjackCard';
    import BlackjackValue from '@/components/blackjack/BlackjackValue';
    import BlackjackSeatElement from '@/components/blackjack/BlackjackSeatElement';
    import BlackjackControlsBet from '@/components/blackjack/BlackjackControlsBet';
    import BlackjackControlsAction from '@/components/blackjack/BlackjackControlsAction';

    export default {
        name: 'BlackjackGame',
        components: {
            BlackjackCard,
            BlackjackValue,
            BlackjackSeatElement,
            BlackjackControlsBet,
            BlackjackControlsAction
        },
        props: [
            'table'
        ],
        data() {
            return {
                blackjackChip: 0
            }
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'blackjackSendJoinSocket', 
                'blackjackSendBetSocket', 
                'blackjackSendInsuranceSocket', 
                'blackjackSendHitSocket', 
                'blackjackSendStandSocket', 
                'blackjackSendSplitSocket', 
                'blackjackSendDoubleSocket'
            ]),
            blackjackGetPlayer(seat) {
                return this.table.players[this.table.players.findIndex((element) => element.seat === seat)];
            },
            blackjackGetAmount(chip) {
                const amounts = this.table.game.type === 'standard' ? [0.1, 1, 10, 100] : [50, 100, 200, 500];
                return amounts[chip];
            },
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
            blackjackSetChip(chip) {
                this.blackjackChip = chip;
            },
            blackjackJoinButton(seat) {
                if(this.socketSendLoading !== null) { return; }

                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }
                const data = { table: this.table.table, seat: seat };
                this.blackjackSendJoinSocket(data);
            },
            blackjackBetButton(seat, type) {
                if(this.socketSendLoading !== null) { return; }

                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                let amount = { main: 0, sideLeft: 0, sideRight: 0 };
                amount[type] = Math.floor(this.blackjackGetAmount(this.blackjackChip) * 1000);

                const data = { table: this.table.table, bets: [{ seat: seat, amount: amount }] };
                this.blackjackSendBetSocket(data);
            },
            blackjackInsuranceButton(insurance) {
                if(this.socketSendLoading !== null) { return; }

                const data = { table: this.table.table, insurance: insurance };
                this.blackjackSendInsuranceSocket(data);
            },
            blackjackHitButton() {
                if(this.socketSendLoading !== null) { return; }

                const data = { table: this.table.table, seat: this.table.playersPos };
                this.blackjackSendHitSocket(data);
            },
            blackjackStandButton() {
                if(this.socketSendLoading !== null) { return; }

                const data = { table: this.table.table, seat: this.table.playersPos };
                this.blackjackSendStandSocket(data);
            },
            blackjackSplitButton() {
                if(this.socketSendLoading !== null) { return; }

                const data = { table: this.table.table, seat: this.table.playersPos };
                this.blackjackSendSplitSocket(data);
            },
            blackjackDoubleButton() {
                if(this.socketSendLoading !== null) { return; }

                const data = { table: this.table.table, seat: this.table.playersPos };
                this.blackjackSendDoubleSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'generalTimeDiff',
                'socketSendLoading', 
                'authUser'
            ])
        }
    }
</script>

<style scoped>
    .blackjack-game {
        width: 1090px;
        position: relative;
        margin-top: 35px;
        padding-bottom: 55px;
    }

    .blackjack-game .game-table {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .blackjack-game .game-table img {
        width: 100%;
    }

    .blackjack-game .game-inner {
        width: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        top: 0;
        left: 0;
    }

    .blackjack-game .inner-created {
        width: 400px;
        margin-top: 170px;
        text-align: center;
        /* font-family: 'Rubik'; */
        font-size: 34px;
        font-weight: 900;
        color: #ffffff;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }

    .blackjack-game .game-dealer {
        position: absolute;
        top: 135px;
        left: 50%;
        transform: translate(-50%, 0);
    }

    .blackjack-game .dealer-cards {
        width: 80px;
    }

    .blackjack-game .dealer-cards .dealer-enter-active {
        transition: all 0.6s;
    }

    .blackjack-game .dealer-cards .dealer-enter {
        transform: translate(5px, 25px);
        opacity: 0;
    }

    .blackjack-game .game-seats {
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 55px;
        left: 0;
    }

    @media only screen and (max-width: 1110px) {

        .blackjack-game {
            scale: 0.8;
            transform-origin: top center;
            margin-bottom: -100px;
        }

    }
    @media only screen and (max-width: 860px) {

        .blackjack-game {
            scale: 0.7;
        }

    }
    @media only screen and (max-width: 760px) {

        .blackjack-game {   
            scale: 0.5;
            margin-bottom: -220px;
        }
        
    }
    @media only screen and (max-width: 540px) {
        
        .blackjack-game {   
            scale: 0.45;
            margin-bottom: -280px;
        }
        
    }
    @media only screen and (max-width: 490px) {
        
        .blackjack-game {   
            scale: 0.4;
            margin-bottom: -350px;
        }

    }
    @media only screen and (max-width: 440px) {

        .blackjack-game {   
            scale: 0.35;
        }

    }
    @media only screen and (max-width: 370px) {

        .blackjack-game {   
            scale: 0.32;
        }

    }
</style>
