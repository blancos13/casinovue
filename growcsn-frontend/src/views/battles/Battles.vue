<template>
    <div class="battles">
        <div class="battles-header">
            <BattlesHeaderOverview v-if="battlesGetRouteName === 'BattlesOverview'" />
            <BattlesHeaderCreate v-else-if="battlesGetRouteName === 'BattlesCreate'" />
            <BattlesHeaderGame v-else-if="battlesGetRouteName === 'BattlesGame'" />
        </div>
        <div class="battles-content">
            <transition name="slide-fade" mode="out-in">
                <router-view v-bind:key="$route.fullPath" />
            </transition>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import BattlesHeaderOverview from '@/components/battles/BattlesHeaderOverview';
    import BattlesHeaderCreate from '@/components/battles/BattlesHeaderCreate';
    import BattlesHeaderGame from '@/components/battles/BattlesHeaderGame';

    export default {
        name: 'Battles',
        metaInfo: {
            title: 'Battles - GrowCsn.com'
        },
        components: {
            BattlesHeaderOverview,
            BattlesHeaderCreate,
            BattlesHeaderGame
        },
        methods: {
            ...mapActions([
                'socketConnectBattles', 
                'socketDisconnectBattles'
            ])
        },
        computed: {
            battlesGetRouteName() {
                return this.$route.name;
            }
        },
        created() {
            this.socketConnectBattles();
        },
        beforeRouteLeave(to, from, next) {
            this.socketDisconnectBattles();
            next();
        }
    }
</script>

<style scoped>
    .battles {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 50px 10px;
    }

    .battles .battles-header {
        width: 1250px;
        border-bottom: 1px solid rgba(28, 71, 182, 0.15);
    }

    .battles .battles-content {
        width: 1250px;
        margin-top: 20px;
    }

    @media only screen and (max-width: 1270px) {

        .battles .battles-header {
            width: 100%;
        }

        .battles .battles-content {
            width: 100%;
        }

    } 
</style>