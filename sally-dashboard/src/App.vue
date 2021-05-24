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
                    <Pagination :waves="sortedStageTimes.length" @clicked="clickedPagination" />
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        Add clock for auto update
                    </div>
                    <div class="navbar-item">
                        <button class="button is-link" @click="updateCartData()">
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
            <div class="columns tab-spacing">
                <RouteContainer v-for="i in 4" :key="i" :routeData="setRouteData('A', i)" />
            </div>
            <div class="columns tab-spacing">
                <RouteContainer v-for="i in 4" :key="i" :routeData="setRouteData('B', i)" />
            </div>
            <div class="columns tab-spacing">
                <RouteContainer v-for="i in 4" :key="i" :routeData="setRouteData('C', i)" />
            </div>
            <div class="columns tab-spacing">
                <RouteContainer v-for="i in 4" :key="i" :routeData="setRouteData('D', i)" />
            </div>
            <div class="columns tab-spacing">
                <RouteContainer v-for="i in 4" :key="i" :routeData="setRouteData('E', i)" />
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
            cartData: {},
                activeWaveTab: 0,
            processed: false
        }
    },

    computed: {
        routesInWave() {
            return Object.keys(this.cartData[this.sortedStageTimes[this.activeWaveTab]]).length
        },

        stageByTime() {
            let clock = this.sortedStageTimes[this.activeWaveTab].split(':')
            return parseInt(clock[0]) + ':' + clock[1]
        },

        departTime() {
            let clock = this.sortedStageTimes[this.activeWaveTab].split(':')
            if ((parseInt(clock[1]) + 30) >= 60)
            {
                return (parseInt(clock[0]) + 1) + ':' + (parseInt(clock[1]) - 30)
            }
            else
            {
                return parseInt(clock[0]) + ':' + (parseInt(clock[1]) + 30)
            }
        }
    },

    methods: {
        processCartData() {
            return browser.storage.local.get('carts').then((res) => {
                this.cartData = res.carts
                let stageTimes = []
                stageTimes = Object.keys(this.cartData).sort((x, y) => {
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

                this.sortedStageTimes = stageTimes

                return Promise.resolve(res.carts)
            }).then(carts => {
                return browser.storage.local.get('SO_audits').then((result) => {
                    if (Object.keys(result.SO_audits).length === 0) {
                        this.buildAuditList(carts)
                    }
                    else {
                        this.$store.commit('setAuditState', result.SO_audits)
                    }
                    return Promise.resolve('test')
                })
            })
        },

        buildAuditList(carts) {
            let auditObj = {}
            Object.keys(carts).forEach((waveTime, i) => {
                Object.keys(carts[waveTime]).forEach(route => {
                    carts[waveTime][route].carts.forEach(cart => {
                        let temp = {}
                        let uniqueCartName = /*(i + 1) + '|' + */cart.cart
                        temp[uniqueCartName] = false
                        auditObj = { ...temp, ...auditObj }
                    })
                })
            })

            browser.storage.local.set({ SO_audits: auditObj })
            this.$store.commit('setAuditState', auditObj)
        },

        setRouteData(sallyLocation, i) {
            i--
            let waveData = this.cartData[this.sortedStageTimes[this.activeWaveTab]]

            let routesInPort = Object.keys(waveData).filter(route => {
                let routeLoc = waveData[route].loc.split('.')

                return routeLoc[0] === 'STG' && routeLoc[1].charAt(0) === sallyLocation
            })

            routesInPort.sort((x, y) => {
                let x_Loc = parseInt(waveData[x].loc.split('.')[1].slice(1))
                let y_Loc = parseInt(waveData[y].loc.split('.')[1].slice(1))
                
                if (x_Loc < y_Loc) { return -1 }
                if (x_Loc > y_Loc) { return 1 }

                return 0
            })

            if (waveData[routesInPort[i]] !== undefined)
            {
                return { 'route': routesInPort[i], ...waveData[routesInPort[i]] }
            }

            return {}
        },

        clickedPagination(i) {
            this.activeWaveTab = (i - 1)
        },

        getCartInput() {
            let cartVal = document.getElementById("cart-scanner")
            document.getElementById("scanned-cart").innerHTML = cartVal.value

            this.checkForCart(cartVal.value)

            cartVal.value = ""
            cartVal.blur()
        },

        checkForCart(cartName) {
            let waveData = this.cartData[this.sortedStageTimes[this.activeWaveTab]]
            Object.keys(waveData).forEach(routeKey => {
                waveData[routeKey].carts.forEach(element => {
                    if (cartName === element.cart)
                    {
                        this.updateCart(cartName, waveData[routeKey])
                        return
                    }
                })
            })
        },

        updateCart(cartName, routeData) {
            this.$store.commit('setAuditStateToTrue', cartName)
        },

        updateCartData() {
            // send message to bg script to pull cart table data
            // listen for data
            // call processCarts()
            console.log('hello')
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
    },
}
</script>

<style scoped>
.navbar {
    border-radius: 0px;
}
</style>