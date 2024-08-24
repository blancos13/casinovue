<template>
    <div class="admin-filter-amount" v-bind:class="{ 'amount-open': adminDropdown === true }">
        <button v-on:click="adminToggleDropdown" class="button-toggle">
            <div class="button-value">
                Amount: <span class="gradient-green">${{adminFilterAmount}}</span>
            </div>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5176 1.66411e-06L0.482354 8.43375e-08C0.0547936 9.58042e-09 -0.16302 0.516304 0.143533 0.822859L4.66115 5.34052C4.8467 5.52607 5.15325 5.52607 5.33888 5.34052L9.8565 0.822861C10.163 0.516306 9.94516 1.73887e-06 9.5176 1.66411e-06Z" />
            </svg>
        </button>
        <div class="amount-menu">
            <div class="menu-inner">
                <button v-on:click="adminSetButton('3')">$3 GIFT CARD</button>
                <button v-on:click="adminSetButton('5')">$5 GIFT CARD</button>
                <button v-on:click="adminSetButton('10')">$10 GIFT CARD</button>
                <button v-on:click="adminSetButton('25')">$25 GIFT CARD</button>
                <button v-on:click="adminSetButton('50')">$50 GIFT CARD</button>
                <button v-on:click="adminSetButton('100')">$100 GIFT CARD</button>
                <button v-on:click="adminSetButton('250')">$250 GIFT CARD</button>
                <button v-on:click="adminSetButton('500')">$500 GIFT CARD</button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'AdminFilterAmount',
        data() {
            return {
                adminDropdown: false
            }
        },
        methods: {
            ...mapActions(['adminSetFilterAmount']),
            adminToggleDropdown() {
                this.adminDropdown = !this.adminDropdown;
            },
            adminSetButton(value) {
                this.adminSetFilterAmount(value);
                this.adminToggleDropdown();
            }
        },
        computed: {
            ...mapGetters(['adminFilterAmount'])
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
    .admin-filter-amount {
        width: 100%;
        position: relative;
    }

    .admin-filter-amount button.button-toggle {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
        background: rgba(19, 66, 88, 0.25);
    }

    .admin-filter-amount button.button-toggle svg {
        fill: #49687d;
        transition: all 0.3s ease;
    }

    .admin-filter-amount.amount-open button.button-toggle svg {
        transform: rotate(180deg);
    }

    .admin-filter-amount button.button-toggle .button-value {
        font-size: 16px;
        font-weight: 600;
        color: #49687d;
    }

    .admin-filter-amount button.button-toggle .button-value span {
        font-weight: 800;
    }

    .admin-filter-amount .amount-menu {
        width: 100%;
        height: 0;
        position: absolute;
        top: 52px;
        left: 0;
        overflow: hidden;
        transition: height 0.2s ease;
    }

    .admin-filter-amount.amount-open .amount-menu {
        height: 382px;
    }

    .admin-filter-amount .menu-inner {
        width: 100%;
        padding: 3px;
        border-radius: 5px;
        background: #022038;
    }

    .admin-filter-amount .menu-inner button {
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

    .admin-filter-amount .menu-inner button:hover {
        background: rgba(19, 66, 88, 0.15);
    }
</style>
