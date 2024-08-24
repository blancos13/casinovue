import router from '../../../router';

const state = {
    battlesFilterSortGames: 'date',
    battlesFilterSortCases: 'highest',
    battlesFilterSearch: '',
    battlesFilterPrice: 'ALL',
    battlesFilterMode: '1v1',
    battlesFilterType: 'standard',
    battlesFilterLevel: 0,
    battlesFilterFunding: 0,
    battlesFilterPrivate: false,
    battlesFilterAffiliate: false,
    battlesFilterCursed: false,
    battlesFilterTerminal: false,
    battlesBoxes: [],
    battlesGames: [],
    battlesHistory: [],
    battlesSelected: [],
    battlesGameData: {
        game: null,
        loading: false
    }
}

const getters = {
    battlesFilterSortGames: state => state.battlesFilterSortGames,
    battlesFilterSortCases: state => state.battlesFilterSortCases,
    battlesFilterSearch: state => state.battlesFilterSearch,
    battlesFilterPrice: state => state.battlesFilterPrice,
    battlesFilterMode: state => state.battlesFilterMode,
    battlesFilterType: state => state.battlesFilterType,
    battlesFilterLevel: state => state.battlesFilterLevel,
    battlesFilterFunding: state => state.battlesFilterFunding,
    battlesFilterPrivate: state => state.battlesFilterPrivate,
    battlesFilterAffiliate: state => state.battlesFilterAffiliate,
    battlesFilterCursed: state => state.battlesFilterCursed,
    battlesFilterTerminal: state => state.battlesFilterTerminal,
    battlesBoxes: state => state.battlesBoxes,
    battlesGames: state => state.battlesGames,
    battlesHistory: state => state.battlesHistory,
    battlesSelected: state => state.battlesSelected,
    battlesGameData: state => state.battlesGameData
}

const mutations = {
    battles_set_filter_sort_games(state, value) {
        state.battlesFilterSortGames = value;
    },
    battles_set_filter_sort_cases(state, value) {
        state.battlesFilterSortCases = value;
    },
    battles_set_filter_search(state, value) {
        state.battlesFilterSearch = value;
    },
    battles_set_filter_price(state, value) {
        state.battlesFilterPrice = value;
    },
    battles_set_filter_mode(state, value) {
        state.battlesFilterMode = value;
    },
    battles_set_filter_type(state, value) {
        state.battlesFilterType = value;
    },
    battles_set_filter_level(state, value) {
        state.battlesFilterLevel = value;
    },
    battles_set_filter_funding(state, value) {
        state.battlesFilterFunding = value;
    },
    battles_set_filter_private(state, value) {
        state.battlesFilterPrivate = value;
    },
    battles_set_filter_affiliate(state, value) {
        state.battlesFilterAffiliate = value;
    },
    battles_set_filter_cursed(state, value) {
        state.battlesFilterCursed = value;
    },
    battles_set_filter_terminal(state, value) {
        state.battlesFilterTerminal = value;
    },
    battles_set_boxes(state, boxes) {
        state.battlesBoxes = boxes;
    },
    battles_set_games(state, games) {
        state.battlesGames = games;
    },
    battles_add_games(state, game) {
        state.battlesGames.push(game);
    },
    battles_update_games(state, game) {
        state.battlesGames.splice(state.battlesGames.findIndex((element) => element._id === game._id), 1, game);
    },
    battles_remove_games(state, game) {
        state.battlesGames.splice(state.battlesGames.findIndex((element) => element._id === game._id), 1);
    },
    battles_set_history(state, history) {
        state.battlesHistory = history;
    },
    battles_add_history(state, game) {
        state.battlesHistory.unshift(game);
    },
    battles_remove_last_history(state, game) {
        state.battlesHistory.pop();
    },
    battles_add_selected(state, box) {
        state.battlesSelected.push(box);
    },
    battles_remove_selected(state, index) {
        state.battlesSelected.splice(index, 1);
    },
    battles_empty_selected(state) {
        state.battlesSelected = [];
    },
    battles_set_game_data_game(state, game) {
        state.battlesGameData.game = game;
    },
    battles_set_game_data_loading(state, status) {
        state.battlesGameData.loading = status;
    }
}

