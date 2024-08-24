<template>
    <div class="unbox">
        <div class="unbox-header">
            <UnboxHeaderOverview v-if="unboxGetRouteName === 'UnboxOverview'" />
            <UnboxHeaderBox v-else-if="unboxGetRouteName === 'UnboxBox'" />
        </div>
        <div class="unbox-content">
            <transition name="slide-fade" mode="out-in">
                <router-view/>
            </transition>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import UnboxHeaderOverview from '@/components/unbox/UnboxHeaderOverview';
    import UnboxHeaderBox from '@/components/unbox/UnboxHeaderBox';

    export default {
        name: 'Unbox',
        metaInfo: {
            title: 'Unbox - GrowCsn.com'
        },
        components: {
            UnboxHeaderOverview,
            UnboxHeaderBox
        },
        methods: {
            ...mapActions([
                'socketConnectUnbox', 
                'socketDisconnectUnbox'
            ])
        },
        computed: {
            unboxGetRouteName() {
                return this.$route.name;
            }
        },
        created() {
            this.socketConnectUnbox();
        },
        beforeRouteLeave(to, from, next) {
            this.socketDisconnectUnbox();
            next();
        }
    }
</script>

<style scoped>
    .unbox {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 50px 10px;
    }

    .unbox .unbox-header {
        width: 1250px;
        border-bottom: 1px solid rgba(28, 71, 182, 0.15);
    }

    .unbox .unbox-content {
        width: 1250px;
        margin-top: 25px;
    }

    @media only screen and (max-width: 1270px) {

        .unbox .unbox-header {
            width: 100%;
        }

        .unbox .unbox-content {
            width: 100%;
        }

    }
</style>