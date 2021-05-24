import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

const store = createStore({
    state: {
        audits: {},
        activeWave: 0
    },
    mutations: {
        flipAuditState(state, cartName) {
            state.audits[cartName] = !state.audits[cartName]
        },

        setAuditState(state, auditData) {
            state.audits = auditData
        },

        setAuditStateToTrue(state, cartName) {
            state.audits[cartName] = true
        },

        setAuditCartState(state, payload) {
            state.audits[payload.cart] = payload.auditState
        },

        setActiveWave(state, i) {
            state.activeWave = i
        }
    }
})

createApp(App).use(store).mount('#app')