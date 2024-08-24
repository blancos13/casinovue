const state = {
    unboxFilterSearch: '',
    unboxFilterSort: 'highest',
    unboxFilterSelect: 'featured',
    unboxCount: 1,
    unboxRunning: false,
    unboxBoxes: [],
    unboxGames: [],
    unboxBoxData: {
        box: null,
        loading: false
    }
}

const getters = {
    unboxFilterSearch: state => state.unboxFilterSearch,
    unboxFilterSort: state => state.unboxFilterSort,
    unboxFilterSelect: state => state.unboxFilterSelect,
    unboxCount: state => state.unboxCount,
    unboxRunning: state => state.unboxRunning,
    unboxBoxes: state => state.unboxBoxes,
    unboxGames: state => state.unboxGames,
    unboxBoxData: state => state.unboxBoxData
}

const mutations = {
    unbox_set_filter_search(state, value) {
        state.unboxFilterSearch = value;
    },
    unbox_set_filter_sort(state, value) {
        state.unboxFilterSort = value;
    },
    unbox_set_filter_select(state, value) {
        state.unboxFilterSelect = value;
    },
    unbox_set_count(state, value) {
        state.unboxCount = value;
    },
    unbox_set_running(state, value) {
        state.unboxRunning = value;
    },
    unbox_set_boxes(state, boxes) {
        state.unboxBoxes = boxes;
    },
    unbox_set_games(state, games) {
        state.unboxGames = games;
    },
    unbox_set_game_data_box(state, box) {
        state.unboxBoxData.box = box;
    },
    unbox_set_game_data_loading(state, status) {
        state.unboxBoxData.loading = status;
    }
}

const actions = {
    unboxSetFilterSearch({ commit }, value) {
        commit('unbox_set_filter_search', value);
    },
    unboxSetFilterSort({ commit }, value) {
        commit('unbox_set_filter_sort', value);
    },
    unboxSetFilterSelect({ commit }, value) {
        commit('unbox_set_filter_select', value);
    },
    unboxSetCount({ commit }, value) {
        commit('unbox_set_count', value);
    },
    unboxSetRunnning({ commit }, value) {
        commit('unbox_set_running', value);
    },
    unboxSetGames({ commit }, games) {
        commit('unbox_set_games', games);
    },
    unboxSocketInit({ commit }, data) {
        commit('unbox_set_boxes', data.boxes);
    },
    unboxGetBoxDataSocket({ getters, commit, dispatch }, data) {
        if(getters.socketUnbox === null || getters.unboxBoxData.loading === true) { return; }
        commit('unbox_set_game_data_loading', true);

        getters.socketUnbox.emit('getBoxData', data, (res) => {
            if(res.success === true) {
                commit('unbox_set_game_data_box', res.box);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('unbox_set_game_data_loading', false);
        });
    },
    unboxSendBetSocket({ getters, commit, dispatch }, data) {
        if(getters.socketUnbox === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'UnboxBet');

        getters.socketUnbox.emit('sendBet', data, (res) => {
            if(res.success === true) {
                commit('auth_update_user', res.user);
                commit('unbox_set_games', res.games);
                commit('unbox_set_running', true);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    }
}

const unbox = {
    state,
    mutations,
    actions,
    getters
}

export default unbox;