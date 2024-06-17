import { createRouter, createWebHistory } from '@ionic/vue-router';
import Tab from '@/components/Tab.vue'

const routes = [
  {
    path: '/',
    redirect: '/tabs/home'
  },
  {
    path: '/tabs/',
    component: Tab,
    children: [
      {
        path: '/',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        name: 'Shows',
        component: () => import('@/views/AllShows.vue'),
      },
      {
        path: 'playlists',
        name: 'Playlists',
        component: () => import('@/views/PlaylistsView.vue'),
      },
      {
        path: 'liked',
        name: 'Liked',
        component: () => import('@/views/LikedView.vue'),
      },
      {
        path: 'tags',
        name: 'Tags',
        component: () => import('@/views/TagsView.vue'),
      },
      {
        path: 'tags/:tag',
        name: 'Single Tag',
        component: () => import('@/views/SingleTagView.vue'),
      },
      {
        path: 'home/:yearParam',
        name: 'Year',
        component: () => import('@/views/YearView.vue'),
      },
      {
        path: 'home/:yearParam/:dateParam',
        name: 'Date',
        component: () => import('@/views/ShowView.vue'),
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
