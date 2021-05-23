import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

const store = createStore({
    state: {
        audits: {}
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
        }
    }
})

createApp(App).use(store).mount('#app')