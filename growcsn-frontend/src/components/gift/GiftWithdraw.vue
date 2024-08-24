<template>
    <div class="gift-withdraw">
        <div class="withdraw-filter">
            <div class="filter-search">
                <input v-model="giftFilterSearch" type="text" placeholder="SEARCH FOR ITEMS..." />
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.7233 13.8365H14.7296L14.3774 13.4969C15.6101 12.0629 16.3522 10.2013 16.3522 8.1761C16.3522 3.66038 12.6918 0 8.1761 0C3.66038 0 0 3.66038 0 8.1761C0 12.6918 3.66038 16.3522 8.1761 16.3522C10.2013 16.3522 12.0629 15.6101 13.4969 14.3774L13.8365 14.7296V15.7233L20.1258 22L22 20.1258L15.7233 13.8365ZM8.1761 13.8365C5.04402 13.8365 2.51572 11.3082 2.51572 8.1761C2.51572 5.04402 5.04402 2.51572 8.1761 2.51572C11.3082 2.51572 13.8365 5.04402 13.8365 8.1761C13.8365 11.3082 11.3082 13.8365 8.1761 13.8365Z" fill=""/>
                </svg>
            </div>
            <div class="filter-min">
                <input v-model="giftFilterMin" type="text" placeholder="MIN PRICE" />
                <img src="@/assets/img/icons/coin.svg" />
            </div>
            <div class="filter-max">
                <input v-model="giftFilterMax" type="text" placeholder="MAX PRICE" />
                <img src="@/assets/img/icons/coin.svg" />
            </div>
            <CashierFilterSort />
        </div>
        <div class="withdraw-content">
            <div class="content-list">

                <GiftWithdrawElement v-bind:item="{ name: '$10 STEAM', image: 'https://cdn-products.eneba.com/resized-products/O3Xkhy20s08A5bs55dLP7YHO69j4VB-sq1HKrAh5NbI_350x200_1x-0.jpeg', amount: 10000 }" />
                <GiftWithdrawElement v-bind:item="{ name: '$10 STEAM', image: 'https://cdn-products.eneba.com/resized-products/O3Xkhy20s08A5bs55dLP7YHO69j4VB-sq1HKrAh5NbI_350x200_1x-0.jpeg', amount: 10000 }" />
                <GiftWithdrawElement v-bind:item="{ name: '$10 STEAM', image: 'https://cdn-products.eneba.com/resized-products/O3Xkhy20s08A5bs55dLP7YHO69j4VB-sq1HKrAh5NbI_350x200_1x-0.jpeg', amount: 10000 }" />
                <GiftWithdrawElement v-bind:item="{ name: '$10 STEAM', image: 'https://cdn-products.eneba.com/resized-products/O3Xkhy20s08A5bs55dLP7YHO69j4VB-sq1HKrAh5NbI_350x200_1x-0.jpeg', amount: 10000 }" />
                <GiftWithdrawElement v-bind:item="{ name: '$10 STEAM', image: 'https://cdn-products.eneba.com/resized-products/O3Xkhy20s08A5bs55dLP7YHO69j4VB-sq1HKrAh5NbI_350x200_1x-0.jpeg', amount: 10000 }" />
                <GiftWithdrawElement v-bind:item="{ name: '$10 STEAM', image: 'https://cdn-products.eneba.com/resized-products/O3Xkhy20s08A5bs55dLP7YHO69j4VB-sq1HKrAh5NbI_350x200_1x-0.jpeg', amount: 10000 }" />
                <GiftWithdrawElement v-bind:item="{ name: '$10 STEAM', image: 'https://cdn-products.eneba.com/resized-products/O3Xkhy20s08A5bs55dLP7YHO69j4VB-sq1HKrAh5NbI_350x200_1x-0.jpeg', amount: 10000 }" />

            </div>
        </div>
    </div>
</template>

<script>
    import CashierFilterSort from '@/components/cashier/CashierFilterSort';
    import GiftWithdrawElement from '@/components/gift/GiftWithdrawElement';

    export default {
        name: 'GiftWithdraw',
        components: {
            CashierFilterSort,
            GiftWithdrawElement
        },
        data() {
            return {
                giftFilterSearch: '',
                giftFilterMin: '',
                giftFilterMax: ''
            }
        }
    }
</script>

<style scoped>
    .gift-withdraw {
        width: 100%;
        margin-top: 35px;
    }

    .gift-withdraw .withdraw-filter {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 25px 0;
        border-top: 1px dashed #335361;
        border-bottom: 1px dashed #335361;
    }

    .gift-withdraw .filter-search,
    .gift-withdraw .filter-min,
    .gift-withdraw .filter-max {
        width: calc(50% - 100px);
        height: 72px;
        position: relative;
        padding: 1px;
    }

    .gift-withdraw .filter-min,
    .gift-withdraw .filter-max {
        width: calc(25% - 100px);
    }

    .gift-withdraw .filter-search::before,
    .gift-withdraw .filter-min::before,
    .gift-withdraw .filter-max::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 25%, 100% 75%, calc(100% - 14px) 100%, 14px 100%, 0 75%, 0 25%);
    }

    .gift-withdraw .filter-search input,
    .gift-withdraw .filter-min input,
    .gift-withdraw .filter-max input {
        width: 100%;
        height: 100%;
        padding: 0 0 0 52px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: #072e3d;
        clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 25%, 100% 75%, calc(100% - 14px) 100%, 14px 100%, 0 75%, 0 25%);
    }

    .gift-withdraw .filter-min input,
    .gift-withdraw .filter-max input {
        padding: 0 0 0 38px;
    }

    .gift-withdraw .filter-search input::placeholder,
    .gift-withdraw .filter-min input::placeholder,
    .gift-withdraw .filter-max input::placeholder {
        font-size: 15px;
        color: #49687d;
    }

    .gift-withdraw .filter-search svg {
        position: absolute;
        top: 50%;
        left: 20px;
        transform: translate(0, -50%);
        fill: #49687d;
    }

    .gift-withdraw .filter-min img,
    .gift-withdraw .filter-max img {
        width: 15px;
        height: 15px;
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translate(0, -50%);
    }

    .gift-withdraw .withdraw-content {
        width: 100%;
        margin-top: 15px;
    }

    .gift-withdraw .content-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    @media only screen and (max-width: 1080px) {

        .gift-withdraw .withdraw-filter {
            width: 100%;
        }

    }

    @media only screen and (max-width: 950px) {

        .gift-withdraw .filter-search {
            width: 100%;
            margin-bottom: 10px;
        }

        .gift-withdraw .filter-min,
        .gift-withdraw .filter-max {
            width: calc(50% - 142px);
        }

    }

    @media only screen and (max-width: 600px) {

        .gift-withdraw .filter-min,
        .gift-withdraw .filter-max {
            width: calc(50% - 7px);
            margin-bottom: 10px;
        }

    }
</style>