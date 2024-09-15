import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Seller from '@/components/Seller.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        redirect: '/login'
      },
      {
        path: '/home',
        name: 'home',
        component: Home
      },
      {
        path: '/seller',
        name: 'seller',
        component: Seller
      },
      {
        path: '/product',
        name: 'product',
        component: () => import('@/components/Product.vue')
      },
      {
        path: '/post-exchange-stock',
        name: 'postExchangeStock',
        component: () => import('@/components/PostExchangeStock.vue')
      },
      {
        path: '/post-exchange-product',
        name: 'postExchangeProduct',
        component: () => import('@/components/PostExchangeProduct.vue')
      },
      {
        path: '/deliver-good',
        name: 'deliverGood',
        component: () => import('@/components/DeliverGood.vue')
      },
      {
        path: '/post-exchange-stock/detail',
        name: 'postExchangeStockDetail',
        component: () => import('@/components/PostExchangeStockDetail.vue')
      },
      {
        path: '/deliver-good/cut-off',
        name: 'deliverGoodCutoff',
        component: () => import('@/components/DeliverGoodsCutoff.vue')
      },
      {
        path: '/deliver-good/cut-off-detail',
        name: 'deliverGoodCutoffDetail',
        component: () => import('@/components/DeliverGoodsCutoffDetail.vue')
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/components/Login.vue')
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('@/components/Register.vue')
      },
      
    ]
  })
  
  export default router