<template>
    <div class="profile-settings-element" v-bind:class="{ 'element-success': info === 'success' }">
        <div class="element-name">
            <svg v-if="info === 'success'" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
            </svg>
            <svg v-else-if="info === 'warning'" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
            </svg>
            {{name}}
        </div>
        <div class="element-action">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ProfileSettingsElement',
        props: ['name', 'info']
    }
</script>

<style scoped>
    .profile-settings-element {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
        background: rgba(19, 66, 88, 0.1);
    }

    .profile-settings-element:nth-child(odd) {
        background: rgba(19, 66, 88, 0.25);
    }

    .profile-settings-element:first-of-type {
        margin-top: 0;
    }

    .profile-settings-element .element-name {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #bbbfd0;
    }

    .profile-settings-element .element-name svg {
        margin-right: 9px;
        fill: #db7d48;
    }

    .profile-settings-element.element-success .element-name svg {
        fill: #00ffc2;
    }

    .profile-settings-element .element-action {
        display: flex;
        align-items: center;
    }
</style>