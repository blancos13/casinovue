<template>
    <button v-on:click="crashInfoButton" class="crash-history-element" v-bind:class="{
        'element-high': crashGetOutcome >= 10,
        'element-mid': crashGetOutcome < 10 && crashGetOutcome >= 2
    }">
        <div class="element-inner">
            <span>{{crashGetOutcome}}x</span>
        </div>
    </button>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'CrashHistoryElement',
        props: [
            'game'
        ],
        methods: {
            ...mapActions([
                'modalsSetData', 
                'modalsSetShow'
            ]),
            crashInfoButton() {
                this.modalsSetData({ game: this.game });
                this.modalsSetShow('FairGame');
            }
        },
        computed: {
            crashGetOutcome() {
                return parseFloat(this.game.outcome / 100).toFixed(2);
            }
        }
    }
</script>

<style scoped>
    button.crash-history-element {
        width: 70px;
        height: 35px;
        position: relative;
        flex-shrink: 0;
        margin-right: 4px;
    }

    button.crash-history-element:last-of-type {
        margin-right: 0;
    }

    button.crash-history-element::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(20, 68, 104, 0) 0%, #144468 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    button.crash-history-element.element-high::before {
        background: linear-gradient(180deg, rgba(255, 230, 0, 0) 0%, #ffe600 100%);
    }

    button.crash-history-element.element-mid::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e0a3 100%);
    }

    button.crash-history-element.element-high::after,
    button.crash-history-element.element-mid::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-color: #072c44;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    button.crash-history-element .element-inner {
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

    button.crash-history-element.element-high .element-inner {
        background: radial-gradient(138.28% 81.75% at 84.57% 50%, rgba(255, 153, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, rgba(255, 153, 0, 0.05) 0%, rgba(255, 230, 0, 0.05) 100%);
    }

    button.crash-history-element.element-mid .element-inner {
        background: radial-gradient(138.28% 81.75% at 84.57% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, rgba(0, 255, 194, 0.05) 0%, rgba(0, 170, 109, 0.05) 100%);
    }

    button.crash-history-element .element-inner span {
        font-size: 14px;
        font-weight: 700;
        color: #bbbfd0;
    }

    button.crash-history-element.element-high .element-inner span {
        background: linear-gradient(255deg, #fca311 0%, #ffb703 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    button.crash-history-element.element-mid .element-inner span {
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }
</style>
