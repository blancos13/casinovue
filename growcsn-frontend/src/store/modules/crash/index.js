const state = {
    crashGame: null,
    crashMultiplier: 1,
    crashBets: [],
    crashHistory: []
}

const getters = {
    crashGame: state => state.crashGame,
    crashMultiplier: state => state.crashMultiplier,
    crashBets: state => state.crashBets,
    crashHistory: state => state.crashHistory
}

const mutations = {
    crash_set_game(state, game) {
        state.crashGame = game;
    },
    crash_set_multiplier(state, multiplier) {
        state.crashMultiplier = multiplier;
    },
    crash_set_bets(state, bets) {
        state.crashBets = bets;
    },
    crash_add_bets(state, bet) {
        state.crashBets.unshift(bet);
    },
    crash_update_bets(state, bet) {
        state.crashBets.splice(state.crashBets.findIndex((element) => element._id === bet._id), 1, bet);
    },
    crash_set_history(state, history) {
        state.crashHistory = history;
    },
    crash_add_history(state, game) {
        state.crashHistory.unshift(game);
    },
    crash_remove_last_history(state) {
        state.crashHistory.pop();
    }
}

const actions = {
    crashSocketInit({ commit }, data) {
        commit('crash_set_game', data.game);
        commit('crash_set_bets', data.bets);
        commit('crash_set_history', data.history);
    },
    crashSocketGame({ commit }, data) {
        commit('crash_set_game', data.game);

        if(data.game.state === 'completed') {
            commit('crash_add_history', data.game);
            if(getters.crashHistory.length > 25) { commit('crash_remove_last_history'); }

            commit('crash_set_multiplier', 1);
        } else if(data.game.state === 'created') {
            commit('crash_set_bets', []);
        }
    },
    crashSocketTick({ commit }, data) {
        commit('crash_set_multiplier', data.multiplier);
    },
    crashSocketBet({ getters, commit }, data) {
        if(getters.crashBets.some((element) => element._id === data.bet._id) === true) {
            commit('crash_update_bets', data.bet);
        } else {
            commit('crash_add_bets', data.bet);
        }
    },
    crashSendBetSocket({ getters, commit, dispatch }, data) {
        if(getters.socketCrash === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'CrashBet');

        getters.socketCrash.emit('sendBet', data, (res) => {
            if(res.success === true) {
                commit('auth_update_user', res.user);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    crashSendCashoutSocket({ getters, commit, dispatch }, data) {
        if(getters.socketCrash === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'CrashCashout');

        getters.socketCrash.emit('sendCashout', data, (res) => {
            if(res.success === false) {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    }
}

const crash = {
    state,
    mutations,
    actions,
    getters
}

export default crash;
