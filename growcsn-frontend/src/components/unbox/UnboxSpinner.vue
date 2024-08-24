<template>
    <div ref="unbox-spinner" class="unbox-spinner" v-bind:class="[ 'spinner-' + unboxCount ]">
        <div class="spinner-inner">

            <div v-for="i in unboxCount" v-bind:key="i" v-bind:ref="'spinner-' + i" class="inner-wheel">
                <UnboxReel v-bind:ref="'reel-' + i" v-bind:style="unboxReelStyle" v-bind:reel="unboxReels[i]" v-bind:pos="unboxReelsPos" v-bind:running="unboxRunning" />
            </div>

        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import UnboxReel from '@/components/unbox/UnboxReel';

    export default {
        name: 'UnboxSpinner',
        components: {
            UnboxReel
        },
        data() {
            return {
                unboxReelsSpinTimeout: null,
                unboxReelsPosRepeater: null,
                unboxReelsPos: 20,
                unboxReels: {
                    1: [],
                    2: [],
                    3: [],
                    4: []
                },
                unboxReelStyle: { transform: 'translateX(2535px) translateY(0px)', transition: 'none' }
            }
        },
        methods: {
            ...mapActions([
                'unboxSetRunnning'
            ]),
            unboxGetItemsFormated(items) {
                let pos = 0;

                for(let item of items) {
                    pos = pos + item.tickets;

                    if(pos < 1000 - 1) { item.color = 'yellow'; }
                    else if(pos < 5000 - 1) { item.color = 'red'; }
                    else if(pos < 20000 - 1) { item.color = 'green'; }
                    else if(pos < 50000 - 1) { item.color = 'purple'; }
                    else { item.color = 'blue'; }
                }

                return items;
            },
            unboxGetOutcomeItem(game) {
                let pos = 0;
                let outcomeItem = null;

                for(const item of this.unboxGetItemsFormated(this.unboxBoxData.box.items)) {
                    pos = pos + item.tickets;
                    if(game.outcome <= pos) { outcomeItem = item; break; }
                }

                return outcomeItem;
            },
            unboxGetReelsPos() {
                const offset = this.unboxCount === 1 ?
                                    this.$refs['reel-1'][0].$el.getBoundingClientRect().left + (this.$refs['reel-1'][0].$el.getBoundingClientRect().width / 2) - (this.$refs['unbox-spinner'].getBoundingClientRect().width / 2) - this.$refs['unbox-spinner'].getBoundingClientRect().left :
                                    this.$refs['reel-1'][0].$el.getBoundingClientRect().top + (this.$refs['reel-1'][0].$el.getBoundingClientRect().height / 2) - (this.$refs['unbox-spinner'].getBoundingClientRect().height / 2) - this.$refs['unbox-spinner'].getBoundingClientRect().top;
                const pos = this.unboxCount === 1 ? 
                                    Math.round(Math.abs(offset - 2535) / 130) + 20 : 
                                    Math.round(Math.abs(offset + 2450.5) / 125) + 20; 

                if(this.unboxReelsPos !== pos) {
                    this.unboxReelsPos = pos;

                    if(this.unboxRunning === true) {
                        this.soundTick.volume = this.soundVolume;
                        this.soundTick.currentTime = 0;
                        this.soundTick.play();
                    }
                }

                this.unboxReelsPosRepeater = requestAnimationFrame(this.unboxGetReelsPos);
            },
            unboxAddReels() {
                let items = this.unboxGetItems;
                this.unboxReels = { 1: [], 2: [], 3: [], 4: [] };

                for(const reel of Object.keys(this.unboxReels)) {
                    for(let i = 0; i < 80; i++) { this.unboxReels[reel].push(items[Math.floor(Math.random() * items.length)]); }
                }
            }
        },
        computed: {
            ...mapGetters([
                'soundVolume',
                'soundTick',
                'soundUnbox',
                'generalTimeDiff',
                'unboxCount',
                'unboxRunning',
                'unboxGames',
                'unboxBoxData'
            ]),
            unboxGetItems() {
                let items = [];

                for(let item of this.unboxGetItemsFormated(this.unboxBoxData.box.items)) {
                    const count = Math.floor(item.tickets / 1000);
                    for(let i = 0; i < (count <= 0 ? 1 : count); i++) { items.push(item); }
                }

                return items;
            }
        },
        watch: {
            'unboxCount': {
                handler() {
                    this.unboxReelsPos = 20;

                    if(this.unboxCount === 1) { this.unboxReelStyle = { transform: 'translateX(2535px) translateY(0px)', transition: 'none' }; }
                    else { this.unboxReelStyle = { transform: 'translateX(0px) translateY(-2450.5px)', transition: 'none' }; }
                }
            },
            'unboxGames': {
                deep: true,
                handler(data, dataOld) {
                    if(this.unboxGames.length >= 1) {
                        if(dataOld.length !== 0) { this.unboxAddReels(); }
                        this.unboxGetReelsPos();

                        for(const [index, game] of this.unboxGames.entries()) { 
                            if(this.unboxCount === 1) { this.unboxReelStyle = { transform: 'translateX(2535px) translateY(0px)', transition: 'none' }; }
                            else { this.unboxReelStyle = { transform: 'translateX(0px) translateY(-2450.5px)', transition: 'none' }; }

                            this.unboxReels[index + 1][60] = this.unboxGetOutcomeItem(game);

                            setTimeout(() => {
                                const timeEnding = new Date(game.updatedAt).getTime() + 5000;
                                let timeLeft = timeEnding - (new Date().getTime() + (game.demo !== true ? this.generalTimeDiff : 0));
                                timeLeft = timeLeft > 0 ? timeLeft : 0;

                                if(this.unboxCount === 1) { 
                                    this.unboxReelStyle = { transform: 'translateX(-' + (2612.5 + (105 / 8) * Math.floor(Math.random() * (7 - 1 + 1)) + 1) + 'px) translateY(0px)', transition: 'transform ' + timeLeft / 1000 + 's cubic-bezier(0.1, 0, 0.2, 1)' }; 
                                } else { 
                                    this.unboxReelStyle = { transform: 'translateX(0px) translateY(-' + (7398 + (105 / 8) * Math.floor(Math.random() * (7 - 1 + 1)) + 1) + 'px)', transition: 'transform ' + timeLeft / 1000 + 's cubic-bezier(0.1, 0, 0.2, 1)' };
                                }
                                
                                this.unboxReelsSpinTimeout = setTimeout(() => {
                                    if(this.unboxCount === 1) { 
                                        this.unboxReelStyle = { transform: 'translateX(-2665px) translateY(0px)', transition: 'transform 0.25s cubic-bezier(0.1, 0, 0.2, 1)' }; 
                                    } else { 
                                        this.unboxReelStyle = { transform: 'translateX(0px) translateY(-7450.5px)', transition: 'transform 0.25s cubic-bezier(0.1, 0, 0.2, 1)' };
                                    }

                                    cancelAnimationFrame(this.unboxReelsPosRepeater); 
                                    setTimeout(() => { 
                                        this.unboxSetRunnning(false);
                                        
                                        this.soundUnbox.volume = this.soundVolume;
                                        this.soundUnbox.currentTime = 0;
                                        this.soundUnbox.play();
                                    }, 250);
                                }, timeLeft + 100);
                            }, 250);
                        }
                    }
                }
            }
        },
        created() {
            this.unboxAddReels();
        },
        beforeDestroy() {
            this.unboxSetRunnning(false);
            clearTimeout(this.unboxReelsSpinTimeout);
            cancelAnimationFrame(this.unboxReelsPosRepeater);
        }
    }
