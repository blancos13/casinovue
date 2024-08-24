<template>
    <div class="duels-game-header">
        <div class="header-info">
            <div class="info-title">
                <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.90698 20.2069L15.7558 27.0733L13.0174 29.8191L15.7597 32.5668L13.0194 35.3126L8.22287 30.5065L2.74031 36L0 33.2542L5.48256 27.7588L0.686047 22.9546L3.42636 20.2089L6.16667 22.9527L8.90504 20.2069H8.90698ZM1.05814 0L7.93023 0.0058256L30.8314 22.9546L33.5736 20.2089L36.314 22.9546L31.5194 27.7607L37 33.2542L34.2597 36L28.7771 30.5065L23.9806 35.3126L21.2403 32.5668L23.9806 29.8191L1.06395 6.85668L1.05814 0ZM29.0756 0L35.9419 0.0058256L35.9457 6.84697L28.0911 14.7154L21.2384 7.85091L29.0756 0Z" />
                </svg>
                DICE DUEL
            </div>
            GAME ID = {{duelsGame._id}}
        </div>
        <div class="header-actions">
            <div class="actions-sound">
                <div v-on:click="modalToggleSound()" class="sound-toggle" v-bind:class="{ 'toggle-active': soundDuels === 1 }"></div>
                SOUND ON
            </div>
            <button v-on:click="modalCopyButton()" class="button-copy">
                <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.25541 17.6492C6.17847 17.6492 4.488 15.9587 4.488 13.8818V4.7959H2.93678C1.59203 4.7959 0.499023 5.88874 0.499023 7.2335V19.2004C0.499023 20.5452 1.59203 21.6382 2.93678 21.6382H14.0172C15.3619 21.6382 16.4549 20.5452 16.4549 19.2004V17.6492H8.25541Z" />
                    <path d="M19.9999 2.80006C19.9999 1.45353 18.9086 0.362305 17.5623 0.362305H8.25465C6.90812 0.362305 5.81689 1.45353 5.81689 2.80006V13.8804C5.81689 15.227 6.90812 16.3182 8.25465 16.3182H17.5623C18.9086 16.3182 19.9999 15.227 19.9999 13.8804V2.80006Z" />
                </svg>
                COPY LINK
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'DuelsGameHeader',
        props: ['duelsGame'],
        methods: {
            ...mapActions([
                'notificationShow', 
                'soundSetDuels'
            ]),
            modalToggleSound() {
                if(this.soundDuels === 1) { this.soundSetDuels(0);
                } else { this.soundSetDuels(1); }
            },
            modalCopyButton() {
                const el = document.createElement('textarea');
                el.value = 'v.com/duels?game=' + this.duelsGame._id;
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);

                this.notificationShow({ type: 'success', message: 'Copied to your clipboard.' });
            },
        },
        computed: {
            ...mapGetters([ 
                'soundDuels'
            ])
        }
    }
</script>

<style scoped>
    .duels-game-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 22px;
        border-bottom: 1px solid #0c324e;
    }

    .duels-game-header .header-info {
        /* font-family: 'Rubik'; */
        font-size: 16px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .duels-game-header .info-title {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        font-size: 28px;
        font-weight: 900;
        color: #ffffff;
    }

    .duels-game-header .info-title svg {
        margin-right: 12px;
        fill: #ffffff;
    }

    .duels-game-header .header-actions {
        display: flex;
        align-items: center;
    }

    .duels-game-header .actions-sound {
        display: flex;
        align-items: center;
        margin-right: 20px;
        font-size: 12px;
        font-weight: 700;
        color: #5e768e;
    }

    .duels-game-header .sound-toggle {
        width: 45px;
        height: 15px;
        position: relative;
        margin-right: 12px;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
        cursor: pointer;
    }

    .duels-game-header .sound-toggle::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #000d16;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .duels-game-header .sound-toggle::after {
        content: '';
        width: 25px;
        height: 19px;
        position: absolute;
        top: -2px;
        left: 0;
        background: #1c5064;
        clip-path: polygon(3px 0, calc(100% - 3px) 0, 100% 25%, 100% 75%, calc(100% - 3px) 100%, 3px 100%, 0 75%, 0 25%);
        transition: all 0.3s ease;
    }

    .duels-game-header .sound-toggle.toggle-active::after {
        transform: translate(20px, 0);
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
    }

    .duels-game-header .header-actions button.button-copy {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: #5e768e;
        transition: color 0.3s ease;
    }

    .duels-game-header .header-actions button.button-copy:hover {
        color: #ffffff;
    }

    .duels-game-header .header-actions button.button-copy svg {
        margin-right: 12px;
        fill: #5e768e;
        transition: fill 0.3s ease;
    }

    .duels-game-header .header-actions button.button-copy:hover svg {
        fill: #ffffff;
    }

    @media only screen and (max-width: 700px) {

        .duels-game-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .duels-game-header .header-actions {
            margin-top: 20px;
        }

    }
</style>
