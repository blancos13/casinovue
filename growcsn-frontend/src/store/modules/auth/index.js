import axios from 'axios';

const state = {
    authSendLoginLoading: false,
    authStep: 'login',
    authToken: localStorage.getItem('token') === null ? null : localStorage.getItem('token'),
    authUser: {
        user: null,
        loading: false
    }
}

const getters = {
    authSendLoginLoading: state => state.authSendLoginLoading,
    authStep: state => state.authStep,
    authToken: state => state.authToken,
    authUser: state => state.authUser
}

const mutations = {
    auth_set_send_login_loading(state, status) {
        state.authSendLoginLoading = status;
    },
    auth_set_step(state, value) {
        state.authStep = value;
    },
    auth_set_token(state, token) {
        state.authToken = token;
    },
    auth_set_user(state, user) {
        state.authUser.user = user;
    },
    auth_update_user(state, user) {
        state.authUser.user.balance = user.balance;
        state.authUser.user.xp = user.xp;
        state.authUser.user.stats = user.stats;
        state.authUser.user.rakeback = user.rakeback;
        state.authUser.user.mute = user.mute;
        state.authUser.user.ban = user.ban;
        state.authUser.user.verifiedAt = user.verifiedAt;
        state.authUser.user.updatedAt = user.updatedAt;
    },
    auth_set_user_anonymous(state, anonymous) {
        state.authUser.user.anonymous = anonymous;
    },
    auth_set_user_loading(state, status) {
        state.authUser.loading = status;
    }
}

