<template>
    <div class="content">
        <h1>ผู้ฝากขายสินค้า</h1>
        <div class="sub-title">
            <div class="sub-title-button">
                <button @click="showSellerAddModal">เพิ่มข้อมูล</button>
            </div>
            <div>
                <SellerAddModal :key="componentKey" id="input-add-form" v-show="isSellerAddModalVisible"
                    @close="closeModal" @data-updated="fetchData" />
            </div>
            <div class="sub-title-end">
                <div style="margin-right: 5px;" class="sub-title-button">
                    <button>
                        <download-excel class="btn btn-default" :data="formattedData" :fields="json_fields"
                            header="ผู้ฝากขายสินค้า" worksheet="Sheet1" name="ผู้ฝากขายสินค้า.xls">
                        </download-excel>
                    </button>
                </div>
                <div>
                    <input @input="updateQuery($event.target.value)" class="sub-title-input" type="text"
                        placeholder="Search">
                </div>
            </div>
        </div>
        <div>
            <table>
                <thead>
                    <tr>
                        <th id="cal1">ลำดับ</th>
                        <th>รหัสผู้ฝากขาย</th>
                        <th>ชื่อผู้ฝากขาย</th>
                        <th>ตัวเลือก</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in filteredItems ?? data.items" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.seller_code }}</td>
                        <td>{{ item.seller_name }}</td>
                        <td>
                            <button @click="showSellerUpdateModal(item)">แก้ไขข้อมูล</button>
                            <SellerUpdateModal :key="componentKey" :seller="seller" @seller-update="fetchData"
                                v-show="isSellerUpdateModalVisible" @close="closeModal" />
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" id="footer-td">
                            <div class="footer-content">
                                <p>จำนวนแถวต่อหน้า</p>
                                <select @change="handleSelection($event)">
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                    <option>100</option>
                                </select>
                                <button @click="fetchData((pageNo - 1), pageSize)"
                                    :disabled="data.has_previous_page == false">
                                    < </button>
                                        <button @click="fetchData((pageNo + 1), pageSize)"
                                            :disabled="data.has_next_page == false">></button>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import SellerAddModal from './modals/SellerAddModal.vue'
import SellerUpdateModal from './modals/SellerUpdateModal.vue'
import { API_BASE_URL, ENDPOINTS, PAGENERATION } from './../../config';

library.add(faSearch);
import axios from 'axios';
import JsonExcel from "vue-json-excel3";

const api = axios.create({
    baseURL: `${API_BASE_URL}`
});
export default {
    computed: {
        filteredItems() {
            if (!this.data.items) return null;
            return this.data.items.filter(item => {
                return (
                    item.seller_code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.seller_name.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            });
        },
        formattedData() {
            let data = this.filteredItems ?? this.data.items
            return Array.isArray(data) ? data.map((item, index) => ({
                number: index + 1,
                ...item
            })) : [];
        }
    },
    name: "seller",
    components: {
        SellerAddModal,
        SellerUpdateModal
    },
    data() {
        return {
            data: [],
            isSellerAddModalVisible: false,
            isSellerUpdateModalVisible: false,
            seller: {},
            componentKey: 0,
            searchQuery: '',
            pageNo: PAGENERATION.PAGE_NO,
            pageSize: PAGENERATION.PAGE_SIZE,
            token: this.$cookies.get('token'),
            json_fields: {
                "ลำดับ": "number",
                "รหัสผู้ฝากขาย": "seller_code",
                "ชื่อผู้ฝากขาย": "seller_name"
            },
            json_meta: [
                [
                    {
                        key: "charset",
                        value: "utf-8",
                    },
                ],
            ],
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        handleSelection(event) {
            const selectedValue = event.target.value;
            this.fetchData(this.pageNo, selectedValue);
            this.pageSize = selectedValue;
        },
        async fetchData(pageNo, pageSize) {
            this.$cookies.set('isLogin', true, '1d')
            console.log(this.$cookies.get('isLogin'))
            pageNo = Number(pageNo)
            if (isNaN(pageNo)) {
                pageNo = this.pageNo
            }
            if (typeof pageSize === "undefined") {
                pageSize = this.pageSize
            }
            try {
                let response = await api
                    .get(`/${ENDPOINTS.SELLERS}`, {
                        params: {
                            page_no: pageNo,
                            page_size: pageSize,
                        },
                        headers: {
                            Authorization: this.token
                        }
                    });
                let data = response.data;
                this.data = data;
                this.pageNo = pageNo;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        showSellerAddModal() {
            this.isSellerAddModalVisible = true;
            this.componentKey += 1;
        },
        async showSellerUpdateModal(item) {
            this.isSellerUpdateModalVisible = true;
            await api
                .get(`/${ENDPOINTS.SELLERS}/${item.id}`,
                    {
                        headers: {
                            Authorization: this.token
                        }
                    }
                )
                .then((res) => (this.seller = res.data))
            this.$emit('seller', this.seller);
            this.componentKey += 1;
        },
        closeModal() {
            this.isSellerAddModalVisible = false;
            this.isSellerUpdateModalVisible = false;
        },
        updateQuery(value) {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.searchQuery = value;
            }, 300);
        }
    }
}

</script>



<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.9em;
    font-family: sans-serif;
    height: 20%;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);

}

thead tr {
    background-color: #646cfd;
    color: #ffffff;
    text-align: center;

}

th,
td {
    padding: 12px 15px;
}

tbody tr {
    border-bottom: 1px solid #dddddd;
}

tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
}

tbody tr.active-row {
    font-weight: bold;
    color: #009879;
}

tbody button {
    background: #e8e8e8;
    border-radius: 5px;
    border-width: 1px;
    border-style: none;
    padding: 5px 4px;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
    transition: box-shadow 0.3s ease;
}

tbody button:hover {
    background-color: yellow;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.4);
}

.footer-content {
    display: flex;
    justify-content: end;
    align-items: center;
}

.footer-content p {
    display: flex;
    align-items: center;
}

.footer-content,
p,
select {
    margin-right: 10px;
}

.footer-content p {
    height: 30px;
}

.footer-content select {
    height: 30px;
    border-radius: 3px;
    border-style: none;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
    transition: box-shadow 0.3s ease;
}

.footer-content button {
    margin-right: 5px;
    height: 30px;
    border-radius: 3px;
    border-style: none;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
    transition: box-shadow 0.3s ease;
}

#footer-td {
    padding: 0px;
}

#cal1 {
    width: 10%;
}

.sub-title-end{
    display: flex;
}
</style>