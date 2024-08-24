<template>
    <div v-on:scroll="chatHandleScroll()" class="content-messages" ref="chatMessages">
        <transition  name="fade" mode="out-in">
            <div v-if="chatMessages.data === null || chatMessages.loading === true" class="messages-loading" key="loading">

                <div v-for="index in 4" v-bind:key="index" class="loading-placeholder">
                    <div class="placeholder-user">
                        <div class="user-avatar"></div>
                        <div class="user-username"></div>
                    </div>
                    <div class="placeholder-text"></div>
                </div>

            </div>
            <div v-else class="messages-list" key="list">

                <ChatMessageElement v-for="message in chatMessages.data" v-bind:key="message._id" v-bind:message="message" />

            </div>
        </transition>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import ChatMessageElement from '@/components/chat/ChatMessageElement';

    export default {
        name: 'Chat',
        components: {
            ChatMessageElement,
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'modalsSetShow',
                'modalsSetData', 
                'generalSetSidebarMobile', 
                'chatSetScroll',
                'chatGetMessagesSocket', 
                'chatSendMessageSocket',
                'chatSendClearSocket', 
                'chatSendLockSocket', 
                'generalSetUserInfoData',
                'generalGetUserInfoSocket',
                'generalSendRainCreateSocket'
            ]),
            chatScrollToBottom() {
                this.$nextTick(() => {
                    let container = this.$refs.chatMessages;
                    container.scrollTop = container.scrollHeight;
                });
            },
            chatHandleScroll() {
                let container = this.$refs.chatMessages;
                this.chatSetScroll((container.scrollHeight - (container.scrollTop + container.clientHeight)) < 100);
            }
        },
        computed: {
            ...mapGetters([
                'generalSidebarMobile', 
                'authUser',
                'chatScroll',  
                'chatMessages'
            ])
        },
        watch: {
            'chatMessages.data': {
                handler(state, oldState) {
                    const message = this.chatMessages.data[this.chatMessages.data.length - 1];

                    if(
                        this.chatScroll === true || 
                        this.chatMessages.data.length === 0 ||
                        (this.authUser.user !== null && message !== undefined && message.type === 'user' && message.user._id === this.authUser.user._id)
                    ) {
                        setTimeout(() => { this.chatScrollToBottom(); }, 125);
                    }
                },
                deep: true
            },
            'generalSidebarMobile': {
                handler() {
                    if(this.generalSidebarMobile === 'Chat') { this.chatScrollToBottom(); }
                }
            }
        },
        updated() {

        },
        mounted() {
            this.chatScrollToBottom();
        }
    }
</script>

