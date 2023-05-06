//filename:main.js
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.vue";
import router from "./router"; // 导入router
import store from "./store";

const app = createApp(App);
app.use(ElementPlus);
app.use(router); // 使用router
app.use(store); // 使用store
app.mount("#app");

