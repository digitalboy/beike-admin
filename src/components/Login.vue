<!-- filename:login.vue -->
<template>
    <div class="login-container">
        <el-card class="login-card">
            <h1>登录</h1>
            <el-form ref="loginForm" :model="form" :rules="rules" label-position="top">
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="form.phone" type="tel" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="form.rememberMe">记住我</el-checkbox>
                    <a href="#" class="forgot-password-link">忘记密码？</a>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>


<script>
import axios from 'axios';
export default {
    name: 'LoginComponent',
    data() {
        return {
            form: {
                phone: '',
                password: '',
                rememberMe: false
            },

            rules: {
                phone: [
                    { required: true, message: '手机号不能为空', trigger: 'blur' },
                    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { min: 6, max: 16, message: '密码长度应在6至16个字符之间', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        async login() {
            try {
                const response = await axios.post('https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/beikeadminlogin', {
                    phone: this.form.phone,
                    password: this.form.password
                });
                console.log('发送了：', this.form.phone);
                if (response.data.code === '0000') {
                    // 登录成功，你可以将用户信息存储到Vuex或者localStorage，并进行后续操作，如跳转到首页
                    console.log('API返回数据：', response.data);
                    //alert('登录成功！');
                    // 确保路由器已准备好
                    console.log('正在导航到 /home...');
                    await this.$router.isReady();
                    this.$router.push('/home');
                } else {
                    // 显示错误信息
                    alert(response.data.message);
                }
            } catch (error) {
                console.error('登录失败：', error);
                alert('登录失败，请稍后重试！');
            }
        },
        // ...
        submitForm(formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    await this.login();
                } else {
                    console.log('登录失败，请检查表单输入！');
                    return false;
                }
            });
        }

    }
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.login-card {
    width: 100%;
    max-width: 400px;
    padding: 20px;
    box-sizing: border-box;
}

.forgot-password-link {
    float: right;
    color: #409eff;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.2s;
}

.forgot-password-link:hover {
    color: #66b1ff;
}
</style>
