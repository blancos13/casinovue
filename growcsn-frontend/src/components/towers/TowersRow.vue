<template>
    <div class="towers-row" v-bind:class="{
        'row-active': towersGame !== null && towersGame.state !== 'completed' && towersGame.revealed.length === row,
        'row-revealed': towersGame !== null && towersGame.revealed[row] !== undefined
    }">
        <div v-for="tile in towersGetTilesCount" v-bind:key="tile" class="row-tile">
            <transition name="fade" mode="out-in">
                <div v-if="towersGame !== null && towersGame.revealed[row] !== undefined && towersGame.revealed[row].tile === (tile - 1) && towersGame.revealed[row].row[tile - 1] === 'coin'" class="tile-coin">
                    <div class="coin-inner">
                        <div class="inner-value">
                        </div>
                        <img class="tile-mine" src="https://s3-alpha-sig.figma.com/img/976b/1c79/441b768c31fef900d821c7dfde8833c8?Expires=1708300800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=a5sM9C-skch9f7l5zQsqnMf99RBRIAIg5K9uyw5U4Qjqion2JOlv-PB0g9to8epNswZ5ghI6ZffBkdXXrlED-t3~fzEJ-OtMYgWUwlSj7vVJG7jc5eFtKF-iiJGv6qenIkSMTH8R~HDVskKMTFCR1a123GbpD0JF0FJOq4pBH1c5RPI~qmG2HFKGrqxjNmHlRWc3dqHNO9RtBSjexXvwSRUupg8hjHFPs6uXgmc0TXOX5lftNXZfpu38RgKWhNXlVIFRSQqPbcXTE8OIK6~wei1ZTicgVuX89wiGIfyVkFqV9H5b8CPpuCdmhv5hqubJfvuRGHVp0pOFHk6EkS0A1A__" />
                    </div>
                </div>
                <div v-else-if="
                        towersGame !== null && 
                        (
                            (towersGame.revealed[row] !== undefined && towersGame.revealed[row].tile === (tile - 1) && towersGame.revealed[row].row[tile - 1] === 'lose') ||
                            (towersGame.state === 'completed' && towersGame.revealed.length <= row && towersGame.deck[row][tile - 1] === 'lose')
                            
                        )" class="coin-inners">
                    <img class="tile-mine" src="https://s3-alpha-sig.figma.com/img/f5f0/e6ec/4bb275390c4b2d131b70026271e020f9?Expires=1708300800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jJ4jziSCdm3zn2dMNQ~kBeUoAq95tMhMV8Drn6MSH4xFygPZ~tK4yn46qiJSbyNlps8R4YykvELePxQLtQxUZB0rBr9Z9Kp84BsWEYg3qdCkD2pkeQam~ld1JNfrDsKJM~mBVtsRvyHluQX5AzDxgJz7qGJV-y9na4aLll-E3igvzgrs9lCgwdxe-0Bx5zo8cbCNjx6k1INF~2bblvgfmp1VnwxU3nL6T39--WU8J1rv3mx-HjGh4oSPIludUq3A5SlvtZ5URtLc42QbNsmnJRRc4pZXSg7LeqEVqq-rRAEMl4P8dovfmLltW361M6gC929l7bUE~TZrhnnh-r3Lbw__" />
                </div>
                <button 
                    v-else 
                    v-on:click="towersRevealButton(tile - 1)" 
                    class="button-reveal" 
                    v-bind:disabled="socketSendLoading !== null || towersGame === null || towersGame.state === 'completed' || towersGame.revealed.length !== row"
                >
                    <div class="button-inner">
                        <div class="inner-value">
                            <span>{{ towersFormatValue(towersGetRowCashout).split('.')[0] }}</span>.{{ towersFormatValue(towersGetRowCashout).split('.')[1] }}
                        </div>
                    </div>
                </button>
            </transition>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconSkull from '@/components/icons/IconSkull';

    export default {
        name: 'TowersRow',
        components: {
            IconSkull
        },
        props: [
            'row'
        ],
        methods: {
            ...mapActions([
                'towersSendRevealSocket'
            ]),
            towersFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            towersRevealButton(tile) {
                const data = { tile: tile };
                this.towersSendRevealSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'towersRisk',
                'towersGame'
            ]),
            towersGetTilesCount() {
                let count = 3;

                if((this.towersGame !== null && this.towersGame.state !== 'completed' ? this.towersGame.risk : this.towersRisk) === 'medium') {
                    return 2;
                }

                return count;
            },
            towersGetRowCashout() {
                const multiplierPerRow = this.towersRisk === 'easy' ? 1.425 : this.towersRisk === 'medium' ? 1.90 : 2.85;
                const amount = this.towersGame !== null ? this.towersGame.amount : 0;

                return Math.floor(amount * Math.pow(multiplierPerRow, this.row + 1));
            }
        }
    }
</script>

