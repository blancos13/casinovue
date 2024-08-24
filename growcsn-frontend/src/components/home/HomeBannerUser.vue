<template>
    <div class="home-banner-user">
        <div class="user-inner">
            <img src="@/assets/img/home_banner.png" />
            <img src="@/assets/img/knight.png" />
            <div v-if="authUser.user === null" class="inner-guest">
                <span class="gradient-green">SIGN IN TO START</span>
                <AuthButton />
            </div>
            <div v-else class="inner-auth" v-bind:class="[
                'auth-' + homeGetLevelColor
            ]">
                <span class="gradient-green">WELCOME BACK,</span>
                <div class="auth-info">
                    <div class="info-avatar">
                        <AvatarImage v-bind:image="authUser.user.avatar" />
                    </div>
                    <span v-html="authUser.user.username"></span>
                </div>
                <div class="auth-level">
                    <div class="level-box">
                        <div class="box-inner">{{homeGetLevel >= 99 ? 99 : homeGetLevel}}</div>
                    </div>
                    <div class="level-progress">
                        <div class="progress-bar" v-bind:style=" { 'width': (100 / homeGetLevelBet) * homeGetLevelProgress + '%' }"></div>
                        <div class="progress-text">
                            <span>{{parseFloat(homeGetLevelProgress).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}} / </span>
                            <span class="text-target">{{parseFloat(homeGetLevelBet).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}}</span>
                        </div>
                    </div>
                    <div class="level-box">
                        <div class="box-inner">{{homeGetLevel >= 99 ? 100 : homeGetLevel + 1}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AuthButton from '@/components/AuthButton';
    import AvatarImage from '@/components/AvatarImage';

    export default {
        name: 'HomeBannerUser',
        components: {
            AuthButton,
            AvatarImage
        },
        computed: {
            ...mapGetters([
                'authUser'
            ]),
            homeGetLevel() {
                let level = Math.floor(Math.pow(this.authUser.user.xp / 1000 / 100, 1 / 3));
                return level >= 100 ? 100 : level; 
            },
            homeGetLevelColor() {
                let color = '';

                if(this.homeGetLevel >= 2 && this.homeGetLevel < 26) { color = 'blue'; }
                else if(this.homeGetLevel >= 26 && this.homeGetLevel < 51) { color = 'green'; }
                else if(this.homeGetLevel >= 51 && this.homeGetLevel < 76) { color = 'orange'; }
                else if(this.homeGetLevel >= 76 && this.homeGetLevel < 100) { color = 'red'; }
                else if(this.homeGetLevel >= 100) { color = 'purple'; }

                return color;
            },
            homeGetLevelBet() {
                return this.homeGetLevel >= 100 ? 2970100 : (Math.pow(this.homeGetLevel + 1, 3) - Math.pow(this.homeGetLevel, 3)) * 100;
            },
            homeGetLevelProgress() {
                return Math.floor((this.homeGetLevel >= 100 ? 2970100 * 1000 : this.authUser.user.xp - (Math.pow(this.homeGetLevel, 3) * 100 * 1000)) / 10) / 100;
            }
        }
    }
</script>

<style scoped>
    .home-banner-user {
        width: calc(50% - 15px);
        height: 175px;
        position: relative;
        margin-right: 30px;
        padding: 1px;
        z-index: 1;
    }

    .home-banner-user::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 15px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01fbbe 100%);
        z-index: -1;
    }

    .home-banner-user::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 15px;
        background-color: #031d32;
        z-index: -1;
    }

    .home-banner-user .user-inner {
        width: 100%;
        height: 100%;
        position: relative;
        padding: 22px 180px 22px 35px;
        border-radius: 15px;
        background: linear-gradient(50deg, #062641 0%, #021729 60%, rgba(9, 239, 32, 0.71) 75%, #021729 100%);
        z-index: 1;
    }

    .home-banner-user .user-inner img:nth-of-type(1) {
        height: calc(100% - 1px);
        position: absolute;
        top: 0;
        right: 0;
        z-index: 0;
        z-index: -1;
    }

    .home-banner-user .user-inner img:nth-of-type(2) {
        height: 205px;
        position: absolute;
        bottom: -23px;
        right: -15px;
        transform: scaleX(-1);
        z-index: -1;
    }

    .home-banner-user .inner-guest,
    .home-banner-user .inner-auth {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        z-index: 1;
    }

    .home-banner-user .inner-guest {
        justify-content: flex-start;
    }

    .home-banner-user .inner-guest span.gradient-green,
    .home-banner-user .inner-auth span.gradient-green {
        font-size: 28px;
        font-weight: 900;
        text-shadow: 0px 0px 25px rgba(3, 227, 171, 0.35);
    }

    .home-banner-user .inner-guest button.auth-button {
        margin-top: 15px;
    }

    .home-banner-user .auth-info {
        display: flex;
        align-items: center;
    }

    .home-banner-user .auth-info span {
        font-size: 20px;
        font-weight: 600;
        color: #ffffff;
    }

    .home-banner-user .info-avatar {
        width: 33px;
        height: 33px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-right: 10px;
        border-radius: 50%;
        border: 2px solid #9e9e9e;
        overflow: hidden;
    }

    .home-banner-user .inner-auth.auth-blue .info-avatar {
        border: 2px solid #559ee4;
    }

    .home-banner-user .inner-auth.auth-green .info-avatar {
        border: 2px solid #b8e92d;
    }

    .home-banner-user .inner-auth.auth-orange .info-avatar {
        border: 2px solid #fca311;
    }

    .home-banner-user .inner-auth.auth-red .info-avatar {
        border: 2px solid #ff4e4e;
    }

    .home-banner-user .inner-auth.auth-purple .info-avatar {
        border: 2px solid #6953f1;
    }  

    .home-banner-user .info-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    .home-banner-user .auth-level {
        width: 100%;
        display: flex;
        align-items: center;
        z-index: 1;
    }

    .home-banner-user .level-box {
        width: 46px;
        height: 34px;
        position: relative;
        padding: 1px;
    }

    .home-banner-user .level-box::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #9e9e9e 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .home-banner-user .inner-auth.auth-blue .level-box::before {
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #559ee4 100%);
    }

    .home-banner-user .inner-auth.auth-green .level-box::before {
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #b8e92d 100%);
    }

    .home-banner-user .inner-auth.auth-orange .level-box::before {
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #fca311 100%);
    }

    .home-banner-user .inner-auth.auth-red .level-box::before {
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #ff4e4e 100%);
    }

    .home-banner-user .inner-auth.auth-purple .level-box::before {
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #6953f1 100%);
    }  

    .home-banner-user .box-inner {
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

    .home-banner-user .inner-auth.auth-blue .box-inner {
        color: #559ee4;
    }

    .home-banner-user .inner-auth.auth-green .box-inner {
        color: #b8e92d;
    }

    .home-banner-user .inner-auth.auth-orange .box-inner {
        color: #fca311;
    }

    .home-banner-user .inner-auth.auth-red .box-inner {
        color: #ff4e4e;
    }

    .home-banner-user .inner-auth.auth-purple .box-inner {
        color: #6953f1;
    } 

    .home-banner-user .level-progress {
        width: calc(100% - 92px);
        height: 13px;
        position: relative;
        padding: 4px 0;
        background-color: #03121e;
    }

    .home-banner-user .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #ffffff 0%, #9e9e9e 100%);
    }

    .home-banner-user .inner-auth.auth-blue .progress-bar {
        background: linear-gradient(90deg, #a4d0ff 0%, #559ee4 100%);
    }

    .home-banner-user .inner-auth.auth-green .progress-bar {
        background: linear-gradient(90deg, #e5ffa4 0%, #b8e92d 100%);
    }

    .home-banner-user .inner-auth.auth-orange .progress-bar {
        background: linear-gradient(90deg, #ffe5a4 0%, #fca311 100%);
    }

    .home-banner-user .inner-auth.auth-red .progress-bar {
        background: linear-gradient(90deg, #ffa4a4 0%, #ff4e4e 100%);
    }

    .home-banner-user .inner-auth.auth-purple .progress-bar {
        background: linear-gradient(90deg, #b5a4ff 0%, #6953f1 100%);
    }

    .home-banner-user .progress-text {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translate(-50%, 0);
        font-size: 10px;
        font-weight: 700;
    }

    .home-banner-user .progress-text span {
        color: #9e9e9e;
    }

    .home-banner-user .inner-auth.auth-blue .progress-text span {
        color: #559ee4;
    }

    .home-banner-user .inner-auth.auth-green .progress-text span {
        color: #b8e92d;
    }

    .home-banner-user .inner-auth.auth-orange .progress-text span {
        color: #fca311;
    }

    .home-banner-user .inner-auth.auth-red .progress-text span {
        color: #ff4e4e;
    }

    .home-banner-user .inner-auth.auth-purple .progress-text span {
        color: #6953f1;
    }

    .home-banner-user .progress-text span.text-target {
        opacity: 0.5;
    }

    @media only screen and (max-width: 900px) {

        .home-banner-user {
            width: 100%;
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 600px) {

        .home-banner-user .user-inner {
            padding: 22px 20px;
        }

        .home-banner-user .user-inner img:nth-of-type(2) {
            display: none;
        }

    }
</style>
