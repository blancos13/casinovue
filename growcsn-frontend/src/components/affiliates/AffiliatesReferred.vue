<template>
    <div class="affiliates-referred">
        <div class="referred-header">
            <div class="header-user">USER</div>
            <div class="header-earned">TOTAL EARNED</div>
            <div class="header-deposited">TOTAL WAGERED</div>
        </div>
        <div class="referred-list">
            <transition name="fade" mode="out-in">
                <div v-if="affiliatesData.referred === null || affiliatesData.loading === true" class="list-loading" key="loading">

                    <LoadingAnimation />

                </div>
                <div v-else-if="affiliatesData.referred.length > 0" class="list-data" key="data">

                    <AffiliatesReferredElement v-for="(referred, index) in affiliatesData.referred" v-bind:key="index" v-bind:referred="referred" />

                </div>
                <div v-else class="list-empty" key="empty">No referred users found.</div>
            </transition>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import LoadingAnimation from '@/components/LoadingAnimation';
    import AffiliatesReferredElement from '@/components/affiliates/AffiliatesReferredElement';

    export default {
        name: 'AffiliatesReferred',
        components: {
            LoadingAnimation,
            AffiliatesReferredElement
        },
        computed: {
            ...mapGetters(['affiliatesData'])
        }
    }
</script>

<style scoped>
    .affiliates-referred {
        width: 955px;
        margin-top: 35px;
    }

    .affiliates-referred .referred-header {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 25px;
    }

    .affiliates-referred .header-user {
        width: 60%;
        font-size: 12px;
        font-weight: 800;
        color: #8bacc8;
    }

    .affiliates-referred .header-earned,
    .affiliates-referred .header-deposited {
        width: 20%;
        font-size: 12px;
        font-weight: 800;
        color: #8bacc8;
    }

    .affiliates-referred .referred-list {
        width: 100%;
        margin-top: 10px;
    }

    .affiliates-referred .list-loading {
        width: 100%;
        height: 270px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .affiliates-referred .list-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .affiliates-referred .list-loading.fade-leave-to {
        opacity: 0;
    }

    .affiliates-referred .list-data {
        width: 100%;
    }

    .affiliates-referred .list-empty {
        width: 100%;
        height: 270px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
    }

    .affiliates-referred .list-data.fade-enter-active,
    .affiliates-referred .list-empty.fade-enter-active {
        transition: opacity 0.5s;
    }

    .affiliates-referred .list-data.fade-enter-from,
    .affiliates-referred .list-empty.fade-enter-from {
        opacity: 0;
    }

    @media only screen and (max-width: 975px) {

        .affiliates-referred {
            width: 100%;
        }

    }

    @media only screen and (max-width: 700px) {

        .affiliates-referred .header-user {
            width: 100%;
        }

        .affiliates-referred .header-earned,
        .affiliates-referred .header-deposited {
            display: none;
        }

    }
</style>
