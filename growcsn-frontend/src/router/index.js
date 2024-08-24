import Vue from 'vue';
import VueRouter from 'vue-router';

// Load vuex store
import store from '../store';

// Load route views
import Home from '../views/Home';
import Crash from '../views/Crash';
import Roll from '../views/Roll';
import Blackjack from '../views/blackjack/Blackjack';
import BlackjackOverview from '../views/blackjack/BlackjackOverview';
import BlackjackTables from '../views/blackjack/BlackjackTables';
import BlackjackTable from '../views/blackjack/BlackjackTable';
import Duels from '../views/Duels';
import Mines from '../views/Mines';
import Towers from '../views/Towers';
import Unbox from '../views/unbox/Unbox';
import UnboxOverview from '../views/unbox/UnboxOverview';
import UnboxBox from '../views/unbox/UnboxBox';
import Battles from '../views/battles/Battles';
import BattlesOverview from '../views/battles/BattlesOverview';
import BattlesGame from '../views/battles/BattlesGame';
import BattlesCreate from '../views/battles/BattlesCreate';
import Upgrader from '../views/Upgrader';
import Limiteds from '../views/limiteds/Limiteds';
import LimitedsDeposit from '../views/limiteds/LimitedsDeposit';
import LimitedsWithdraw from '../views/limiteds/LimitedsWithdraw';
import Leaderboard from '../views/Leaderboard';

const Profile = () => import(/* webpackChunkName: "group-user" */ '../views/profile/Profile');
const ProfileTransactions = () => import(/* webpackChunkName: "group-user" */ '../views/profile/ProfileTransactions');
const ProfileGames = () => import(/* webpackChunkName: "group-user" */ '../views/profile/ProfileGames');
const ProfileSettings = () => import(/* webpackChunkName: "group-user" */ '../views/profile/ProfileSettings');
const Rewards = () => import(/* webpackChunkName: "group-user" */ '../views/Rewards');
const Affiliates = () => import(/* webpackChunkName: "group-user" */ '../views/Affiliates');

