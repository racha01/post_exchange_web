<template>
    <div class="content">
        <div class="login-form">
            <span>เข้าสู่ระบบ</span>
            <div>
                <div>
                    <label>ชื่อผู้ใช้งาน</label>
                    <input v-model="username" type="text">
                </div>
                <div>
                    <label>ระหัสผ่าน</label>
                    <input v-model="password" type="password">
                </div>
                <br>
                <div class="button-container">
                    <button class="btn-green" @click="loginAsync">เข้าสู่ระบบ</button>
                    <button class="btn-gray" @click="registerAsync">สมัครสมาชิก</button>
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
            password: ''
        }
    },
    methods: {
        async loginAsync() {
            try {
                let response = await axios
                    .post(`${API_BASE_URL}/${ENDPOINTS.USER}/user-login`, {
                        username: `${this.username}`,
                        password: `${this.password}`,
                    });
                let data = response.data;
                this.$cookies.set('first_name', `${data.first_name}`, '1d')
                this.$cookies.set('last_name', `${data.first_name}`, '1d')
                this.$cookies.set('username', `${data.username}`, '1d')
                this.$cookies.set('email', `${data.email}`, '1d')
                this.$cookies.set('token', `${data.token}`, '1d')
                this.$router.push('/home')
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async registerAsync() {
            this.$router.push('/register');
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

.login-form {
    display: flex;
    flex-direction: column;
    background-color: white;
    border: none;
    border-radius: 5px;
}

.login-form div {
    margin: 5px;
}

.login-form span {
    font-size: larger;
    margin-top: 10px;
}

.login-form input,
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

.login-form label {
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