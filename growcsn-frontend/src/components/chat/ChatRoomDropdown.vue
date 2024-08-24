<template>
    <div class="chat-room-dropdown" v-bind:class="{ 'dropdown-open': dropdownOpen === true }">
        <button v-on:click="chatToggleDropdown" class="button-toggle">
            <div class="button-inner">
                <img v-bind:src="require('@/assets/img/rooms/' + chatRoom + '.svg')" alt="room-icon" />
                {{chatGetRoomName}}
                <span class="button-online">({{chatOnline[chatRoom]}})</span>
                <IconDropdown />
            </div>
        </button>
        <div class="dropdown-menu">
            <div class="menu-inner">
                <button v-on:click="chatRoomButton('en')" class="button-room">
                    <img src="@/assets/img/rooms/en.svg" alt="room-icon" />
                    ENGLISH
                    <span class="button-online">({{chatOnline.en}})</span>
                </button>
                <button v-on:click="chatRoomButton('tr')" class="button-room">
                    <img src="@/assets/img/rooms/tr.svg" alt="room-icon" />
                    TURKISH
                    <span class="button-online">({{chatOnline.tr}})</span>
                </button>
                <button v-on:click="chatRoomButton('de')" class="button-room">
                    <img src="@/assets/img/rooms/de.svg" alt="room-icon" />
                    GERMAN
                    <span class="button-online">({{chatOnline.de}})</span>
                </button>
                <button v-on:click="chatRoomButton('es')" class="button-room">
                    <img src="@/assets/img/rooms/es.svg" alt="room-icon" />
                    SPANISH
                    <span class="button-online">({{chatOnline.es}})</span>
                </button>
                <button v-on:click="chatRoomButton('beg')" class="button-room">
                    <img src="@/assets/img/rooms/beg.svg" alt="room-icon" />
                    BEGGING
                    <span class="button-online">({{chatOnline.beg}})</span>
                </button>
                <button v-on:click="chatRoomButton('whale')" class="button-room">
                    <img src="@/assets/img/rooms/whale.svg" alt="room-icon" />
                    WHALE LOUNGE
                    <span class="button-online">({{chatOnline.whale}})</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconDropdown from '@/components/icons/IconDropdown';

    export default {
        name: 'ChatRoomDropdown',
        components: {
            IconDropdown
        },
        data() {
            return {
                dropdownOpen: false
            }
        },
        methods: {
            ...mapActions(['chatSetRoom']),
            chatToggleDropdown() {
                this.dropdownOpen = !this.dropdownOpen;
            },
            chatRoomButton(room) {
                this.chatSetRoom(room);
                this.chatToggleDropdown();
            }
        },
        computed: {
            ...mapGetters(['chatRoom', 'chatOnline']),
            chatGetRoomName() {
                let name = 'ENGLISH';

                if(this.chatRoom === 'tr') {
                    name = 'TURKISH';
                } else if(this.chatRoom === 'de') {
                    name = 'GERMAN';
                } else if(this.chatRoom === 'es') {
                    name = 'SPANISH';
                } else if(this.chatRoom === 'beg') {
                    name = 'BEGGING';
                } else if(this.chatRoom === 'whale') {
                    name = 'WHALE LOUNGE';
                }

                return name;
            }
        },
        created() {
            let self = this;
            document.addEventListener('click', function(event) {
                if(!self.$el.contains(event.target) && self.dropdownOpen == true) {
                    self.chatToggleDropdown();
                }
            });
        }
    }
</script>

<style scoped>
    .chat-room-dropdown {
        width: 100%;
        position: relative;
        margin-top: 18px;
        z-index: 11;
    }

    .chat-room-dropdown button.button-toggle {
        width: 100%;
        height: 53px;
        position: relative;
        padding: 1px;
        filter: drop-shadow(0px 4px 25px rgba(30, 63, 90, 0.35));
    }

    .chat-room-dropdown button.button-toggle::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(4, 19, 31, 0) 0%, #327eba 100%);
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .chat-room-dropdown button.button-toggle .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        color: #a6cae8;
        background-color: #052138;
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
        transition: all .2s;
    }

    .chat-room-dropdown button.button-toggle .button-inner:hover {
        background-color: #082a46;
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .chat-room-dropdown button.button-toggle img {
        margin-right: 12px;
    }

    .chat-room-dropdown button.button-toggle svg {
        margin-left: 8px;
        fill: #a6cae8;
        transition: all 0.3s ease;
    }

    .chat-room-dropdown.dropdown-open button.button-toggle svg {
       transform: rotate(180deg);
    }

    .chat-room-dropdown button.button-toggle span.button-online {
        margin-left: 5px;
        font-weight: 600;
        color: #6a88a1;
    }
    .button-toggle:hover .chat-room-dropdown button.button-toggle span.button-online { 
        color: #6a88a1 !important;
    }

    .chat-room-dropdown .dropdown-menu {
        height: 0;
        position: absolute;
        top: 37px;
        left: -15px;
        right: -15px;
        padding: 0 15px;
        transition: height 0.2s ease;
        overflow: hidden;
        z-index: -1;
    }

    .chat-room-dropdown.dropdown-open .dropdown-menu {
       height: 361px;
       padding: 0 15px 25px 15px;
    }

    .chat-room-dropdown .menu-inner {
        width: 100%;
        padding-top: 16px;
        border-radius: 0px 0px 10px 10px;
        background-color: #052138;
        border: 1px solid #143c5d;
        box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.3);
    }

    .chat-room-dropdown button.button-room {
        width: 100%;
        height: 53px;
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
        border-bottom: 1px solid #18486d;
    }

   .chat-room-dropdown button.button-room:last-of-type {
       border-bottom: none;
   }

   .chat-room-dropdown button.button-room img {
       margin: 0 12px 0 70px;
   }

    .chat-room-dropdown button.button-room span.button-online {
       margin-left: 5px;
       font-weight: 600;
       color: #6a88a1;
   }
</style>
