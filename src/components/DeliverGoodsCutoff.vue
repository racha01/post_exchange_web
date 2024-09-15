<template>
    <div class="content">
        <h1>ยอดการส่งสินค้าของผู้ฝากขาย</h1>
        <div class="sub-title">
            <div>
                <VueDatePicker v-model="date" :range="{ partialRange: false }" />
            </div>
            <div>
                <SellerAddModal :key="componentKey" id="input-add-form" v-show="isSellerAddModalVisible"
                    @close="closeModal" @data-updated="fetchData" />
            </div>
            <div class="sub-title-end">
                <div style="margin-right: 5px;" class="sub-title-button">
                    <button>
                        <download-excel class="btn btn-default" :data="formattedData" :fields="json_fields"
                            header="ยอดการส่งสินค้าของผู้ฝากขาย" worksheet="Sheet1"
                            name="ยอดการส่งสินค้าของผู้ฝากขาย.xls">
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
                        <th>รหัสผู้ฝากขาย</th>
                        <th>ชื่อผู้ฝากขาย</th>
                        <th>ต้นทุน</th>
                        <th>กำไร</th>
                        <th>ตัวเลือก</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in filteredItems ?? deliverGoodsCutoffData.items" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.seller_code }}</td>
                        <td>{{ item.seller_name }}</td>
                        <td>{{ item.total_cost }}</td>
                        <td>{{ item.net_profit_cash_price }} - {{ item.net_profit_accruals_price }}</td>
                        <td>
                            <button @click="DeliverGoods(item)">รายละเอียด</button>
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
                                    :disabled="deliverGoodsCutoffData.has_previous_page == false">
                                    < </button>
                                        <button @click="fetchData((pageNo + 1), pageSize)"
                                            :disabled="deliverGoodsCutoffData.has_next_page == false">></button>
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
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
export default {
    name: 'DeliverGoodsCutoff',
    data() {
        return {
            deliverGoodsCutoffData: [],
            date: [],
            token: this.$cookies.get('token'),
            searchQuery: '',
            json_fields: {
                "ลำดับ": "number",
                "รหัสผู้ฝากขาย": "seller_code",
                "ชื่อผู้ฝากขาย": "seller_name",
                "ต้นทุน": "total_cost",
                "กำไรเงินสด": "net_profit_cash_price",
                "กำไรเงินเซ็น": "net_profit_accruals_price",
            },
            json_meta: [
                [
                    {
                        key: "charset",
                        value: "utf-8",
                    },
                ],
            ],
        }
    },
    components: {
        VueDatePicker
    },
    computed: {
        filteredItems() {
            if (!this.deliverGoodsCutoffData.items) return null;
            return this.deliverGoodsCutoffData.items.filter(item => {
                return (
                    item.seller_code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.seller_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.total_cost.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                    item.net_profit_cash_price.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.net_profit_accruals_price.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            });
        },
        formattedData() {
            let data = this.filteredItems ?? this.deliverGoodsCutoffData.items
            return Array.isArray(data) ? data.map((item, index) => ({
                number: index + 1,
                ...item
            })) : [];
        }
    },
    mounted() {
        this.setDatePicker();
        this.fetchData();
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
                    .get(`${API_BASE_URL}/${ENDPOINTS.DELIVER_GOODS_CUTOFF}`, {
                        params: {
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
                this.deliverGoodsCutoffData = data;
                this.pageNo = pageNo;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        DeliverGoods(item) {
            this.$router.push({
                name: 'deliverGoodCutoffDetail',
                query: {
                    seller_id: item.seller_id,
                    date: JSON.stringify(this.date)
                }
            });
        },
        datePicker() {
            this.selectDatePicker = !this.selectDatePicker;
        },
        onDateSelected() {
            this.selectDatePicker = false;
        },
        setDatePicker() {
            let date = (new Date(2024, (new Date().getMonth()), 7));
            let startDate = (new Date(date.setUTCHours(0, 0, 0, 0))).toISOString();

            let oneDayInMilliseconds = 24 * 60 * 60 * 1000;
            let endDateTimstamp = date.setMonth(date.getMonth() + 1) - oneDayInMilliseconds;

            let endDate = new Date(endDateTimstamp).toISOString();

            this.date = [startDate, endDate];
        },
        updateQuery(value) {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.searchQuery = value;
            }, 300);
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

.date-picker {
    position: absolute;
    top: 50px;
    left: 50px;
    width: 200px;
    height: 200px;
    background-color: rgba(255, 0, 0, 0.7);
    z-index: 1;

}

.sub-title-end {
    display: flex;
}
</style>