<template>
    <div class="admin-filter-select" v-bind:class="{ 'select-open': adminDropdown === true }">
        <button v-on:click="adminToggleDropdown" class="button-toggle">
            <div class="button-value">
                Select: <span>{{adminFilterSelect}} {{adminGetRouteName === 'AdminUsers' ? 'Users' : 'Transactions' }}</span>
            </div>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5176 1.66411e-06L0.482354 8.43375e-08C0.0547936 9.58042e-09 -0.16302 0.516304 0.143533 0.822859L4.66115 5.34052C4.8467 5.52607 5.15325 5.52607 5.33888 5.34052L9.8565 0.822861C10.163 0.516306 9.94516 1.73887e-06 9.5176 1.66411e-06Z" />
            </svg>
        </button>
        <div class="select-menu">
            <div class="menu-inner">
                <button v-on:click="adminSetButton('All')">All {{adminGetRouteName === 'AdminUsers' ? 'Users' : 'Transactions'}}</button>
                <button v-if="adminGetRouteName === 'AdminUsers'" v-on:click="adminSetButton('Flagged')">Flagged Users</button>
                <button v-if="adminGetRouteName === 'AdminTransactions'" v-on:click="adminSetButton('Robux')">Robux Transactions</button>
                <button v-if="adminGetRouteName === 'AdminTransactions'" v-on:click="adminSetButton('Limited')">Limited Transactions</button>
                <button v-if="adminGetRouteName === 'AdminTransactions'" v-on:click="adminSetButton('Crypto')">Crypto Transactions</button>
                <button v-if="adminGetRouteName === 'AdminTransactions'" v-on:click="adminSetButton('Gift')">Gift Transactions</button>
            </div>
        </div>
    </div>
  </template>
  
  <script>
    import { mapGetters, mapActions } from 'vuex';
  
    export default {
        name: 'AdminFilterSelect',
        data() {
            return {
                adminDropdown: false
            }
        },
        methods: {
            ...mapActions([
                'adminSetFilterSelect',
                'adminSetUserListPage', 
                'adminGetUserListSocket',
                'adminSetTransactionListPage', 
                'adminGetTransactionListSocket'
            ]),
            adminToggleDropdown() {
                this.adminDropdown = !this.adminDropdown;
            },
            adminSetButton(value) {
                this.adminSetFilterSelect(value);
                this.adminToggleDropdown();

                if(this.$route.name === 'AdminUsers') {
                    this.adminSetUserListPage(1);

                    const data = { page: 1, search: this.adminFilterSearch, sort: this.adminFilterSort.toLowerCase(), select: this.adminFilterSelect.toLowerCase() };
                    this.adminGetUserListSocket(data);
                } else if(this.$route.name === 'AdminTransactions') {
                    this.adminSetTransactionListPage(1);

                    const data = { page: 1, search: this.adminFilterSearch, select: this.adminFilterSelect.toLowerCase() };
                    this.adminGetTransactionListSocket(data);
                }
            }
        },
        computed: {
            ...mapGetters([
                'adminFilterSelect',
                'adminFilterSearch',
                'adminFilterSort'
            ]),
            adminGetRouteName() {
                return this.$route.name;
            }
        },
        created() {
            let self = this;
            document.addEventListener('click', function(event) {
                if(!self.$el.contains(event.target) && self.adminDropdown == true) {
                    self.adminToggleDropdown();
                }
            });
        }
    }
  </script>
  
  <style scoped>
    .admin-filter-select {
        width: 100%;
        position: relative;
        margin-top: 12px;
        z-index: 11;
    }
  
    .admin-filter-select button.button-toggle {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
        background: rgba(19, 66, 88, 0.25);
    }
  
    .admin-filter-select button.button-toggle svg {
        fill: #49687d;
        transition: all 0.3s ease;
    }
  
    .admin-filter-select.select-open button.button-toggle svg {
        transform: rotate(180deg);
    }
  
    .admin-filter-select button.button-toggle .button-value {
        font-size: 16px;
        font-weight: 600;
        color: #49687d;
    }
  
    .admin-filter-select button.button-toggle .button-value span {
        color: #ffffff;
    }
  
    .admin-filter-select .select-menu {
        width: 100%;
        height: 0;
        position: absolute;
        top: 52px;
        left: 0;
        overflow: hidden;
        transition: height 0.2s ease;
    }
  
    .admin-filter-select.select-open .select-menu {
        height: 241px;
    }
  
    .admin-filter-select .menu-inner {
        width: 100%;
        padding: 3px;
        border-radius: 5px;
        background: #022038;
    }
  
    .admin-filter-select .menu-inner button {
        width: 100%;
        height: 47px;
        display: flex;
        align-items: center;
        padding: 0 14px;
        border-radius: 5px;
        font-size: 14px;
        font-weight: 600;
        color: #8bacc8;
        transition: 0.3s ease;
    }
  
    .admin-filter-select .menu-inner button:hover {
        background: rgba(19, 66, 88, 0.15);
    }
  </style>