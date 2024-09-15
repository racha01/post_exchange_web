<template>
    <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header">
                <p>แก้ไขข้อมูลการส่งสินค้า</p>
            </header>
            <section class="modal-body">
                <div class="item">
                    <label>วันที่</label>
                    <input v-model="deliverGoodDate" type="date" @change="formatISODate">
                </div>
                <div class="item">
                    <label for="product">ชื่อสินค้า</label>
                    <select v-model="productId" @change="handleSelect(products)">
                        <option value="" hidden="true" disabled selected>{{ deliverGood.seller_name }}</option>
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
                    <input v-model="wholesalePrice" type="number" min="0" :placeholder="deliverGood.wholesale_price">
                </div>
                <div class="item">
                    <label>ราคาขายสด</label>
                    <input v-model="cashPrice" type="number" min="0" :placeholder="deliverGood.cash_price">
                </div>
                <div class="item">
                    <label>ราคาเซ็น</label>
                    <input v-model="accrualsPrice" type="number" min="0" :placeholder="deliverGood.accruals_price">
                </div>
                <div class="item">
                    <label>จำนวน</label>
                    <input v-model="amount" type="number" min="0" :placeholder="deliverGood.amount">
                </div>
                <div class="item">
                    <label>จำหน่าย</label>
                    <input v-model="leftovers" type="number" min="0" :placeholder="deliverGood.leftovers">
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
export default {
    name: "DeliverGoodUpdateModal",
    data() {
        return {
            isDropdownVisible: true,
            isVisible: false,
            sellerName: this.deliverGood.seller_name,
            productId: '',
            token: this.$cookies.get('token')
        }
    },
    props: {
        deliverGood: {
            id: String,
            seller_code: String,
            seller_name: String,
            ProductId: String,
            product_code: String,
            product_name: String,
            wholesale_price: String,
            cash_price: String,
            accruals_price: String,
            amount: String,
            leftovers: String,
            deliver_good_date: String
        },
        products: []
    },
    mounted() {
        this.setDataPicker();
    },
    methods: {
        async updateData() {
            const res = await axios.put(`${API_BASE_URL}/${ENDPOINTS.DELIVER_GOODS}/${this.deliverGood.id}`,
                {
                    product_id: `${!this.productId ? this.deliverGood.product_id : this.productId}`,
                    wholesale_price: `${this.wholesalePrice ?? this.deliverGood.wholesale_price}`,
                    cash_price: `${this.cashPrice ?? this.deliverGood.cash_price}`,
                    accruals_price: `${this.accrualsPrice ?? this.deliverGood.accruals_price}`,
                    amount: `${this.amount ?? this.deliverGood.amount}`,
                    leftovers: `${this.leftovers ?? this.deliverGood.leftovers}`,
                    deliver_good_date: `${!this.deliverGoodDate ? this.deliverGood.deliver_good_date : this.deliverGoodDate}`
                },
                {
                    headers: {
                        Authorization: this.token
                    }
                });
            res.data.json;
            this.$emit('deliver-good-update', res.data.json);
            this.$emit('close');
        },
        close() {
            this.$emit('close');
        },
        handleSelect(products) {
            this.sellerName = products.find(x => x.id === event.target.value)?.seller_name
        },
        updateToUppercase(event) {
            event.target.value = event.target.value.toUpperCase();
        },
        formatISODate() {
            const selectedDate = new Date(this.deliverGoodDate);
            selectedDate.setUTCHours(17, 0, 0, 0);
            this.deliverGoodDate = selectedDate.toISOString();
        },
        setDataPicker() {
            const date = new Date(this.deliverGood.deliver_good_date);
            const yyyy = date.getUTCFullYear();
            const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
            const dd = String(date.getUTCDate()).padStart(2, '0');
            this.deliverGoodDate = `${yyyy}-${mm}-${dd}`;
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