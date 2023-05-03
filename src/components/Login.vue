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
                    <el-button type="primary" @click="submitForm">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>


import { ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
    name: "LoginView",
    setup() {
        const store = useStore();
        const router = useRouter();

        const loginForm = ref(null);
        const form = ref({
            phone: "",
            password: "",
            rememberMe: false,
        });

        const rules = {
            phone: [
                { required: true, message: "手机号不能为空", trigger: "blur" },
                {
                    pattern: /^1[3456789]\d{9}$/,
                    message: "请输入正确的手机号",
                    trigger: "blur",
                },
            ],
            password: [
                { required: true, message: "密码不能为空", trigger: "blur" },
                {
                    min: 6,
                    max: 16,
                    message: "密码长度应在6至16个字符之间",
                    trigger: "blur",
                },
            ],
        };

        const login = async () => {
            try {
                const response = await axios.post(
                    "https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/beikeadminlogin",
                    {
                        user_phone: form.value.phone,
                        user_pass: form.value.password,
                    }
                );
                // console.log("发送了：", form.value.phone);
                // console.log(response.data.code);
                if (response.data.code === 200) {
                    console.log("API返回数据：", response.data);
                    localStorage.setItem('token', response.data.token);
                    store.dispatch("setToken", response.data.token);
                    // console.log("正在导航到 /home...");
                    await router.isReady();
                    router.push("/home");
                } else {
                    alert("您没有权限登录，请联系我们。");
                }
            } catch (error) {
                console.error("登录失败：", error);
                alert("登录失败，请稍后重试！");
            }
        };

        const submitForm = () => {
            loginForm.value.validate(async (valid) => {
                if (valid) {
                    await login();
                } else {
                    console.log("登录失败，请检查表单输入！");
                    return false;
                }
            });
        };

        return {
            loginForm,
            form,
            rules,
            submitForm,
        };
    },
};
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
