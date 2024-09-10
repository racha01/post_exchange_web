<template>
    <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header">
                <p>แก้ไขข้อมูลสินค้าเข้า PX</p>
            </header>
            <section class="modal-body">
                <div>
                    <label>ประจำเดือน</label>
                    <select v-model="monthly">
                        <option value="" hidden="true" disabled v-show="false">{{ postExchangeStock.monthly }}</option>
                        <option v-for="item in monthAndYears" :key="item" :value="item">
                            {{ item }}
                        </option>
                    </select>
                </div>
                <div>
                    <label>วันที่ใบกำกับสินค้า</label>
                    <input v-model="invoiceDate" type="date" @change="formatISODate">
                </div>
                <div>
                    <label>ต้นทุน</label>
                    <input v-model="cost" type="number" min="0" :placeholder="postExchangeStock.cost">
                </div>
            </section>

            <footer class="modal-footer">
                <button type="button" class="btn-green" @click="updateData">
                    แก้ไขข้อมูล
                </button>
                <button type="button" class="btn-gray" @click="close">
                    ยกเลิก
                </button>
            </footer>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from './../../../config';
const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม",
    "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน",
    "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];
export default {
    name: 'PostExchangeStockUpdateModal',
    data(){
        return{
            monthly: '',
            monthAndYears: []
        }
    },
    props: {
        postExchangeStock: {
            monthly: String,
            product_post_exchanges: [{
                cash_price: Number,
                accruals_price: Number,
                qty_per_unit: Number,
                total_cash_price: Number,
                total_accruals_price: Number,
                net_profit_cash_price: Number,
                net_profit_accruals_price: Number,
                product_name: String,
                barcode_number: String,
                unit_qty: Number,
                unit_price: Number,
                total_price: Number,
                is_sell_post_exchang: Boolean
            }],
            excluded_product_post_exchanges: [{
                product_name: String,
                barcode_number: String,
                unit_qty: Number,
                unit_price: Number,
                total_price: Number,
                is_sell_post_exchang: Boolean
            }],
            invoice_date: String,
            cost: Number,
        }
    },
    mounted() {
        this.monthAndYearOnlyLastTwoDigits();
        this.setDataPicker();
    },
    methods: {
        monthAndYearOnlyLastTwoDigits() {
            const monthAndYearList = []
            const toDay = new Date();
            const year = (toDay.getUTCFullYear() + 543).toString().slice(-2);
            for (let i = 0; i < months.length; i++) {
                monthAndYearList.push(`${months[i]} ${year}`)
            }
            this.monthAndYears = monthAndYearList;
        },
        formatISODate() {
            const selectedDate = new Date(this.invoiceDate);
            selectedDate.setUTCHours(17, 0, 0, 0);
            this.invoiceDate = selectedDate.toISOString();
        },
        setDataPicker() {
            const date = new Date(this.postExchangeStock.invoice_date);
            const yyyy = date.getUTCFullYear();
            const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
            const dd = String(date.getUTCDate()).padStart(2, '0');
            this.invoiceDate = `${yyyy}-${mm}-${dd}`;
        },
        async updateData() {
            const res = await axios.put(`${API_BASE_URL}/${ENDPOINTS.POST_EXCHANGE_STOCKS}/${this.postExchangeStock._id}`,
                {
                    monthly: `${!this.monthly ? this.postExchangeStock.monthly : this.monthly}`,
                    product_post_exchanges: [...this.postExchangeStock.product_post_exchanges],
                    excluded_product_post_exchanges: [...this.postExchangeStock.excluded_product_post_exchanges],
                    invoice_date: `${!this.invoice_date ? this.postExchangeStock.invoice_date : this.invoice_date}`,
                    cost: `${!this.cost ? this.postExchangeStock.cost : this.cost}`
                });
            this.$emit('data-update', res.data.json);
            this.$emit('close');
        },
        close() {
            this.$emit('close');
        },
        
    }

}
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
}


.modal-footer {
    padding: 15px;
    display: flex;
}

.modal-header p {
    font-size: 20px;
}

.modal-header {
    position: relative;
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
}

.modal-header slot {
    font-size: 20px;
}

.modal-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
    justify-content: flex-end;
}

.modal-body {
    display: flex;
    flex-direction: column;
    padding: 20px 10px;
}

.modal-body div {
    margin-bottom: 10px;
}

.modal-body input,
select {
    display: block;
    box-sizing: border-box;
    width: 100%;
    outline: none;
    margin: 0;
    padding-top: 12px;
    padding-bottom: 5px;
    font-size: 20px;
    text-align: center;
    border-radius: 5px;
    border-color: rgb(163, 163, 163);
    border-style: solid;
    border-width: 1px;
}

.modal-body label {
    background-color: white;
    position: relative;
    color: rgb(88, 88, 88);
    top: 11px;
}

.btn-close {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
}

.btn-green {
    color: white;
    background: #00d61d;
    border: 1px solid #00d61d;
    border-radius: 2px;
    margin-bottom: 2px;
    padding: 10px;
    border-radius: 5px;
    font-size: 16px;
}

.btn-gray {
    color: white;
    background: gray;
    border: 1px solid gray;
    border-radius: 2px;
    margin-bottom: 2px;
    padding: 10px;
    border-radius: 5px;
    font-size: 16px;
}

#link {
    color: #ffffff;
    text-decoration: none;
}
</style>