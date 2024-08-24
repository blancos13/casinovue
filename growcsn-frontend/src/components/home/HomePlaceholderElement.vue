<template>
    <div 
        class="home-placeholder-element"
        v-bind:style="{ 'height': homeHeight + 'px' }"
        ref="placeholderLink"
    >
        <div class="element-inner">
            <div class="inner-text">
                <div class="text-inner">COMING SOON</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'HomePlaceholderElement',
        data() {
            return {
                homeHeight: 170
            }
        },
        methods: {
            homeSetHeight() {
                this.homeHeight = Number(this.$refs.placeholderLink.scrollWidth * 0.574324).toFixed(4);
            }
        },
        mounted() {
            window.addEventListener('resize', this.homeSetHeight);
            this.homeSetHeight();
        },
        destroyed() { 
            window.removeEventListener('resize', this.homeSetHeight); 
        }
    }
</script>

<style scoped>
    .home-placeholder-element {
        height: 150px;
        width: calc(25% - 18px);
        position: relative;
        margin-top: 25px;
        margin-right: 24px;
        padding: 1px;
        /* font-family: 'Rubik'; */
    }

    .home-placeholder-element:nth-child(1),
    .home-placeholder-element:nth-child(2),
    .home-placeholder-element:nth-child(3),
    .home-placeholder-element:nth-child(4) {
        margin-top: 0;
    }

    .home-placeholder-element:nth-child(4n) {
        margin-right: 0;
    }

    .home-placeholder-element::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #3577ae 100%);
        clip-path: polygon(18px 0, calc(100% - 18px) 0, 100% 25%, 100% 75%, calc(100% - 18px) 100%, 18px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .home-placeholder-element::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-image: url('~@/assets/img/games/backup/placeholder.webp');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        clip-path: polygon(18px 0, calc(100% - 18px) 0, 100% 25%, 100% 75%, calc(100% - 18px) 100%, 18px 100%, 0 75%, 0 25%);
        filter: blur(4px);
        z-index: -1;
    }

    .home-placeholder-element .element-inner {
        width: 100%;
        height: 100%;
        background: rgba(4, 31, 52, 0.65);
        clip-path: polygon(18px 0, calc(100% - 18px) 0, 100% 25%, 100% 75%, calc(100% - 18px) 100%, 18px 100%, 0 75%, 0 25%);
    }

    .home-placeholder-element .inner-text {
        width: 100%;
        height: 25%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        font-weight: 800;
        color: #628bac;
        background: linear-gradient(255deg, rgba(59, 126, 183, 0.25) 0%, rgba(20, 80, 129, 0.25) 100%);
    }

    @media only screen and (max-width: 1050px) {

        .home-placeholder-element {
            width: calc(25% - 11.25px);
            margin-right: 15px;
        }

    }

    @media only screen and (max-width: 800px) {

        .home-placeholder-element {
            width: calc(50% - 7.5px);
            margin-top: 15px;
        }

        .home-placeholder-element:nth-child(3),
        .home-placeholder-element:nth-child(4) {
            margin-top: 15px;
        }

        .home-placeholder-element:nth-child(2n) {
            margin-right: 0;
        }
    }

    @media only screen and (max-width: 450px) {

        .home-placeholder-element {
            height: 95px;
        }

        .home-placeholder-element .inner-text {
            font-size: 14px;
        }

    }
</style>
