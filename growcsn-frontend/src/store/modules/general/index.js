const state = {
    generalSidebarMobile: null,
    generalSettings: null,
    generalTimeDiff: null,
    generalBets: {
        bets: null,
        loading: false
    },
    generalRain: {
        site: null,
        active: null
    },
    generalUserInfo: {
        data: null,
        loading: false
    }
}

const getters = {
    generalSidebarMobile: state => state.generalSidebarMobile,
    generalSettings: state => state.generalSettings,
    generalTimeDiff: state => state.generalTimeDiff,
    generalBets: state => state.generalBets,
    generalRain: state => state.generalRain,
    generalUserInfo: state => state.generalUserInfo
}

const mutations = {
    general_set_sidebar_mobile(state, value) {
        state.generalSidebarMobile = value;
    },
    general_set_settings(state, settings) {
        state.generalSettings = settings;
    },
    general_set_time_diff(state, time) {
        state.generalTimeDiff = time - new Date().getTime();
    },
    general_set_bets(state, bets) {
        state.generalBets.bets = bets;
    },
    general_add_bets_all(state, bet) {
        state.generalBets.bets.all.unshift(bet);
        state.generalBets.bets.all.sort((a, b) => { return new Date(b.updatedAt) - new Date(a.updatedAt); });
    },
    general_remove_bets_all(state) {
        state.generalBets.bets.all.pop();
    },
    general_add_bets_whale(state, bet) {
        state.generalBets.bets.whale.unshift(bet);
        state.generalBets.bets.whale.sort((a, b) => { return new Date(b.updatedAt) - new Date(a.updatedAt); });
    },
    general_remove_bets_whale(state) {
        state.generalBets.bets.whale.pop();
    },
    general_add_bets_lucky(state, bet) {
        state.generalBets.bets.lucky.unshift(bet);
        state.generalBets.bets.lucky.sort((a, b) => { return new Date(b.updatedAt) - new Date(a.updatedAt); });
    },
    general_remove_bets_lucky(state) {
        state.generalBets.bets.lucky.pop();
    },
    general_add_bets_my(state, bet) {
        state.generalBets.bets.my.unshift(bet);
        state.generalBets.bets.my.sort((a, b) => { return new Date(b.updatedAt) - new Date(a.updatedAt); });
    },
    general_remove_bets_my(state) {
        state.generalBets.bets.my.pop();
    },
    general_set_bets_loading(state, status) {
        state.generalBets.loading = status;
    },
    general_set_rain_site(state, rain) {
        state.generalRain.site = rain;
    },
    general_set_rain_active(state, rain) {
        state.generalRain.active = rain;
    },
    general_set_user_info_data(state, user) {
        state.generalUserInfo.data = user;
    },
    general_set_user_info_loading(state, status) {
        state.generalUserInfo.loading = status;
    }
}

const actions = {
    generalSetSidebarMobile({ commit }, value) {
        commit('general_set_sidebar_mobile', value);
    },
    generalClearRainActive({ commit }) {
        commit('general_set_rain_active', null);
    },
    generalSetUserInfoData({ commit }, user) {
        commit('general_set_user_info_data', user);
    },
    generalSocketInit({ commit }, data) {
        commit('general_set_settings', data.settings);
        commit('general_set_time_diff', data.time);
        commit('general_set_rain_site', data.rains.site);
        commit('general_set_rain_active', data.rains.active);
    },
    generalSocketBet({ getters, commit }, data) {
        if(getters.generalBets.bets !== null) {
            commit('general_add_bets_all', data.bet);
            if(getters.generalBets.bets.all.length >= 15) { commit('general_remove_bets_all'); }

            if(data.bet.payout >= 10000000) {
                commit('general_add_bets_whale', data.bet);
                if(getters.generalBets.bets.whale.length >= 15) { commit('general_remove_bets_whale'); }
            }

            if(data.bet.payout >= 10 && data.bet.multiplier >= 500) {
                commit('general_add_bets_lucky', data.bet);
                if(getters.generalBets.bets.lucky.length >= 15) { commit('general_remove_bets_lucky'); }
            }

            if(getters.authUser.user !== null && data.bet.user !== null && getters.authUser.user._id === data.bet.user._id) {
                commit('general_add_bets_my', data.bet);
                if(getters.generalBets.bets.my.length >= 15) { commit('general_remove_bets_my'); }
            }
        }
    },
    generalSocketSettings({ commit }, data) {
        commit('general_set_settings', data.settings);
    },
    generalSocketUser({ getters, commit }, data) {
        if(new Date(getters.authUser.user.updatedAt).getTime() <= new Date(data.user.updatedAt).getTime()) {
            commit('auth_update_user', data.user);
        }
    },
    generalSocketRain({ getters, commit }, data) {
        if(data.rain.type === 'site') {
            commit('general_set_rain_site', data.rain);
        }

        if(data.rain.state === 'running') {
            commit('general_set_rain_active', data.rain);
        }
    },
    generalGetBetsDataSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.generalBets.loading === true) { return; }
        commit('general_set_bets_loading', true);

        getters.socketGeneral.emit('getBetsData', data, (res) => {
            if(res.success === true) {
                commit('general_set_bets', res.bets);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('general_set_bets_loading', false);
        });
    },
    generalGetUserInfoSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.generalUserInfo.loading === true) { return; }
        commit('general_set_user_info_loading', true);

        getters.socketGeneral.emit('getUserInfo', data, (res) => {
            if(res.success === true) {
                commit('general_set_user_info_data', res.user);
            } else {
                dispatch('notificationShow', res.error);
                if(['ChatUser', 'Tip', 'Mute', 'Ban'].includes(getters.modalsShow) === true) { dispatch('modalsSetShow', null); }
            }

            commit('general_set_user_info_loading', false);
        });
    },
    generalSendVaultDepositSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'GeneralVaultDeposit');

        getters.socketGeneral.emit('sendVaultDeposit', data, (res) => {
            if(res.success === true) {
                commit('auth_set_user', { ...getters.authUser.user, balance: res.user.balance, vault: res.user.vault });
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    generalSendVaultWithdrawSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'GeneralVaultWithdraw');

        getters.socketGeneral.emit('sendVaultWithdraw', data, (res) => {
            if(res.success === true) {
                commit('auth_set_user', { ...getters.authUser.user, balance: res.user.balance, vault: res.user.vault });
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    generalSendVaultLockSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'GeneralVaultLock');

        getters.socketGeneral.emit('sendVaultLock', data, (res) => {
            if(res.success === true) {
                commit('auth_set_user', { ...getters.authUser.user, balance: res.user.balance, vault: res.user.vault });
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    generalSendPromoClaimSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'GeneralPromoClaim');

        getters.socketGeneral.emit('sendPromoClaim', data, (res) => {
            if(res.success === true) {
                dispatch('notificationShow', { type: 'success', message: 'You\'ve successfully claimed a promo code.' });
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    generalSendRainCreateSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'GeneralRainCreate');

        getters.socketGeneral.emit('sendRainCreate', data, (res) => {
            if(res.success === false) {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    generalSendRainTipSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'GeneralRainTip');

        getters.socketGeneral.emit('sendRainTip', data, (res) => {
            if(res.success === false) {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    generalSendRainJoinSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'GeneralRainJoin');

        getters.socketGeneral.emit('sendRainJoin', data, (res) => {
            if(res.success === true) {
                dispatch('notificationShow', { type: 'success', message: 'You\'ve successfully joined the rain.' });
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    }
}

const general = {
    state,
    mutations,
    actions,
    getters
}

export default general;
