<template>
    <div class="blackjack-card" v-bind:class="[{ 'card-hidden': card.rank === 'hidden' }, 'card-' + card.suit]">
        <div class="card-inner">
            <div class="inner-front" v-if="card.rank !== 'hidden'">
                <img v-bind:src="require('@/assets/img/blackjack/cards/' + card.rank.toLowerCase() + '_' + card.suit + '.jpg')" alt="blackjack-logo" />
            </div>
            <div class="inner-back">
                <img src="@/assets/img/blackjack/cards/back.png" alt="blackjack-logo" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'BlackjackCard',
        props: ['card']
    }
</script>

<style scoped>
    .blackjack-card {
        width: 60px;
        height: 84px;
        position: absolute;
        bottom: 0;
        left: 0;
        perspective: 1000px;
    }

    .left-cards .blackjack-card,
    .right-cards .blackjack-card {
        width: 53px;
        height: 74px;
    }

    .game-dealer .blackjack-card {
        top: 0;
        bottom: inherit;
    }

    .blackjack-card:nth-child(2) {
        bottom: 15px;
        left: 20px;
    }

    .game-dealer .blackjack-card:nth-child(2) {
        top: 15px;
        bottom: inherit;
    }

    .blackjack-card:nth-child(3) {
        bottom: 30px;
        left: 40px;
    }

    .game-dealer .blackjack-card:nth-child(3) {
        top: 30px;
        bottom: inherit;
    }

    .blackjack-card:nth-child(4) {
        bottom: 45px;
        left: 60px;
    }

    .game-dealer .blackjack-card:nth-child(4) {
        top: 45px;
        bottom: inherit;
    }

    .blackjack-card:nth-child(5) {
        bottom: 60px;
        left: 80px;
    }

    .game-dealer .blackjack-card:nth-child(5) {
        top: 60px;
        bottom: inherit;
    }

    .blackjack-card:nth-child(6) {
        bottom: 75px;
        left: 100px;
    }

    .game-dealer .blackjack-card:nth-child(6) {
        top: 75px;
        bottom: inherit;
    }

    .blackjack-card.card-club,
    .blackjack-card.card-spade {
        color: #000000;
    }

    .blackjack-card.card-heart,
    .blackjack-card.card-diamond {
        color: #db3d2e;
    }

    .blackjack-card .card-inner {
        width: 100%;
        height: 100%;
        position: relative;
        transform-style: preserve-3d;
        animation: dealcard-dealer 0.6s linear forwards;
    }

    .blackjack-card.card-hidden .card-inner {
        transform: rotateY(-180deg);
        animation: none;
    }

    .blackjack-card .inner-front,
    .blackjack-card .inner-back {
        width: 100%;
        height: 100%;
        position: absolute;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }

    .blackjack-card .inner-front {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 5px;
        border-radius: 5px;
        background: #ebe9e6;
        filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15));
        transition: all 0.3s;
    }

    .blackjack-card.card-hidden .inner-front {
        display: none;
    }

    .blackjack-card .inner-front img {
        height: 100%;
        border-radius: 5px;
        transition: opacity 0.3s ease;
    }

    .game-completed .blackjack-card .inner-front img {
        opacity: 0.5;
    }

    .blackjack-card .inner-back {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        transform: rotateY(-180deg);
        background: linear-gradient(180deg, #212335 0%, #31355a 100%);
        filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15));
    }

    .blackjack-game .inner-back img {
        height: 100%;
        border-radius: 5px;
    }

    @keyframes dealcard-dealer {
        0% {
            transform: rotateY(-180deg);
        }
        50% {
            transform: rotateY(-180deg);
        }
        100% {
            transform: rotateY(0deg);
        }
    }
</style>
