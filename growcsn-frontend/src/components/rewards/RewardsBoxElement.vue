<template>
    <router-link class="rewards-box-element" v-bind:class="['element-' + rewardsGetState]" to="/unbox/3333">
        <div class="element-state">{{ rewardsGetState }}</div>
        <div class="element-name">
            <div class="name-inner">Level 5 Case</div>
        </div>
        <div class="element-image">
            <img src="https://api.hypedraft.com/public/img/bombastic.png" />
        </div>
        <div class="element-info">
            <div v-if="rewardsGetState === 'ready'" class="info-ready">READY TO OPEN</div>
            <div v-else-if="rewardsGetState === 'locked'" class="info-locked">UNLOCKS ONCE YOU REACH LVL 5</div>
            <div v-else class="info-cooldown">
                <span>READY IN</span>
                06:02:52
            </div>
        </div>
    </router-link>
</template>

<script>
    export default {
        name: 'RewardsBoxElement',
        props: [
            'cooldown', 
            'locked'
        ],
        methods: {

        },
        computed: {
            rewardsGetState() {
                let state = 'ready';

                if(this.cooldown === true) { state = 'cooldown'; }
                else if(this.locked === true) { state = 'locked'; }

                return state;
            }
        }
    }
</script>

<style scoped>
    .rewards-box-element {
        width: calc(14.28% - 7.7px);
        height: 220px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        margin-right: 9px;
        padding: 22px 10px 10px 10px;
        background: linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.09) 50%, rgba(5, 29, 48, 0.35) 100%);
        border: 1px solid #0a273f;
        z-index: 1;
    }

    .rewards-box-element:nth-child(7n) {
        margin-right: 0;
    }

    .rewards-box-element .element-state {
        width: 82px;
        height: 21px;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: -10px;
        left: 50%;
        transform: translate(-50%, 0);
        text-transform: uppercase;
        font-size: 11px;
        font-weight: 700;
        color: #ffffff;
        background: linear-gradient(256deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .rewards-box-element.element-locked .element-state {
        color: #3d6f96;
        background: #082943;
    }

    .rewards-box-element .element-name {
        width: 100%;
        height: 32px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .rewards-box-element .element-name:before {
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

    .rewards-box-element .element-name:after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #052138;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .rewards-box-element .name-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        background: linear-gradient(0deg, rgba(29, 101, 159, 0.08) 0%, rgba(29, 101, 159, 0.08) 100%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.1) 50%, rgba(5, 29, 48, 0.35) 100%);
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .rewards-box-element .element-image {
        height: 104px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .rewards-box-element .element-image img {
        width: 130px;
    }

    .rewards-box-element .element-info {
        height: 42px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
    }

    .rewards-box-element .info-ready,
    .rewards-box-element .info-cooldown span {
        font-size: 14px;
        font-weight: 600;
        background: linear-gradient(180deg, #ffffff 0%, rgba(108, 255, 211, 0.85) 33%, rgba(8, 255, 76, 0.55) 66%, #7bff90 100%), #ffffff;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .rewards-box-element .info-locked {
        text-align: center;
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.35);
    }

    .rewards-box-element .info-cooldown {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
    }

    @media only screen and (max-width: 1200px) {

        .rewards-box-element {
            width: calc(16.66% - 7.5px);
        }

        .rewards-box-element:nth-child(7n) {
            margin-right: 9px;
        }

        .rewards-box-element:nth-child(6n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 1050px) {

        .rewards-box-element {
            width: calc(20% - 7.2px);
        }

        .rewards-box-element:nth-child(6n) {
            margin-right: 9px;
        }

        .rewards-box-element:nth-child(5n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 800px) {

        .rewards-box-element {
            width: calc(25% - 6.75px);
        }

        .rewards-box-element:nth-child(5n) {
            margin-right: 9px;
        }

        .rewards-box-element:nth-child(4n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 650px) {

        .rewards-box-element {
            width: calc(33.33% - 6px);
        }

        .rewards-box-element:nth-child(4n) {
            margin-right: 9px;
        }

        .rewards-box-element:nth-child(3n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 500px) {

        .rewards-box-element {
            width: calc(50% - 4.5px);
        }

        .rewards-box-element:nth-child(3n) {
            margin-right: 9px;
        }

        .rewards-box-element:nth-child(2n) {
            margin-right: 0;
        }

    }
</style>