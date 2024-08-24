<template>
    <div class="home-banner-news">
        <div class="news-inner">
            <button v-on:click="homePreviousButton" class="button-previous">
                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.398287 7.54628L6.62846 13.7763C6.77256 13.9206 6.96491 14 7.17001 14C7.37512 14 7.56747 13.9206 7.71157 13.7763L8.17038 13.3176C8.46893 13.0188 8.46893 12.533 8.17038 12.2345L2.93875 7.00291L8.17619 1.76548C8.32028 1.62127 8.39984 1.42902 8.39984 1.22403C8.39984 1.01882 8.32028 0.826572 8.17619 0.682249L7.71738 0.223667C7.57317 0.0794572 7.38092 1.1355e-05 7.17582 1.13371e-05C6.97072 1.13192e-05 6.77836 0.0794571 6.63426 0.223667L0.398287 6.45942C0.25385 6.60408 0.174517 6.79723 0.174972 7.00257C0.174517 7.20869 0.25385 7.40173 0.398287 7.54628Z" />
                </svg>
            </button>
            <div class="inner-content">

                <HomeNewsElement v-for="(banner, index) in homeBanners" v-bind:key="index" v-bind:banner="banner" v-bind:direction="homeDirection" v-bind:position="homePosition" v-bind:index="index" />

            </div>
            <button v-on:click="homeNextButton" class="button-next">
                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.398287 7.54628L6.62846 13.7763C6.77256 13.9206 6.96491 14 7.17001 14C7.37512 14 7.56747 13.9206 7.71157 13.7763L8.17038 13.3176C8.46893 13.0188 8.46893 12.533 8.17038 12.2345L2.93875 7.00291L8.17619 1.76548C8.32028 1.62127 8.39984 1.42902 8.39984 1.22403C8.39984 1.01882 8.32028 0.826572 8.17619 0.682249L7.71738 0.223667C7.57317 0.0794572 7.38092 1.1355e-05 7.17582 1.13371e-05C6.97072 1.13192e-05 6.77836 0.0794571 6.63426 0.223667L0.398287 6.45942C0.25385 6.60408 0.174517 6.79723 0.174972 7.00257C0.174517 7.20869 0.25385 7.40173 0.398287 7.54628Z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import HomeNewsElement from '@/components/home/HomeNewsElement';

    export default {
        name: 'HomeBannerNews',
        components: {
            HomeNewsElement
        },
        data() {
            return {
                homeBanners: ['Rain'],
                homePosition: 0,
                homeDirection: null,
                homeInterval: null
            }
        },
        methods: {
            homeStartInterval() {
                clearInterval(this.homeInterval);
                this.homeInterval = setInterval(() => {
                    this.homeNextButton();
                }, 6000);
            },
            homePreviousButton() {
                this.homeDirection = 'left';
                this.homePosition = this.homePosition === 0 ? this.homeBanners.length - 1 : this.homePosition - 1;
                this.homeStartInterval();
            },
            homeNextButton() {
                this.homeDirection = 'right';
                this.homePosition = this.homePosition >= this.homeBanners.length - 1 ? 0 : this.homePosition + 1;
                this.homeStartInterval();
            }
        },
        beforeUnmount() {
            clearInterval(this.homeInterval);
        },
        mounted() {
            this.homeStartInterval();
        }
    }
</script>

<style scoped>
    .home-banner-news {
        width: calc(50% - 15px);
        height: 175px;
        position: relative;
        padding: 0 0 1px 0;
    }

    .home-banner-news::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 15px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #1a486b 100%);
        z-index: -1;
    }

    .home-banner-news::after {
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

    .home-banner-news .news-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        border-radius: 15px;
        overflow: hidden;
    }

    .home-banner-news .news-inner img {
        height: 100%;
    }

    .home-banner-news .news-inner button.button-previous,
    .home-banner-news .news-inner button.button-next {
        width: 35px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #092035;
        z-index: 1;
    }

    .home-banner-news .news-inner button.button-previous {
        border-radius: 15px 0 0 15px;
    }

    .home-banner-news .news-inner button.button-next {
        border-radius: 0 15px 15px 0;
    }

    .home-banner-news .news-inner button.button-previous svg,
    .home-banner-news .news-inner button.button-next svg {
        fill: #93adc5;
        transition: fill 0.3s ease;
    }

    .home-banner-news .news-inner button.button-next svg {
        transform: rotate(180deg);
    }

    .home-banner-news .news-inner button.button-previous:hover svg,
    .home-banner-news .news-inner button.button-next:hover svg {
        fill: #ffffff;
    }

    .home-banner-news .inner-content {
        width: calc(100% - 70px);
        height: 100%;
        position: relative;
        overflow: hidden;
    }

    @media only screen and (max-width: 900px) {

        .home-banner-news {
            width: 100%;
            margin-top: 15px;
        }

    }
</style>
