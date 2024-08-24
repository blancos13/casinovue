const state = {
    modalsShow: null,
    modalsData: null
}

const getters = {
    modalsShow: state => state.modalsShow,
    modalsData: state => state.modalsData
}

const mutations = {
    modals_set_show(state, value) {
        state.modalsShow = value;
    },
    modals_set_data(state, value) {
        state.modalsData = value;
    }
}

const actions = {
    modalsSetShow({ commit }, value) {
        commit('modals_set_show', value);
    },
    modalsSetData({ commit }, value) {
        commit('modals_set_data', value);
    }
}

const modals = {
    state,
    mutations,
    actions,
    getters
}

export default modals;
