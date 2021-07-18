<template>
    <div class="column">
        <div class="card">
            <header v-if="Object.keys(routeData).length > 0" class="card-header">
                <p class="card-header-title">{{ splitLocation }}</p>

                <p class="card-header-title so-title-font">
                    {{ routeData.route }}
                </p>

                <p class="card-header-title so-title-font">
                    {{ routeData.stationPair }} | {{ progressPercent }}
                </p>

                <div class="so-button card-header-icon is-inverted" @click="auditRoute">
                    <CheckCircle :isAudited="isAudited" />
                </div>
            </header>

            
            <header v-else class="card-header">
                <p class="card-header-title so-title-font is-centered">
                    Empty
                </p>
            </header>
            <div class="card-content">
                <ListItem v-for="cart in routeData.carts" :key="cart" :cartData="cart" />
            </div>
        </div>
    </div>
</template>

<script>
import ListItem from "./listItem.vue"
import CheckCircle from "./checkbox.vue"

export default {
    components: {
        ListItem,
        CheckCircle
    },

    props: {
        routeData: {
            type: Object
        },
    },

    computed: {
        splitLocation() {
            if(this.routeData.loc !== undefined) {
                return this.routeData.loc.split('.')[1]
            }
            return ''
        },

        isAudited() {
            let isAudited = this.routeData.carts[0].cart
            this.routeData.carts.forEach(cart => {
                isAudited = isAudited && cart.isAudited
            })
            

            this.routeAuditState = isAudited
            return isAudited
        },

        progressPercent() {
            if (this.routeData.status !== "In Progress") { return "100%" }
            let splitProgress = this.routeData.progress.split('/')
            return (100 * ((splitProgress[0] / splitProgress[1]).toFixed(2))) + '%'
        }
    },

    data() {
        return {
            routeAuditState: false
        }
    },

    methods: {
        auditRoute() {
            this.routeAuditState = !this.routeAuditState
            this.routeData.carts.forEach(cart => {
                cart.isAudited = this.routeAuditState
            })

            this.$store.commit('exportAuditData')
        }
    }
}
</script>

<style scoped>
.card-header-icon {
    padding: .5rem .75rem;
}

.card-header-title {
    padding: .5rem 1rem;
}

.card-content {
    padding: .5rem !important;
}

.card {
    height: 100%;
}

.so-title-font {
    font-size: 145%;
}

.so-button {
    border-radius: .4em;
    border: 1px solid transparent;
    padding-bottom: calc(.35em - 1px);
    padding-left: .5em;
    padding-right: .5em;
    padding-top: calc(.35em - 1px);
    cursor: pointer;
    user-select:none;
}

.so-button:hover {
    background-color: #3a4344;
}

.so-button:active {
    border-color: #282f2f;
}
</style>