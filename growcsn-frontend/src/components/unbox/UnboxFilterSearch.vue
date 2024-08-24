<template>
    <div class="unbox-filter-search">
        <input v-on:input="unboxSetFilterSearch(unboxSearch)" v-model="unboxSearch" type="text" placeholder="SEARCH FOR CASES..." />
        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.7204 10.1327H10.0429L9.80274 9.90113C10.6432 8.92343 11.1492 7.65413 11.1492 6.27334C11.1492 3.19444 8.65352 0.69873 5.57461 0.69873C2.49571 0.69873 0 3.19444 0 6.27334C0 9.35225 2.49571 11.848 5.57461 11.848C6.9554 11.848 8.2247 11.342 9.2024 10.5015L9.43396 10.7416V11.4191L13.7221 15.6987L15 14.4209L10.7204 10.1327ZM5.57461 10.1327C3.43911 10.1327 1.71527 8.40885 1.71527 6.27334C1.71527 4.13784 3.43911 2.414 5.57461 2.414C7.71012 2.414 9.43396 4.13784 9.43396 6.27334C9.43396 8.40885 7.71012 10.1327 5.57461 10.1327Z" />
        </svg>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'UnboxFilterSearch',
        data() {
            return  {
                unboxSearch: ''
            }
        },
        methods: {
            ...mapActions([
                'unboxSetFilterSearch'
            ])
        },
        computed: {
            ...mapGetters([
                'unboxFilterSearch'
            ])
        },
        created() {
            this.unboxSearch = this.unboxFilterSearch;
        }
    }
</script>

<style scoped>
    .unbox-filter-search {
        width: 220px;
        height: 47px;
        position: relative;
        margin-right: 15px;
        padding: 1px;
        z-index: 1;
    }

    .unbox-filter-search::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #0a273f;
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .unbox-filter-search::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #052238;
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .unbox-filter-search svg {
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translate(0, -50%);
        fill: #395b77;
    }

    .unbox-filter-search input {
        width: 100%;
        height: 100%;
        padding: 0 20px 0 40px;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        background: linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.05) 50%, rgba(5, 29, 48, 0.35) 100%);
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
    }

    .unbox-filter-search input::placeholder {
        color: #395b77;
    }

    @media only screen and (max-width: 550px) {

        .unbox-filter-search {
            width: 100%;
        }

    }
</style>