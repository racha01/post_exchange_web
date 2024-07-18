import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Seller from '@/components/Seller.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
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
      }
      
    ]
  })
  
  export default router