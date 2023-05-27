//filenameandpath:/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '../components/Login.vue'
import HomeComponent from '../components/Home.vue'
import ListLesson from '../components/ListLesson.vue' // 添加引用
import AddLesson from '../components/AddLesson.vue' // 添加处理
import ListTheory from '../components/ListTheory.vue' // 添加处理
import AddTheory from '../components/AddTheory.vue' // 添加处理
import ListEduDesign from '../components/ListEduDesign.vue' // 添加处理
import ChatBotVer1 from '../components/ChatBotVer1.vue' // 添加处理
import WorkBotVer1 from '../components/WorkBotVer1.vue' // 添加处理'
import ChatTest from '../components/ChatTest.vue' // 添加处理

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginComponent,
  },
  {
    path: "/home",
    name: "Home",
    component: HomeComponent,
  },
  {
    path: "/ListLesson",
    name: "ListLesson",
    component: ListLesson,
  },
  {
    path: "/AddLesson",
    name: "AddLesson",
    component: AddLesson,
  },
  {
    path: "/ListTheory",
    name: "ListTheory",
    component: ListTheory,
  },
  {
    path: "/AddTheory",
    name: "AddTheory",
    component: AddTheory,
  },
  {
    path: "/ListEduDesign",
    name: "ListEduDesign",
    component: ListEduDesign,
  },
  {
    path: "/bot", // 新路由的路径
    name: "ChatBotVer1",
    component: ChatBotVer1, // 对应的组件
  },
  {
    path: "/workbot", // 新路由的路径
    name: "WorkBotVer1",
    component: WorkBotVer1, // 对应的组件
  },
  {
    path: "/test", // 新路由的路径
    name: "ChatTest",
    component: ChatTest, // 对应的组件
  },
];

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
