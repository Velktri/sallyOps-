<template>
    <div class="so-button">
        <div class="level">
            <div class="level-left">
                <CheckCircle class="so-icon-margin-right" :isAudited="false" />
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
        }
    },

    data() {
        return {
            statusMap: {
                'Staged': 'is-success',
                'Ready': 'is-warning',
                'Not Ready': 'is-light',
                'Missing': 'is-danger',
                'Sidelined': 'is-danger'
            }
        }
    },
}
</script>

<style scoped>
.so-icon-margin-right {
    margin-right: .75em;
}
</style>