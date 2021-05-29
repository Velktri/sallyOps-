<template>
    <nav class="pagination is-centered" role="navigation" aria-label="pagination">
        <ul class="pagination-list">
            <li v-for="i in waves" :key="i">
                <a class="pagination-link" :class="isSelected(i)" @click="clickButton(i)">{{ i - 1 }}</a>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    props: {
        waves: {
            required: true,
            type: Number
        }
    },

    data() {
        return {
            selectedIndex: 1
        }
    },

    methods: {
        isSelected(i) {
            return {
                'is-current': this.selectedIndex === i
            }
        },

        clickButton(i) {
            this.selectedIndex = i
            this.$store.commit('setActiveWave', i - 1)
        }
    }
}
</script>