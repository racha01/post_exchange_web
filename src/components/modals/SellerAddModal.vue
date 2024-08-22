<template>
    <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header">
                <p> เพิ่มข้อมูลผู้ฝากขายสินค้า</p>
            </header>

            <section class="modal-body">
                <div>
                    <label id="label-seller-code">รหัสผู้ฝากขาย</label>
                    <input v-model="sellerCode" type="text">
                </div>
                <div>
                    <label id="label-seller-name">ชื่อผู้ฝากขาย</label>
                    <input v-model="sellerName" type="text">
                </div>
            </section>

            <footer class="modal-footer">
                <button type="button" class="btn-green"  @click="addData">
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
    name: "SellerAddModal",
    methods: {
        async addData() {
            console.log(ENDPOINTS)
            const res = await axios.post(`${API_BASE_URL}/${ENDPOINTS.SELLERS}`, { seller_code: `${this.sellerCode}`, seller_name: `${this.sellerName}` });

            res.data.json;

            this.$emit('close');
            this.$emit('data-updated');
        },
        close() {
            this.$emit('close');
        },
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

.modal-header p{
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