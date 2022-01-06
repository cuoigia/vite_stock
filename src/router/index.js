import { createRouter, createWebHistory } from 'vue-router'
import Stock from '../views/Stock.vue'
import Admin from '/src/views/Admin.vue'
import Simple from '/src/views/Simple.vue'

const routes = [
  {
    path: '/stock',
    name: 'Stock',
    component: Stock,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin 
  },
  {
    path: '/simple',
    name: 'Simple',
    component: Simple 
  }
]



const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
