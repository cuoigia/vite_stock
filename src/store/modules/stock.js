export default {
    state: () => ({
        sukiens: []
    }),

    getters: {},

    mutations: {
        SET_SK(state, payload) {
            state.sukiens = payload
        }
    },

    actions: {
        saveSKs({ commit }, data) {
            commit('SET_SK', data)
        }
    },
}