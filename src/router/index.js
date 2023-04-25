//filenameandpath:/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '../components/Login.vue'
import HomeComponent from '../components/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: LoginComponent
    },
    {
        path: '/home',
        name: 'Home',
        component: HomeComponent
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    mode: 'history',
    routes
})

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
    console.log('导航开始：');
    console.log('从：', from);
    console.log('到：', to);

    // 继续导航
    next();
});

console.log('Vue Router 实例：', router);

export default router
