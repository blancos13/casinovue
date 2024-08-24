<template>
    <div class="blackjack-controls-action">
        MAKE A DECISION
        <div class="action-timer">
            TIME REMAINING <span>{{parseFloat(blackjackTimer).toFixed(2)}}s</span>
        </div>
        <div class="action-container">
            <div v-if="table.playersPos === 'all'" class="container-insurance">
                <button v-on:click="$parent.blackjackInsuranceButton(true)">
                    <div class="button-inner">
                        <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.72515 1.38565C6.87264 1.16442 6.81069 0.865324 6.58746 0.720892L5.59163 0.0765408C5.37269 -0.0651261 5.08055 -0.00460695 4.9359 0.212359L3.70282 2.06194L5.63139 3.02621L6.72515 1.38565Z" />
                            <path d="M8.41887 4.42046L9.32163 3.06631C9.46912 2.84509 9.40717 2.54599 9.18394 2.40156L8.18811 1.7572C7.96917 1.61554 7.67703 1.67606 7.53238 1.89302L6.4903 3.45616L8.41887 4.42046Z" />
                            <path d="M8.63535 6.81909L9.50852 7.20716C9.72075 7.30147 9.97005 7.22915 10.0989 7.03593L11.7138 4.61354C11.8613 4.39232 11.7993 4.09322 11.5761 3.94879L10.7853 3.43708C10.5664 3.29541 10.2742 3.35593 10.1296 3.57289L8.43224 6.11889C8.26836 6.36482 8.3653 6.69907 8.63535 6.81909Z" />
                            <path d="M13.9689 5.4977L13.1781 4.98603C12.9592 4.84436 12.6671 4.90488 12.5224 5.12184L11.0744 7.29392C10.9104 7.53981 11.0074 7.87407 11.2774 7.99409L12.1506 8.38216C12.3628 8.47646 12.6121 8.40418 12.741 8.21093L14.1066 6.16243C14.2541 5.94127 14.1921 5.64217 13.9689 5.4977Z" />
                            <path d="M12.3437 9.37601C12.3436 9.37601 12.3436 9.37601 12.3436 9.37601C12.1424 9.37601 11.947 9.3345 11.7629 9.25265L7.30735 7.27246H7.00606L9.00894 11.2782C9.13011 11.5206 9.0255 11.8167 8.77487 11.9277C8.54011 12.0316 8.26485 11.9222 8.15004 11.6926L5.93995 7.27246H3.90022C3.64349 7.27246 3.42258 7.07517 3.41051 6.81872C3.3976 6.54492 3.61578 6.3189 3.88674 6.3189H6.89821C7.05761 6.3189 7.20649 6.23921 7.29492 6.10657L7.58661 5.66902C7.7457 5.43041 7.65962 5.10635 7.40312 4.9781L3.54597 3.04953C3.33092 2.942 3.06942 3.01145 2.93605 3.21151L0.742196 6.50233C0.630629 6.66965 0.636065 6.889 0.755768 7.0506L4.26985 11.7946C4.35472 11.9091 4.38387 12.0557 4.34928 12.194L3.47741 15.6814C3.40218 15.9823 3.62979 16.2738 3.93995 16.2738H11.1507C11.414 16.2738 11.6275 16.0604 11.6275 15.797V13.2523C11.6275 13.0931 11.7069 12.9445 11.8392 12.856C11.8392 12.856 11.9588 12.776 12.1357 12.658C12.9201 12.1351 13.3884 11.2601 13.3884 10.3174V8.92192C13.1203 9.20929 12.7442 9.37601 12.3437 9.37601Z" />
                        </svg>
                        INSURANCE
                    </div>
                </button>
                <button v-on:click="$parent.blackjackInsuranceButton(false)">
                    <div class="button-inner">
                        <svg width="13" height="18" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.0707 5.28109C12.5841 5.28109 13.0004 4.86485 13.0004 4.35139C13.0004 3.83793 12.5841 3.42169 12.0707 3.42169C11.5572 3.42169 11.141 3.83793 11.141 4.35139C11.141 4.86485 11.5572 5.28109 12.0707 5.28109Z" />
                            <path d="M9.59138 3.42196C10.1048 3.42196 10.5211 3.00572 10.5211 2.49226C10.5211 1.9788 10.1048 1.56256 9.59138 1.56256C9.07792 1.56256 8.66168 1.9788 8.66168 2.49226C8.66168 3.00572 9.07792 3.42196 9.59138 3.42196Z" />
                            <path d="M7.11207 2.80178C7.62553 2.80178 8.04177 2.38554 8.04177 1.87208C8.04177 1.35862 7.62553 0.942383 7.11207 0.942383C6.59861 0.942383 6.18237 1.35862 6.18237 1.87208C6.18237 2.38554 6.59861 2.80178 7.11207 2.80178Z" />
                            <path d="M4.63313 4.0414C5.14658 4.0414 5.56282 3.62516 5.56282 3.1117C5.56282 2.59825 5.14658 2.18201 4.63313 2.18201C4.11967 2.18201 3.70343 2.59825 3.70343 3.1117C3.70343 3.62516 4.11967 4.0414 4.63313 4.0414Z" />
                            <path d="M11.1408 4.35077V8.37946C11.1408 8.55053 11.002 8.68936 10.8309 8.68936C10.6599 8.68936 10.521 8.55053 10.521 8.37946V2.49138H8.66164V7.75966C8.66164 7.93073 8.5228 8.06956 8.35174 8.06956C8.18068 8.06956 8.04184 7.93073 8.04184 7.75966V1.87158H6.18245V7.75966C6.18245 7.93073 6.04361 8.06956 5.87255 8.06956C5.70148 8.06956 5.56265 7.93073 5.56265 7.75966V3.11118H3.70325V10.8587L2.44816 9.14119C2.07628 8.56788 1.3505 8.37574 0.818715 8.70424C0.288788 9.04017 0.157391 9.77277 0.524311 10.3442C0.524311 10.3442 2.54857 13.4079 3.41133 14.7194C4.27409 16.0309 5.67173 17.0566 8.28542 17.0566C12.6129 17.0566 13.0002 13.7147 13.0002 12.718C13.0002 11.7214 13.0002 4.35077 13.0002 4.35077H11.1408Z" />
                        </svg>
                        NO INSURANCE
                    </div>
                </button>
            </div>
            <div v-else class="container-normal">
                <button v-on:click="$parent.blackjackHitButton()">
                    <div class="button-inner">
                        <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.72515 1.38565C6.87264 1.16442 6.81069 0.865324 6.58746 0.720892L5.59163 0.0765408C5.37269 -0.0651261 5.08055 -0.00460695 4.9359 0.212359L3.70282 2.06194L5.63139 3.02621L6.72515 1.38565Z" />
                            <path d="M8.41887 4.42046L9.32163 3.06631C9.46912 2.84509 9.40717 2.54599 9.18394 2.40156L8.18811 1.7572C7.96917 1.61554 7.67703 1.67606 7.53238 1.89302L6.4903 3.45616L8.41887 4.42046Z" />
                            <path d="M8.63535 6.81909L9.50852 7.20716C9.72075 7.30147 9.97005 7.22915 10.0989 7.03593L11.7138 4.61354C11.8613 4.39232 11.7993 4.09322 11.5761 3.94879L10.7853 3.43708C10.5664 3.29541 10.2742 3.35593 10.1296 3.57289L8.43224 6.11889C8.26836 6.36482 8.3653 6.69907 8.63535 6.81909Z" />
                            <path d="M13.9689 5.4977L13.1781 4.98603C12.9592 4.84436 12.6671 4.90488 12.5224 5.12184L11.0744 7.29392C10.9104 7.53981 11.0074 7.87407 11.2774 7.99409L12.1506 8.38216C12.3628 8.47646 12.6121 8.40418 12.741 8.21093L14.1066 6.16243C14.2541 5.94127 14.1921 5.64217 13.9689 5.4977Z" />
                            <path d="M12.3437 9.37601C12.3436 9.37601 12.3436 9.37601 12.3436 9.37601C12.1424 9.37601 11.947 9.3345 11.7629 9.25265L7.30735 7.27246H7.00606L9.00894 11.2782C9.13011 11.5206 9.0255 11.8167 8.77487 11.9277C8.54011 12.0316 8.26485 11.9222 8.15004 11.6926L5.93995 7.27246H3.90022C3.64349 7.27246 3.42258 7.07517 3.41051 6.81872C3.3976 6.54492 3.61578 6.3189 3.88674 6.3189H6.89821C7.05761 6.3189 7.20649 6.23921 7.29492 6.10657L7.58661 5.66902C7.7457 5.43041 7.65962 5.10635 7.40312 4.9781L3.54597 3.04953C3.33092 2.942 3.06942 3.01145 2.93605 3.21151L0.742196 6.50233C0.630629 6.66965 0.636065 6.889 0.755768 7.0506L4.26985 11.7946C4.35472 11.9091 4.38387 12.0557 4.34928 12.194L3.47741 15.6814C3.40218 15.9823 3.62979 16.2738 3.93995 16.2738H11.1507C11.414 16.2738 11.6275 16.0604 11.6275 15.797V13.2523C11.6275 13.0931 11.7069 12.9445 11.8392 12.856C11.8392 12.856 11.9588 12.776 12.1357 12.658C12.9201 12.1351 13.3884 11.2601 13.3884 10.3174V8.92192C13.1203 9.20929 12.7442 9.37601 12.3437 9.37601Z" />
                        </svg>
                        HIT
                    </div>
                </button>
                <button v-on:click="$parent.blackjackStandButton()">
                    <div class="button-inner">
                        <svg width="13" height="18" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.0707 5.28109C12.5841 5.28109 13.0004 4.86485 13.0004 4.35139C13.0004 3.83793 12.5841 3.42169 12.0707 3.42169C11.5572 3.42169 11.141 3.83793 11.141 4.35139C11.141 4.86485 11.5572 5.28109 12.0707 5.28109Z" />
                            <path d="M9.59138 3.42196C10.1048 3.42196 10.5211 3.00572 10.5211 2.49226C10.5211 1.9788 10.1048 1.56256 9.59138 1.56256C9.07792 1.56256 8.66168 1.9788 8.66168 2.49226C8.66168 3.00572 9.07792 3.42196 9.59138 3.42196Z" />
                            <path d="M7.11207 2.80178C7.62553 2.80178 8.04177 2.38554 8.04177 1.87208C8.04177 1.35862 7.62553 0.942383 7.11207 0.942383C6.59861 0.942383 6.18237 1.35862 6.18237 1.87208C6.18237 2.38554 6.59861 2.80178 7.11207 2.80178Z" />
                            <path d="M4.63313 4.0414C5.14658 4.0414 5.56282 3.62516 5.56282 3.1117C5.56282 2.59825 5.14658 2.18201 4.63313 2.18201C4.11967 2.18201 3.70343 2.59825 3.70343 3.1117C3.70343 3.62516 4.11967 4.0414 4.63313 4.0414Z" />
                            <path d="M11.1408 4.35077V8.37946C11.1408 8.55053 11.002 8.68936 10.8309 8.68936C10.6599 8.68936 10.521 8.55053 10.521 8.37946V2.49138H8.66164V7.75966C8.66164 7.93073 8.5228 8.06956 8.35174 8.06956C8.18068 8.06956 8.04184 7.93073 8.04184 7.75966V1.87158H6.18245V7.75966C6.18245 7.93073 6.04361 8.06956 5.87255 8.06956C5.70148 8.06956 5.56265 7.93073 5.56265 7.75966V3.11118H3.70325V10.8587L2.44816 9.14119C2.07628 8.56788 1.3505 8.37574 0.818715 8.70424C0.288788 9.04017 0.157391 9.77277 0.524311 10.3442C0.524311 10.3442 2.54857 13.4079 3.41133 14.7194C4.27409 16.0309 5.67173 17.0566 8.28542 17.0566C12.6129 17.0566 13.0002 13.7147 13.0002 12.718C13.0002 11.7214 13.0002 4.35077 13.0002 4.35077H11.1408Z" />
                        </svg>
                        STAND
                    </div>
                </button>
                <button v-on:click="$parent.blackjackSplitButton()" v-bind:disabled="
                    blackjackGetPlayer(table.playersPos).bet.actions.includes('split') === true ||
                    blackjackGetPlayer(table.playersPos).bet.cards.length !== 2 ||
                    blackjackGetPlayer(table.playersPos).bet.cards[0].rank !== blackjackGetPlayer(table.playersPos).bet.cards[1].rank
                ">
                    <div class="button-inner">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.2646 6.94049H10.7093H6.59029H2.03504C0.915893 6.94049 -0.000183105 7.88046 -0.000183105 9.00001C-0.000183105 10.1196 0.915893 11.0595 2.03504 11.0595H6.59029H10.7093H15.2646C16.3837 11.0595 17.2998 10.1196 17.2998 9.00001C17.2998 7.88046 16.3837 6.94049 15.2646 6.94049Z" />
                            <path d="M8.64992 4.88095C9.78736 4.88095 10.7094 3.95887 10.7094 2.82143C10.7094 1.68398 9.78736 0.761902 8.64992 0.761902C7.51247 0.761902 6.59039 1.68398 6.59039 2.82143C6.59039 3.95887 7.51247 4.88095 8.64992 4.88095Z" />
                            <path d="M8.64992 17.2381C9.78736 17.2381 10.7094 16.316 10.7094 15.1785C10.7094 14.0411 9.78736 13.119 8.64992 13.119C7.51247 13.119 6.59039 14.0411 6.59039 15.1785C6.59039 16.316 7.51247 17.2381 8.64992 17.2381Z" />
                        </svg>
                        SPLIT
                    </div>
                </button>
                <button v-on:click="$parent.blackjackDoubleButton()" v-bind:disabled="
                    blackjackGetPlayer(table.playersPos).bet.actions.includes('split') === true ||
                    blackjackGetPlayer(table.playersPos).bet.cards.length !== 2 ||
                    blackjackGetCardValue(blackjackGetPlayer(table.playersPos).bet.cards) < 9 ||
                    blackjackGetCardValue(blackjackGetPlayer(table.playersPos).bet.cards) > 11
                ">
                    <div class="button-inner">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.00054 2.84048L11.9919 7.83184C12.4513 8.29117 13.1962 8.29117 13.6555 7.83184C14.1148 7.37252 14.1148 6.62756 13.6555 6.16824L7.83176 0.344494C7.37244 -0.114832 6.62748 -0.114832 6.16816 0.344493L0.344411 6.16824C-0.114891 6.62756 -0.114891 7.37252 0.344411 7.83184C0.803736 8.29117 1.54869 8.29117 2.00802 7.83184L7.00054 2.84048ZM7.00697 9.86848L10.804 13.6515C11.2697 14.1161 12.0257 14.1161 12.4915 13.6515C12.9572 13.1869 12.9572 12.4344 12.4915 11.9698L7.85043 7.34628C7.3847 6.88169 7.04369 6.95631 6.58436 7.41564L1.52188 11.9698C1.05615 12.4344 1.05615 13.1869 1.52188 13.6515C1.98761 14.1161 2.74363 14.1161 3.20939 13.6515L7.00697 9.86848Z" />
                        </svg>
                        DOUBLE
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'BlackjackControlsAction',
        props: ['table'],
        data() {
            return {
                blackjackTimerRepeater: null,
                blackjackTimer: 10
            }
        },
        methods: {
            blackjackGetPlayer(seat) {
                return this.table.players[this.table.players.findIndex((element) => element.seat === seat)];
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
            blackjackStartTimer() {
                const timeEnding = new Date(this.table.game.updatedAt).getTime() + (1000 * 10);
                this.blackjackTimer = (timeEnding - (new Date().getTime() + this.generalTimeDiff)) / 1000;

                if(this.blackjackTimer <= 0) {
                    this.blackjackTimer = 0;
                } else {
                    this.blackjackTimerRepeater = requestAnimationFrame(this.blackjackStartTimer);
                }
            }
        },
        computed: {
            ...mapGetters([
                'generalTimeDiff'
            ])
        },
        watch: {
            'table': {
                handler(data, oldData) {
                    if(this.table.game.state === 'countdown' || (this.table.game.state === 'running' && this.table.playerPos !== null)) {
                        this.blackjackStartTimer();
                    }
                },
                deep: true
            }
        },
        beforeUnmount() {
            cancelAnimationFrame(this.blackjackTimerRepeater);
        },
        created() {
            if(this.table.game.state === 'countdown' || (this.table.game.state === 'running' && this.table.playerPos !== null)) {
                this.blackjackStartTimer();
            }
        }
    }
