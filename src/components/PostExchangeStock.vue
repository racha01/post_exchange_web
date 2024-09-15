<template>
    <div class="content">
        <h1>รายการซื้อสินค้าเข้า PX</h1>
        <div class="sub-title">
            <div class="sub-title-button">
                <button @click="showPostExchangeStockAddModal">เพิ่มข้อมูล</button>
            </div>
            <div>
                <PostExchangeStockAddModal :key="componentKey" id="input-add-form"
                    v-show="isPostExchangeStockAddModalVisible" @close="closeModal" />
            </div>
            <div class="sub-title-end">
                <div style="margin-right: 5px;" class="sub-title-button">
                    <button>
                        <download-excel class="btn btn-default" :data="formattedData" :fields="json_fields"
                            header="รายการซื้อสินค้าเข้าPX" worksheet="Sheet1" name="รายการซื้อสินค้าเข้าPX.xls">
                        </download-excel>
                    </button>
                </div>
                <div>
                    <input @input="updateQuery($event.target.value)" class="sub-title-input" type="text"
                        placeholder="Search">
                </div>
            </div>
        </div>
        <div>
            <table>
                <thead>
                    <tr>
                        <th id="cal1">ลำดับ</th>
                        <th>ประจำเดือน</th>
                        <th>วันที่ใบกำกับสินค้า</th>
                        <th>ต้นทุนทั้งหมด</th>
                        <th>กำไรทั้งหมด</th>
                        <th>ตัวเลือก</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in filteredItems ?? postExchangeStockData.items" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.monthly }}</td>
                        <td>{{ toDateThai(item.invoice_date) }}</td>
                        <td>{{ item.cost }}</td>
                        <td>{{ item.net_profit_cash_price_all }} - {{ item.net_profit_accruals_price_all }}</td>
                        <td>
                            <button style="margin-right: 5px;" @click="toPostExchangeStockDetail(item)">
                                รายละเอียด
                            </button>
                            <button @click="showPostExchangeStockUpdateModal(item)">แก้ไขข้อมูล</button>
                            <PostExchangeStockUpdateModal :key="componentKey" :postExchangeStock="postExchangeStockDoc"
                                @data-update="fetchData" v-show="isPostExchangeStockUpdateModalVisible"
                                @close="closeModal" />
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="6" id="footer-td">
                            <div class="footer-content">
                                <p>จำนวนแถวต่อหน้า</p>
                                <select @change="handleSelection($event)">
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                    <option>100</option>
                                </select>
                                <button @click="fetchData((pageNo - 1), pageSize)"
                                    :disabled="postExchangeStockData.has_previous_page == false">
                                    < </button>
                                        <button @click="fetchData((pageNo + 1), pageSize)"
                                            :disabled="postExchangeStockData.has_next_page == false">></button>
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

import PostExchangeStockAddModal from './modals/PostExchangeStockAddModal.vue'
import PostExchangeStockUpdateModal from './modals/PostExchangeStockUpdateModal.vue'

const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
export default {
    name: "PostExchangeStock",
    data() {
        return {
            postExchangeStockData: [],
            isPostExchangeStockAddModalVisible: false,
            isPostExchangeStockUpdateModalVisible: false,
            postExchangeStockDoc: {},
            componentKey: 0,
            searchQuery: '',
            pageNo: PAGENERATION.PAGE_NO,
            pageSize: PAGENERATION.PAGE_SIZE,
            token: this.$cookies.get('token'),
            json_fields: {
                "ลำดับ": "number",
                "ประจำเดือน": "monthly",
                "วันที่ใบกำกับสินค้า": "date",
                "ต้นทุนทั้งหมด": "cost",
                "กำไรเงินสดทั้งหมด": "net_profit_cash_price_all",
                "กำไรเงินเซ็นทั้งหมด": "net_profit_accruals_price_all"
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
    mounted() {
        this.fetchData();
    },
    components: {
        PostExchangeStockAddModal,
        PostExchangeStockUpdateModal
    },
    computed: {
        filteredItems() {
            if (!this.postExchangeStockData.items) return null;
            return this.postExchangeStockData.items.filter(item => {
                return (
                    item.monthly.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.invoice_date.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.cost.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.net_profit_cash_price_all.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.net_profit_accruals_price_all.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            });
        },
        formattedData() {
            let data = this.filteredItems ?? this.postExchangeStockData.items
            return Array.isArray(data) ? data.map((item, index) => ({
                number: index + 1,
                date: this.toDateThai(item.invoice_date),
                ...item
            })) : [];
        }
    },
    methods: {
        handleSelection(event) {
            const selectedValue = event.target.value;
            this.fetchData(this.pageNo, selectedValue);
            this.pageSize = selectedValue;
        },
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
                    .get(`${API_BASE_URL}/${ENDPOINTS.POST_EXCHANGE_STOCKS}`, {
                        params: {
                            page_no: pageNo,
                            page_size: pageSize,
                        },
                        headers: {
                            Authorization: this.token
                        }
                    });
                let data = response.data;
                this.postExchangeStockData = data;
                this.pageNo = pageNo;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async showPostExchangeStockAddModal() {
            this.isPostExchangeStockAddModalVisible = true;
            this.componentKey += 1;
        },
        async showPostExchangeStockUpdateModal(item) {
            console.log(item)
            this.isPostExchangeStockUpdateModalVisible = true;
            let response = await axios
                .get(`${API_BASE_URL}/${ENDPOINTS.POST_EXCHANGE_STOCKS}/${item._id}`, {
                    headers: {
                        Authorization: this.token
                    }
                });
            let data = response.data;
            this.postExchangeStockDoc = data;
            console.log(this.postExchangeStockDoc)
            this.$emit('postExchangeStock', this.postExchangeStockDoc);
            this.componentKey += 1;
        },
        closeModal() {
            this.isPostExchangeStockAddModalVisible = false;
            this.isPostExchangeStockUpdateModalVisible = false;
        },
        updateQuery(value) {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.searchQuery = value;
            }, 300);
        },
        toPostExchangeStockDetail(item) {
            console.log(`befor: ${item.product_post_exchanges[0].is_sell_post_exchange}`)
            this.$router.push({
                name: 'postExchangeStockDetail',
                query: {
                    id: item._id,
                    monthly: item.monthly,
                    invoice_date: item.invoice_date,
                    cost: item.cost,
                    product_post_exchanges: JSON.stringify(item.product_post_exchanges),
                    excluded_product_post_exchanges: JSON.stringify(item.excluded_product_post_exchanges),
                    is_first_data: false,
                }
            });
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
</style>