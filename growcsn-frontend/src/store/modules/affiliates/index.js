const state = {
    affiliatesData: {
        data: null,
        referred: null,
        loading: false
    }
}

const getters = {
    affiliatesData: state => state.affiliatesData
}

const mutations = {
    affiliates_set_data_data(state, data) {
        state.affiliatesData.data = data;
    },
    affiliates_set_data_referred(state, referred) {
        state.affiliatesData.referred = referred;
    },
    affiliates_set_data_loading(state, status) {
        state.affiliatesData.loading = status;
    }
}

const actions = {
    affiliatesGetDataSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.affiliatesData.loading === true) { return; }
        commit('affiliates_set_data_loading', true);

        getters.socketGeneral.emit('getAffiliateData', data, (res) => {
            if(res.success === true) {
                commit('affiliates_set_data_data', res.data);
                commit('affiliates_set_data_referred', res.referred);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('affiliates_set_data_loading', false);
        });
    },
    affiliatesSendCodeSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'AffiliatesCode');

        getters.socketGeneral.emit('sendAffiliateCode', data, (res) => {
            if(res.success === true) {
                commit('affiliates_set_data_data', res.data);
                
                dispatch('notificationShow', { type: 'success', message: 'You have successfully updated your affiliate code.' });
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    affiliatesSendClaimCodeSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'AffiliatesClaimCode');

        getters.socketGeneral.emit('sendAffiliateClaimCode', data, (res) => {
            if(res.success === true) {
                commit('auth_update_user', res.user);

                dispatch('notificationShow', { type: 'success', message: 'You have successfully claimed a affiliate code.' });
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    affiliatesSendClaimEarningsSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'AffiliatesClaimEarnings');

        getters.socketGeneral.emit('sendAffiliateClaimEarnings', data, (res) => {
            if(res.success === true) {
                commit('auth_update_user', res.user);
                commit('affiliates_set_data_data', res.user.affiliates);

                dispatch('notificationShow', { type: 'success', message: 'You have successfully claimed your affiliate earnings.' });
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    }
}

const affiliates = {
    state,
    mutations,
    actions,
    getters
}

export default affiliates;
