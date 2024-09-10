<template>
    <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header">
                <p> แก้ไขข้อมูลสินค้าใน PX</p>
            </header>

            <section class="modal-body">
                <div class="first-item">
                    <label>ชื่อสินค้า</label>
                    <input v-model="productName" type="text" :placeholder="postExchangeProdcut.product_name">
                </div>
                <div class="item">
                    <label>เลขบาร์โค้ด</label>
                    <input v-model="barcodeNumber" type="text" :placeholder="postExchangeProdcut.barcode_number">
                </div>
                <div>
                    <label>ราคาสด</label>
                    <input v-model="cashPrice" type="number" :placeholder="postExchangeProdcut.cash_price">
                </div>
                <div  class="item">
                    <label>ราคาเซ็น</label>
                    <input v-model="accrulsPrice" type="number" :placeholder="postExchangeProdcut.accruals_price">
                </div>
                <div  class="item">
                    <label>ประเภท</label>
                    <select v-model="type">
                        <option value="" disabled v-show="isVisible">{{ postExchangeProdcut.type }}</option>
                        <option value="ขนม">ขนม</option>
                        <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                        <option value="ของใช้">ของใช้</option>
                    </select>
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
import { API_BASE_URL, ENDPOINTS } from './../../../config';
import axios from 'axios';
export default {
    name: 'PostExchangeProductUpdateModal',
    data() {
        return {
            isVisible: false,
            type: ''
        }
    },
    props: {
        postExchangeProdcut: {
            id: String,
            product_name: String,
            barcode_number: String,
            cash_price: Number,
            accruals_price: Number,
            type: String
        }
    },
    methods: {
        async updateData() {
            const res = await axios.put(`${API_BASE_URL}/${ENDPOINTS.POST_EXCHANGE_PRODUCTS}/${this.postExchangeProdcut.id}`, {
                product_name: `${this.productName ?? this.postExchangeProdcut.product_name}`,
                barcode_number: `${this.barcodeNumber ?? this.postExchangeProdcut.barcode_number}`,
                cash_price: `${this.cashPrice ?? this.postExchangeProdcut.cash_price}`,
                accruals_price: `${this.accrualsPrice ?? this.postExchangeProdcut.accruals_price}`,
                type: `${!this.type ? this.postExchangeProdcut.type : this.type}`
            });

            res.data.json;
            this.$emit('data-update', res.data.json);
            this.$emit('close');
        },
        close() {
            this.$emit('close');
        },
        updateToUppercase(event) {
            event.target.value = event.target.value.toUpperCase();
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
    top: 9px;
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

.item {
    padding: 0px;
    flex: 1 1 200px;
}
.first-item {
    padding: 0px;
    flex: 1 1 300px;
}
</style>