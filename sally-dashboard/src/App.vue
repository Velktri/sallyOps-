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
                    <Pagination :waves="sortedStageTimes.length" />
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
                <RouteContainer v-for="i in 4" :key="i" :routeData="setRouteData('B', i + 4)" />
            </div>
            <div class="columns tab-spacing">
                <RouteContainer v-for="i in 4" :key="i" :routeData="setRouteData('C', i + 8)" />
            </div>
            <div class="columns tab-spacing">
                <RouteContainer v-for="i in 4" :key="i" :routeData="setRouteData('D', i + 12)" />
            </div>
            <div class="columns tab-spacing">
                <RouteContainer v-for="i in 4" :key="i" :routeData="setRouteData('E', i + 16)" />
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
            processed: false
        }
    },

    computed: {
        routesInWave() {
            return Object.keys(this.cartData[this.sortedStageTimes[this.$store.state.activeWave]]).length
        },

        stageByTime() {
            let clock = this.sortedStageTimes[this.$store.state.activeWave].split(':')
            return parseInt(clock[0]) + ':' + clock[1]
        },

        departTime() {
            let clock = this.sortedStageTimes[this.$store.state.activeWave].split(':')
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
                        this.buildAuditList(this.sortedStageTimes, carts)
                    }
                    else {
                        this.$store.commit('setAuditState', result.SO_audits)
                    }
                    return Promise.resolve('test')
                })
            })
        },

        buildAuditList(sortedWaveTimes, carts) {
            let auditObj = {}
            sortedWaveTimes.forEach((waveTime, i) => {
                Object.keys(carts[waveTime]).forEach(route => {
                    carts[waveTime][route].carts.forEach(cart => {
                        let uniqueCartName = i + '|' + cart.cart
                        auditObj = { ...{ [uniqueCartName]: false }, ...auditObj }
                    })
                })
            })

            browser.storage.local.set({ SO_audits: auditObj })
            this.$store.commit('setAuditState', auditObj)
        },

        setRouteData(sallyLocation, i) {
            i--
            let waveData = this.cartData[this.sortedStageTimes[this.$store.state.activeWave]]

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

            return {}

            /*let routesInPort = Object.keys(waveData).filter(route => {
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

            return {}*/
        },

        getCartInput() {
            let cartVal = document.getElementById("cart-scanner")
            document.getElementById("scanned-cart").innerHTML = cartVal.value

            this.checkForCart(cartVal.value)

            cartVal.value = ""
            cartVal.blur()
        },

        checkForCart(cartName) {
            let waveData = this.cartData[this.sortedStageTimes[this.$store.state.activeWave]]
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

        updateCart(cartName) {
            this.$store.commit('setAuditStateToTrue', cartName)
        },

        updateCartData() {
            browser.runtime.sendMessage({
                command: 'SO_update_carts',
            }).then((res) => {
                console.log(res)
            })

            
            // send message to bg script to pull cart table data
            // listen for data
            // call processCarts()
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