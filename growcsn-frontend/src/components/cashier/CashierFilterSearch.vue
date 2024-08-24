<template>
    <div class="cashier-filter-search">
        <input v-on:change="cashierSetValue" v-model="cashierValue" type="text" placeholder="SEARCH FOR ITEMS..." />
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.7204 9.43396H10.0429L9.80274 9.2024C10.6432 8.2247 11.1492 6.9554 11.1492 5.57461C11.1492 2.49571 8.65352 0 5.57461 0C2.49571 0 0 2.49571 0 5.57461C0 8.65352 2.49571 11.1492 5.57461 11.1492C6.9554 11.1492 8.2247 10.6432 9.2024 9.80274L9.43396 10.0429V10.7204L13.7221 15L15 13.7221L10.7204 9.43396ZM5.57461 9.43396C3.43911 9.43396 1.71527 7.71012 1.71527 5.57461C1.71527 3.43911 3.43911 1.71527 5.57461 1.71527C7.71012 1.71527 9.43396 3.43911 9.43396 5.57461C9.43396 7.71012 7.71012 9.43396 5.57461 9.43396Z" />
        </svg>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'CashierFilterSerach',
        data() {
            return  {
                cashierValue: ''
            }
        },
        methods: {
            ...mapActions([
                'cashierSetFilterSearch'
            ]),
            cashierSetValue() {
                this.cashierSetFilterSearch(this.cashierValue);
            }
        }
    }
</script>

<style scoped>
    .cashier-filter-search {
        width: 250px;
        height: 52px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .cashier-filter-search:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(4, 19, 31, 0.73) 0%, rgba(34, 58, 78, 0.73) 100%);
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .cashier-filter-search input {
        width: 100%;
        height: 100%;
        padding: 0 10px 0 43px;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        background: #041b2d;
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
    }

    .cashier-filter-search input::placeholder {
        color: rgba(110, 149, 182, 0.5);
    }

    .cashier-filter-search svg {
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translate(0, -50%);
        fill: rgba(110, 149, 182, 0.5);
    }

    @media only screen and (max-width: 700px) {

        .limiteds  .cashier-filter-search {
            width: 100%;
        }

    }
</style>
