<template>
    <aside id="chat" v-bind:class="{ 
        'chat-open': generalSidebarMobile === 'Chat',
        'chat-rain': generalRain.active !== null
    }">
        <div class="chat-toggle">
            <button v-on:click="generalSetSidebarMobile('Chat')">
                <div class="button-inner">
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.75 0H2.25C1.00736 0 0 1.00736 0 2.25V14.25C0 15.4926 1.00736 16.5 2.25 16.5H4.91251L4.50452 20.1675C4.45904 20.5792 4.75593 20.9498 5.16766 20.9953C5.38027 21.0188 5.59278 20.9503 5.75178 20.8073L10.5383 16.5H18.75C19.9926 16.5 21 15.4926 21 14.25V2.25C21 1.00736 19.9926 0 18.75 0Z" />
                    </svg>
                </div>
            </button>
        </div>
        <div class="chat-header">
            <button v-on:click="generalSetSidebarMobile(null)" class="button-close">
                <IconClose />
            </button>
            <div class="header-online">
                <IconUsers />
                <span class="gradient-green">{{chatGetOnline}}</span>
            </div>
            <ChatRoomDropdown />
            <RainTipDropdown />
        </div>
        <div class="chat-content">
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
            <div class="content-lock">
            
            </div>
            <div class="content-rain">
                <transition name="fade-slide" mode="out-in">
                    <RainJoin v-if="generalRain.active !== null" />
                </transition>
            </div>
        </div>
        <div class="chat-footer">
            <div class="footer-input">
                <input v-model="chatMessage" v-on:keyup.enter="chatMessageButton" type="text" placeholder="TYPE A MESSAGE..." />
                <button v-on:click="chatMessageButton()" class="button-send" v-bind:disabled="socketSendLoading !== null">
                    <IconMessage />
                </button>
            </div>
            <div class="footer-actions">
                <button v-on:click="modalsSetShow('ChatRules')" class="button-rules">
                    <IconRules />
                    CHAT RULES
                </button>
                <ChatEmojisDropdown />
            </div>
        </div>
    </aside>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconChatGradient from '@/components/icons/IconChatGradient';
    import IconClose from '@/components/icons/IconClose';
    import IconUsers from '@/components/icons/IconUsers';
    import IconMessage from '@/components/icons/IconMessage';
    import IconRules from '@/components/icons/IconRules';
    import ChatRoomDropdown from '@/components/chat/ChatRoomDropdown';
    import ChatMessageElement from '@/components/chat/ChatMessageElement';
    import ChatEmojisDropdown from '@/components/chat/ChatEmojisDropdown';
    import RainTipDropdown from '@/components/rain/RainTipDropdown';
    import RainJoin from '@/components/rain/RainJoin';

    export default {
        name: 'Chat',
        components: {
            IconChatGradient,
            IconClose,
            IconUsers,
            IconMessage,
            IconRules,
            ChatRoomDropdown,
            ChatMessageElement,
            ChatEmojisDropdown,
            RainTipDropdown,
            RainJoin
        },
        data() {
            return {
                chatMessage: ''
            }
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
            chatAddEmoji(emoji) {
                this.chatMessage = this.chatMessage + emoji;
            },
            chatHandleScroll() {
                let container = this.$refs.chatMessages;
                this.chatSetScroll((container.scrollHeight - (container.scrollTop + container.clientHeight)) < 100);
            },
            chatHandleCommand(command) {
                this.generalSetUserInfoData(null);
                const args = command.split(' ');

                if(args[0] === '/tip' || (['/mute', '/ban'].includes(args[0]) === true && ['admin', 'mod'].includes(this.authUser.user.rank) === true)) {
                    if(args[1] === undefined || args[1].trim() === '' || args[1].match(/^[0-9a-fA-F]{24}$/) === null) {
                        this.notificationShow({ type: 'error', message: 'You need to provide a valid user id.' });
                        return;
                    }

                    const data = { userId: args[1] };
                    this.generalGetUserInfoSocket(data);

                    if(args[0] === '/tip') { this.modalsSetShow('Tip'); } 
                    else if(args[0] === '/mute') { this.modalsSetShow('Mute'); } 
                    else if(args[0] === '/ban') { this.modalsSetShow('Ban'); }
                } else if(args[0] === '/rain') {
                    const data = { amount: Math.floor(args[1] * 1000) };
                    this.generalSendRainCreateSocket(data);
                } else if(args[0] === '/clear') {
                    const data = {};
                    this.chatSendClearSocket(data);
                } else if(args[0] === '/lock') {
                    const data = { value: false };
                    this.chatSendLockSocket(data);
                } else if(args[0] === '/unlock') {
                    const data = { value: true };
                    this.chatSendLockSocket(data);
                }  
            },
            chatMessageButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                if(this.generalSettings.chat.enabled === false && this.authUser.user.rank !== 'admin') {
                    this.notificationShow({ type: 'error', message: 'You can not send a chat message because the action is not available at the moment.' });
                    return;
                }

                if(this.generalSettings.chat.mode === 'normal' && this.authUser.user.rank !== 'admin' && (new Date().getTime() - this.chatLastMessage) < 3000) {
                    this.notificationShow({ type: 'error', message: 'You can only send 1 message every 3 seconds.' });
                    return;
                }

                if(this.generalSettings.chat.mode === 'slow' && this.authUser.user.rank !== 'admin' && (new Date().getTime() - this.chatLastMessage) < 6000) {
                    this.notificationShow({ type: 'error', message: 'You can only send 1 message every 6 seconds because the chat is in slow mode.' });
                    return;
                }

                const message = this.chatMessage.trim();

                if(message === '') {
                    this.notificationShow({ type: 'error', message: 'Please enter a message.' });
                    return;
                }

                if(['/tip', '/rain'].includes(message.split(' ')[0]) === true) {
                    this.chatHandleCommand(message);
                } else if(
                    ['mod', 'admin'].includes(this.authUser.user.rank) === true && 
                    ['/clear', '/lock', '/unlock', '/mute', '/ban'].includes(message.split(' ')[0]) === true
                ) {
                    this.chatHandleCommand(message);
                } else {
                    const data = { message: message };
                    this.chatSendMessageSocket(data);
                }

                this.chatMessage = '';
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading', 
                'generalSidebarMobile', 
                'generalSettings', 
                'authUser',
                'chatScroll', 
                'chatRoom', 
                'chatOnline', 
                'chatMessages', 
                'chatLastMessage', 
                'generalRain'
            ]),
            chatGetOnline() {
                let online = 0;

                for(const [key, value] of Object.entries(this.chatOnline)) {
                    online = online + value;
                }

                return online;
            }
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
                        setTimeout(() => { this.chatScrollToBottom(); }, 200);
                    }
                },
                deep: true
            },
            'generalRain.active': {
                handler(state, oldState) {
                    setTimeout(() => { this.chatScrollToBottom(); }, 125);
                },
                deep: true
            },
            'generalSidebarMobile': {
                handler(state, oldState) {
                    if(this.generalSidebarMobile === 'Chat') { this.chatScrollToBottom(); }
                }
            }
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

    aside#chat .chat-header button.button-close svg {
        fill: #6e95b6;
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
