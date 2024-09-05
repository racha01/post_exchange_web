<template>
    <div class="content">
        <h1>สินค้าใน PX</h1>
        <div class="sub-title">
            <div class="sub-title-button">
                <button @click="showPostExchangeProductAddModal">เพิ่มข้อมูล</button>
            </div>
            <div>
                <PostExchangeProductAddModal :key="componentKey" id="input-add-form"
                    v-show="isPostExchangeProductAddModalVisible" @close="closeModal" @data-updated="fetchData" />
            </div>
            <div>
                <input @input="updateQuery($event.target.value)" class="sub-title-input" type="text"
                    placeholder="Search">
            </div>
        </div>
        <div>
            <table>
                <thead>
                    <tr>
                        <th id="cal1">ลำดับ</th>
                        <th>ชื่อสินค้า</th>
                        <th>บาร์โค้ด</th>
                        <th>ประเภท</th>
                        <th>ตัวเลือก</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in filteredItems ?? postExchangeProductData.items" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.product_name }}</td>
                        <td>{{ item.barcode_number }}</td>
                        <td>{{ item.type }}</td>
                        <td>
                            <button @click="showPostExchangeProductUpdateModal(item)">แก้ไขข้อมูล</button>
                            <PostExchangeProductUpdateModal :key="componentKey"
                                :postExchangeProdcut="postExchangeProdcut" @data-update="fetchData"
                                v-show="isPostExchangeProductUpdateModalVisible" @close="closeModal" />
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="5" id="footer-td">
                            <div class="footer-content">
                                <p>จำนวนแถวต่อหน้า</p>
                                <select @change="handleSelection($event)">
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                    <option>100</option>
                                </select>
                                <button @click="fetchData((pageNo - 1), pageSize)"
                                    :disabled="postExchangeProductData.has_previous_page == false">
                                    < </button>
                                        <button @click="fetchData((pageNo + 1), pageSize)"
                                            :disabled="postExchangeProductData.has_next_page == false">></button>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>
<script>
import { API_BASE_URL, ENDPOINTS, PAGENERATION } from './../../config';
import axios from 'axios';
import PostExchangeProductAddModal from './modals/PostExchangeProductAddModal.vue'
import PostExchangeProductUpdateModal from './modals/PostExchangeProductUpdateModal.vue'
export default {
    name: "PostExchangeProduct",
    data() {
        return {
            postExchangeProductData: [],
            isPostExchangeProductAddModalVisible: false,
            isPostExchangeProductUpdateModalVisible: false,
            postExchangeProdcut: {},
            componentKey: 0,
            searchQuery: '',
            pageNo: PAGENERATION.PAGE_NO,
            pageSize: PAGENERATION.PAGE_SIZE
        };
    },
    mounted() {
        this.fetchData();
    },
    components: {
        PostExchangeProductAddModal,
        PostExchangeProductUpdateModal
    },
    computed: {
        filteredItems() {
            if (!this.postExchangeProductData.items) return null;
            return this.postExchangeProductData.items.filter(item => {
                return (
                    item.product_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.barcode_number.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.type.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            });
        }
    },
    methods: {
        async fetchData(pageNo, pageSize) {
            pageNo = Number(pageNo)
            console.log(pageSize)
            if (isNaN(pageNo)) {
                pageNo = this.pageNo
            }
            if (typeof pageSize === "undefined") {
                pageSize = this.pageSize
            }
            try {
                let response = await axios
                    .get(`${API_BASE_URL}/${ENDPOINTS.POST_EXCHANGE_PRODUCTS}`, {
                        params: {
                            page_no: pageNo,
                            page_size: pageSize,
                        },
                    });
                let data = response.data;
                this.postExchangeProductData = data;
                this.pageNo = pageNo;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        closeModal() {
            this.isPostExchangeProductAddModalVisible = false;
            this.isPostExchangeProductUpdateModalVisible = false;
        },
        updateQuery(value) {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.searchQuery = value;
            }, 300);
        },
        showPostExchangeProductAddModal() {
            this.isPostExchangeProductAddModalVisible = true;
            this.componentKey += 1;
        },
        async showPostExchangeProductUpdateModal(item) {
            this.isPostExchangeProductUpdateModalVisible = true;
            await axios
                .get(`${API_BASE_URL}/${ENDPOINTS.POST_EXCHANGE_PRODUCTS}/${item.id}`)
                .then((res) => (this.postExchangeProdcut = res.data))
            this.$emit('postExchangeProdcut', this.postExchangeProdcut);
            this.componentKey += 1;
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