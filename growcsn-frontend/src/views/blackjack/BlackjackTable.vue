<template>
    <div class="blackjack-table">
        <div v-if="blackjackTable !== null" class="table-header">
            <div class="header-left">
                <div class="left-title">
                    <router-link to="/blackjack" class="link-back">
                        <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 16.18L8 0.820004C8 0.0931494 7.24623 -0.277135 6.79868 0.244006L0.203166 7.92398C-0.0677208 8.23941 -0.0677208 8.76055 0.203166 9.07611L6.79867 16.7561C7.24623 17.2771 8 16.9068 8 16.18Z" />
                            <rect x="6" y="5" width="12" height="7" rx="1" />
                        </svg>
                    </router-link>
                    <div v-if="blackjackTable.game.type === 'standard'" class="title-standard">
                        STANDARD TABLES
                        <div class="title-limits">
                            (
                            <img src="@/assets/img/icons/coin.svg" alt="icon" />
                            <div class="limits-value">
                                <span>0</span>.10 <span>- 1,000</span>.00
                            </div>
                            )
                        </div>
                    </div>
                    <div v-else class="title-whale">
                        WHALE TABLES
                        <div class="title-limits">
                            (
                            <img src="@/assets/img/icons/coin.svg" alt="icon" />
                            <div class="limits-value">
                                <span>50</span>.00 <span>- 1,000</span>.00
                            </div>
                            )
                        </div>
                    </div>
                </div>
                <div class="left-info">LOBBY {{blackjackTable.table + 1}}, GAME ID = {{blackjackTable.game._id}}</div>
            </div>
            <button v-on:click="modalsSetShow('BlackjackRules')" class="button-rules">
                <IconInfo />
                <span class="gradient-yellow">GAME RULES</span>
            </button>
        </div>

        <BlackjackGame v-if="blackjackTable !== null" v-bind:table="blackjackTable" />
        <Bets />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconInfo from '@/components/icons/IconInfo';
    import Bets from '@/components/bets/Bets';
    import BlackjackGame from '@/components/blackjack/BlackjackGame';

    export default {
        name: 'Blackjack',
        metaInfo: {
            title: 'Blackjack - GrowCsn.com',
            meta: [{ name: 'description', content: 'GrowCsn.com the leading roblox gambling experience.' }]
        },
        components: {
            IconInfo,
            Bets,
            BlackjackGame
        },
        data() {
            return {
                blackjackTable: null
            }
        },
        methods: {
            ...mapActions([
                'modalsSetShow'
            ])
        },
        computed: {
            ...mapGetters([
                'socketBlackjack', 
                'blackjackTables'
            ])
        },
        watch: {
            'blackjackTables': {
                handler(data, oldData) {
                    if(this.blackjackTables.length >= 1) {
                        this.blackjackTable = this.blackjackTables[this.$route.params.tableId - 1];
                    }
                },
                deep: true
            }
        },
        created() {
            if(this.blackjackTables.length >= 1) {
                this.blackjackTable = this.blackjackTables[this.$route.params.tableId - 1];
            }
        }
    }
</script>

<style scoped>
    .blackjack-table {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 45px 10px;
    }

    .blackjack-table .table-header {
        width: 1090px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .blackjack-table .left-title {
        display: flex;
        align-items: center;
    }

    .blackjack-table .title-standard,
    .blackjack-table .title-whale {
        display: flex;
        align-items: center;
        /* font-family: 'Rubik'; */
        font-size: 28px;
        font-weight: 900;
        color: #ffffff;
    }

    .blackjack-table .left-title a.link-back {
        margin-right: 20px;
    }

    .blackjack-table .left-title a.link-back svg {
        fill: #c1c1c1;
    }

    .blackjack-table .title-limits {
        display: flex;
        align-items: center;
        margin-left: 15px;
        font-weight: 400;
        font-size: 28px;
        color: #c1c1c1;
    }

    .blackjack-table .limits-value {
        /* font-family: 'Open Sans'; */
        font-size: 12px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .blackjack-table .title-limits img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
    }

    .blackjack-table .limits-value span {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    .blackjack-table .left-info {
        margin-top: 10px;
        /* font-family: 'Rubik'; */
        font-size: 16px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .blackjack-table .table-header button.button-rules {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 700;
    }

    .blackjack-table .table-header button.button-rules svg {
        margin-right: 8px;
        fill: #ffb703;
    }

    @media only screen and (max-width: 1700px) {

        .blackjack-table .table-header {
            width: 100%;
        }

    }

    @media only screen and (max-width: 950px) {

        .blackjack-table {
            padding: 25px 10px 443px 10px;
        }

    }

    @media only screen and (max-width: 850px) {

        .blackjack-table .table-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .blackjack-table .table-header button.button-rules {
            margin-top: 20px;
        }

    }
</style>
