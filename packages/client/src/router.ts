import { createWebHistory, createRouter } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./pages/index.vue'),
    },
    {
      path: '/repo',
      component: () => import('./pages/repo.vue'),
    },
    {
      path: '/document',
      component: () => import('./pages/document.vue'),
    },
    {
      path: '/diagram',
      component: () => import('./pages/diagram.vue'),
    },
    {
      path: '/zones',
      component: () => import('./pages/zones.vue'),
    },
  ],
})

export default router
