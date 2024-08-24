<template>
    <div class="modal-duels-game">
        <div v-if="duelsGameData.loading !== true && duelsGameData.game !== null" class="game-content">
            <DuelsGameHeader v-bind:duelsGame="duelsGame" />
            <DuelsGameStats v-bind:duelsGame="duelsGame" />
            <DuelsGameRoller v-bind:duelsGame="duelsGame" />
            <DuelsGameWinner v-bind:duelsGame="duelsGame" />
            <DuelsGameFair v-bind:duelsGame="duelsGame" />
        </div>
        <DuelsGameUsers v-if="duelsGameData.loading !== true && duelsGameData.game !== null" v-bind:duelsGame="duelsGame" />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import DuelsGameHeader from '@/components/duels/DuelsGameHeader';
    import DuelsGameStats from '@/components/duels/DuelsGameStats';
    import DuelsGameRoller from '@/components/duels/DuelsGameRoller';
    import DuelsGameWinner from '@/components/duels/DuelsGameWinner';
    import DuelsGameFair from '@/components/duels/DuelsGameFair';
    import DuelsGameUsers from '@/components/duels/DuelsGameUsers';

    export default {
        name: 'ModalDuelsGame',
        components: {
            DuelsGameHeader,
            DuelsGameStats,
            DuelsGameRoller,
            DuelsGameWinner,
            DuelsGameFair,
            DuelsGameUsers
        },
        data() {
            return {
                duelsGame: null
            }
        },
        methods: {
            duelsStartGame(step) {
                let game = JSON.parse(JSON.stringify(this.duelsGameData.game));

                for(let i = 0; i < this.duelsGameData.game.bets.length; i++) {
                    if(i > step) {
                        delete game.bets[i].roll;
                    }
                }

                if(step <= this.duelsGameData.game.bets.length - 1) {
                    delete game.winner;

                    const left = (new Date(this.duelsGameData.game.updatedAt).getTime() + this.generalTimeDiff) + (this.duelsFilterAnimation === 'fast' ? 3000 : 5000) * (step + 1) - (new Date().getTime() + this.generalTimeDiff);
                    setTimeout(() => { this.duelsStartGame(step + 1); }, left);
                }

                this.duelsGame = game;
            }
        },
        computed: {
            ...mapGetters([
                'generalTimeDiff',  
                'duelsFilterAnimation',
                'duelsGameData'
            ])
        },
        watch: {
            'duelsGameData': {
                deep: true,
                handler() {
                    if(this.duelsGameData.loading !== true && this.duelsGameData.game !== null) {
                        if(this.duelsGameData.game.state === 'rolling') {
                            this.duelsStartGame(0);
                        } else  {
                            this.duelsGame = this.duelsGameData.game;
                        }
                    }
                }
            }
        },
        created() {
            if(this.duelsGameData.loading !== true && this.duelsGameData.game !== null) {
                if(this.duelsGameData.game.state === 'rolling') {
                    let step = Math.floor(((new Date().getTime() + this.generalTimeDiff) - (new Date(this.duelsGameData.game.updatedAt).getTime() + this.generalTimeDiff)) / (this.duelsFilterAnimation === 'fast' ? 3000 : 5000));
                    step = step <= 0 ? 0 : step;

                    this.duelsStartGame(step);
                } else  {
                    this.duelsGame = this.duelsGameData.game;
                }
            }
        }
    }
</script>

<style scoped>
    .modal-duels-game {
        width: 1210px;
        position: relative;
        display: flex;
        align-items: flex-start;
        padding: 12px;
        border-radius: 15px;
        background: radial-gradient(285% 150% at 50% 50%, #001e37 0%, #000e1a 100%);
        border: 1px solid #24435e;
        box-shadow: 0px 4px 50px rgba(0, 0, 0, 0.5);
    }

    .modal-duels-game .game-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 13px 325px 13px 13px;
    }

    @media only screen and (max-width: 1230px) {

        .modal-duels-game {
            width: calc(100vw - 20px);
        }

    }

    @media only screen and (max-width: 1050px) {

        .modal-duels-game .game-content {
            width: 100%;
            padding: 8px 0 325px 0;
        }

    }
</style>
