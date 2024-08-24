<template>
    <div class="modal-fair-game">
        <div class="game-header">
            <div class="header-icon">
                <img src="@/assets/img/fair.png" alt="fair" />
            </div>
            <span class="gradient-green">PROVABLY FAIR</span>
        </div>
        <div class="game-element">
            <div class="element-title">Game #ID</div>
            <div class="element-content">
                <span>{{modalsData.game._id}}</span>
                <button v-on:click="modalCopyButton(modalsData.game._id)">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.16493 13.7385C4.51414 13.7385 3.17051 12.3949 3.17051 10.7441V3.52246H1.93758C0.868744 3.52246 0 4.39108 0 5.45991V14.9715C0 16.0403 0.868744 16.909 1.93758 16.909H10.7445C11.8133 16.909 12.6821 16.0403 12.6821 14.9715V13.7385H6.16493Z" />
                        <path d="M15.5004 1.93758C15.5004 0.867325 14.6331 0 13.563 0H6.16512C5.09486 0 4.22754 0.867325 4.22754 1.93758V10.7445C4.22754 11.8147 5.09486 12.6821 6.16512 12.6821H13.563C14.6331 12.6821 15.5004 11.8147 15.5004 10.7445V1.93758Z" />
                    </svg>
                </button>
            </div>
        </div>
        <div class="game-element">
            <div class="element-title">Server Seed Hash</div>
            <div class="element-content">
                <span>{{modalGetHash}}</span>
                <button v-on:click="modalCopyButton(modalGetHash)">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.16493 13.7385C4.51414 13.7385 3.17051 12.3949 3.17051 10.7441V3.52246H1.93758C0.868744 3.52246 0 4.39108 0 5.45991V14.9715C0 16.0403 0.868744 16.909 1.93758 16.909H10.7445C11.8133 16.909 12.6821 16.0403 12.6821 14.9715V13.7385H6.16493Z" />
                        <path d="M15.5004 1.93758C15.5004 0.867325 14.6331 0 13.563 0H6.16512C5.09486 0 4.22754 0.867325 4.22754 1.93758V10.7445C4.22754 11.8147 5.09486 12.6821 6.16512 12.6821H13.563C14.6331 12.6821 15.5004 11.8147 15.5004 10.7445V1.93758Z" />
                    </svg>
                </button>
            </div>
        </div>
        <div v-if="modalGetSeedServer !== ''" class="game-element">
            <div class="element-title">Server Seed</div>
            <div class="element-content">
                <span>{{modalGetSeedServer}}</span>
                <button v-on:click="modalCopyButton(modalGetSeedServer)">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.16493 13.7385C4.51414 13.7385 3.17051 12.3949 3.17051 10.7441V3.52246H1.93758C0.868744 3.52246 0 4.39108 0 5.45991V14.9715C0 16.0403 0.868744 16.909 1.93758 16.909H10.7445C11.8133 16.909 12.6821 16.0403 12.6821 14.9715V13.7385H6.16493Z" />
                        <path d="M15.5004 1.93758C15.5004 0.867325 14.6331 0 13.563 0H6.16512C5.09486 0 4.22754 0.867325 4.22754 1.93758V10.7445C4.22754 11.8147 5.09486 12.6821 6.16512 12.6821H13.563C14.6331 12.6821 15.5004 11.8147 15.5004 10.7445V1.93758Z" />
                    </svg>
                </button>
            </div>
        </div>
        <div v-if="modalGetSeedPublic !== ''" class="game-element">
            <div class="element-title">Public Seed</div>
            <div class="element-content">
                <span>{{modalGetSeedPublic}}</span>
                <button v-on:click="modalCopyButton(modalGetSeedPublic)">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.16493 13.7385C4.51414 13.7385 3.17051 12.3949 3.17051 10.7441V3.52246H1.93758C0.868744 3.52246 0 4.39108 0 5.45991V14.9715C0 16.0403 0.868744 16.909 1.93758 16.909H10.7445C11.8133 16.909 12.6821 16.0403 12.6821 14.9715V13.7385H6.16493Z" />
                        <path d="M15.5004 1.93758C15.5004 0.867325 14.6331 0 13.563 0H6.16512C5.09486 0 4.22754 0.867325 4.22754 1.93758V10.7445C4.22754 11.8147 5.09486 12.6821 6.16512 12.6821H13.563C14.6331 12.6821 15.5004 11.8147 15.5004 10.7445V1.93758Z" />
                    </svg>
                </button>
            </div>
        </div>
        <div v-if="['mines', 'mines', 'unbox'].includes(modalsData.game.method) === true" class="game-group">
            <div class="group-element">
                <div class="element-title">Client Seed</div>
                <div class="element-content">
                    <span>{{ modalsData.game.fair.seed.seedClient }}</span>
                    <button v-on:click="modalCopyButton(modalsData.game.fair.seed.seedClient)">
                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.16493 13.7385C4.51414 13.7385 3.17051 12.3949 3.17051 10.7441V3.52246H1.93758C0.868744 3.52246 0 4.39108 0 5.45991V14.9715C0 16.0403 0.868744 16.909 1.93758 16.909H10.7445C11.8133 16.909 12.6821 16.0403 12.6821 14.9715V13.7385H6.16493Z" />
                            <path d="M15.5004 1.93758C15.5004 0.867325 14.6331 0 13.563 0H6.16512C5.09486 0 4.22754 0.867325 4.22754 1.93758V10.7445C4.22754 11.8147 5.09486 12.6821 6.16512 12.6821H13.563C14.6331 12.6821 15.5004 11.8147 15.5004 10.7445V1.93758Z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="group-element">
                <div class="element-title">Nonce</div>
                <div class="element-content">
                    <span>{{ modalsData.game.fair.nonce }}</span>
                    <button v-on:click="modalCopyButton(modalsData.game.fair.nonce )">
                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.16493 13.7385C4.51414 13.7385 3.17051 12.3949 3.17051 10.7441V3.52246H1.93758C0.868744 3.52246 0 4.39108 0 5.45991V14.9715C0 16.0403 0.868744 16.909 1.93758 16.909H10.7445C11.8133 16.909 12.6821 16.0403 12.6821 14.9715V13.7385H6.16493Z" />
                            <path d="M15.5004 1.93758C15.5004 0.867325 14.6331 0 13.563 0H6.16512C5.09486 0 4.22754 0.867325 4.22754 1.93758V10.7445C4.22754 11.8147 5.09486 12.6821 6.16512 12.6821H13.563C14.6331 12.6821 15.5004 11.8147 15.5004 10.7445V1.93758Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'ModalFairGame',
        methods: {
            ...mapActions([
                'notificationShow'
            ]),
            modalCopyButton(value) {
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
                'modalsData'
            ]),
            modalGetHash() {
                let hash = '';

                if(this.modalsData.game.fair.seed !== undefined) { hash = this.modalsData.game.fair.seed.hash; }
                else { hash = this.modalsData.game.fair.hash; }

                return hash;
            },
            modalGetSeedServer() {
                let seed = '';

                if(this.modalsData.game.fair.seed !== undefined && this.modalsData.game.fair.seed.seedServer !== undefined) { seed = this.modalsData.game.fair.seed.seedServer; }
                else if(this.modalsData.game.fair.seedServer !== undefined) { seed = this.modalsData.game.fair.seedServer; }

                return seed;
            },
            modalGetSeedPublic() {
                let seed = '';

                if(this.modalsData.game.fair.seedPublic !== undefined) { seed = this.modalsData.game.fair.seedPublic; }

                return seed;
            }
        }
    }
