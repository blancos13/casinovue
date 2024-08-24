<template>
    <div class="fair-battles">
        <div class="battles-title">BATTLES</div>
        <div class="battles-text">
            <p>Our system generates the result for each game by using the SHA-256 hash of 5 separate inputs:</p>
            <p><span>Game ID:</span> The games unique identifier which is generated when the game is created.</p>
            <p><span>Server Seed:</span> Is a cryptographically secure pseudo-randomly generated string.</p>
            <p><span>Public Seed:</span> Is the id of an EOS Block found after the last user joined the game.</p>
            <p><span>Round:</span> The game round number.</p>
            <p><span>Player:</span> The users game position.</p>
        </div>
        <div class="battles-code">
            <pre>
                <code>
const crypto = require('crypto');

const roundCount = '2';
const playerCount = '2';
const gameId = '6443aa99f4290f71b555f4bd';
const serverSeed = '4c60603de55e3b85fe67450aa124ec34509cb73b0f1fde15';
const publicSeed = '128b71e19b3c4bd9ec01eba9d6840bdda2a8d0972ac918c9d937c7f861879727';

const fairGetBattlesOutcome = () => {
    for(round = 0; round < roundCount; round++) {
        for(player = 0; player < playerCount; player++) {
            const combined = `${gameId}-${serverSeed}-${publicSeed}-${round}-${player}`;
            const hash = crypto.createHash('sha256').update(combined).digest('hex');
            const outcome = parseInt(hash.substr(0, 8), 16) % 10000;

            console.log(`Round: ${round + 1} - Player: ${player + 1} - Outcome: ${outcome}`);
        }
    }
}

fairGetBattlesOutcome();
                </code>
            </pre>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'FairBattles'
    }
</script>

<style scoped>
    .fair-battles {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .fair-battles .battles-title {
        font-size: 24px;
        font-weight: 900;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%), #a6cae8;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .fair-battles .battles-text {
        margin-top: 12px;
        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;
    }

    .fair-battles .battles-text p {
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .fair-battles .battles-text p span {
        color: #00ffc2;
    }

    .fair-battles .battles-code {
        width: 100%;
        height: 225px;
        margin-top: 25px;
        padding: 16px 4px 16px 16px;
        border-radius: 8px;
        background: #071f2e;
    }

    .fair-battles .battles-code pre {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    .fair-battles .battles-code pre::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: #0d4557;
    }

    .fair-battles .battles-code pre::-webkit-scrollbar {
        width: 3px;
        height: 0;
    }

    .fair-battles .battles-code pre code {
        font-size: 13px;
        font-weight: 600;
        color: rgba(187, 191, 208, 0.5);
    }
</style>