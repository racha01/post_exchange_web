<template>
    <div class="content">
        <h1>รายละเอียดการซื้อสินค้าเข้า PX</h1>
        <h3>ประเดือน {{ monthly }} รอบวันที่ {{ toDateThai(invoiceDate) }}</h3>
        <div class="sub-title">
            <div class="sub-title-button">
                <button @click="showPostExchangeStockDetailAddModal">เพิ่มข้อมูล</button>
                <button v-if="postExchangeStockDetailData.length" style="margin-left: 5px;" @click="dataConfirm">ยืนยันข้อมูล</button>
            </div>
            <div>
                <PostExchangeStockDetailAddModal :key="componentKey" id="input-add-form"
                    v-show="isPostExchangeStockDetailAddModalVisible" @close="closeModal"
                    @post-exchange-stock-detail-add="updateData" :products="productPostExchanges"
                    :excludedProducts="excludedProductPostExchanges" :postExchangeProducts="postExchangeProductData" />
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
                        <th>เลขบาร์โค้ด</th>
                        <th>จำนวน</th>
                        <th>ราคา</th>
                        <th>จำนวน/หน่วย</th>
                        <th>ราคาขายสด</th>
                        <th>ราคาขายเซ็น</th>
                        <th>กำไร</th>
                        <th>ตัวเลือก</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in filteredItems ?? postExchangeStockDetailData" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td style="text-align: start;">{{ item.product_name }}</td>
                        <td>{{ item.barcode_number }}</td>
                        <td>{{ item.unit_qty }}</td>
                        <td>{{ item.unit_price }}</td>
                        <td>{{ item.qty_per_unit }}</td>
                        <td>{{ item.cash_price }}</td>
                        <td>{{ item.accruals_price }}</td>
                        <td v-if="item.is_sell_post_exchange">{{ (item.unit_qty * item.accruals_price * item.qty_per_unit) - item.total_price}} - {{
                                (item.unit_qty * item.accruals_price * item.qty_per_unit) - item.total_price }}</td>
                        <td v-else></td>
                        <td>
                            <button @click="showPostExchangeStockDetailUpdateModal(item)">แก้ไขข้อมูล</button>
                            <PostExchangeStockDetailUpdateModal :key="componentKey"
                                :postExchangeProducts="postExchangeProductData"
                                @post-exchange-stock-detail-update="updateData"
                                v-show="isPostExchangeStockDetailUpdateModalVisible" @close="closeModal"
                                :postExchangeStockStockDetail="postExchangeStockStockDetail"
                                :products="productPostExchanges" :excludedProducts="excludedProductPostExchanges" />
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="11" id="footer-td">
                            <div class="footer-content">
                                <p>จำนวนแถวต่อหน้า</p>
                                <select @change="handleSelection($event)">
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                    <option>100</option>
                                </select>
                                <!-- <button @click="fetchData((pageNo - 1), pageSize)"
                                    :disabled="postExchangeStockData.has_previous_page == false">
                                    < </button>
                                        <button @click="fetchData((pageNo + 1), pageSize)"
                                            :disabled="postExchangeStockData.has_next_page == false"> > </button> -->
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
import PostExchangeStockDetailAddModal from './modals/PostExchangeStockDetailAddModal.vue'
import PostExchangeStockDetailUpdateModal from './modals/PostExchangeStockDetailUpdateModal.vue'

