<template>
    <router-link
        v-on:mouseover.native="homeStartHoverIn()"
        v-on:mouseleave.native="homeStartHoverOut()"
        v-bind:to="'/' + game"  
        class="home-featured-link" 
        v-bind:class="'link-' + game"
        v-bind:style="{ 'height': homeHeight + 'px','background-position': '0px -' + (homeHeight * homeStep) + 'px' }"
        ref="featuredLink"
    >
        <div class="link-featured">FEATURED</div>
    </router-link>
</template>

<script>
    export default {
        name: 'HomeFeaturedLink',
        props: [
            'game'
        ],
        data() {
            return {
                homeHeight: 170,
                homeInterval: null,
                homeHover: false,
                homeStep: 0
            }
        },
        methods: {
            homeSetHeight() {
                this.homeHeight = Number(this.$refs.featuredLink.$el.getBoundingClientRect().width * (this.game === 'battles' ? 0.591 : 0.574324)).toFixed(4);
            },
            homeStartHoverIn() {
                const self = this;
                clearInterval(this.homeInterval);

                this.homeInterval = setInterval(() => {
                    if(this.homeStep < (this.game === 'battles' ? 59 : 59)) {
                        this.homeStep = this.homeStep + 1;
                    } else { clearInterval(this.homeInterval); }
                }, 16);
            },
            homeStartHoverOut() {
                const self = this;
                clearInterval(this.homeInterval);

                this.homeInterval = setInterval(() => {
                    if(this.homeStep > 0) {
                        this.homeStep = this.homeStep - 1;
                    } else { clearInterval(this.homeInterval); }
                }, 16);
            }
        },
        computed: {
            homeGetName() {
                let name = this.game;

                if(this.game === 'duels') {
                    name = 'dice duels';
                }

                return name;
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
    a.home-featured-link {
        width: calc(25% - 24px);
        position: relative;
        margin-right: 32px;
        padding: 1px;
        /* font-family: 'Rubik'; */
        transition: transform 0.3s ease;
    }

    a.home-featured-link:hover {
        transform: scale(1.03);
    }

    a.home-featured-link.link-battles {
        background: url('~@/assets/img/games/battles.webp');
        background-repeat: no-repeat;

        background-size: 100% auto;
    }

    a.home-featured-link.link-crash {
        background: url('~@/assets/img/games/crash.webp');
        background-repeat: no-repeat;
        background-size: 100% auto;
    }

    a.home-featured-link.link-roll {
        background: url('~@/assets/img/games/roll.webp');
        background-repeat: no-repeat;
        background-size: 100% auto;
    }

    a.home-featured-link.link-blackjack {
        background: url('~@/assets/img/games/blackjack.webp');
        background-repeat: no-repeat;
        background-size: 100% auto;
    }

    a.home-featured-link.link-duels {
        background: url('~@/assets/img/games/duels.webp');
        background-repeat: no-repeat;
        background-size: 100% auto;
    }

    a.home-featured-link:last-of-type {
        margin-right: 0;
    }

    a.home-featured-link .link-featured {
        width: 65px;
        height: 21px;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        bottom: -9px;
        left: 50%;
        transform: translate(-50%, 0);
        font-size: 10px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    @media only screen and (max-width: 1050px) {

        a.home-featured-link {
            width: calc(25% - 9px);
            margin-right: 12px;
        }

        a.home-featured-link:last-of-type {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 800px) {

        a.home-featured-link {
            width: calc(50% - 9px);
            margin-top: 20px;
        }

        a.home-featured-link:nth-child(2n) {
            margin-right: 0;
        }

        a.home-featured-link:nth-of-type(1),
        a.home-featured-link:nth-of-type(2) {
            margin-top: 0;
        }

    }

    @media only screen and (max-width: 450px) {

        a.home-featured-link .link-featured {
            display: none;
        }

    }
</style>
