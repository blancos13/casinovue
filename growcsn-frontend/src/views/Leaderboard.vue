<template>
    <div class="leaderboard">
        <LeaderboardBanner />

        <div class="leaderboard-timer">
            <div class="timer-inner">
                <IconTimer />
                <div class="inner-value">
                    <span>{{leaderboardTimer.split(':')[0]}}</span>d 
                    <span>{{leaderboardTimer.split(':')[1]}}</span>h 
                    <span>{{leaderboardTimer.split(':')[2]}}</span>m 
                    <span>{{leaderboardTimer.split(':')[3]}}</span>s
                </div>
            </div>
        </div>
        <div class="leaderboard-ranks">
            <div class="ranks-header">
                <div class="rank-pos">#</div>
                <div class="rank-user">USER</div>
                <div class="rank-prize">PRIZE</div>
                <div class="rank-wagered">WAGERED</div>
            </div>
            <div class="ranks-content">
              <transition name="fade" mode="out-in">
                    <div v-if="leaderboardData.loading === true" class="content-loading" key="loading">
                        <LoadingAnimation />
                    </div>
                    <div v-else-if="leaderboardData.data !== null" class="content-list" key="data">

                        <LeaderboardUserElement v-for="(winner, index) of leaderboardData.data.winners" v-bind:key="index" v-bind:position="index + 1" v-bind:winner="winner" />

                    </div>
                    <div v-else class="content-empty" key="empty">No leaderboard found.</div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconTimer from '@/components/icons/IconTimer';
    import LoadingAnimation from '@/components/LoadingAnimation';
    import LeaderboardBanner from '@/components/leaderboard/LeaderboardBanner';
    import LeaderboardUserElement from '@/components/leaderboard/LeaderboardUserElement';

    export default {
        name: 'Leaderboard',
        metaInfo: {
            title: 'Leaderboard - GrowCsn.com'
        },
        components: {
            IconTimer,
            LoadingAnimation,
            LeaderboardBanner,
            LeaderboardUserElement
        },
        data() {
            return {
                leaderboardTimerInterval: null,
                leaderboardTimer: '00:00:00:00'
            }
        },
        methods: {
            ...mapActions([
                'leaderboardGetDataSocket'
            ]),
            leaderboardStartTimer() {
               const endingTime = new Date(this.leaderboardData.data.updatedAt).getTime() + (1000 * 60 * 60 * 24 * Number(this.leaderboardData.data.duration));
               let timeLeft = Math.floor((endingTime - (new Date().getTime() + this.generalTimeDiff)) / 1000);
               timeLeft = timeLeft <= 0 ? 0 : timeLeft;

               let timeDays = Math.floor(timeLeft / (60 * 60 * 24));
               timeDays = timeDays < 10 ? '0' + timeDays : timeDays;
               let timeHours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));
               timeHours = timeHours < 10 ? '0' + timeHours : timeHours;
               let timeMinutes = Math.floor((timeLeft % (60 * 60)) / 60);
               timeMinutes = timeMinutes < 10 ? '0' + timeMinutes : timeMinutes;
               let timeSeconds = Math.floor(timeLeft % 60);
               timeSeconds = timeSeconds < 10 ? '0' + timeSeconds : timeSeconds;

               this.leaderboardTimer = timeDays.toString() + ':' + timeHours.toString() + ':' + timeMinutes.toString() + ':' + timeSeconds.toString();
           }
        },
        computed: {
            ...mapGetters([
                'generalTimeDiff', 
                'leaderboardData'
            ])
        },
        watch: {
            'leaderboardData.data': {
                handler() {
                    if(this.leaderboardData.data !== null) { 
                        clearInterval(this.leaderboardTimerInterval);
                        this.leaderboardTimerInterval = setInterval(() => { this.leaderboardStartTimer(); }, 1000);
                    }
                },
                deep: true
            }
        },  
        created() {
            if(this.leaderboardData.loading === false) {
                const data = {};
                this.leaderboardGetDataSocket(data);
            }
        }
    }
</script>

<style scoped>
    .leaderboard {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 65px 10px 45px 10px;
    }

    .leaderboard .leaderboard-timer {
        position: relative;
    }

    .leaderboard .timer-inner {
        position: absolute;
        display: flex;
        align-items: center;
        top: 20px;
        left: 50%;
        transform: translate(-50%, 0);
    }

    .leaderboard .timer-inner svg {
        width: 29px;
        height: 35px;
        margin-right: 12px;
        fill: #ffffff;
    }

    .leaderboard .inner-value {
        white-space: nowrap;
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .leaderboard .inner-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .leaderboard .leaderboard-ranks {
        width: 955px;
        margin-top: 44px;
    }

    .leaderboard .ranks-header {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 25px 0 35px;
    }

    .leaderboard .rank-pos {
        width: 5%;
        font-size: 16px;
        font-weight: 800;
        color: #8bacc8;
    }

    .leaderboard .rank-user {
        width: 59%;
        font-size: 12px;
        font-weight: 800;
        color: #8bacc8;
    }

    .leaderboard .rank-prize,
    .leaderboard .rank-wagered {
        width: 18%;
        font-size: 12px;
        font-weight: 800;
        color: #8bacc8;
    }

    .leaderboard .ranks-content {
        width: 100%;
        margin-top: 15px;
    }

    .leaderboard .content-loading {
        width: 100%;
        height: 330px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .leaderboard .content-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .leaderboard .content-loading.fade-leave-to {
        opacity: 0;
    }

    .leaderboard .content-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .leaderboard .content-empty {
        width: 100%;
        height: 192px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: #5e768e;
    }

    .leaderboard .content-list.fade-enter-active,
    .leaderboard .content-empty.fade-enter-active {
        transition: opacity 0.5s;
    }

    .leaderboard .content-list.fade-enter-from,
    .leaderboard .content-empty.fade-enter-from {
        opacity: 0;
    }

    @media only screen and (max-width: 975px) {

        .leaderboard .leaderboard-ranks {
            width: 100%;
        }

    }

    @media only screen and (max-width: 700px) {

        .leaderboard .leaderboard-ranks {
            margin-top: 55px;
        }

        .leaderboard .ranks-header {
            display: none;
        }

    }
</style>
