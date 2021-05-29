<template>
    <div>
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item" href="https://bulma.io">
                    <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
                </a>

                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"
                    data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" class="navbar-menu">
                <div class="navbar-start">
                    <a class="navbar-item">
                        <span class="icon">
                            <i class="icon ion-md-logo-github has-text-danger so-icon-large"></i>
                        </span>
                    </a>

                    <!--<div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link">
                            Setting
                        </a>

                        <div class="navbar-dropdown">
                            <a class="navbar-item">
                                To Do
                            </a>
                            <a class="navbar-item">
                                To Do
                            </a>
                            <a class="navbar-item">
                                To Do
                            </a>
                            <hr class="navbar-divider">
                            <a class="navbar-item">
                                To Do
                            </a>
                        </div>
                    </div>-->
                </div>

                <div v-if="processed" class="navbar-item">
                    <Pagination :waves="$store.state.sortedStageTimes.length" />
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        Add clock for auto update
                    </div>
                    <div class="navbar-item">
                        <button class="button is-link" :class="isLoading()" @click="updateCartData()">
                            <strong>Update Now</strong>
                        </button>
                    </div>
                </div>
            </div>
        </nav>



        <div v-if="processed" class="overview">
            <div>
                Scanner Input: <span id="scanned-cart"></span>
            </div>

            <div>
                Routes: <span id="route-amount">{{ routesInWave }}</span>
            </div>
            <div>
                Stage Time: <span id="stage-by-time">{{ stageByTime }}</span>
            </div>
            <div>
                Depart Time: <span id="depart-time">{{ departTime }}</span>
            </div>

        </div>

        <div v-if="processed" class="container is-fluid tabcontent">
            <div v-for="i in 5" :key="i" class="columns tab-spacing">
                <RouteContainer v-for="j in 4" :key="j" :routeData="setRouteData(j + ((i - 1) * 4))" />
            </div>
        </div>

        <input type="text" id="cart-scanner" class="scanner" name="cart-scanner">
    </div>
</template>

<script>
import RouteContainer from "./components/routeContainer.vue"
import Pagination from "./components/pagination.vue"

export default {
    name: 'Sally Ops Dashboard',
    components: {
        RouteContainer,
        Pagination
    },

    data() {
        return {
            processed: false,
            gettingData: false
        }
    },

    computed: {
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
        isLoading(i) {
            return {
                'is-loading': this.gettingData
            }
        },

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
        },

        getCartInput() {
            let cartVal = document.getElementById("cart-scanner")
            document.getElementById("scanned-cart").innerHTML = cartVal.value

            this.checkForCart(cartVal.value)

            cartVal.value = ""
            cartVal.blur()
        },

        checkForCart(cartName) {
            let waveData = this.$store.getters.getWaveData
            Object.keys(waveData).forEach(routeKey => {
                waveData[routeKey].carts.forEach(element => {
                    if (cartName === element.cart)
                    {
                        element.isAudited = true
                        this.$store.commit('exportAuditData')
                        return
                    }
                })
            })
        },

        updateCartData() {
            
            this.gettingData = true
            browser.runtime.sendMessage({
                command: 'SO_reload_content',
            })
        }
    },

    async created() {
        this.processCartData().then(() => {
            this.processed = true
        })

        window.addEventListener("keypress", (e) => {
            if (e.target.tagName !== "INPUT")
            {
                var input = document.getElementById("cart-scanner")
                input.select()
                input.value = e.key
                e.preventDefault()
                setTimeout(this.getCartInput, 200)
            }
        })

        browser.runtime.onMessage.addListener((res) => {
            if (res.command === 'SO_carts_updated') {
                this.processCartData()
                this.gettingData = false
            }
        })
    },
}
</script>

<style scoped>
.navbar {
    border-radius: 0px;
}

.scanner {
    position: fixed;
    top: 0;
    right: 0;
    z-index: -1;
    max-width: 1px;
    max-height: 1px;
    opacity: 0%;
}

.tabcontent {
    padding: 6px 12px;
    border-top: none;
}

.overview {
    height: 120px;
    border-bottom: 1px solid black;
    padding: 10px 20px;
}
</style>