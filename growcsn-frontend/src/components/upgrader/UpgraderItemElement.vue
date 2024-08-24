<template>
    <div class="upgrader-item-element">
        <div class="element-inner">
            <div class="inner-name">{{item.name}}</div>
            <div class="inner-image">
                <img v-bind:src="item.image" />
            </div>
            <div class="inner-price">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="price-value">
                    <span>{{ upgraderFormatValue(item.amountFixed).split('.')[0] }}</span>.{{ upgraderFormatValue(item.amountFixed).split('.')[1] }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'UpgraderItemElement',
        props: [
            'item'
        ],
        methods: {
            upgraderFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        }
    }
</script>

<style scoped>
    .upgrader-item-element {
        width: calc(14.28% - 4.28px);
        position: relative;
        margin-bottom: 5px;
        margin-right: 5px;
        padding: 1px;
        z-index: 1;
    }

    .upgrader-item-element:nth-child(7n) {
        margin-right: 0;
    }

    .upgrader-item-element:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(223deg, rgba(66, 107, 252, 0.35) 0%, rgb(66, 107, 252, 0.6) 100%);
        z-index: -1;
    }

    .upgrader-item-element.element-selected:before {
        background: linear-gradient(223deg, rgba(46, 202, 146, 0.35) 0%, rgb(46, 202, 146, 0.6) 100%);
    }

    .upgrader-item-element .element-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        background: radial-gradient(80% 80% at 50.00% 50.00%, rgb(66, 107, 252, 0.2) 0%, rgba(0, 0, 0, 0.00) 100%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.09) 50%, rgba(5, 29, 48, 0.35) 100%),
                    repeating-linear-gradient(-55deg, transparent, transparent 5px, rgba(2, 21, 36, 0.25) 5px, rgba(2, 21, 36, 0.25) 10px), #042037;
    }

    .upgrader-item-element.element-selected .element-inner {
        background: radial-gradient(80% 80% at 50.00% 50.00%, rgb(46, 202, 146, 0.2) 0%, rgba(0, 0, 0, 0.00) 100%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.09) 50%, rgba(5, 29, 48, 0.35) 100%),
                    repeating-linear-gradient(-55deg, transparent, transparent 5px, rgba(2, 21, 36, 0.25) 5px, rgba(2, 21, 36, 0.25) 10px), #042037;
    }

    .upgrader-item-element .inner-name {
        height: 38px;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        color: #5e768e;
    }

    .upgrader-item-element .inner-image {
        height: 74px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
    }

    .upgrader-item-element .inner-image img {
        width: 106px;
    }

    .upgrader-item-element .inner-price {
        display: flex;
        align-items: center;
        margin-top: 16px;
    }

    .upgrader-item-element .inner-price img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
    }

    .upgrader-item-element .price-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .upgrader-item-element .price-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 1100px) {

        .upgrader-item-element {
            width: calc(33.33% - 2.66px);
        }

        .upgrader-item-element:nth-child(4n) {
            margin-right: 4px;
        }

        .upgrader-item-element:nth-child(3n) {
            margin-right: 0;
        }

    }
</style>