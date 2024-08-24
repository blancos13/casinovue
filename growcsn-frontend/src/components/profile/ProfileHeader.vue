<template>
    <div class="profile-header" v-bind:class="[
            'header-' + profileGetLevelColor,
            'header-' + authUser.user.rank
        ]">
        <div class="header-user">
            <div class="user-avatar">
                <AvatarImage v-bind:image="authUser.user.avatar" />
            </div>
            <div class="user-info">
                <div class="info-username">
                    <span v-html="authUser.user.username"></span>
                </div>
                <div class="info-level">
                    Level {{profileGetLevel}}
                </div>
            </div>
        </div>
        <div class="header-level">
            <div class="level-box">
                <div class="box-inner">{{profileGetLevel >= 99 ? 99 : profileGetLevel}}</div>
            </div>
            <div class="level-progress">
                <div class="progress-bar" v-bind:style=" { 'width': (100 / profileGetLevelBet) * profileGetLevelProgress + '%' }"></div>
                <div class="progress-text">
                    <span>{{parseFloat(profileGetLevelProgress).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}} / </span>
                    <span class="text-target">{{parseFloat(profileGetLevelBet).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}}</span>
                </div>
            </div>
            <div class="level-box">
                <div class="box-inner">{{profileGetLevel >= 99 ? 100 : profileGetLevel + 1}}</div>
            </div>
        </div>
        <div class="header-id">
            <div class="id-title">
                <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.49976 0.568909C5.01846 0.568909 2.99976 2.58761 2.99976 5.06891C2.99976 7.55021 5.01846 9.56891 7.49976 9.56891C9.98105 9.56891 11.9998 7.55021 11.9998 5.06891C11.9998 2.58761 9.98105 0.568909 7.49976 0.568909Z" />
                    <path d="M13.0989 12.5087C11.8669 11.2578 10.2336 10.5689 8.5 10.5689H6.5C4.7664 10.5689 3.13313 11.2578 1.90113 12.5087C0.675167 13.7535 0 15.3967 0 17.1356C0 17.4117 0.223867 17.6356 0.5 17.6356H14.5C14.7761 17.6356 15 17.4117 15 17.1356C15 15.3967 14.3248 13.7535 13.0989 12.5087Z" />
                </svg>
                ACCOUNT ID 
            </div>
            <button v-on:click="profileCopyButton(authUser.user._id)">{{ authUser.user._id.substring(0, 6) }}...{{ authUser.user._id.substring(authUser.user._id.length - 3) }}</button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AvatarImage from '@/components/AvatarImage';

    export default {
        name: 'ProfileHeader',
        components: {
            AvatarImage
        },
        methods: {
            ...mapActions([
                'notificationShow'
            ]),
            profileCopyButton(value) {
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
                'authUser'
            ]),
            profileGetLevel() {
                let level = Math.floor(Math.pow(this.authUser.user.xp / 1000 / 100, 1 / 3));
                return level >= 100 ? 100 : level; 
            },
            profileGetLevelColor() {
                let color = '';

                if(this.profileGetLevel >= 2 && this.profileGetLevel < 26) { color = 'blue'; }
                else if(this.profileGetLevel >= 26 && this.profileGetLevel < 51) { color = 'green'; }
                else if(this.profileGetLevel >= 51 && this.profileGetLevel < 76) { color = 'orange'; }
                else if(this.profileGetLevel >= 76 && this.profileGetLevel < 100) { color = 'red'; }
                else if(this.profileGetLevel >= 100) { color = 'purple'; }

                return color;
            },
            profileGetLevelBet() {
                return this.profileGetLevel >= 100 ? 2970100 : (Math.pow(this.profileGetLevel + 1, 3) - Math.pow(this.profileGetLevel, 3)) * 100;
            },
            profileGetLevelProgress() {
                return Math.floor((this.profileGetLevel >= 100 ? 2970100 * 1000 : this.authUser.user.xp - (Math.pow(this.profileGetLevel, 3) * 100 * 1000)) / 10) / 100;
            }
        }
    }
</script>

