const state = {
    rollRecent: [],
    rollGame: null,
    rollBets: [],
    rollHistory: []
}

const getters = {
    rollRecent: state => state.rollRecent,
    rollGame: state => state.rollGame,
    rollBets: state => state.rollBets,
    rollHistory: state => state.rollHistory
}

const mutations = {
    roll_set_recent(state, bets) {
        state.rollRecent = bets;
    },
    roll_add_recent(state, bet) {
        state.rollRecent.unshift(bet);
    },
    roll_set_game(state, game) {
        state.rollGame = game;
    },
    roll_set_bets(state, bets) {
        state.rollBets = bets;
    },
    roll_add_bets(state, bet) {
        state.rollBets.unshift(bet);
    },
    roll_set_history(state, history) {
        state.rollHistory = history;
    },
    roll_add_history(state, game) {
        state.rollHistory.unshift(game);
    },
    roll_remove_last_history(state) {
        state.rollHistory.pop();
    }
}

const actions = {
    rollSocketInit({ commit }, data) {
        commit('roll_set_game', data.game);
        commit('roll_set_bets', data.bets);
        commit('roll_set_history', data.history);
    },
    rollSocketGame({ getters, commit }, data) {
        commit('roll_set_game', data.game);

        if(data.game.state === 'completed') {
            commit('roll_add_history', data.game);
            if(getters.rollHistory.length > 25) { commit('roll_remove_last_history'); }
        } else if(data.game.state === 'created') {
            if(getters.authUser.user !== null) { commit('roll_set_recent', getters.rollBets.filter((element) => element.user._id === getters.authUser.user._id)); }
            commit('roll_set_bets', []);
        }
    },
    rollSocketBet({ commit }, data) {
        commit('roll_add_bets', data.bet);
    },
    rollSendBetSocket({ getters, commit, dispatch }, data) {
        if(getters.socketRoll === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'RollBet');

        getters.socketRoll.emit('sendBet', data, (res) => {
            if(res.success === true) {
                commit('auth_update_user', res.user);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    }
}

const roll = {
    state,
    mutations,
    actions,
    getters
}

export default roll;