</script>

<style scoped>
    .unbox-spinner {
        width: 100%;
        height: 206px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .unbox-spinner::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #0b2840;
        clip-path: polygon(24px 0, calc(50% - 8px) 0, 50% 8px, calc(50% + 8px) 0, calc(100% - 24px) 0, 100% 15%, 100% 85%, calc(100% - 24px) 100%, calc(50% + 8px) 100%, 50% calc(100% - 8px), calc(50% - 8px) 100%, 24px 100%, 0 85%, 0 15%);
        z-index: -1;
    }

    .unbox-spinner.spinner-2::before,
    .unbox-spinner.spinner-3::before,
    .unbox-spinner.spinner-4::before {
    }

    .unbox-spinner::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #041f36;
        clip-path: polygon(24px 0, calc(50% - 8px) 0, 50% 8px, calc(50% + 8px) 0, calc(100% - 24px) 0, 100% 15%, 100% 85%, calc(100% - 24px) 100%, calc(50% + 8px) 100%, 50% calc(100% - 8px), calc(50% - 8px) 100%, 24px 100%, 0 85%, 0 15%);
        z-index: -1;
    }

    .unbox-spinner.spinner-2::after,
    .unbox-spinner.spinner-3::after,
    .unbox-spinner.spinner-4::after {
    }

    .unbox-spinner .spinner-inner {
        width: 100%;
        height: 100%;
        display: flex;
        background: rgba(2, 21, 36, 0.33);
    }

    .unbox-spinner.spinner-2 .spinner-inner,
    .unbox-spinner.spinner-3 .spinner-inner,
    .unbox-spinner.spinner-4 .spinner-inner {
    }

    .unbox-spinner .inner-wheel {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 1px solid rgba(28, 71, 182, 0.35);
        overflow: hidden;
    }

    .unbox-spinner .inner-wheel:last-child {
        border-right: none;
    }

    .unbox-spinner.spinner-2 .inner-wheel {
        width: 50%;
    }

    .unbox-spinner.spinner-3 .inner-wheel {
        width: 33.33%;
    }

    .unbox-spinner.spinner-4 .inner-wheel {
        width: 25%;
    }

    @media only screen and (max-width: 900px) {

        /*.unbox-spinner {
            height: auto;
        }

        .unbox-spinner .spinner-inner {
            flex-direction: column;
        }

        .unbox-spinner .inner-wheel {
            height: 140px;
            border-bottom: 1px solid rgba(28, 71, 182, 0.35);
            border-right: none;
        }

        .unbox-spinner .inner-wheel:last-child {
            border-bottom: none;
        }

        .unbox-spinner.spinner-2 .inner-wheel,
        .unbox-spinner.spinner-3 .inner-wheel,
        .unbox-spinner.spinner-4 .inner-wheel {
            width: 100%;
        }*/

    }
</style>