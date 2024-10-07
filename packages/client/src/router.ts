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
  ],
})

export default router
