<template>
    <div class="admin-filter-element">
        <div class="element-section section-phrase">
            <div class="section-title">PHRASE</div>
            <div class="section-content">
                {{filter.phrase}}
            </div>
        </div>
        <div class="element-section section-option">
            <div class="section-title">OPTION</div>
            <div class="section-content">
                <button v-on:click="adminRemoveButton()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" viewBox="0 0 448 512">
                        <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                        <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
                    </svg>
                    REMOVE
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'AdminFilterElement',
        props: ['filter'],
        methods: {
            ...mapActions(['adminSendFilterRemoveSocket']),
            adminRemoveButton() {
                const data = { filterId: this.filter._id };
                this.adminSendFilterRemoveSocket(data);
            }
        }
    }
</script>

<style scoped>
    .admin-filter-element {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
        background: rgba(19, 66, 88, 0.25);
    }

    .admin-filter-element:nth-child(even) {
        background: rgba(19, 66, 88, 0.1);
    }

    .admin-filter-element .element-section {
        display: flex;
        flex-direction: column;
    }

    .admin-filter-element .element-section.section-phrase {
        width: 85%;
    }


    .admin-filter-element .element-section.section-option {
        width: 15%;
    }

    .admin-filter-element .section-title {
        display: none;
        font-size: 13px;
        font-weight: 600;
        color: #8bacc8;
    }

    .admin-filter-element .section-content {
        display: flex;
        align-items: center;
    }

    .admin-filter-element .element-section.section-phrase .section-content {
        font-size: 14px;
        font-weight: 400;
        color: #bbbfd0;
    }

    .admin-filter-element .element-section.section-option .section-content {
        justify-content: flex-end;
    }

    .admin-filter-element .element-section.section-option .section-content button {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
        transition: all 0.3s ease;
    }

    .admin-filter-element .element-section.section-option .section-content button:hover {
        color: #ffffff;
    }

    .admin-filter-element .element-section.section-option .section-content button svg {
        margin-right: 8px;
        fill: #bbbfd0;
        transition: fill 0.3s ease;
    }

    .admin-filter-element .element-section.section-option .section-content button:hover svg {
        fill: #ffffff;
    }

    @media only screen and (max-width: 1250px) {

        .admin-filter-element {
            height: auto;
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 20px;
        }

        .admin-filter-element .element-section {
            width: 100%!important;
            margin-top: 10px;
        }

        .admin-filter-element .element-section.section-phrase {
            margin-top: 0;
        }

        .admin-filter-element .element-section.section-option {
            align-items: flex-start;
        }

        .admin-filter-element .section-title {
            display: block;
        }

        .admin-filter-element .section-content {
            margin-top: 5px;
        }

    }
</style>
