<template>
    <div class="battles-header-game">
        <router-link to="/battles" class="link-back">
            <div class="link-inner">
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.519893 4.88899C-0.173298 5.40596 -0.173297 6.69838 0.519893 7.21535L5.97877 11.2865C6.67196 11.8035 7.53845 11.1573 7.53845 10.1233V9.06113H14V3.04304H7.53845V1.98103C7.53845 0.947086 6.67196 0.300873 5.97877 0.817844L0.519893 4.88899Z" />
                </svg>
                GO BACK
            </div>
        </router-link>
        <div class="game-cost">
            TOTAL BATTLE COST
            <div class="cost-amount">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="amount-value">
                    <span>{{ battlesFormatValue(battlesGetAmount).split('.')[0] }}</span>.{{ battlesFormatValue(battlesGetAmount).split('.')[1] }}
                </div>
            </div>
        </div>
        <div class="game-info">
            <div v-if="battlesGameData.game === null || ['created', 'countdown', 'pending', 'completed'].includes(battlesGameData.game.state) === true" class="info-text">{{ battlesGetState }}</div>
            <div v-else class="info-running">
                <div class="running-case">{{ battlesGetBoxes[battlesGetRound - 1].name }}</div>
                <div class="running-box"></div>
                <div class="running-round">
                    Round {{ battlesGetRound }}
                </div>
            </div>
            <div class="info-cases">
                <BattlesGameBoxes v-bind:game="battlesGameData.game" />
            </div>
        </div>
        <div class="game-right">
            <div v-if="battlesGameData.game !== null" class="right-info" v-bind:class="{
                'info-cursed': battlesGameData.game.options.cursed === true, 
                'info-terminal': battlesGameData.game.options.terminal === true
            }">
                <IconCursedGradient v-if="battlesGameData.game.options.cursed === true" />
                <IconTerminalGradient v-if="battlesGameData.game.options.terminal === true" />
                <div class="info-option">{{battlesGetOption}}</div>
                STANDARD
            </div>
            <div class="right-actions">
                <button v-on:click="battlesFairButton()" class="button-fair">
                    <div class="button-inner">
                        <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0001 2.30199V3.8031H10.941C9.76198 3.80425 8.60479 3.48508 7.59306 2.87967L6.25388 2.07004C6.17599 2.02293 6.0867 1.99803 5.99567 1.99803C5.90465 1.99803 5.81535 2.02293 5.73747 2.07004L4.40266 2.8753C3.39067 3.48009 2.23365 3.79922 1.05471 3.79872H3.60219e-10V2.30199C-5.0177e-06 2.16926 0.0524184 2.04191 0.145859 1.94765C0.239299 1.85339 0.36619 1.79986 0.49891 1.7987H1.05909C2.32857 1.79901 3.574 1.45247 4.66087 0.796506L6.00005 0L7.33485 0.800882C8.42243 1.45521 9.6674 1.80162 10.9366 1.80308H11.5012C11.6328 1.80533 11.7584 1.85862 11.8515 1.9517C11.9446 2.04478 11.9979 2.17037 12.0001 2.30199Z" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.941 4.81404C9.58091 4.8134 8.2466 4.44276 7.08102 3.74182L6.00005 3.08536L4.91908 3.72869C3.75456 4.43362 2.42034 4.80878 1.05909 4.81404H0V6.12696C0.00306513 7.64623 0.438442 9.13326 1.25526 10.4143C2.07207 11.6953 3.23659 12.7174 4.61273 13.3612L6.00005 14.0045L7.37862 13.3612C8.75673 12.7191 9.92335 11.6976 10.7418 10.4164C11.5603 9.13521 11.9968 7.64729 12.0001 6.12696V4.81404H10.941ZM6.25388 9.19044C6.16095 9.27977 6.03705 9.32966 5.90815 9.32966C5.77924 9.32966 5.65534 9.27977 5.56241 9.19044L4.16196 7.78999L4.86656 7.08539L5.9169 8.13135L7.66746 6.38079L8.37206 7.08539L6.25388 9.19044Z" />
                        </svg>
                        <span>FAIRNESS</span>
                    </div>
                </button>
                <button v-on:click="battlesCopyButton(battlesGetLink)" class="button-link">
                    <div class="button-inner">
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.1967 1.16684L6.74187 4.6216C6.7352 4.62824 6.73105 4.6363 6.72441 4.64301C7.5755 4.51905 8.44983 4.60403 9.26032 4.92008L11.6051 2.57532C12.3819 1.79852 13.6452 1.79852 14.422 2.57532C15.1988 3.35205 15.1988 4.61545 14.422 5.39218C14.2896 5.52471 10.7675 9.04676 10.9673 8.84694C10.1843 9.62995 8.89983 9.59645 8.15032 8.84694C7.76214 8.45876 7.13012 8.45876 6.74187 8.84694L6.13721 9.45161C6.30492 9.73658 6.4972 10.0108 6.74187 10.2555C8.21718 11.7308 10.7566 11.8486 12.3543 10.2729C12.361 10.2663 12.369 10.2621 12.3757 10.2555L15.8305 6.8007C17.3862 5.24492 17.3862 2.72262 15.8305 1.16684C14.2747 -0.388945 11.7524 -0.388945 10.1967 1.16684Z" />
                            <path d="M7.74452 12.0696L5.39219 14.422C4.61546 15.1988 3.35205 15.1988 2.57533 14.422C1.79853 13.6452 1.79853 12.3818 2.57533 11.605C2.70779 11.4726 6.23737 7.94299 6.03762 8.14274C6.82056 7.3598 8.10505 7.39323 8.85455 8.14274C9.24273 8.53099 9.87479 8.53099 10.263 8.14274L10.8677 7.53807C10.7 7.2531 10.5077 6.97889 10.263 6.73429C8.79052 5.26174 6.25294 5.13645 4.65055 6.71679C4.64388 6.72343 4.63585 6.72762 4.62914 6.73429L1.16681 10.1966C-0.388904 11.7523 -0.38897 14.2747 1.16681 15.8305C2.72259 17.3862 5.24496 17.3862 6.80067 15.8305L10.263 12.3681C10.2696 12.3615 10.2738 12.3535 10.2804 12.3467C9.42934 12.4707 8.55504 12.3857 7.74452 12.0696Z" />
                        </svg>
                    </div>
                </button>
                <button v-on:click="soundSetBattles(soundBattles === 1 ? 0 : 1)" class="button-sound" v-bind:class="{ 'button-active': soundBattles === 1 }">
                    <IconSoundOn v-if="soundBattles === 1" />
                    <IconSoundOff v-else />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconTerminalGradient from '@/components/icons/IconTerminalGradient';
    import IconCursedGradient from '@/components/icons/IconCursedGradient';
    import IconSoundOn from '@/components/icons/IconSoundOn';
    import IconSoundOff from '@/components/icons/IconSoundOff';
    import BattlesGameBoxes from '@/components/battles/BattlesGameBoxes';

    export default {
        name: 'BattlesHeaderGame',
        components: {
            IconTerminalGradient,
            IconCursedGradient,
            IconSoundOn,
            IconSoundOff,
            BattlesGameBoxes
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'soundSetBattles',
                'modalsSetData',
                'modalsSetShow'
            ]),
            battlesFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            battlesFairButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                this.modalsSetData({ game: this.battlesGameData.game });
                this.modalsSetShow('FairGame');
            },
            battlesCopyButton(value)  {
                const el = document.createElement('textarea');
                el.value = value;
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);

                this.notificationShow({ type: 'success', message: 'Copied to your clipboard.' });
            }
        },
        computed: {
            ...mapGetters([
                'soundBattles',
                'authUser',
                'battlesGameData'
            ]),
            battlesGetAmount() {
                let amount = 0;

                if(this.battlesGameData.game !== null) { amount = this.battlesGameData.game.amount; }

                return amount;
            },
            battlesGetState() {
                let state = 'Waiting to start...';

                if(this.battlesGameData.game !== null) {
                    if(this.battlesGameData.game.state === 'pending') { state = 'Awaiting EOS Block'; }
                    else if(this.battlesGameData.game.state === 'completed') { state = 'Game Ended'; }
                }

                return state;
            },
            battlesGetBoxes() {
                let boxes = [];

                if(this.battlesGameData.game !== null) {
                    for(const box of this.battlesGameData.game.boxes) {
                        for(let i = 0; i < box.count; i++) { boxes.push(box.box); }
                    }
                }

                return boxes;
            },
            battlesGetRound() {
                let round = 1;

                if(this.battlesGameData.game.bets[0].outcomes !== undefined && this.battlesGameData.game.bets[0].outcomes.length >= 1) { round = this.battlesGameData.game.bets[0].outcomes.length; }

                return round;
            },
            battlesGetOption() {
                let option = '';

                if(this.battlesGameData.game.options.cursed === true && this.battlesGameData.game.options.terminal === false) { option = 'CURSED MODE'; }
                else if(this.battlesGameData.game.options.cursed === false && this.battlesGameData.game.options.terminal === true) { option = 'TERMINAL MODE'; }

                return option;
            },
            battlesGetLink() {
                let link = 'hypedraft.com/battles/';

                if(this.battlesGameData.game !== null) { link = 'growcsn.com/battles/' + this.battlesGameData.game._id; }

                return link;
            }
        }
    }
