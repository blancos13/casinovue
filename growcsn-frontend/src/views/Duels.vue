<template>
    <div class="duels">

        <DuelsControls />
        <DuelsStats />
        <DuelsGames />
        <Bets />

    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import Bets from '@/components/bets/Bets';
    import DuelsControls from '@/components/duels/DuelsControls';
    import DuelsStats from '@/components/duels/DuelsStats';
    import DuelsGames from '@/components/duels/DuelsGames';

    export default {
        name: 'Duels',
        metaInfo: {
            title: 'Dice Duels - GrowCsn.com'
        },
        components: {
            Bets,
            DuelsControls,
            DuelsStats,
            DuelsGames
        },
        methods: {
            ...mapActions([
                'socketConnectDuels', 
                'socketDisconnectDuels',
                'duelsGetGameDataSocket',
                'modalsSetShow'
            ])
        },
        computed: {
            ...mapGetters([
                'socketDuels'
            ])
        },
        watch: {
            'socketDuels.connected': {
                handler() {
                    if(this.socketDuels.connected && this.$route.query.game !== undefined) {
                        const data = { gameId: this.$route.query.game };
                        this.duelsGetGameDataSocket(data);

                        this.modalsSetShow('DuelsGame');
                    }
                }
            }
        },
        created() {
            this.socketConnectDuels();
        },
        beforeRouteUpdate(to, from) {
            if(this.socketDuels.connected && this.$route.query.game !== undefined) {
                const data = { gameId: this.$route.query.game };
                this.duelsGetGameDataSocket(data);

                this.modalsSetShow('DuelsGame');
            }
        },
        beforeRouteLeave(to, from, next) {
            this.socketDisconnectDuels();
            next();
        }
    }
</script>

<style scoped>
    .duels {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 45px 10px;
    }

    @media only screen and (max-width: 1150px) {

        .duels {
            padding: 25px 10px 45px 10px;
        }

    }

    @media only screen and (max-width: 950px) {

        .duels {
            padding: 25px 10px 443px 10px;
        }

    }
</style>