</script>

<style scoped>
    .blackjack-controls-action {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 14px;
        /* font-family: 'Rubik'; */
        text-align: center;
        font-size: 24px;
        font-weight: 900;
        color: #ffffff;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        z-index: 1;
    }

    .blackjack-controls-action .action-timer {
        display: flex;
        margin-top: 3px;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }

    .blackjack-controls-action .action-timer span {
        width: 38px;
        display: flex;
        margin-left: 5px;
        color: #ffd600;
    }

    .blackjack-controls-action .action-container {
        width: 470px;
        height: 95px;
        position: absolute;
        top: 37px;
        left: 50%;
        transform: translate(-50%, 0);
        padding: 0 20px;
        background-image: url('~@/assets/img/blackjack/action-blackjack.webp');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        z-index: -1;
    }

    .blackjack-controls-action .container-insurance,
    .blackjack-controls-action .container-normal {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .blackjack-controls-action .container-insurance button,
    .blackjack-controls-action .container-normal button {
        height: 59px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .blackjack-controls-action .container-insurance button {
        width: calc(50% - 4px);
    }

    .blackjack-controls-action .container-insurance button::before,
    .blackjack-controls-action .container-normal button::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #214059;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .blackjack-controls-action .container-normal button:disabled::before {
        background: #061724;
    }

    .blackjack-controls-action .container-insurance button .button-inner,
    .blackjack-controls-action .container-normal button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 15px;
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
        background: #061724;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
        transition: background 0.3s ease;
    }

    .blackjack-controls-action .container-insurance button:hover .button-inner,
    .blackjack-controls-action .container-normal button:hover .button-inner {
        background: #092134;
    }

    .blackjack-controls-action .container-normal button:disabled .button-inner {
        color: #353f47;
    }

    .blackjack-controls-action .container-insurance button .button-inner svg,
    .blackjack-controls-action .container-normal button .button-inner svg {
        margin-right: 7px;
        fill: #00ffc2;
    }

    .blackjack-controls-action .container-normal button:disabled .button-inner svg {
        fill: #353f47;
    }
</style>
