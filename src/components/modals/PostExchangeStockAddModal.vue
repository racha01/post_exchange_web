<template>
    <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header">
                <p>เพิ่มข้อมูลซื้อสินค้าเข้า PX</p>
            </header>

            <section class="modal-body">
                <div>
                    <label>ประจำเดือน</label>
                    <select v-model="monthly">
                        <option v-for="item in monthAndYears" :key="item" :value="item">
                            {{ item }}
                        </option>
                    </select>
                </div>
                <div>
                    <label>วันที่ใบกำกับสินค้า</label>
                    <input v-model="invoiceDate" type="date">
                </div>
                <div>
                    <label>ต้นทุน</label>
                    <input v-model="cost" type="number" min="0">
                </div>
            </section>

            <footer class="modal-footer">
                <button type="button" class="btn-green" @click="addData">
                    เพิ่มข้อมูล
                </button>
                <button type="button" class="btn-gray" @click="close">
                    ยกเลิก
                </button>
            </footer>
        </div>
    </div>
</template>

<script>
import emitter from './../../eventBus';
const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม",
    "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน",
    "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];
export default {
    name: 'PostExchangeStockAddModal',
    // props: {
    //     monthly: String,
    //     invoice_date: String
    //     // products: [{
    //     //     cash_price: Number,
    //     //     accruals_price: Number,
    //     //     qty_per_unit: Number,
    //     //     total_cash_price: Number,
    //     //     total_accruals_price: Number,
    //     //     net_profit_cash_price: Number,
    //     //     net_profit_accruals_price: Number,
    //     //     product_name: String,
    //     //     barcode_number: String,
    //     //     unit_qty: Number,
    //     //     unit_price: Number,
    //     //     total_price: Number
    //     // }],
    //     // excludedProducts: [{
    //     //     product_name: String,
    //     //     barcode_number: String,
    //     //     unit_qty: Number,
    //     //     unit_price: Number,
    //     //     total_price: Number
    //     // }]
    // },
    data() {
        return {
            monthAndYears: []
        }
    },
    mounted() {
        this.monthAndYearOnlyLastTwoDigits();
    },
    methods: {
        async addData() {
            this.$router.push({
                name: 'postExchangeStockDetail',
                query: {
                    id: null,
                    monthly: this.monthly,
                    invoice_date: this.invoiceDate,
                    cost: this.cost,
                    is_first_data: true,
                }
            });

            this.$emit('close');
        },
        close() {
            this.$emit('close');
        },
        monthAndYearOnlyLastTwoDigits() {
            const monthAndYearList = []
            const toDay = new Date();
            const year = (toDay.getUTCFullYear() + 543).toString().slice(-2);
            for (let i = 0; i < months.length; i++) {
                monthAndYearList.push(`${months[i]} ${year}`)
            }
            this.monthAndYears = monthAndYearList;
        }
    },

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
</style>