const state = {
    upgraderFilterSearch: '',
    upgraderFilterAmount: 'ALL',
    upgraderFilterSort: 'highest',
    upgraderSelected: [],
    upgraderGame: null,
    upgraderItemList: {
        data: null,
        count: null,
        loading: false,
        page: 1
    }
}

const getters = {
    upgraderFilterSearch: state => state.upgraderFilterSearch,
    upgraderFilterAmount: state => state.upgraderFilterAmount,
    upgraderFilterSort: state => state.upgraderFilterSort,
    upgraderSelected: state => state.upgraderSelected,
    upgraderGame: state => state.upgraderGame,
    upgraderItemList: state => state.upgraderItemList
}

const mutations = {
    upgrader_set_filter_search(state, value) {
        state.upgraderFilterSearch = value;
    },
    upgrader_set_filter_amount(state, value) {
        state.upgraderFilterAmount = value;
    },
    upgrader_set_filter_sort(state, value) {
        state.upgraderFilterSort = value;
    },
    upgrader_set_game(state, game) {
        state.upgraderGame = game;
    },
    upgrader_set_item_list(state, data) {
        state.upgraderItemList.data = data.items;
        state.upgraderItemList.count = data.count;
    },
    upgrader_set_item_list_loading(state, status) {
        state.upgraderItemList.loading = status;
    },
    upgrader_set_item_list_page(state, page) {
        state.upgraderItemList.page = page;
    }
}

const actions = {
    upgraderSetFilterSearch({ commit }, value) {
        commit('upgrader_set_filter_search', value);
    },
    upgraderSetFilterAmount({ commit }, value) {
        commit('upgrader_set_filter_amount', value);
    },
    upgraderSetFilterSort({ commit }, value) {
        commit('upgrader_set_filter_sort', value);
    },
    upgraderSetGame({ commit }, game) {
        commit('upgrader_set_game', game);
    },
    upgraderSetItemListPage({ commit }, page) {
        commit('upgrader_set_item_list_page', page);
    },
    upgraderGetItemListSocket({ getters, commit, dispatch }, data) {
        if(getters.socketUpgrader === null || getters.upgraderItemList.loading === true) { return; }
        commit('upgrader_set_item_list_loading', true);

        getters.socketUpgrader.emit('getItemList', data, (res) => {
            if(res.success === true) {
                commit('upgrader_set_item_list', res);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('upgrader_set_item_list_loading', false);
        });
    },
    upgraderSendBetSocket({ getters, commit, dispatch }, data) {
        if(getters.socketUpgrader === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'UpgraderBet');

        getters.socketUpgrader.emit('sendBet', data, (res) => {
            if(res.success === true) {
                commit('auth_update_user', res.user);
                commit('upgrader_set_game', res.game);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    }
}

const upgrader = {
    state,
    mutations,
    actions,
    getters
}

export default upgrader;