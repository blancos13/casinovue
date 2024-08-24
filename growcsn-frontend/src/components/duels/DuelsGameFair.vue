<template>
    <div class="duels-game-fair">
        <div class="fair-hash">
            <span>SERVER SEED HASH:</span>
            {{duelsGame.fair.hash}}
        </div>
        <div v-if="duelsGame.state === 'completed'" class="fair-server">
            <span>SERVER SEED:</span>
            {{duelsGame.fair.seedServer}}
        </div>
        <div v-if="duelsGame.state === 'completed'" class="fair-public">
            <span>PUBLIC SEED:</span>
            {{duelsGame.fair.seedPublic}}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'DuelsGameFair',
        props: [
            'duelsGame'
        ]
    }
</script>

<style scoped>
    .duels-game-fair {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 45px;
    }

    .duels-game-fair .fair-hash,
    .duels-game-fair .fair-server,
    .duels-game-fair .fair-public {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        -ms-word-break: break-all;
        word-break: break-word;
        font-size: 14px;
        font-weight: 600;
        color: #5e768e;
    }

    .duels-game-fair .fair-server,
    .duels-game-fair .fair-public {
        margin-top: 20px;
    }

    .duels-game-fair .fair-hash span,
    .duels-game-fair .fair-server span,
    .duels-game-fair .fair-public span {
        font-weight: 800;
        color: #7a93ac;
    }
</style>
