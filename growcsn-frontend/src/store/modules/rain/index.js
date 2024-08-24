const state = {
    rainDropdownTip: false
}

const getters = {
    rainDropdownTip: state => state.rainDropdownTip
}

const mutations = {
    rain_set_dropdown_tip(state, value) {
        state.rainDropdownTip = value;
    }
}

const actions = {
    rainSetDropdownTip({ commit }, value) {
        commit('rain_set_dropdown_tip', value);
    },
    rainPayoutSocket({ dispatch }, data) {
        dispatch('notificationShow', { type: 'success', message: 'You\'ve received ' + (Math.floor(data.transaction.amount / 10) / 100).toFixed(2) + ' Robux from the rain.' });
    }
}

const rain = {
    state,
    mutations,
    actions,
    getters
}

export default rain;
