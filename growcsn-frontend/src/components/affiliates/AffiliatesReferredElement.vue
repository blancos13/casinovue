<template>
    <div class="affiliates-referred-element">
        <div class="element-inner">
            <div class="inner-user" v-bind:class="[
                referred.user === null ? 
                    'user-hidden' :
                    ['user-' + affiliatesGetRank(referred.user), 'user-' + affiliatesGetLevelColor(referred.user)]
            ]">
                <div class="user-avatar">
                    <AvatarImage v-bind:image="referred.user !== null ? referred.user.avatar : null" />
                </div>
                <span v-if="referred.user !== null" v-html="referred.user.username"></span>
                <span v-else>Anonymous</span>
            </div>
            <div class="inner-earned">
                <div class="earned-title">TOTAL EARNED</div>
                <div class="earned-content">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="content-value">
                        <span>{{affiliatesFormatValue(referred.affiliates.generated).split('.')[0]}}</span>.{{affiliatesFormatValue(referred.affiliates.generated).split('.')[1]}}
                    </div>
                </div>
            </div>
            <div class="inner-deposited">
                <div class="earned-title">TOTAL WAGERED</div>
                <div class="earned-content">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="content-value">
                        <span>{{affiliatesFormatValue(referred.affiliates.generated / 0.005).split('.')[0]}}</span>.{{affiliatesFormatValue(referred.affiliates.generated / 0.005).split('.')[1]}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AvatarImage from '@/components/AvatarImage';

    export default {
        name: 'AffiliatesReferredElement',
        components: {
            AvatarImage
        },
        props: [
            'referred'
        ],
        methods: {
            affiliatesFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            affiliatesGetRank(user) {
                let rank = user.rakeback;

                if(user.rank !== 'user') { rank = user.rank; }

                return rank;
            },
            affiliatesGetLevelColor(user) {
                let color = '';

                if(user.level >= 2 && user.level < 26) { color = 'blue'; }
                else if(user.level >= 26 && user.level < 51) { color = 'green'; }
                else if(user.level >= 51 && user.level < 76) { color = 'orange'; }
                else if(user.level >= 76 && user.level < 100) { color = 'red'; }
                else if(user.level >= 100) { color = 'purple'; }

                return color;
            }
        }
    }
</script>

<style scoped>
    .affiliates-referred-element {
        width: 100%;
        height: 60px;
        position: relative;
        margin-top: 10px;
        padding: 1px;
    }

    .affiliates-referred-element:first-of-type {
        margin-top: 0;
    }

    .affiliates-referred-element::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 5px;
        background: linear-gradient(180deg, rgba(20, 68, 104, 0) 0%, #144468 100%);
        z-index: -1;
    }

    .affiliates-referred-element::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 5px;
        background-color: #05223a;
        z-index: -1;
    }

    .affiliates-referred-element .element-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 25px;
        border-radius: 5px;
        background-color: rgba(2, 21, 39, 0.25);
    }

    .affiliates-referred-element .inner-user {
        width: 60%;
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
    }

    .affiliates-referred-element .inner-user.user-hidden span {
        font-style: italic;
    }

    .affiliates-referred-element .user-avatar {
        width: 34px;
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-right: 10px;
        border-radius: 50%;
        border: 1px solid #9e9e9e;
        overflow: hidden;
    }

    .affiliates-referred-element .inner-user.user-blue .user-avatar {
        border: 1px solid #559ee4;
    }

    .affiliates-referred-element .inner-user.user-green .user-avatar {
        border: 1px solid #b8e92d;
    }

    .affiliates-referred-element .inner-user.user-orange .user-avatar {
        border: 1px solid #fca311;
    }

    .affiliates-referred-element .inner-user.user-red .user-avatar {
        border: 1px solid #ff4e4e;
    }

    .affiliates-referred-element .inner-user.user-purple .user-avatar {
        border: 1px solid #6953f1;
    }

    .affiliates-referred-element .inner-user.user-partner .user-avatar {
        border: 1px solid #eca822;
    }

    .affiliates-referred-element .inner-user.user-mod .user-avatar {
        border: 1px solid #ffb703;
    }

    .affiliates-referred-element .inner-user.user-admin .user-avatar {
        border: 1px solid #00ffc2;
    }

    .affiliates-referred-element .user-avatar .avatar-image {
        width: 100%;
        height: 100%;
    }

    .affiliates-referred-element .inner-earned,
    .affiliates-referred-element .inner-deposited {
        width: 20%;
        display: flex;
        flex-direction: column;
    }

    .affiliates-referred-element .earned-title,
    .affiliates-referred-element .deposited-title {
        display: none;
        font-size: 12px;
        font-weight: 800;
        color: #8bacc8;
    }

    .affiliates-referred-element .earned-content,
    .affiliates-referred-element .deposited-content {
        display: flex;
        align-items: center;
    }

    .affiliates-referred-element .earned-content img,
    .affiliates-referred-element .deposited-content img {
        width: 18px;
        height: 18px;
        margin-right: 10px;
    }

    .affiliates-referred-element .content-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .affiliates-referred-element .content-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 700px) {

        .affiliates-referred-element {
            height: auto;
        }

        .affiliates-referred-element .element-inner {
            display: grid;
            grid-template-columns: 50% 50%;
            grid-template-rows: auto auto;
            padding: 15px 25px;
        }

        .affiliates-referred-element .inner-user {
            width: 100%;
            grid-column: 1 / 3;
            grid-row: 1;
        }

        .affiliates-referred-element .inner-earned {
            width: 100%;
            grid-column: 1;
            grid-row: 2;
            margin-top: 20px;
        }

        .affiliates-referred-element .inner-deposited {
            width: 100%;
            grid-column: 2;
            grid-row: 2;
            margin-top: 20px;
        }

        .affiliates-referred-element .earned-title,
        .affiliates-referred-element .deposited-title {
            display: block;
        }

        .affiliates-referred-element .earned-content,
        .affiliates-referred-element .deposited-content {
            margin-top: 5px;
        }

    }
</style>
