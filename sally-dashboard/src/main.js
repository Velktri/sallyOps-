import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

const store = createStore({
    state: {
        audits: {},
        activeWave: 0
    },

    getters: {
        getAuditByCartName: (state) => (cartName) => {
            return state.audits[state.activeWave + '|' + cartName]
        }
    },

    mutations: {
        flipAuditState(state, cartName) {
            state.audits[encryptCart(state.activeWave, cartName)] = !state.audits[encryptCart(state.activeWave, cartName)]
            browser.storage.local.set({ SO_audits: { ...state.audits } })
        },

        setAuditState(state, auditData) {
            state.audits = auditData
            browser.storage.local.set({ SO_audits: { ...state.audits } })
        },

        setAuditStateToTrue(state, cartName) {
            state.audits[encryptCart(state.activeWave, cartName)] = true
            browser.storage.local.set({ SO_audits: { ...state.audits } })
        },

        setAuditCartState(state, payload) {
            state.audits[encryptCart(state.activeWave, payload.cart)] = payload.auditState
            browser.storage.local.set({ SO_audits: { ...state.audits } })
        },

        setActiveWave(state, i) {
            state.activeWave = i
        }
    }
})

function encryptCart(i, cart) {
    return i + '|' + cart
}

createApp(App).use(store).mount('#app')