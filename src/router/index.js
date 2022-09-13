import { createRouter, createWebHistory } from 'vue-router'
import Home from '/src/views/Home.vue'
import Purchase from '/src/views/Purchase.vue'
const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/purchase',
        name: 'purchase',
        component: Purchase,
    },    
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
export default router