<template>
    <button v-on:click="modalsSetShow('Login')" class="auth-button">
        <div class="button-inner">
            SIGN IN
        </div>
    </button>
</template>

<script>
    import { mapActions } from 'vuex';
    import IconRoblox from '@/components/icons/IconRoblox';

    export default {
        name: 'AuthButton',
        components: {
            IconRoblox
        },
        methods: {
            ...mapActions(['modalsSetShow'])
        }
    }
</script>

<style scoped>
    button.auth-button {
        height: 50px;
        filter: drop-shadow(0px 2px 10px rgba(1, 230, 169, 0.15));
        transition: all;
    }

    .auth-button:hover {
        transition-duration: .1s;
        transform: translateY(-1px);
        opacity: 0.8;
    }
    .auth-button:active {
        transition-duration: .2s;
        transform: translateY(2px);
    }
    button.auth-button .button-inner {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 22px;
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
    }

    button.auth-button .button-inner svg {
        margin-right: 11px;
        fill: #ffffff;
    }
</style>
