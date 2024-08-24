<template>
    <div class="towers">
        <div class="towers-container">
            <div class="container-game" v-bind:class="['game-' + towersRisk]">
                <TowersRow v-for="row in 8" v-bind:key="row" v-bind:row="row - 1" />
            </div>
            <TowersControls />
        </div>
        
        <Bets />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import Bets from '@/components/bets/Bets';
    import TowersRow from '@/components/towers/TowersRow';
    import TowersControls from '@/components/towers/TowersControls';

    export default {
        name: 'Towers',
        metaInfo: {
            title: 'Towers - GrowCsn.com'
        },
        components: {
            Bets,
            TowersRow,
            TowersControls
        },
        methods: {
            ...mapActions([
                'socketConnectTowers', 
                'socketDisconnectTowers'
            ])
        },
        computed: {
            ...mapGetters([
                'towersRisk'
            ]),
        },
        created() {
            this.socketConnectTowers();
        },
        beforeRouteLeave(to, from, next) {
            this.socketDisconnectTowers();
            next();
        }
    }
</script>

<style scoped>
    .towers {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 45px 10px;
    }

    .towers .towers-container {
        width: 525px;
        padding: 20px 0;
        border-radius: 25px;
        background: rgba(3, 20, 33, 0.66);
        border: 1px solid rgba(20, 68, 104, 0.35);
        box-shadow: 0px 4px 10px rgba(7, 26, 41, 0.25);
    }

    .towers .container-game {
        width: 100%;
        display: flex;
        flex-direction: column-reverse;
    }

    @media only screen and (max-width: 1150px) {

        .towers {
            padding: 25px 10px 45px 10px;
        }

    }

    @media only screen and (max-width: 950px) {

        .towers {
            padding: 25px 10px 443px 10px;
        }

    }

    @media only screen and (max-width: 545px) {

        .towers .towers-container {
            width: 100%;
        }

    }
</style>