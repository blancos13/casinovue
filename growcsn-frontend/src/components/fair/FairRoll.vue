<template>
    <div class="fair-roll">
        <div class="roll-title">ROLL</div>
        <div class="roll-text">
            <p>Our system generates the result for each game by using the SHA-256 hash of 3 separate inputs:</p>
            <p><span>Game ID:</span> The games unique identifier which is generated when the game is created.</p>
            <p><span>Server Seed:</span> Is a list of hashed which is generated from one genesis seed.</p>
            <p>First ever used seed was: ce739807ffaedaf78d18c03cce197a69a52d4f1a7785e340045e9ab41bd10193.</p>
        </div>
        <div class="roll-code">
            <pre>
                <code>
const crypto = require('crypto');

const gameId = '6443aa99f4290f71b555f4bd';
const serverSeed = '4c60603de55e3b85fe67450aa124ec34509cb73b0f1fde15';
const publicSeed = '0000000000000000000064f15cc7d2ffaae05c8d79b980e0fb6136202166446f';

const divisible = (hash, mod) => {
    let val = 0;

    let o = hash.length % 4;
    for (let i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
        val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
    }

    return val === 0;
}

const fairGetRollOutcome = () => {
    const combined = `${gameId}-${serverSeed}-${publicSeed}`;
    const hash = crypto.createHash('sha256').update(combined).digest('hex');

    const mod = parseInt(100 / (0.05 * 100));
    if(divisible(hash, mod) === true) {
        return 100;
    }

    const h = parseInt(hash.slice(0, 52 / 4), 16);
    const e = Math.pow(2, 52);

    const roll = Math.floor((100 * e - h) / (e - h));

    console.log(`Outcome: ${roll}`);
}

fairGetRollOutcome();
                </code>
            </pre>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'FairRoll'
    }
</script>

<style scoped>
    .fair-roll {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .fair-roll .roll-title {
        font-size: 24px;
        font-weight: 900;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%), #a6cae8;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .fair-roll .roll-text {
        margin-top: 12px;
        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;
    }

    .fair-roll .roll-text p {
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .fair-roll .roll-text p span {
        color: #00ffc2;
    }

    .fair-roll .roll-code {
        width: 100%;
        height: 225px;
        margin-top: 25px;
        padding: 16px 4px 16px 16px;
        border-radius: 8px;
        background: #071f2e;
    }

    .fair-roll .roll-code pre {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    .fair-roll .roll-code pre::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: #0d4557;
    }

    .fair-roll .roll-code pre::-webkit-scrollbar {
        width: 3px;
        height: 0;
    }

    .fair-roll .roll-code pre code {
        font-size: 13px;
        font-weight: 600;
        color: rgba(187, 191, 208, 0.5);
    }
</style>