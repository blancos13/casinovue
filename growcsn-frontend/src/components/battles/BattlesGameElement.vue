<template>
    <div class="battles-game-element" v-bind:class="['element-' + game.state, 'element-' + game.mode, {
        'element-cursed': game.options.cursed === true, 
        'element-terminal': game.options.terminal === true
    }]">
        <div class="element-inner">
            <div class="inner-info">
                <div class="info-type">
                    <div class="type-inner">
                        <span>{{ battlesGetMode }}</span>
                    </div>
                </div>
                <div v-if="game.options.cursed === true || game.options.terminal === true" class="info-option">
                    <div class="option-inner">
                        <IconCursedGradient v-if="game.options.cursed === true" />
                        <IconTerminalGradient v-if="game.options.terminal === true" />
                        <span>{{ battlesGetOption }}</span>
                    </div>
                </div>
            </div>
            <div class="inner-players">
                
                <div v-for="(bet, index) in battlesGetBets" v-bind:key="index" class="players-element">
                    <div class="element-user" v-bind:class="[
                        'user-' + (bet === null ? 'empty' : bet.bot === true ? 'bot' : battlesGetRank(bet.user)),
                        'user-' + (bet !== null && bet.bot !== true ? battlesGetLevelColor(bet.user) : ''),
                        { 'user-winner': game.state === 'completed' && bet.payout > 0 }
                    ]">
                        <AvatarImage v-if="bet !== null" v-bind:image="bet.bot === true ? null : bet.user.avatar" />
                        <IconSpinner v-else />
                    </div>
                    <div v-if="(index + 1) !== game.playerCount && (game.mode !== 'team' || index === 1)" class="element-separator">
                        <div class="separator-inner">
                            <IconGroupGradient v-if="game.mode === 'group'" />
                            <IconVersusGradient v-else />
                        </div>
                    </div>
                </div>

            </div>
            <div class="inner-cases">
                <BattlesGameBoxes v-bind:game="game" />
            </div>
            <div class="inner-right">
                <div class="right-amount">
                    <div class="amount-inner">
                        <div class="inner-effective">
                            <img src="@/assets/img/icons/coin.svg" alt="icon" />
                            <div class="effective-value">
                                <span>{{ battlesFormatValue(game.amount - Math.floor(game.amount * game.options.funding / 100)).split('.')[0] }}</span>.{{ battlesFormatValue(game.amount - Math.floor(game.amount * game.options.funding / 100)).split('.')[1] }}
                            </div>
                        </div>
                        <div v-if="game.options.funding > 0" class="inner-real">
                            <img src="@/assets/img/icons/coin.svg" alt="icon" />
                            <div class="real-value">
                                <span>{{ battlesFormatValue(game.amount).split('.')[0] }}</span>.{{ battlesFormatValue(game.amount).split('.')[1] }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-separator"></div>
                <div class="right-action">
                    <button v-if="['countdown', 'pending', 'rolling'].includes(game.state) === true || (game.state !== 'completed' && authUser.user !== null && authUser.user._id === game.bets[0].user._id)" class="button-waiting" disabled>
                        <div class="button-inner">
                            <IconSpinner />
                        </div>
                    </button>
                    <button v-else-if="game.state !== 'completed'" v-on:click="battlesJoinButton()" class="button-join" v-bind:disabled="socketSendLoading !== null">
                        <div v-if="game.options.funding > 0" class="button-funding">
                            <div class="funding-inner">
                                <span>-{{ game.options.funding }}%</span>
                            </div>
                        </div>
                        <div class="button-inner">
                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.47861 7.85824L6.15342 10.5285L5.08395 11.5963L6.15493 12.6649L5.08471 13.7327L3.21144 11.8636L1.07023 14L0 12.9322L2.14121 10.7951L0.267935 8.9268L1.33816 7.859L2.40839 8.92605L3.47861 7.85824ZM0.413256 0L3.09715 0.00226551L12.0412 8.9268L13.1122 7.859L14.1824 8.9268L12.3099 10.7958L14.4503 12.9322L13.3801 14L11.2389 11.8636L9.36561 13.7327L8.29539 12.6649L9.36561 11.5963L0.415526 2.66649L0.413256 0ZM11.3554 0L14.0371 0.00226551L14.0386 2.66271L10.971 5.72264L8.29463 3.05313L11.3554 0Z" />
                            </svg>
                            <div class="inner-text">
                                JOIN
                                <span v-if="game.options.levelMin > 0">LVL +{{game.options.levelMin}}</span>
                            </div>
                        </div>
                    </button>
                    <router-link v-bind:to="'/battles/' + game._id" class="link-view">
                        <div class="link-inner">
                            <svg width="19" height="11" viewBox="0 0 19 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.8581 4.63847C18.6885 4.44929 14.6093 0 9.49998 0C4.39071 0 0.311514 4.44929 0.141887 4.63847C-0.0472957 4.84992 -0.0472957 5.16958 0.141887 5.38103C0.311514 5.57021 4.39078 10.0195 9.49998 10.0195C14.6092 10.0195 18.6885 5.57021 18.8581 5.38103C19.0472 5.16958 19.0472 4.84992 18.8581 4.63847ZM9.49998 8.90622C7.35169 8.90622 5.60351 7.15804 5.60351 5.00975C5.60351 2.86146 7.35169 1.11328 9.49998 1.11328C11.6483 1.11328 13.3965 2.86146 13.3965 5.00975C13.3965 7.15804 11.6483 8.90622 9.49998 8.90622Z" />
                                <path d="M10.0566 3.89648C10.0566 3.3365 10.3346 2.84387 10.7575 2.54088C10.378 2.34661 9.95476 2.22656 9.49999 2.22656C7.96541 2.22656 6.7168 3.47518 6.7168 5.00976C6.7168 6.54433 7.96541 7.79295 9.49999 7.79295C10.8739 7.79295 12.0111 6.78974 12.2358 5.47889C11.1148 5.83978 10.0566 4.99202 10.0566 3.89648Z" />
                            </svg>
                            {{ game.state === 'completed' ? 'REPLAY' : '' }}
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AvatarImage from '@/components/AvatarImage';
    import IconTerminalGradient from '@/components/icons/IconTerminalGradient';
    import IconCursedGradient from '@/components/icons/IconCursedGradient';
    import IconVersusGradient from '@/components/icons/IconVersusGradient';
    import IconGroupGradient from '@/components/icons/IconGroupGradient';
    import IconSpinner from '@/components/icons/IconSpinner';
    import BattlesGameBoxes from '@/components/battles/BattlesGameBoxes';

    export default {
        name: 'BattlesGameElement',
        props: ['game'],
        components: {
            AvatarImage,
            IconTerminalGradient,
            IconCursedGradient,
            IconVersusGradient,
            IconGroupGradient,
            IconSpinner,
            BattlesGameBoxes
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'battlesSendJoinSocket'
            ]),
            battlesFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            battlesGetRank(user) {
                let rank = user.rakeback;

                if(user.rank !== 'user') { rank = user.rank; }

                return rank;
            },
            battlesGetLevelColor(user) {
                let color = '';

                if(user.level >= 2 && user.level < 26) { color = 'blue'; }
                else if(user.level >= 26 && user.level < 51) { color = 'green'; }
                else if(user.level >= 51 && user.level < 76) { color = 'orange'; }
                else if(user.level >= 76 && user.level < 100) { color = 'red'; }
                else if(user.level >= 100) { color = 'purple'; }

                return color;
            },
            battlesJoinButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                const data = { gameId: this.game._id, slot: this.game.bets.length };
                this.battlesSendJoinSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'authUser'
            ]),
            battlesGetMode() {
                let mode = '1v1';

                if(this.game.mode === 'group')  { mode = 'Group'; }
                else if(this.game.mode === 'team') { mode = '2v2'; }
                else if(this.game.playerCount === 3) { mode = '1v1v1'; }
                else if(this.game.playerCount === 4) { mode = '1v1v1v1'; }

                return mode;
            },
            battlesGetOption() {
                let option = '';

                if(this.game.options.cursed === true && this.game.options.terminal === false) { option = 'CURSED'; }
                else if(this.game.options.cursed === false && this.game.options.terminal === true) { option = 'TERMINAL'; }

                return option;
            },
            battlesGetBets() {
                let bets = [];

                for(let bet = 0; bet < this.game.playerCount; bet++) {
                    const index = this.game.bets.findIndex((element) => element.slot === bet);

                    bets.push(index !== -1 ? this.game.bets[index] : null);
                }

                return bets;
            },
            battlesGetBoxes() {
                let boxes = [];

                for(const box of this.game.boxes) {
                    for(let i = 0; i < box.count; i++) { boxes.push(box.box); }
                }

                return boxes;
            }
        }
    }
