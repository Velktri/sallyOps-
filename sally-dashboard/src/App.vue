<template>
    <div v-if="processed">
        <div class="so-nav-color">
            <div class="columns is-gapless is-vcentered">
                <div class="column is-narrow">
                    <Pagination :waves="$store.state.sortedStageTimes.length" />
                </div>

                <div class="column is-1">

                </div>

                <div class="column">
                    <div class="columns is-vcentered">
                        <div class="column">
                            <div class="title is-1">
                                Routes: <span id="route-amount">{{ routesInWave }}</span>
                            </div>
                        </div>

                        <div class="column is-4">
                            <div class="title is-1">
                                Stage Time: <span id="stage-by-time">{{ stageByTime }}</span>
                            </div>
                        </div>

                        <div class="column is-5">
                            <div class="title is-1">
                                {{ timeRemaining }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>



        <div class="container is-fluid tabcontent">
            <div v-for="i in 5" :key="i" class="columns tab-spacing">
                <RouteContainer v-for="j in 4" :key="j" :routeData="setRouteData(j + ((i - 1) * 4))" />
            </div>
        </div>

        <Scanner />
    </div>
    <div v-else>
        <div class="title is-1">
            Sally Ops+ is currently gathering data from Station Command Center.
        </div>
    </div>
</template>

<script>
import RouteContainer from "./components/routeContainer.vue"
import Pagination from "./components/pagination.vue"
import Scanner from "./components/scanner.vue"

export default {
    name: 'Sally Ops Dashboard',
    components: {
        RouteContainer,
        Pagination,
        Scanner
    },

    data() {
        return {
            processed: false,
        }
    },

    computed: {
        timeRemaining() {
            if (this.$store.getters.getActiveStageTime !== undefined) {
                let date = new Date()

                let curTime = { hour: date.getHours(), minute: date.getMinutes() }
                let waveTime = { 
                    hour: parseInt(this.$store.getters.getActiveStageTime.split(':')[0]),
                    minute: parseInt(this.$store.getters.getActiveStageTime.split(':')[1])
                }

                let hourDiff = waveTime.hour - curTime.hour
                let minDiff = waveTime.minute - curTime.minute


                let remainingTime = (hourDiff * 60) + minDiff
                return (remainingTime >= 0) ? remainingTime  + ' Minutes Left' : (remainingTime * -1) + ' Minutes Past'
            }

            return ''
        },

        routesInWave() {
            if (this.$store.getters.getWaveData !== undefined) {
                return Object.keys(this.$store.getters.getWaveData).length
            }

            return 0
        },

        stageByTime() {
            if (this.$store.getters.getActiveStageTime !== undefined) {
                let clock = this.$store.getters.getActiveStageTime.split(':')
                return parseInt(clock[0]) + ':' + clock[1]
            }

            return '0:00'
        },

        departTime() {
            if (this.$store.getters.getActiveStageTime !== undefined) {
                let clock = this.$store.getters.getActiveStageTime.split(':')
                if ((parseInt(clock[1]) + 30) >= 60)
                {
                    return (parseInt(clock[0]) + 1) + ':' + (parseInt(clock[1]) - 30)
                }
                else
                {
                    return parseInt(clock[0]) + ':' + (parseInt(clock[1]) + 30)
                }
            }

            return '0:00'
        }
    },

    methods: {
        processCartData() {
            return browser.storage.local.get('carts').then((res) => {
                let sortedStageTimes = Object.keys(res.carts).sort((x, y) => {
                    let xTime = x.split(':')
                    let yTime = y.split(':')

                    let xHour = parseInt(xTime[0])
                    let yHour = parseInt(yTime[0])

                    // hours
                    if (xHour < yHour)
                    {
                        return -1
                    }
                    else if (xHour > yHour)
                    {
                        return 1
                    }

                    // mintues
                    if (xHour === yHour)
                    {
                        let xMinute = parseInt(xTime[1])
                        let yMinute = parseInt(yTime[1])

                        if (xMinute < yMinute)
                        {
                            return -1
                        }

                        if (xMinute > yMinute)
                        {
                            return 1
                        }
                    }

                    return 0
                })
                
                this.$store.commit('setSortedStageTimes', {stageTimes: sortedStageTimes })
                this.$store.commit('importAuditData', { cartData: res.carts })

                return Promise.resolve()
            })
        },

        setRouteData(i) {
            let waveData = this.$store.getters.getWaveData

            if (waveData !== undefined) {
                i--
                let routesWithLoc = Object.keys(waveData).filter(route => {
                    let routeLoc = waveData[route].loc.split('.')
                    return routeLoc[0] === 'STG'
                })

                routesWithLoc.sort((x, y) => {
                    let xLetter = waveData[x].loc.split('.')[1].charAt(0)
                    let yLetter = waveData[y].loc.split('.')[1].charAt(0)

                    if (xLetter < yLetter) {
                        return -1
                    }

                    if (xLetter > yLetter) {
                        return 1
                    }

                    if (xLetter === yLetter) {
                        let xLoc = parseInt(waveData[x].loc.split('.')[1].slice(1))
                        let yLoc = parseInt(waveData[y].loc.split('.')[1].slice(1))

                        if (xLoc < yLoc) {
                            return -1
                        }

                        if (xLoc > yLoc) {
                            return 1
                        }
                    }

                    return 0
                })

                if (waveData[routesWithLoc[i]] !== undefined)
                {
                    return { 'route': routesWithLoc[i], ...waveData[routesWithLoc[i]] }
                }
            }

            return {}
        }
    },

    async created() {
        this.processCartData().then(() => {
            this.processed = true
        })

        browser.runtime.onMessage.addListener((res) => {
            if (res.command === 'SO_carts_updated') {
                this.processCartData()
            }
        })
    },
}
</script>

<style scoped>
.so-nav-color {
    background-color: #375a7f;
    padding: .5rem 0rem;
}
.navbar {
    border-radius: 0px;
}

.tabcontent {
    padding: 1rem;
    border-top: none;
}

.overview {
    height: 120px;
    border-bottom: 1px solid black;
    padding: 10px 20px;
}
</style>