const state = {
    blackjackRecent: null,
    blackjackTables: []
}

const getters = {
    blackjackRecent: state => state.blackjackRecent,
    blackjackTables: state => state.blackjackTables
}

const mutations = {
    blackjack_set_recent(state, bets) {
        state.blackjackRecent = bets;
    },
    blackjack_set_tables(state, tables) {
        state.blackjackTables = tables;
    },
    blackjack_update_table(state, table) {
        state.blackjackTables.splice(state.blackjackTables.findIndex((element) => element.table === table.table), 1, table);
    }
}

const actions = {
    blackjackSocketInit({ commit }, data) {
        commit('blackjack_set_tables', data.tables);
    },
    blackjackSocketTable({ getters, commit }, data) {
        if(data.table.game.state === 'completed' && getters.authUser.user !== null) { 
            commit('blackjack_set_recent', data.table.players.filter((element) => element.user._id === getters.authUser.user._id).map((element) => ({
                seat: element.bet.seat,
                amount: element.bet.amount
            })));
        }
        commit('blackjack_update_table', data.table);
    },
    blackjackSendJoinSocket({ getters, commit, dispatch }, data) {
        if(getters.socketBlackjack === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'BlackjackJoin');

        getters.socketBlackjack.emit('sendJoin', data, (res) => {
            if(res.success === false) {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    blackjackSendBetSocket({ getters, commit, dispatch }, data) {
        if(getters.socketBlackjack === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'BlackjackBet');

        getters.socketBlackjack.emit('sendBet', data, (res) => {
            if(res.success === true) {
                commit('auth_update_user', res.user);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    blackjackSendClearSocket({ getters, commit, dispatch }, data) {
        if(getters.socketBlackjack === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'BlackjackClear');

        getters.socketBlackjack.emit('sendClear', data, (res) => {
            if(res.success === true) {
                commit('auth_update_user', res.user);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    blackjackSendInsuranceSocket({ getters, commit, dispatch }, data) {
        if(getters.socketBlackjack === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'BlackjackInsurance');

        getters.socketBlackjack.emit('sendInsurance', data, (res) => {
            if(res.success === false) {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    blackjackSendHitSocket({ getters, commit, dispatch }, data) {
        if(getters.socketBlackjack === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'BlackjackHit');

        getters.socketBlackjack.emit('sendHit', data, (res) => {
            if(res.success === false) {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    blackjackSendStandSocket({ getters, commit, dispatch }, data) {
        if(getters.socketBlackjack === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'BlackjackStand');

        getters.socketBlackjack.emit('sendStand', data, (res) => {
            if(res.success === false) {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    blackjackSendSplitSocket({ getters, commit, dispatch }, data) {
        if(getters.socketBlackjack === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'BlackjackSplit');

        getters.socketBlackjack.emit('sendSplit', data, (res) => {
            if(res.success === false) {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    blackjackSendDoubleSocket({ getters, commit, dispatch }, data) {
        if(getters.socketBlackjack === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'BlackjackDouble');

        getters.socketBlackjack.emit('sendDouble', data, (res) => {
            if(res.success === false) {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    }
}

const blackjack = {
    state,
    mutations,
    actions,
    getters
}

export default blackjack;
