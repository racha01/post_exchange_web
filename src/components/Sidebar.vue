<script>
import { RouterLink, RouterView } from 'vue-router'
</script>
<template>
    <div class="content">
        <div class="box logo">logo</div>
        <div class="box">
            <RouterLink to="/home" id="menu">หน้าหลัก</RouterLink>
        </div>
        <div class="box">
            <RouterLink to="/seller" id="menu">ผู้ฝากขาย</RouterLink>
        </div>
        <div class="box">
            <RouterLink to="/product" id="menu">สินค้าผู้ฝากขาย</RouterLink>
        </div>
        <div class="box">
            <RouterLink to="/deliver-good" id="menu">รายการส่งสินค้าของผู้ฝากขาย</RouterLink>
        </div>
        <div class="box">
            <RouterLink to="/deliver-good/cut-off" id="menu">ยอดการส่งสินค้าของผู้ฝากขาย</RouterLink>
        </div>
        <div class="box">
            <RouterLink to="/post-exchange-stock" id="menu">รายการซื้อสินค้าเข้า PX</RouterLink>
        </div>
        <div class="box">
            <RouterLink to="/post-exchange-product" id="menu">สินค้าใน PX</RouterLink>
        </div>
    </div>

</template>

<style scoped>
.content {
    background-color: rgb(0, 0, 255);
    text-align: center;
    align-content: center;
    width: 100%;
    position: sticky;
    top: 0px;
    height: 100vh;
    margin-top: 0px;
}

.box {
    margin-top: 0px;
    height: 50px;
    width: 100%;
    text-align: center;
    align-content: center;
    border-bottom: 2px solid #a6a6a6;
}

.logo {
    height: 100px;
    margin-top: -280px;
}

#menu {
    color: #ffffff;
    text-decoration: none;
}
</style>