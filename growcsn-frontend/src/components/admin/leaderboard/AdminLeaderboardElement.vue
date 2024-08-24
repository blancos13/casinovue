<template>
    <div class="admin-leaderboard-element">
        <div class="element-section section-type">
            <div class="section-title">TYPE</div>
            <div class="section-content">
                {{leaderboard.type.toUpperCase()}}
            </div>
        </div>
        <div class="element-section section-duration">
            <div class="section-title">DURATION</div>
            <div class="section-content">
                {{leaderboard.duration}} DAYS
            </div>
        </div>
        <div class="element-section section-state" v-bind:class="['state-' + leaderboard.state]">
            <div class="section-title">STATE</div>
            <div class="section-content">
                {{leaderboard.state.toUpperCase()}}
            </div>
        </div>
        <div class="element-section section-option">
            <div class="section-title">OPTION</div>
            <div class="section-content">
                <button v-on:click="adminRemoveButton()" v-bind:disabled="socketSendLoading === 'AdminLeaderboardRemove'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM224 192V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32s32 14.3 32 32zm128 0V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32s32 14.3 32 32z"/>
                    </svg>
                    {{ leaderboard.state === 'created' ? 'REMOVE' : 'STOP' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';

    export default {
        name: 'AdminLeaderboardElement',
        props: ['leaderboard'],
        methods: {
            ...mapActions([
                'adminSendLeaderboardStopSocket'
            ]),
            adminRemoveButton() {
                const data = { leaderboardId: this.leaderboard._id };
                this.adminSendLeaderboardStopSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading'
            ])
        }
    }
</script>

<style scoped>
    .admin-leaderboard-element {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
        background: rgba(19, 66, 88, 0.25);
    }

    .admin-leaderboard-element:nth-child(even) {
        background: rgba(19, 66, 88, 0.1);
    }

    .admin-leaderboard-element .element-section {
        display: flex;
        flex-direction: column;
    }

    .admin-leaderboard-element .element-section.section-type {
        width: 35%;
    }

    .admin-leaderboard-element .element-section.section-duration,
    .admin-leaderboard-element .element-section.section-state {
        width: 25%;
    }

    .admin-leaderboard-element .element-section.section-option {
        width: 15%;
    }

    .admin-leaderboard-element .section-title {
        display: none;
        font-size: 13px;
        font-weight: 600;
        color: #8bacc8;
    }

    .admin-leaderboard-element .section-content {
        display: flex;
        align-items: center;
    }

    .admin-leaderboard-element .element-section.section-type .section-content,
    .admin-leaderboard-element .element-section.section-duration .section-content,
    .admin-leaderboard-element .element-section.section-state .section-content {
        font-size: 14px;
        font-weight: 400;
        color: #bbbfd0;
    }

    .admin-leaderboard-element .element-section.section-option .section-content {
        justify-content: flex-end;
    }

    .admin-leaderboard-element .element-section.section-state.state-created .section-content {
        color: #db7d48;
    }

    .admin-leaderboard-element .element-section.section-state.state-running .section-content {
        color: #fca311;
    }

    .admin-leaderboard-element .element-section.section-state.state-completed .section-content {
        color: #00ffc2;
    }

    .admin-leaderboard-element .element-section.section-state.state-canceled .section-content {
        color: #d15e5e;
    }

    .admin-leaderboard-element .element-section.section-option .section-content button {
        display: flex;
        align-items: center;
        margin-right: 15px;
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
        transition: color 0.3s ease;
    }

    .admin-leaderboard-element .element-section.section-option .section-content button:last-of-type {
        margin-right: 0;
    }

    .admin-leaderboard-element .element-section.section-option .section-content button:hover {
        color: #ffffff;
    }

    .admin-leaderboard-element .element-section.section-option .section-content button svg {
        margin-right: 8px;
        fill: #bbbfd0;
        transition: fill 0.3s ease;
    }

    .admin-leaderboard-element .element-section.section-option .section-content button:hover svg {
        fill: #ffffff;
    }

    @media only screen and (max-width: 1250px) {

        .admin-leaderboard-element {
            height: auto;
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 20px;
        }

        .admin-leaderboard-element .element-section {
            width: 100%!important;
            margin-top: 10px;
        }

        .admin-leaderboard-element .element-section.section-type {
            margin-top: 0;
        }

        .admin-leaderboard-element .element-section.section-option {
            align-items: flex-start;
        }

        .admin-leaderboard-element .section-title {
            display: block;
        }

        .admin-leaderboard-element .section-content {
            margin-top: 5px;
        }

    }
</style>