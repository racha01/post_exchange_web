<template>
    <div class="content">
        <h1>Product</h1>
        <p>This is the Product page.</p>
        <button @click="getData">GetData</button>
        <table>
            <thead>
                <tr>
                    <th id="cal1">ลำดับ</th>
                    <th>รหัสผู้ฝากขาย</th>
                    <th>ชื่อผู้ฝากขาย</th>
                    <th>รหัสสินค้า</th>
                    <th>ชื่อสินค้า</th>
                    <th>ราคาส่ง</th>
                    <th>ราคาขายสด</th>
                    <th>ราคาขายเซ็น</th>
                    <th>ตัวเลือก</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in data.items" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.seller_code }}</td>
                    <td>{{ item.seller_name }}</td>
                    <td>{{ item.product_code }}</td>
                    <td>{{ item.product_name }}</td>
                    <td>{{ item.wholesale_price }}</td>
                    <td>{{ item.cash_price }}</td>
                    <td>{{ item.accruals_price }}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
import axios from 'axios';
export default {
    name: "product",
    data() {
        return {
            data: []
        };
    },
    methods: {
        getData() {
            axios
                .get("https://localhost:7287/api/products")
                .then((res) => (this.data = res.data))
        },

    }
}
</script>

<style scoped>
table {
    border-collapse: collapse;
    width: calc(100% - 60px);
    margin-left: 30px;
    margin-right: 30px;
    font-size: 0.9em;
    font-family: sans-serif;
    height: 20%;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    
}
thead tr {
    background-color: #646cfd;
    color: #ffffff;
    text-align: center;
    
}
th, td {
    padding: 12px 15px;
}

tbody tr {
    border-bottom: 1px solid #dddddd;
}
tr:nth-of-type(even) {
    background-color: #f3f3f3;
}
tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
}
tbody tr.active-row {
    font-weight: bold;
    color: #009879;
}

#cal1 {
    width: 10%;
}
</style>