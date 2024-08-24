const state = {
    leaderboardData: {
        data: null,
        loading: false,
        loadedAt: null
    }
}

const getters = {
    leaderboardData: state => state.leaderboardData
}

const mutations = {
    leaderboard_set_data(state, data) {
        state.leaderboardData.data = data.leaderboard;
        state.leaderboardData.loadedAt = new Date().getTime();
    },
    leaderboard_set_data_loading(state, status) {
        state.leaderboardData.loading = status;
    }
}

const actions = {
    leaderboardGetDataSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.leaderboardData.loading === true) { return; }
        commit('leaderboard_set_data_loading', true);

        getters.socketGeneral.emit('getLeaderboardData', data, (res) => {
            if(res.success === true) {
                commit('leaderboard_set_data', res);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('leaderboard_set_data_loading', false);
        });
    }
}

const leaderboard = {
    state,
    mutations,
    actions,
    getters
}

export default leaderboard;