<template>
    <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header">
                <p> เพิ่มข้อมูลการส่งสินค้า</p>
            </header>
            <section class="modal-body">
                <div class="item">
                    <label for="postExchangeProduct">ชื่อสินค้า</label>
                    <select v-model="productId" @change="handleSelect(postExchangeProducts)">
                        <option v-for="postExchangeProduct in postExchangeProducts" :key="postExchangeProduct"
                            :value="postExchangeProduct.id">
                            {{ `${postExchangeProduct.product_name}\n(${postExchangeProduct.barcode_number})` }}
                        </option>
                    </select>
                </div>
                <div class="item">
                    <label>จำนวน</label>
                    <input v-model="unitQty" type="number" min="0">
                </div>
                <div class="item">
                    <label>ราคา</label>
                    <input v-model="unitPrice" type="number" min="0">
                </div>
                <div class="item">
                    <label>จำนวน/หน่วย</label>
                    <input v-model="qtyPerUnit" type="number" min="0">
                </div>
                <div class="item">
                    <label>ราคาขายสด</label>
                    <input v-model="cashPrice" type="number" min="0">
                </div>
                <div class="item">
                    <label>ราคาขายเซ็น</label>
                    <input v-model="accrualsPrice" type="number" min="0">
                </div>
                <div class="item-check-box" id="item-check-box">
                    <input id="check-box-input" type="checkbox" v-model="isSellPostExchange" />
                    <label>ขายใน px</label>
                </div>
            </section>

            <footer class="modal-footer">
                <button type="button" class="btn-green" @click="addData">
                    เพิ่มข้อมูล
                </button>
                <button type="button" class="btn-gray" @click="close">
                    ปิด
                </button>
            </footer>
        </div>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';
export default {
    name: 'PostExchangeStockDetailAddModal',
    props: {
        products: [{
            id: String,
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
            is_sell_post_exchange: Boolean
        }],
        excludedProducts: [{
            id: String,
            product_name: String,
            barcode_number: String,
            unit_qty: Number,
            unit_price: Number,
            total_price: Number,
            is_sell_post_exchange: Boolean
        }],
        postExchangeProducts: []
    },
    data() {
        return {
            productPostExchanges: this.products,
            excludedProductPostExchanges: this.excludedProducts,
            isSellPostExchange: true,
            unitQty: null,
            unitPrice: null,
            cashPrice: null,
            accrualsPrice: null,
            qtyPerUnit: null
        }
    },
    methods: {
        addData() {
            const product = {
                id: uuid.v1(),
                product_name: this.productName,
                barcode_number: this.barcodeNumber,
                unit_qty: this.unitQty,
                unit_price: this.unitPrice,
                total_price: (this.unitQty * this.unitPrice),
                cash_price: this.cashPrice,
                accruals_price: this.accrualsPrice,
                qty_per_unit: this.qtyPerUnit,
                is_sell_post_exchange: this.isSellPostExchange
            }

            if (this.isSellPostExchange) {
                this.productPostExchanges.push(product)
            } else {
                this.excludedProductPostExchanges.push(product)
            };

            this.$emit('post-exchange-stock-detail-add', {
                'product_post_exchanges': this.productPostExchanges,
                'excluded_product_post_exchanges': this.excludedProductPostExchanges,
            });

            // !this.productName ? this.productName : document.getElementById('productName').value = '';
            // !this.barcodeNumber ? this.barcodeNumber : document.getElementById('barcodeNumber').value = '';
            this.unitQty = null;
            this.unitPrice = null;
            this.cashPrice = null;
            this.accrualsPrice = null;
            this.qtyPerUnit = null;
        },
        handleSelect(postExchangeProducts) {
            this.productName = postExchangeProducts.find(x => x.id === event.target.value)?.product_name
            this.barcodeNumber = postExchangeProducts.find(x => x.id === event.target.value)?.barcode_number
            
        },
        close() {
            this.$emit('close');
        }
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

.item-check-box {
    padding: 0;
    display: flex;
    width: 100%;
}

.item-check-box input {
    width: 100%;
}

.item-check-box label {
    width: 55%;
    text-align: start;
    margin-top: -17px;
    margin-left: -50px;

}

#item-check-box {
    margin: 0;
}

#check-box-input {
    margin-right: -170px;
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

.modal-body select {
    height: auto;
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