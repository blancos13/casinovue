<template>
    <div class="roll">
        <RollBets />

        <div class="roll-container">
            <RollGame />
            <RollHistory />
            <RollControls />
            <RollUserBets />
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import RollBets from '@/components/roll/RollBets';
    import RollGame from '@/components/roll/RollGame';
    import RollHistory from '@/components/roll/RollHistory';
    import RollControls from '@/components/roll/RollControls';
    import RollUserBets from '@/components/roll/RollUserBets';

    export default {
        name: 'Roll',
        metaInfo: {
            title: 'Roll - GrowCsn.com'
        },
        components: {
            RollBets,
            RollGame,
            RollHistory,
            RollControls,
            RollUserBets
        },
        methods: {
            ...mapActions(['socketConnectRoll', 'socketDisconnectRoll'])
        },
        created() {
            this.socketConnectRoll();
        },
        beforeRouteLeave(to, from, next) {
            this.socketDisconnectRoll();
            next();
        }
    }
</script>

<style scoped>
    .roll {
        width: 100%;
        display: flex;
        padding: 45px 0;
    }

    .roll .roll-container {
        width: calc(100% - 320px);
        padding: 0 25px;
    }

    @media only screen and (max-width: 1250px) {

        .roll .roll-bets {
            display: none;
        }

        .roll .roll-container {
            width: 100%;
            margin-left: 0;
            padding: 0 10px;
        }

    }
</style>
