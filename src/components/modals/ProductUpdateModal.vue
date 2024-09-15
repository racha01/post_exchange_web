<template>
    <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header">
                <p>แก้ไขข้อมูลสินค้าของผู้ฝากขาย</p>
            </header>

            <section class="modal-body">
                <div class="item">
                    <label for="seller">ชื่อผู้ฝากขาย</label>
                    <select v-model="sellerId" id="seller">
                        <option value="" disabled v-show="isVisible">{{ product.seller_name }}</option>
                        <option v-for="seller in sellers" :key="seller" :value="seller.id">
                            {{ seller.seller_name }}
                        </option>
                    </select>
                </div>
                <div class="item">
                    <label>รหัสสินค้า</label>
                    <input @input="updateToUppercase" v-model="productCode" type="text"
                        :placeholder="product.product_code">
                </div>
                <div class="item">
                    <label>ชื่อสินค้า</label>
                    <input v-model="productName" type="text" :placeholder="product.product_name">
                </div>
                <div class="item">
                    <label>ราคาส่ง</label>
                    <input v-model="wholesalePrice" type="number" min="0" :placeholder="product.wholesale_price">
                </div>
                <div class="item">
                    <label>ราคาขายสด</label>
                    <input v-model="cashPrice" type="number" min="0" :placeholder="product.cash_price">
                </div>
                <div class="item">
                    <label>ราคาเซ็น</label>
                    <input v-model="accrualsPrice" type="number" min="0" :placeholder="product.accruals_price">
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
    name: "ProductUpdateModal",
    data() {
        return {
            isDropdownVisible: true,
            isVisible: false,
            sellerId: '',
            token: this.$cookies.get('token')
        }
    },
    props: {
        product: {
            id: String,
            seller_id: String,
            seller_code: String,
            seller_name: String,
            product_code: String,
            product_name: String,
            wholesale_price: String,
            cash_price: String,
            accruals_price: String,
        },
        sellers: []
    },
    methods: {
        async updateData() {
            const res = await axios.put(`${API_BASE_URL}/${ENDPOINTS.PRODUCTS}/${this.product.id}`,
                {
                    seller_id: `${!this.sellerId ? this.product.seller_id : this.sellerId}`,
                    product_code: `${this.productCode ?? this.product.product_code}`,
                    product_name: `${this.productName ?? this.product.product_name}`,
                    wholesale_price: `${this.wholesalePrice ?? this.product.wholesale_price}`,
                    cash_price: `${this.cashPrice ?? this.product.cash_price}`,
                    accruals_price: `${this.accrualsPrice ?? this.product.accruals_price}`,
                }, {
                headers: {
                    Authorization: this.token
                }
            });
            res.data.json;
            this.$emit('product-update', res.data.json);
            this.$emit('close');
        },
        close() {
            this.$emit('close');
        },
        updateToUppercase(event) {
            event.target.value = event.target.value.toUpperCase();
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

select option:first-of-type {
    color: gray;
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