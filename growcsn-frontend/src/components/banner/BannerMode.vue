<template>
    <a class="banner-mode" href="https://discord.gg/growcsn" target="_blank">
        <div class="mode-text">
            <div class="text-title">NEW <span>GAME MODE</span> COMING SOON</div>
            <div class="text-info">
                <span>CAN YOU GUESS WHAT IT IS?</span>
                JOIN OUR DISCORD FOR SNEAK PEEKS
            </div>
        </div>
        <img src="@/assets/img/bell.png" />
    </a>
</template>

<script>
    export default {
        name: 'BannerMode'
    }
</script>

<style scoped>
    .banner-mode {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 40px 20px 28px;
        /* font-family: 'Rubik'; */
        background: linear-gradient(255deg, #000911 -7%, rgba(0, 0, 0, 0) 55%), radial-gradient(90% 90% at 50% 28%, #0f7979 0%, #021729 100%);
    }

    .banner-mode .mode-text {
        width: calc(100% - 124px);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .banner-mode .text-title {
        font-size: 34px;
        font-weight: 900;
        color: #ffffff;
    }

    .banner-mode .text-title span {
        color: #06f482;
    }

    .banner-mode .text-info {
        display: flex;
        flex-direction: column;
        font-size: 12px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .banner-mode .text-info span {
        margin-bottom: 5px;
        font-size: 18px;
        font-weight: 900;
        color: #ffdc25;
    }

    @media only screen and (max-width: 600px) {

        .banner-mode {
            padding: 15px 20px 20px 20px;
        }

        .banner-mode img {
            width: 90px;
        }

        .banner-mode .mode-text {
            width: calc(100% - 90px);
        }

        .banner-mode .text-title {
            font-size: 24px;
        }

        .banner-mode .text-info {
            font-size: 12px;
        }

        .banner-mode .text-info span {
            font-size: 14px;
        }
    }

    @media only screen and (max-width: 500px) {

        .banner-mode img {
            width: 75px;
        }

        .banner-mode .mode-text {
            width: calc(100% - 75px);
        }

        .banner-mode .text-title {
            font-size: 22px;
        }

        .banner-mode .text-info {
            font-size: 11px;
        }

        .banner-mode .text-info span {
            font-size: 13px;
        }

    }
</style>
