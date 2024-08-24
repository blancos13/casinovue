<template>
    <footer id="footer">
        <div class="footer-top">
            <div class="top-info">
                <img src="@/assets/img/logo-small.webp" />
                <div class="info-text">
                    growcsn.com is the #1 Growtopia Gambling Website and offers the best experience & reward to our users.
                    <span class="gradient-green">Innovative Growtopia Gambling</span>
                </div>
            </div>
            <div class="top-links">
                <div class="links-section">
                    <div class="section-title">OUR GAMES</div>
                    <router-link to="/battles">
                        <IconBattles />
                        <span class="gradient-orange">Battles</span>
                    </router-link>
                    <router-link to="/crash">
                        <IconCrash />
                        <span class="gradient-yellow">Crash</span>
                    </router-link>
                    <router-link to="/roll">
                        <IconRoll />
                        <span class="gradient-green">Roll</span>
                    </router-link>
                    <router-link to="/duels">
                        <IconDuels />
                        <span class="gradient-red">Dice Duels</span>
                    </router-link>
                </div>
                <div class="links-section">
                    <div class="section-title">ABOUT US</div>
                    <button v-on:click="modalsSetShow('Terms')">TOS</button>
                    <button v-on:click="modalsSetShow('Faq')">FAQ</button>
                    <button v-on:click="modalsSetShow('Privacy')">Privacy</button>
                </div>
                <div class="links-section">
                    <div class="section-title">ADDITIONAL</div>
                    <router-link to="/affiliates">Affiliates</router-link>
                    <router-link to="/leaderboard">Leaderboard</router-link>
                    <a href="https://discord.gg/growcsn" target="_blank">Support</a>
                    <button v-on:click="modalsSetShow('Fair')">Provably Fair</button>
                </div>
                <div class="links-section">
                    <div class="section-title">SOCIALS</div>
                    <a href="https://twitter.com/growcsn" target="_blank">
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 1.42062C15.405 1.66154 14.771 1.82123 14.11 1.89877C14.79 1.524 15.309 0.935077 15.553 0.225231C14.919 0.574154 14.219 0.820615 13.473 0.958154C12.871 0.366462 12.013 0 11.077 0C9.261 0 7.799 1.36062 7.799 3.02862C7.799 3.26862 7.821 3.49938 7.875 3.71908C5.148 3.59631 2.735 2.38985 1.114 0.552C0.831 1.00523 0.665 1.524 0.665 2.08246C0.665 3.13108 1.25 4.06062 2.122 4.59877C1.595 4.58954 1.078 4.44831 0.64 4.22585C0.64 4.23508 0.64 4.24708 0.64 4.25908C0.64 5.73046 1.777 6.95262 3.268 7.23415C3.001 7.30154 2.71 7.33385 2.408 7.33385C2.198 7.33385 1.986 7.32277 1.787 7.28215C2.212 8.48123 3.418 9.36277 4.852 9.39138C3.736 10.1972 2.319 10.6828 0.785 10.6828C0.516 10.6828 0.258 10.6717 0 10.6412C1.453 11.5062 3.175 12 5.032 12C11.068 12 14.368 7.38462 14.368 3.384C14.368 3.25015 14.363 3.12092 14.356 2.99262C15.007 2.56615 15.554 2.03354 16 1.42062Z" fill="#03A9F4"/>
                        </svg>
                        Twitter
                    </a>
                    <a href="https://discord.com/invite/growcsn" target="_blank">
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.5447 0.994743C12.5249 0.53434 11.4314 0.195118 10.288 0.000815247C10.2672 -0.00293612 10.2463 0.00644229 10.2356 0.0251684C10.095 0.271314 9.93919 0.592394 9.8301 0.844781C8.60032 0.663608 7.37681 0.663608 6.17225 0.844781C6.06312 0.586797 5.90169 0.271314 5.76041 0.0251684C5.74969 0.00705727 5.72887 -0.00232114 5.70806 0.000815247C4.56531 0.194472 3.47175 0.533694 2.45131 0.994743C2.44246 0.998495 2.4349 1.00474 2.42987 1.01285C0.355618 4.06207 -0.212633 7.03635 0.0661174 9.97374C0.0673674 9.9881 0.0755861 10.0018 0.0869299 10.0106C1.45546 10.9995 2.78115 11.5999 4.08218 11.9978C4.103 12.0041 4.12506 11.9966 4.13831 11.9797C4.44606 11.5662 4.7204 11.1301 4.95562 10.6716C4.9695 10.6447 4.95625 10.6128 4.92787 10.6022C4.49272 10.4398 4.07837 10.2417 3.67978 10.0169C3.64825 9.99877 3.64572 9.95439 3.67475 9.93315C3.75862 9.87131 3.84253 9.80695 3.92262 9.74198C3.93712 9.73011 3.95731 9.72762 3.97434 9.73509C6.59284 10.9115 9.42769 10.9115 12.0153 9.73509C12.0323 9.72698 12.0525 9.7295 12.0676 9.74134C12.1478 9.80631 12.2316 9.87128 12.3161 9.93312C12.3451 9.95436 12.3432 9.99874 12.3117 10.0168C11.9131 10.2461 11.4988 10.4398 11.063 10.6016C11.0346 10.6122 11.022 10.6447 11.0359 10.6715C11.2762 11.1294 11.5505 11.5655 11.8526 11.9791C11.8652 11.9966 11.8879 12.0041 11.9087 11.9978C13.2161 11.5999 14.5418 10.9995 15.9103 10.0106C15.9223 10.0018 15.9299 9.98871 15.9311 9.97435C16.2647 6.57841 15.3723 3.62851 13.5655 1.01347C13.5611 1.00474 13.5535 0.998495 13.5447 0.994743V0.994743ZM5.34672 8.18516C4.55837 8.18516 3.90878 7.47302 3.90878 6.5984C3.90878 5.7238 4.54575 5.01163 5.34672 5.01163C6.15394 5.01163 6.79725 5.73005 6.78463 6.5984C6.78463 7.47302 6.14762 8.18516 5.34672 8.18516ZM10.6632 8.18516C9.87488 8.18516 9.22529 7.47302 9.22529 6.5984C9.22529 5.7238 9.86225 5.01163 10.6632 5.01163C11.4704 5.01163 12.1137 5.73005 12.1011 6.5984C12.1011 7.47302 11.4705 8.18516 10.6632 8.18516Z" fill="#5865F2"/>
                        </svg>
                        Discord
                    </a>
                    <a href="https://www.youtube.com/channel/UC53flZWOjRMfPfV88v_lqmQ/featured" target="_blank">
                        <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="0.722168" width="16" height="11.5556" rx="3" fill="#F61C0D"/>
                            <path d="M10.5662 6.45129C10.7002 6.5185 10.7002 6.70354 10.5662 6.77075L6.49471 8.81272C6.37056 8.87499 6.22222 8.78803 6.22222 8.65299L6.22222 4.56904C6.22222 4.434 6.37056 4.34705 6.49471 4.40931L10.5662 6.45129Z" fill="white"/>
                        </svg>
                        Youtube
                    </a>
                    <a href="https://www.twitch.tv/growcsn" target="_blank">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.650024 2.78333V13.9127H4.48269V16H6.57536L8.66469 13.912H11.8014L15.984 9.74V0H1.69469L0.650024 2.78333ZM3.08869 1.39H14.59V9.04267L12.15 11.4773H8.31602L6.22669 13.562V11.4773H3.08869V1.39Z" fill="#673AB7"/>
                            <path d="M6.92336 4.17468H8.31669V8.34802H6.92336V4.17468Z" fill="#673AB7"/>
                            <path d="M10.7554 4.17468H12.1494V8.34802H10.7554V4.17468Z" fill="#673AB7"/>
                        </svg>
                        Twitch
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <span class="gradient-green">growcsn is not affiliated, associated or partnered with Ubisoft Entertainment in any way. We are not authorized, endorsed or sponsored by Ubisoft Entertainment. All Growtopia trademarks remain property of Ubisoft Entertainment.</span>
        </div>
    </footer>
