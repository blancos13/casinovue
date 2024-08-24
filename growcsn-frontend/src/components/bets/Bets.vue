<template>
    <div class="bets">
        <div class="bets-nav">
            <button v-if="authUser.user !== null" v-on:click="betsSetTab('my')" class="nav-link" v-bind:class="{ 'link-active': betsTab === 'my' }">MY BETS</button>
            <button v-on:click="betsSetTab('all')" class="nav-link" v-bind:class="{ 'link-active': betsTab === 'all' }">ALL</button>
            <button v-on:click="betsSetTab('whale')" class="nav-link" v-bind:class="{ 'link-active': betsTab === 'whale' }">WHALE WINS</button>
            <button v-on:click="betsSetTab('lucky')" class="nav-link" v-bind:class="{ 'link-active': betsTab === 'lucky' }">LUCKY WINS</button>
        </div>
        <div class="bets-list">
            <div class="list-head">
                <div class="head-game">GAME</div>
                <div class="head-user">USER</div>
                <div class="head-time">TIME</div>
                <div class="head-wager">WAGER</div>
                <div class="head-multiplier">MULTIPLIER</div>
                <div class="head-payout">PAYOUT</div>
            </div>
            <div class="list-content">
                <transition name="fade" mode="out-in">
                    <div v-if="generalBets.bets === null || generalBets.loading === true" class="content-loading" key="loading">
                        <LoadingAnimation />
                    </div>
                    <div v-else-if="betsGetList.length > 0" class="content-list" key="data">

                        <BetsElement v-for="bet in betsGetList" v-bind:key="bet._id + betsTab" v-bind:bet="bet" />

                    </div>
                    <div v-else class="content-empty" key="empty">No bets found.</div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import LoadingAnimation from '@/components/LoadingAnimation';
    import BetsElement from '@/components/bets/BetsElement';

    export default {
        name: 'Bets',
        components: {
            LoadingAnimation,
            BetsElement
        },
        data() {
            return {
                betsTab: 'all'
            }
        },
        methods: {
            ...mapActions([
                'generalGetBetsDataSocket'
            ]),
            betsSetTab(tab) {
                this.betsTab = tab;
            }
        },
        computed: {
            ...mapGetters([
                'authUser', 
                'generalBets'
            ]),
            betsGetList() {
                let bets = [];

                if(this.generalBets.bets !== null && this.generalBets.bets[this.betsTab] !== undefined) {
                    bets = this.generalBets.bets[this.betsTab].slice(0, 12);
                }

                return bets;
            }
        },
        created() {
            if(this.generalBets.bets === null && this.generalBets.loading === false) {
                const data = {};
                this.generalGetBetsDataSocket(data);
            }
        }
    }
</script>

<style scoped>
    .bets {
        width: 1050px;
        margin-top: 50px;
    }

    .bets .bets-nav {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .bets .bets-nav button.nav-link {
        position: relative;
        margin-right: 40px;
        padding-bottom: 23px;
        font-size: 14px;
        font-weight: 700;
        font-family: knight!important;
        color: #bbbfd0;
        transition: all 0.3s ease;
    }

    .bets .bets-nav button.nav-link:last-of-type {
        margin-right: 0;
    }

    .bets .bets-nav button.nav-link::after {
       content: '';
       width: 100%;
       height: 1px;
       position: absolute;
       left: 0;
       bottom: 0;
       background-color: #ffffff;
       transition: all 0.3s ease;
       opacity: 0;
   }

   .bets .bets-nav button.nav-link.link-active {
       color: #ffffff;
   }

   .bets .bets-nav button.nav-link.link-active::after {
       opacity: 1;
   }

   .bets .bets-list {
       width: 100%;
       height: 440px;
       position: relative;
       border-radius: 15px;
       overflow: hidden;
   }

   .bets .bets-list::after {
       content: '';
       width: 100%;
       height: 28px;
       position: absolute;
       bottom: 0;
       left: 0;
       background: linear-gradient(0deg, rgba(1, 22, 39, 0.75) 0%, rgba(1, 22, 39, 0) 100%);
       z-index: 1;
   }

   .bets .list-head {
        width: 100%;
        height: 52px;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 35px;
        background-color: #082842;
   }

   .bets .head-game {
       width: 20%;
       font-weight: 700;
       font-size: 14px;
       color: #8bacc8;
   }

   .bets .head-user {
       width: 20%;
       font-weight: 700;
       font-size: 14px;
       color: #8bacc8;
   }

   .bets .head-time {
       width: 20%;
       font-weight: 700;
       font-size: 14px;
       color: #8bacc8;
   }

   .bets .head-wager {
        width: 15%;
        font-weight: 700;
        font-size: 14px;
        color: #8bacc8;
    }

    .bets .head-multiplier {
        width: 10%;
        font-weight: 700;
        font-size: 14px;
        color: #8bacc8;
    }

    .bets .head-payout {
        width: 15%;
        text-align: right;
        font-weight: 700;
        font-size: 14px;
        color: #8bacc8;
    }

    .bets .list-content {
        width: 100%;
        height: calc(100% - 52px);
        overflow: hidden;
    }

    .bets .content-loading {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .bets .content-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .bets .content-loading.fade-leave-to {
        opacity: 0;
    }

    .bets .content-data {
        width: 100%;
    }

    .bets .content-empty {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
    }

    .bets .content-list.fade-enter-active,
    .bets .content-empty.fade-enter-active {
        transition: opacity 0.5s;
    }

    .bets .content-list.fade-enter-from,
    .bets .content-empty.fade-enter-from {
        opacity: 0;
    }

   @media only screen and (max-width: 1100px) {

       .bets {
           width: 100%;
       }

   }

   @media only screen and (max-width: 950px) {

       .bets {
           position: absolute;
           left: 0;
           bottom: 0;
           margin-top: 0;
       }

       .bets .bets-nav button.nav-link {
           padding-bottom: 8px;
       }

       .bets .bets-list {
            height: 388px;
            border-radius: 0;
        }

       .bets .list-head {
            display: none;
       }

       .bets .list-content {
            height: 100%;
        }

   }

   @media only screen and (max-width: 600px) {

       .bets .bets-nav button.nav-link {
           margin-right: 15px;
           font-size: 12px;
       }

   }
</style>
