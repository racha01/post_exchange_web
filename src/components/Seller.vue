<template>
    <div class="content">
        <h1>Seller</h1>
        <p>This is the Seller page.</p>
        <div class="sub-title">
            <div>
                <button class="sub-title-button" @click="showSellerAddModal">เพิ่มข้อมูล</button>
                <SellerAddModal id="input-add-form" v-show="isSellerAddModalVisible" @close="closeModal" @data-updated="fetchData" />
            </div>
            <div>
                <input class="sub-title-input" type="text" placeholder="Search">
                <font-awesome-icon icon="search" />
            </div>
        </div>
        <div>
            <table>
                <thead>
                    <tr>
                        <th id="cal1">ลำดับ</th>
                        <th>รหัสผู้ฝากขาย</th>
                        <th>ชื่อผู้ฝากขาย</th>
                        <th>ตัวเลือก</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in data.items" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.seller_code }}</td>
                        <td>{{ item.seller_name }}</td>
                        <td>
                            <button @click="showSellerUpdateModal(item)">แก้ไขข้อมูล</button>
                            <SellerUpdateModal :seller="seller" @seller-update="fetchData" v-show="isSellerUpdateModalVisible" @close="closeModal" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import SellerAddModal from './modals/SellerAddModal.vue'
import SellerUpdateModal from './modals/SellerUpdateModal.vue'
import { API_BASE_URL, ENDPOINTS } from './../../config';

library.add(faSearch);
import axios from 'axios';
export default {
    name: "seller",
    components: {
        SellerAddModal,
        SellerUpdateModal
    },
    data() {
        return {
            data: [],
            isSellerAddModalVisible: false,
            isSellerUpdateModalVisible: false,
            seller: {}
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                let response = axios
                    .get(`${API_BASE_URL}/${ENDPOINTS.SELLERS}`)
                    .then((res) => (this.data = res.data))
                let data = await response.json();
                this.items = data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        showSellerAddModal() {
            this.isSellerAddModalVisible = true;
        },
        async showSellerUpdateModal(item) {
            this.isSellerUpdateModalVisible = true;
            await axios
                    .get(`${API_BASE_URL}/${ENDPOINTS.SELLERS}/${item.id}`)
                    .then((res) => (this.seller = res.data))
            this.$emit('seller', this.seller);
        },
        closeModal() {
            this.isSellerAddModalVisible = false;
            this.isSellerUpdateModalVisible = false;
        }
    }

}

</script>



<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
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

th,
td {
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