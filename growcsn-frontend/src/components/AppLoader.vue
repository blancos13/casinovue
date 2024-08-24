<template>
    <div class="app-loader">
        <div class="loader-container">
            <div class="container-inner">
                <img src="@/assets/img/new-loader.png" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AppMaintenance'
    }
</script>

<style scoped>
    .app-loader {
        width: 100%;
        height: 100%;
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
    }
    .app-loader .loader-container {
        width: 100%;
        height: 100%;
        position: relative;
        padding: 2px;
        border-radius: 50%;
        overflow: hidden;
    }
    .app-loader .loader-container::before {
        content: '';
        /* width: 160px;
        height: 160px;
        position: absolute; */
        top: 50%;
        left: 50%;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.2) 25%, #01EBAE 100%);
        z-index: -1;
        animation: rotateAnimation 2s linear infinite;
    }
    .app-loader .container-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
    .app-loader .container-inner img {
        width: 18.576rem;
    }
    @keyframes rotateAnimation {
        0% {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }
</style>
