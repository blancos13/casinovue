<template>
    <div class="duels-reel">

        <div class="reel-row">
            <div class="row-element">0</div>
            <div class="row-element">1</div>
            <div class="row-element">2</div>
            <div class="row-element">3</div>
            <div class="row-element">4</div>
            <div class="row-element">5</div>
            <div class="row-element">6</div>
            <div class="row-element">7</div>
            <div class="row-element">8</div>
            <div class="row-element">9</div>
        </div>
        <div class="reel-row">
            <div class="row-element">0</div>
            <div class="row-element">1</div>
            <div class="row-element">2</div>
            <div class="row-element">3</div>
            <div class="row-element">4</div>
            <div class="row-element">5</div>
            <div class="row-element">6</div>
            <div class="row-element">7</div>
            <div class="row-element">8</div>
            <div class="row-element">9</div>
        </div>
        <div class="reel-row">
            <div class="row-element">0</div>
            <div class="row-element">1</div>
            <div class="row-element">2</div>
            <div class="row-element">3</div>
            <div class="row-element">4</div>
            <div class="row-element">5</div>
            <div class="row-element">6</div>
            <div class="row-element">7</div>
            <div class="row-element">8</div>
            <div class="row-element">9</div>
        </div>
        <div class="reel-row">
            <div class="row-element">0</div>
            <div class="row-element">1</div>
            <div class="row-element">2</div>
            <div class="row-element">3</div>
            <div class="row-element">4</div>
            <div class="row-element">5</div>
            <div class="row-element">6</div>
            <div class="row-element">7</div>
            <div class="row-element">8</div>
            <div class="row-element">9</div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'DuelsReel'
    }
</script>

<style scope>
    .duels-reel {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .duels-reel .reel-row {

    }

    .duels-reel .row-element {
        height: 130px;
        display: flex;
        align-items: center;
        /* font-family: 'Rubik'; */
        font-size: 64px;
        font-weight: 500;
        color: #ffffff;
    }

    .inner-holder:nth-child(4) .duels-reel .row-element,
    .inner-holder:nth-child(5) .duels-reel .row-element {
        font-weight: 400;
        color: #5e768e;
    }
</style>
