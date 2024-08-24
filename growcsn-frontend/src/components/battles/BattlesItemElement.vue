<template>
    <div class="battles-item-element" v-bind:class="['element-' + item.color]">
        <div class="element-inner">
            <div class="inner-name">{{item.item.name}}</div>
            <div class="inner-image">
                <img v-bind:src="item.item.image" />
            </div>
            <div class="inner-price">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="price-value">
                    <span>{{ unboxFormatValue(item.item.amountFixed).split('.')[0] }}</span>.{{ unboxFormatValue(item.item.amountFixed).split('.')[1] }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'BattlesItemElement',
        props: ['item'],
        methods: {
            unboxFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        }
    }
</script>

<style scoped>
    .battles-item-element {
        width: calc(25% - 3px);
        position: relative;
        margin-bottom: 4px;
        margin-right: 4px;
        padding: 1px;
        z-index: 1;
    }

    .battles-game.game-3 .battles-item-element {
        width: calc(33.33% - 2.66px);
    }

    .battles-game.game-4 .battles-item-element {
        width: calc(50% - 2px);
    }

    .battles-game.game-2 .battles-item-element:nth-child(4n) {
        margin-right: 0;
    }

    .battles-game.game-3 .battles-item-element:nth-child(3n) {
        margin-right: 0;
    }

    .battles-game.game-4 .battles-item-element:nth-child(2n) {
        margin-right: 0;
    }

    .battles-item-element:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #0a273f;
        z-index: -1;
    }

    .battles-item-element.element-blue:before {
    }

    .battles-item-element.element-purple:before {
    }

    .battles-item-element.element-green:before {
    }

    .battles-item-element.element-red:before {
    }

    .battles-item-element.element-yellow:before {
    }

    .battles-item-element .element-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
    }

    .battles-item-element.element-blue .element-inner {
    }

    .battles-item-element.element-purple .element-inner {
    }

    .battles-item-element.element-green .element-inner {
    }

    .battles-item-element.element-red .element-inner {
    }

    .battles-item-element.element-yellow .element-inner {
    }

    .battles-item-element .inner-name {
        height: 38px;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        color: #5e768e;
    }

    .battles-item-element .inner-image {
        height: 74px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
    }

    .battles-item-element .inner-image img {
        width: 80px;
        image-rendering: pixelated;
    }

    .battles-item-element .inner-price {
        display: flex;
        align-items: center;
        margin-top: 10px;
    }

    .battles-item-element .inner-price img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
    }

    .battles-item-element .price-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .battles-item-element .price-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 1100px) {

        .battles-item-element {
            width: calc(33.33% - 2.66px);
        }

        .battles-item-element:nth-child(4n) {
            margin-right: 4px;
        }

        .battles-item-element:nth-child(3n) {
            margin-right: 0;
        }

    }
</style>