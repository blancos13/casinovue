<template>
    <div class="admin-stats-element">
        <div class="element-section section-date">
            <div class="section-title">DATE</div>
            <div class="section-content">
                {{new Date(stat.createdAt).toLocaleDateString('en-US')}}
            </div>
        </div>
        <div class="element-section section-npc">
            <div class="section-title">NPC</div>
            <div class="section-content">
                {{stat.stats.total.user}}
            </div>
        </div>
        <div class="element-section section-limiteds">
            <div class="section-title">LIMITEDS</div>
            <div class="section-content">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="content-value">
                    <span>{{adminFormatValue(stat.stats.limited.deposit).split('.')[0]}}</span>.{{adminFormatValue(stat.stats.limited.deposit - stat.stats.limited.withdraw).split('.')[1]}}
                </div>
            </div>
        </div>
        <div class="element-section section-robux">
            <div class="section-title">ROBUX</div>
            <div class="section-content">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="content-value">
                    <span>{{adminFormatValue(stat.stats.robux.deposit).split('.')[0]}}</span>.{{adminFormatValue(stat.stats.robux.deposit - stat.stats.robux.withdraw).split('.')[1]}}
                </div>
            </div>
        </div>
        <div class="element-section section-steam" v-bind:class="{ 'section-positive': (stat.stats.steam.deposit - stat.stats.steam.withdraw) >= 0 }">
            <div class="section-title">STEAM</div>
            <div class="section-content">
                ${{ adminFormatValue(stat.stats.steam.deposit - stat.stats.steam.withdraw) }}
            </div>
        </div>
        <div class="element-section section-gift" v-bind:class="{ 'section-positive': (stat.stats.gift.deposit - stat.stats.gift.withdraw) >= 0 }">
            <div class="section-title">GIFT CARDS</div>
            <div class="section-content">
                ${{ adminFormatValue(stat.stats.gift.deposit - stat.stats.gift.withdraw) }}
            </div>
        </div>
        <div class="element-section section-crypto" v-bind:class="{ 'section-positive': (stat.stats.crypto.deposit - stat.stats.crypto.withdraw) >= 0 }">
            <div class="section-title">CRYPTO</div>
            <div class="section-content">
                ${{ adminFormatValue(stat.stats.crypto.deposit - stat.stats.crypto.withdraw) }}
            </div>
        </div>
        <div class="element-section section-cc" v-bind:class="{ 'section-positive': (stat.stats.credit.deposit - stat.stats.credit.withdraw) >= 0 }">
            <div class="section-title">CC</div>
            <div class="section-content">
                ${{ adminFormatValue(stat.stats.credit.deposit - stat.stats.credit.withdraw) }}
            </div>
        </div>
        <div class="element-section section-profit" v-bind:class="{ 'section-positive': (stat.stats.total.deposit - stat.stats.total.withdraw) >= 0 }">
            <div class="section-title">NET PROFIT</div>
            <div class="section-content">
                ${{ adminFormatValue(stat.stats.total.deposit - stat.stats.total.withdraw) }}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AdminStatsElement',
        props: [
            'stat'
        ],
        methods: {
            adminFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        }
    }
</script>

<style scoped>
    .admin-stats-element {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
        background: rgba(19, 66, 88, 0.25);
    }

    .admin-stats-element:nth-child(even) {
        background: rgba(19, 66, 88, 0.1);
    }

    .admin-stats-element .element-section {
        display: flex;
        flex-direction: column;
    }

    .admin-stats-element .element-section.section-date,
    .admin-stats-element .element-section.section-npc,
    .admin-stats-element .element-section.section-steam,
    .admin-stats-element .element-section.section-gift,
    .admin-stats-element .element-section.section-crypto,
    .admin-stats-element .element-section.section-cc,
    .admin-stats-element .element-section.section-profit {
        width: 10%;
    }

    .admin-stats-element .element-section.section-limiteds,
    .admin-stats-element .element-section.section-robux {
        width: 15%;
    }

    .admin-stats-element .section-title {
        display: none;
        font-size: 13px;
        font-weight: 600;
        color: #8bacc8;
    }

    .admin-stats-element .section-content {
        display: flex;
        align-items: center;
    }

    .admin-stats-element .element-section.section-date .section-content,
    .admin-stats-element .element-section.section-npc .section-content {
        font-size: 14px;
        font-weight: 400;
        color: #bbbfd0;
    }

    .admin-stats-element .element-section.section-steam .section-content,
    .admin-stats-element .element-section.section-gift .section-content,
    .admin-stats-element .element-section.section-crypto .section-content,
    .admin-stats-element .element-section.section-cc .section-content,
    .admin-stats-element .element-section.section-profit .section-content {
        font-size: 14px;
        font-weight: 800;
        color: #f55046;
    }

    .admin-stats-element .element-section.section-profit .section-content {
        justify-content: flex-end;
    }

    .admin-stats-element .element-section.section-limiteds .section-content img,
    .admin-stats-element .element-section.section-robux .section-content img {
        width: 18px;
        height: 18px;
        margin-right: 10px;
    }

    .admin-stats-element .element-section.section-limiteds .content-value,
    .admin-stats-element .element-section.section-robux .content-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .admin-stats-element .element-section.section-limiteds .content-value span,
    .admin-stats-element .element-section.section-robux .content-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .admin-stats-element .element-section.section-steam.section-positive .section-content,
    .admin-stats-element .element-section.section-gift.section-positive .section-content,
    .admin-stats-element .element-section.section-crypto.section-positive .section-content,
    .admin-stats-element .element-section.section-cc.section-positive .section-content,
    .admin-stats-element .element-section.section-profit.section-positive .section-content {
        color: #0dd4b1;
    }

    @media only screen and (max-width: 1250px) {

        .admin-stats-element {
            height: auto;
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 20px;
        }

        .admin-stats-element .element-section {
            width: 100%!important;
            margin-top: 10px;
        }

        .admin-stats-element .element-section.section-date {
            margin-top: 0;
        }

        .admin-stats-element .element-section.section-profit {
            align-items: flex-start;
        }

        .admin-stats-element .section-title {
            display: block;
        }

        .admin-stats-element .section-content {
            margin-top: 5px;
        }

    }
</style>
