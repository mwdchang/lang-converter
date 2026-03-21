import { createRouter, createWebHistory } from 'vue-router';
import CameraView from '../views/CameraView.vue';
import TextView from '../views/TextView.vue';
import HistoryView from '../views/HistoryView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'camera',
      component: CameraView,
    },
    {
      path: '/text',
      name: 'text',
      component: TextView,
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView,
    },
  ],
});

export default router;
