const state = {
    towersRisk: 'easy',
    towersGame: null
}

const getters = {
    towersRisk: state => state.towersRisk,
    towersGame: state => state.towersGame
}

const mutations = {
    towers_set_risk(state, value) {
        state.towersRisk = value;
    },
    towers_set_game(state, game) {
        state.towersGame = game;
    }
}

const actions = {
    towersSetRisk({ commit }, value) {
        commit('towers_set_game', null);
        commit('towers_set_risk', value);
    },
    towersClearGame({ commit }) {
        commit('towers_set_game', null);
    },
    towersSocketInit({ commit }, data) {
        commit('towers_set_game', data.game);
    },
    towersSendBetSocket({ getters, commit, dispatch }, data) {
        if(getters.socketTowers === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'TowersBet');

        getters.socketTowers.emit('sendBet', data, (res) => {
            if(res.success === true) {
                commit('auth_update_user', res.user);
                commit('towers_set_game', res.game);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    towersSendRevealSocket({ getters, commit, dispatch }, data) {
        if(getters.socketTowers === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'TowersReveal');

        getters.socketTowers.emit('sendReveal', data, (res) => {
            if(res.success === true) {
                commit('towers_set_game', res.game);

                if(getters.soundTowers === 1 && (res.game.state !== 'completed' || res.game.payout > 0)) {
                    getters.soundSuccess.volume = getters.soundVolume;
                    getters.soundSuccess.currentTime = 0;
                    getters.soundSuccess.play();
                } else if(getters.soundTowers === 1) {
                    getters.soundExplosion.volume = getters.soundVolume;
                    getters.soundExplosion.play();
                }
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    towersSendCashoutSocket({ getters, commit, dispatch }, data) {
        if(getters.socketTowers === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'TowersCashout');

        getters.socketTowers.emit('sendCashout', data, (res) => {
            if(res.success === true) {
                commit('auth_update_user', res.user);
                commit('towers_set_game', res.game);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    }
}

const towers = {
    state,
    mutations,
    actions,
    getters
}

export default towers;