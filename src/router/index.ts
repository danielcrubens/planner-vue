import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { public: true },
  },
  {
    path: '/trips/:id',
    name: 'Trips',
    component: () => import('../views/TripDetails.vue'),
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: () => import('../views/AuthCallback.vue'),
    meta: { public: true },
  },
  {
    path: '/invite/:token',
    name: 'Invite',
    component: () => import('../views/InviteView.vue'),
    meta: { public: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Home é pública (login acontece em modal); só as viagens exigem sessão.
router.beforeEach(async (to) => {
  if (to.meta.public) return true;

  const auth = useAuthStore();
  const ok = await auth.ensureAuth();
  if (!ok) return { name: 'Home' };
});

export default router;
