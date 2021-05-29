<template>
    <span class="icon">
        <i v-if="isAudited" class="icon has-text-success ion-md-checkmark-circle so-icon-large"></i>

        <i v-else class="icon has-text-danger ion-md-radio-button-off so-icon-large"></i>
    </span>
</template>

<script>
export default {
    props: {
        isAudited: {
            required: true,
            type: Boolean
        }
    },
}
</script>

<style scoped>
.so-icon-large {
    font-size: 24px;
}
</style>