<template>
    <div class="column">
        <div class="card">
            <header v-if="Object.keys(routeData).length > 0" class="card-header">
                <p class="card-header-title">{{ splitLocation }}</p>

                <p class="card-header-title so-title-font">
                    {{ routeData.route }}
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
            let isAudited = this.$store.getters.getAuditByCartName(this.routeData.carts[0].cart)
            this.routeData.carts.forEach(cart => {
                isAudited = isAudited && this.$store.getters.getAuditByCartName(cart.cart)
            })
            

            this.routeAuditState = isAudited
            return isAudited
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
                this.$store.commit('setAuditCartState', {cart: cart.cart, auditState: this.routeAuditState })
            })
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

.so-title-font {
    font-size: 145%;
}
</style>