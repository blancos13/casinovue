<template>
    <div class="affiliates-banner">
        <div class="banner-icons">
            <img src="@/assets/img/chest_2.png" alt="icon" />
            <img src="@/assets/img/star.png" alt="icon" />
            <img src="@/assets/img/star.png" alt="icon" />
            <img src="@/assets/img/icons/coin.svg" alt="icon" />
            <img src="@/assets/img/icons/coin.svg" alt="icon" />
            <img src="@/assets/img/icons/coin.svg" alt="icon" />
        </div>
        <div class="banner-text">REFER YOUR  FRIENDS AND EARN INCREDIBLE REWARDS WHEN THEY SIGN UP!</div>
    </div>
</template>

<script>
    export default {
        name: 'AffiliatesBanner'
    }
</script>

<style scoped>
    .affiliates-banner {
        width: 955px;
        height: 175px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        /* font-family: 'Rubik', sans-serif; */
        background: radial-gradient(75% 175% at 50% 95%, rgba(151, 102, 255, 0.31) 0%, rgba(0, 0, 0, 0) 100%),
                    linear-gradient(125deg, rgba(0, 84, 246, 0.5) 0%, rgba(0, 0, 0, 0) 20%),
                    linear-gradient(125deg, rgba(0, 0, 0, 0) 80%, rgba(0, 255, 194, 0.5) 100%) #062138;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25), inset 0px 0px 15px rgba(95, 178, 255, 0.52);

    }

    .affiliates-banner .banner-icons {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .affiliates-banner .banner-icons img:nth-child(1) {
        position: absolute;
        top: 92px;
        left: -4px;
    }

    .affiliates-banner .banner-icons img:nth-child(2) {
        width: 66px;
        position: absolute;
        top: -21px;
        left: 387px;
    }

    .affiliates-banner .banner-icons img:nth-child(3) {
        width: 46px;
        position: absolute;
        top: 88px;
        left: 121px;
    }

    .affiliates-banner .banner-icons img:nth-child(4) {
        width: 30px;
        height: 30px;
        position: absolute;
        top: -13px;
        right: 66px;
        transform: rotate(-15deg);
    }

    .affiliates-banner .banner-icons img:nth-child(5) {
        width: 62px;
        height: 62px;
        position: absolute;
        top: -23px;
        right: -2px;
    }

    .affiliates-banner .banner-icons img:nth-child(6) {
        width: 44px;
        height: 44px;
        position: absolute;
        top: 55px;
        right: 12px;
        transform: rotate(-80deg);
    }

    .affiliates-banner .banner-text {
        width: 800px;
        text-align: center;
        font-size: 34px;
        font-weight: 900;
        color: #ffffff;
    }

    @media only screen and (max-width: 975px) {

        .affiliates-banner {
            width: 100%;
            padding: 0 10px;
        }

        .affiliates-banner .banner-icons {
            display: none;
        }

    }

    @media only screen and (max-width: 600px) {

        .affiliates-banner .banner-text {
            font-size: 26px;
        }

    }
</style>
