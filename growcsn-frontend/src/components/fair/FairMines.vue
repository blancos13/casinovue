<template>
    <div class="fair-mines">
        <div class="mines-title">MINES</div>
        <div class="mines-text">
            <p>Our system generates the result for each game by using the SHA-256 hash of 3 separate inputs:</p>
            <p><span>Server Seed:</span> Is a cryptographically secure pseudo-randomly generated string.</p>
            <p><span>Nonce:</span> Is a number that is incremented with every user bet.</p>
            <p><span>Client Seed:</span> Is a string which is determined by the user and can be changed at any time.</p>
        </div>
        <div class="mines-code">
            <pre>
                <code>
const crypto = require('crypto');
const ChanceJs = require('chance');

const minesCount = 1;
const serverSeed = '4c60603de55e3b85fe67450aa124ec34509cb73b0f1fde15';
const nonce = 1;
const clientSeed = 'customClientSeed';

const fairGenerateMinesDeck= () => {
    let deck = [];

    for(let i = 0; i &lt; 25; i++) {
        if(i &lt; minesCount) {
            deck.push('mine');
        } else {
            deck.push('coin');
        }
    }

    return deck;
}

const fairGetMinesOutcome = () => {
    let deck = fairGenerateMinesDeck();

    const combined = `${serverSeed}-${nonce}-${clientSeed}`;
    const hash = crypto.createHash('sha256').update(combined).digest('hex');

    const chance = new ChanceJs(hash);
    deck = chance.shuffle(deck);

    console.log(deck);
}

fairGetMinesOutcome();
                </code>
            </pre>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'FairMines'
    }
</script>

<style scoped>
    .fair-mines {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .fair-mines .mines-title {
        font-size: 24px;
        font-weight: 900;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%), #a6cae8;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .fair-mines .mines-text {
        margin-top: 12px;
        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;
    }

    .fair-mines .mines-text p {
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .fair-mines .mines-text p span {
        color: #00ffc2;
    }

    .fair-mines .mines-code {
        width: 100%;
        height: 225px;
        margin-top: 25px;
        padding: 16px 4px 16px 16px;
        border-radius: 8px;
        background: #071f2e;
    }

    .fair-mines .mines-code pre {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    .fair-mines .mines-code pre::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: #0d4557;
    }

    .fair-mines .mines-code pre::-webkit-scrollbar {
        width: 3px;
        height: 0;
    }

    .fair-mines .mines-code pre code {
        font-size: 13px;
        font-weight: 600;
        color: rgba(187, 191, 208, 0.5);
    }
</style>