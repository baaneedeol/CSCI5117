import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebaseConfig.js'
import { getCurrentUser } from "vuefire";

const routes = [
  {
    path: '/',
    name: 'Splash',
    component: () => import('../views/SplashPage.vue')
  },
  {
    path: '/todos',
    name: 'Todos',
    component: () => import('../views/TodosPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/todos/:category',
    name: 'TodosByCategory',
    component: () => import('../views/TodosPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/done',
    name: 'Done',
    component: () => import('../views/DonePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/done/:category',
    name: 'DoneByCategory',
    component: () => import('../views/DonePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/todo/:id',
    name: 'TodoDetail',
    component: () => import('../views/TodoDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        path: '/',
        query: {
          redirect: to.fullPath,
        },
      };
    }
  }
  return true;
});

export default router;
