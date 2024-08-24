<template>
    <div class="admin-dashboard">
        <div class="admin-profit">

            <AdminProfitElement type="day" v-bind:stats="adminStatsData.data === null ? null : adminStatsData.data.stats.daily" />
            <AdminProfitElement type="week" v-bind:stats="adminStatsData.data === null ? null : adminStatsData.data.stats.weekly" />
            <AdminProfitElement type="month" v-bind:stats="adminStatsData.data === null ? null : adminStatsData.data.stats.monthly" />
            <AdminProfitElement type="overall" v-bind:stats="adminStatsData.data === null ? null : adminStatsData.data.stats.total" />

        </div>
        <div class="admin-growth">
            <div class="growth-header">
                <div class="header-title">GROWTH</div>
                <div class="header-actions">
                    <button v-on:click="adminSetMode('daily')" v-bind:class="{ 'button-active': adminMode === 'daily' }">DAILY</button>
                    <button v-on:click="adminSetMode('weekly')" v-bind:class="{ 'button-active': adminMode === 'weekly' }">WEEKLY</button>
                    <button v-on:click="adminSetMode('monthly')" v-bind:class="{ 'button-active': adminMode === 'monthly' }">MONTHLY</button>
                </div>
            </div>
            <div class="growth-content">
                <div class="content-chart">
                    <LineChart class="chart-graph" v-bind:chartOptions="adminChartOptions" v-bind:chartData="adminGetChartData" v-bind:height="250"  />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import LineChart from '@/components/LineChart';
    import AdminProfitElement from '@/components/admin/AdminProfitElement';

    export default {
        name: 'AdminDashboard',
        components: {
            LineChart,
            AdminProfitElement
        },
        data() {
            return {
                adminMode: 'daily',
                adminChartOptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: false
                    },
                    hover: {
                        mode: null
                    },
                    tooltips: {
                        enabled: false,
                        mode: null
                    },
                    layout: {
                        padding: {
                            top: 25
                        }
                    },
                    scales: {
                        yUsers: {
                            type: 'linear',
                            display: false,
                            grid: { display: false }
                        },
                        yWagered: {
                            type: 'linear',
                            display: false,
                            grid: { display: false }
                        },
                        x: {
                            display: false
                        }
                    }
                }
            }
        },
        methods: {
            ...mapActions([
                'adminGetStatsDataSocket'
            ]),
            adminSetMode(mode) {
                this.adminMode = mode;
            }
        },
        computed: {
            ...mapGetters([
                'generalTimeDiff', 
                'adminStatsData'
            ]),
            adminGetChartData() {
                let data = {
                    labels: [],
                    datasets: [{
                            label: 'USERS',
                            yAxisID: 'yUsers',
                            data: [],
                            fill: true,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: '#01f6f8',
                            pointRadius: 5,
                            pointBorderColor: '#ffffff'
                        }
                    ]
                };

                if(this.adminStatsData.data !== null) {
                    const reports = this.adminMode === 'weekly' ? 7 : this.adminMode === 'monthly' ? 30 : 1; 
                    const dateStart = new Date(new Date().getTime() + this.generalTimeDiff).getTime();

                    for(let p = 0; p < 14; p++) { 
                        let users = 0;

                        for(let r = 0; r < reports; r++) {
                            const secondsPerDay = 1000 * 60 * 60 * 24;
                            const dateReport = new Date(dateStart - secondsPerDay * reports * p - secondsPerDay * r).toLocaleDateString('en-US');

                            if(r === 0) { data.labels.unshift(dateReport); }

                            const index = this.adminStatsData.data.list.findIndex((element) => new Date(element.createdAt).toLocaleDateString('en-US') === dateReport);
                            if(index !== -1) { 
                                users = users + this.adminStatsData.data.list[index].stats.total.user; 
                            }
                        }

                        data.datasets[0].data.unshift(users);
                    }
                }

                return data;
            }
        },
        created() {
            if(this.adminStatsData.loading === false) {
                const data = {};
                this.adminGetStatsDataSocket(data);
            }
        }
    }
</script>

<style scoped>
    .admin-dashboard {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .admin-dashboard .admin-profit {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .admin-dashboard .admin-growth {
        width: 100%;
        margin-top: 30px;
    }

    .admin-dashboard .growth-header {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .admin-dashboard .growth-header:before {
        content: '';
        height: 1px;
        position: absolute;
        top: 16px;
        left: 135px;
        right: 273px;
        background: #0c324e;
    }

    .admin-dashboard .header-title {
        font-size: 24px;
        font-weight: 800;
        color: #ffffff;
    }

    .admin-dashboard .header-actions {
        display: flex;
        align-items: center;
    }

    .admin-dashboard .header-actions button {
        margin-right: 22px;
        font-size: 16px;
        font-weight: 700;
        color: #7a93ac;
        transition: color 0.3s ease;
    }

    .admin-dashboard .header-actions button:last-of-type {
        margin-right: 0;
    }

    .admin-dashboard .header-actions button.button-active {
        color: #ffffff;
    }

    .admin-dashboard .growth-content {
        width: 100%;
        height: 250px;
        margin-top: 25px;
        border-radius: 15px;
        background: radial-gradient(180% 125% at 50% 15%, rgba(3, 43, 79, 0) 0%, #00284b 100%);
        border: 1px solid #123e62;
        overflow: hidden;
    }

    .admin-dashboard .content-chart {
        width: 100%;
        height: 100%;
        position: relative;
        background: repeating-linear-gradient(#014469 0 1px, transparent 1px 100%),
                    repeating-linear-gradient(90deg, #014469 0 1px, transparent 1px 100%);
        background-size: 7.69% 41.66px;
    }

    .admin-dashboard .chart-graph {
        position: absolute;
        top: 0;
        bottom: -6px;
        left: -6px;
        right: -6px;
    }

    @media only screen and (max-width: 550px) {

        .admin-dashboard .growth-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .admin-dashboard .growth-header:before {
            right: 0;
        }

        .admin-dashboard .header-actions {
            margin-top: 17px;
        }

    }
</style>
