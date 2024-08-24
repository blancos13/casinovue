<template>
    <div class="navbar-user-dropdown" v-bind:class="[
        { 'dropdown-open': navbarDropdown === true }, 
        'dropdown-' + navbarGetLevelColor,
        'dropdown-' + authUser.user.rank
    ]">
        <button v-on:click="navbarSetDropdown(!navbarDropdown)" class="button-toggle">
            <div class="button-avatar">
                <AvatarImage v-bind:image="authUser.user.avatar" />
            </div>
            <div class="button-info">
                <div class="info-username">
                    <span v-html="authUser.user.username"></span>
                    <IconDropdown />
                </div>
                <div class="info-level">
                    Level {{navbarGetLevel}}
                </div>
            </div>
        </button>
        <div class="dropdown-menu" v-bind:class="{ 'menu-admin': authUser.user.rank === 'admin' }">
            <div class="menu-inner">
                <router-link v-on:click.native="navbarSetDropdown(false)" to="/profile">
                    <IconUser />
                    PROFILE
                </router-link>
                <button v-on:click="navbarVaultButton()">
                    <IconVault />
                    VAULT
                </button>
                <router-link v-on:click.native="navbarSetDropdown(false)" to="/rewards">
                    <IconRakeback />
                    REWARDS
                </router-link>
                <router-link v-on:click.native="navbarSetDropdown(false)" to="/affiliates">
                    <IconAffiliates />
                    AFFILIATES
                </router-link>
                <router-link v-on:click.native="navbarSetDropdown(false)" to="/leaderboard">
                    <IconLeaderboard />
                    LEADERBOARD
                </router-link>
                <router-link v-if="authUser.user.rank === 'admin'" v-on:click.native="navbarSetDropdown(false)" to="/admin">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
                    </svg>
                    ADMIN
                </router-link>
                <button v-on:click="navbarLogoutButton()">
                    <IconSignOut />
                    SIGN OUT
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AvatarImage from '@/components/AvatarImage';
    import IconDropdown from '@/components/icons/IconDropdown';
    import IconSword from '@/components/icons/IconSword';
    import IconUser from '@/components/icons/IconUser';
    import IconVault from '@/components/icons/IconVault';
    import IconRakeback from '@/components/icons/IconRakeback';
    import IconAffiliates from '@/components/icons/IconAffiliates';
    import IconLeaderboard from '@/components/icons/IconLeaderboard';
    import IconSignOut from '@/components/icons/IconSignOut';

    export default {
        name: 'NavbarUserDropdown',
        components: {
            AvatarImage,
            IconDropdown,
            IconSword,
            IconUser,
            IconVault,
            IconRakeback,
            IconAffiliates,
            IconLeaderboard,
            IconSignOut
        },
        data() {
            return {
                navbarDropdown: false
            }
        },
        methods: {
            ...mapActions([
                'modalsSetShow', 
                'authLogoutUser'
            ]),
            navbarSetDropdown(value) {
                this.navbarDropdown = value;
            },
            navbarVaultButton() {
                this.modalsSetShow('Vault');
                this.navbarSetDropdown(false);
            },
            navbarLogoutButton() {
                this.navbarSetDropdown(false);
                this.authLogoutUser();
            }
        },
        computed: {
            ...mapGetters([
                'authUser'
            ]),
            navbarGetLevel() {
                let level = Math.floor(Math.pow(this.authUser.user.xp / 1000 / 100, 1 / 3));
                return level >= 100 ? 100 : level; 
            },
            navbarGetLevelColor() {
                let color = '';

                if(this.navbarGetLevel >= 2 && this.navbarGetLevel < 26) { color = 'blue'; }
                else if(this.navbarGetLevel >= 26 && this.navbarGetLevel < 51) { color = 'green'; }
                else if(this.navbarGetLevel >= 51 && this.navbarGetLevel < 76) { color = 'orange'; }
                else if(this.navbarGetLevel >= 76 && this.navbarGetLevel < 100) { color = 'red'; }
                else if(this.navbarGetLevel >= 100) { color = 'purple'; }

                return color;
            }
        },
        created() {
            let self = this;
            document.addEventListener('click', function(event) {
                if(!self.$el.contains(event.target) && self.navbarDropdown == true) {
                    self.navbarSetDropdown(false);
                }
            });
        }
    }
</script>

