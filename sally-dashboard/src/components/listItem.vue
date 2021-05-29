<template>
    <div class="so-button" @click="auditCart">
        <div class="level">
            <div class="level-left">
                <CheckCircle class="so-icon-margin-right" :isAudited="cartData.isAudited" />
                <span>{{ cartData.cart }}</span>
            </div>

            <div class="level-right">
                <div class="tag" v-bind:class="statusMap[cartData.status]">{{ cartData.status }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import CheckCircle from "./checkbox.vue"

export default {
    components: {
        CheckCircle
    },

    props: {
        cartData: {
            required: true,
            type: Object
        },
    },

    data() {
        return {
            statusMap: {
                'Staged': 'is-success',
                'Ready': 'is-warning',
                'Not Ready': 'is-light',
                'Missing': 'is-danger',
                'Sidelined': 'is-danger'
            },
        }
    },

    methods: {
        auditCart() {
            this.cartData.isAudited = !this.cartData.isAudited
            this.$store.commit('exportAuditData')
        }
    },
}
</script>

<style scoped>
.so-icon-margin-right {
    margin-right: .75em;
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