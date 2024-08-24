<template>
    <div class="admin">
        <div class="admin-container">
            <div class="container-header">
                <router-link to="/admin" class="header-title text-green-gradient">ADMIN PANEL</router-link>
                <AdminFilterNavbar />
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
    import AdminFilterNavbar from '@/components/admin/AdminFilterNavbar';

    export default {
        name: 'Admin',
        metaInfo: {
            title: 'Admin - GrowCsn.com'
        },
        components: {
            AdminFilterNavbar
        }
    }
</script>

<style scoped>
    .admin {
        width: 100%;
        padding: 55px 50px 45px 50px;
    }

    .admin .admin-container {
        width: 100%;
        padding: 30px;
        border-radius: 15px;
        background: radial-gradient(285% 150% at 50% 50%, #001e37 0%, #000e1a 100%);
        border: 1px solid #24435e;
    }

    .admin .container-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .admin .container-header a.header-title {
        font-size: 32px;
        font-weight: 800;
    }

    .admin .container-content {
        width: 100%;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #0c324e;
    }

    .admin .container-content .slide-fade-enter-active {
        transition: all .3s ease-out;
    }

    .admin .container-content .slide-fade-enter {
        opacity: 0;
    }

    @media only screen and (max-width: 750px) {

        .admin {
            padding: 55px 10px 45px 10px;
        }

        .admin .admin-container {
            padding: 15px;
        }

    }

    @media only screen and (max-width: 650px) {

        .admin .container-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .admin .container-content {
            margin-top: 10px;
        }

    }
</style>
