import { createRouter, createWebHistory } from 'vue-router';
import Home from '../layout/AppLayout.vue';
import { useAuthenticationStore } from '@/stores/authentication.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
      redirect: '/dashboard',
      children: [
        {
          path: '/management',
          name: 'menu.management',
          component: () => import('../views/Management.vue'),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/dashboard',
          name: 'menu.dashboard',
          component: () => import('../views/Dashboard.vue'),
        },
        {
          path: '/about-us',
          name: 'menu.about',
          component: () => import('../views/About.vue'),
        },
        {
          path: '/project/create',
          name: 'menu.project-create',
          component: () => import('../views/project/ProjectCreate.vue'),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/project/manage',
          name: 'menu.project-manage',
          component: () => import('../views/project/ProjectManage.vue'),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/project/manage/:id',
          name: 'menu.project-manage-details',
          component: () => import('../views/project/ProjectManageDetails.vue'),
          props: true,
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/project/details/:id',
          name: 'menu.project-details',
          component: () => import('../views/project/ProjectDetails.vue'),
          props: true,
        },

        {
          path: '/research/create',
          name: 'menu.research-create',
          component: () => import('../views/research/ResearchCreate.vue'),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/research/manage',
          name: 'menu.research-manage',
          component: () => import('../views/research/ResearchManage.vue'),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/research/manage/:id',
          name: 'menu.research-manage-details',
          component: () => import('../views/research/ResearchManageDetails.vue'),
          props: true,
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/research',
          name: 'menu.research',
          component: () => import('../views/research/Research.vue'),
        },
        {
          path: '/research/details/:id',
          name: 'menu.research-details',
          component: () => import('../views/research/ResearchDetails.vue'),
          props: true,
        },

        {
          path: '/course/create',
          name: 'menu.course-create',
          component: () => import('../views/course/CourseCreate.vue'),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/course/manage',
          name: 'menu.course-manage',
          component: () => import('../views/course/CourseManage.vue'),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/course/manage/:id',
          name: 'menu.course-manage-details',
          component: () => import('../views/course/CourseManageDetails.vue'),
          props: true,
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/course',
          name: 'menu.course',
          component: () => import('../views/course/Course.vue'),
        },
        {
          path: '/course/details/:id',
          name: 'menu.course-details',
          component: () => import('../views/course/CourseDetails.vue'),
          props: true,
        },
        
        {
          path: '/news/create',
          name: 'menu.news-create',
          component: () => import('../views/news/NewsCreate.vue'),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/news/manage',
          name: 'menu.news-manage',
          component: () => import('../views/news/NewsManage.vue'),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/news/manage/:id',
          name: 'menu.news-manage-details',
          component: () => import('../views/news/NewsManageDetails.vue'),
          props: true,
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/news',
          name: 'menu.news',
          component: () => import('../views/news/News.vue'),
        },
        {
          path: '/news/details/:id',
          name: 'menu.news-details',
          component: () => import('../views/news/NewsDetails.vue'),
          props: true,
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/Dashboard.vue'),
    },
  ],
});

router.beforeEach(async (to, from) => {
  const authenticationStore = useAuthenticationStore();
  if (authenticationStore.user === null && to.meta.requireAuth) {
    return { path: '/login' };
  }
});

export default router;
