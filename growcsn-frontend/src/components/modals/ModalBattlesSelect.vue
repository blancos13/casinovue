<template>
    <div class="modal-battles-select">
        <button v-on:click="modalsSetShow(null)" class="button-close">
            <div class="button-inner">
                <IconClose />
            </div>
        </button>
        <div class="select-header">
            <div class="header-title">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.05531 11.2261L8.94249 15.0407L7.38828 16.5662L8.94469 18.0927L7.38938 19.6181L4.66703 16.9481L1.55531 20L0 18.4746L3.11172 15.4215L0.389378 12.7526L1.94469 11.2271L3.5 12.7515L5.05531 11.2261ZM0.600566 0L4.50094 0.00323644L17.4989 12.7526L19.0553 11.2271L20.6106 12.7526L17.8894 15.4226L21 18.4746L19.4447 20L16.333 16.9481L13.6106 19.6181L12.0553 18.0927L13.6106 16.5662L0.603866 3.80927L0.600566 0ZM16.5024 0L20.3994 0.00323644L20.4016 3.80387L15.9436 8.1752L12.0542 4.36162L16.5024 0Z" fill="white"/>
                    <path d="M5.05531 11.2261L8.94249 15.0407L7.38828 16.5662L8.94469 18.0927L7.38938 19.6181L4.66703 16.9481L1.55531 20L0 18.4746L3.11172 15.4215L0.389378 12.7526L1.94469 11.2271L3.5 12.7515L5.05531 11.2261ZM0.600566 0L4.50094 0.00323644L17.4989 12.7526L19.0553 11.2271L20.6106 12.7526L17.8894 15.4226L21 18.4746L19.4447 20L16.333 16.9481L13.6106 19.6181L12.0553 18.0927L13.6106 16.5662L0.603866 3.80927L0.600566 0ZM16.5024 0L20.3994 0.00323644L20.4016 3.80387L15.9436 8.1752L12.0542 4.36162L16.5024 0Z" fill="url(#paint0_linear_3319_16458)"/>
                    <defs>
                        <linearGradient id="paint0_linear_3319_16458" x1="60.7566" y1="-0.804659" x2="8.70414" y2="31.7497" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#00FFC2"/>
                            <stop offset="1" stop-color="#00AA6D"/>
                        </linearGradient>
                    </defs>
                </svg>
                BATTLES CREATION
            </div>
            <div class="header-filters">
                <BattlesFilterSearch />
                <BattlesFilterPrice />
                <BattlesFilterSortCases />
            </div>
        </div>
        <div class="select-content">
            <transition name="fade" mode="out-in">
                <div v-if="socketBattles.connected === false" class="content-loading" key="loading">

                    <div class="loading-placeholder"></div>
                    <div class="loading-placeholder"></div>
                    <div class="loading-placeholder"></div>

                </div>
                <div v-else-if="battlesGetBoxes.length > 0" class="content-list" key="data">

                    <BattlesBoxElement v-for="box of battlesGetBoxes" v-bind:key="box._id" v-bind:box="box" />

                </div>
                <div v-else class="content-empty" key="empty">There are no boxes.</div>
            </transition>
        </div>
        <div class="select-footer">
            <div class="footer-cost">
                TOTAL COST:
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="cost-value">
                    <span>{{ battlesFormatValue(battlesGetCost).split('.')[0] }}</span>.{{ battlesFormatValue(battlesGetCost).split('.')[1] }}
                </div>
            </div>
            <button v-on:click="modalsSetShow(null)" class="button-add">
                <div class="button-inner">
                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.47861 7.85824L6.15342 10.5285L5.08395 11.5963L6.15493 12.6649L5.08471 13.7327L3.21144 11.8636L1.07023 14L0 12.9322L2.14121 10.7951L0.267935 8.9268L1.33816 7.859L2.40839 8.92605L3.47861 7.85824ZM0.413256 0L3.09715 0.00226551L12.0412 8.9268L13.1122 7.859L14.1824 8.9268L12.3099 10.7958L14.4503 12.9322L13.3801 14L11.2389 11.8636L9.36561 13.7327L8.29539 12.6649L9.36561 11.5963L0.415526 2.66649L0.413256 0ZM11.3554 0L14.0371 0.00226551L14.0386 2.66271L10.971 5.72264L8.29463 3.05313L11.3554 0Z" />
                    </svg>
                    ADD
                </div>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconClose from '@/components/icons/IconClose';
    import ButtonLoading from '@/components/ButtonLoading';
    import BattlesFilterSearch from '@/components/battles/BattlesFilterSearch';
    import BattlesFilterPrice from '@/components/battles/BattlesFilterPrice';
    import BattlesFilterSortCases from '@/components/battles/BattlesFilterSortCases';
    import BattlesBoxElement from '@/components/battles/BattlesBoxElement';

    export default {
        name: 'ModalBattlesSelect',
        components: {
            IconClose,
            ButtonLoading,
            BattlesFilterSearch,
            BattlesFilterPrice,
            BattlesFilterSortCases,
            BattlesBoxElement
        },
        methods: {
            ...mapActions([
                'modalsSetShow',
                'battlesSendCreateSocket'
            ]),
            battlesFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        },
        computed: {
            ...mapGetters([
                'socketBattles',
                'socketSendLoading',
                'battlesFilterSortCases',
                'battlesFilterSearch',
                'battlesFilterPrice',
                'battlesBoxes',
                'battlesSelected',
                'battlesFilterMode',
                'battlesFilterType',
                'battlesFilterLevel',
                'battlesFilterFunding',
                'battlesFilterPrivate',
                'battlesFilterAffiliate',
                'battlesFilterCursed',
                'battlesFilterTerminal'
            ]),
            battlesGetBoxes() {
                let boxes = [];

                for(const box of this.battlesBoxes) {
                    if(box.name.toLowerCase().includes(this.battlesFilterSearch.toLowerCase().trim()) === true) {
                        boxes.push(box);
                    }
                }

                if(this.battlesFilterSortCases === 'highest') { boxes.sort(function(a, b) { return b.amount - a.amount; }); }
                else { boxes.sort(function(a, b) { return a.amount - b.amount; }); }

                if(this.battlesFilterPrice == '0 - 5K') {
                    boxes = boxes.filter((element) => element.amount <= 1000 * 5000);
                } else if(this.battlesFilterPrice == '5K - 25K') {
                    boxes = boxes.filter((element) => (element.amount > 1000 * 5000 && element.amount <= 1000 * 25000));
                } else if(this.battlesFilterPrice == '25K - 100K') {
                    boxes = boxes.filter((element) => (element.amount > 1000 * 25000 && element.amount <= 1000 * 100000));
                } else if(this.battlesFilterPrice == '+100K') {
                    boxes = boxes.filter((element) => element.amount > 1000 * 100000);
                }

                return boxes;
            },
            battlesGetCountPlayer() {
                let count = 2;

                if(this.battlesFilterMode === '2v2' || this.battlesFilterMode === '1v1v1v1') { count = 4; }
                else if(this.battlesFilterMode === '1v1v1') { count = 3; }

                return count;
            },
            battlesGetCost() {
                let cost = 0;

                for(let box of this.battlesSelected) {
                    cost = Math.floor(cost + box.amount);
                }

                cost = Math.floor(cost + (cost * this.battlesGetCountPlayer * Math.floor(this.battlesFilterFunding) / 100));

                return cost;
            }
        }
    }