</script>

<style scoped>
    .modal-fair-game {
        width: 720px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 30px 30px 30px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% 0%, rgba(0, 255, 194, 0.25) 0%, rgba(7, 38, 61, 0) 80%), 
                    linear-gradient(256deg, #07263d 0%, #07243a 100%);
    }

    .modal-fair-game .game-header {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .modal-fair-game .header-icon {
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: linear-gradient(255deg, rgba(0, 255, 194, 0.2)0%, rgba(0, 170, 109, 0.2) 100%);
    }

    .modal-fair-game .header-icon img {
        width: 48px;
        height: 48px;
    }

    .modal-fair-game .game-header span {
        margin-top: 20px;
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-fair-game .game-element,
    .modal-fair-game .game-group {
        width: 100%;
        margin-top: 25px;
    }

    .modal-fair-game .game-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-fair-game .game-element:nth-child(2),
    .modal-fair-game .game-group:nth-child(2) {
        margin-top: 35px;
    }

    .modal-fair-game .group-element {
        width: calc(50% - 8px);
    }

    .modal-fair-game .element-title {
        font-weight: 16;
        font-weight: 700;
        color: #ffffff;
    }

    .modal-fair-game .element-content {
        width: 100%;
        height: 56px;
        position: relative;
        display: flex;
        align-items: center;
        margin-top: 12px;
        padding: 0 52px 0 20px;
        border-radius: 8px;
        background: #071f2e;
    }

    .modal-fair-game .element-content span {
        font-size: 16px;
        font-weight: 600;
        color: #5e768e;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .modal-fair-game .element-content button {
        position: absolute;
        top: 50%;
        right: 22px;
        transform: translate(0, -50%);
    }

    .modal-fair-game .element-content button svg {
        width: 20px;
        height: auto;
        fill: #49687d;
        transition: fill 0.3s ease;
    }

    .modal-fair-game .element-content button:hover svg {
        fill: #ffffff;
    }

    @media only screen and (max-width: 740px) {

        .modal-fair-game {
            width: calc(100vw - 20px);
            padding: 35px 10px 30px 10px;
        }

    }

    @media only screen and (max-width: 500px) {

        .modal-fair-game {
            padding: 65px 10px 30px 10px;
        }

    }
</style>
