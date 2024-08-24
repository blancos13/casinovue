<template>
    <div class="profile-filter-nav" v-bind:class="{ 'nav-open': profileDropdown === true }">
        <button v-on:click="profileToggleDropdown()" class="button-toggle">
            <div class="button-value">
                View: <span>{{ profileGetRoute }}</span>
            </div>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5176 1.66411e-06L0.482354 8.43375e-08C0.0547936 9.58042e-09 -0.16302 0.516304 0.143533 0.822859L4.66115 5.34052C4.8467 5.52607 5.15325 5.52607 5.33888 5.34052L9.8565 0.822861C10.163 0.516306 9.94516 1.73887e-06 9.5176 1.66411e-06Z" />
            </svg>
        </button>
        <div class="nav-menu">
            <div class="menu-inner">
                <router-link to="/profile" v-on:click.native="profileToggleDropdown()">Transactions</router-link>
                <router-link to="/profile/games" v-on:click.native="profileToggleDropdown()">Games</router-link>
                <router-link to="/profile/settings" v-on:click.native="profileToggleDropdown()">Settings</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ProfileFilterNav',
        data() {
            return {
                profileDropdown: false
            }
        },
        methods: {
            profileToggleDropdown() {
                this.profileDropdown = !this.profileDropdown;
            }
        },
        computed: {
            profileGetRoute() {
                let route = this.$route.name.replace('Profile', '');
                return route;
            }
        },
        created() {
            let self = this;
            document.addEventListener('click', function(event) {
                if(!self.$el.contains(event.target) && self.profileDropdown == true) {
                    self.profileToggleDropdown();
                }
            });
        }
    }
</script>

<style scoped>
    .profile-filter-nav {
        width: 182px;
        position: relative;
        z-index: 15;
    }

    .profile-filter-nav button.button-toggle {
        width: 100%;
        height: 41px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px;
        border-radius: 5px;
        background: rgba(19, 66, 88, 0.25);
    }

    .profile-filter-nav button.button-toggle svg {
        fill: #49687d;
        transition: all 0.3s ease;
    }

    .profile-filter-nav.nav-open button.button-toggle svg {
        transform: rotate(180deg);
    }

    .profile-filter-nav button.button-toggle .button-value {
        display: flex;
        font-size: 14px;
        font-weight: 600;
        color: #49687d;
    }

    .profile-filter-nav button.button-toggle .button-value span {
        margin-left: 8px;
        color: #ffffff;
    }

    .profile-filter-nav .nav-menu {
        width: 100%;
        height: 0;
        position: absolute;
        top: 47px;
        left: 0;
        overflow: hidden;
        transition: height 0.2s ease;
    }

    .profile-filter-nav.nav-open .nav-menu {
        height: 129px;
    }

    .profile-filter-nav .menu-inner {
        width: 100%;
        padding: 3px;
        border-radius: 5px;
        background: #022038;
    }

    .profile-filter-nav .menu-inner a {
        width: 100%;
        height: 41px;
        display: flex;
        align-items: center;
        padding: 0 14px;
        border-radius: 5px;
        font-size: 14px;
        font-weight: 600;
        color: #8bacc8;
        transition: 0.3s ease;
    }

    .profile-filter-nav .menu-inner a:hover {
        background: rgba(19, 66, 88, 0.15);
    }

    @media only screen and (max-width: 600px) {

        .profile-filter-nav {
            width: 100%;
            margin-top: 15px;
        }

    }
</style>