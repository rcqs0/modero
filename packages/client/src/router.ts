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
    {
      path: '/course',
      component: () => import('./pages/course.vue'),
    },
    {
      path: '/editor_',
      component: () => import('./pages/editor_.vue'),
    },
    {
      path: '/editor',
      component: () => import('./pages/editor.vue'),
      children: [
        {
          path: '',
          component: () => import('./pages/editor/index.vue'),
        },
        {
          path: 'course',
          components: {
            default: () => import('./pages/editor/course.vue'),
            nav: () => import('./pages/editor/course/_nav.vue'),
          },
          children: [
            {
              path: '',
              component: () => import('./pages/editor/course/index.vue'),
            },
            {
              path: 'page',
              component: () => import('./pages/editor/course/page.vue'),
            },
          ],
        },
      ],
    },
  ],
})

export default router
