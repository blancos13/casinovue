<template>
    <div class="modal-battles-modes" v-bind:class="[ 'modes-' + modalsData.mode ]">
        <div class="modes-header">
            <div class="header-icon">
                <img src="@/assets/img/info.png" alt="info" />
            </div>
            <span>{{ modalsData.mode.toUpperCase() }} MODE</span>
        </div>
        <div class="modes-info">
            {{ 
                modalsData.mode === 'cursed' ? 
                    'Cursed Mode is a unique mode that changes the nature of Case Battles. Within this mode, the team or user which pulls the least is the one who wins the battle.' :
                    'Terminal Mode is a unique mode that changes the nature of Case Battles. Within this mode, the last case in the case battle is the one that determines the outcome of the battle.'
            }}
        </div>
        <button v-on:click="modalsSetShow(null)" class="button-proceed">
            <div class="button-inner">PROCEED</div>
        </button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'ModalBattlesModes',
        methods: {
            ...mapActions([
                'modalsSetShow'
            ])
        },
        computed: {
            ...mapGetters([
                'modalsData'
            ])
        }
    }
</script>

<style scoped>
    .modal-battles-modes {
        width: 600px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 30px 30px 30px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% 0%, rgba(0, 255, 194, 0.25) 0%, rgba(7, 38, 61, 0) 80%), 
                    linear-gradient(256deg, #07263d 0%, #07243a 100%);
    }

    .modal-battles-modes .modes-header {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .modal-battles-modes .header-icon {
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: linear-gradient(255deg, rgba(0, 255, 194, 0.2)0%, rgba(0, 170, 109, 0.2) 100%);
    }

    .modal-battles-modes .header-icon img {
        width: 48px;
        height: 48px;
    }

    .modal-battles-modes .modes-header span {
        margin-top: 20px;
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-battles-modes.modes-cursed .modes-header span {
        color: #ea3f31;
    }

    .modal-battles-modes.modes-terminal .modes-header span {
        color: #fc9a26;
    }

    .modal-battles-modes .modes-info  {
        margin-top: 12px;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .modal-battles-modes button.button-proceed {
        width: 230px;
        height: 48px;
        margin-top: 35px;
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
    }

    .modal-battles-modes button.button-proceed .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 75%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    @media only screen and (max-width: 620px) {

        .modal-battles-modes {
            width: calc(100vw - 20px);
            padding: 35px 10px 30px 10px;
        }

    }

    @media only screen and (max-width: 500px) {

        .modal-battles-modes {
            padding: 65px 10px 30px 10px;
        }

    }
</style>