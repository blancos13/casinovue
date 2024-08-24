const state = {
    notifications: []
}

const getters = {
    notifications: notifications => state.notifications
}

const mutations = {
    notification_add(state, notification) {
        state.notifications.push(notification);
    },
    notification_remove(state, index) {
        state.notifications.splice(index, 1);
    },
    notification_remove_last(state) {
        state.notifications.shift();
    }
}

const actions = {
    notificationShow({ getters, commit }, data) {
        const notification = {
            id: Math.random().toString(36).substr(2, 9),
            type: data.type,
            message: data.message
        };

        if(getters.notifications.length >= 4) {
            commit('notification_remove_last');
        }
        commit('notification_add', notification);
    },
    notificationRemove({ getters, commit }, notification) {
        const index = getters.notifications.findIndex((element) => element.id === notification.id);
        if(index !== -1) { commit('notification_remove', index); }
    }
}

const notifications = {
    state,
    mutations,
    actions,
    getters
}

export default notifications;