</script>

<style scoped>
    .battles-game-element {
        width: 100%;
        height: 95px;
        margin-top: 8px;
        padding: 1px;
        background: #0a273f;
    }

    .battles-game-element:first-child {
        margin-top: 0;
    }

    .battles-game-element.element-group {
        background: rgba(0, 255, 194, 0.5);
    }

    .battles-game-element.element-cursed {
        background: rgba(242, 64, 52, 0.5);
    }

    .battles-game-element.element-terminal {
        background: rgba(234, 214, 33, 0.5);
    }

    .battles-game-element.element-cursed.element-terminal {
        background: linear-gradient(90deg, rgba(210, 59, 39, 0.5) 0%, rgba(234, 214, 33, 0.5) 100%);
    }

    .battles-game-element .element-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0.03) 50%, rgba(5, 29, 48, 0.35) 100%), #031f35;
    }

    .battles-game-element .inner-info {
        width: 135px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .battles-game-element .info-type,
    .battles-game-element .info-option {
        width: 80px;
        height: 29px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .battles-game-element .info-option {
        width: 108px;
        margin-top: 6px;
    }

    .battles-game-element .info-type:before,
    .battles-game-element .info-option:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }

    .battles-game-element .info-type:before {
        background: linear-gradient(0deg, rgba(10, 39, 63, 0.35) 0%, rgba(10, 39, 63, 0.35) 100%),
                    linear-gradient(180deg, #3747d7 0%, rgba(68, 20, 171, 0.85) 100%);
    }

    .battles-game-element.element-group .info-type:before {
        background: linear-gradient(225deg, #057167 0%, #06584f 100%);
    }

    .battles-game-element.element-cursed .info-option:before {
        background: linear-gradient(0deg, rgba(10, 39, 63, 0.35) 0%, rgba(10, 39, 63, 0.35) 100%),
                    linear-gradient(0deg, rgba(210, 59, 39, 0.5) 0%, rgba(210, 59, 39, 0.5) 100%);
    }

    .battles-game-element.element-terminal .info-option:before {
        background: linear-gradient(0deg, rgba(10, 39, 63, 0.35) 0%, rgba(10, 39, 63, 0.35) 100%),
                    linear-gradient(0deg, rgba(252, 154, 38, 0.5) 0%, rgba(252, 154, 38, 0.5) 100%);
    }

    .battles-game-element.element-cursed.element-terminal .info-option:before {
        background: linear-gradient(0deg, rgba(10, 39, 63, 0.35) 0%, rgba(10, 39, 63, 0.35) 100%),
                    linear-gradient(90deg, rgba(210, 59, 39, 0.5) 0%, rgba(253, 151, 38, 0.5) 100%);
    }

    .battles-game-element .info-type:after,
    .battles-game-element .info-option:after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #031c31;
        z-index: -1;
    }

    .battles-game-element .type-inner,
    .battles-game-element .option-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .battles-game-element .type-inner {
        font-size: 14px;
        font-weight: 700;
        color: #5e768e;
        background: radial-gradient(80% 80% at 50% 50%, rgba(46, 62, 202, 0.20) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0) 100%),
                    repeating-linear-gradient(-55deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03) 5px, rgba(2, 21, 36, 0.25) 5px, rgba(2, 21, 36, 0.25) 10px);
    }

    .battles-game-element.element-group .type-inner {
        background: linear-gradient(223deg, rgba(0, 255, 194, 0.25) 0%, rgba(0, 170, 109, 0.25) 100%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0) 100%),
                    repeating-linear-gradient(-55deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03) 5px, rgba(2, 21, 36, 0.25) 5px, rgba(2, 21, 36, 0.25) 10px);
    }

    .battles-game-element.element-group .type-inner span {
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .battles-game-element .option-inner {
        font-size: 13px;
        font-weight: 800;
    }

    .battles-game-element.element-cursed .option-inner {
        background: linear-gradient(230deg, rgba(242, 64, 52, 0.15) 0%, rgba(121, 44, 0, 0.15) 100%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0) 100%),
                    repeating-linear-gradient(-55deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03) 5px, rgba(2, 21, 36, 0.25) 5px, rgba(2, 21, 36, 0.25) 10px);
    }

    .battles-game-element.element-terminal .option-inner {
        background: linear-gradient(216deg, rgba(234, 214, 33, 0.15) 0%, rgba(255, 142, 38, 0.15) 100%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0) 100%),
                    repeating-linear-gradient(-55deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03) 5px, rgba(2, 21, 36, 0.25) 5px, rgba(2, 21, 36, 0.25) 10px);
    }

    .battles-game-element.element-terminal .option-inner {
        background: linear-gradient(252deg, rgba(250, 159, 37, 0.15) 0%, rgba(121, 44, 0, 0.15) 100%), 
                    linear-gradient(223deg, rgba(5, 29, 48, 0.35) 0%, rgba(31, 99, 153, 0) 100%),
                    repeating-linear-gradient(-55deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03) 5px, rgba(2, 21, 36, 0.25) 5px, rgba(2, 21, 36, 0.25) 10px);
    }

    .battles-game-element.element-cursed .option-inner span {
        color: #f24034;
    }

    .battles-game-element.element-terminal .option-inner span {
        background: linear-gradient(216deg, #ead621 0%, #ff8e26 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .battles-game-element .option-inner svg {
        margin-right: 4px;
    }

    .battles-game-element.element-cursed.element-terminal .option-inner svg:nth-child(2) {
        margin-right: 0;
    }

    .battles-game-element .inner-players {
        width: 315px;
        display: flex;
        align-items: center;
        padding-right: 32px;
    }

    .battles-game-element .players-element {
        display: flex;
        align-items: center;
        margin-right: 10px;
    }

    .battles-game-element .players-element:last-child {
        margin-right: 0;
    }

    .battles-game-element .element-user {
        width: 34px;
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        border-radius: 50%;
        background: #041b2d;
        border: 1px solid #9e9e9e;
        overflow: hidden;
    }

    .battles-game-element.element-completed .element-user {
        opacity: 0.35;
        mix-blend-mode: luminosity;
    }

    .battles-game-element.element-completed .element-user.user-winner {
        opacity: 1;
        mix-blend-mode: normal;
    }

    .battles-game-element .element-user.user-empty {
        align-items: center;
        border: 1px solid #134166;
    }

    .battles-game-element .element-user.user-blue {
        border: 1px solid #559ee4;
    }

    .battles-game-element .element-user.user-green {
        border: 1px solid #b8e92d;
    }

    .battles-game-element .element-user.user-orange {
        border: 1px solid #fca311;
    }

    .battles-game-element .element-user.user-red {
        border: 1px solid #ff4e4e;
    }

    .battles-game-element .element-user.user-purple {
        border: 1px solid #6953f1;
    }

    .battles-game-element .element-user.user-partner {
        border: 1px solid #eca822;
    }

    .battles-game-element .element-user.user-mod {
        border: 1px solid #ffb703;
    }

    .battles-game-element .element-user.user-bot,
    .battles-game-element .element-user.user-admin {
        border: 1px solid #00ffc2;
    }

    .battles-game-element .element-user.user-empty svg {
        width: 14px;
        fill: #134166;
        animation: waiting_animation 1.5s infinite linear both;
    }

    .battles-game-element .element-user .avatar-image {
        width: 100%;
        height: 100%;
    }

    .battles-game-element .element-separator {
        width: 29px;
        height: 23px;
        position: relative;
        margin-left: 10px;
        padding: 1px;
        z-index: 1;
    }

    .battles-game-element .element-separator::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #00ffc2 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .battles-game-element .separator-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: radial-gradient(78% 78% at 50% 50%, rgba(10, 238, 179, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), #051f33;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .battles-game-element .inner-cases {
        width: calc(100% - 825px);
    }

    .battles-game-element .inner-right {
        width: 375px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 25px;
    }

    .battles-game-element .right-amount {
        position: relative;
        padding: 1px;
    }

    .battles-game-element .right-amount:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #0f3554;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 10px), 0 10px);
    }

    .battles-game-element .amount-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px 17px;
        background: #0e233b;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 10px), 0 10px);
    }

    .battles-game-element .inner-effective,
    .battles-game-element .inner-real {
        display: flex;
        align-items: center;
    }

    .battles-game-element .inner-real {
        margin-top: 2px;
    }

    .battles-game-element .inner-effective img {
        width: 16px;
        height: 16px;
        margin-right: 7px;
    }

    .battles-game-element .inner-real img {
        width: 13px;
        height: 13px;
        margin-right: 6px;
        opacity: 0.5;
    }

    .battles-game-element .effective-value {
        font-size: 11px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .battles-game-element .real-value {
        position: relative;
        font-size: 9px;
        font-weight: 600;
        color: #83919c;
    }

    .battles-game-element .real-value:after {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        top: 50%;
        left: 0;
        background: #707e89;
    }

    .battles-game-element .effective-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .battles-game-element .real-value span {
        font-size: 11px;
        font-weight: 800;
    }

    .battles-game-element .right-separator {
        width: 1px;
        height: 60px;
        background: linear-gradient(0deg, rgba(97, 112, 241, 0.00) 0%, rgba(64, 92, 212, 0.35) 50%, rgba(28, 71, 182, 0.00) 100%);
    }

    .battles-game-element .right-action {
        display: flex;
        align-items: center;
    }

    .battles-game-element button.button-waiting,
    .battles-game-element button.button-join {
        width: 96px;
        height: 39px;
        position: relative;
        margin-right: 12px;
        padding: 1px;
    }

    .battles-game-element a.link-view {
        width: 45px;
        height: 39px;
        transition: all .2s;
    }

    .battles-game-element a.link-view:active {
        transition-duration: .2s;
        scale: .9;
    }


    .battles-game-element.element-completed a.link-view {
        width: 153px;
    }

    .battles-game-element button.button-waiting:before,
    .battles-game-element button.button-join:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 170, 109, 0) 0%, #00ffc2 100%);
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .battles-game-element button.button-waiting:before {
        background: linear-gradient(180deg, rgba(0, 170, 109, 0) 0%, rgba(0, 255, 194, 0.2) 100%);
    }

    .battles-game-element .button-funding {
        width: 48px;
        height: 21px;
        position: absolute;
        top: -9px;
        left: -7px;
        transform: rotate(-10deg);
        padding: 1px;
        z-index: 1;
    }

    .battles-game-element .button-funding:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #01c98c;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .battles-game-element .funding-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(242deg, rgba(0, 255, 194, 0.4) 16%, rgba(0, 231, 170, 0.22) 32%, rgba(0, 218, 157, 0.1) 50%, rgba(0, 195, 134, 0.26) 80%, rgba(0, 170, 109, 0.44) 100%), 
                    linear-gradient(180deg, #073137 0%, #082538 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .battles-game-element .funding-inner span {
        font-size: 11px;
        font-weight: 800;
        background: linear-gradient(239deg, #00ffc2 -100%, #00aa6d 120%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .battles-game-element button.button-waiting .button-inner,
    .battles-game-element button.button-join .button-inner,
    .battles-game-element a.link-view .link-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .battles-game-element button.button-waiting .button-inner {
        background: linear-gradient(255deg, rgba(0, 255, 194, 0.15) 0%, rgba(0, 170, 109, 0.15) 100%), #051f35;
    }

    .battles-game-element button.button-join .button-inner {
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
    }

    .battles-game-element a.link-view .link-inner {
        font-size: 13px;
        font-weight: 700;
        color: #5e768e;
        transition: color 0.3s ease;
    }

    .battles-game-element a.link-view:hover .link-inner {
        color: #ffffff;
    }

    .battles-game-element button.button-waiting .button-inner svg {
        fill: #00ffc2;
        animation: waiting_animation 1.5s infinite linear both;
    }

    .battles-game-element button.button-join .button-inner svg {
        margin-right: 8px;
        fill: #ffffff;
    }

    .battles-game-element a.link-view .link-inner {
        background: #214059;
    }
    .battles-game-element a.link-view .link-inner:hover {
        background: #2f5574;
    }

    .battles-game-element a.link-view .link-inner svg {
        fill: #5e768e;
        transition: fill 0.3s ease;
    }

    .battles-game-element.element-completed a.link-view .link-inner svg {
        margin-right: 8px;
    }

    .battles-game-element a.link-view:hover .link-inner svg {
        fill: #ffffff;
    }

    .battles-game-element button.button-join .inner-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .battles-game-element button.button-join .inner-text span {
        font-size: 9px;
        font-weight: 700;
    }

    @keyframes waiting_animation {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @media only screen and (max-width: 1100px) {

        .battles-game-element {
            height: auto;
        }

        .battles-game-element .element-inner {
            display: grid;
            grid-template-columns: 135px calc(100% - 323px) 188px;
            padding: 10px 0;
        }

        .battles-game-element .inner-info {
            grid-column: 1 / 1;
            grid-row: 1 / 3;
        }

        .battles-game-element .inner-players {
            width: 100%;
            grid-column: 2 / 2;
        }

        .battles-game-element .inner-cases {
            width: 100%;
            grid-column: 2 / 2;
            grid-row: 2 / 2;
            margin-top: 10px;
        }

        .battles-game-element .inner-right {
            width: 100%;
            grid-column: 3 / 3;
            grid-row: 1 / 3;
            flex-direction: column;
            padding: 0 10px 0 25px;
        }

        .battles-game-element .right-amount {
            width: 100%;
        }

        .battles-game-element .right-separator {
            display: none;
        }

        .battles-game-element .right-action {
            margin-top: 5px;
        }

    }

    @media only screen and (max-width: 625px) {

        .battles-game-element .element-inner {
            grid-template-columns: calc(100% - 188px) 188px;
            padding: 10px;
        }

        .battles-game-element .inner-info {
            display: none;
        }

        .battles-game-element .inner-players {
            grid-column: 1 / 1;
        }

        .battles-game-element .inner-cases {
            grid-column: 1 / 1;
        }

        .battles-game-element .inner-right {
            grid-column: 2 / 2;
            padding: 0 0 0 25px;
        }

    }
</style>