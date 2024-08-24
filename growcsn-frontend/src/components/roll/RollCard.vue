<template>
    <div class="roll-card" v-bind:class="{
        'card-high': multiplier >= rollGetMinBetMultiplier && multiplier >= 20,
        'card-mid': multiplier >= rollGetMinBetMultiplier && multiplier < 20 && multiplier >= 5,
        'card-low': multiplier >= rollGetMinBetMultiplier && multiplier < 5 && multiplier >= 2
    }">
        <div class="card-inner">
            <div class="inner-amount">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="amount-value">
                    <span>{{rollFormatValue(rollGetPotential).split('.')[0]}}</span>.{{rollFormatValue(rollGetPotential).split('.')[1]}}
                </div>
            </div>
            <div class="inner-multiplier">{{parseFloat(multiplier).toFixed(2)}}x</div>
            <div v-if="multiplier >= rollGetMinBetMultiplier" class="inner-win">
                <div v-bind:style="{ 
                    'background-image': 'url(' + rollGetItem.image + ')',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center',
                    'background-size': '80px auto'
                }" class="win-image"></div>
                {{ rollGetItem.name }}
            </div>
            <div v-else class="inner-lose">
                <svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M52 0C23.3285 0 0 23.3285 0 52C0 80.6715 23.3285 104 52 104C80.6715 104 104 80.6715 104 52C104 23.3285 80.6715 0 52 0ZM26 39C26 35.4185 28.9185 32.5 32.5 32.5C36.0815 32.5 39 35.4185 39 39C39 42.5815 36.0815 45.5 32.5 45.5C28.9185 45.5 26 42.5815 26 39ZM74.9775 79.118C74.3405 79.755 73.5085 80.067 72.6765 80.067C71.8445 80.067 71.0125 79.7485 70.3755 79.118C60.5475 69.29 43.4265 69.29 33.605 79.118C32.3375 80.3855 30.277 80.3855 29.0095 79.118C27.742 77.8505 27.742 75.79 29.0095 74.5225C35.1585 68.3865 43.316 65 52 65C60.684 65 68.8415 68.3865 74.9775 74.5225C76.245 75.79 76.245 77.8505 74.9775 79.118ZM71.5 45.5C67.9185 45.5 65 42.5815 65 39C65 35.4185 67.9185 32.5 71.5 32.5C75.0815 32.5 78 35.4185 78 39C78 42.5815 75.0815 45.5 71.5 45.5Z" />
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'RollCard',
        props: ['multiplier'],
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
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString();
            }
        },
        computed: {
            ...mapGetters([
                'authUser', 
                'rollGame', 
                'rollBets'
            ]),
            rollGetItem() {
                let item = this.rollItems[5][9];

                if(this.multiplier <= 2.5) {
                    item = this.rollItems[1][Math.round((this.multiplier - 1) / (1.5 / 9))];
                } else if(this.multiplier <= 5) {
                    item = this.rollItems[2][Math.round((this.multiplier - 2.5) / (2.5 / 9))];
                } else if(this.multiplier <= 50) {
                    item = this.rollItems[3][Math.round((this.multiplier - 5) / (45 / 9))];
                } else if(this.multiplier <= 100) {
                    item = this.rollItems[4][Math.round((this.multiplier - 50) / (50 / 9))];
                } else if(this.multiplier <= 1000) {
                    item = this.rollItems[5][Math.round((this.multiplier - 100) / (900 / 9))];
                }

                return item;
            },
            rollGetPotential() {
                let potential = 0;

                if(this.authUser.user !== null) {
                    for(const bet of this.rollBets.filter((element) => element.user._id === this.authUser.user._id)) {
                        if(this.multiplier >= (bet.multiplier / 100)) {
                            potential = potential + Math.floor(bet.amount * (bet.multiplier / 100));
                        }
                    }
                }

                return potential;
            },
            rollGetMinBetMultiplier() {
                let multiplier = 0;

                if(this.authUser.user !== null) {
                    for(const bet of this.rollBets.filter((element) => element.user._id === this.authUser.user._id)) {
                        if(multiplier === 0 || bet.multiplier < multiplier) { multiplier = bet.multiplier; }
                    }
                }

                return multiplier / 100;
            }
        }
    }