<style scoped>
    .navbar-user-dropdown {
        position: relative;
    }

    .navbar-user-dropdown button.button-toggle {
        display: flex;
        align-items: center;
    }

    .navbar-user-dropdown .button-avatar {
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

    .navbar-user-dropdown.dropdown-blue .button-avatar {
        border: 2px solid #559ee4;
    }

    .navbar-user-dropdown.dropdown-green .button-avatar {
        border: 2px solid #b8e92d;
    }

    .navbar-user-dropdown.dropdown-orange .button-avatar {
        border: 2px solid #fca311;
    }

    .navbar-user-dropdown.dropdown-red .button-avatar {
        border: 2px solid #ff4e4e;
    }

    .navbar-user-dropdown.dropdown-purple .button-avatar {
        border: 2px solid #6953f1;
    } 

    .navbar-user-dropdown.dropdown-partner .button-avatar {
        border: 2px solid #eca822;
    }
    
    .navbar-user-dropdown.dropdown-mod .button-avatar {
        border: 2px solid #ffb703;
    }

    .navbar-user-dropdown.dropdown-admin .button-avatar {
        border: 2px solid #0dd4b1;
    }

    .navbar-user-dropdown .button-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    .navbar-user-dropdown .button-info {

    }

    .navbar-user-dropdown .info-username {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
    }

    .navbar-user-dropdown .info-username span {
        width: 80px;
        max-width: 80px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .navbar-user-dropdown .info-username svg {
        width: 10px;
        margin-left: 12px;
        fill: #ffffff;
        transition: all 0.3s ease;
    }

    .navbar-user-dropdown.dropdown-open .info-username svg {
         transform: rotate(180deg);
    }

    .navbar-user-dropdown .info-level {
        height: 17px;
        margin-top: 2px;
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: #9e9e9e;
    }

    .navbar-user-dropdown.dropdown-blue .info-level {
        color: #559ee4;
    }

    .navbar-user-dropdown.dropdown-green .info-level {
        color: #b8e92d;
    }

    .navbar-user-dropdown.dropdown-orange .info-level {
        color: #fca311;
    }

    .navbar-user-dropdown.dropdown-red .info-level {
        color: #ff4e4e;
    }

    .navbar-user-dropdown.dropdown-purple .info-level {
        color: #6953f1;
    }

    .navbar-user-dropdown.dropdown-partner .info-level {
        color: #eca822;
    }

    .navbar-user-dropdown.dropdown-mod .info-level {
        color: #ffb703;
    }

    .navbar-user-dropdown.dropdown-admin .info-level {
        color: #0dd4b1;
    }

    .navbar-user-dropdown .rank-box {
        width: 22px;
        height: 16px;
        position: relative;
        margin-left: 6px;
        padding: 1px;
    }

    .navbar-user-dropdown .rank-box svg {
        width: 8px;
    }

    .navbar-user-dropdown .rank-box::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(6, 36, 61, 0) 0%, #ffb703 100%);
        clip-path: polygon(3px 0, calc(100% - 3px) 0, 100% 25%, 100% 75%, calc(100% - 3px) 100%, 3px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .navbar-user-dropdown .rank-box .box-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #112531;
        clip-path: polygon(3px 0, calc(100% - 3px) 0, 100% 25%, 100% 75%, calc(100% - 3px) 100%, 3px 100%, 0 75%, 0 25%);
    }

    .navbar-user-dropdown .dropdown-menu {
        height: 0;
        position: absolute;
        top: 62px;
        left: -10px;
        right: -10px;
        padding: 0 10px;
        transition: height 0.2s ease;
        overflow: hidden;
        z-index: 1;
    }

    .navbar-user-dropdown.dropdown-open .dropdown-menu {
       height: 233px;
       padding: 0 10px 10px 10px;
    }

    .navbar-user-dropdown.dropdown-open .dropdown-menu.menu-admin {
         height: 269px;
    }

    .navbar-user-dropdown .menu-inner {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 7px;
        border-radius: 10px 0 10px 10px;
        background: radial-gradient(160% 160% at 50% -30%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(255deg, #07263d 0%, #07243a 100%);
        box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.15);
    }

    .navbar-user-dropdown .menu-inner::before {
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        top: -7px;
        right: 0px;
        border-left: 11px solid transparent;
        border-bottom: 7px solid #064550;
    }

    .navbar-user-dropdown .menu-inner button,
    .navbar-user-dropdown .menu-inner a {
        width: 100%;
        height: 36px;
        display: flex;
        align-items: center;
        padding: 0 15px;
        font-size: 12px;
        font-weight: 600;
        color: #bbbfd0;
        border-bottom: 1px solid rgba(24, 72, 109, 0.5);
        transition: color 0.3s ease;
    }

    .navbar-user-dropdown .menu-inner button:first-child,
    .navbar-user-dropdown .menu-inner a:first-child {
        border-radius: 10px 0 0 0;
    }

    .navbar-user-dropdown .menu-inner button:last-child,
    .navbar-user-dropdown .menu-inner a:last-child {
        border-radius: 0 0 10px 10px;
        border-bottom: none;
    }

    .navbar-user-dropdown .menu-inner button:hover,
    .navbar-user-dropdown .menu-inner a:hover {
        color: #ffffff;
    }

     .navbar-user-dropdown .menu-inner button svg,
     .navbar-user-dropdown .menu-inner a svg {
         width: 13px;
         margin-right: 8px;
         fill: #bbbfd0;
     }
</style>
