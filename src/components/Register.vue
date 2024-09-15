<template>
    <div class="content">
        <div class="register-form">
            <span>สมัครสมาชิก</span>
            <div>
                <div>
                    <label>ชือ</label>
                    <input v-model="firstName" type="text">
                </div>
                <div>
                    <label>นามสกุล</label>
                    <input v-model="lastName" type="text">
                </div>
                <div>
                    <label>ชื่อผู้ใช้งาน</label>
                    <input v-model="username" type="text">
                </div>
                <div>
                    <label>ระหัสผ่าน</label>
                    <input v-model="password" type="password">
                </div>
                <div>
                    <label>อีเมล</label>
                    <input v-model="email" type="text">
                </div>
                <br>
                <div class="button-container">
                    <button class="btn-green" @click="registerAsync">สมัครสมาชิก</button>
                    <button class="btn-gray" @click="backTOLogin">กลับไปหน้าเข้าสู่ระบบ</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
document.body.style.overflow = 'hidden';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from './../../config';
export default {
    name: 'Login',
    data() {
        return {
            username: '',
            password: '',
            roles: ['Addmin', 'User']
        }
    },
    methods: {
        async registerAsync() {
            try {
                let response = await axios
                    .post(`${API_BASE_URL}/${ENDPOINTS.USER}/user-register`, {
                        first_name: `${this.firstName}`,
                        last_name: `${this.lastName}`,
                        username: `${this.username}`,
                        password: `${this.password}`,
                        email: `${this.email}`,
                        roles: [...this.roles]
                    });
                this.$router.back('/login')
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async backTOLogin() {
            this.$router.back('/login');
        }
    }
}
</script>

<style scoped>
.content {
    width: 100%;
    height: 100%;
    margin-top: 0px;
    margin-left: 0px;
    background-color: lightgreen;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.register-form {
    display: flex;
    flex-direction: column;
    background-color: white;
    border: none;
    border-radius: 5px;
}

.register-form div {
    margin: 5px;
}

.register-form span {
    font-size: larger;
    margin-top: 10px;
}

.register-form input,
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

.register-form label {
    background-color: white;
    position: relative;
    color: rgb(88, 88, 88);
    top: 14px;
}

.button-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

button {
    padding: 5px 20px;
    font-size: 16px;
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