import axios from 'axios';
const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
export default {
    name: 'PostExchangeStockDetail',
    components: {
        PostExchangeStockDetailAddModal,
        PostExchangeStockDetailUpdateModal
    },
    data() {
        return {
            monthly: '',
            invoiceDate: '',
            cost: 0,
            productPostExchanges: [],
            excludedProductPostExchanges: [],
            postExchangeStockDetailData: [],
            isPostExchangeStockDetailAddModalVisible: false,
            isPostExchangeStockDetailUpdateModalVisible: false,
            postExchangeProductData: [],
            showAlert: false,
            postExchangeStockStockDetail: {},
            componentKey: 0,
            searchQuery: '',
            pageNo: PAGENERATION.PAGE_NO,
            pageSize: PAGENERATION.PAGE_SIZE,
            isFirstData: null

        };
    },
    mounted() {
        this.id = this.$route.query.id;
        this.monthly = decodeURIComponent(this.$route.query.monthly);
        this.invoiceDate = this.$route.query.invoice_date;
        this.cost = this.$route.query.cost;
        if (!!this.$route.query.product_post_exchanges && !!this.$route.query.excluded_product_post_exchanges) {
            this.productPostExchanges = JSON.parse(this.$route.query.product_post_exchanges);
            this.excludedProductPostExchanges = JSON.parse(this.$route.query.excluded_product_post_exchanges);
            console.log(`after: ${this.productPostExchanges[0].is_sell_post_exchange}`)
            this.postExchangeStockDetailData = [...this.productPostExchanges, ...this.excludedProductPostExchanges]
        }
        this.isFirstData = JSON.parse(this.$route.query.is_first_data);

    },
    methods: {
        async dataConfirm() {
            if (this.isFirstData) {
                let text = "ยืนยันข้อมูลการเพิ่มสินค้าใน PX";
                if (confirm(text) == true) {
                    const res = await axios.post(`${API_BASE_URL}/${ENDPOINTS.POST_EXCHANGE_STOCKS}`,
                        {
                            monthly: `${this.monthly}`,
                            product_post_exchanges: [...this.productPostExchanges],
                            excluded_product_post_exchanges: [...this.excludedProductPostExchanges],
                            cost: this.cost,
                            invoice_date: `${this.invoiceDate}`
                        });

                    this.$router.back({
                        name: 'postExchangeStock'
                    });
                    res.data.json;
                }
            } else {
                let text = "ยืนยันข้อมูลการแก้ไขสินค้าใน PX";
                if (confirm(text) == true) {
                    const res = await axios.put(`${API_BASE_URL}/${ENDPOINTS.POST_EXCHANGE_STOCKS}/${this.id}`,
                        {
                            monthly: `${this.monthly}`,
                            product_post_exchanges: [...this.productPostExchanges],
                            excluded_product_post_exchanges: [...this.excludedProductPostExchanges],
                            cost: this.cost,
                            invoice_date: `${this.invoiceDate}`
                        });

                    this.$router.back({
                        name: 'postExchangeStock'
                    });
                    res.data.json;
                }
            }
        },
        async showPostExchangeStockDetailAddModal() {
            this.isPostExchangeStockDetailAddModalVisible = true;

            await axios
                .get(`${API_BASE_URL}/${ENDPOINTS.POST_EXCHANGE_PRODUCTS}`)
                .then((res) => (this.postExchangeProductData = res.data.items))

            this.$emit('postExchangeProducts', this.postExchangeProductData.items);

            this.componentKey += 1;
        },
        async showPostExchangeStockDetailUpdateModal(item) {
            this.isPostExchangeStockDetailUpdateModalVisible = true;
            await axios
                .get(`${API_BASE_URL}/${ENDPOINTS.POST_EXCHANGE_PRODUCTS}`)
                .then((res) => (this.postExchangeProductData = res.data.items))
            this.$emit('postExchangeProducts', this.postExchangeProductData);

            this.postExchangeStockStockDetail = item;
            this.$emit('postExchangeStockStockDetail', this.postExchangeStockStockDetail);
            this.componentKey += 1;
        },
        closeModal() {
            this.isPostExchangeStockDetailAddModalVisible = false;
            this.isPostExchangeStockDetailUpdateModalVisible = false;
        },
        updateData(data) {
            this.productPostExchanges = data.product_post_exchanges;
            this.excludedProductPostExchanges = data.excluded_product_post_exchanges;
            this.postExchangeStockDetailData = [...this.productPostExchanges, ...this.excludedProductPostExchanges]
        },
        toDateThai(dateTime) {
            const date = new Date(dateTime);
            const day = date.getUTCDate();
            const month = date.getUTCMonth();
            const year = (date.getUTCFullYear() + 543).toString().slice(-2);
            return `${day}-${months[month]}-${year}`
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

.alert {
    background-color: #f2f2f2;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>