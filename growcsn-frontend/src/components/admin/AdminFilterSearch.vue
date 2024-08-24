<template>
    <div class="admin-filter-search">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.7204 9.43396H10.0429L9.80274 9.2024C10.6432 8.2247 11.1492 6.9554 11.1492 5.57461C11.1492 2.49571 8.65352 0 5.57461 0C2.49571 0 0 2.49571 0 5.57461C0 8.65352 2.49571 11.1492 5.57461 11.1492C6.9554 11.1492 8.2247 10.6432 9.2024 9.80274L9.43396 10.0429V10.7204L13.7221 15L15 13.7221L10.7204 9.43396ZM5.57461 9.43396C3.43911 9.43396 1.71527 7.71012 1.71527 5.57461C1.71527 3.43911 3.43911 1.71527 5.57461 1.71527C7.71012 1.71527 9.43396 3.43911 9.43396 5.57461C9.43396 7.71012 7.71012 9.43396 5.57461 9.43396Z" />
        </svg>
        <input v-on:change="adminSetValue" v-model="adminValue" type="text" placeholder="Search for keyword..." />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'AdminFilterSerach',
        data() {
            return  {
                adminValue: ''
            }
        },
        methods: {
            ...mapActions([
                'adminSetFilterSearch', 
                'adminSetUserListPage', 
                'adminGetUserListSocket', 
                'adminSetAffiliateListPage', 
                'adminGetAffiliateListSocket', 
                'adminSetPromoListPage', 
                'adminGetPromoListSocket',
                'adminSetTransactionListPage', 
                'adminGetTransactionListSocket'
            ]),
            adminSetValue() {
                this.adminSetFilterSearch(this.adminValue);

                if(this.$route.name === 'AdminUsers') {
                    this.adminSetUserListPage(1);

                    const data = { page: 1, search: this.adminValue, sort: this.adminFilterSort.toLowerCase(), select: this.adminFilterSelect.toLowerCase() };
                    this.adminGetUserListSocket(data);
                } else if(this.$route.name === 'AdminAffiliates') {
                    this.adminSetAffiliateListPage(1);

                    const data = { page: 1, search: this.adminValue, sort: this.adminFilterSort.toLowerCase() };
                    this.adminGetAffiliateListSocket(data);
                } else if(this.$route.name === 'AdminPromo') {
                    this.adminSetPromoListPage(1);

                    const data = { page: 1, search: this.adminValue };
                    this.adminGetPromoListSocket(data);
                } else if(this.$route.name === 'AdminTransactions') {
                    this.adminSetTransactionListPage(1);

                    const data = { page: 1, search: this.adminValue, select: this.adminFilterSelect.toLowerCase() };
                    this.adminGetTransactionListSocket(data);
                }
            }
        },
        computed: {
            ...mapGetters([
                'adminFilterSort',
                'adminFilterSelect'
            ])
        }
    }
</script>

<style scoped>
    .admin-filter-search {
        width: 100%;
        height: 47px;
        position: relative;
        border-radius: 5px;
        background: rgba(19, 66, 88, 0.25);
    }

    .admin-filter-search svg {
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translate(0, -50%);
        fill: #49687d;
    }

    .admin-filter-search input {
        width: 100%;
        height: 100%;
        padding: 0 20px 0 40px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: transparent;
    }

    .admin-filter-search input::placeholder {
        color: #49687d;
    }
</style>
