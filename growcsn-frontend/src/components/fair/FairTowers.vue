<template>
    <div class="fair-towers">
        <div class="towers-title">TOWERS</div>
        <div class="towers-text">
            <p>Our system generates the result for each game by using the SHA-256 hash of 3 separate inputs:</p>
            <p><span>Server Seed:</span> Is a cryptographically secure pseudo-randomly generated string.</p>
            <p><span>Nonce:</span> Is a number that is incremented with every user bet.</p>
            <p><span>Client Seed:</span> Is a string which is determined by the user and can be changed at any time.</p>
        </div>
        <div class="towers-code">
            <pre>
                <code>
const crypto = require('crypto');
const ChanceJs = require('chance');

const towersRisk = 'easy';
const serverSeed = '4c60603de55e3b85fe67450aa124ec34509cb73b0f1fde15';
const nonce = 1;
const clientSeed = 'customClientSeed';

const fairGenerateTowersDeck = () => {
    let deck = [];

    for(let rowIndex = 0; rowIndex &lt; 8; rowIndex++) {
        const tilesPerRow = towersRisk === 'medium' ? 2 : 3;
        const losePerRow = towersRisk === 'hard' ? 2 : 1;

        deck[rowIndex] = [];
        for(let tileIndex = 0; tileIndex &lt; tilesPerRow; tileIndex++) {
            if(tileIndex &lt; losePerRow) {
                deck[rowIndex].push('lose');
            } else {
                deck[rowIndex].push('coin');
            }
        }
    }

    return deck;
}

const fairGetTowersOutcome = () => {
    let deck = fairGenerateTowersDeck();
    const combined = `${serverSeed}-${nonce}-${clientSeed}`;

    for(let rowIndex = 0; rowIndex &lt; 8; rowIndex++) {
        const hash = crypto.createHash('sha256').update(`${combined}-${rowIndex}`).digest('hex');

        const chance = new ChanceJs(hash);
        deck[rowIndex] = chance.shuffle(deck[rowIndex]);
    }

    console.log(deck);
}

fairGetTowersOutcome();
                </code>
            </pre>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'FairTowers'
    }
</script>

<style scoped>
    .fair-towers {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .fair-towers .towers-title {
        font-size: 24px;
        font-weight: 900;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%), #a6cae8;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .fair-towers .towers-text {
        margin-top: 12px;
        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;
    }

    .fair-towers .towers-text p {
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .fair-towers .towers-text p span {
        color: #00ffc2;
    }

    .fair-towers .towers-code {
        width: 100%;
        height: 225px;
        margin-top: 25px;
        padding: 16px 4px 16px 16px;
        border-radius: 8px;
        background: #071f2e;
    }

    .fair-towers .towers-code pre {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    .fair-towers .towers-code pre::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: #0d4557;
    }

    .fair-towers .towers-code pre::-webkit-scrollbar {
        width: 3px;
        height: 0;
    }

    .fair-towers .towers-code pre code {
        font-size: 13px;
        font-weight: 600;
        color: rgba(187, 191, 208, 0.5);
    }
</style>