<template>
    <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header">
                <p>แก้ไขข้อมูลผู้ฝากขายสินค้า</p>
            </header>
            <section class="modal-body">
                <div>
                    <label>รหัสผู้ฝากขาย</label>
                    <input @input="updateToUppercase" ref="sellerCode" v-model="sellerCode" type="text"
                        :placeholder="seller.seller_code" @focus="clearInput">
                </div>
                <div>
                    <label>ชื่อผู้ส่งฝากขาย</label>
                    <input ref="sellerName" v-model="sellerName" type="text" :placeholder="seller.seller_name"
                        @focus="clearInput">
                </div>
            </section>

            <footer class="modal-footer">
                <button type="button" class="btn-green" @click="updateData">
                    แก้ไข้ข้อมูล
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
    props: {
        seller: {
            id: String,
            seller_code: String,
            seller_name: String
        }
    },
    name: "SellerUpdateModal",
    methods: {
        async updateData() {
            const res = await axios.put(`${API_BASE_URL}/${ENDPOINTS.SELLERS}/${this.seller.id}`, { seller_code: `${this.sellerCode ?? this.seller.seller_code}`, seller_name: `${this.sellerName ?? this.seller.seller_name}` });

            res.data.json;
            this.$emit('seller-update', res.data.json);
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
    flex-direction: column;
    padding: 20px 10px;
}

.modal-body div {
    margin-bottom: 10px;
}

.modal-body input {
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
</style>