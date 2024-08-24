<template>
    <div class="unbox-overview">
        <transition name="fade" mode="out-in">
            <div v-if="socketUnbox.connected === false" class="overview-loading" key="loading">

                <div class="loading-placeholder"></div>
                <div class="loading-placeholder"></div>
                <div class="loading-placeholder"></div>
                <div class="loading-placeholder"></div>
                <div class="loading-placeholder"></div>
                <div class="loading-placeholder"></div>
                <div class="loading-placeholder"></div>

            </div>
            <div v-else-if="unboxGetBoxes.length > 0" class="overview-list" key="data">

                <UnboxBoxElement v-for="box of unboxGetBoxes" v-bind:key="box._id" v-bind:box="box" />

            </div>
            <div v-else class="overview-empty" key="empty">There are no boxes.</div>
        </transition>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import UnboxBoxElement from '@/components/unbox/UnboxBoxElement';

    export default {
        name: 'UnboxOverview',
        components: {
            UnboxBoxElement
        },
        computed: {
            ...mapGetters([
                'socketUnbox',
                'unboxFilterSearch',
                'unboxFilterSort',
                'unboxFilterSelect',
                'unboxBoxes'
            ]),
            unboxGetBoxes() {
                let boxes = [];

                for(const box of this.unboxBoxes) {
                    if(box.categories.includes(this.unboxFilterSelect) === true && box.name.toLowerCase().includes(this.unboxFilterSearch.toLowerCase().trim()) === true) {
                        boxes.push(box);
                    }
                }

                if(this.unboxFilterSort === 'highest') { boxes.sort(function(a, b) { return b.amount - a.amount; }); }
                else { boxes.sort(function(a, b) { return a.amount - b.amount; }); }

                return boxes;
            }
        }
    }
</script>

<style scoped>
    .unbox-overview {
        width: 100%;
    }

    .unbox-overview .overview-loading,
    .unbox-overview .overview-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .unbox-overview .overview-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .unbox-overview .overview-loading.fade-leave-to {
        opacity: 0;
    }

    .unbox-overview .loading-placeholder {
        width: calc(14.28% - 7.7px);
        height: 220px;
        position: relative;
        margin-bottom: 10px;
        margin-right: 9px;
        background: linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.09) 50%, rgba(5, 29, 48, 0.35) 100%);
        border: 1px solid #0a273f;
        overflow: hidden;
    }

    .unbox-overview .loading-placeholder:after {
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

    .unbox-overview .loading-placeholder:nth-child(7n) {
        margin-right: 0;
    }

    .unbox-overview .overview-empty {
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

    .unbox-overview .overview-list.fade-enter-active,
    .unbox-overview .overview-empty.fade-enter-active {
        transition: opacity 0.5s;
    }

    .unbox-overview .overview-list.fade-enter-from,
    .unbox-overview .overview-empty.fade-enter-from {
        opacity: 0;
    }

    @keyframes loading_animation {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(100%); }
    }

    @media only screen and (max-width: 1200px) {

        .unbox-overview .loading-placeholder {
            width: calc(16.66% - 7.5px);
        }

        .unbox-overview .loading-placeholder:nth-child(7n) {
            margin-right: 9px;
        }

        .unbox-overview .loading-placeholder:nth-child(6n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 1050px) {

        .unbox-overview .loading-placeholder {
            width: calc(20% - 7.2px);
        }

        .unbox-overview .loading-placeholder:nth-child(6n) {
            margin-right: 9px;
        }

        .unbox-overview .loading-placeholder:nth-child(5n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 800px) {

        .unbox-overview .loading-placeholder {
            width: calc(25% - 6.75px);
        }

        .unbox-overview .loading-placeholder:nth-child(5n) {
            margin-right: 9px;
        }

        .unbox-overview .loading-placeholder:nth-child(4n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 650px) {

        .unbox-overview .loading-placeholder {
            width: calc(33.33% - 6px);
        }

        .unbox-overview .loading-placeholder:nth-child(4n) {
            margin-right: 9px;
        }

        .unbox-overview .loading-placeholder:nth-child(3n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 500px) {

        .unbox-overview .loading-placeholder {
            width: calc(50% - 4.5px);
        }

        .unbox-overview .loading-placeholder:nth-child(3n) {
            margin-right: 9px;
        }

        .unbox-overview .loading-placeholder:nth-child(2n) {
            margin-right: 0;
        }

    }
</style>