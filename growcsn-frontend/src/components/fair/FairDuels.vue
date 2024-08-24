<template>
    <div class="fair-duels">
        <div class="duels-title">DICE DUELS</div>
        <div class="duels-text">
            <p>Our system generates the result for each game by using the SHA-256 hash of 4 separate inputs:</p>
            <p><span>Game ID:</span> The games unique identifier which is generated when the game is created.</p>
            <p><span>Server Seed:</span> Is a cryptographically secure pseudo-randomly generated string.</p>
            <p><span>Public Seed:</span> Is the id of an EOS Block found after the last user joined the game.</p>
            <p><span>Roll Index:</span> The users game roll position.</p>
        </div>
        <div class="duels-code">
            <pre>
                <code>
const crypto = require('crypto');

const playerCount = '2';
const gameId = '6443aa99f4290f71b555f4bd';
const serverSeed = '4c60603de55e3b85fe67450aa124ec34509cb73b0f1fde15';
const publicSeed = '128b71e19b3c4bd9ec01eba9d6840bdda2a8d0972ac918c9d937c7f861879727';

const fairGetDuelsOutcome = () => {
    for(index = 0; index < playerCount; index++) {
        const combined = `${gameId}-${serverSeed}-${publicSeed}-${index}`;
        const hash = crypto.createHash('sha256').update(combined).digest('hex');
        const roll = parseInt(hash.substr(0, 8), 16) % 10000;

        console.log(`Player: ${index + 1} - Outcome: ${roll}`);
    }
}

fairGetDuelsOutcome();
                </code>
            </pre>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'FairDuels'
    }
</script>

<style scoped>
    .fair-duels {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .fair-duels .duels-title {
        font-size: 24px;
        font-weight: 900;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%), #a6cae8;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .fair-duels .duels-text {
        margin-top: 12px;
        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;
    }

    .fair-duels .duels-text p {
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .fair-duels .duels-text p span {
        color: #00ffc2;
    }

    .fair-duels .duels-code {
        width: 100%;
        height: 225px;
        margin-top: 25px;
        padding: 16px 4px 16px 16px;
        border-radius: 8px;
        background: #071f2e;
    }

    .fair-duels .duels-code pre {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    .fair-duels .duels-code pre::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: #0d4557;
    }

    .fair-duels .duels-code pre::-webkit-scrollbar {
        width: 3px;
        height: 0;
    }

    .fair-duels .duels-code pre code {
        font-size: 13px;
        font-weight: 600;
        color: rgba(187, 191, 208, 0.5);
    }
</style>