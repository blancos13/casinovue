<template>
    <button v-on:click="rollInfoButton" class="roll-history-element" v-bind:class="{
        'element-high': rollGetOutcome >= 20,
        'element-mid': rollGetOutcome < 20 && rollGetOutcome >= 5,
        'element-low': rollGetOutcome < 5 && rollGetOutcome >= 2
    }">
        <div class="element-inner">
            <span>{{rollGetOutcome}}x</span>
        </div>
    </button>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'RollHistoryElement',
        props: [
            'game'
        ],
        methods: {
            ...mapActions(['modalsSetData', 'modalsSetShow']),
            rollInfoButton() {
                this.modalsSetData({ game: this.game });
                this.modalsSetShow('FairGame');
            }
        },
        computed: {
            rollGetOutcome() {
                return parseFloat(this.game.outcome / 100).toFixed(2);
            }
        }
    }
</script>

<style scoped>
    button.roll-history-element {
        width: 70px;
        height: 35px;
        position: relative;
        flex-shrink: 0;
        margin-right: 4px;
        transition: all .2s;
    }
    .roll-history-element:hover {
        transition-duration: .2s;
        opacity: .7;
        transform: translateY(-2px);
    }
    .roll-history-element:active {
        transition-duration: .2s;
        /* background: #083e57; */
        transform: translateY(2px);
    }

    button.roll-history-element:last-of-type {
        margin-right: 0;
    }

    button.roll-history-element::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(20, 68, 104, 0) 0%, #144468 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    button.roll-history-element.element-high::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #de4422 100%);
    }

    button.roll-history-element.element-mid::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #ffe600 100%);
    }

    button.roll-history-element.element-low::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e0a3 100%);
    }

    button.roll-history-element.element-high::after,
    button.roll-history-element.element-mid::after,
    button.roll-history-element.element-low::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-color: #042138;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    button.roll-history-element .element-inner {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 1px;
        left: 1px;
        background: linear-gradient(255deg, #04243e 0%, #0c314d 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
        z-index: 1;
    }

    button.roll-history-element.element-high .element-inner {
        background: radial-gradient(140% 80% at 85% 50%, rgba(222, 35, 35, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, rgba(222, 35, 35, 0.05) 0%, rgba(255, 35, 35, 0.05) 100%);
    }

    button.roll-history-element.element-mid .element-inner {
        background: radial-gradient(140% 80% at 85% 50%, rgba(255, 153, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, rgba(255, 153, 0, 0.05) 0%, rgba(255, 230, 0, 0.05) 100%);
    }

    button.roll-history-element.element-low .element-inner {
        background: radial-gradient(140% 80% at 85% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, rgba(0, 255, 194, 0.05) 0%, rgba(0, 170, 109, 0.05) 100%);
    }

    button.roll-history-element .element-inner span {
        font-size: 14px;
        font-weight: 700;
        color: #bbbfd0;
    }

    button.roll-history-element.element-high .element-inner span {
        background: linear-gradient(250deg, #d15e5e 0%, #ff4545 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    button.roll-history-element.element-mid .element-inner span {
        background: linear-gradient(255deg, #fca311 0%, #ffb703 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    button.roll-history-element.element-low .element-inner span {
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }
</style>
