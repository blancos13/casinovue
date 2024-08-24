<template>
    <div class="admin-filter-item" v-bind:class="{ 'item-open': adminDropdown === true }">
        <input v-model="adminSearch" v-on:focus="adminToggleDropdown()" type="text" placeholder="Add item..." />
        <div class="item-menu">
            <div class="menu-inner">
                <button v-for="(item, index) in adminGetItems" v-bind:key="index" v-on:click="adminSetButton(item)">
                    <img v-bind:src="item.image" />
                    <span>{{ item.name }}</span>
                    ({{ adminFormatValue(item.amountFixed) }})
                </button>
            </div>
        </div>
    </div>
  </template>
  
  <script>
    import { mapGetters } from 'vuex';
  
    export default {
        name: 'AdminFilterItem',
        data() {
            return {
                adminDropdown: false,
                adminSearch: ''
            }
        },
        methods: {
            adminFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            adminToggleDropdown() {
                this.adminDropdown = !this.adminDropdown;
            },
            adminSetButton(item) {
                this.adminToggleDropdown();
                this.$parent.adminAddButton(item);
            }
        },
        computed: {
            ...mapGetters([
                'adminBoxList'
            ]),
            adminGetItems() {
                let items = [];

                if(this.adminBoxList.items !== null) {
                    items = this.adminBoxList.items.filter((element) => element.name.toLowerCase().includes(this.adminSearch.toLowerCase().trim()) === true);
                    items.sort((a, b) => { return b.amount - a.amount; });
                }

                return items.slice(0, 30);
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
    .admin-filter-item {
        width: 100%;
        position: relative;
        margin-top: 8px;
        z-index: 11;
    }

    .admin-filter-item input {
        width: 100%;
        height: 47px;
        padding: 0 20px;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background: rgba(19, 66, 88, 0.25);
    }

    .admin-filter-item input::placeholder {
        color: #49687d;
    }

    .admin-filter-item .item-menu {
        width: 100%;
        height: 0;
        position: absolute;
        top: 52px;
        left: 0;
        overflow: hidden;
        transition: height 0.2s ease;
    }
  
    .admin-filter-item.item-open .item-menu {
        height: 194px;
    }
  
    .admin-filter-item .menu-inner {
        width: 100%;
        height: 100%;
        padding: 3px;
        border-radius: 5px;
        overflow-x: scroll;
        background: #022038;
    }
  
    .admin-filter-item .menu-inner button {
        width: 100%;
        height: 47px;
        display: flex;
        align-items: center;
        padding: 0 14px;
        border-radius: 5px;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        transition: 0.3s ease;
    }
  
    .admin-filter-item .menu-inner button:hover {
        background: rgba(19, 66, 88, 0.15);
    }

    .admin-filter-item .menu-inner button img {
        width: 35px;
        height: 35px;
        margin-right: 10px;
    }

    .admin-filter-item .menu-inner button span {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #8bacc8;
    }
  </style>