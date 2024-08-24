<template>
    <div class="battles-box-element" v-bind:class="{ 'element-selected': battlesSelectedCount >= 1 }">
        <div class="element-name">
            <div class="name-inner">{{ box.name }}</div>
        </div>
        <div class="element-image">
            <img v-bind:src="unboxImagePath + '/public/img/' + box.slug + '.png'" />
        </div>
        <div v-if="battlesSelectedCount === 0" class="element-select">
            <div class="select-price">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="price-value">
                    <span>{{ battlesFormatValue(box.amount).split('.')[0] }}</span>.{{ battlesFormatValue(box.amount).split('.')[1] }}
                </div>
            </div>
            <button v-on:click="battlesAddButton()" class="button-add">
                <div class="button-inner">ADD CASE</div>
            </button>
        </div>
        <div v-else class="element-count">
            <button v-on:click="battlesDecreaseButton()" class="button-decrease">
                <svg width="7" height="2" viewBox="0 0 7 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 2V0H7V2H0Z" />
                </svg>
            </button>
            {{ battlesSelectedCount }}
            <button v-on:click="battlesIncreaseButton()" class="button-increase">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.0572 2.94779H8V5.1004H5.0572V8H2.9428V5.1004H0V2.94779H2.9428V0H5.0572V2.94779Z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'BattlesBoxElement',
        props: ['box'],
        data() {
            return {
                unboxImagePath: process.env.VUE_APP_BACKEND_URL
            }
        },
        methods: {
            ...mapActions([
                'battlesAddSelected',
                'battlesRemoveSelected',
                'battlesEmptySelected'
            ]),
            battlesFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            battlesAddButton() {
                this.battlesAddSelected(this.box);
            },
            battlesIncreaseButton() {
                this.battlesAddSelected(this.box);
            },
            battlesDecreaseButton() {
                this.battlesRemoveSelected(this.box);
            }
        },
        computed: {
            ...mapGetters([
                'battlesSelected'
            ]),
            battlesSelectedCount() {
                return this.battlesSelected.filter((element) => element._id === this.box._id).length;
            }
        }
    }
</script>

<style scoped>
    .battles-box-element {
        width: calc(16.66% - 6.66px);
        height: 260px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-right: 8px;
        margin-bottom: 8px;
        padding: 15px;
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0.01) 100%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.09) 50%, rgba(5, 29, 48, 0.35) 100%);
        border: 1px solid #0a273f;
    }

    .modal-battles-select .battles-box-element {
        height: 220px;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), 
                    linear-gradient(0deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0.01) 100%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.1) 50%, rgba(5, 29, 48, 0.35) 100%);
    }

    .modal-battles-select .battles-box-element.element-selected {
        background: linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.1) 50%, rgba(5, 29, 48, 0.35) 100%);
        border: 1px solid #103654;
    }

    .battles-box-element:nth-child(6n) {
        margin-right: 0px;
    }

    .battles-box-element .element-name {
        width: 100%;
        height: 32px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .battles-box-element .element-name:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #0a273f;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .battles-box-element .element-name:after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #071c2b;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .battles-box-element .name-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: #5e768e;
        background: linear-gradient(0deg, rgba(29, 101, 159, 0.08) 0%, rgba(29, 101, 159, 0.08) 100%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.1) 50%, rgba(5, 29, 48, 0.35) 100%);
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }


    .battles-box-element .element-image {
        height: 104px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .battles-box-element .element-image img {
        width: 130px;
    }

    .battles-box-element .element-select {
        margin-top: 4px;
    }

    .battles-box-element .select-price {
        height: 28px;
        display: flex;
        align-items: center;
    }

    .battles-box-element:hover .select-price {
        display: none;
    }

    .battles-box-element .select-price img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
    }

    .battles-box-element .price-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .battles-box-element .price-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .battles-box-element .element-select button.button-add {
        width: 104px;
        height: 28px;
        position: relative;
        display: none;
        padding: 1px;
    }

    .battles-box-element:hover .element-select button.button-add {
        display: block;
    }

    .battles-box-element .element-select button.button-add:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 170, 109, 0) 0%, #00ffc2 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .battles-box-element .element-select button.button-add .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .battles-box-element .element-count {
        width: 122px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    .battles-box-element .element-count button.button-decrease,
    .battles-box-element .element-count button.button-increase {
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.12) 50%, rgba(5, 29, 48, 0.35) 100%);
        border: 1px solid #0a273f;
    }

    .battles-box-element .element-count button.button-decrease svg,
    .battles-box-element .element-count button.button-increase svg {
        fill: #6e95b6;
        transition: fill 0.3s ease;
    }

    .battles-box-element .element-count button.button-decrease:hover svg,
    .battles-box-element .element-count button.button-increase:hover svg {
        fill: #ffffff;
    }

    @media only screen and (max-width: 1100px) {

        .battles-box-element {
            width: calc(20% - 6.4px);
        }

        .battles-box-element:nth-child(6n) {
            margin-right: 8px;
        }

        .battles-box-element:nth-child(5n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 950px) {

        .battles-box-element {
            width: calc(25% - 6px);
        }

        .battles-box-element:nth-child(5n) {
            margin-right: 8px;
        }

        .battles-box-element:nth-child(4n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 750px) {

        .battles-box-element {
            width: calc(33.33% - 5.33px);
        }

        .battles-box-element:nth-child(4n) {
            margin-right: 8px;
        }

        .battles-box-element:nth-child(3n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 550px) {

        .battles-box-element {
            width: calc(50% - 4px);
        }

        .battles-box-element:nth-child(3n) {
            margin-right: 8px;
        }

        .battles-box-element:nth-child(2n) {
            margin-right: 0;
        }

    }
</style>