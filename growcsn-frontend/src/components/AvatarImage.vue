<template>
    <div class="avatar-image">
        <img v-bind:src="serverUrl + avatarImage" @error="avatarImageError()" alt="avatar" />
    </div>
</template>

<script>
    export default {
        name: 'AvatarImage',
        props: ['image'],
        data() {
            return {
                avatarImage: null,
                serverUrl: process.env.VUE_APP_BACKEND_URL,
            }
        },
        methods: {
            avatarImageError() {             
                this.avatarImage = "/public/img/avatar/1.webp";
            }
        },
        created() {        
            this.avatarImage = this.image === undefined || this.image === null ? "/public/img/avatar/1.webp" : this.image;
        }
    }
</script>

<style scoped>
    .avatar-image {
        overflow: hidden;
        width: 100%;
        height: 100%; 
        border-radius: 100%;
    }

    .avatar-image img {
        width: 100% !important;
        height: 100% !important;
    }
</style>
