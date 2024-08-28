<template>
    <div class="content">
        <h1>สินค้าของผู้ฝากขาย</h1>
        <div class="sub-title">
            <div class="sub-title-button">
                <button @click="showProductAddModal">เพิ่มข้อมูล</button>
            </div>
            <div>
                <ProductAddModal :sellers="sellerData.items" :key="componentKey" id="input-add-form" v-show="isProductAddModalVisible"
                    @close="closeModal" @data-updated="fetchData" />
            </div>
            <div>
                <input @input="updateQuery($event.target.value)" class="sub-title-input" type="text"
                    placeholder="Search">
                <!-- <font-awesome-icon icon="search" /> -->
            </div>
        </div>
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
                <tr v-for="(item, index) in filteredItems ?? productData.items" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.seller_code }}</td>
                    <td>{{ item.seller_name }}</td>
                    <td>{{ item.product_code }}</td>
                    <td>{{ item.product_name }}</td>
                    <td>{{ item.wholesale_price }}</td>
                    <td>{{ item.cash_price }}</td>
                    <td>{{ item.accruals_price }}</td>
                    <td>
                        <button @click="showProductUpdateModal(item)">แก้ไขข้อมูล</button>
                        <ProductUpdateModal :key="componentKey" :product="productDoc" :sellers="sellerData.items" @product-update="fetchData"
                            v-show="isProductUpdateModalVisible" @close="closeModal" />
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="9" id="footer-td">
                        <div class="footer-content">
                            <p>จำนวนแถวต่อหน้า</p>
                            <select @change="handleSelection($event)">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                                <option>100</option>
                            </select>
                            <button @click="fetchData((pageNo - 1), pageSize)"
                                :disabled="productData.has_previous_page == false">
                                < </button>
                                    <button @click="fetchData((pageNo + 1), pageSize)"
                                        :disabled="productData.has_next_page == false"> > </button>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>


<script>
import { API_BASE_URL, ENDPOINTS, PAGENERATION } from './../../config';
import axios from 'axios';
import ProductAddModal from './modals/ProductAddModal.vue'
import ProductUpdateModal from './modals/ProductUpdateModal.vue'
export default {
    computed: {
        filteredItems() {
            if (!this.productData.items) return null;
            return this.productData.items.filter(item => {
                return (
                    item.seller_code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.seller_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.product_code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.product_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.wholesale_price.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.cash_price.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.accruals_price.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) 
                );
            });
        }
    },
    name: "Product",
    components: {
        ProductAddModal,
        ProductUpdateModal
    },
    data() {
        return {
            productData: [],
            isProductAddModalVisible: false,
            isProductUpdateModalVisible: false,
            productDoc: {},
            componentKey: 0,
            searchQuery: '',
            pageNo: PAGENERATION.PAGE_NO,
            pageSize: PAGENERATION.PAGE_SIZE,
            sellerData: []
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        handleSelection(event) {
            const selectedValue = event.target.value;
            this.fetchData(this.pageNo, selectedValue);
            this.pageSize = selectedValue;
        },
        async fetchData(pageNo, pageSize) {
            pageNo = Number(pageNo)
            if (isNaN(pageNo)) {
                pageNo = this.pageNo
            }
            if (typeof pageSize === "undefined") {
                pageSize = this.pageSize
            }
            try {
                let response = await axios
                    .get(`${API_BASE_URL}/${ENDPOINTS.PRODUCTS}`, {
                        params: {
                            page_no: pageNo,
                            page_size: pageSize,
                        },
                    });
                let data = response.data;
                this.productData = data;
                this.pageNo = pageNo;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async showProductAddModal() {
            this.isProductAddModalVisible = true;

            await axios
                .get(`${API_BASE_URL}/${ENDPOINTS.SELLERS}`)
                .then((res) => (this.sellerData = res.data))

            this.$emit('sellers', this.sellerData.items);

            this.componentKey += 1;
        },
        async showProductUpdateModal(item) {
            this.isProductUpdateModalVisible = true;
            let productResponse = await axios
                .get(`${API_BASE_URL}/${ENDPOINTS.PRODUCTS}/${item.id}`)

            let productData = productResponse.data;
            this.productDoc = productData;
            this.$emit('product', this.productDoc);
            this.componentKey += 1;

            await axios
                .get(`${API_BASE_URL}/${ENDPOINTS.SELLERS}`)
                .then((res) => (this.sellerData = res.data))

            this.$emit('sellers', this.sellerData.items);
        },
        closeModal() {
            this.isProductAddModalVisible = false;
            this.isProductUpdateModalVisible = false;
        },
        updateQuery(value) {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.searchQuery = value;
            }, 300);
        },
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

tbody button {
    background: #e8e8e8;
    border-radius: 5px;
    border-width: 1px;
    border-style: none;
    padding: 5px 4px;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
    transition: box-shadow 0.3s ease;
}

tbody button:hover {
    background-color: yellow;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.4);
}

.footer-content {
    display: flex;
    justify-content: end;
    align-items: center;
}

.footer-content p {
    display: flex;
    align-items: center;
}

.footer-content,
p,
select {
    margin-right: 10px;
}

.footer-content p {
    height: 30px;
}

.footer-content select {
    height: 30px;
    border-radius: 3px;
    border-style: none;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
    transition: box-shadow 0.3s ease;
}

.footer-content button {
    margin-right: 5px;
    height: 30px;
    border-radius: 3px;
    border-style: none;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
    transition: box-shadow 0.3s ease;
}

#footer-td {
    padding: 0px;
}

#cal1 {
    width: 10%;
}
</style>