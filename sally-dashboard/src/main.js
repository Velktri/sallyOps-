import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

const store = createStore({
    state: {
        cartData: {},
        sortedStageTimes: [],
        activeWave: 0
    },

    getters: {
        getWaveData: state => {
            return state.cartData[state.sortedStageTimes[state.activeWave]]
        },

        getActiveStageTime: state => {
            return state.sortedStageTimes[state.activeWave]
        }
    },

    mutations: {
        importAuditData(state, payload) {
            state.cartData = payload.cartData
        },

        setSortedStageTimes(state, payload) {
            state.sortedStageTimes = payload.stageTimes
        },

        exportAuditData(state) {
            browser.storage.local.set({ carts: JSON.parse(JSON.stringify(state.cartData)) })
        },

        setActiveWave(state, i) {
            state.activeWave = i
        }
    }
})

createApp(App).use(store).mount('#app')