</script>

<style scoped>
    .modal-battles-select {
        width: 1170px;
        position: relative;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0) 100%), #042238;
        border: 1px solid #0a273f;
    }

    .modal-battles-select button.button-close {
        width: 46px;
        height: 34px;
        position: absolute;
        top: 15px;
        right: 15px;
        z-index: 1;
    }

    .modal-battles-select button.button-close .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #082c45;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .modal-battles-select button.button-close .button-inner svg {
        fill: #6e95b6;
        transition: all 0.3s ease;
    }

    .modal-battles-select button.button-close:hover .button-inner svg {
        fill: #ffffff;
    }

    .modal-battles-select .select-header {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 85px 14px 25px;
    }

    .modal-battles-select .select-header:after {
        content: '';
        width: calc(100% - 50px);
        height: 1px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        background: linear-gradient(146deg, rgba(97, 112, 241, 0.15) 0%, rgba(28, 71, 182, 0.15) 100%);
    }

    .modal-battles-select .header-title {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
    }

    .modal-battles-select .header-title svg {
        margin-right: 10px;
    }

    .modal-battles-select .header-filters {
        display: flex;
        align-items: center;
    }

    .modal-battles-select .select-content {
        width: 100%;
        height: 550px;
        margin-top: 16px;
        padding: 0 25px;
        overflow-y: scroll;
    }

    .modal-battles-select .content-loading,
    .modal-battles-select .content-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .modal-battles-select .content-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .modal-battles-select .content-loading.fade-leave-to {
        opacity: 0;
    }

    .modal-battles-select .content-empty {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
    }

    .modal-battles-select .content-list.fade-enter-active,
    .modal-battles-select .content-empty.fade-enter-active {
        transition: opacity 0.5s;
    }

    .modal-battles-select .content-list.fade-enter-from,
    .modal-battles-select .content-empty.fade-enter-from {
        opacity: 0;
    }

    .modal-battles-select .select-footer {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 25px;
        background: linear-gradient(0deg, #0b2b44 0%, #0b2b44 100%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.00) 100%), #042238;
    }

    .modal-battles-select .footer-cost {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #5e768e;
    }

    .modal-battles-select .footer-cost img {
        width: 16px;
        height: 16px;
        margin: 0 8px 0 10px;
    }

    .modal-battles-select .cost-value {
        font-size: 11px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .modal-battles-select .cost-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .modal-battles-select button.button-add {
        height: 36px;
        position: relative;
        padding: 1px;
        transition: all .2s;
    }
    .modal-battles-select button.button-add:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .modal-battles-select button.button-add:active {
        transition-duration: .2s;
        scale: .9;
    }

    .modal-battles-select button.button-add:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 170, 109, 0) 0%, #00ffc2 100%);
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .modal-battles-select button.button-add .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 25px;
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .modal-battles-select button.button-add .button-inner svg {
        margin-right: 8px;
        fill: #ffffff;
    }

    @media only screen and (max-width: 1190px) {

        .modal-battles-select {
            width: calc(100vw - 20px);
        }

    }

    @media only screen and (max-width: 1050px) {

        .modal-battles-select .select-header {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px 15px 14px 15px;
        }

        .modal-battles-select .select-header:after {
            width: calc(100% - 30px);
        }


        .modal-battles-select .header-filters {
            width: 100%;
            flex-wrap: wrap;
            margin-top: 16px;
        }

        .modal-battles-select .select-content {
            padding: 0 15px;
        }

    }
</style>