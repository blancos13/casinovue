<template>
    <div class="modal-box">
        <button v-on:click="modalsSetShow(null)" class="button-close">
            <div class="button-inner">
                <IconClose />
            </div>
        </button>
        <div class="box-header">
            <div class="header-info">
                <img v-bind:src="unboxImagePath + '/public/img/' + modalsData.box.slug + '.png'" />
                <div class="info-text">
                    <div class="text-name">{{ modalsData.box.name }}</div>
                    <div class="text-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="amount-value">
                            <span>{{ modalFormatValue(modalsData.box.amount).split('.')[0] }}</span>.{{ modalFormatValue(modalsData.box.amount).split('.')[1] }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="header-title">POTENTIAL DROPS</div>
        </div>
        <div class="box-items">

            <UnboxItemElement v-for="(item, index) in battlesGetBoxItems" v-bind:key="index" v-bind:item="item" />

        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconClose from '@/components/icons/IconClose';
    import UnboxItemElement from '@/components/unbox/UnboxItemElement';

    export default {
        name: 'ModalBox',
        components: {
            IconClose,
            UnboxItemElement
        },
        data() {
            return {
                unboxImagePath: process.env.VUE_APP_BACKEND_URL
            }
        },
        methods: {
            ...mapActions([
                'modalsSetShow'
            ]),
            modalFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        },
        computed: {
            ...mapGetters([
                'socketUnbox',
                'socketBattles',
                'modalsData'
            ]),
            battlesGetBoxItems() {
                let items = this.modalsData.box.items;
                let pos = 0;

                for(let item of items) {
                    pos = pos + item.tickets;

                    if(pos < 1000 - 1) { item.color = 'yellow'; }
                    else if(pos < 5000 - 1) { item.color = 'red'; }
                    else if(pos < 20000 - 1) { item.color = 'green'; }
                    else if(pos < 50000 - 1) { item.color = 'purple'; }
                    else { item.color = 'blue'; }
                }

                return items;
            }
        }
    }
</script>

<style scoped>
     .modal-box {
        width: 750px;
        position: relative;
        padding: 0 20px 20px 20px;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0) 100%), #042238;
        border: 1px solid #0a273f;
    }

    .modal-box button.button-close {
        width: 46px;
        height: 34px;
        position: absolute;
        top: 15px;
        right: 15px;
        z-index: 1;
    }

    .modal-box button.button-close .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #082c45;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .modal-box button.button-close .button-inner svg {
        fill: #6e95b6;
        transition: all 0.3s ease;
    }

    .modal-box button.button-close:hover .button-inner svg {
        fill: #ffffff;
    }

    .modal-box .box-header {
        width: 100%;
        height: 87px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-box .box-header:after {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        bottom: 0;
        left: 0;
        background: linear-gradient(90deg, rgba(97, 112, 241, 0.15) 0%, rgba(28, 71, 182, 0.15) 100%);
    }

    .modal-box .header-info {
        position: absolute;
        top: 50%;
        left: 0;
        display: flex;
        align-items: center;
        transform: translate(0, -50%);
    }

    .modal-box .header-info img {
        height: 60px;
    }

    .modal-box .info-text {
        display: flex;
        flex-direction: column;
        margin-left: 18px;
    }

    .modal-box .text-name {
        font-size: 16px;
        font-weight: 700;
        color: #5e768e;
    }

    .modal-box .text-amount {
        display: flex;
        align-items: center;
        margin-top: 3px;
    }

    .modal-box .text-amount img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
    }

    .modal-box .amount-value {
        font-size: 12px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .modal-box .amount-value span {
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
    }

    .modal-box .header-title {
        font-size: 16px;
        font-weight: 800;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .modal-box .box-items {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
    }

    @media only screen and (max-width: 770px) {

        .modal-box {
            width: calc(100vw - 20px);
            padding: 0 10px 20px 10px;
        }

        .modal-box .info-text {
            display: none;
        }

    }
</style>