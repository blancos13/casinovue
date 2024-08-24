<template>
    <div class="fair-unbox">
        <div class="unbox-title">UNBOX</div>
        <div class="unbox-text">
            <p>Our system generates the result for each game by using the SHA-256 hash of 3 separate inputs:</p>
            <p><span>Server Seed:</span> Is a cryptographically secure pseudo-randomly generated string.</p>
            <p><span>Nonce:</span> Is a number that is incremented with every user bet.</p>
            <p><span>Client Seed:</span> Is a string which is determined by the user and can be changed at any time.</p>
        </div>
        <div class="unbox-code">
            <pre>
                <code>
const crypto = require('crypto');

const serverSeed = '4c60603de55e3b85fe67450aa124ec34509cb73b0f1fde15';
const nonce = 1;
const clientSeed = 'customClientSeed';

const fairGetUnboxOutcome = () => {
    const combined = `${serverSeed}-${nonce}-${clientSeed}`;
    const hash = crypto.createHash('sha256').update(combined).digest('hex');
    const outcome = parseInt(hash.substr(0, 8), 16) % 100000;

    console.log(outcome);
}

fairGetUnboxOutcome();
                </code>
            </pre>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'FairUnbox'
    }
</script>

<style scoped>
    .fair-unbox {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .fair-unbox .unbox-title {
        font-size: 24px;
        font-weight: 900;
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%), #a6cae8;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .fair-unbox .unbox-text {
        margin-top: 12px;
        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;
    }

    .fair-unbox .unbox-text p {
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .fair-unbox .unbox-text p span {
        color: #00ffc2;
    }

    .fair-unbox .unbox-code {
        width: 100%;
        height: 225px;
        margin-top: 25px;
        padding: 16px 4px 16px 16px;
        border-radius: 8px;
        background: #071f2e;
    }

    .fair-unbox .unbox-code pre {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    .fair-unbox .unbox-code pre::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: #0d4557;
    }

    .fair-unbox .unbox-code pre::-webkit-scrollbar {
        width: 3px;
        height: 0;
    }

    .fair-unbox .unbox-code pre code {
        font-size: 13px;
        font-weight: 600;
        color: rgba(187, 191, 208, 0.5);
    }
</style>