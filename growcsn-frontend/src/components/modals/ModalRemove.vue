<template>
    <div class="modal-remove">
        <div class="remove-title">
            <span class="gradient-green">REMOVE MESSAGE</span>
        </div>
        <div class="remove-message">
            <div class="message-inner">{{modalsData.message.message}}</div>
        </div>
        <button v-on:click="modalRemoveButton()" class="button-remove" v-bind:disabled="socketSendLoading === 'ChatRemove'">
            <div class="button-inner">REMOVE MESSAGE</div>
        </button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AvatarImage from '@/components/AvatarImage';
    import BoxLevel from '@/components/BoxLevel';
    import BoxRank from '@/components/BoxRank';
    import ButtonLoading from '@/components/ButtonLoading';

    export default {
        name: 'ModalRemove',
        components: {
            AvatarImage,
            BoxLevel,
            BoxRank,
            ButtonLoading
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'chatSendRemoveSocket'
            ]),
            modalRemoveButton() {
                const data = { messageId: this.modalsData.message._id };
                this.chatSendRemoveSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'modalsData'
            ])
        }
    }
</script>

<style scoped>
    .modal-remove {
        width: 773px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 0 48px 0;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% -31.45%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, #07263d 0%, #07243a 100%);
    }

    .modal-remove .remove-title {
        text-align: center;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-remove .remove-message {
        width: 448px;
        position: relative;
        margin-top: 35px;
        padding: 1px;
    }

    .modal-remove .remove-message::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #04131f 0%, #223a4e 100%);
        clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 25%, 100% 75%, calc(100% - 14px) 100%, 14px 100%, 0 75%, 0 25%);
    }

    .modal-remove .message-inner {
        width: 100%;
        padding: 24px 20px 24px 20px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: #072435;
        clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 25%, 100% 75%, calc(100% - 14px) 100%, 14px 100%, 0 75%, 0 25%);
    }

    .modal-remove button.button-remove {
        width: 170px;
        height: 48px;
        margin-top: 20px;
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
    }

    .modal-remove button.button-remove .button-inner {
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

    @media only screen and (max-width: 793px) {

        .modal-remove {
            width: calc(100vw - 20px);
        }

    }
</style>