</script>

<style scoped>
    .roll-card {
        width: 139px;
        height: 100%;
        position: relative;
        flex-shrink: 0;
        margin-right: 4px;
        filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.15));
    }

    .roll-card:last-of-type {
        margin-right: 0;
    }

    .roll-card::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #10283a;
        clip-path: polygon(18px 0, calc(100% - 18px) 0, 100% 10%, 100% 90%, calc(100% - 18px) 100%, 18px 100%, 0 90%, 0 10%);
    }

    .roll-card.card-high::before {
        background: linear-gradient(180deg, rgba(222, 68, 34, 0.5) 0%, rgba(222, 68, 34, 0.25) 50%, #de4422 100%);
    }

    .roll-card.card-mid::before {
        background: linear-gradient(180deg, rgba(255, 183, 3, 0.5) 0%, rgba(255, 183, 3, 0.25) 50%, #ffe603 100%);
    }

    .roll-card.card-low::before {
        background: linear-gradient(180deg, rgba(0, 255, 194, 0.5) 0%, rgba(0, 255, 194, 0.25) 50%, #00ffc2 100%);
    }

    .roll-card .card-inner {
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

    .roll-card.card-high .card-inner {
        background: radial-gradient(230% 105% at 50% 15%, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.46) 30%, rgba(0, 0, 0, 0.42) 65%, rgba(0, 0, 0, 0) 100%), linear-gradient(0deg, rgba(222, 35, 35, 0.75) -30%, rgba(222, 68, 34, 0.75) -16%, rgba(167, 43, 35, 0.431195) 30%, rgba(0, 0, 0, 0) 100%), #062137;
        box-shadow: inset 0px 0px 75px rgba(146, 25, 25, 0.25);
    }

    .roll-card.card-mid .card-inner {
        background: radial-gradient(230% 105% at 50% 15%, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.46) 30%, rgba(0, 0, 0, 0.42) 65%, rgba(0, 0, 0, 0) 100%), linear-gradient(0deg, rgba(255, 183, 3, 0.75) -30%, rgba(255, 183, 3, 0.75) -16%, rgba(255, 183, 3, 0.43) 30%, rgba(0, 0, 0, 0) 100%), #062137;
        box-shadow: inset 0px 0px 75px rgba(255, 168, 0, 0.25);
    }

    .roll-card.card-low .card-inner {
        background: radial-gradient(230% 105% at 50% 15%, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.46) 30%, rgba(0, 0, 0, 0.42) 65%, rgba(0, 0, 0, 0) 100%), linear-gradient(0deg, rgba(0, 255, 194, 0.75) -30%, rgba(0, 255, 194, 0.75) -16%, rgba(0, 255, 194, 0.26) 30%, rgba(0, 0, 0, 0) 100%), #062137;
        box-shadow: inset 0px 0px 75px rgba(35, 194, 99, 0.25);
    }

    .roll-card .inner-amount {
        display: flex;
        align-items: center;
    }

    .roll-card .inner-amount img {
        width: 14px;
        height: 14px;
        margin-right: 6px;
    }

    .roll-card .amount-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .roll-card .amount-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .roll-card .inner-multiplier {
        margin-top: 2px;
        font-size: 12px;
        font-weight: 700;
        color: #ffffff;
    }

    .roll-card .inner-win {
        height: calc(100% - 46px);
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        text-transform: uppercase;
        font-size: 11px;
        font-weight: 700;
        color: #ffffff;
    }

    .roll-card .win-image {
        width: 100%;
        height: 80px;
    }

    .roll-card .inner-lose {
        margin-top: 14px;
    }

    .roll-card .inner-lose svg {
        fill: #0a2a45;
    }
</style>
