<template>
    <div class="roll-history">
        <div class="history-title">PREVIOUS ROLLS</div>
        <transition-group class="history-list" name="list" tag="div">

            <RollHistoryElement v-for="game of rollHistory" v-bind:key="game._id" v-bind:game="game" />

        </transition-group>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import RollHistoryElement from '@/components/roll/RollHistoryElement';

    export default {
        name: 'RollHistory',
        components: {
            RollHistoryElement
        },
        computed: {
            ...mapGetters([
                'rollHistory'
            ])
        }
    }
</script>

<style scoped>
    .roll-history {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 20px;
    }

    .roll-history .history-title {
        margin-right: 15px;
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
    }

    .roll-history .history-list {
        width: calc(100% - 113px);
        display: flex;
        overflow: hidden;
    }

    .roll-history .list-enter-active {
        transition: all 0.5s;
    }

    .roll-history .list-enter {
        opacity: 0;
        transform: translateX(-15px);
    }

    @media only screen and (max-width: 750px) {

        .roll-history {
            flex-direction: column;
        }

        .roll-history .history-list {
            width: 100%;
            margin-top: 12px;
        }

    }
</style>
