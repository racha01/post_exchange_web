<script>
import { RouterLink, RouterView } from 'vue-router'
</script>
<template>
    <div class="box logo">logo</div>
    <div class="box menu1"><RouterLink to="/" id="menu">Home</RouterLink></div>
    <div class="box menu2"><RouterLink to="/seller" id="menu">Seller</RouterLink></div>
    <div class="box menu3"><RouterLink to="/product" id="menu">Product</RouterLink></div>
    <div class="box menu4"><RouterLink to="/post-exchange-stock" id="menu">Post Exchange Stock</RouterLink></div>
    <div class="box menu5"><RouterLink to="/post-exchange-product" id="menu">Post Exchange Product</RouterLink></div>
    <div class="box menu6"><RouterLink to="/deliver-good" id="menu">Deliver Good</RouterLink></div>
</template>

<style scoped>
.box {
    height: 50px;
    border: 3px solid black;
    width: 100%;
    text-align: center;
    align-content: center;
}

.logo {
    height: 100px;
}
#menu{
    color: #ffffff;
    text-decoration: none;
}
</style>