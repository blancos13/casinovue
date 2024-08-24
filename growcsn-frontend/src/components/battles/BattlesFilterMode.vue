<template>
    <div class="battles-filter-mode" v-bind:class="{'mode-open': battlesDropdown === true, 'mode-group': battlesFilterType === 'group' }">
        <button v-on:click="battlesToggleDropdown()" class="button-toggle">
            <div class="button-value">
                MODE: <span>{{ battlesFilterMode }}</span>
            </div>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5176 1.66411e-06L0.482354 8.43375e-08C0.0547936 9.58042e-09 -0.16302 0.516304 0.143533 0.822859L4.66115 5.34052C4.8467 5.52607 5.15325 5.52607 5.33888 5.34052L9.8565 0.822861C10.163 0.516306 9.94516 1.73887e-06 9.5176 1.66411e-06Z" />
            </svg>
        </button>
        <div class="mode-menu">
            <div class="menu-inner">
                <button v-on:click="battlesModeButton('1v1')">1v1</button>
                <button v-on:click="battlesModeButton('1v1v1')">1v1v1</button>
                <button v-on:click="battlesModeButton('1v1v1v1')">1v1v1v1</button>
                <button v-if="battlesFilterType === 'standard'" v-on:click="battlesModeButton('2v2')">2v2</button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'BattlesFilterMode',
        data() {
            return {
                battlesDropdown: false
            }
        },
        methods: {
            ...mapActions([
                'battlesSetFilterMode'
            ]),
            battlesToggleDropdown() {
                this.battlesDropdown = !this.battlesDropdown;
            },
            battlesModeButton(value) {
                this.battlesSetFilterMode(value);
                this.battlesToggleDropdown();
            }
        },
        computed: {
            ...mapGetters([
                'battlesFilterMode',
                'battlesFilterType'
            ]) 
        },
        created() {
            let self = this;
            document.addEventListener('click', function(event) {
                if(!self.$el.contains(event.target) && self.battlesDropdown == true) {
                    self.battlesToggleDropdown();
                }
            });
        }
    }
</script>

<style scoped>
    .battles-filter-mode {
        width: 177px;
        position: relative;
        z-index: 15;
    }

    .battles-filter-mode button.button-toggle {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0.01) 100%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.1) 50%, rgba(5, 29, 48, 0.35) 100%);
        border: 1px solid #0a273f;
    }

    .battles-filter-mode button.button-toggle svg {
        width: 8px;
        fill: #6e95b6;
        transition: all 0.3s ease;
    }

    .battles-filter-mode.mode-open button.button-toggle svg {
        transform: rotate(180deg);
    }

    .battles-filter-mode .button-value {
        font-size: 14px;
        font-weight: 800;
        color: #6e95b6;
    }

    .battles-filter-mode .button-value span {
        font-weight: 600;
        color: #ffffff;
    }

    .battles-filter-mode .mode-menu {
        width: 100%;
        height: 0;
        position: absolute;
        top: 45px;
        left: 0;
        overflow: hidden;
        transition: height 0.2s ease;
    }

    .battles-filter-mode.mode-open .mode-menu {
        height: 190px;
    }

    .battles-filter-mode.mode-open.mode-group .mode-menu {
        height: 143px;
    }

    .battles-filter-mode .menu-inner {
        width: 100%;
        background: #061d30;
        border: 1px solid #0a273f;
    }

    .battles-filter-mode .menu-inner button {
        width: 100%;
        height: 47px;
        display: flex;
        align-items: center;
        padding: 0 14px;
        font-size: 14px;
        font-weight: 600;
        color: #8bacc8;
        border-bottom: 1px solid #0a273f;
        transition: all 0.3s ease;
    }

    .battles-filter-mode .menu-inner button:last-child {
        border-bottom: none;
    }

    .battles-filter-mode .menu-inner button:hover {
        background: rgba(19, 66, 88, 0.15);
    }

    @media only screen and (max-width: 1100px) {

        .battles-filter-mode {
            width: calc(100% - 271px);
        }

    }

    @media only screen and (max-width: 500px) {

        .battles-filter-mode {
            width: 100%;
        }

    }
</style>