<template>
    <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header">
                <p> เพิ่มข้อมูลการส่งสินค้า</p>
            </header>
            <section class="modal-body">
                <div class="item">
                    <label>วันที่</label>
                    <input v-model="deliverGoodDate" type="date" @change="formatISODate">
                </div>
                <div class="item">
                    <label for="product">ชื่อสินค้า</label>
                    <select v-model="productId" @change="handleSelect(products)">
                        <option v-for="product in products" :key="product" :value="product.id">
                            {{ `${product.product_name} (${product.seller_name})` }}
                        </option>
                    </select>
                </div>
                <div class="item">
                    <label>ชื่อผู้ฝากขาย</label>
                    <input disabled="true" type="text" :placeholder="sellerName">
                </div>
                <div class="item">
                    <label>ราคาส่ง</label>
                    <input v-model="wholesalePrice" type="number" min="0">
                </div>
                <div class="item">
                    <label>ราคาขายสด</label>
                    <input v-model="cashPrice" type="number" min="0">
                </div>
                <div class="item">
                    <label>ราคาเซ็น</label>
                    <input v-model="accrualsPrice" type="number" min="0">
                </div>
                <div class="item">
                    <label>จำนวน</label>
                    <input v-model="amount" type="number" min="0">
                </div>
                <div class="item">
                    <label>จำหน่าย</label>
                    <input v-model="leftovers" type="number" min="0">
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
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from './../../../config';
export default {
    name: "DeliverGoodAddModal",
    data() {
        return {
            isDropdownVisible: true,
            selectedValue: '',
            sellerName: '',
            wholesalePrice: null,
            cashPrice: null,
            accrualsPrice: null,
            leftovers: 0,
        }
    },
    props: {
        products: []
    },
    methods: {
        async addData() {
            const res = await axios.post(`${API_BASE_URL}/${ENDPOINTS.DELIVER_GOODS}`,
                {
                    product_id: `${this.productId}`,
                    wholesale_price: `${this.wholesalePrice}`,
                    cash_price: `${this.cashPrice}`,
                    accruals_price: `${this.accrualsPrice}`,
                    amount: `${this.amount}`,
                    leftovers: `${this.leftovers}`,
                    deliver_good_date: `${this.deliverGoodDate}`
                });
            res.data.json;

            this.$emit('close');
            this.$emit('data-updated');
        },
        async close() {
            this.$emit('close');
            const res = await axios.post(`${API_BASE_URL}/${ENDPOINTS.DELIVER_GOODS}`,
                {
                    seller_id: `${this.sellerId}`,
                    product_code: `${this.productCode}`,
                    product_name: `${this.productName}`,
                    wholesale_price: `${this.wholesalePrice}`,
                    cash_price: `${this.cashPrice}`,
                    accruals_price: `${this.accrualsPrice}`,
                });
            res.data.json;

            this.$emit('close');
            this.$emit('data-updated');
        },
        updateToUppercase(event) {
            event.target.value = event.target.value.toUpperCase();
        },
        handleSelect(products) {
            this.sellerName = products.find(x => x.id === event.target.value)?.seller_name
            this.wholesalePrice = products.find(x => x.id === event.target.value)?.wholesale_price
            this.cashPrice = products.find(x => x.id === event.target.value)?.cash_price
            this.accrualsPrice = products.find(x => x.id === event.target.value)?.accruals_price
        },
        formatISODate() {
            const selectedDate = new Date(this.deliverGoodDate);
            selectedDate.setUTCHours(17, 0, 0, 0);
            this.deliverGoodDate = selectedDate.toISOString();
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
    flex-direction: row;
    padding: 20px 10px;
    flex-wrap: wrap;
    gap: 10px;
    width: 500px;
}

.item {
    padding: 0px;
    flex: 1 1 200px;
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