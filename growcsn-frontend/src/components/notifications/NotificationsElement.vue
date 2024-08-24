<template>
    <div class="notifications-element" v-bind:class="'element-' + notification.type">
        <button v-on:click="sendNotificationRemove" class="button-close">
            <IconClose />
        </button>
        <div class="element-timer">
            <div class="timer-progress" v-bind:style="{ height: timerHeight + '%'}"></div>
        </div>
        <div class="element-content">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.8 0.733398H2.2C0.987067 0.733398 0 1.72047 0 2.9334V14.6667C0 15.8797 0.987067 16.8667 2.2 16.8667H4.4V20.5334C4.4 20.8157 4.56207 21.0717 4.81507 21.1941C4.917 21.2425 5.02553 21.2667 5.13333 21.2667C5.29687 21.2667 5.45893 21.2125 5.59167 21.1061L10.8907 16.8667H19.8C21.0129 16.8667 22 15.8797 22 14.6667V2.9334C22 1.72047 21.0129 0.733398 19.8 0.733398ZM11 11.0001H5.13333C4.7278 11.0001 4.4 10.6715 4.4 10.2667C4.4 9.86193 4.7278 9.5334 5.13333 9.5334H11C11.4055 9.5334 11.7333 9.86193 11.7333 10.2667C11.7333 10.6715 11.4055 11.0001 11 11.0001ZM16.8667 8.06673H5.13333C4.7278 8.06673 4.4 7.7382 4.4 7.3334C4.4 6.9286 4.7278 6.60006 5.13333 6.60006H16.8667C17.2722 6.60006 17.6 6.9286 17.6 7.3334C17.6 7.7382 17.2722 8.06673 16.8667 8.06673Z" />
            </svg>
        	{{notification.message}}
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import IconClose from '@/components/icons/IconClose';

    export default {
        name: 'NotificationsElement',
        components: {
            IconClose
        },
        props: ['notification'],
        data() {
            return {
                timer: 5000,
                notificationInterval: null
            }
        },
        methods: {
            ...mapActions(['notificationRemove']),
            sendNotificationRemove() {
                this.notificationRemove(this.notification);
            }
        },
        computed: {
            getNotificationType() {
                return this.notification.type.charAt(0).toUpperCase() + this.notification.type.slice(1);
            },
            timerHeight() {
                return (100 / 5000) * this.timer;
            }
        },
        created() {
            let self = this;
            const target = Date.now() + self.timer;

            this.notificationInterval = setInterval(function() {
                self.timer = target - Date.now();

                if(self.timer <= 0) {
                    clearInterval(self.notificationInterval);
                    self.notificationRemove(self.notification);
                }
            }, 1);
        },
        beforeDestroy() {
            clearInterval(this.notificationInterval);
        }
    }
</script>

<style scoped>
    .notifications-element {
        width: 305px;
        height: 73px;
        position: relative;
        display: flex;
        margin-top: 10px;
        background-color: #1a354c;
    }

    .notifications-element:first-of-type {
        margin-top: 0px;
    }

    .notifications-element button.button-close {
        position: absolute;
        top: 10px;
        right: 12px;
    }

    .notifications-element button.button-close svg {
        width: 10px;
        height: 9px;
        fill: #75adc2;
    }

    .notifications-element .element-timer {
        width: 3px;
        height: 100%;
        display: flex;
        align-items: flex-end;
    }

    .notifications-element.element-success .element-timer {
        background-color: #365843;
    }

    .notifications-element.element-error .element-timer {
        background-color: #583636;
    }

    .notifications-element .timer-progress {
        width: 3px;
    }

    .notifications-element.element-success .timer-progress {
        background-color: #00aa6d;
    }

    .notifications-element.element-error .timer-progress {
        background-color: #e94848;
    }

    .notifications-element .element-content {
        width: calc(100% - 3px);
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 27px 0 17px;
        font-size: 14px;
        font-weight: 700;
        color: #7a93ac;
    }

    .notifications-element .element-content svg {
        margin-right: 22px;
    }

    .notifications-element.element-success .element-content svg {
        fill: #00aa6d;
    }

    .notifications-element.element-error .element-content svg {
        fill: #e94848;
    }
</style>
