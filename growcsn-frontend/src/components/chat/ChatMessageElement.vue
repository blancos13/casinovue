<template>
    <div class="chat-message-element" v-bind:class="{
        'element-rain': message.type === 'rainTip' || message.type === 'rainCompleted',
        'element-system': message.type === 'system'
    }">
        <div v-if="message.type === 'rainTip' || message.type === 'rainCompleted'" class="element-rain">
            <div class="rain-header">
                <IconRainGradient />
                <span class="text-green-gradient">{{ message.type === 'rainTip' ? 'RAIN TIP' : 'RAIN COMPLETED!' }}</span>
            </div>
            <div class="rain-content">
                <div v-if="message.type === 'rainTip'" class="content-tip">
                    <span v-html="message.transaction.user.username" class="content-username"></span>
                    tipped
                    <div class="tip-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <span>{{chatFormatValue(Math.abs(message.transaction.amount)).split('.')[0]}}</span>.{{chatFormatValue(Math.abs(message.transaction.amount)).split('.')[1]}}
                    </div>
                </div>
                <div v-else class="content-completed">
                    <span class="content-participants">{{message.rain.participants.length}}</span> participants have been awarded
                    <div class="completed-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <span>{{chatFormatValue(Math.abs(message.rain.amount)).split('.')[0]}}</span>.{{chatFormatValue(Math.abs(message.rain.amount)).split('.')[1]}}
                    </div>
                    in total from the rain.
                </div>
            </div>
        </div>
        <div v-else-if="message.type === 'system'" class="element-system">
            <div class="system-header">
                <IconSystem />
                <span class="text-orange-gradient">SYSTEM MESSAGE</span>
            </div>
            <div v-html="message.message" class="system-content"></div>
        </div>
        <div v-else class="element-message" v-bind:class="[
            'message-' + chatGetLevelColor,
            'message-' + chatGetRank
        ]">
            <div class="element-top">
                <button v-on:click="chatUserButton()" class="button-user">
                    <AvatarImage v-bind:image="message.user.avatar" />
                    <span class="user-username">{{message.user.username}}</span>
                    <BoxLevel v-if="['admin', 'mod', 'partner'].includes(message.user.rank) === false" v-bind:level="message.user.level" v-bind:color="chatGetLevelColor" />
                    <BoxRank v-if="chatGetRank !== null" v-bind:rank="chatGetRank" />
                </button>
                <div v-if="authUser.user !== null && (authUser.user.rank === 'admin' || authUser.user.rank === 'mod')" class="top-admin">
                    <button v-on:click="chatMuteButton()" class="button-mute">
                        <div class="button-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                                <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                            </svg>
                        </div>
                    </button>
                    <button v-on:click="chatRemoveButton()" class="button-remove">
                        <div class="button-inner">
                            <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.2977 9C0.216509 9 0.144339 8.97429 0.0811908 8.92286C0.0270636 8.86286 0 8.79429 0 8.71714C0 8.66571 0.0135318 8.61857 0.0405954 8.57572L2.88227 4.39714L0.324763 0.424286C0.2977 0.372857 0.284168 0.325714 0.284168 0.282857C0.284168 0.205714 0.311231 0.141429 0.365359 0.0900004C0.428507 0.0300001 0.500677 0 0.581867 0H3.51827C3.77086 0 3.96031 0.107143 4.0866 0.321429L5.03383 1.89L6.06225 0.321429C6.18854 0.107143 6.37799 0 6.63058 0H9.43166C9.51286 0 9.58051 0.0300001 9.63464 0.0900004C9.69779 0.141429 9.72936 0.205714 9.72936 0.282857C9.72936 0.334286 9.71583 0.381428 9.68877 0.424286L7.07713 4.35857L9.95941 8.57572C9.98647 8.61857 10 8.66571 10 8.71714C10 8.79429 9.96843 8.86286 9.90528 8.92286C9.85115 8.97429 9.78349 9 9.7023 9H6.65765C6.41407 9 6.22914 8.90143 6.10284 8.70429L4.92558 6.98143L3.80244 8.70429C3.67614 8.90143 3.4912 9 3.24763 9H0.2977Z" />
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
            <div v-if="chatGetGameLink === null" v-html="message.message" class="element-text"></div>
            <button v-else v-on:click="chatLinkButton()" class="button-game">
                <div class="button-inner">
                    <svg v-if="chatGetGameLink.includes('duels')" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.88875 6.73564L5.10999 9.02443L4.22187 9.9397L5.11125 10.8556L4.2225 11.7709L2.66688 10.1688L0.888749 12L0 11.0847L1.77813 9.25293L0.222502 7.65155L1.11125 6.73629L2 7.6509L2.88812 6.73564H2.88875ZM0.34318 0L2.57197 0.00194187L9.99937 7.65155L10.8887 6.73629L11.7775 7.65155L10.2225 9.25357L12 11.0847L11.1113 12L9.33312 10.1688L7.7775 11.7709L6.88875 10.8556L7.7775 9.9397L0.345066 2.28556L0.34318 0ZM9.42992 0L11.6568 0.00194187L11.6581 2.28232L9.11062 4.90512L6.88812 2.61697L9.42992 0Z" fill="url(#paint0_linear_3734_2952)"/>
                        <defs>
                        <linearGradient id="paint0_linear_3734_2952" x1="12" y1="0" x2="-2.09436" y2="3.45416" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#00FFC2"/>
                        <stop offset="1" stop-color="#00AA6D"/>
                        </linearGradient>
                        </defs>
                    </svg>
                    <svg v-else width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.04221 13.0746L1.80154 10.4543C1.64642 10.3767 1.54845 10.2182 1.54845 10.0448V7.68898L4.03654 8.93304C4.48764 9.15859 5.0186 9.15859 5.46971 8.93304L5.5057 8.91504L7.04218 7.9698L7.04221 13.0746ZM7.95782 13.0746V7.96977L9.49429 8.91501L9.53029 8.93301C9.9814 9.15856 10.5124 9.15856 10.9635 8.93301L13.4515 7.68895V10.0448C13.4515 10.2182 13.3536 10.3767 13.1985 10.4543L7.95782 13.0746ZM1.4404 3.86436L0.379758 3.33406C0.040542 3.16445 -0.0969626 2.75197 0.0726454 2.41275C0.139096 2.27985 0.246857 2.17209 0.379758 2.10564L4.44601 0.07253C4.63934 -0.0241359 4.8669 -0.0241359 5.0602 0.07253L7.10347 1.09416C6.95856 1.12629 6.8166 1.17628 6.68101 1.24409L1.4404 3.86436ZM7.8965 1.09413L9.93977 0.0724994C10.1331 -0.0241665 10.3607 -0.0241665 10.554 0.0724994L14.6202 2.10561C14.7531 2.17206 14.8609 2.27982 14.9273 2.41272C15.0969 2.75194 14.9595 3.16442 14.6202 3.33403L13.5596 3.86433L8.31893 1.244C8.18334 1.17625 8.04142 1.12627 7.8965 1.09413ZM5.06026 8.11403C4.86693 8.2107 4.63937 8.2107 4.44607 8.11403L0.379787 6.08092C0.246886 6.01447 0.139125 5.90671 0.0726742 5.77381C-0.0969337 5.4346 0.0405413 5.02211 0.379787 4.85248L1.44043 4.32217L6.83749 7.0207L5.06026 8.11403ZM14.6202 4.85248C14.9595 5.02208 15.097 5.43457 14.9274 5.77381C14.8609 5.90671 14.7531 6.01447 14.6202 6.08092L10.554 8.11403C10.3607 8.2107 10.1331 8.2107 9.93979 8.11403L8.16257 7.0207L13.5596 4.32217L14.6202 4.85248ZM11.97 4.09328L7.50001 6.32828L3.02998 4.09328L7.09054 2.063C7.34832 1.93411 7.65171 1.93411 7.90952 2.063L11.97 4.09328Z" fill="black"/>
                        <path d="M7.04221 13.0746L1.80154 10.4543C1.64642 10.3767 1.54845 10.2182 1.54845 10.0448V7.68898L4.03654 8.93304C4.48764 9.15859 5.0186 9.15859 5.46971 8.93304L5.5057 8.91504L7.04218 7.9698L7.04221 13.0746ZM7.95782 13.0746V7.96977L9.49429 8.91501L9.53029 8.93301C9.9814 9.15856 10.5124 9.15856 10.9635 8.93301L13.4515 7.68895V10.0448C13.4515 10.2182 13.3536 10.3767 13.1985 10.4543L7.95782 13.0746ZM1.4404 3.86436L0.379758 3.33406C0.040542 3.16445 -0.0969626 2.75197 0.0726454 2.41275C0.139096 2.27985 0.246857 2.17209 0.379758 2.10564L4.44601 0.07253C4.63934 -0.0241359 4.8669 -0.0241359 5.0602 0.07253L7.10347 1.09416C6.95856 1.12629 6.8166 1.17628 6.68101 1.24409L1.4404 3.86436ZM7.8965 1.09413L9.93977 0.0724994C10.1331 -0.0241665 10.3607 -0.0241665 10.554 0.0724994L14.6202 2.10561C14.7531 2.17206 14.8609 2.27982 14.9273 2.41272C15.0969 2.75194 14.9595 3.16442 14.6202 3.33403L13.5596 3.86433L8.31893 1.244C8.18334 1.17625 8.04142 1.12627 7.8965 1.09413ZM5.06026 8.11403C4.86693 8.2107 4.63937 8.2107 4.44607 8.11403L0.379787 6.08092C0.246886 6.01447 0.139125 5.90671 0.0726742 5.77381C-0.0969337 5.4346 0.0405413 5.02211 0.379787 4.85248L1.44043 4.32217L6.83749 7.0207L5.06026 8.11403ZM14.6202 4.85248C14.9595 5.02208 15.097 5.43457 14.9274 5.77381C14.8609 5.90671 14.7531 6.01447 14.6202 6.08092L10.554 8.11403C10.3607 8.2107 10.1331 8.2107 9.93979 8.11403L8.16257 7.0207L13.5596 4.32217L14.6202 4.85248ZM11.97 4.09328L7.50001 6.32828L3.02998 4.09328L7.09054 2.063C7.34832 1.93411 7.65171 1.93411 7.90952 2.063L11.97 4.09328Z" fill="url(#paint0_linear_3734_2977)"/>
                        <path d="M7.04221 13.0746L1.80154 10.4543C1.64642 10.3767 1.54845 10.2182 1.54845 10.0448V7.68898L4.03654 8.93304C4.48764 9.15859 5.0186 9.15859 5.46971 8.93304L5.5057 8.91504L7.04218 7.9698L7.04221 13.0746ZM7.95782 13.0746V7.96977L9.49429 8.91501L9.53029 8.93301C9.9814 9.15856 10.5124 9.15856 10.9635 8.93301L13.4515 7.68895V10.0448C13.4515 10.2182 13.3536 10.3767 13.1985 10.4543L7.95782 13.0746ZM1.4404 3.86436L0.379758 3.33406C0.040542 3.16445 -0.0969626 2.75197 0.0726454 2.41275C0.139096 2.27985 0.246857 2.17209 0.379758 2.10564L4.44601 0.07253C4.63934 -0.0241359 4.8669 -0.0241359 5.0602 0.07253L7.10347 1.09416C6.95856 1.12629 6.8166 1.17628 6.68101 1.24409L1.4404 3.86436ZM7.8965 1.09413L9.93977 0.0724994C10.1331 -0.0241665 10.3607 -0.0241665 10.554 0.0724994L14.6202 2.10561C14.7531 2.17206 14.8609 2.27982 14.9273 2.41272C15.0969 2.75194 14.9595 3.16442 14.6202 3.33403L13.5596 3.86433L8.31893 1.244C8.18334 1.17625 8.04142 1.12627 7.8965 1.09413ZM5.06026 8.11403C4.86693 8.2107 4.63937 8.2107 4.44607 8.11403L0.379787 6.08092C0.246886 6.01447 0.139125 5.90671 0.0726742 5.77381C-0.0969337 5.4346 0.0405413 5.02211 0.379787 4.85248L1.44043 4.32217L6.83749 7.0207L5.06026 8.11403ZM14.6202 4.85248C14.9595 5.02208 15.097 5.43457 14.9274 5.77381C14.8609 5.90671 14.7531 6.01447 14.6202 6.08092L10.554 8.11403C10.3607 8.2107 10.1331 8.2107 9.93979 8.11403L8.16257 7.0207L13.5596 4.32217L14.6202 4.85248ZM11.97 4.09328L7.50001 6.32828L3.02998 4.09328L7.09054 2.063C7.34832 1.93411 7.65171 1.93411 7.90952 2.063L11.97 4.09328Z" fill="url(#paint1_linear_3734_2977)"/>
                        <defs>
                        <linearGradient id="paint0_linear_3734_2977" x1="15" y1="-0.915223" x2="-1.7964" y2="4.48546" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#3B7EB7"/>
                        <stop offset="1" stop-color="#145081"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_3734_2977" x1="15" y1="0" x2="-2.30787" y2="4.86635" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#00FFC2"/>
                        <stop offset="1" stop-color="#00AA6D"/>
                        </linearGradient>
                        </defs>
                    </svg>
                    {{ chatGetGameLink.includes('duels') ? 'DICE DUEL' : 'CASE BATTLE' }}
                </div>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconRainGradient from '@/components/icons/IconRainGradient';
    import IconSystem from '@/components/icons/IconSystem';
    import AvatarImage from '@/components/AvatarImage';
    import BoxLevel from '@/components/BoxLevel';
    import BoxRank from '@/components/BoxRank';

    export default {
        name: 'ChatMessageElement',
        components: {
            IconRainGradient,
            IconSystem,
            AvatarImage,
            BoxLevel,
            BoxRank
        },
        props: [
            'message'
        ],
        methods: {
            ...mapActions([
                'modalsSetShow', 
                'modalsSetData',
                'generalSetSidebarMobile',
                'generalSetUserInfoData'
            ]),
            chatFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            chatUserButton() {
                if(this.authUser.user === null || this.message.user.rank === 'system') { return; }

                this.generalSetUserInfoData(this.message.user);
                this.modalsSetShow('ChatUser');
            },
            chatMuteButton() {
                this.generalSetUserInfoData(this.message.user);
                this.modalsSetShow('Mute');
            },
            chatRemoveButton() {
                this.modalsSetData({ user: this.message.user, message: this.message });
                this.modalsSetShow('Remove');
            },
            async chatLinkButton() {
                this.generalSetSidebarMobile(null);
                if(this.chatGetGameLink !== this.$route.fullPath) { this.$router.replace(this.chatGetGameLink); }
            }
        },
        computed: {
            ...mapGetters([
                'authUser'
            ]),
            chatGetLevelColor() {
                let color = '';

                if(this.message.user.level >= 2 && this.message.user.level < 26) { color = 'blue'; }
                else if(this.message.user.level >= 26 && this.message.user.level < 51) { color = 'green'; }
                else if(this.message.user.level >= 51 && this.message.user.level < 76) { color = 'orange'; }
                else if(this.message.user.level >= 76 && this.message.user.level < 100) { color = 'red'; }
                else if(this.message.user.level >= 100) { color = 'purple'; }

                return color;
            },
            chatGetRank() {
                let rank = this.message.user.rakeback;

                if(this.message.user.rank !== 'user') { rank = this.message.user.rank; }

                return rank;
            },
            chatGetGameLink() {
                let link = null;

                if(
                    this.message.message.replace(/&#x2F;/g, '/').match(/(growcsn\.com\/battles\/[0-9a-fA-F]{24})/) !== null ||
                    this.message.message.replace(/&#x2F;/g, '/').match(/(growcsn\.com\/duels\?game=[0-9a-fA-F]{24})$/) !== null
                ) {
                    link = this.message.message.replace(/&#x2F;/g, '/').replace(/.*growcsn\.com/, '');
                }

                return link;
            }
        }
    }
</script>

<style scoped>
    .chat-message-element {
        width: 100%;
        position: relative;
        padding: 15px;
        z-index: 0;
    }

    .chat-message-element.element-rain {
        padding: 15px 15px 15px 14px;
        background: linear-gradient(100deg, rgba(0, 255, 194, 0.1) 5%, rgba(0, 255, 194, 0.07) 30%, rgba(0, 255, 194, 0.06) 50%, rgba(0, 0, 0, 0) 80%), rgba(3, 16, 27, 0.32);
        border-left: 1px solid #01f3b9;
    }

    .chat-message-element.element-system {
        padding: 15px 15px 15px 14px;
        background: linear-gradient(100deg, rgba(219, 125, 72, 0.1) 5%, rgba(162, 92, 53, 0.07) 30%, rgba(134, 77, 44, 0.06) 50%, rgba(0, 0, 0, 0) 82%), rgba(3, 16, 27, 0.32);
        border-left: 1px solid #db7d48;
    }

    .chat-message-element::after {
        content: '';
        width: calc(100% - 30px);
        height: 1px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        background: #0e3350;
    }

    .chat-message-element.element-rain::before,
    .chat-message-element.element-system::before {
        content: '';
        width: 100%;
        height: 2px;
        position: absolute;
        top: -1px;
        left: 50%;
        transform: translate(-50%, 0);
        background: linear-gradient(180deg, #010a11 0%, #112c44 100% );
    }

    .chat-message-element.element-rain::after,
    .chat-message-element.element-system::after {
        content: '';
        width: 100%;
        height: 2px;
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translate(-50%, 0);
        background: linear-gradient(180deg, #010a11 0%, #112c44 100% );
    }

    .chat-message-element:first-of-type {
        margin-top: 0;
    }

    .chat-message-element .element-rain,
    .chat-message-element .element-system,
    .chat-message-element .element-message {
        width: 100%;
    }

    .chat-message-element .rain-header,
    .chat-message-element .system-header {
        display: flex;
        align-items: center;
        font-size: 15px;
        font-weight: 800;
    }

    .chat-message-element .rain-header svg,
    .chat-message-element .system-header svg {
        width: 27px;
        margin-right: 12px;
    }

    .chat-message-element .rain-content,
    .chat-message-element .system-content {
        width: 100%;
        margin-top: 8px;
    }

    .chat-message-element .system-content {
        font-size: 14px;
        font-weight: 400;
        color: #c99c83;
    }

    .chat-message-element .content-tip,
    .chat-message-element .content-completed {
        display: inline-block;
        font-size: 14px;
        font-weight: 600;
        color: #79afa1;
    }

    .chat-message-element .rain-content span.content-username,
    .chat-message-element .rain-content span.content-participants {
        font-weight: 700;
        color: #ffffff;
    }

    .chat-message-element .tip-amount,
    .chat-message-element .completed-amount {
        height: 18px;
        position: relative;
        display: inline-block;
        padding-left: 21px;
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .chat-message-element .tip-amount img,
    .chat-message-element .completed-amount img {
        width: 16px;
        height: 16px;
        position: absolute;
        top: 1.5px;
        left: 1px;
    }

    .chat-message-element .tip-amount span,
    .chat-message-element .completed-amount span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .chat-message-element .element-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .chat-message-element button.button-user {
        display: flex;
        align-items: center;
    }

    .chat-message-element button.button-user .avatar-image {
        width: 37px !important;
        height: 37px !important;
        margin-right: 13px;
        border-radius: 50%;
        border: 2px solid #9e9e9e;
    }

    .chat-message-element .element-message.message-blue button.button-user .avatar-image {
        border: 2px solid #559ee4;
    }

    .chat-message-element .element-message.message-green button.button-user .avatar-image {
        border: 2px solid #b8e92d;
    }

    .chat-message-element .element-message.message-orange button.button-user .avatar-image {
        border: 2px solid #fca311;
    }

    .chat-message-element .element-message.message-red button.button-user .avatar-image {
        border: 2px solid #ff4e4e;
    }

    .chat-message-element .element-message.message-purple button.button-user .avatar-image {
        border: 2px solid #6953f1;
    }

    .chat-message-element .element-message.message-partner button.button-user .avatar-image {
        border: 2px solid #eca822;
    }

    .chat-message-element .element-message.message-mod button.button-user .avatar-image {
        border: 2px solid #ffb703;
    }

    .chat-message-element .element-message.message-admin button.button-user .avatar-image {
        border: 2px solid #00ffc2;
    }

    .chat-message-element button.button-user span.user-username {
        max-width: 120px;
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .chat-message-element .element-message.message-bronze button.button-user span.user-username,
    .chat-message-element .element-message.message-silver button.button-user span.user-username,
    .chat-message-element .element-message.message-gold button.button-user span.user-username,
    .chat-message-element .element-message.message-platinum button.button-user span.user-username,
    .chat-message-element .element-message.message-titanium button.button-user span.user-username {
        max-width: 85px;
    }

    .chat-message-element .element-message.message-partner button.button-user span.user-username {
        background: linear-gradient(255deg, #d89c43 0%, #d6b233 100%), #ffffff;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .chat-message-element .element-message.message-admin button.button-user span.user-username {
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%), #a6cae8;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .chat-message-element .top-admin {
        display: flex;
        align-items: center;
        margin-left: 5px;
    }

    .chat-message-element .top-admin button.button-mute,
    .chat-message-element .top-admin button.button-remove {
        width: 28px;
        height: 28px;
        position: relative;
    }

    .chat-message-element .top-admin button.button-remove {
        margin-left: 5px;
    }

    .chat-message-element .top-admin button.button-mute .button-inner,
    .chat-message-element .top-admin button.button-remove .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .chat-message-element .top-admin button.button-mute .button-inner {
        background: #fca311;
    }

    .chat-message-element .top-admin button.button-remove .button-inner {
        background: #f55046;
    }

    .chat-message-element .top-admin button.button-mute .button-inner svg,
    .chat-message-element .top-admin button.button-remove .button-inner svg {
        width: 10px;
        fill: #ffffff;
    }

    .chat-message-element .element-text {
        width: 100%;
        margin-top: 8px;
        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;
        text-align: left;
        font-size: 14px;
        font-weight: 400;
        color: #bbbfd0;
    }

    .chat-message-element .element-message.message-partner .element-text {
        color: #d6b233;
    }

    .chat-message-element .element-message.message-admin .element-text {
        color: #01f3b9;
    }

    .chat-message-element button.button-game {
        height: 34px;
        margin-top: 8px;
        padding: 1px;
        background: #01ad6f;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .chat-message-element button.button-game .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 14px;
        font-size: 13px;
        font-weight: 800;
        color: #01f3b9;
        background: #042f3b;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .chat-message-element button.button-game .button-inner svg {
        margin-right: 6px;
    }
</style>
