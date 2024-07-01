import { createRouter, createWebHistory } from '@ionic/vue-router';
import Tab from '@/components/Tab.vue'

const routes = [
  {
    path: '/',
    component: Tab,
    children: [
      {
        path: '',
        name: 'Shows',
        component: () => import('@/views/AllShows.vue'),
      },
      {
        path: 'playlists',
        name: 'Playlists',
        component: () => import('@/views/PlaylistsView.vue'),
      },
      {
        path: 'playlists/:pathname',
        name: 'Single Playlist',
        component: () => import('@/views/SinglePlaylistView.vue'),
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
        path: ':yearParam',
        name: 'Year',
        component: () => import('@/views/YearView.vue'),
      },
      {
        path: ':yearParam/:dateParam',
        name: 'Date',
        component: () => import('@/views/ShowView.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue')
      }
      // {
      //   path: 'profile/:userParam',
      //   name: 'Profile',
      //   component: () => import('@/views/ProfileView.vue')
      // }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
