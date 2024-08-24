<template>
    <div class="unbox-item-element" v-bind:class="['element-' + item.color]">
        <div class="element-inner">
            <div class="inner-percentage">{{item.tickets / 1000}}%</div>
            <div class="inner-image">
                <img v-bind:src="item.item.image" />
            </div>
            <div class="inner-name">{{item.item.name}}</div>
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
        name: 'UnboxItemElement',
        props: ['item'],
        methods: {
            unboxFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        }
    }
</script>

<style scoped>
    .unbox-item-element {
        width: calc(14.28% - 5.14px);
        position: relative;
        margin-bottom: 6px;
        margin-right: 6px;
        padding: 1px;
        z-index: 1;
    }

    .modal-box .unbox-item-element {
        width: calc(25% - 4.5px);
    }

    .unbox-item-element:nth-child(7n) {
        margin-right: 0;
    }

    .modal-box .unbox-item-element:nth-child(7n) {
        margin-right: 6px;
    }

    .modal-box .unbox-item-element:nth-child(4n) {
        margin-right: 0;
    }

    .unbox-item-element:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #0a273f;
        z-index: -1;
    }

    .unbox-item-element.element-blue:before {
        background: linear-gradient(223deg, rgba(66, 107, 252, 0.35) 0%, rgb(66, 107, 252, 0.6) 100%);
    }

    .unbox-item-element.element-purple:before {
        background: linear-gradient(223deg, rgba(253, 134, 255, 0.35) 0%, rgb(253, 134, 255, 0.6) 100%);
    }

    .unbox-item-element.element-green:before {
        background: linear-gradient(223deg, rgba(46, 202, 146, 0.35) 0%, rgb(46, 202, 146, 0.6) 100%);
    }

    .unbox-item-element.element-red:before {
        background: linear-gradient(223deg, rgb(218, 50, 50, 0.35) 0%, rgb(218, 50, 50, 0.6) 100%);
    }

    .unbox-item-element.element-yellow:before {
        background: linear-gradient(223deg, rgba(220, 177, 25, 0.35) 0%, rgba(220, 177, 25, 0.6) 100%);
    }

    .unbox-item-element::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #042037;
        z-index: -1;
    }

    .unbox-item-element .element-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 40px 0 20px 0;
    }

    .unbox-item-element.element-blue .element-inner {
    }

    .unbox-item-element.element-purple .element-inner {
    }

    .unbox-item-element.element-green .element-inner {
    }

    .unbox-item-element.element-red .element-inner {
    }

    .unbox-item-element.element-yellow .element-inner {
    }

    .unbox-item-element .inner-percentage {
        position: absolute;
        top: 9px;
        right: 9px;
        font-size: 14px;
        font-weight: 600;
        color: #5e768e;
    }

    .unbox-item-element .inner-image {
        height: 74px;
        display: flex;
        justify-content: center;
        align-items: center;
        image-rendering: pixelated;
    }

    .unbox-item-element .inner-image img {
        width: 96px;
    }

    .unbox-item-element .inner-name {
        /* height: 38px; */
        margin-top: 25px;
        margin-bottom: 10px;
        text-align: center;
        font-size: 15px;
        font-weight: 600;
        color: #a2acb6;
    }

    .unbox-item-element .inner-price {
        display: flex;
        align-items: center;
        margin-top: 6px;
    }

    .unbox-item-element .inner-price img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
    }

    .unbox-item-element .price-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .unbox-item-element .price-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 1200px) {

        .unbox-item-element {
            width: calc(16.66% - 5px);
        }

        .unbox-item-element:nth-child(7n) {
            margin-right: 6px;
        }

        .unbox-item-element:nth-child(6n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 1050px) {

        .unbox-item-element {
            width: calc(20% - 4.8px);
        }

        .unbox-item-element:nth-child(6n) {
            margin-right: 6px;
        }

        .unbox-item-element:nth-child(5n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 800px) {

        .unbox-item-element {
            width: calc(25% - 4.5);
        }

        .unbox-item-element:nth-child(5n) {
            margin-right: 6px;
        }

        .unbox-item-element:nth-child(4n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 700px) {

        .unbox-item-element,
        .modal-box .unbox-item-element {
            width: calc(33.33% - 4px);
        }

        .unbox-item-element:nth-child(4n),
        .modal-box .unbox-item-element:nth-child(4n) {
            margin-right: 6px;
        }

        .unbox-item-element:nth-child(3n),
        .modal-box .unbox-item-element:nth-child(3n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 550px) {

        .unbox-item-element,
        .modal-box .unbox-item-element {
            width: calc(50% - 3px);
        }

        .unbox-item-element:nth-child(3n),
        .modal-box .unbox-item-element:nth-child(3n) {
            margin-right: 6px;
        }

        .unbox-item-element:nth-child(2n),
        .modal-box .unbox-item-element:nth-child(2n) {
            margin-right: 0;
        }

    }
</style>