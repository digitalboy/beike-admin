//filenameandpath:/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '../components/Login.vue'
import HomeComponent from '../components/Home.vue'
import ListLesson from '../components/ListLesson.vue' // 添加引用
import AddLesson from '../components/AddLesson.vue' // 添加处理
import ListTheory from '../components/ListTheory.vue' // 添加处理

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
    },
    {
        path: '/ListLesson',
        name: 'ListLesson',
        component: ListLesson
    },
    {
        path: '/AddLesson',
        name: 'AddLesson',
        component: AddLesson
    },
    {
        path: '/ListTheory',
        name: 'ListTheory',
        component: ListTheory
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
