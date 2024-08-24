import Vue from 'vue';
import Vuex from 'vuex';

import modals from './modules/modals';
import notifications from './modules/notifications';
import sound from './modules/sound';
import socket from './modules/socket';
import auth from './modules/auth';
import general from './modules/general';
import user from './modules/user';
import chat from './modules/chat';
import rain from './modules/rain';
import crash from './modules/crash';
import roll from './modules/roll';
import blackjack from './modules/blackjack';
import duels from './modules/duels';
import mines from './modules/mines';
import towers from './modules/towers';
import unbox from './modules/unbox';
import battles from './modules/battles';
import upgrader from './modules/upgrader';
import cashier from './modules/cashier';
import rakeback from './modules/rakeback';
import affiliates from './modules/affiliates';
import leaderboard from './modules/leaderboard';
import admin from './modules/admin';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        modals,
        notifications,
        sound,
        socket,
        auth,
        general,
        user,
        chat,
        rain,
        crash,
        roll,
        blackjack,
        duels,
        mines,
        towers,
        unbox,
        battles,
        upgrader,
        cashier,
        rakeback,
        affiliates,
        leaderboard,
        admin
    }
});
