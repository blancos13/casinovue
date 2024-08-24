<template>
    <button class="cashier-element" v-bind:class="[ 'element-' + method ]" v-bind:disabled="enabled !== true">
        <div class="element-inner">
            <div class="inner-background">
                <img src="@/assets/img/knight.png" />
            </div>
            <div class="inner-image">
                <img v-bind:src="require('@/assets/img/cashier/' + method + '.png')" />
            </div>           
            <div class="inner-text">
                <div class="text-method">{{ modalGetMethod }}</div>
                <div class="text-type">{{ modalGetType }}</div>
            </div>
        </div>
    </button>
</template>

<script>
    export default {
        name: 'CashierElement',
        props: ['type', 'method', 'enabled'],
        computed: {
            modalGetMethod() {
                let method = this.method.charAt(0).toUpperCase() + this.method.substring(1);

                if(this.method === 'credit') { method = 'Growtopia'; }
                else if(this.method === 'csgo') { method = 'CS:GO'; }
                else if(this.method === 'dota') { method = 'Dota 2'; }
                else if(this.method === 'gift') { method = 'Gift Cards'; }
                else if(this.method === 'btc') { method = 'Bitcoin' }
                else if(this.method === 'eth') { method = 'Ethereum' }
                else if(this.method === 'ltc') { method = 'Litecoin' }
                else if(['usdt', 'usdc', 'g2a'].includes(this.method) === true) { method = this.method.toUpperCase(); }

                return method;
            },
            modalGetType() {
                let type = this.type.charAt(0).toUpperCase() + this.type.substring(1);

                if(this.type === 'gift') { type = 'Gift Cards'; }

                return type;
            }
        }
    }
</script>

