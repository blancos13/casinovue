<template>
    <div class="box-level" v-bind:class="'level-'+color">
        <div class="level-inner">{{level}}</div>
    </div>
</template>

<script>
    export default {
        name: 'BoxLevel',
        props: ['level', 'color']
    }
</script>

<style scoped>
    .box-level {
        width: 38px;
        height: 28px;
        position: relative;
        margin-left: 12px;
    }

    .box-level::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #9e9e9e 100%);
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .box-level.level-blue::before {
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #559ee4 100%);
    }

    .box-level.level-green::before {
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #b8e92d 100%);
    }

    .box-level.level-orange::before {
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #fca311 100%);
    }

    .box-level.level-red::before {
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #ff4e4e 100%);
    }

    .box-level.level-purple::before {
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #6953f1 100%);
    }

    .box-level::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #063141;
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .chat-message-element .box-level::after {
        background-color: #052139;
    }

    .box-level .level-inner {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 1px;
        left: 1px;
        font-size: 12px;
        font-weight: 700;
        color: #9e9e9e;
        background: rgba(158, 158, 158, 0.05);
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
        z-index: 1;
    }

    .box-level.level-blue .level-inner {
        color: #559ee4;
        background: rgba(85, 158, 228, 0.05);
    }

    .box-level.level-green .level-inner {
        color: #b8e92d;
        background: rgba(184, 233, 45, 0.05);
    }

    .box-level.level-orange .level-inner {
        color: #fca311;
        background: rgba(252, 163, 17, 0.05);
    }

    .box-level.level-red .level-inner {
        color: #ff4e4e;
        background: rgba(255, 78, 78, 0.05);
    }

    .box-level.level-purple .level-inner {
        color: #6953f1;
        background: rgba(105, 83, 241, 0.05);
    }
</style>