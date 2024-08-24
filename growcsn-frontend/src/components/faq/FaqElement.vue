<template>
    <div class="faq-element" v-bind:class="{ 'element-open': faqOpen === true }">
        <button v-on:click="faqToggleButton()" class="button-toggle">
            {{title}}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.585 8.58505L12 13.1701L7.415 8.58505L6 10.0001L12 16.0001L18 10.0001L16.585 8.58505Z" />
            </svg>
        </button>
        <div v-if="faqOpen === true" class="element-text">{{text}}</div>
    </div>
</template>

<script>
    export default {
        name: 'FaqElement',
        props: ['title', 'text'],
        data() {
            return {
                faqOpen: false
            }
        },
        methods: {
            faqToggleButton() {
                this.faqOpen = !this.faqOpen;
            }
        }
    }
</script>

<style scoped>
    .faq-element {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 12px;
        padding: 0 16px;
        border-radius: 8px;
        background: rgba(13, 69, 87, 0.6);
        border: 1px solid rgba(13, 69, 87, 0.6);
        transition: all 0.3s ease;
    }

    .faq-element.element-open {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: radial-gradient(1600% 100% at 0% 0%, rgba(0, 255, 194, 0.05) 0%, rgba(0, 255, 194, 0.00) 100%), #0d4557;
    }

    .faq-element:first-of-type {
        margin-top: 0;
    }

    .faq-element button.button-toggle {
        width: 100%;
        height: 48px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
    }

    .faq-element button.button-toggle svg {
        fill: #75adc2;
    }

    .faq-element.element-open button.button-toggle svg {
        transform: rotate(180deg);
        fill: #ffffff;
    }

    .faq-element .element-text {
        width: 100%;
        padding-bottom: 16px;
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
    }
</style>