<style scoped>
    aside#chat {
        width: 325px;
        height: 100%;
        position: fixed;
        top: 0;
        right: 0;
        padding: 17px 0 20px 0;
        background: linear-gradient(180deg, #062641 0%, #031422 140%);
        box-shadow: -3px 0px 10px rgba(0, 0, 0, 0.07);
        z-index: 50;
        transition: transform 0.3s ease;
    }

    aside#chat .chat-toggle {
        position: absolute;
        display: none;
        bottom: 50px;
        left: -65px;
    }

    aside#chat .chat-toggle button {
        width: 50px;
        height: 50px;
        filter: drop-shadow(0px 4px 25px rgba(1, 230, 169, 0.15)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.35));
    }

    aside#chat .chat-toggle button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 75%);
        clip-path: polygon(25% 0, 75% 0, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0 75%, 0 25%);
    }

    aside#chat .chat-toggle button .button-inner svg {
        width: 19px;
        height: 19px;
        margin-top: 3px;
        fill: #ffffff;
    }

    aside#chat .chat-header {
        position: relative;
        padding: 0 15px;
    }

    aside#chat .chat-header button.button-close {
        position: absolute;
        display: none;
        top: 3px;
        left: 10px;
    }

    aside#chat .header-online {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
    }

    aside#chat .header-online svg {
        margin-right: 9px;
    }

    aside#chat .chat-content {
        width: 100%;
        height: calc(100% - 270px);
        position: relative;
    }

    aside#chat .chat-content::before {
       content: '';
       width: 100%;
       height: 64px;
       position: absolute;
       top: 0;
       left: 0;
       background: linear-gradient(180deg, rgba(6, 36, 62, 1) 0%, rgba(6, 36, 62, 0.7) 75%, rgba(6, 36, 62, 0.1) 100%);
       z-index: 2;
   }

   aside#chat .content-messages {
       height: 100%;
       padding-bottom: 15px;
       overflow-x: hidden;
       overflow-y: scroll;
       scrollbar-width: none;
       -ms-overflow-style: none;
       scroll-behavior: smooth;
       transition: height 0.3s ease;
   }

    aside#chat.chat-rain .chat-content .content-messages {
       height: calc(100% - 145px);
   }

    aside#chat .content-messages::-webkit-scrollbar-track {
        background-color: transparent;
    }

    aside#chat .content-messages::-webkit-scrollbar {
        width: 0;
        height: 0;
    }

    aside#chat .messages-loading {
        width: 100%;
        padding: 0 15px;
    }

    aside#chat .messages-loading.fade-leave-active {
        transition: opacity 0.2s;
    }

    aside#chat .messages-loading.fade-leave-to {
        opacity: 0;
    }

    aside#chat .content-lock {
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translate(-50%, 0);
    }

    aside#chat.chat-rain .content-lock {
        bottom: 157px;
        z-index: 100;
    }

    aside#chat .content-lock button.button-lock {
        height: 30px;
        position: relative;
        padding: 1px;
        filter: drop-shadow(0px 2px 10px rgba(1, 230, 169, 0.15)) drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
        z-index: 1;
    }

    aside#chat .content-lock button.button-lock::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e1a4 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    aside#chat .content-lock button.button-lock .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 15px;
        font-size: 10px;
        font-weight: 700;
        color: #ffffff;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.128) 0%, rgba(0, 33, 24, 0.132) 25%, rgba(0, 99, 73, 0.144986) 60%, rgba(1, 193, 143, 0.0925409) 80%, rgba(1, 237, 176, 0.068) 100%) #064552;
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    aside#chat .content-rain {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 15px 15px 0 15px;
        z-index: 1;
    }

    aside#chat .content-rain .fade-slide-enter-active,
    aside#chat .content-rain .fade-slide-leave-active {
         transition: all 0.3s ease;
    }

    aside#chat .content-rain .fade-slide-enter,
    aside#chat .content-rain .fade-slide-leave-to {
        transform: translateY(-30px);
        opacity: 0;
    }

    aside#chat .loading-placeholder {
        width: 100%;
        margin-top: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #0e3350;
    }

    aside#chat .loading-placeholder:first-of-type {
        margin-top: 0;
    }

    aside#chat .placeholder-user {
        display: flex;
        align-items: center;
    }

    aside#chat .user-avatar {
        width: 37px;
        height: 37px;
        position: relative;
        margin-right: 13px;
        border-radius: 50%;
        overflow: hidden;
        background-color: #083357;
    }

    aside#chat .user-username {
        width: 75px;
        height: 20px;
        position: relative;
        border-radius: 5px;
        overflow: hidden;
        background-color: #083357;
    }

    aside#chat .placeholder-text {
        width: 100%;
        height: 19px;
        position: relative;
        margin-top: 8px;
        border-radius: 5px;
        overflow: hidden;
        background-color: #083357;
    }

    aside#chat .user-avatar::after,
    aside#chat .user-username::after,
    aside#chat .placeholder-text::after {
        width: 100%;
        height: 100%;
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        animation-name: loading_animation;
        animation-duration: 1s;
        animation-timing-function: ease;
        animation-iteration-count: infinite;
        background: linear-gradient(to right, #ffffff00 0%, rgba(255, 255, 255, 0.1) 50%, #ffffff00 100%);
    }

    aside#chat .messages-list {
        width: 100%;
        height: 100%;
    }

    aside#chat .messages-list.fade-enter-active {
        transition: opacity 0.1s;
    }

    aside#chat .messages-list.fade-enter-from {
        opacity: 0;
    }

    aside#chat .chat-footer {
        width: 100%;
        height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 20px 15px 0 15px;
    }

    aside#chat .footer-input {
        width: 100%;
        height: 62px;
        position: relative;
        padding: 1px;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    aside#chat .footer-input::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #010a11 0%, #112c44 100%);
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    aside#chat .footer-input input {
        width: 100%;
        height: 100%;
        padding: 0 68px 0 15px;
        font-weight: 600;
        font-size: 12px;
        color: #ffffff;
        background-color: #041828;
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    aside#chat .footer-input input::placeholder {
        color: #5e768e;
    }

    aside#chat .footer-input button.button-send {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 50%;
        right: 20px;
        transform: translate(0, -50%);
    }

    aside#chat .footer-actions {
        display: flex;
        align-items: center;
    }

    aside#chat .footer-actions button.button-rules {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 800;
    }

    aside#chat .footer-actions button.button-rules {
        margin-right: 15px;
        color: #327eba;
    }

    aside#chat .footer-actions button.button-rules svg {
        margin-right: 7px;
    }

    @keyframes loading_animation {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(100%); }
    }

    @media only screen and (max-width: 1500px) {

        aside#chat {
            transform: translate(100%, 0);
            z-index: 100;
        }

        aside#chat.chat-open {
            transform: translate(0, 0);
        }

        aside#chat .chat-toggle {
            display: block;
        }

        aside#chat.chat-open .chat-toggle {
            display: none;
        }

        aside#chat .chat-header button.button-close {
            display: block;
        }

    }

    @media only screen and (max-width: 1175px) {

        aside#chat .chat-toggle {
            display: none;
        }

    }

    @media only screen and (max-width: 500px) {

        aside#chat {
            width: 100%;
        }

    }
</style>