<template>
    <transition v-bind:name="homeGetTransition">
        <div v-if="position === index" class="home-news-element">
            <keep-alive>
                <component v-bind:is="'Banner' + banner"></component>
            </keep-alive>
        </div>
    </transition>
</template>

<script>
    import BannerRain from '@/components/banner/BannerRain';

    export default {
        name: 'HomeNewsBanner',
        components: {
            BannerRain
        },
        props: ['banner', 'direction', 'position', 'index'],
        computed: {
            homeGetTransition() {
                return 'slider-' + this.direction;
            }
        }
    }
</script>

<style scoped>
    .home-news-element {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .home-news-element.slider-left-enter-active,
    .home-news-element.slider-left-leave-active,
    .home-news-element.slider-right-enter-active,
    .home-news-element.slider-right-leave-active {
        transition: all 0.5s ease;
    }

    .home-news-element.slider-left-enter {
        transform: translateX(-100%);
    }

    .home-news-element.slider-left-leave-to {
        transform: translateX(100%);
    }

    .home-news-element.slider-right-enter {
        transform: translateX(100%);
    }

    .home-news-element.slider-right-leave-to {
        transform: translateX(-100%);
    }
</style>