const actions = {
    battlesSetFilterSortGames({ commit }, value) {
        commit('battles_set_filter_sort_games', value);
    },
    battlesSetFilterSortCases({ commit }, value) {
        commit('battles_set_filter_sort_cases', value);
    },
    battlesSetFilterSearch({ commit }, value) {
        commit('battles_set_filter_search', value);
    },
    battlesSetFilterPrice({ commit }, value) {
        commit('battles_set_filter_price', value);
    },
    battlesSetFilterMode({ commit }, value) {
        commit('battles_set_filter_mode', value);
    },
    battlesSetFilterType({ commit }, value) {
        commit('battles_set_filter_type', value);
    },
    battlesSetFilterLevel({ commit }, value) {
        commit('battles_set_filter_level', value);
    },
    battlesSetFilterFunding({ commit }, value) {
        commit('battles_set_filter_funding', value);
    },
    battlesSetFilterPrivate({ commit }, value) {
        commit('battles_set_filter_private', value);
    },
    battlesSetFilterAffiliate({ commit }, value) {
        commit('battles_set_filter_affiliate', value);
    },
    battlesSetFilterCursed({ commit }, value) {
        commit('battles_set_filter_cursed', value);
    },
    battlesSetFilterTerminal({ commit }, value) {
        commit('battles_set_filter_terminal', value);
    },
    battlesResetFilter({ commit }) {
        commit('battles_set_filter_mode', '1v1');
        commit('battles_set_filter_type', 'standard');
        commit('battles_set_filter_level', 0);
        commit('battles_set_filter_funding', 0);
        commit('battles_set_filter_private', false);
        commit('battles_set_filter_affiliate', false);
        commit('battles_set_filter_cursed', false);
        commit('battles_set_filter_terminal', false);
        commit('battles_empty_selected');
    },
    battlesAddSelected({ commit }, item) {
        commit('battles_add_selected', item);
    },
    battlesRemoveSelected({ getters, commit }, box) {
        const index = getters.battlesSelected.findIndex((element) => element._id === box._id);
        if(index !== -1) { commit('battles_remove_selected', index); }
    },
    battlesEmptySelected({ commit }) {
        commit('battles_empty_selected');
    },
    battlesSetGameData({ commit }, game) {
        commit('battles_set_game_data_game', game);
    },
    battlesSocketInit({ commit }, data) {
        commit('battles_set_boxes', data.boxes);
        commit('battles_set_history', data.history);
        commit('battles_set_games', data.games);
    },
    battlesSocketGame({ getters, commit }, data) {
        if(data.game.options.private === false) {
            if(data.game.state !== 'completed') {
                if(getters.battlesGames.some((element) => element._id === data.game._id) === true) { commit('battles_update_games', data.game); }
                else { commit('battles_add_games', data.game); }
            } else {
                commit('battles_remove_games', data.game);
                commit('battles_add_history', data.game);
                if(getters.battlesHistory.length > 4) { commit('battles_remove_last_history'); }
            }
        }

        if(getters.battlesGameData.game !== null && getters.battlesGameData.game._id === data.game._id) { commit('battles_set_game_data_game', { ...data.game, boxes: getters.battlesGameData.game.boxes }); }
    },
    battlesGetGameDataSocket({ getters, commit, dispatch }, data) {
        if(getters.socketBattles === null || getters.battlesGameData.loading === true) { return; }
        commit('battles_set_game_data_loading', true);

        getters.socketBattles.emit('getGameData', data, (res) => {
            if(res.success === true) {
                commit('battles_set_game_data_game', res.game);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('battles_set_game_data_loading', false);
        });
    },
    battlesSendCreateSocket({ getters, commit, dispatch }, data) {
        if(getters.socketBattles === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'BattlesCreate');

        getters.socketBattles.emit('sendCreate', data, (res) => {
            if(res.success === true) {
                dispatch('modalsSetShow', null);
                router.push({ path: '/battles/' + res.game._id });
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    battlesSendBotSocket({ getters, commit, dispatch }, data) {
        if(getters.socketBattles === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'BattlesBot');

        getters.socketBattles.emit('sendBot', data, (res) => {
            if(res.success === true) {
                
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    battlesSendJoinSocket({ getters, commit, dispatch }, data) {
        if(getters.socketBattles === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'BattlesJoin');

        getters.socketBattles.emit('sendJoin', data, (res) => {
            if(res.success === true) {
                router.push({ path: '/battles/' + data.gameId });
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    }
}

const battles = {
    state,
    mutations,
    actions,
    getters
}

export default battles;