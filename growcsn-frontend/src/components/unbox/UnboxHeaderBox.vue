<template>
    <div class="unbox-header-box">
        <router-link class="link-back" to="/unbox">
            <div class="link-inner">
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.519893 4.88899C-0.173298 5.40596 -0.173297 6.69838 0.519893 7.21535L5.97877 11.2865C6.67196 11.8035 7.53845 11.1573 7.53845 10.1233V9.06113H14V3.04304H7.53845V1.98103C7.53845 0.947086 6.67196 0.300873 5.97877 0.817844L0.519893 4.88899Z" />
                </svg>
                GO BACK
            </div>
        </router-link>
        <div v-if="unboxBoxData.box !== null" class="box-mid">
            <div class="mid-info">
                <div class="info-inner">
                    <div class="inner-image">
                        <div class="image-inner">
                            <img v-bind:src="unboxImagePath + '/public/img/' + unboxBoxData.box.slug + '.png'" />
                        </div>
                    </div>
                    {{unboxBoxData.box.name}}
                </div>
            </div>
        </div>
        <button v-on:click="unboxFairButton()" class="button-fair">
            <div class="button-inner">
                <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0001 2.30199V3.8031H10.941C9.76198 3.80425 8.60479 3.48508 7.59306 2.87967L6.25388 2.07004C6.17599 2.02293 6.0867 1.99803 5.99567 1.99803C5.90465 1.99803 5.81535 2.02293 5.73747 2.07004L4.40266 2.8753C3.39067 3.48009 2.23365 3.79922 1.05471 3.79872H3.60219e-10V2.30199C-5.0177e-06 2.16926 0.0524184 2.04191 0.145859 1.94765C0.239299 1.85339 0.36619 1.79986 0.49891 1.7987H1.05909C2.32857 1.79901 3.574 1.45247 4.66087 0.796506L6.00005 0L7.33485 0.800882C8.42243 1.45521 9.6674 1.80162 10.9366 1.80308H11.5012C11.6328 1.80533 11.7584 1.85862 11.8515 1.9517C11.9446 2.04478 11.9979 2.17037 12.0001 2.30199Z" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.941 4.81404C9.58091 4.8134 8.2466 4.44276 7.08102 3.74182L6.00005 3.08536L4.91908 3.72869C3.75456 4.43362 2.42034 4.80878 1.05909 4.81404H0V6.12696C0.00306513 7.64623 0.438442 9.13326 1.25526 10.4143C2.07207 11.6953 3.23659 12.7174 4.61273 13.3612L6.00005 14.0045L7.37862 13.3612C8.75673 12.7191 9.92335 11.6976 10.7418 10.4164C11.5603 9.13521 11.9968 7.64729 12.0001 6.12696V4.81404H10.941ZM6.25388 9.19044C6.16095 9.27977 6.03705 9.32966 5.90815 9.32966C5.77924 9.32966 5.65534 9.27977 5.56241 9.19044L4.16196 7.78999L4.86656 7.08539L5.9169 8.13135L7.66746 6.38079L8.37206 7.08539L6.25388 9.19044Z" />
                </svg>
                FAIRNESS
            </div>
        </button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'UnboxHeaderBox',
        data() {
            return {
                unboxImagePath: process.env.VUE_APP_BACKEND_URL
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'modalsSetShow'
            ]),
            unboxFairButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                this.modalsSetShow('FairSeed');
            }
        },
        computed: {
            ...mapGetters([
                'authUser',
                'unboxBoxData'
            ])
        }
    }
</script>

<style scoped>
    .unbox-header-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 25px;
    }

    .unbox-header-box a.link-back {
        width: 110px;
        height: 44px;
        position: relative;
        padding: 1px;
        transition: all .2s;
    }
    .unbox-header-box a.link-back:active {
        transition-duration: .2s;
        scale: .9;
    }
    

    .unbox-header-box a.link-back::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #0f3759;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .unbox-header-box a.link-back .link-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #6e95b6;
        background: #0b2d49;
        transition: color 0.3s ease;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .unbox-header-box a.link-back:hover .link-inner {
        color: #ffffff;
    }

    .unbox-header-box a.link-back .link-inner svg {
        margin-right: 8px;
        fill: #557b9b;
        transition: fill 0.3s ease;
    }

    .unbox-header-box a.link-back:hover .link-inner svg {
        fill: #ffffff;
    }

    .unbox-header-box .box-mid {
        width: calc(100% - 223px);
        padding-left: 20px;
    }

    .unbox-header-box .mid-info {
        width: 243px;
        height: 62px;
        position: relative;
        padding: 1px;
    }

    .unbox-header-box .mid-info::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #0a2943;
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .unbox-header-box .info-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding-left: 100px;
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
        background: #051b2d;
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .unbox-header-box .inner-image {
        width: 76px;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        padding: 1px;
        background: #0a2943;
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .unbox-header-box .image-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #051b2d;
        clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 25%, 100% 75%, calc(100% - 10px) 100%, 10px 100%, 0 75%, 0 25%);
    }

    .unbox-header-box .image-inner img {
        height: 52px;
    }

    .unbox-header-box button.button-fair {
        width: 113px;
        height: 32px;
        filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.10));
        transition: all .2s;
    }
    .unbox-header-box button.button-fair:active {
        transition-duration: .2s;
        scale: .9;
    }

    .unbox-header-box button.button-fair .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: #bbbfd0;
        background: #214059;
        transition: color 0.3s ease;
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 25%, 100% 75%, calc(100% - 6px) 100%, 6px 100%, 0 75%, 0 25%);
    }

    .unbox-header-box button.button-fair .button-inner:hover {
        transition:  all .2s;
        background: #2a4f6d;
    }

    .unbox-header-box button.button-fair:hover .button-inner {
        color: #ffffff;
    }

    .unbox-header-box button.button-fair .button-inner svg {
        margin-right: 6px;
        fill: #bbbfd0;
        transition: fill 0.3s ease;
    }

    .unbox-header-box button.button-fair:hover .button-inner svg {
        fill: #ffffff;
    }

    @media only screen and (max-width: 800px) {

        .unbox-header-box {
            display: grid;
            grid-template-rows: auto auto;
        }

        .unbox-header-box a.link-back {
            grid-row: 1 / 1;
            margin-bottom: 15px;
        }

        .unbox-header-box .box-mid {
            grid-row: 2 / 2;
            padding-left: 0;
        }

        .unbox-header-box button.button-fair {
            grid-row: 2 / 2;
        }

    }

    @media only screen and (max-width: 500px) {

        .unbox-header-box {
            align-items: center;
        }

        .unbox-header-box a.link-back {
            grid-column: 1 / 1;
            margin-bottom: 0;
        }

        .unbox-header-box .box-mid {
            margin-top: 15px;
        }

        .unbox-header-box button.button-fair {
            grid-column: 2 / 2;
            grid-row: 1 / 1;
        }

    }
</style>