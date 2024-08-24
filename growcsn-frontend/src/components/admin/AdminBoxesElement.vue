<template>
    <div class="admin-boxes-element">
        <div class="element-section section-name">
            <div class="section-title">NAME</div>
            <div class="section-content">
                {{ box.name }}
            </div>
        </div>
        <div class="element-section section-amount">
            <div class="section-title">AMOUNT</div>
            <div class="section-content">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="content-value">
                    <span>{{ adminFormatValue(box.amount).split('.')[0] }}</span>.{{ adminFormatValue(box.amount).split('.')[1] }}
                </div>
            </div>
        </div>
        <div class="element-section section-state" v-bind:class="['state-' + box.state]">
            <div class="section-title">STATE</div>
            <div class="section-content">
                {{ box.state }}
            </div>
        </div>
        <div class="element-section section-option">
            <div class="section-title">OPTION</div>
            <div class="section-content">
                <button v-on:click="adminViewButton()" v-bind:disabled="socketSendLoading === 'AdminBoxRemove'">
                    <svg width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.5 0C5.25197 0 2.30648 1.7536 0.133016 4.60192C-0.0443388 4.83528 -0.0443388 5.16129 0.133016 5.39465C2.30648 8.2464 5.25197 10 8.5 10C11.748 10 14.6935 8.2464 16.867 5.39808C17.0443 5.16472 17.0443 4.83871 16.867 4.60535C14.6935 1.7536 11.748 0 8.5 0ZM8.733 8.52093C6.57691 8.65477 4.79641 6.90117 4.93203 4.77008C5.04332 3.01304 6.4865 1.58888 8.267 1.47907C10.4231 1.34523 12.2036 3.09883 12.068 5.22992C11.9532 6.98353 10.51 8.40769 8.733 8.52093ZM8.62519 6.8943C7.46369 6.96637 6.50389 6.02265 6.58039 4.87646C6.63951 3.92931 7.41848 3.16404 8.37829 3.10227C9.53979 3.0302 10.4996 3.97392 10.4231 5.12011C10.3605 6.07069 9.58152 6.83596 8.62519 6.8943Z" />
                    </svg>
                    VIEW
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'AdminBoxesElement',
        props: ['box'],
        methods: {
            ...mapActions([
                'adminSendBoxRemoveSocket'
            ]),
            adminFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            adminRemoveButton() {
                const data = { boxId: this.box._id };
                this.adminSendBoxRemoveSocket(data);
            },
            adminViewButton() {
                
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading'
            ])
        }
    }
</script>

<style scoped>
    .admin-boxes-element {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
        background: rgba(19, 66, 88, 0.25);
    }

    .admin-boxes-element:nth-child(even) {
        background: rgba(19, 66, 88, 0.1);
    }

    .admin-boxes-element .element-section {
        display: flex;
        flex-direction: column;
    }

    .admin-boxes-element .element-section.section-name {
        width: 35%;
    }

    .admin-boxes-element .element-section.section-amount,
    .admin-boxes-element .element-section.section-state {
        width: 25%;
    }

    .admin-boxes-element .element-section.section-option {
        width: 15%;
    }

    .admin-boxes-element .section-title {
        display: none;
        font-size: 13px;
        font-weight: 600;
        color: #8bacc8;
    }

    .admin-boxes-element .section-content {
        display: flex;
        align-items: center;
    }

    .admin-boxes-element .element-section.section-name .section-content {
        font-size: 14px;
        font-weight: 400;
        color: #bbbfd0;
    }

    .admin-boxes-element .element-section.section-amount .section-content img {
        width: 18px;
        height: 18px;
        margin-right: 10px;
    }

    .admin-boxes-element .element-section.section-amount .content-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .admin-boxes-element .element-section.section-amount .content-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .admin-boxes-element .element-section.section-state .section-content {
        text-transform: uppercase;
        font-size: 14px;
        font-weight: 400;
    }

    .admin-boxes-element .element-section.section-state.state-active .section-content {
        color: #00ffc2;
    }

    .admin-boxes-element .element-section.section-state.state-paused .section-content {
        color: #d15e5e;
    }

    .admin-boxes-element .element-section.section-option .section-content {
        justify-content: flex-end;
    }

    .admin-boxes-element .element-section.section-option .section-content button {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
        transition: color 0.3s ease;
    }

    .admin-boxes-element .element-section.section-option .section-content button:hover {
        color: #ffffff;
    }

    .admin-boxes-element .element-section.section-option .section-content button svg {
        margin-right: 8px;
        fill: #bbbfd0;
        transition: fill 0.3s ease;
    }

    .admin-boxes-element .element-section.section-option .section-content button:hover svg {
        fill: #ffffff;
    }

    @media only screen and (max-width: 1250px) {

        .admin-boxes-element {
            height: auto;
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 20px;
        }

        .admin-boxes-element .element-section {
            width: 100%!important;
            margin-top: 10px;
        }

        .admin-boxes-element .element-section.section-user {
            margin-top: 0;
        }

        .admin-boxes-element .element-section.section-option {
            align-items: flex-start;
        }

        .admin-boxes-element .section-title {
            display: block;
        }

        .admin-boxes-element .section-content {
            margin-top: 5px;
        }

    }
</style>