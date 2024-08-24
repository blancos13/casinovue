<template>
    <div class="crash-history">
        <transition-group class="history-list" name="list" tag="div">

            <CrashHistoryElement v-for="game of crashHistory" v-bind:key="game._id" v-bind:game="game" />

        </transition-group>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import CrashHistoryElement from '@/components/crash/CrashHistoryElement';

    export default {
        name: 'CrashHistory',
        components: {
            CrashHistoryElement
        },
        computed: {
            ...mapGetters([
                'crashHistory'
            ])
        }
    }
</script>

<style scoped>
    .crash-history {
        width: 100%;
        height: 35px;
        position: relative;
        margin-top: 15px;
        overflow: hidden;

    }

    .crash-history::after {
        content: '';
        width: 60px;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        background: linear-gradient(90deg, rgba(7, 44, 68, 0) 0%, #072c44 100%);
        z-index: 1;
    }

    .crash-history .history-list {
        display: flex;
    }

    .crash-history .list-enter-active {
        transition: all 0.5s;
    }

    .crash-history .list-enter {
        opacity: 0;
        transform: translateX(-15px);
    }

    @media only screen and (max-width: 1140px) {

        .crash-history {
            margin-top: 10px;
        }

    }
</style>