const Admin = () => import(/* webpackChunkName: "group-admin" */ '../views/admin/Admin');
const AdminDashboard = () => import(/* webpackChunkName: "group-admin" */ '../views/admin/AdminDashboard');
const AdminUsers = () => import(/* webpackChunkName: "group-admin" */ '../views/admin/AdminUsers');
const AdminAffiliates = () => import(/* webpackChunkName: "group-admin" */ '../views/admin/AdminAffiliates');
const AdminPromo = () => import(/* webpackChunkName: "group-admin" */ '../views/admin/AdminPromo');
const AdminCashier = () => import(/* webpackChunkName: "group-admin" */ '../views/admin/AdminCashier');
const AdminBoxes = () => import(/* webpackChunkName: "group-admin" */ '../views/admin/AdminBoxes');
const AdminRain = () => import(/* webpackChunkName: "group-admin" */ '../views/admin/AdminRain');
const AdminLeaderboards = () => import(/* webpackChunkName: "group-admin" */ '../views/admin/AdminLeaderboards');
const AdminFilter = () => import(/* webpackChunkName: "group-admin" */ '../views/admin/AdminFilter');
const AdminStats = () => import(/* webpackChunkName: "group-admin" */ '../views/admin/AdminStats');
const AdminSettings = () => import(/* webpackChunkName: "group-admin" */ '../views/admin/AdminSettings');

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/crash',
        name: 'Crash',
        component: Crash
    },
    {
        path: '/roll',
        name: 'Roll',
        component: Roll
    },
    {
        path: '/blackjack',
        component: Blackjack,
        children: [
            {
                path: '',
                name: 'BlackjackOverview',
                component: BlackjackOverview
            },
            {
                path: 'tables',
                name: 'BlackjackTables',
                component: BlackjackTables
            },
            {
                path: 'table/:tableId',
                name: 'BlackjackTable',
                component: BlackjackTable
            }
        ]
    },
    {
        path: '/duels',
        name: 'Duels',
        component: Duels
    },
    {
        path: '/mines',
        name: 'Mines',
        component: Mines
    },
    {
        path: '/towers',
        name: 'Towers',
        component: Towers
    },
    {
        path: '/unbox',
        component: Unbox,
        children: [
            {
                path: '',
                name: 'UnboxOverview',
                component: UnboxOverview
            },
            {
                path: ':boxId',
                name: 'UnboxBox',
                component: UnboxBox
            }
        ]
    },
    {
        path: '/battles',
        component: Battles,
        children: [
            {
                path: '',
                name: 'BattlesOverview',
                component: BattlesOverview
            },
            {
                path: 'create',
                name: 'BattlesCreate',
                meta: {
                    auth: true
                },
                component: BattlesCreate
            },
            {
                path: ':gameId',
                name: 'BattlesGame',
                component: BattlesGame
            }
        ]
    },
    {
        path: '/upgrader',
        name: 'Upgrader',
        component: Upgrader
    },
    {
        path: '/limiteds',
        component: Limiteds,
        meta: {
            auth: true
        },
        children: [
            {
                path: 'deposit',
                name: 'LimitedsDeposit',
                component: LimitedsDeposit
            },
            {
                path: 'withdraw',
                name: 'LimitedsWithdraw',
                component: LimitedsWithdraw
            }
        ]
    },
    {
        path: '/profile',
        component: Profile,
        meta: {
            auth: true
        },
        children: [
            {
                path: '',
                name: 'ProfileTransactions',
                component: ProfileTransactions
            },
            {
                path: 'games',
                name: 'ProfileGames',
                component: ProfileGames
            },
            {
                path: 'settings',
                name: 'ProfileSettings',
                component: ProfileSettings
            }
        ]
    },
    {
        path: '/rewards',
        name: 'Rewards',
        meta: {
            auth: true
        },
        component: Rewards
    },
    {
        path: '/affiliates',
        name: 'Affiliates',
        meta: {
            auth: true
        },
        component: Affiliates
    },
    {
        path: '/leaderboard',
        name: 'Leaderboard',
        component: Leaderboard
    },
    {
        path: '/admin',
        component: Admin,
        meta: {
            auth: true,
            admin: true
        },
        children: [
            {
                path: '',
                name: 'AdminDashboard',
                component: AdminDashboard
            },
            {
                path: 'users',
                name: 'AdminUsers',
                component: AdminUsers
            },
            {
                path: 'affiliates',
                name: 'AdminAffiliates',
                component: AdminAffiliates
            },
            {
                path: 'promo',
                name: 'AdminPromo',
                component: AdminPromo
            },
            {
                path: 'cashier',
                name: 'AdminCashier',
                component: AdminCashier
            },
            {
                path: 'boxes',
                name: 'AdminBoxes',
                component: AdminBoxes
            },
            {
                path: 'rain',
                name: 'AdminRain',
                component: AdminRain
            },
            {
                path: 'leaderboard',
                name: 'AdminLeaderboard',
                component: AdminLeaderboards
            },
            {
                path: 'filter',
                name: 'AdminFilter',
                component: AdminFilter
            },
            {
                path: 'stats',
                name: 'AdminStats',
                component: AdminStats
            }, 
            {
                path: 'settings',
                name: 'AdminSettings',
                component: AdminSettings
            }
        ]
    },
    {
        path: '/verify',
        beforeEnter: (to, from, next) => {
            const data = { userId: to.query.userId, token: to.query.token };
            store.dispatch('authSendCredentialsVerify', data);

            next('/');
        }
    },
    {
        path: '/reset',
        beforeEnter: (to, from, next) => {
            store.dispatch('modalsSetData', { userId: to.query.userId, token: to.query.token });
            store.dispatch('modalsSetShow', 'Reset');

            next('/');
        }
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach(async function(to, from, next) {
    if(store.getters.authToken !== null && store.getters.authUser.user === null && store.getters.authUser.loading === false) {
        await store.dispatch('authGetUser');
    }

    const affiliateCode = to.query.a !== undefined ? to.query.a : localStorage.getItem('affiliate-code') !== null ? localStorage.getItem('affiliate-code') : null;
    if(affiliateCode !== null) {
        if(store.getters.authUser.user !== null) {
            localStorage.removeItem('affiliate-code');
            store.dispatch('modalsSetData', { code: affiliateCode });
            store.dispatch('modalsSetShow', 'Claim');
        } else { localStorage.setItem('affiliate-code', affiliateCode); }
    }

    if(to.matched.some(record => record.meta.auth) && store.getters.authUser.user === null) {
        next(false);
    } else if(to.matched.some(record => record.meta.admin) && (store.getters.authUser.user === null || store.getters.authUser.user.rank !== 'admin')) {
        next(false);
    } else {
        next();
    }
});


export default router;
