<template>
    <div class="profile">
        <div class="profile-container">
            <ProfileHeader />
            <ProfileStats />
            <div class="container-nav">
                <ProfileFilterNav />
            </div>
            <div class="container-content">
                <transition name="slide-fade" mode="out-in">
                    <router-view/>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import ProfileHeader from '@/components/profile/ProfileHeader';
    import ProfileStats from '@/components/profile/ProfileStats';
    import ProfileFilterNav from '@/components/profile/ProfileFilterNav';

    export default {
        name: 'Profile',
        components: {
            ProfileHeader,
            ProfileStats,
            ProfileFilterNav
        },
        metaInfo: {
            title: 'Profile - GrowCsn.com'
        }
    }
</script>

<style scoped>
    .profile {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 55px 0px 45px 0px;
    }

    .profile .profile-container {
        width: 1160px;
        padding: 50px 40px 25px 40px;
        border-radius: 15px;
        background: rgba(19, 66, 88, 0.06);
        border: 1px solid rgba(9, 44, 69, 0.5);
    }

    .profile .container-nav {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: flex-end;
        margin-top: 50px;
    }

    .profile .container-nav::before {
        content: '';
        height: 1px;
        position: absolute;
        top: 50%;
        left: 0;
        right: 200px;
        transform: translate(0, -50%);
        background: rgba(255, 255, 255, 0.04);

    }

    .profile .container-content {
        width: 100%;
        margin-top: 25px;
    }

    @media only screen and (max-width: 1180px) {

        .profile {
            padding: 55px 10px 45px 10px;
        }

        .profile .profile-container {
            width: 100%;
            padding: 50px 15px 25px 15px;
        }

    } 

    @media only screen and (max-width: 600px) {

        .profile .container-nav::before {
            display: none;

        }

    }
</style>