import { createWebHistory, createRouter } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./pages/index.vue'),
    },
    {
      path: '/diagram',
      component: () => import('./pages/diagram.vue'),
    },
    {
      path: '/zones',
      component: () => import('./pages/zones.vue'),
    },
    {
      path: '/repl',
      component: () => import('./pages/repl.vue'),
    },
    {
      path: '/profiles',
      component: () => import('./pages/profiles.vue'),
    },
    {
      path: '/doc',
      component: () => import('./pages/doc.vue'),
    },
  ],
})

export default router
