<template>
    <div class="upgrader-items">
        <div class="items-header">
            <UpgraderFilterSearch />

            <div class="header-filters">
                <UpgraderFilterAmount />
                <UpgraderFilterSort />
            </div>
        </div>
        <div class="items-content">
            <transition name="fade" mode="out-in">
                <div v-if="upgraderItemList.data === null || upgraderItemList.loading === true" class="content-loading" key="loading">

                    <LoadingAnimation />

                </div>
                <div v-else-if="upgraderItemList.data.length > 0" class="content-list" key="data">

                    <UpgraderItemElement v-for="item in upgraderItemList.data" v-bind:key="item._id" v-bind:item="item" />

                </div>
                <div v-else class="content-empty" key="empty">No boxes found.</div>
            </transition>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import LoadingAnimation from '@/components/LoadingAnimation';
    import UpgraderFilterSearch from '@/components/upgrader/UpgraderFilterSearch';
    import UpgraderFilterAmount from '@/components/upgrader/UpgraderFilterAmount';
    import UpgraderFilterSort from '@/components/upgrader/UpgraderFilterSort';
    import UpgraderItemElement from '@/components/upgrader/UpgraderItemElement';

    export default {
        name: 'UpgraderItems',
        components: {
            LoadingAnimation,
            UpgraderFilterSearch,
            UpgraderFilterAmount,
            UpgraderFilterSort,
            UpgraderItemElement
        },
        methods: {
            ...mapActions([
                'upgraderGetItemListSocket'
            ])
        },
        computed: {
            ...mapGetters([
                'socketUpgrader',
                'upgraderFilterSearch',
                'upgraderFilterAmount',
                'upgraderFilterSort',
                'upgraderItemList'
            ])
        },
        created() {
            const data = { page: this.upgraderItemList.page, search: this.upgraderFilterSearch, sort: this.upgraderFilterSort };
            this.upgraderGetItemListSocket(data);
        }
    }
</script>

<style scoped>
    .upgrader-items {
        width: 1200px;
        margin-top: 35px;
        padding-top: 20px;
        border-top: 1px solid rgba(41, 114, 169, 0.16);
    }

    .upgrader-items .items-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .upgrader-items .header-filters {
        display: flex;
    }

    .upgrader-items .items-content {
        width: 100%;
        margin-top: 20px;
    }

    .upgrader-items .content-loading {
        width: 100%;
        height: 330px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .upgrader-items .content-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .upgrader-items .content-loading.fade-leave-to {
        opacity: 0;
    }

    .upgrader-items .content-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .upgrader-items .content-empty {
        width: 100%;
        height: 220px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
    }

    .upgrader-items .content-list.fade-enter-active,
    .upgrader-items .content-empty.fade-enter-active {
        transition: opacity 0.5s;
    }

    .upgrader-items .content-list.fade-enter-from,
    .upgrader-items .content-empty.fade-enter-from {
        opacity: 0;
    }
</style>