</template>

<script>
    import { mapActions } from 'vuex';
    import IconBattles from '@/components/icons/IconBattles';
    import IconCrash from '@/components/icons/IconCrash';
    import IconRoll from '@/components/icons/IconRoll';
    import IconDuels from '@/components/icons/IconDuels';

    export default {
        name: 'Footer',
        components: {
            IconBattles,
            IconCrash,
            IconRoll,
            IconDuels
        },
        methods: {
            ...mapActions([
                'modalsSetShow'
            ])
        }
    }
</script>

<style>
    footer#footer {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 50px 0 12px 0;
        background-color: #00111f;
    }

    footer#footer .footer-top {
        width: 1250px;
        position: relative;
        display: flex;
        padding-bottom: 32px;
    }

    footer#footer .footer-top::after {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: #02192c;
    }

    footer#footer .top-info {
        width: 245px;
        position: relative;
        padding-right: 25px;
    }

    footer#footer .top-info::after {
        content: '';
        width: 1px;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        background: linear-gradient(0deg, transparent 50%, #00111f 50%), linear-gradient(0deg, rgba(0, 17, 31, 0) 0%, rgba(39, 255, 177, 0.5) 50%, rgba(0, 17, 31, 0) 100%);
        background-size: 1px 2px, 2px 100%;
    }

    footer#footer .top-info img {
        width: 82px;
    }

    footer#footer .info-text {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        font-size: 12px;
        font-weight: 400;
        color: #627382;
    }

    footer#footer .info-text span {
        margin-top: 20px;
        font-size: 12px;
        font-weight: 700;
    }

    footer#footer .top-links {
        width: calc(100% - 245px);
        padding-left: 40px;
        display: flex;
        /* font-family: Rubik; */
    }

    footer#footer .links-section {
        margin-right: 40px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    footer#footer .links-section:last-child {
        margin-right: 0;
    }

    footer#footer .section-title {
        position: relative;
        padding-right: 40px;
        margin-bottom: 20px;
        font-size: 15px;
        font-weight: 700;
        color: #bbbfd0;
    }

    footer#footer .links-section:last-child .section-title {
        padding-right: 0;
    }


    footer#footer .section-title::after {
        content: '';
        width: 1px;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        background: linear-gradient(0deg, transparent 50%, #00111f 50%), linear-gradient(0deg, rgba(0, 17, 31, 0) 0%, rgba(39, 158, 255, 0.5) 50%, rgba(0, 17, 31, 0) 100%);
        background-size: 1px 2px, 2px 100%;
    }

    footer#footer .links-section:last-child .section-title::after {
        display: none;
    }

    footer#footer .links-section a,
    footer#footer .links-section button {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        /* font-family: Rubik; */
        font-size: 14px;
        font-weight: 700;
        color: #9ab6ff;
    }

    footer#footer .links-section a:hover,
    footer#footer .links-section button:hover {
        filter: brightness(120%);
    }

    footer#footer .links-section a:last-child,
    footer#footer .links-section button:last-child {
        margin-bottom: 0;
    }

    footer#footer .links-section a svg,
    footer#footer .links-section button svg {
        margin-right: 9px;
    }

    footer#footer .footer-bottom {
        width: 1250px;
        margin-top: 15px;
        text-align: center;
    }

    footer#footer .footer-bottom span {
        font-size: 12px;
        font-weight: 600;
    }

    @media only screen and (max-width: 1600px) {

        footer#footer {
            padding: 50px 20px 12px 20px;
        }

        footer#footer .footer-top {
            width: 100%;
        }

        footer#footer .footer-bottom {
            width: 100%;
        }

    }

    @media only screen and (max-width: 950px) {

        footer#footer {
            padding: 30px 20px 12px 20px;
        }

        footer#footer .footer-top {
            flex-direction: column-reverse;
            padding-bottom: 15px;
        }

        footer#footer .top-info {
            width: 100%;
            display: flex;
            align-items: center;
            padding-top: 25px;
            padding-right: 0;
        }

        footer#footer .info-text {
            width: calc(100% - 82px);
            margin-top: 0;
            padding-left: 25px;
        }

        footer#footer .top-info::after {
            width: 100%;
            height: 0;
            top: 0;
            left: 0;
            border-top: 1px dotted #02192c;
        }

        footer#footer .top-links {
            width: 100%;
            padding-bottom: 25px;
            padding-left: 0;
        }

    }

    @media only screen and (max-width: 700px) {

        footer#footer .top-links {
            flex-wrap: wrap;
        }

        footer#footer .links-section:nth-child(4) {
            margin-top: 25px;
        }

        footer#footer .links-section {
            width: 33.33%;
            margin-right: 0;
        }

        footer#footer .links-section .section-title {
            padding-right: 0;
        }

        footer#footer .links-section .section-title:after {
            display: none;
        }

    }

    @media only screen and (max-width: 450px) {

        footer#footer .links-section {
            width: 50%;
        }

        footer#footer .links-section:nth-child(3) {
            margin-top: 25px;
        }

    }
</style>