</script>

<style scoped>
    .battles-header-game {
        width: 100%;
        display: grid;
        grid-template-columns: 110px auto 432px auto;
        align-items: center;
        padding-bottom: 35px;
    }

    .battles-header-game a.link-back {
        width: 110px;
        height: 44px;
        position: relative;
        padding: 1px;
        transition: all .2a;
    }

    .battles-header-game a.link-back:active {
        transition-duration: .2s;
        scale: .9;
    }

    .battles-header-game a.link-back::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #0f3759;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .battles-header-game a.link-back .link-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #6e95b6;
        background: #0b2d49;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
        transition: color 0.3s ease;
    }

    .battles-header-game a.link-back:hover .link-inner {
        color: #ffffff;
    }

    .battles-header-game a.link-back .link-inner svg {
        margin-right: 8px;
        fill: #557b9b;
        transition: fill 0.3s ease;
    }

    .battles-header-game a.link-back:hover .link-inner svg {
        fill: #ffffff;
    }

    .battles-header-game .game-cost {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-left: 25px;
        font-size: 15px;
        font-weight: 800;
        color: #5e768e;
    }

    .battles-header-game .cost-amount {
        display: flex;
        align-items: center;
        margin-top: 5px;
    }

    .battles-header-game .cost-amount img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
    }

    .battles-header-game .amount-value {
        font-size: 12px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .battles-header-game .amount-value span {
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
    }

    .battles-header-game .game-info {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .battles-header-game .info-text {
        font-size: 15px;
        font-weight: 700;
        color: #5e768e;
    }

    .battles-header-game .info-running {
        display: flex;
        align-items: center;
    }

    .battles-header-game .running-case {
        font-size: 15px;
        font-weight: 600;
        color: #ffffff;
    }

    .battles-header-game .running-box {
        width: 10px;
        height: 10px;
        margin: 0 8px;
        transform: rotate(45deg);
        background: radial-gradient(140% 140% at 50% 50%, #01db9e 0%, rgba(6, 41, 68, 0) 100%);
        border: 1px solid #01e0a3;
    }

    .battles-header-game .running-round {
        font-size: 15px;
        font-weight: 700;
        color: #5e768e;
    }

    .battles-header-game .info-cases {
        width: 432px;
        margin-top: 8px;
    }

    .battles-header-game .game-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .battles-header-game .right-actions {
        display: flex;
        align-items: center;
    }

    .battles-header-game .right-info,
    .battles-header-game .right-actions {
        display: flex;
        align-items: center;
    }

    .battles-header-game .right-info {
        font-size: 12px;
        font-weight: 800;
        color: #5e768e;
    }

    .battles-header-game .right-actions {
        margin-top: 12px;
    }

    .battles-header-game .right-info svg {
        margin-right: 6px;
    }

    .battles-header-game .right-info.info-cursed.info-terminal svg:nth-child(2) {
        margin-right: 0;
    }

    .battles-header-game .info-option {
        margin-right: 10px;
    }

    .battles-header-game .right-info.info-cursed .info-option {
        color: #f24034;
    }

    .battles-header-game .right-info.info-terminal .info-option {
        background: linear-gradient(216deg, #ead621 0%, #ff8e26 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .battles-header-game button.button-fair,
    .battles-header-game button.button-link {
        height: 32px;
        margin-right: 8px;
        transition: all .2s;
    }
    .battles-header-game button.button-fair:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .battles-header-game button.button-fair:active {
        transition-duration: .2s;
        scale: .9;
    }

    .battles-header-game button.button-fair .button-inner,
    .battles-header-game button.button-link .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 11px;
        font-size: 12px;
        font-weight: 700;
        color: #bbbfd0;
        background: #214059;
        transition: color 0.3s ease;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .battles-header-game button.button-fair .button-inner {
        padding: 0 20px;
    }

    .battles-header-game button.button-fair:hover .button-inner {
        color: #ffffff;
    }

    .battles-header-game button.button-fair .button-inner svg,
    .battles-header-game button.button-link .button-inner svg {
        fill: #bbbfd0;
        transition: fill 0.3s ease;
    }

    .battles-header-game button.button-fair .button-inner svg {
        margin-right: 6px;
    }

    .battles-header-game button.button-fair:hover .button-inner svg,
    .battles-header-game button.button-link:hover .button-inner svg {
        fill: #ffffff;
    }

    .battles-header-game button.button-sound {
        width: 40px;
        height: 38px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        background: radial-gradient(70% 70% at 50% 50.00%, rgba(152, 151, 193, 0.2) 0%, rgba(0, 0, 0, 0) 100%), #031b2e;
        box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.20);
        border: 1px solid #07243d;
    }

    .battles-header-game button.button-sound svg {
        fill: #bbbfd0;
        transition: fill 0.3s ease;
    }
    
    .battles-header-game button.button-sound.button-active svg {
        fill: #00ffc2;
    }

    @media only screen and (max-width: 1100px) {

        .battles-header-game {
            grid-template-rows: auto auto;
            grid-template-columns: auto 432px auto;
        }

        .battles-header-game a.link-back {
            grid-row: 1 / 1;
            margin-bottom: 20px;
        }

        .battles-header-game .game-cost {
            grid-column: 1 / 1;
            grid-row: 2 / 2;
            padding-left: 0;
        }

        .battles-header-game .game-info {
            width: auto;
            grid-column: 2 / 2;
            grid-row: 2 / 2;
        }

        .battles-header-game .game-right {
            grid-column: 3 / 3;
            grid-row: 2 / 2;
        }

    }

    @media only screen and (max-width: 900px) {

        .battles-header-game {
            grid-template-rows: auto auto auto;
            grid-template-columns: auto auto;
        }

        .battles-header-game .game-info {
            grid-column: 1 / 3;
            grid-row: 3 / 3;
            margin-top: 20px;
        }

        .battles-header-game .game-right {
            grid-column: 2 / 2;
        }

    }

    @media only screen and (max-width: 455px) {

        .battles-header-game .info-cases {
            width: calc(100vw - 20px);
        }

        .battles-header-game button.button-fair .button-inner span {
            display: none;
        }

        .battles-header-game button.button-fair .button-inner svg {
            margin-right: 0;
        }
    
    }   
</style>