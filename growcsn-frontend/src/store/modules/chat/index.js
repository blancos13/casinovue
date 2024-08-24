const state = {
    chatLastMessage: null,
    chatScroll: true,
    chatRoom: localStorage.getItem('chatRoom') === null ? 'en' : localStorage.getItem('chatRoom'),
    chatOnline: { en: 0, tr: 0, de: 0, es: 0, beg: 0, whale: 0 },
    chatMessages: {
        data: null,
        loading: false
    }
}

const getters = {
    chatLastMessage: state => state.chatLastMessage,
    chatScroll: state => state.chatScroll,
    chatRoom: state => state.chatRoom,
    chatOnline: state => state.chatOnline,
    chatMessages: state => state.chatMessages
}

const mutations = {
    chat_set_last_message(state) {
        state.chatLastMessage = new Date().getTime();
    },
    chat_set_scroll(state, value) {
        state.chatScroll = value;
    },
    chat_set_room(state, room) {
        state.chatRoom = room;
    },
    chat_set_online(state, data) {
        state.chatOnline = data;
    },
    chat_set_messages_data(state, data) {
        state.chatMessages.data = data;
    },
    chat_add_messages_data(state, message) {
        state.chatMessages.data.push(message);
    },
    chat_remove_messages_data(state, messageId) {
        state.chatMessages.data.splice(state.chatMessages.data.findIndex((element) => element._id === messageId), 1);
    },
    chat_remove_messages_data_overdue(state) {
        state.chatMessages.data.splice(0, state.chatMessages.data.length - 50);
    },
    chat_remove_messages_data_clear(state) {
        state.chatMessages.data = [];
    },
    chat_set_messages_loading(state, value) {
        state.chatMessages.loading = value;
    }
}

const actions = {
    chatSetScroll({ commit }, value) {
        commit('chat_set_scroll', value);
    },
    chatSetRoom({ getters, commit, dispatch }, room) {
        if(getters.chatRoom === room) { return; }

        localStorage.setItem('chatRoom', room);
        commit('chat_set_room', room);
        dispatch('chatGetMessagesSocket', { room: room });
    },
    chatSocketInit({ getters, commit, dispatch }, data) {
        commit('chat_set_online', data.online);
        dispatch('chatGetMessagesSocket', { room: getters.chatRoom })
    },
    chatSocketOnline({ commit }, data) {
        commit('chat_set_online', data.online);
    },
    chatSocketMessage({ getters, commit }, data) {
        commit('chat_add_messages_data', data.message);
        if(getters.chatMessages.data.length > 50 && getters.chatScroll === true) { commit('chat_remove_messages_data_overdue'); }
    },
    chatSocketRemove({ getters, commit }, data) {
        commit('chat_remove_messages_data', data.messageId);
    },
    chatSocketClear({ getters, commit }, data) {
        commit('chat_remove_messages_data_clear');
    },
    chatGetMessagesSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.chatMessages.loading !== false) { return; }
        commit('chat_set_messages_loading', true);

        getters.socketGeneral.emit('getChatMessages', data, (res) => {
            if(res.success === true) {
                commit('chat_set_scroll', true);
                commit('chat_set_messages_data', res.messages);
            }

            commit('chat_set_messages_loading', false);
        });
    },
    chatSendMessageSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'ChatMessage');

        getters.socketGeneral.emit('sendChatMessage', data, (res) => {
            if(res.success === false) {
                dispatch('notificationShow', res.error);
            }

            commit('chat_set_last_message');
            commit('socket_set_send_loading', null);
        });
    },
    chatSendRemoveSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'ChatRemove');

        getters.socketGeneral.emit('sendChatRemove', data, (res) => {
            if(res.success === true) {
                dispatch('modalsSetShow', null);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    chatSendClearSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'ChatClear');

        getters.socketGeneral.emit('sendChatClear', data, (res) => {
            if(res.success === true) {

            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    chatSendLockSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'ChatLock');

        getters.socketGeneral.emit('sendChatLock', data, (res) => {
            if(res.success === true) {

            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    }
}

const chat = {
    state,
    mutations,
    actions,
    getters
}

export default chat;
