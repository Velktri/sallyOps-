<template>
    <div class="column">
        <div class="card">
            <header class="card-header">
                <p class="card-header-title">{{ splitLocation }}</p>

                <p class="card-header-title so-title-font">
                    {{ routeData.route }}
                </p>

                <div class="so-button card-header-icon is-inverted" aria-label="more options">
                    <CheckCircle :isAudited="false" />
                </div>
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
        }
    },

    computed: {
        splitLocation() {
            if(this.routeData.loc !== undefined) {
                return this.routeData.loc.split('.')[1]
            }
            return ''
        }
    },
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