<style scoped>
    .towers-row {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: space-between;
        margin-top: 18px;
        padding: 0 30px;
    }

    .towers-row:last-child {
        margin-top: 0;
    }

    .towers-row.row-active::before,
    .towers-row.row-active::after {
        content: '';
        width: 3px;
        height: 45px;
        position: absolute;
        top: 0;
        border-radius: 3px;
        background: linear-gradient(255deg, #00ffc2 -20%, #00aa6d 100%);
    }

    .towers-row.row-active::before {
        left: 0;
    }

    .towers-row.row-active::after {
        right: 0;
        
    }

    .towers-row .row-tile {
        width: calc(33.33% - 12px);
        height: 45px;
    }

    .container-game.game-medium .towers-row .row-tile {
        width: calc(50% - 8px);
    }

    .towers-row  .tile-coin,
    .towers-row  .tile-lose {
        width: 100%;
        height: 100%;
        position: relative;
        padding: 1px;
        z-index: 1;
        
    }

    .towers-row.row-active  .tile-coin,
    .towers-row.row-active  .tile-lose {
        opacity: 1;
    }

    .towers-row  .tile-coin::before,
    .towers-row  .tile-lose::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .towers-row  .tile-coin::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e0a3 100%);
    }

    .towers-row  .tile-lose::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #f55046 100%);
    }

    .towers-row  .tile-coin::after,
    .towers-row  .tile-lose::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #031421;
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .towers-row .coin-inner,
    .towers-row .coin-inners,

    .towers-row .lose-inner {
        width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    overflow: hidden;
    position: relative;  
    
   }

    .towers-row .coin-inner {
        width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    overflow: hidden;
    position: relative;  
    }
    .towers-row .coin-inners {
        width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    overflow: hidden;
    position: relative;  
    }


    .towers-row .coin-inner {
        width: 146px;
height: 47px;

background: #15753A;
border-bottom: 5px solid #17472B;
border-radius: 10px;

    }
    .towers-row .coin-inners {
        width: 146px;
height: 47px;

background: linear-gradient(0deg, #AD1239, #AD1239),
linear-gradient(0deg, #AD1239, #AD1239);
border-radius: 10px;
    }

    .towers-row .lose-inner {
        width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    overflow: hidden;
    position: relative;  


    }

    .towers-row .lose-inner {
        width: 146px;
height: 47px;

background: linear-gradient(0deg, #AD1239, #AD1239),
linear-gradient(0deg, #AD1239, #AD1239);
border-radius: 10px;
    }

    .towers-row button.button-reveal {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        border-bottom: 5px solid #0A2B4B;
        background: #07253B;
                transition: transform 0.3s;

    }

    .towers-row.row-active button.button-reveal {
        transition: transform 0.3s ease;
    }

    .towers-row.row-active button.button-reveal:hover {
        transform: scale(1.05);
    }

    .towers-row button.button-reveal .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 25%, 100% 75%, calc(100% - 9px) 100%, 9px 100%, 0 75%, 0 25%);
        
    }

    .towers-row.row-active button.button-reveal .button-inner,
    .towers-row.row-revealed button.button-reveal .button-inner {
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), 
                    radial-gradient(160% 160% at 50% 30%, rgba(0, 194, 255, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(255deg, #07263d 0%, #07243a 100%);
                    
    }

    .towers-row.row-revealed button.button-reveal .button-inner {
        opacity: 0.25;
        
    }

    .towers-row button.button-reveal .button-inner img,
    .towers-row .coin-inner img {
        transform: scaleX(-1);
    }
    .towers-row .coin-inners img {
        transform: scaleX(-1);
    }

    .towers-row button.button-reveal .button-inner .inner-value,
    .towers-row .coin-inner .inner-value  {
        font-size: 11px;
        font-weight: 600;
        color: #bbbfd0;
        
    }
    .towers-row .coin-inners .inner-value  {
        font-size: 11px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .towers-row button.button-reveal .button-inner .inner-value span,
    .towers-row .coin-inner .inner-value span {
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
    }
    .towers-row .coin-inners .inner-value span {
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
    }

    .towers-row .coin-inner img.image-knight {
        width: 46px;
        height: auto;
        position: absolute;
        top: 4px;
        right: -3px;
        transform: scaleX(-1);
    }
    .towers-row .coin-inners img.image-knight {
        width: 46px;
        height: auto;
        position: absolute;
        top: 4px;
        right: -3px;
        transform: scaleX(-1);
    }
    @media only screen and (max-width: 550px) {

        .towers-row {
            padding: 0 15px;
        }

        .towers-row .row-tile {
            width: calc(33.33% - 6px);
        }

    }

    @media only screen and (max-width: 500px) {

        .towers-row .coin-inner {
            padding: 0;
        }

        .towers-row .coin-inners {
            padding: 0;
        }
        .towers-row .coin-inner img.image-knight {
            display: none;
        }
        .towers-row .coin-inners img.image-knight {
            display: none;
        }
    }
</style>
