<template>
    <div class="fair-blackjack">
        <div class="blackjack-title">BLACKJACK</div>
        <div class="blackjack-text">
            <p>Our system generates the result for each game by using the SHA-256 hash of 2 separate inputs:</p>
            <p><span>Game ID:</span> The games unique identifier which is generated when the game is created.</p>
            <p><span>Server Seed:</span> Is a cryptographically secure pseudo-randomly generated string.</p>
            <p><span>Public Seed:</span> Is the id of an EOS Block found after the bets are made.</p>
        </div>
        <div class="blackjack-code">
            <pre>
                <code>
const crypto = require('crypto');
const ChanceJs = require('chance');

const cardRanks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const cardSuits = ['heart', 'spade', 'diamond', 'club'];

const deckCount = 8;
const gameId = '6443aa99f4290f71b555f4bd';
const serverSeed = '4c60603de55e3b85fe67450aa124ec34509cb73b0f1fde15';
const publicSeed = '128b71e19b3c4bd9ec01eba9d6840bdda2a8d0972ac918c9d937c7f861879727';

const fairGenerateBlackjackDeck = () => {
    let deck = [];

    for(let d =  0; d &lt; deckCount; d++) {
        for(let s = 0; s &lt; cardSuits.length; s++) {
            for(let r = 0; r &lt; cardRanks.length; r++) {
                deck.push({ rank: cardRanks[r], suit: cardSuits[s] });
            }
        }
    }

    return deck;
}

const fairShuffleBlackjackDeck = (deck) => {
    const combined = `${gameId}-${serverSeed}-${publicSeed}`;
    const hash = crypto.createHash('sha256').update(combined).digest('hex');

    const chance = new ChanceJs(hash);
    deck = chance.shuffle(deck);

    console.log(deck);
}

let deck = fairGenerateBlackjackDeck();
fairShuffleBlackjackDeck(deck);
                </code>
            </pre>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'FairBlackjack'
    }
</script>

<style scoped>
    .fair-blackjack {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .fair-blackjack .blackjack-title {
        font-size: 24px;
        font-weight: 900;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%), #a6cae8;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .fair-blackjack .blackjack-text {
        margin-top: 12px;
        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;
    }

    .fair-blackjack .blackjack-text p {
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .fair-blackjack .blackjack-text p span {
        color: #00ffc2;
    }

    .fair-blackjack .blackjack-code {
        width: 100%;
        height: 225px;
        margin-top: 25px;
        padding: 16px 4px 16px 16px;
        border-radius: 8px;
        background: #071f2e;
    }

    .fair-blackjack .blackjack-code pre {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    .fair-blackjack .blackjack-code pre::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: #0d4557;
    }

    .fair-blackjack .blackjack-code pre::-webkit-scrollbar {
        width: 3px;
        height: 0;
    }

    .fair-blackjack .blackjack-code pre code {
        font-size: 13px;
        font-weight: 600;
        color: rgba(187, 191, 208, 0.5);
    }
</style>