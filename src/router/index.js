import { createRouter, createWebHistory } from 'vue-router';
import HeaderAsideLayout from '../components/HeaderAsideLayout/index.vue';

import Home from '../views/Home/Home.vue';
import Deposit from '../views/Deposit/Deposit.vue';
import Liquidate from '../views/Liquidate/Liquidate.vue';

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: HeaderAsideLayout,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: Home,
      },
      {
        path: '/deposit',
        name: 'Deposit',
        component: Deposit,
      }, 
       {
        path: '/liquidate',
        name: 'Liquidate',
        component: Liquidate,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
});

export default router;
