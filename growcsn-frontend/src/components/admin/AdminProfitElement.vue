<template>
    <div class="admin-profit-element">
        <transition name="fade" mode="out-in">
            <div v-if="adminStatsData.data === null || adminStatsData.loading === true" class="element-loading" key="loading">
                <div class="element-loading"></div>
            </div>
            <div v-else class="element-content" key="content">
                <div class="element-title">{{adminGetTitle}}</div>
                <span class="gradient-green">${{adminFormatValue(stats.profit)}}</span>
                <div class="element-date">{{adminGetDate}}</div>
            </div>
        </transition>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'AdminProfitElement',
        props: ['type', 'stats'],
        methods: {
            adminFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        },
        computed: {
            ...mapGetters(['adminStatsData']),
            adminGetTitle() {
                let title = 'PROFIT ON ' + this.type.toUpperCase() + ' $';

                if(this.type === 'overall') {
                    title = 'OVERALL PROFIT $';
                }

                return title;
            },
            adminGetDate() {
                let range = new Date(this.stats.start).toLocaleDateString('en-US');

                if(this.type !== 'day') {
                    range = new Date(this.stats.start).toLocaleDateString('en-US') + ' - ' + new Date(this.stats.end).toLocaleDateString('en-US');
                }

                return range;
            }
        }
    }
</script>

<style scoped>
    .admin-profit-element {
        width: calc(25% - 22.5px);
        height: 230px;
        margin-right: 30px;
        border-radius: 15px;
        background: radial-gradient(90% 60% at 50% 50%, #032b4f 0%, #001425 100%);
        border: 1px solid #123e62;
    }

    .admin-profit-element:nth-child(4n) {
        margin-right: 0;
    }

    .admin-profit-element .element-loading {
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: 15px;
        overflow: hidden;
    }

    .admin-profit-element .element-loading::after {
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

    .admin-profit-element .element-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .admin-profit-element .element-loading.fade-leave-to {
        opacity: 0;
    }

    .admin-profit-element .element-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 25px 0;
    }

    .admin-profit-element .element-content.fade-enter-active {
        transition: opacity 0.5s;
    }

    .admin-profit-element .element-content.fade-enter-from {
        opacity: 0;
    }

    .admin-profit-element span {
        font-size: 32px;
        font-weight: 800;
        color: #f55046;
    }

    .admin-profit-element .element-title {
        text-align: center;
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    .admin-profit-element .element-date {
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        color: #7a93ac;
    }

    @keyframes loading_animation {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(100%); }
    }

    @media only screen and (max-width: 1450px) {

        .admin-profit-element {
            width: calc(50% - 15px);
            height: 230px;
            margin-right: 30px;
            border-radius: 15px;
        }

        .admin-profit-element:nth-child(1),
        .admin-profit-element:nth-child(2) {
            margin-bottom: 15px;
        }

        .admin-profit-element:nth-child(2n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 600px) {

        .admin-profit-element {
            width: 100%;
            height: 180px;
            margin-right: 0!important;
        }

        .admin-profit-element:nth-child(3) {
            margin-bottom: 15px;
        }

    }
</style>
