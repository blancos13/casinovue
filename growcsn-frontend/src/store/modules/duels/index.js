const state = {
    duelsFilterAnimation: 'normal',
    duelsFilterCount: 2,
    duelsFilterSort: 'HIGHEST PRICE',
    duelsGames: [],
    duelsHistory: [],
    duelsGameData: {
        game: null,
        loading: false
    }
}

const getters = {
    duelsFilterAnimation: state => state.duelsFilterAnimation,
    duelsFilterCount: state => state.duelsFilterCount,
    duelsFilterSort: state => state.duelsFilterSort,
    duelsGames: state => state.duelsGames,
    duelsHistory: state => state.duelsHistory,
    duelsGameData: state => state.duelsGameData
}

const mutations = {
    duels_set_filter_animation(state, value) {
        state.duelsFilterAnimation = value;
    },
    duels_set_filter_count(state, value) {
        state.duelsFilterCount = value;
    },
    duels_set_filter_sort(state, value) {
        state.duelsFilterSort = value;
    },
    duels_set_games(state, games) {
        state.duelsGames = games;
    },
    duels_add_games(state, game) {
        state.duelsGames.push(game);
    },
    duels_update_games(state, game) {
        state.duelsGames.splice(state.duelsGames.findIndex((element) => element._id === game._id), 1, game);
    },
    duels_remove_games(state, game) {
        state.duelsGames.splice(state.duelsGames.findIndex((element) => element._id === game._id), 1);
    },
    duels_set_history(state, history) {
        state.duelsHistory = history;
    },
    duels_add_history(state, game) {
        state.duelsHistory.unshift(game);
    },
    duels_remove_last_history(state, game) {
        state.duelsHistory.pop();
    },
    duels_set_game_data_game(state, game) {
        state.duelsGameData.game = game;
    },
    duels_set_game_data_loading(state, status) {
        state.duelsGameData.loading = status;
    }
}

const actions = {
    duelsSetFilterAnimation({ commit }, value) {
        commit('duels_set_filter_animation', value);
    },
    duelsSetFilterCount({ commit }, value) {
        commit('duels_set_filter_count', value);
    },
    duelsSetFilterSort({ commit }, value) {
        commit('duels_set_filter_sort', value);
    },
    duelsSetGameData({ commit }, game) {
        commit('duels_set_game_data_game', game);
    },
    duelsSocketInit({ commit }, data) {
        commit('duels_set_games', data.games);
        commit('duels_set_history', data.history);
    },
    duelsSocketGame({ getters, commit }, data) {
        if(data.game.state !== 'completed') {
            if(getters.duelsGames.some((element) => element._id === data.game._id) === true) { commit('duels_update_games', data.game); } 
            else { commit('duels_add_games', data.game); }
        } else {
            commit('duels_remove_games', data.game);
            commit('duels_add_history', data.game);
            if(getters.duelsHistory.length > 25) { commit('duels_remove_last_history'); }
        }

        if(getters.duelsGameData.game !== null && getters.duelsGameData.game._id === data.game._id) { commit('duels_set_game_data_game', data.game); }
    },
    duelsGetGameDataSocket({ getters, commit, dispatch }, data) {
        if(getters.socketDuels === null || getters.duelsGameData.loading === true) { return; }
        commit('duels_set_game_data_loading', true);

        getters.socketDuels.emit('getGameData', data, (res) => {
            if(res.success === true) {
                commit('duels_set_game_data_game', res.game);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('duels_set_game_data_loading', false);
        });
    },
    duelsSendCreateSocket({ getters, commit, dispatch }, data) {
        if(getters.socketDuels === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'DuelsCreate');

        getters.socketDuels.emit('sendCreate', data, (res) => {
            if(res.success === false) {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    duelsSendBotSocket({ getters, commit, dispatch }, data) {
        if(getters.socketDuels === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'DuelsBot');

        getters.socketDuels.emit('sendBot', data, (res) => {
            if(res.success === false) {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    duelsSendJoinSocket({ getters, commit, dispatch }, data) {
        if(getters.socketDuels === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'DuelsJoin');

        getters.socketDuels.emit('sendJoin', data, (res) => {
            if(res.success === false) {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    }
}

const duels = {
    state,
    mutations,
    actions,
    getters
}

export default duels;
