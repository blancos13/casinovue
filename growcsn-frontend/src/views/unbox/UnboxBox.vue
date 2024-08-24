<template>
    <div class="unbox-box">
        <transition name="fade" mode="out-in">
            <div v-if="socketUnbox.connected === false || unboxBoxData.loading === true" class="box-loading" key="loading">

            </div>
            <div v-else class="box-content" key="data">
                <UnboxSpinner />
                <UnboxControls />
            </div>
        </transition>

        <div class="box-items">
            <div class="items-header">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.85906 19.1522L2.5221 15.4838C2.30493 15.3752 2.16778 15.1533 2.16778 14.9105V11.6123L5.65111 13.354C6.28266 13.6698 7.026 13.6698 7.65755 13.354L7.70795 13.3288L9.85902 12.0055L9.85906 19.1522ZM11.1409 19.1522V12.0054L13.292 13.3288L13.3424 13.354C13.9739 13.6697 14.7173 13.6697 15.3488 13.354L18.8322 11.6123V14.9105C18.8322 15.1532 18.695 15.3752 18.4778 15.4837L11.1409 19.1522ZM2.0165 6.25784L0.531602 5.51542C0.056698 5.27796 -0.135809 4.70049 0.101643 4.22558C0.194674 4.03952 0.34554 3.88865 0.531602 3.79562L6.22437 0.94926C6.49504 0.813927 6.81362 0.813927 7.08425 0.94926L9.94482 2.37955C9.74194 2.42453 9.5432 2.49451 9.35338 2.58944L2.0165 6.25784ZM11.0551 2.37951L13.9157 0.949217C14.1863 0.813884 14.5049 0.813884 14.7755 0.949217L20.4683 3.79558C20.6544 3.88861 20.8052 4.03948 20.8983 4.22554C21.1357 4.70045 20.9432 5.27792 20.4683 5.51537L18.9834 6.2578L11.6465 2.58932C11.4567 2.49447 11.258 2.42449 11.0551 2.37951ZM7.08433 12.2074C6.81366 12.3427 6.49508 12.3427 6.22445 12.2074L0.531642 9.36103C0.34558 9.268 0.194714 9.11714 0.101683 8.93108C-0.135769 8.45617 0.056697 7.8787 0.531642 7.6412L2.01654 6.89877L9.57245 10.6767L7.08433 12.2074ZM20.4683 7.6412C20.9432 7.87866 21.1357 8.45613 20.8983 8.93108C20.8053 9.11714 20.6544 9.268 20.4683 9.36103L14.7756 12.2074C14.5049 12.3427 14.1863 12.3427 13.9157 12.2074L11.4276 10.6767L18.9835 6.89877L20.4683 7.6412ZM16.758 6.57833L10.5 9.70734L4.24193 6.57833L9.92673 3.73593C10.2876 3.55549 10.7124 3.55549 11.0733 3.73593L16.758 6.57833Z" fill="black"/>
                    <path d="M9.85906 19.1522L2.5221 15.4838C2.30493 15.3752 2.16778 15.1533 2.16778 14.9105V11.6123L5.65111 13.354C6.28266 13.6698 7.026 13.6698 7.65755 13.354L7.70795 13.3288L9.85902 12.0055L9.85906 19.1522ZM11.1409 19.1522V12.0054L13.292 13.3288L13.3424 13.354C13.9739 13.6697 14.7173 13.6697 15.3488 13.354L18.8322 11.6123V14.9105C18.8322 15.1532 18.695 15.3752 18.4778 15.4837L11.1409 19.1522ZM2.0165 6.25784L0.531602 5.51542C0.056698 5.27796 -0.135809 4.70049 0.101643 4.22558C0.194674 4.03952 0.34554 3.88865 0.531602 3.79562L6.22437 0.94926C6.49504 0.813927 6.81362 0.813927 7.08425 0.94926L9.94482 2.37955C9.74194 2.42453 9.5432 2.49451 9.35338 2.58944L2.0165 6.25784ZM11.0551 2.37951L13.9157 0.949217C14.1863 0.813884 14.5049 0.813884 14.7755 0.949217L20.4683 3.79558C20.6544 3.88861 20.8052 4.03948 20.8983 4.22554C21.1357 4.70045 20.9432 5.27792 20.4683 5.51537L18.9834 6.2578L11.6465 2.58932C11.4567 2.49447 11.258 2.42449 11.0551 2.37951ZM7.08433 12.2074C6.81366 12.3427 6.49508 12.3427 6.22445 12.2074L0.531642 9.36103C0.34558 9.268 0.194714 9.11714 0.101683 8.93108C-0.135769 8.45617 0.056697 7.8787 0.531642 7.6412L2.01654 6.89877L9.57245 10.6767L7.08433 12.2074ZM20.4683 7.6412C20.9432 7.87866 21.1357 8.45613 20.8983 8.93108C20.8053 9.11714 20.6544 9.268 20.4683 9.36103L14.7756 12.2074C14.5049 12.3427 14.1863 12.3427 13.9157 12.2074L11.4276 10.6767L18.9835 6.89877L20.4683 7.6412ZM16.758 6.57833L10.5 9.70734L4.24193 6.57833L9.92673 3.73593C10.2876 3.55549 10.7124 3.55549 11.0733 3.73593L16.758 6.57833Z" fill="url(#paint0_linear_3299_755)"/>
                    <defs>
                        <linearGradient id="paint0_linear_3299_755" x1="21" y1="-0.433599" x2="-2.51503" y2="7.12738" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#3B7EB7"/>
                            <stop offset="1" stop-color="#145081"/>
                        </linearGradient>
                    </defs>
                </svg>
                CASE CONTENTS
            </div>
            <div class="items-content">
                <transition name="fade" mode="out-in">
                    <div v-if="socketUnbox.connected === false || unboxBoxData.loading === true" class="content-loading" key="loading">

                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>
                        <div class="loading-placeholder"></div>

                    </div>
                    <div v-else class="content-list" key="data">

                        <UnboxItemElement v-for="item of unboxGetBoxItems" v-bind:key="item._id" v-bind:item="item" />

                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import UnboxSpinner from '@/components/unbox/UnboxSpinner';
    import UnboxControls from '@/components/unbox/UnboxControls';
    import UnboxItemElement from '@/components/unbox/UnboxItemElement';

    export default {
        name: 'UnboxBox',
        components: {
            UnboxSpinner,
            UnboxControls,
            UnboxItemElement
        },
        methods: {
            ...mapActions([
                'unboxSetCount',
                'unboxSetGames',
                'unboxGetBoxDataSocket'
            ])
        },
        computed: {
            ...mapGetters([
                'socketUnbox',
                'unboxBoxData'
            ]),
            unboxGetBoxItems() {
                let items = this.unboxBoxData.box.items;
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
            }
        },
        watch: {
            'socketUnbox.connected': {
                handler() {
                    const boxId = this.$route.params.boxId;

                    if((this.unboxBoxData.box === null || this.unboxBoxData.box._id !== boxId) && this.unboxBoxData.loading === false) {
                        const data = { boxId: boxId };
                        this.unboxGetBoxDataSocket(data);
                    }
                }
            }
        },
        created() {
            const boxId = this.$route.params.boxId;

            if(this.socketUnbox.connected === true && (this.unboxBoxData.box === null || this.unboxBoxData.box._id !== boxId) && this.unboxBoxData.loading === false) {
                const data = { boxId: this.$route.params.boxId };
                this.unboxGetBoxDataSocket(data);
            }
        },
        beforeDestroy() {
            this.unboxSetCount(1);
            this.unboxSetGames([]);
        }
    }
</script>

<style scoped>
    .unbox-box {
        width: 100%;
    }

    .unbox-box .box-items {
        width: 100%;
        margin-top: 35px;
    }

    .unbox-box .items-header {
        width: 100%;
        display: flex;
        align-items: center;
        padding-bottom: 15px;
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
        border-bottom: 1px solid rgba(97, 112, 241, 0.15);
    }

    .unbox-box .items-header svg {
        margin-right: 8px;
    }

    .unbox-box .items-content {
        width: 100%;
        margin-top: 25px;
    }

    .unbox-box .content-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }
</style>