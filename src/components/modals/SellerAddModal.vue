<template>
    <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header">
                <slot name="header">
                    Seller Add
                </slot>
                <button type="button" class="btn-close" @click="close">
                    x
                </button>
            </header>

            <section class="modal-body">
                <div>
                    <label>ชื่อผู้ส่งสินค้า</label>
                    <input v-model="sellerName" type="text">
                </div>

            </section>

            <footer class="modal-footer">
                <button type="button" class="btn-green" @click="addData">
                    เพิ่มข้อมูล
                </button>
                <button type="button" class="btn-green" @click="close">
                    Close Modal
                </button>
            </footer>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: "SellerAddModal",
    methods: {
        async addData() {
            const res = await axios.post('https://localhost:7287/api/sellers', { seller_code: 'codeTest', seller_name: `${this.sellerName}` });

            res.data.json;
            
            this.$emit('close');
            this.fetchData();
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

.modal-header,
.modal-footer {
    padding: 15px;
    display: flex;
}

.modal-header {
    position: relative;
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
}

.modal-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
    justify-content: flex-end;
}

.modal-body {
    position: relative;
    padding: 20px 10px;
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
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
}
</style>