<style scoped>
    .cashier-element {
        width: calc(25% - 9px);
        height: 84px;
        margin-top: 12px;
        margin-right: 12px;
        padding: 1px;
        border-radius: 15px;
        transition: all .2s;
    }

    .cashier-element:hover {
        transition-duration: .2s; 
        opacity: .8;
        transform: translateY(-2px);
    }
    .cashier-element:active {
        transition-duration: .2s;
        transform: translateY(2px);
    }

    .cashier-element:disabled {
        mix-blend-mode: luminosity;
        opacity: 0.35;
    }

    .cashier-element:nth-child(5) {
        margin-right: 0;
    }

    .cashier-element.element-robux {
        background: linear-gradient(90deg, #1ede53 0%, rgba(30, 222, 83, 0.3) 100%);
    }

    .cashier-element.element-limiteds {
        background: linear-gradient(90deg, #5742d4 0%, rgba(87, 66, 212, 0.3) 100%);
    }

    .cashier-element.element-csgo {
        background: linear-gradient(90deg, #e19736 0%, rgba(225, 151, 54, 0.3) 100%);
    }

    .cashier-element.element-dota {
        background: linear-gradient(90deg, #8e1212 0%, rgba(142, 18, 18, 0.3) 100%);
    }

    .cashier-element.element-credit {
        background: linear-gradient(90deg, #148eff 0%, rgba(20, 142, 255, 0.3) 100%);
    }

    .cashier-element.element-btc {
        background: linear-gradient(90deg, #f7931a 0%, rgba(247, 147, 26, 0.3) 100%);
    }

    .cashier-element.element-eth {
        background: linear-gradient(90deg, #627eea 0%, rgba(98, 126, 234, 0.3) 100%);
    }

    .cashier-element.element-ltc {
        background: linear-gradient(90deg, #345d9d 0%, rgba(52, 93, 157, 0.3) 100%);
    }

    .cashier-element.element-usdt {
        background: linear-gradient(90deg, #27a17c 0%, rgba(39, 161, 124, 0.3) 100%);
    }

    .cashier-element.element-usdc {
        background: linear-gradient(90deg, #2775ca 0%, rgba(39, 117, 202, 0.3) 100%);
    }

    .cashier-element.element-kinguin {
        background: linear-gradient(90deg, #ffbc00 0%, rgba(255, 188, 0, 0.3) 100%);
    }

    .cashier-element.element-g2a {
        background: linear-gradient(90deg, #f05f00 0%, rgba(240, 95, 0, 0.3) 100%);
    }

    .cashier-element.element-gift {
        background: linear-gradient(90deg, #148eff 0%, rgba(20, 142, 255, 0.3) 100%);
    }

    .cashier-element .element-inner {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 8px;
        border-radius: 15px;
        overflow: hidden;
        z-index: 1;
    }

    .cashier-element .element-inner:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .cashier-element.element-robux .element-inner {
        background: radial-gradient(650% 160% at 100% 25%, rgba(37, 20, 0, 0.27) 0%, rgba(0, 0, 0, 0) 100%),
                    linear-gradient(0deg, rgba(30, 222, 83, 0.15) 0%, rgba(30, 222, 83, 0.15) 100%),
                    linear-gradient(90deg, rgba(30, 222, 83, 0.62) -30%, rgba(0, 0, 0, 0) 180%),
                    linear-gradient(265deg, #001626 0%, rgba(12, 52, 82, 0) 150%),
                    repeating-linear-gradient(-55deg, transparent, transparent 5px, rgba(2, 21, 36, 0.12) 5px, rgba(2, 21, 36, 0.12) 10px);
    }

    .cashier-element.element-limiteds .element-inner {
        background: radial-gradient(650% 160% at 100% 25%, rgba(37, 20, 0, 0.27) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(0deg, rgba(62, 100, 200, 0.15) 0%, rgba(62, 100, 200, 0.15) 100%), 
                    linear-gradient(90deg, rgba(76, 62, 156, 0.62) -30%, rgba(0, 0, 0, 0) 180%), 
                    linear-gradient(265deg, #001626 0%, rgba(12, 52, 82, 0) 150%),
                    repeating-linear-gradient(-55deg, transparent, transparent 5px, rgba(2, 21, 36, 0.12) 5px, rgba(2, 21, 36, 0.12) 10px);
    }

    .cashier-element.element-csgo .element-inner {
        background: radial-gradient(650% 160% at 100% 25%, rgba(37, 20, 0, 0.27) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(0deg, rgba(225, 151, 54, 0.15) 0%, rgba(225, 151, 54, 0.15) 100%), 
                    linear-gradient(90deg, rgba(225, 151, 54, 0.62) -30%, rgba(0, 0, 0, 0) 180%), 
                    linear-gradient(265deg, #001626 0%, rgba(12, 52, 82, 0) 150%),
                    repeating-linear-gradient(-55deg, transparent, transparent 5px, rgba(2, 21, 36, 0.12) 5px, rgba(2, 21, 36, 0.12) 10px);
    }

    .cashier-element.element-dota .element-inner {
        background: radial-gradient(650% 160% at 100% 25%, rgba(37, 20, 0, 0.27) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(0deg, rgba(142, 18, 18, 0.15) 0%, rgba(142, 18, 18, 0.15) 100%), 
                    linear-gradient(90deg, rgba(142, 18, 18, 0.62) -30%, rgba(0, 0, 0, 0) 180%), 
                    linear-gradient(265deg, #001626 0%, rgba(12, 52, 82, 0) 150%),
                    repeating-linear-gradient(-55deg, transparent, transparent 5px, rgba(2, 21, 36, 0.12) 5px, rgba(2, 21, 36, 0.12) 10px);
    }

    .cashier-element.element-credit .element-inner {
        background: radial-gradient(650% 160% at 100% 25%, rgba(37, 20, 0, 0.27) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(0deg, rgba(20, 142, 255, 0.15) 0%, rgba(20, 142, 255, 0.15) 100%), 
                    linear-gradient(90deg, rgba(20, 142, 255, 0.62) -30%, rgba(0, 0, 0, 0) 180%), 
                    linear-gradient(265deg, #001626 0%, rgba(12, 52, 82, 0) 150%),
                    repeating-linear-gradient(-55deg, transparent, transparent 5px, rgba(2, 21, 36, 0.12) 5px, rgba(2, 21, 36, 0.12) 10px);
    }

    .cashier-element.element-btc .element-inner {
        background: radial-gradient(650% 160% at 100% 25%, rgba(37, 20, 0, 0.27) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(0deg, rgba(247, 147, 26, 0.15) 0%, rgba(247, 147, 26, 0.15) 100%), 
                    linear-gradient(90deg, rgba(247, 147, 26, 0.62) -30%, rgba(0, 0, 0, 0) 180%), 
                    linear-gradient(265deg, #001626 0%, rgba(12, 52, 82, 0) 150%),
                    repeating-linear-gradient(-55deg, transparent, transparent 5px, rgba(2, 21, 36, 0.12) 5px, rgba(2, 21, 36, 0.12) 10px);
    }

    .cashier-element.element-eth .element-inner {
        background: radial-gradient(650% 160% at 100% 25%, rgba(37, 20, 0, 0.27) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(0deg, rgba(98, 126, 234, 0.15) 0%, rgba(98, 126, 234, 0.15) 100%), 
                    linear-gradient(90deg, rgba(98, 126, 234, 0.62) -30%, rgba(0, 0, 0, 0) 180%), 
                    linear-gradient(265deg, #001626 0%, rgba(12, 52, 82, 0) 150%),
                    repeating-linear-gradient(-55deg, transparent, transparent 5px, rgba(2, 21, 36, 0.12) 5px, rgba(2, 21, 36, 0.12) 10px);
    }

    .cashier-element.element-ltc .element-inner {
        background: radial-gradient(650% 160% at 100% 25%, rgba(37, 20, 0, 0.27) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(0deg, rgba(52, 93, 157, 0.15) 0%, rgba(52, 93, 157, 0.15) 100%), 
                    linear-gradient(90deg, rgba(52, 93, 157, 0.62) -30%, rgba(0, 0, 0, 0) 180%), 
                    linear-gradient(265deg, #001626 0%, rgba(12, 52, 82, 0) 150%),
                    repeating-linear-gradient(-55deg, transparent, transparent 5px, rgba(2, 21, 36, 0.12) 5px, rgba(2, 21, 36, 0.12) 10px);
    }

    .cashier-element.element-usdt .element-inner {
        background: radial-gradient(650% 160% at 100% 25%, rgba(37, 20, 0, 0.27) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(0deg, rgba(39, 161, 124, 0.15) 0%, rgba(39, 161, 124, 0.15) 100%), 
                    linear-gradient(90deg, rgba(39, 161, 124, 0.62) -30%, rgba(0, 0, 0, 0) 180%), 
                    linear-gradient(265deg, #001626 0%, rgba(12, 52, 82, 0) 150%),
                    repeating-linear-gradient(-55deg, transparent, transparent 5px, rgba(2, 21, 36, 0.12) 5px, rgba(2, 21, 36, 0.12) 10px);
    }

    .cashier-element.element-usdc .element-inner {
        background: radial-gradient(650% 160% at 100% 25%, rgba(37, 20, 0, 0.27) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(0deg, rgba(39, 117, 202, 0.15) 0%, rgba(39, 117, 202, 0.15) 100%), 
                    linear-gradient(90deg, rgba(39, 117, 202, 0.62) -30%, rgba(0, 0, 0, 0) 180%), 
                    linear-gradient(265deg, #001626 0%, rgba(12, 52, 82, 0) 150%),
                    repeating-linear-gradient(-55deg, transparent, transparent 5px, rgba(2, 21, 36, 0.12) 5px, rgba(2, 21, 36, 0.12) 10px);
    }

    .cashier-element.element-kinguin .element-inner {
        background: radial-gradient(650% 160% at 100% 25%, rgba(37, 20, 0, 0.27) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(0deg, rgba(255, 188, 0, 0.15) 0%, rgba(255, 188, 0, 0.15) 100%), 
                    linear-gradient(90deg, rgba(255, 188, 0, 0.62) -30%, rgba(0, 0, 0, 0) 180%), 
                    linear-gradient(266deg, #001626 0%, rgba(12, 52, 82, 0) 150%),
                    repeating-linear-gradient(-55deg, transparent, transparent 5px, rgba(2, 21, 36, 0.12) 5px, rgba(2, 21, 36, 0.12) 10px);
    }

    .cashier-element.element-g2a .element-inner {
        background: radial-gradient(650% 160% at 100% 25%, rgba(37, 20, 0, 0.27) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(0deg, rgba(240, 95, 0, 0.15) 0%, rgba(240, 95, 0, 0.15) 100%), 
                    linear-gradient(90deg, rgba(240, 95, 0, 0.62) -30%, rgba(0, 0, 0, 0) 180%), 
                    linear-gradient(265deg, #001626 0%, rgba(12, 52, 82, 0) 150%),
                    repeating-linear-gradient(-55deg, transparent, transparent 5px, rgba(2, 21, 36, 0.12) 5px, rgba(2, 21, 36, 0.12) 10px);
    }

    .cashier-element.element-gift .element-inner {
        background: radial-gradient(650% 160% at 100% 25%, rgba(37, 20, 0, 0.27) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(0deg, rgba(20, 142, 255, 0.15) 0%, rgba(20, 142, 255, 0.15) 100%), 
                    linear-gradient(90deg, rgba(20, 142, 255, 0.62) -30%, rgba(0, 0, 0, 0) 180%), 
                    linear-gradient(265deg, #001626 0%, rgba(12, 52, 82, 0) 150%),
                    repeating-linear-gradient(-55deg, transparent, transparent 5px, rgba(2, 21, 36, 0.12) 5px, rgba(2, 21, 36, 0.12) 10px);
    }

    .cashier-element .inner-background {
        position: absolute;
        top: -12px;
        right: -33px;
        transform: scaleX(-1);
        z-index: -1;
    }

    .cashier-element .inner-background img {
        width: 140px;
        opacity: 0.04;
    }

    .cashier-element .inner-image {
        width: 65px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
    }

    .cashier-element .inner-image img {
    }

    .cashier-element.element-csgo .inner-image img,
    .cashier-element.element-dota .inner-image img,
    .cashier-element.element-btc .inner-image img,
    .cashier-element.element-eth .inner-image img,
    .cashier-element.element-ltc .inner-image img,
    .cashier-element.element-usdt .inner-image img,
    .cashier-element.element-usdc .inner-image img {
        width: 45px;
    }

    .cashier-element .inner-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .cashier-element .text-method {
        font-size: 14px;
        font-weight: 800;
    }

    .cashier-element.element-robux .text-method {
        color: #1ede53;
    }

    .cashier-element.element-limiteds .text-method {
        color: #8472f1;
    }

    .cashier-element.element-csgo .text-method {
        color: #e19736;
    }

    .cashier-element.element-dota .text-method {
        color: #e75b5b;
    }

    .cashier-element.element-credit .text-method {
        color: #148eff;
    }

    .cashier-element.element-btc .text-method {
        color: #f7931a;
    }

    .cashier-element.element-eth .text-method {
        color: #627eea;
    }

    .cashier-element.element-ltc .text-method {
        color: #527fc6;
    }

    .cashier-element.element-usdt .text-method {
        color: #27a17c;
    }

    .cashier-element.element-usdc .text-method {
        color: #2775ca;
    }

    .cashier-element.element-kinguin .text-method {
        color: #ffbc00;
    }

    .cashier-element.element-g2a .text-method {
        color: #f05f00;
    }

    .cashier-element.element-gift .text-method {
        color: #148eff;
    }

    .cashier-element .text-type {
        font-size: 12px;
        font-weight: 700;
        color: #ffffff;
    }

    @media only screen and (max-width: 840px) {

        .cashier-element {
            width: calc(33.33% - 8px);
        }

        .cashier-element:nth-child(5) {
            margin-right: 12px;
        }

        .cashier-element:nth-child(4),
        .cashier-element:nth-child(7) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 625px) {

        .cashier-element {
            width: calc(50% - 6px);
        }

        .cashier-element:nth-child(4) {
            margin-right: 12px;
        }

        .cashier-element:nth-child(3),
        .cashier-element:nth-child(5) {
            margin-right: 0;
        }

    }
</style>