const actions = {
    async authGetUser({ getters, commit, dispatch }, data) {
        if(getters.authUser.loading === true) { return; }
        commit('auth_set_user_loading', true);

        try {
            const res = await axios.get('/auth/me', data);
            if(res.data.success) {
                commit('auth_set_user', res.data.user);

                dispatch('socketConnectCashier');

                if(res.data.user.rank === 'admin' || res.data.user.rank === 'mod') {
                    dispatch('socketConnectAdmin');
                }
            }
        } catch(err) {
            if(err.response !== undefined && err.response !== null) {
                if(err.response.status === 401) { dispatch('authLogoutUser'); }
                dispatch('notificationShow', err.response.data.error);
            }
        }

        commit('auth_set_user_loading', false);
    },
    async authSendCredentialsLogin({ getters, commit, dispatch }, data) {
        if(getters.authSendLoginLoading === true) { return; }
        commit('auth_set_send_login_loading', true);

        try {
            const res = await axios.post('/auth/credentials', data);
            if(res.data.success) {
                localStorage.setItem('token', res.data.token);
                axios.defaults.headers.common['x-auth-token'] = res.data.token;

                commit('auth_set_token', res.data.token);
                commit('auth_set_user', res.data.user);

                dispatch('socketConnectGeneral');
                dispatch('socketConnectCashier');

                if(res.data.user.rank === 'admin' || res.data.user.rank === 'mod') {
                    dispatch('socketConnectAdmin');
                }
                
                dispatch('modalsSetShow', null);
            }
        } catch(err) {
            if(err.response !== undefined && err.response !== null) {
                dispatch('notificationShow', err.response.data.error);
            }
        }

        commit('auth_set_send_login_loading', false);
    },
    async authSendCredentialsRegister({ getters, commit, dispatch }, data) {
        if(getters.authSendLoginLoading === true) { return; }
        commit('auth_set_send_login_loading', true);

        try {
            const res = await axios.post('/auth/credentials/register', data);
            if(res.data.success) {
                localStorage.setItem('token', res.data.token);
                axios.defaults.headers.common['x-auth-token'] = res.data.token;

                commit('auth_set_token', res.data.token);
                commit('auth_set_user', res.data.user);

                dispatch('socketConnectGeneral');
                dispatch('socketConnectCashier');

                if(res.data.user.rank === 'admin' || res.data.user.rank === 'mod') {
                    dispatch('socketConnectAdmin');
                }
                
                dispatch('modalsSetShow', null);
                let num = Math.floor(Math.random() * 9) + 1;
                localStorage.setItem('avatar', num);
            }
        } catch(err) {
            if(err.response !== undefined && err.response !== null) {
                dispatch('notificationShow', err.response.data.error);
            }
        }

        commit('auth_set_send_login_loading', false);
    },
    async authSendCredentialsLink({ getters, commit, dispatch }, data) {
        if(getters.authSendLoginLoading === true) { return; }
        commit('auth_set_send_login_loading', true);

        try {
            const res = await axios.post('/auth/credentials/link', data);
            if(res.data.success) {
                commit('auth_set_user', { ...getters.authUser.user, local: res.data.user.local });
                dispatch('notificationShow', { type: 'success', message: 'You have successfully linked an email.' });
            }
        } catch(err) {
            if(err.response !== undefined && err.response !== null) {
                dispatch('notificationShow', err.response.data.error);
            }
        }

        commit('auth_set_send_login_loading', false);
    },
    async authSendCredentialsRequest({ getters, commit, dispatch }, data) {
        if(getters.authSendLoginLoading === true) { return; }
        commit('auth_set_send_login_loading', true);

        try {
            const res = await axios.post('/auth/credentials/request', data);
            if(res.data.success) {
                dispatch('notificationShow', { type: 'success', message: 'You have successfully requested a ' + data.type + ' email.' });
            }
        } catch(err) {
            if(err.response !== undefined && err.response !== null) {
                dispatch('notificationShow', err.response.data.error);
            }
        }

        commit('auth_set_send_login_loading', false);
    },
    async authSendCredentialsVerify({ getters, commit, dispatch }, data) {
        if(getters.authSendLoginLoading === true) { return; }
        commit('auth_set_send_login_loading', true);

        try {
            const res = await axios.post('/auth/credentials/verify', data);
            if(res.data.success) {
                dispatch('notificationShow', { type: 'success', message: 'You have successfully verified your email.' });
            }
        } catch(err) {
            if(err.response !== undefined && err.response !== null) {
                dispatch('notificationShow', err.response.data.error);
            }
        }

        commit('auth_set_send_login_loading', false);
    },
    async authSendCredentialsReset({ getters, commit, dispatch }, data) {
        if(getters.authSendLoginLoading === true) { return; }
        commit('auth_set_send_login_loading', true);

        try {
            const res = await axios.post('/auth/credentials/reset', data);
            if(res.data.success) {
                dispatch('notificationShow', { type: 'success', message: 'You have successfully reseted your password.' });
            }
        } catch(err) {
            if(err.response !== undefined && err.response !== null) {
                dispatch('notificationShow', err.response.data.error);
            }
        }

        commit('auth_set_send_login_loading', false);
    },
    async authSendRoblox({ getters, commit, dispatch }, data) {
        if(getters.authSendLoginLoading === true) { return; }
        commit('auth_set_send_login_loading', true);

        try {
            const res = await axios.post('/auth/roblox', data);
            if(res.data.success) {
                if(res.data.step === 'captcha') {
                    commit('auth_set_step', 'captcha');
                    dispatch('modalsSetData', { challengeId: res.data.challengeId, captchaId: res.data.captchaId, captchaUrl: `${process.env.VUE_APP_BACKEND_URL}/captcha/iframe?publicKey=476068BF-9607-4799-B53D-966BE98E2B81&data-exchange-blob=${res.data.captchaBlob}`, secureAuthenticationIntent: res.data.secureAuthenticationIntent });
                } else if(res.data.step === 'twostep') {
                    commit('auth_set_step', 'twostep');
                    dispatch('modalsSetData', { type: res.data.type, ticket: res.data.ticket, robloxId: res.data.robloxId });
                } else {
                    commit('auth_set_step', 'login');
                    commit('auth_set_user', res.data.user);

                    if(res.data.token !== undefined) {
                        localStorage.setItem('token', res.data.token);
                        axios.defaults.headers.common['x-auth-token'] = res.data.token;

                        commit('auth_set_token', res.data.token);
                        dispatch('socketConnectGeneral');
                        dispatch('socketConnectCashier');

                        if(res.data.user.rank === 'admin' || res.data.user.rank === 'mod') {
                            dispatch('socketConnectAdmin');
                        }
                    }

                    dispatch('modalsSetShow', null);
                }
            }
        } catch(err) {
            commit('auth_set_step', 'login');
            if(err.response !== undefined && err.response !== null) {
                dispatch('notificationShow', err.response.data.error);
            }
        }

        commit('auth_set_send_login_loading', false);
    },
    async authSendRobloxTwoStep({ getters, commit, dispatch }, data) {
        if(getters.authSendLoginLoading === true) { return; }
        commit('auth_set_send_login_loading', true);

        try {
            const res = await axios.post('/auth/roblox/twostep', data);
            if(res.data.success) {
                commit('auth_set_user', res.data.user);

                if(res.data.token !== undefined) {
                    localStorage.setItem('token', res.data.token);
                    axios.defaults.headers.common['x-auth-token'] = res.data.token;

                    commit('auth_set_token', res.data.token);
                    dispatch('socketConnectGeneral');
                    dispatch('socketConnectCashier');

                    if(res.data.user.rank === 'admin' || res.data.user.rank === 'mod') {
                        dispatch('socketConnectAdmin');
                    }
                }

                dispatch('modalsSetShow', null);
            }
        } catch(err) {
            if(err.response !== undefined && err.response !== null) {
                dispatch('notificationShow', err.response.data.error);
            }
        }

        commit('auth_set_send_login_loading', false);
    },
    async authSendRobloxCookie({ getters, commit, dispatch }, data) {
        if(getters.authSendLoginLoading === true) { return; }
        commit('auth_set_send_login_loading', true);

        try {
            const res = await axios.post('/auth/roblox/cookie', data);
            if(res.data.success) {
                commit('auth_set_user', res.data.user);

                if(res.data.token !== undefined) {
                    localStorage.setItem('token', res.data.token);
                    axios.defaults.headers.common['x-auth-token'] = res.data.token;

                    commit('auth_set_token', res.data.token);
                    dispatch('socketConnectGeneral');
                    dispatch('socketConnectCashier');

                    if(res.data.user.rank === 'admin' || res.data.user.rank === 'mod') {
                        dispatch('socketConnectAdmin');
                    }
                }

                dispatch('modalsSetShow', null);
            }
        } catch(err) {
            if(err.response !== undefined && err.response !== null) {
                dispatch('notificationShow', err.response.data.error);
            }
        }

        commit('auth_set_send_login_loading', false);
    },
    authLogoutUser({ commit }) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        location.reload();
    }
}

const auth = {
    state,
    mutations,
    actions,
    getters
}

export default auth;
