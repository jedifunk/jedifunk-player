import { createRouter, createWebHistory } from '@ionic/vue-router';
import Tab from '@/components/Tab.vue'
import { useUserStore } from '@/stores/user';
import { supabase } from '@/utils/database';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/',
    component: Tab,
    meta: {requiresAuth: true},
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
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// router.beforeEach(async (to, from, next) => {
//   const userStore = useUserStore()
//   let user = null
//   try {
//     user = userStore.user
//   } catch (err) {
//     console.error(err)
//   }
  
//   // Check if the route requires authentication
//   // This assumes you have a method to check if the route needs auth
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

//   // If the route requires auth and the user is not authenticated, redirect to login
//   if (requiresAuth && !user) {
//     next({ name: 'Login' });
//   } else {
//     next();
//   }
// });

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 1. Check if the route needs protection
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (!requiresAuth) return next()

  // 2. If we have a user in Pinia, let them through
  if (userStore.user) return next()

  // 3. If no user in Pinia, check Supabase LocalStorage directly
  // This is the key to persistence on refresh!
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    // Found a session! Fill the store and proceed
    userStore.setUser(session.user)
    // We don't 'await' the full data fetch here to keep the route change fast,
    // App.vue will handle the background data sync.
    next()
  } else {
    // Truly no session found, send to login
    next({ name: 'Login' })
  }
})

export default router