<style scoped>
    .profile-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .profile-header .header-user {
        width: 260px;
        display: flex;
        align-items: center;
    }

    .profile-header .user-avatar {
        width: 59px;
        height: 59px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-right: 20px;
        border-radius: 50%;
        border: 2px solid #9e9e9e;
        overflow: hidden;
    }

    .profile-header.header-blue .user-avatar {
        border: 2px solid #559ee4;
    }

    .profile-header.header-green .user-avatar {
        border: 2px solid #b8e92d;
    }

    .profile-header.header-orange .user-avatar {
        border: 2px solid #fca311;
    }

    .profile-header.header-red .user-avatar {
        border: 2px solid #ff4e4e;
    }

    .profile-header.header-purple .user-avatar {
        border: 2px solid #6953f1;
    } 

    .profile-header.header-partner .user-avatar {
        border: 2px solid #eca822;
    }
    
    .profile-header.header-mod .user-avatar {
        border: 2px solid #ffb703;
    }

    .profile-header.header-admin .user-avatar {
        border: 2px solid #0dd4b1;
    }

    .profile-header .user-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    .profile-header .info-username {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
    }

    .profile-header .info-username span {
        width: 110px;
        max-width: 110px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .profile-header .info-level {
        height: 17px;
        margin-top: 2px;
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: #9e9e9e;
    }

    .profile-header.header-blue .info-level {
        color: #559ee4;
    }

    .profile-header.header-green .info-level {
        color: #b8e92d;
    }

    .profile-header.header-orange .info-level {
        color: #fca311;
    }

    .profile-header.header-red .info-level {
        color: #ff4e4e;
    }

    .profile-header.header-purple .info-level {
        color: #6953f1;
    }

    .profile-header.header-partner .info-level {
        color: #eca822;
    }

    .profile-header.header-mod .info-level {
        color: #ffb703;
    }

    .profile-header.header-admin .info-level {
        color: #0dd4b1;
    }

    .profile-header .header-level {
        width: calc(100% - 520px);
        display: flex;
        align-items: center;
    }

    .profile-header .level-box {
        width: 46px;
        height: 34px;
        position: relative;
        padding: 1px;
    }

    .profile-header .level-box::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #9e9e9e 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .profile-header.header-blue .level-box::before {
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #559ee4 100%);
    }

    .profile-header.header-green .level-box::before {
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #b8e92d 100%);
    }

    .profile-header.header-orange .level-box::before {
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #fca311 100%);
    }

    .profile-header.header-red .level-box::before {
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #ff4e4e 100%);
    }

    .profile-header.header-purple .level-box::before {
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #6953f1 100%);
    }  

    .profile-header .box-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 700;
        font-size: 15px;
        color: #9e9e9e;
        background-color: #03121e;
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .profile-header.header-blue .box-inner {
        color: #559ee4;
    }

    .profile-header.header-green .box-inner {
        color: #b8e92d;
    }

    .profile-header.header-orange .box-inner {
        color: #fca311;
    }

    .profile-header.header-red .box-inner {
        color: #ff4e4e;
    }

    .profile-header.header-purple .box-inner {
        color: #6953f1;
    } 

    .profile-header .level-progress {
        width: calc(100% - 92px);
        height: 13px;
        position: relative;
        padding: 4px 0;
        background-color: #03121e;
    }

    .profile-header .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #ffffff 0%, #9e9e9e 100%);
    }

    .profile-header.header-blue .progress-bar {
        background: linear-gradient(90deg, #a4d0ff 0%, #559ee4 100%);
    }

    .profile-header.header-green .progress-bar {
        background: linear-gradient(90deg, #e5ffa4 0%, #b8e92d 100%);
    }

    .profile-header.header-orange .progress-bar {
        background: linear-gradient(90deg, #ffe5a4 0%, #fca311 100%);
    }

    .profile-header.header-red .progress-bar {
        background: linear-gradient(90deg, #ffa4a4 0%, #ff4e4e 100%);
    }

    .profile-header.header-purple .progress-bar {
        background: linear-gradient(90deg, #b5a4ff 0%, #6953f1 100%);
    }

    .profile-header .progress-text {
        position: absolute;
        top: -39px;
        left: 50%;
        transform: translate(-50%, 0);
    }

    .profile-header .progress-text span {
        font-size: 15px;
        font-weight: 700;
        color: #9e9e9e;
    }

    .profile-header.header-blue .progress-text span {
        background: linear-gradient(90deg, #a4d0ff 0%, #559ee4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .profile-header.header-green .progress-text span {
        background: linear-gradient(90deg, #e5ffa4 0%, #b8e92d 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .profile-header.header-orange .progress-text span {
        background: linear-gradient(90deg, #ffe5a4 0%, #fca311 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .profile-header.header-red .progress-text span {
        background: linear-gradient(90deg, #ffa4a4 0%, #ff4e4e 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .profile-header.header-purple .progress-text span {
        background: linear-gradient(90deg, #b5a4ff 0%, #6953f1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .profile-header .progress-text span.text-target {
        opacity: 0.5;
    }

    .profile-header .header-id {
        width: 260px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .profile-header .id-title {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #6a88a1;
    }

    .profile-header .id-title svg {
        margin-right: 12px;
        fill: #6a88a1;
    }

    .profile-header .header-id button {
        margin-left: 5px;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
    }

    @media only screen and (max-width: 1000px) {

        .profile-header {
            display: grid;
            grid-template-columns: auto auto;
        }

        .profile-header .header-user {
            width: 100%;
            grid-column: 1;
            grid-row: 1;
        }

        .profile-header .header-level {
            width: 100%;
            grid-column: 1 / 3;
            grid-row: 2;
            margin-top: 50px;
        }

        .profile-header .header-id {
            width: 100%;
            grid-column: 2;
            grid-row: 1;
        }

    }

    @media only screen and (max-width: 600px) {

        .profile-header .header-id {
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-end;
        }

        .profile-header .header-id button {
            margin-top: 5px;
        }

    }

    @media only screen and (max-width: 550px) {

        .profile-header .header-level {
            margin-top: 60px;
        }

        .profile-header .progress-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            top: -50px;
        }

    }
</style>