<template>
    <router-link class="link-gradient">
        <div class="link-inner">
            <slot></slot>
        </div>
    </router-link>
</template>

<script>
    export default {
        name: 'LinkGradient'
    }
</script>

<style scoped>
    a.link-gradient {
        position: relative;
        padding: 1px;
    }

    a.link-gradient::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    a.link-gradient .link-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
