<template>
    <div class="modal-fair">
        <div class="fair-header">
            <div class="header-icon">
                <img src="@/assets/img/fair.png" alt="fair" />
            </div>
            <span class="gradient-green">PROVABLY FAIR</span>
        </div>
        <div class="fair-info">
            The game results have been generated before you even place your bet, and most importantly, we can prove it.
            Before each game, we actually give you the game result in a hashed format.
            Before you start the game, we give you the hash of the server seed and the public seed which the round result is based on. After the game is finished, we publish the server seed, which you can then compare to the hash to make sure that they match. With this system we can prove that the results were fair and pre-generated.
        </div>
        <div class="fair-nav">
            <button v-on:click="modalSetGame('Blackjack')" v-bind:class="{ 'button-active': modalGame === 'Blackjack' }">
                <div class="button-inner">
                    <span>BLACKJACK</span>
                </div>
            </button>
            <button v-on:click="modalSetGame('Roll')" v-bind:class="{ 'button-active': modalGame === 'Roll' }">
                <div class="button-inner">
                    <span>ROLL</span>
                </div>
            </button>
            <button v-on:click="modalSetGame('Crash')" v-bind:class="{ 'button-active': modalGame === 'Crash' }">
                <div class="button-inner">
                    <span>CRASH</span>
                </div>
            </button>
            <button v-on:click="modalSetGame('Duels')" v-bind:class="{ 'button-active': modalGame === 'Duels' }">
                <div class="button-inner">
                    <span>DICE DUELS</span>
                </div>
            </button>
            <button v-on:click="modalSetGame('Mines')" v-bind:class="{ 'button-active': modalGame === 'Mines' }">
                <div class="button-inner">
                    <span>MINES</span>
                </div>
            </button>
            <button v-on:click="modalSetGame('Towers')" v-bind:class="{ 'button-active': modalGame === 'Towers' }">
                <div class="button-inner">
                    <span>TOWERS</span>
                </div>
            </button>
            <button v-on:click="modalSetGame('Battles')" v-bind:class="{ 'button-active': modalGame === 'Battles' }">
                <div class="button-inner">
                    <span>BATTLES</span>
                </div>
            </button>
            <button v-on:click="modalSetGame('Unbox')" v-bind:class="{ 'button-active': modalGame === 'Unbox' }">
                <div class="button-inner">
                    <span>UNBOX</span>
                </div>
            </button>
        </div>
        <div class="fair-content">
            <component v-bind:is="'Fair' + modalGame" />
        </div>
    </div>
</template>

<script>
    import FairBlackjack from '@/components/fair/FairBlackjack';
    import FairRoll from '@/components/fair/FairRoll';
    import FairCrash from '@/components/fair/FairCrash';
    import FairDuels from '@/components/fair/FairDuels';
    import FairMines from '@/components/fair/FairMines';
    import FairTowers from '@/components/fair/FairTowers';
    import FairUnbox from '@/components/fair/FairUnbox';
    import FairBattles from '@/components/fair/FairBattles';

    export default {
        name: 'ModalFair',
        components: {
            FairBlackjack,
            FairRoll,
            FairCrash,
            FairDuels,
            FairMines,
            FairTowers,
            FairUnbox,
            FairBattles
        },  
        data() {
            return {
                modalGame: 'Blackjack'
            }
        },
        methods: {
            modalSetGame(game) {
                this.modalGame = game;
            }
        }
    }
</script>

<style scoped>
    .modal-fair {
        width: 860px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 30px 30px 30px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% 0%, rgba(0, 255, 194, 0.2) 0%, rgba(7, 38, 61, 0) 80%), 
                    linear-gradient(256deg, #07263d 0%, #07243a 100%);
    }

    .modal-fair .fair-header {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .modal-fair .header-icon {
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: linear-gradient(255deg, rgba(0, 255, 194, 0.2)0%, rgba(0, 170, 109, 0.2) 100%);
    }

    .modal-fair .header-icon img {
        width: 48px;
        height: 48px;
    }

    .modal-fair .fair-header span {
        margin-top: 20px;
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-fair .fair-info {
        width: 100%;
        margin-top: 12px;
        padding-bottom: 30px;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .modal-fair .fair-nav {
        display: flex;
        flex-wrap: wrap;
        margin-top: 30px;
        padding: 4px;
        background: #071f2e;
        clip-path: polygon(11px 0, calc(100% - 11px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 11px) 100%, 11px 100%, 0 calc(100% - 14px), 0 14px);
    }

    .modal-fair .fair-nav button {
        height: 48px;
        position: relative;
        margin-right: 4px;
        padding: 1px;
        z-index: 1;
    }

    .modal-fair .fair-nav button:last-of-type {
        margin-right: 0;
    }

    .modal-fair .fair-nav button.button-active {
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15));
    }

    .modal-fair .fair-nav button.button-active:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #053236 0%, #01e0a3 100%);
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .modal-fair .fair-nav button.button-active:after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-color: #063543;
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .modal-fair .fair-nav button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
    }

    .modal-fair .fair-nav button.button-active .button-inner {
        background: radial-gradient(50% 50% at 50% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(255deg, rgba(0, 255, 194, 0.05) 0%, rgba(0, 170, 109, 0.05) 100%);
    }

    .modal-fair .fair-nav button .button-inner span {
        font-size: 14px;
        font-weight: 800;
        color: #bbbfd0;
    }

    .modal-fair .fair-nav button.button-active .button-inner span {
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .modal-fair .fair-content {
        width: 100%;
        margin-top: 30px;
    }

    @media only screen and (max-width: 955px) {

        .modal-fair {
            width: calc(100vw - 20px);
            padding: 85px 10px 48px 10px;
        }

    }

    @media only screen and (max-width: 825px) {

        .modal-fair .fair-nav button {
            width: calc(25% - 3px);
        }

        .modal-fair .fair-nav button:nth-child(4n) {
            margin-right: 0;
        }

        .modal-fair .fair-nav button .button-inner {
            padding: 0;
        }

    }
</style>
