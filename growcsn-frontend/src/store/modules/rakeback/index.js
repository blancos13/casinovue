const state = {
    rakebackData: {
        boxes: null,
        loading: false
    }
}

const getters = {
    rakebackData: state => state.rakebackData
}

const mutations = {
    rakeback_set_data(state, data) {
        state.rakebackData.boxes = data.boxes;
    },
    rakeback_set_data_loading(state, status) {
        state.rakebackData.loading = status;
    }
}

const actions = {
    rakebackGetDataSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.rakebackData.loading === true) { return; }
        commit('rakeback_set_data_loading', true);

        getters.socketGeneral.emit('getRakebackData', data, (res) => {
            if(res.success === true) {
                commit('rakeback_set_data', res);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('rakeback_set_data_loading', false);
        });
    },
    rakebackSendClaimSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'RakebackClaim');

        getters.socketGeneral.emit('sendRakebackClaim', data, (res) => {
            if(res.success === true) {
                commit('auth_update_user', res.user);
                
                dispatch('notificationShow', { type: 'success', message: 'You have successfully claimed your rakeback earnings.' });
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    }
}

const rakeback = {
    state,
    mutations,
    actions,
    getters
}

export default rakeback;
