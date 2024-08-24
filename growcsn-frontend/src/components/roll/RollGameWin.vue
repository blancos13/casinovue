<template>
    <div class="roll-game-win" v-bind:class="{
        'win-high': multiplier / 100 >= 20,
        'win-mid': multiplier / 100 < 20 && multiplier / 100 >= 5,
        'win-low': multiplier / 100 < 5 && multiplier / 100 >= 2
    }">
        <div class="win-box">
            <div class="box-inner">
                <div class="inner-card">
                    <div class="card-inner">
                        <div class="inner-amount">
                            <img src="@/assets/img/icons/coin.svg" alt="icon" />
                            <div class="amount-value">
                                <span>{{rollFormatValue(winAmount).split('.')[0]}}</span>.{{rollFormatValue(winAmount).split('.')[1]}}
                            </div>
                        </div>
                        <div class="inner-multiplier">{{parseFloat(multiplier / 100).toFixed(2)}}x</div>
                        <div class="inner-win">
                            <div v-bind:style="{ 
                                'background-image': 'url(' + rollGetItem.image + ')',
                                'background-repeat': 'no-repeat',
                                'background-position': 'center',
                                'background-size': '110px auto'
                            }" class="win-image"></div>
                            {{ rollGetItem.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <span class="text-green-gradient">YOUR BALANCE HAS BEEN CREDITED!</span>
    </div>
</template>

<script>
    export default {
        name: 'RollGameWin',
        props: [
            'winAmount', 
            'multiplier'
        ],
        data() {
            return {
                rollItems: {
                    1: [
                        { name: 'Snow Leopard Fedora', image: 'https://tr.rbxcdn.com/9e94543b15cd954eb0d917795754e1fd/420/420/Hat/Png' }, 
                        { name: 'Outrageous Builders Club Hard Hat', image: 'https://tr.rbxcdn.com/b6bda745d351b5a54e6f756011a213c4/420/420/Hat/Png' }, 
                        { name: 'Broken Tee Vee', image: 'https://tr.rbxcdn.com/05af837ce90ff79bc54624e00ec2a246/420/420/Hat/Png' }, 
                        { name: 'Happy Time Magic Flower Bowler', image: 'https://tr.rbxcdn.com/0bf4ffa21de7df581b47763f489e289f/420/420/Hat/Png' }, 
                        { name: 'Valentine`s Day 2012 Cap', image: 'https://tr.rbxcdn.com/90b2a00ea7e876a77d33f56536edc824/420/420/Hat/Png' }, 
                        { name: 'Purple Steampunk Robin Hood', image: 'https://tr.rbxcdn.com/7888e6c24b2d22e62a0bf5ac63a70699/420/420/Hat/Png' },
                        { name: 'BreezeKreig Adventurer', image: 'https://tr.rbxcdn.com/8fb3ea6745a47e0a380067c131fa0d00/420/420/Hat/Png' }, 
                        { name: 'Scare Mayor Top Hat', image: 'https://tr.rbxcdn.com/0d53dad0629c58b66e9179d2da3e9256/420/420/Hat/Png' }, 
                        { name: 'Cool Snowman Head', image: 'https://tr.rbxcdn.com/f3b4af97e3911db2dfe28421c3595766/420/420/Hat/Png' }, 
                        { name: 'Bluesteel Viking Helm of Infinite Pillage', image: 'https://tr.rbxcdn.com/ff2133ea838bac343ddfa5862496c444/420/420/Hat/Png' }
                    ],
                    2: [
                        { name: 'Rubber Duckie', image: 'https://tr.rbxcdn.com/113fa7eb924049ff5f88d02fce1d4f8a/420/420/Hat/Png' }, 
                        { name: 'Black Iron Commando', image: 'https://tr.rbxcdn.com/4b6fc07650d13e9efee5c49804142254/420/420/Hat/Png' }, 
                        { name: 'Silverthorn Antlers', image: 'https://tr.rbxcdn.com/8441eb33c48eda88de3de42285660847/420/420/Hat/Png' }, 
                        { name: 'Skull and Crossbones Fedora', image: 'https://tr.rbxcdn.com/e681aded6c842f62d1419dafcb29fda2/420/420/Hat/Png' }, 
                        { name: 'I Heart Mom Sign', image: 'https://tr.rbxcdn.com/bf93f9cccd93c463e2eb61a6d3a699bb/420/420/Hat/Png' }, 
                        { name: 'Brighteyes` Halloween Leftovers', image: 'https://tr.rbxcdn.com/7b6154a8a009a34f3cc46e36d5294f61/420/420/Hat/Png' },
                        { name: 'Blue Top Hat with White Band', image: 'https://tr.rbxcdn.com/de1729e6d30713d92988650ad66b3039/420/420/Hat/Png' }, 
                        { name: '2010 New Year`s Top Hat', image: 'https://tr.rbxcdn.com/7524ef6c7b9072119c71d7749d6cdf63/420/420/Hat/Png' }, 
                        { name: 'Rainbow Hatbot', image: 'https://tr.rbxcdn.com/55b0f2cea4e25d2b7d633fc6d5e2125e/420/420/Hat/Png' }, 
                        { name: 'Steampunk Sweetheart Top Hat', image: 'https://tr.rbxcdn.com/898b6660946bddd67e4d8f2c4d659188/420/420/Hat/Png' }
                    ],
                    3: [
                        { name: 'Virtual Commando', image: 'https://tr.rbxcdn.com/fbc8970009609b5768576135f2b859bf/420/420/Hat/Png' },
                        { name: 'Bucket', image: 'https://tr.rbxcdn.com/df0c5908713fa2274945d50cb2f9fefd/420/420/Hat/Png' }, 
                        { name: 'Viridian Hood', image: 'https://tr.rbxcdn.com/353dceed9989f3eab007d5c0991e192e/420/420/Hat/Png' }, 
                        { name: 'Green Banded Top Hat', image: 'https://tr.rbxcdn.com/f92fc4fa0961cf363b61e8ebe2ecddce/420/420/Hat/Png' }, 
                        { name: 'Sinister Q.', image: 'https://tr.rbxcdn.com/8a08e0211e1ec05ba8b642cf10d935f7/420/420/Hat/Png' }, 
                        { name: 'Perfectly Legitimate Business Hat', image: 'https://tr.rbxcdn.com/e4d7679a2b1b98e013f40c21120a61b4/420/420/Hat/Png' }, 
                        { name: 'Laser Blue Riding Hood', image: 'https://tr.rbxcdn.com/5633742fae106826f706860dfda8c81d/420/420/Hat/Png' }, 
                        { name: 'Tasteless Top Hat', image: 'https://tr.rbxcdn.com/fbec099ac30f171629dfbf6a2afb1be6/420/420/Hat/Png' },
                        { name: 'Bubble Trouble', image: 'https://tr.rbxcdn.com/4ebed570d8a8c4c78cae980cac07b252/420/420/Face/Png' },
                        { name: 'Masked Hood of the Lightning Striker', image: 'https://tr.rbxcdn.com/6b519d9663a77b03a7d84005cc08dd74/420/420/Hat/Png' }
                    ],
                    4: [
                        { name: 'Viridian Domino Crown', image: 'https://tr.rbxcdn.com/63d317cdd54d45d48790fd144449d904/420/420/Hat/Png' }, 
                        { name: 'Blizzaria: The Frozen', image: 'https://tr.rbxcdn.com/8764abd4f744e3b120b94d612527ba31/420/420/Hat/Png' }, 
                        { name: 'Dark Conjurer', image: 'https://tr.rbxcdn.com/860a6ec8608adb7afabc8761c8a6a2d3/420/420/Hat/Png' }, 
                        { name: 'Dominus Formidulosus', image: 'https://tr.rbxcdn.com/e290a5aea0c26e51d67291bb8d631482/420/420/Hat/Png' }, 
                        { name: 'JJ5x5`s White Top Hat', image: 'https://tr.rbxcdn.com/da1dfb4a13ccd754e92b6a85fe092180/420/420/Hat/Png' }, 
                        { name: 'The Agonizingly Ugly Bucket of Doom', image: 'https://tr.rbxcdn.com/bd61dd4010911e300822b273328c9f8f/420/420/Hat/Png' },
                        { name: 'Silver King of the Night', image: 'https://tr.rbxcdn.com/44c810d67479b34e7a5740dd4b7e432f/420/420/Hat/Png' }, 
                        { name: 'Al Capwn', image: 'https://tr.rbxcdn.com/0c880734978be582f56a4dfe51c83275/420/420/Hat/Png' }, 
                        { name: 'Valkyrie Helm', image: 'https://tr.rbxcdn.com/fd070f5e848041d725135a3a46eb3c3c/420/420/Hat/Png' }, 
                        { name: 'The Classic ROBLOX Fedora', image: 'https://tr.rbxcdn.com/c1b55f2c2d4b72bdf428caf2165ed351/420/420/Hat/Png' }
                    ],
                    5: [
                        { name: 'Sparkle Time Fedora', image: 'https://tr.rbxcdn.com/d0e9bb77748368e93c0076284b52f3d5/420/420/Hat/Png' }, 
                        { name: 'Dominus Vespertilio', image: 'https://tr.rbxcdn.com/c4181c9c5cd7a380efe445cf11aa4f57/420/420/Hat/Png' }, 
                        { name: 'White Sparkle Time Fedora', image: 'https://tr.rbxcdn.com/17bffc4f71b817c5b624d1a4e9c2b153/420/420/Hat/Png' }, 
                        { name: 'Red Domino Crown', image: 'https://tr.rbxcdn.com/c927546d657cb9e4615ae82b305209b0/420/420/Hat/Png' }, 
                        { name: 'Lord of the Tixeration', image: 'https://tr.rbxcdn.com/a874417143da06e4ab46e76e24749033/420/420/Hat/Png' }, 
                        { name: 'Dominus Messor', image: 'https://tr.rbxcdn.com/7494aeb448e9d1d22112aa4b1f1b9dfd/420/420/Hat/Png' },
                        { name: 'Teal Sparkle Time Fedora', image: 'https://tr.rbxcdn.com/255dbb30a3810e863f1964c89175fd33/420/420/Hat/Png' }, 
                        { name: 'Dominus Aureus', image: 'https://tr.rbxcdn.com/4862212c0743129f5979d19dd229721f/420/420/Hat/Png' }, 
                        { name: 'Domino Crown', image: 'https://tr.rbxcdn.com/9265fc31ee48ff2f82ab9844f7db897a/420/420/Hat/Png' }, 
                        { name: 'Dominus Frigidus', image: 'https://tr.rbxcdn.com/d441ecc55b0ac0b606d6f8ae70945f73/420/420/Hat/Png' }
                    ]
                }
            }
        },  
        methods: {
            rollFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        },
        computed: {
            rollGetItem() {
                const multiplier = this.multiplier / 100;
                let item = this.rollItems[5][9];

                if(multiplier <= 2.5) {
                    item = this.rollItems[1][Math.round((multiplier - 1) / (1.5 / 9))];
                } else if(multiplier <= 5) {
                    item = this.rollItems[2][Math.round((multiplier - 2.5) / (2.5 / 9))];
                } else if(multiplier <= 50) {
                    item = this.rollItems[3][Math.round((multiplier - 5) / (45 / 9))];
                } else if(multiplier <= 100) {
                    item = this.rollItems[4][Math.round((multiplier - 50) / (50 / 9))];
                } else if(multiplier <= 1000) {
                    item = this.rollItems[5][Math.round((multiplier - 100) / (900 / 9))];
                }

                return item;
            }
        }
    }
</script>

<style scoped>
    .roll-game-win {
        width: 330px;
        height: 400px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: center;
        padding: 15px 15px 20px 15px;
        border-radius: 15px;
        background: #001424;
        border: 1px solid rgba(59, 126, 183, 0.5);
        box-shadow: 0px 4px 50px rgba(0, 0, 0, 0.5), inset 0px 0px 25px rgba(0, 0, 0, 0.35);
    }

    .roll-game-win span {
        font-size: 14px;
        font-weight: 800;
    }

    .roll-game-win .win-box {
        width: 100%;
        height: 325px;
        padding: 1px;
        border-radius: 8px;
        background: #10283a;
    }

    .roll-game-win.win-high .win-box {
        background: linear-gradient(180deg, rgba(222, 68, 34, 0.5) 0%, rgba(222, 68, 34, 0.25) 50%, #de4422 100%);
    }

    .roll-game-win.win-mid .win-box {
        background: linear-gradient(180deg, rgba(255, 183, 3, 0.5) 0%, rgba(255, 183, 3, 0.25) 50%, #ffe603 100%);
    }

    .roll-game-win.win-low .win-box {
        background: linear-gradient(180deg, rgba(0, 255, 194, 0.5) 0%, rgba(0, 255, 194, 0.25) 50%, #00ffc2 100%);
    }

    .roll-game-win .box-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background-color: #062137;
    }

    .roll-game-win.win-high .box-inner {
        background: radial-gradient(230% 105% at 50% 15%, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.46) 30%, rgba(0, 0, 0, 0.42) 65%, rgba(0, 0, 0, 0) 100%), linear-gradient(0deg, rgba(222, 35, 35, 0.75) -30%, rgba(222, 68, 34, 0.75) -16%, rgba(167, 43, 35, 0.431195) 30%, rgba(0, 0, 0, 0) 100%), #062137;
        box-shadow: inset 0px 0px 75px rgba(146, 25, 25, 0.25);
    }

    .roll-game-win.win-mid .box-inner {
        background: radial-gradient(230% 105% at 50% 15%, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.46) 30%, rgba(0, 0, 0, 0.42) 65%, rgba(0, 0, 0, 0) 100%), linear-gradient(0deg, rgba(255, 183, 3, 0.75) -30%, rgba(255, 183, 3, 0.75) -16%, rgba(255, 183, 3, 0.43) 30%, rgba(0, 0, 0, 0) 100%), #062137;
        box-shadow: inset 0px 0px 75px rgba(255, 168, 0, 0.25);
    }

    .roll-game-win.win-low .box-inner {
        background: radial-gradient(230% 105% at 50% 15%, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.46) 30%, rgba(0, 0, 0, 0.42) 65%, rgba(0, 0, 0, 0) 100%), linear-gradient(0deg, rgba(0, 255, 194, 0.75) -30%, rgba(0, 255, 194, 0.75) -16%, rgba(0, 255, 194, 0.26) 30%, rgba(0, 0, 0, 0) 100%), #062137;
        box-shadow: inset 0px 0px 75px rgba(35, 194, 99, 0.25);
    }

    .roll-game-win .inner-card {
        width: 195px;
        height: 275px;
        position: relative;
        flex-shrink: 0;
        margin-right: 4px;
        filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.15));
    }

    .roll-game-win .inner-card::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #10283a;
        clip-path: polygon(18px 0, calc(100% - 18px) 0, 100% 10%, 100% 90%, calc(100% - 18px) 100%, 18px 100%, 0 90%, 0 10%);
    }

    .roll-game-win.win-high .inner-card::before {
        background: linear-gradient(180deg, rgba(222, 68, 34, 0.5) 0%, rgba(222, 68, 34, 0.25) 50%, #de4422 100%);
    }

    .roll-game-win.win-mid .inner-card::before {
        background: linear-gradient(180deg, rgba(255, 183, 3, 0.5) 0%, rgba(255, 183, 3, 0.25) 50%, #ffe603 100%);
    }

    .roll-game-win.win-low .inner-card::before {
        background: linear-gradient(180deg, rgba(0, 255, 194, 0.5) 0%, rgba(0, 255, 194, 0.25) 50%, #00ffc2 100%);
    }

    .roll-game-win .card-inner {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        top: 1px;
        left: 1px;
        padding: 15px;
        background-color: #062137;
        clip-path: polygon(18px 0, calc(100% - 18px) 0, 100% 10%, 100% 90%, calc(100% - 18px) 100%, 18px 100%, 0 90%, 0 10%);
        z-index: 1;
    }

    .roll-game-win.win-high .card-inner {
        background: radial-gradient(230% 105% at 50% 15%, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.46) 30%, rgba(0, 0, 0, 0.42) 65%, rgba(0, 0, 0, 0) 100%), linear-gradient(0deg, rgba(222, 35, 35, 0.75) -30%, rgba(222, 68, 34, 0.75) -16%, rgba(167, 43, 35, 0.431195) 30%, rgba(0, 0, 0, 0) 100%), #062137;
        box-shadow: inset 0px 0px 75px rgba(146, 25, 25, 0.25);
    }

    .roll-game-win.win-mid .card-inner {
        background: radial-gradient(230% 105% at 50% 15%, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.46) 30%, rgba(0, 0, 0, 0.42) 65%, rgba(0, 0, 0, 0) 100%), linear-gradient(0deg, rgba(255, 183, 3, 0.75) -30%, rgba(255, 183, 3, 0.75) -16%, rgba(255, 183, 3, 0.43) 30%, rgba(0, 0, 0, 0) 100%), #062137;
        box-shadow: inset 0px 0px 75px rgba(255, 168, 0, 0.25);
    }

    .roll-game-win.win-low .card-inner {
        background: radial-gradient(230% 105% at 50% 15%, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.46) 30%, rgba(0, 0, 0, 0.42) 65%, rgba(0, 0, 0, 0) 100%), linear-gradient(0deg, rgba(0, 255, 194, 0.75) -30%, rgba(0, 255, 194, 0.75) -16%, rgba(0, 255, 194, 0.26) 30%, rgba(0, 0, 0, 0) 100%), #062137;
        box-shadow: inset 0px 0px 75px rgba(35, 194, 99, 0.25);
    }

    .roll-game-win .inner-amount {
        display: flex;
        align-items: center;
    }

    .roll-game-win .inner-amount img {
        width: 16px;
        height: 16px;
        margin-right: 6px;
    }

    .roll-game-win .amount-value {
        font-size: 12px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .roll-game-win .amount-value span {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    .roll-game-win .inner-multiplier {
        margin-top: 4px;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
    }

    .roll-game-win .inner-win {
        height: calc(100% - 57px);
        margin-top: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        text-transform: uppercase;
        font-size: 13px;
        font-weight: 700;
        color: #ffffff;
    }

    .roll-game-win .win-image {
        width: 100%;
        height: 110px;
    }
</style>
