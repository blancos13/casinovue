<template>
    <div class="battles-filter-sort" v-bind:class="[  'sort-' + battlesFilterSortGames ]">
        SORT BY <span>DATE</span>
        <button v-on:click="battlesSetFilterSortGames(battlesFilterSortGames === 'date' ? 'price' : 'date')"></button>
        SORT BY <span>PRICE</span>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'BattlesFilterSort',
        methods: {
            ...mapActions([
                'battlesSetFilterSortGames'
            ])
        },
        computed: {
            ...mapGetters([
                'battlesFilterSortGames'
            ])
        }
    }
</script>

<style scoped>
    .battles-filter-sort {
        display: flex;
        align-items: center;
        font-size: 15px;
        font-weight: 800;
        color: #5e768e;
    }

    .battles-filter-sort span {
        margin-left: 5px;
        transition: color 0.3s ease;
    }

    .battles-filter-sort.sort-date span:first-of-type {
        color: #ffffff;
    }

    .battles-filter-sort.sort-price span:last-of-type {
        color: #ffffff;
    }

    .battles-filter-sort button {
        width: 45px;
        height: 15px;
        position: relative;
        margin: 0 15px;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .battles-filter-sort button::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #031523;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .battles-filter-sort button::after {
        content: '';
        width: 25px;
        height: 19px;
        position: absolute;
        top: -2px;
        left: 0;
        background: #0a2f4b;
        clip-path: polygon(3px 0, calc(100% - 3px) 0, 100% 25%, 100% 75%, calc(100% - 3px) 100%, 3px 100%, 0 75%, 0 25%);
        transition: all 0.3s ease;
    }

    .battles-filter-sort.sort-price button::after {
        transform: translate(20px, 0);
    }
</style>