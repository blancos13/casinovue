<template>
    <div class="limiteds">
        <div class="limiteds-items">
            <div class="items-header">
                <div class="header-title">{{cashierGetRouteName.replace('Limiteds', '').toUpperCase()}} LIMITEDS</div>
                <div class="header-mid">
                    <CashierFilterSearch />
                </div>
                <div class="header-filter">
                    <CashierFilterAmount />
                    <CashierFilterSort />
                </div>
            </div>
            <div v-on:scroll="cashierContentScroll" class="items-content" ref="itemsContent">
                <transition name="slide-fade" mode="out-in">
                    <router-view/>
                </transition>
            </div>
        </div>
        
        <CashierLimitedSelected />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import CashierFilterSearch from '@/components/cashier/CashierFilterSearch';
    import CashierFilterAmount from '@/components/cashier/CashierFilterAmount';
    import CashierFilterSort from '@/components/cashier/CashierFilterSort';
    import CashierLimitedSelected from '@/components/cashier/CashierLimitedSelected';

    export default {
        name: 'Limiteds',
        metaInfo: {
            title: 'Limiteds - GrowCsn.com'
        },
        components: {
            CashierFilterSearch,
            CashierFilterAmount,
            CashierFilterSort,
            CashierLimitedSelected
        },
        data() {
            return {
                cashierFilterMin: '',
                cashierFilterMax: ''
            }
        },
        methods: {
            ...mapActions([ 
                'cashierGetLimitedDataSocket',
                'cashierSetLimitedDataPage'
            ]),
            cashierContentScroll() {
                const container = this.$refs.itemsContent;

                if (
                    container.scrollTop + container.clientHeight >= container.scrollHeight && 
                    this.cashierLimitedData[this.cashierGetRouteName.replace('Limiteds', '').toLowerCase()].length > this.cashierLimitedData.page * 60
                ) { 
                    this.cashierSetLimitedDataPage(this.cashierLimitedData.page + 1);
                }
            }
        },
        computed: {
            ...mapGetters([ 
                'cashierLimitedData'
            ]),
            cashierGetRouteName() {
                return this.$route.name;
            }
        },
        created() {
            if(this.cashierLimitedData.loading === false && new Date().getTime() - new Date(this.cashierLimitedData.loadedAt).getTime() >= 1000 * 60 * 2) {
                const data = {};
                this.cashierGetLimitedDataSocket(data);
            }
        }
    }
</script>

<style scoped>
    .limiteds {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 60px 30px;
    }

    .limiteds .limiteds-items {
        width: calc(100% - 280px);
        padding-right: 35px;
    }

    .limiteds .items-header {
        width: 100%;
        display: grid;
        grid-template-columns: 218px auto 409px;
        align-items: center;
        padding-bottom: 25px;
        border-bottom: 1px solid rgba(24, 72, 109, 0.5);
    }

    .limiteds .header-title,
    .limiteds .header-mid,
    .limiteds .header-filter {
        display: flex;
        align-items: center;
    }

    .limiteds .header-title {
        grid-column: 1 / 1;
        font-size: 20px;
        font-weight: 800;
        color: #6e95b6;
    }

    .limiteds .header-mid {
        grid-column: 2 / 2;
        padding-left: 25px;
    }

    .limiteds .header-filter {
        grid-column: 3 / 3;
    }

    .limiteds .items-content {
        width: 100%;
        height: 630px;
        min-height: 600px;
        margin-top: 17px;
        overflow-x: scroll;
    }

    .limiteds .slide-fade-enter-active {
        transition: all .3s ease-out;
    }

    .limiteds .slide-fade-enter {
        opacity: 0;
    }

    @media only screen and (max-width: 1300px) {

        .limiteds {
            padding: 60px 10px;
        }

        .limiteds .items-header {
            grid-template-columns: auto 409px;
            grid-template-rows: auto auto;
        }

        .limiteds .header-title {
            grid-column: 1 / 3;
            font-size: 20px;
            font-weight: 800;
            color: #6e95b6;
        }

        .limiteds .header-mid {
            grid-column: 1 / 1;
            grid-row: 2 / 2;
            margin-top: 10px;
            padding-left: 0;
        }

        .limiteds .header-filter {
            grid-column: 2 / 2;
            grid-row: 2 / 2;
            margin-top: 10px;
        }

    }

    @media only screen and (max-width: 1100px) {

        .limiteds .limiteds-items {
            width: 100%;
            padding-right: 0;
        }

    }

    @media only screen and (max-width: 700px) {

        .limiteds .items-header {
            grid-template-columns: auto;
            grid-template-rows: auto auto auto;
        }

        .limiteds .header-title {
            width: 100%;
            grid-column: 1 / 1;
        }

        .limiteds .header-mid {
            width: 100%;
        }

        .limiteds .header-filter {
            width: 100%;
            grid-column: 1 / 1;
            grid-row: 3 / 3;
        }

    }

    @media only screen and (max-width: 500px) {

        .limiteds .header-filter {
            flex-direction: column;
        }

    }
</style>