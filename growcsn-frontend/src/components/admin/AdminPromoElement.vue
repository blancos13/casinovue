<template>
    <div class="admin-promo-element">
        <div class="element-section section-code">
            <div class="section-title">CODE</div>
            <div class="section-content">
                {{promo.code}}
            </div>
        </div>
        <div class="element-section section-reward">
            <div class="section-title">REWARD</div>
            <div class="section-content">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="content-value">
                    <span>{{adminFormatValue(promo.reward).split('.')[0]}}</span>.{{adminFormatValue(promo.reward).split('.')[1]}}
                </div>
            </div>
        </div>
        <div class="element-section section-redeemptions">
            <div class="section-title">REDEEMPTIONS</div>
            <div class="section-content">
                {{promo.redeemptionsTotal}}/{{promo.redeemptionsMax}}
            </div>
        </div>
        <div class="element-section section-option">
            <div class="section-title">OPTION</div>
            <div class="section-content">
                <button v-on:click="adminRemoveButton">
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
    import { mapActions } from 'vuex';
    import AvatarImage from '@/components/AvatarImage';

    export default {
        name: 'AdminPromoElement',
        components: {
            AvatarImage
        },
        props: ['promo'],
        methods: {
            ...mapActions(['adminSendPromoRemoveSocket']),
            adminFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            adminRemoveButton() {
                const data = { promoId: this.promo._id };
                this.adminSendPromoRemoveSocket(data);
            }
        }
    }
</script>

<style scoped>
    .admin-promo-element {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
        background: rgba(19, 66, 88, 0.25);
    }

    .admin-promo-element:nth-child(even) {
        background: rgba(19, 66, 88, 0.1);
    }

    .admin-promo-element .element-section {
        display: flex;
        flex-direction: column;
    }

    .admin-promo-element .element-section.section-code {
        width: 30%;
    }

    .admin-promo-element .element-section.section-reward,
    .admin-promo-element .element-section.section-redeemptions {
        width: 25%;
    }

    .admin-promo-element .element-section.section-option {
        width: 20%;
    }

    .admin-promo-element .section-title {
        display: none;
        font-size: 13px;
        font-weight: 600;
        color: #8bacc8;
    }

    .admin-promo-element .section-content {
        display: flex;
        align-items: center;
    }

    .admin-promo-element .element-section.section-code .section-content,
    .admin-promo-element .element-section.section-redeemptions .section-content {
        font-size: 14px;
        font-weight: 400;
        color: #bbbfd0;
    }

    .admin-promo-element .element-section.section-option .section-content {
        justify-content: flex-end;
    }


    .admin-promo-element .element-section.section-reward .section-content img {
        width: 18px;
        height: 18px;
        margin-right: 10px;
    }

    .admin-promo-element .element-section.section-reward .content-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .admin-promo-element .element-section.section-reward .content-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .admin-promo-element .element-section.section-option .section-content button {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
        transition: color 0.3s ease;
    }

    .admin-promo-element .element-section.section-option .section-content button:hover {
        color: #ffffff;
    }

    .admin-promo-element .element-section.section-option .section-content button svg {
        margin-right: 8px;
        fill: #bbbfd0;
        transition: fill 0.3s ease;
    }

    .admin-promo-element .element-section.section-option .section-content button:hover svg {
        fill: #ffffff;
    }

    @media only screen and (max-width: 1250px) {

        .admin-promo-element {
            height: auto;
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 20px;
        }

        .admin-promo-element .element-section {
            width: 100%!important;
            margin-top: 10px;
        }

        .admin-promo-element .element-section.section-code {
            margin-top: 0;
        }

        .admin-promo-element .element-section.section-option {
            align-items: flex-start;
        }

        .admin-promo-element .section-title {
            display: block;
        }

        .admin-promo-element .section-content {
            margin-top: 5px;
        }

    }
</style>
