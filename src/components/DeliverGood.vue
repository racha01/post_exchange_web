<template>
    <div class="content">
        <h1>รายการส่งสินค้า</h1>
        <div class="sub-title">
            <div class="sub-title-data">
                <div class="sub-title-button">
                    <button @click="showDeliverGoodAddModal">เพิ่มข้อมูล</button>
                </div>
                <div style="margin-left: 5px;">
                    <VueDatePicker @input="onDateSelected" v-model="date" :range="{ partialRange: false }" />
                </div>
            </div>
            <div>
                <DeliverGoodAddModal :key="componentKey" id="input-add-form" v-show="isDeliverGoodAddModalVisible"
                    @close="closeModal" @data-updated="fetchData" :products="productData" />
            </div>
            <div class="sub-title-end">
                <div style="margin-right: 5px;" class="sub-title-button">
                    <button>
                        <download-excel class="btn btn-default" :data="formattedData" :fields="json_fields"
                            header="รายการส่งสินค้า" worksheet="Sheet1" name="รายการส่งสินค้า.xls">
                        </download-excel>
                    </button>
                </div>
                <div>
                    <input @input="updateQuery($event.target.value)" class="sub-title-input" type="text"
                        placeholder="Search">
                </div>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th id="cal1">ลำดับ</th>
                    <th>วันที่</th>
                    <th>ชื่อผู้ฝากขาย</th>
                    <th>ชื่อสินค้า</th>
                    <th>ราคาส่ง</th>
                    <th>ราคาขายสด</th>
                    <th>ราคาขายเซ็น</th>
                    <th>จำนวน</th>
                    <th>จำหน่าย</th>
                    <th>ตัวเลือก</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in filteredItems ?? deliverGoodData.items" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ toDateThai(item.deliver_good_date) }}</td>
                    <td>{{ item.seller_name }}</td>
                    <td>{{ item.product_name }}</td>
                    <td>{{ item.wholesale_price }}</td>
                    <td>{{ item.cash_price }}</td>
                    <td>{{ item.accruals_price }}</td>
                    <td>{{ item.amount }}</td>
                    <td>{{ item.leftovers }}</td>
                    <td>
                        <button @click="showDeliverGoodUpdateModal(item)">แก้ไขข้อมูล</button>
                        <DeliverGoodUpdateModal :key="componentKey" :deliverGood="deliverGoodDoc"
                            :products="productData" @deliver-good-update="fetchData"
                            v-show="isDeliverGoodUpdateModalVisible" @close="closeModal" />
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="10" id="footer-td">
                        <div class="footer-content">
                            <p>จำนวนแถวต่อหน้า</p>
                            <select @change="handleSelection($event)">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                                <option>100</option>
                            </select>
                            <button @click="fetchData((pageNo - 1), pageSize)"
                                :disabled="deliverGoodData.has_previous_page == false">
                                < </button>
                                    <button @click="fetchData((pageNo + 1), pageSize)"
                                        :disabled="deliverGoodData.has_next_page == false">></button>
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
import DeliverGoodAddModal from './modals/DeliverGoodAddModal.vue'
import DeliverGoodUpdateModal from './modals/DeliverGoodUpdateModal.vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
export default {
    name: "DeliverGood",
    mounted() {
        if (!!this.$route.query.seller_id) {
            this.sellerId = this.$route.query.seller_id;
        }
        this.setDatePicker();
        this.fetchData();
    },
    components: {
        DeliverGoodAddModal,
        DeliverGoodUpdateModal,
        VueDatePicker
    },
    computed: {
        filteredItems() {
            if (!this.deliverGoodData.items) return null;
            return this.deliverGoodData.items.filter(item => {
                return (
                    item.seller_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.product_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.wholesale_price.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.cash_price.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.accruals_price.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.amount.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.leftovers.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.deliver_good_date.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            });
        },
        formattedData() {
            let data = this.filteredItems ?? this.deliverGoodData.items
            return Array.isArray(data) ? data.map((item, index) => ({
                number: index + 1,
                date: this.toDateThai(item.deliver_good_date),
                total_price: (item.wholesale_price * item.amount) - (item.wholesale_price * item.leftovers),
                ...item
            })) : [];
        }
    },
    data() {
        return {
            deliverGoodData: [],
            isDeliverGoodAddModalVisible: false,
            isDeliverGoodUpdateModalVisible: false,
            deliverGoodDoc: {},
            componentKey: 0,
            searchQuery: '',
            pageNo: PAGENERATION.PAGE_NO,
            pageSize: PAGENERATION.PAGE_SIZE,
            productData: [],
            deliverGoodDoc: {},
            sellerId: null,
            date: [],
            token: this.$cookies.get('token'),
            json_fields: {
                "ลำดับ": "number",
                "วันที่": "date",
                "ชื่อผู้ฝากขาย": "seller_name",
                "ชื่อสินค้า": "product_name",
                "ราคาส่ง": "wholesale_price",
                "ราคาขายสด": "cash_price",
                "ราคาขายเซ็น": "accruals_price",
                "จำนวน": "amount",
                "จำหน่าย": "leftovers",
                "ราคารวม": "total_price"
            },
            json_meta: [
                [
                    {
                        key: "charset",
                        value: "utf-8",
                    },
                ],
            ],

        };
    },
    methods: {
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
                    .get(`${API_BASE_URL}/${ENDPOINTS.DELIVER_GOODS}`, {
                        params: {
                            seller_id: this.sellerId,
                            page_no: pageNo,
                            page_size: pageSize,
                            start_date: this.date[0],
                            end_date: this.date[1]
                        },
                        headers: {
                            Authorization: this.token
                        }
                    });
                let data = response.data;
                this.deliverGoodData = data;
                this.pageNo = pageNo;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        toDateThai(dateTime) {
            const date = new Date(dateTime);
            const day = date.getUTCDate();
            const month = date.getUTCMonth();
            const year = (date.getUTCFullYear() + 543).toString().slice(-2);
            return `${day}-${months[month]}-${year}`
        },
        async showDeliverGoodAddModal() {
            this.isDeliverGoodAddModalVisible = true;

            await axios
                .get(`${API_BASE_URL}/${ENDPOINTS.PRODUCTS}`, {
                    headers: {
                        Authorization: this.token
                    }
                })
                .then((res) => (this.productData = res.data.items))

            this.$emit('products', this.productData);

            this.componentKey += 1;
        },
        async showDeliverGoodUpdateModal(item) {
            this.isDeliverGoodUpdateModalVisible = true;
            let productResponse = await axios
                .get(`${API_BASE_URL}/${ENDPOINTS.DELIVER_GOODS}/${item.id}`, {
                    headers: {
                        Authorization: this.token
                    }
                })

            let productData = productResponse.data;
            this.deliverGoodDoc = productData;
            this.$emit('deliverGood', this.deliverGoodDoc);
            this.componentKey += 1;

            await axios
                .get(`${API_BASE_URL}/${ENDPOINTS.PRODUCTS}`, {
                    headers: {
                        Authorization: this.token
                    }
                })
                .then((res) => (this.productData = res.data.items))

            this.$emit('products', this.productData);
        },
        closeModal() {
            this.isDeliverGoodAddModalVisible = false;
            this.isDeliverGoodUpdateModalVisible = false;
        },
        updateQuery(value) {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.searchQuery = value;
            }, 300);
        },
        handleSelection(event) {
            const selectedValue = event.target.value;
            this.fetchData(this.pageNo, selectedValue);
            this.pageSize = selectedValue;
        },
        setDatePicker() {
            let date = (new Date(2024, (new Date().getMonth()), 7));
            let startDate = (new Date(date.setUTCHours(0, 0, 0, 0))).toISOString();

            let oneDayInMilliseconds = 24 * 60 * 60 * 1000;
            let endDateTimstamp = date.setMonth(date.getMonth() + 1) - oneDayInMilliseconds;

            let endDate = new Date(endDateTimstamp).toISOString();

            this.date = [startDate, endDate];
        },
    },
    watch: {
        date(newValue, oldValue) {
            this.date = newValue;
            this.fetchData();
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

.sub-title-end {
    display: flex;
}
</style>