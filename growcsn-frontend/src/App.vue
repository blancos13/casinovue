<template>
    <div id="app">
        <transition name="fade" mode="out-in">
            <AppLoader v-if="generalSettings === null || (authToken !== null && authUser.user === null)" key="loading" />
            <div v-else-if="generalSettings.general.maintenance.enabled === false || (authUser.user !== null && authUser.user.rank === 'admin')" class="app-page" key="page">
                <Chat />
                <Navbar />
                <main v-bind:class="{ 'main-background': appHasBackground === true }" ref="mainContainer">
                    <transition name="slide-fade" mode="out-in">
                        <router-view />
                    </transition>
                    <Footer />
                </main>

                <Modals />
                <Notifications />
            </div>
            <AppMaintenance v-else key="maintenance" />
        </transition>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AppLoader from '@/components/AppLoader';
    import AppMaintenance from '@/components/AppMaintenance';
    import Navbar from '@/components/navbar/Navbar';
    import Chat from '@/components/chat/Chat';
    import Footer from '@/components/footer/Footer';
    import Modals from '@/components/modals/Modals';
    import Notifications from '@/components/notifications/Notifications';

    export default {
        components: {
            AppLoader,
            AppMaintenance,
            Navbar,
            Chat,
            Footer,
            Modals,
            Notifications
        },
        methods: {
            ...mapActions(['socketConnectGeneral'])
        },
        computed: {
            ...mapGetters(['socketGeneral', 'generalSettings', 'authToken', 'authUser']),
            appGetRouteName() {
                return this.$route.name;
            },
            appHasBackground() {
                let background = true;

                if(['ProfileTransactions', 'ProfileGames', 'ProfileSettings', 'UnboxOverview', 'UnboxBox', 'BattlesOverview', 'BattlesCreate', 'BattlesGame', 'CashierLimiteds'].includes(this.appGetRouteName) === true) {
                    background = false;
                }   


                return background;
            }
        },
        watch: {
            '$route': {
                handler(to, from) {
                    if(this.$refs.mainContainer !== undefined) {
                        this.$nextTick(() => {
                            const mainContainer = this.$refs.mainContainer;
                            mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
                        });
                    }
                }
            }
        },
        created() {
            this.socketConnectGeneral();
        }
    }
</script>

<style>
    body .app-loader.fade-leave-active {
        transition: opacity 0.5s ease;
    }

    body .app-loader.fade-leave-active {
        opacity: 0;
    }

    body .app-page {
        width: 100%;
        height: 100%;
    }

    body .app-page.fade-enter-active,
    body .app-maintenance.fade-enter-active {
        transition: opacity 0.5s ease;
    }

    body .app-page.fade-enter-from,
    body .app-maintenance.fade-enter-from {
        opacity: 0;
    }

    body .app-page main {
        width: calc(100% - 325px);
        height: calc(100% - 100px);
        position: fixed;
        top: 100px;
        right: 325px;
        overflow-x: hidden;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    /*
    body .app-page main.main-background {
        background-image: url('~@/assets/img/background.png');
        background-repeat: no-repeat;
        background-position: center 35px;
    }
    */

    body .app-page main::-webkit-scrollbar-track {
        background-color: transparent;
    }

    body .app-page main::-webkit-scrollbar-thumb {
        background-color: transparent;
    }

    body .app-page main::-webkit-scrollbar {
        width: 0;
        height: 0;
    }

    body .app-page main .slide-fade-enter-active {
       transition: all .3s ease-out;
   }

    body .app-page main .slide-fade-enter {
       opacity: 0;
   }

   @media only screen and (max-width: 1500px) {

       body .app-page main {
           width: 100%;
           right: 0;
       }

   }

   @media only screen and (max-width: 1175px) {

       body .app-page main {
           height: calc(100% - 80px);
           top: 80px;
       }

   }
</style>
