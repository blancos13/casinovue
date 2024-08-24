<template>
    <button v-on:click="cashierSetFilterSort(cashierFilterSort === 'Highest' ? 'Lowest' : 'Highest')" class="cashier-filter-sort" v-bind:class="{ 'sort-lowest': cashierFilterSort === 'Lowest' }">
        <div class="button-inner">
            <div class="inner-value">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.0747223 0.4245C0.135935 0.297432 0.231739 0.1902 0.351135 0.115113C0.47053 0.0400265 0.608678 0.000128836 0.749722 5.28408e-08H15.7497C15.891 -5.29869e-05 16.0295 0.0398245 16.1492 0.115037C16.2688 0.19025 16.3648 0.297738 16.426 0.425114C16.4872 0.55249 16.5112 0.694571 16.4952 0.834984C16.4792 0.975398 16.4238 1.10843 16.3355 1.21875L10.4997 8.51325V15.75C10.4998 15.8983 10.4558 16.0433 10.3734 16.1667C10.2911 16.29 10.174 16.3862 10.037 16.443C9.94597 16.4809 9.84831 16.5003 9.74972 16.5C9.55082 16.5 9.36009 16.4209 9.21947 16.2803L6.21947 13.2803C6.07881 13.1396 5.99976 12.9489 5.99972 12.75V8.51325L0.163973 1.21875C0.0757275 1.10824 0.0205269 0.975038 0.00473404 0.834504C-0.0110569 0.693971 0.0132046 0.551837 0.0747223 0.4245Z" />
                </svg>
                Sort By:
                <span>{{cashierFilterSort}}</span>
            </div>
            <svg class="toggle-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5176 1.66411e-06L0.482354 8.43375e-08C0.0547936 9.58042e-09 -0.16302 0.516304 0.143533 0.822859L4.66115 5.34052C4.8467 5.52607 5.15325 5.52607 5.33888 5.34052L9.8565 0.822861C10.163 0.516306 9.94516 1.73887e-06 9.5176 1.66411e-06Z" />
            </svg>
        </div>
    </button>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'CashierFilterSort',
        methods: {
            ...mapActions(['cashierSetFilterSort'])
        },
        computed: {
            ...mapGetters(['cashierFilterSort'])
        },
        created() {
            let self = this;
            document.addEventListener('click', function(event) {
                if(!self.$el.contains(event.target) && self.cashierDropdown === true) {
                    self.cashierSetDropdown(false);
                }
            });
        }
    }
</script>

<style scoped>
    button.cashier-filter-sort {
        width: 185px;
        height: 52px;
        position: relative;
        padding: 1px;
        filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.1));
        z-index: 2;
    }

    .modal-limiteds button.cashier-filter-sort,
    .modal-gift button.cashier-filter-sort {
        width: 255px;
        height: 72px;
    }

    button.cashier-filter-sort:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(9, 42, 69, 0.7);
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .modal-limiteds button.cashier-filter-sort:before,
    .modal-gift button.cashier-filter-sort:before {
        background: rgba(13, 73, 84, 0.65);
        clip-path: polygon(13px 0, calc(100% - 13px) 0, 100% 25%, 100% 75%, calc(100% - 13px) 100%, 13px 100%, 0 75%, 0 25%);
    }

    button.cashier-filter-sort .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        background-color: #08233a;
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .modal-limiteds button.cashier-filter-sort .button-inner,
    .modal-gift button.cashier-filter-sort .button-inner {
        padding: 0 20px;
        background-color: #0a3748;
        clip-path: polygon(13px 0, calc(100% - 13px) 0, 100% 25%, 100% 75%, calc(100% - 13px) 100%, 13px 100%, 0 75%, 0 25%);
    }

    button.cashier-filter-sort .button-inner svg.toggle-icon {
        width: 8px;
        fill: #bbbfd0;
        transition: all 0.3s ease;
    }

    .modal-limiteds button.cashier-filter-sort .button-inner svg.toggle-icon,
    .modal-gift button.cashier-filter-sort .button-inner svg.toggle-icon {
        width: 10px;
    }

    button.cashier-filter-sort.sort-lowest .button-inner svg.toggle-icon {
        transform: rotate(180deg);
    }

    button.cashier-filter-sort .inner-value {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 600;
        color: #49687d;
    }

    .modal-limiteds  button.cashier-filter-sort .inner-value,
    .modal-gift  button.cashier-filter-sort .inner-value {
        font-size: 16px;
        color: #bbbfd0;
    }

    button.cashier-filter-sort .inner-value svg {
        width: 12px;
        height: 12px;
        margin-right: 8px;
        fill: #00ffc2;
    }

    .modal-limiteds  button.cashier-filter-sort .inner-value svg,
    .modal-gift  button.cashier-filter-sort .inner-value svg {
        width: 17px;
        height: 17px;
        margin-right: 10px;
    }

    button.cashier-filter-sort .inner-value span {
        margin-left: 5px;
        font-weight: 700;
        color: #01e0a3;
    }

    .modal-limiteds button.cashier-filter-sort .inner-value span,
    .modal-gift button.cashier-filter-sort .inner-value span {
        margin-left: 8px;
    }

    @media only screen and (max-width: 700px) {

        .limiteds button.cashier-filter-sort {
            width: calc(100% - 224px);
        }

    }

    @media only screen and (max-width: 500px) {

        .limiteds button.cashier-filter-sort {
            width: 100%;
            margin-top: 10px;
        }

    }
</style>
