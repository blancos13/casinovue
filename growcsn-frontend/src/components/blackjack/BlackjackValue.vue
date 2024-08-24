<template>
    <div class="blackjack-value" v-bind:class="{
        'value-won': state === 'won',
        'value-lose': state === 'lose' 
    }">
        <div class="value-inner">
            <svg v-if="state === 'won'" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.2 0.8H12.8V0H3.2V0.8H0.8C0.32 0.8 0 1.12 0 1.6V3.52C0 5.36 1.36 6.88 3.2 7.12V7.2C3.2 9.52 4.8 11.44 6.96 11.92L6.4 13.6H4.56C4.24 13.6 3.92 13.84 3.84 14.16L3.2 16H12.8L12.16 14.16C12.08 13.84 11.76 13.6 11.44 13.6H9.6L9.04 11.92C11.2 11.44 12.8 9.52 12.8 7.2V7.12C14.64 6.88 16 5.36 16 3.52V1.6C16 1.12 15.68 0.8 15.2 0.8ZM3.2 5.52C2.32 5.28 1.6 4.48 1.6 3.52V2.4H3.2V5.52ZM9.6 8L8 7.12L6.4 8L6.8 6.4L5.6 4.8H7.28L8 3.2L8.72 4.8H10.4L9.2 6.4L9.6 8ZM14.4 3.52C14.4 4.48 13.68 5.36 12.8 5.52V2.4H14.4V3.52Z" fill="black"/>
                <path d="M15.2 0.8H12.8V0H3.2V0.8H0.8C0.32 0.8 0 1.12 0 1.6V3.52C0 5.36 1.36 6.88 3.2 7.12V7.2C3.2 9.52 4.8 11.44 6.96 11.92L6.4 13.6H4.56C4.24 13.6 3.92 13.84 3.84 14.16L3.2 16H12.8L12.16 14.16C12.08 13.84 11.76 13.6 11.44 13.6H9.6L9.04 11.92C11.2 11.44 12.8 9.52 12.8 7.2V7.12C14.64 6.88 16 5.36 16 3.52V1.6C16 1.12 15.68 0.8 15.2 0.8ZM3.2 5.52C2.32 5.28 1.6 4.48 1.6 3.52V2.4H3.2V5.52ZM9.6 8L8 7.12L6.4 8L6.8 6.4L5.6 4.8H7.28L8 3.2L8.72 4.8H10.4L9.2 6.4L9.6 8ZM14.4 3.52C14.4 4.48 13.68 5.36 12.8 5.52V2.4H14.4V3.52Z" fill="url(#blackjack-icon-linear-1)"/>
                <defs>
                    <linearGradient id="blackjack-icon-linear-1" x1="16" y1="0" x2="-2.79248" y2="4.60555" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#00ffc2"/>
                        <stop offset="1" stop-color="#00aa6d"/>
                    </linearGradient>
                </defs>
            </svg>
            <svg v-else-if="state === 'lose'" width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.00098 0.672668C3.58998 0.672668 0.000976562 4.26167 0.000976562 8.67267C0.000976562 13.0837 3.58998 16.6727 8.00098 16.6727C12.412 16.6727 16.001 13.0837 16.001 8.67267C16.001 4.26167 12.412 0.672668 8.00098 0.672668ZM4.00098 6.67267C4.00098 6.12167 4.44998 5.67267 5.00098 5.67267C5.55198 5.67267 6.00098 6.12167 6.00098 6.67267C6.00098 7.22367 5.55198 7.67267 5.00098 7.67267C4.44998 7.67267 4.00098 7.22367 4.00098 6.67267ZM11.536 12.8447C11.438 12.9427 11.31 12.9907 11.182 12.9907C11.054 12.9907 10.926 12.9417 10.828 12.8447C9.31598 11.3327 6.68198 11.3327 5.17098 12.8447C4.97598 13.0397 4.65898 13.0397 4.46398 12.8447C4.26898 12.6497 4.26898 12.3327 4.46398 12.1377C5.40998 11.1937 6.66498 10.6727 8.00098 10.6727C9.33698 10.6727 10.592 11.1937 11.536 12.1377C11.731 12.3327 11.731 12.6497 11.536 12.8447ZM11.001 7.67267C10.45 7.67267 10.001 7.22367 10.001 6.67267C10.001 6.12167 10.45 5.67267 11.001 5.67267C11.552 5.67267 12.001 6.12167 12.001 6.67267C12.001 7.22367 11.552 7.67267 11.001 7.67267Z" />
            </svg>
            <span v-else>{{value}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'BlackjackValue',
        props: [
            'value', 
            'state'
        ]
    }
</script>

<style scoped>
    .blackjack-value {
        width: 36px;
        height: 33px;
        position: absolute;
        bottom: 0;
        left: 0;
        transform: translate(-13px, 15px);
        padding: 1px;
        transition: filter 0.3s ease;
    }

    .blackjack-value.value-active {
        filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.96));
    }

    .blackjack-value.value-won {
        filter: drop-shadow(0px 0px 10px #01ce53);
    }

    .game-dealer .blackjack-value {
        transform: translate(-23px, -18px);
    }

    .stack-split .blackjack-value {
        width: 32px;
        height: 29px;
    }

    .blackjack-value::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #00ffc2 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .blackjack-value.value-lose::before {
        background: linear-gradient(180deg, rgba(197, 64, 43, 0) 0%, #c5402b 100%);
    }

    .blackjack-value .value-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #023b33;
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .blackjack-value.value-won .value-inner {
        background: #023b33;
    }

    .blackjack-value.value-lose .value-inner {
        background: #422727;
    }

    .blackjack-value .value-inner span {
        /* font-family: 'Rubik'; */
        font-size: 18px;
        font-weight: 600;
        color: #ffffff;
    }

    .stack-split .blackjack-value .value-inner span {
        font-size: 16px;
    }

    .blackjack-value.value-blackjack .value-inner span {
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%), #a6cae8;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .blackjack-value .value-inner svg {
        fill: #0dd4b1;
    }

    .blackjack-value.value-lose .value-inner svg {
        fill: #ef4949;
    }
</style>
