<template>
    <div class="button-loading">
        <div class="loading-element">
            <div class="element-inner"></div>
        </div>
        <div class="loading-element">
            <div class="element-inner"></div>
        </div>
        <div class="loading-element">
            <div class="element-inner"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ButtonLoading'
    }
</script>

<style scoped>
    .button-loading {
        width: 100%;
        max-width: 45px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .button-loading .loading-element {
        width: 10px;
        height: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: rotate(45deg);
        background-color: rgba(255, 255, 255, 0.3);
    }

    .button-loading .element-inner {
        width: 10px;
        height: 10px;
        background-color: #ff4232;
        animation: loading_animation 1.5s infinite ease-in-out both;
        background-color: rgba(255, 255, 255, 0.5);
    }

    .button-loading .loading-element:nth-child(1) .element-inner {
        animation-delay: -320ms;
    }

    .button-loading .loading-element:nth-child(2) .element-inner {
        animation-delay: -160ms;
    }

    @keyframes loading_animation {
        0%, 80%, 100% {
            transform: scale(0);
        }
        40% {
            transform: scale(1);
        }
    }
</style>
