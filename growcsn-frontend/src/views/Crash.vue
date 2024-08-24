<template>
    <div class="crash">
        <div class="crash-container">
            <transition name="fade" mode="out-in">
                <div v-if="socketCrash.connected === false" class="container-loading" key="loading">
                    <div class="loading-element"></div>
                    <div class="loading-element"></div>
                </div>
                <div v-else class="container-data" key="data">
                    <div class="data-left">
                        <CrashGame />
                        <CrashHistory />
                    </div>

                    <CrashControls />
                </div>
            </transition>
        </div>

        <Bets />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import Bets from '@/components/bets/Bets';
    import CrashGame from '@/components/crash/CrashGame';
    import CrashHistory from '@/components/crash/CrashHistory';
    import CrashControls from '@/components/crash/CrashControls';

    export default {
        name: 'Crash',
        metaInfo: {
            title: 'Crash - GrowCsn.com'
        },
        components: {
            Bets,
            CrashGame,
            CrashHistory,
            CrashControls
        },
        methods: {
            ...mapActions(['socketConnectCrash', 'socketDisconnectCrash'])
        },
        computed: {
            ...mapGetters(['socketCrash']),
        },
        created() {
            this.socketConnectCrash();
        },
        beforeRouteLeave(to, from, next) {
            this.socketDisconnectCrash();
            next();
        }
    }
</script>

<style scoped>
    .crash {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 45px 10px;
    }

    .crash .crash-container {
        width: 1120px;
        border-radius: 25px;
        background: radial-gradient(163.2% 163.2% at 50% -31.45%, rgba(0, 194, 255, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, #07263d 0%, #07243a 100%);
        box-shadow: 0px 4px 10px rgba(7, 26, 41, 0.25);
    }

    .crash .container-loading {
        display: flex;
        justify-content: space-between;
        padding: 15px;
    }

    .crash .loading-element {
        height: 510px;
        position: relative;
        border-radius: 15px;
        background: #051f33;
        overflow: hidden;
    }

    .crash .loading-element:nth-child(1) {
        width: calc(100% - 290px);
    }

    .crash .loading-element:nth-child(2) {
        width: 275px;
    }

    .crash .loading-element::after {
        width: 100%;
        height: 100%;
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        animation-name: loading_animation;
        animation-duration: 1s;
        animation-timing-function: ease;
        animation-iteration-count: infinite;
        background: linear-gradient(to right, #ffffff00 0%, rgba(255, 255, 255, 0.1) 50%, #ffffff00 100%);
    }

    .crash .container-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .crash .container-loading.fade-leave-to {
        opacity: 0;
    }

    .crash .container-data {
        display: flex;
        justify-content: space-between;
        padding: 15px;
    }

    .crash .container-data.fade-enter-active {
        transition: opacity 0.5s;
    }

    .crash .container-data.fade-enter-from {
        opacity: 0;
    }

    .crash .data-left {
        width: calc(100% - 290px);
    }

    @keyframes loading_animation {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(100%); }
    }

    @media only screen and (max-width: 1140px) {
        
        .crash .crash-container {
            width: 100%;
        }

    }

    @media only screen and (max-width: 950px) {

        .crash {
            padding: 25px 10px 443px 10px;
        }

        .crash .container-loading,
        .crash .container-data {
            flex-direction: column;
            padding: 10px;
        }

        .crash .loading-element {
            width: 100%!important;
        }

        .crash .loading-element:nth-child(2) {
            height: 200px;
            margin-top: 15px;
        }

        .crash .data-left {
            width: 100%;
        }

    }
</style>
