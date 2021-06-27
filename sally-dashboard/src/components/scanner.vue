<template>
    <input type="text" id="cart-scanner" class="scanner" name="cart-scanner">
</template>

<script>
export default {

    methods: {
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

        getCartInput() {
            let cartVal = document.getElementById("cart-scanner")
            document.getElementById("scanned-cart").innerHTML = cartVal.value

            this.checkForCart(cartVal.value)

            cartVal.value = ""
            cartVal.blur()
        },
    },

    async created() {
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
    }
}
</script>

<style scoped>
.scanner {
    position: fixed;
    top: 0;
    right: 0;
    z-index: -1;
    max-width: 1px;
    max-height: 1px;
    opacity: 0%;
}
</style>