<template>
    <div class="home-links">
        <div class="links-featured">
            <div class="featured-title">
                <span class="gradient-blue">FEATURED GAMES</span>
            </div>
            <div class="featured-content">
                <HomeFeaturedLink game="crash" />
                <HomeFeaturedLink game="roll" />
                <HomeFeaturedLink game="blackjack" />
                <HomeFeaturedLink game="duels" />
            </div>
        </div>
        <div class="links-games">
            <div class="games-title">
                <span class="gradient-green">GAME SELECTION</span>
            </div>
            <div class="games-content">
                <HomePlaceholderElement />
                <HomePlaceholderElement />
                <HomePlaceholderElement />
                <HomePlaceholderElement />
                <HomePlaceholderElement />
                <HomePlaceholderElement />
                <HomePlaceholderElement />
                <HomePlaceholderElement />
            </div>
        </div>
        <div class="links-bottom">
            <div class="bottom-left">
                <button v-on:click="modalsSetShow('Terms')">TOS</button>
                <button v-on:click="modalsSetShow('Faq')">FAQ</button>
                <button v-on:click="modalsSetShow('Support')">SUPPORT</button>
                <button v-on:click="modalsSetShow('Fair')" class="button-fair">PROVABLY FAIR</button>
            </div>
            <div class="bottom-socials">
                <a href="#" target="_blank">
                    <div class="link-inner">
                        <IconTwitter />
                    </div>
                </a>
                <a href="#" target="_blank">
                    <div class="link-inner">
                        <IconDiscord />
                    </div>
                </a>
                <a href="#" target="_blank">
                    <div class="link-inner">
                        <IconYoutube />
                    </div>
                </a>
                <a href="#" target="_blank">
                    <div class="link-inner">
                        <IconTwitch />
                    </div>
                </a>
            </div>
            <div class="bottom-right">
                <router-link to="/leaderboard" class="link-leaderboard">
                    <span class="gradient-yellow">LEADERBOARD</span>
                </router-link>
                <router-link to="/affiliates" class="link-affiliates">
                    <span class="gradient-green">AFFILIATES</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import IconTwitter from '@/components/icons/IconTwitter';
    import IconDiscord from '@/components/icons/IconDiscord';
    import IconYoutube from '@/components/icons/IconYoutube';
    import IconTwitch from '@/components/icons/IconTwitch';
    import HomeFeaturedLink from '@/components/home/HomeFeaturedLink';
    import HomePlaceholderElement from '@/components/home/HomePlaceholderElement';

    export default {
        name: 'Home',
        metaInfo: {
            title: 'Home - growcsn.com',
            meta: [{ name: 'description', content: 'growcsn.com the leading roblox gambling experience.' }]
        },
        components: {
            IconTwitter,
            IconDiscord,
            IconYoutube,
            IconTwitch,
            HomeFeaturedLink,
            HomePlaceholderElement
        },
        methods: {
            ...mapActions([
                'modalsSetShow'
            ])
        }
    }
</script>

<style scoped>
    .home-links {
        width: 1350px;
        border-radius: 25px;
        background: linear-gradient(180deg, #032540 0%, rgba(4, 19, 31, 0) 100%);
        box-shadow: inset 0px 0px 35px rgba(0, 0, 0, 0.1);
        filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15));
    }

    .home-links .links-featured {
        width: 100%;
        padding: 50px 40px 70px 40px;
    }

    .home-links .featured-title {
        width: 100%;
        display: none;
        justify-content: center;
        font-size: 18px;
        font-weight: 800;
    }

    .home-links .featured-content {
        display: flex;
        flex-wrap: wrap;
    }

    .home-links .links-games {
        width: 100%;
        position: relative;
        padding: 40px;
        background-color: rgba(1, 21, 36, 0.5);
    }

    .home-links .links-games::before {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0);
        background: linear-gradient(90deg, rgba(1, 21, 36, 0) 0%, rgba(1, 232, 171, 0.8) 100%);
    }

    .home-links .links-games::after {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        background: linear-gradient(90deg, rgba(1, 232, 171, 0.8) 0%, rgba(1, 21, 36, 0) 100%);
    }

    .home-links .games-title {
        position: absolute;
        top: -19px;
        left: 50%;
        transform: translate(-50%, 0);
        font-size: 28px;
        font-weight: 800;
        text-shadow: 0px 5px 35px rgba(0, 170, 109, 0.15), 0px 4px 15px rgba(0, 0, 0, 0.25);
    }

    .home-links .games-title::before {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        top: 19px;
        left: 0px;
        background-color: #051B2e;
        z-index: -1;
    }

    .home-links .games-content {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .home-links .links-bottom {
        width: 100%;
        height: 86px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 40px;
    }

    .home-links .bottom-left {
        display: flex;
        align-items: center;
    }

    .home-links .bottom-left button {
        margin-right: 20px;
        font-size: 14px;
        font-weight: 600;
        color: #8bacc8;
    }

    .home-links .bottom-left button.button-fair {
        color: #db7d48;
    }

    .home-links .bottom-left button:last-of-type {
        margin-right: 0;
    }

    .home-links .bottom-socials {
        display: flex;
        align-items: center;
    }

    .home-links .bottom-socials a {
        width: 52px;
        height: 37px;
        margin-right: 15px;
    }

    .home-links .bottom-socials a:last-child {
        margin-right: 0;
    }

    .home-links .bottom-socials a .link-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #133552;
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
        box-shadow: inset 0px 0px 8px #062037;
    }

    .home-links .bottom-socials a .link-inner svg {
        fill: #2e71a8;
    }

    .home-links .bottom-right {
        display: flex;
        align-items: center;
    }

    .home-links .bottom-right a {
        margin-right: 20px;
        font-weight: 600;
        font-size: 14px;
    }

    .home-links .bottom-right a:last-of-type {
        margin-right: 0;
    }

    @media only screen and (max-width: 1700px) {

        .home-links {
            width: 100%;
        }

    }

    @media only screen and (max-width: 1050px) {

        .home-links .links-featured {
            padding: 50px 15px 70px 15px;
        }

        .home-links .links-games {
            padding: 40px 15px;
        }

        .home-links .links-bottom {
            padding: 0 15px;
        }

        .home-links .bottom-socials a {
            margin-right: 10px;
        }

    }

    @media only screen and (max-width: 800px) {

        .home-links {
            background: none;
            box-shadow: none;
            filter: none;
        }

        .home-links .links-featured {
            padding: 0 15px 35px 15px;
        }

        .home-links .featured-title {
            display: flex;
        }

        .home-links .featured-content {
            margin-top: 25px;
        }

        .home-links .links-games {
            padding: 20px 15px 35px 15px;
            background: none;
        }

        .home-links .links-games::before {
            width: calc(100% - 86px);
            background: #0c324e;
        }

        .home-links .links-games::after {
            width: calc(100% - 86px);
            background: #0c324e;
        }

        .home-links .games-title {
            position: static;
            display: flex;
            justify-content: center;
            transform: translate(0, 0);
            font-size: 18px;
            font-weight: 800;
        }

        .home-links .games-title::before {
            display: none;
        }

        .home-links .games-content {
            margin-top: 25px;
        }

        .home-links .links-bottom {
            display: none;
        }
    }

    @media only screen and (max-width: 450px) {

        .home-links .links-games::before {
            width: calc(100% - 66px);
        }

        .home-links .links-games::after {
            width: calc(100% - 66px);
        }

    }
</style>
