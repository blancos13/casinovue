<template>
    <div class="upgrader">
        <UpgraderGame />
        <UpgraderItems />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import LoadingAnimation from '@/components/LoadingAnimation';
    import UpgraderGame from '@/components/upgrader/UpgraderGame';
    import UpgraderItems from '@/components/upgrader/UpgraderItems';

    export default {
        name: 'Upgrader',
        metaInfo: {
            title: 'Upgrader - GrowCsn.com'
        },
        components: {
            LoadingAnimation,
            UpgraderGame,
            UpgraderItems
        },
        methods: {
            ...mapActions([
                'socketConnectUpgrader', 
                'socketDisconnectUpgrader'
            ])
        },
        computed: {
            ...mapGetters([
                'socketUpgrader'
            ])
        },
        created() {
            this.socketConnectUpgrader();
        },
        beforeRouteLeave(to, from, next) {
            this.socketDisconnectUpgrader();
            next();
        }
    }
</script>

<style scoped>
    .upgrader {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 50px 10px;
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