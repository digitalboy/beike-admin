// src/axiosConfig.js
import axios from "axios";
import router from "@/router/index"; // 导入 router 实例
import { ElMessage } from "element-plus";

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 只有当请求的不是OpenAI API时，才添加Authorization头
    if (!config.url.includes('openai.com')) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 检查响应状态码，如果为 401，并且请求的不是OpenAI API，则 token 过期或无效
    if (error.response && error.response.status === 401 && !error.config.url.includes('openai.com')) {
      // 清除本地存储的 token
      localStorage.removeItem("token");
      ElMessage.error("请重新登录");
      // 使用 Vue Router 跳转到首页
      router.push("/");
    }
    return Promise.reject(error);
  }
);


export default axios;
