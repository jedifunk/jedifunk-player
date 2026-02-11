<template>
  <ion-app>
    <ion-router-outlet v-if="mainStore.appReady"/>
    <MiniPlayer v-if="showMiniPlayer" :current-track="currentTrack" />
  </ion-app>
</template>

<!-- <script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import MiniPlayer from '@/components/audio/MiniPlayer.vue'

import { ref, computed, onBeforeMount } from 'vue'
import { useUserStore } from '@/stores/user'
import { useMainStore } from './stores/main'
import * as sb from '@/utils/database'

const userStore = useUserStore()
const mainStore = useMainStore()
const showMiniPlayer = computed(() => mainStore.showMiniPlayer)
const currentTrack = computed(() => mainStore.currentTrack)
const session = ref(null)

onBeforeMount(async () => {
  try {

    await sb.supabase.auth.getSession().then(({ data }) => {
      session.value = data.session
    })

    await sb.supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session
    })

    if (session.value) {
      const {data: {user}} = await sb.supabase.auth.getUser() ?? {}
      userStore.setUser(user)

      if (user) { 
        let tags = await sb.getUserTagsWithTracks(user.id)
        if (tags === null) {
          const {data} = await sb.supabase.from('tags').select('*').eq('user_id', user.id)
          tags = data.map(tag => ({
          ...tag,
            tracks: []
          }));
        }
        userStore.setTags(tags)

        let playlists = await sb.getUserPlaylistsWithTracks(user.id)
        if (playlists === null) {
          const {data} = await sb.supabase.from('playlists').select('*').eq('user_id', user.id)
          playlists = data.map(tag => ({
          ...tag,
            tracks: []
          }));
        }
        userStore.setPlaylists(playlists)

        const likes = await sb.getUserLikes(user.id)
        userStore.setLikes(likes)
      }
    }
  } catch (error) {
    console.error('Error executing method:', error);
  } finally {
    mainStore.setAppReady(true)
  }
})
</script> -->

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import MiniPlayer from '@/components/audio/MiniPlayer.vue'

import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useMainStore } from './stores/main'
import { supabase } from '@/utils/database'

const userStore = useUserStore()
const mainStore = useMainStore()
const showMiniPlayer = computed(() => mainStore.showMiniPlayer)
const currentTrack = computed(() => mainStore.currentTrack)

// onMounted(async () => {
//   // 1. On app start, check if a session already exists in LocalStorage
//   const { data: { session } } = await supabase.auth.getSession()
  
//   if (session) {
//     userStore.setUser(session.user)
//     await userStore.fetchAllUserData()
//   }
  
//   // Tell the app we are done checking auth
//   mainStore.setAppReady(true)

//   // 2. Listen for any Auth events (Login, Signup, Logout)
//   // This keeps the session persistent and the store in sync
//   supabase.auth.onAuthStateChange(async (event, session) => {
//     if (session) {
//       userStore.setUser(session.user)
//       await userStore.fetchAllUserData()
//     } else {
//       // User is logged out
//       userStore.setUser(null)
//       userStore.$reset() 
//     }
//   })
// })
// onMounted(async () => {
//   // 1. Immediate Session Check (for refresh persistence)
//   const { data: { session } } = await supabase.auth.getSession()
  
//   if (session) {
//     userStore.setUser(session.user)
//     // Wait for likes/tags/playlists BEFORE we let the router run
//     await userStore.fetchAllUserData()
//   }
  
//   // 2. Open the gate for the Router
//   mainStore.setAppReady(true)

//   // 3. Keep the session alive and handle signups/logouts
//   supabase.auth.onAuthStateChange(async (event, newSession) => {
//     if (newSession) {
//       userStore.setUser(newSession.user)
//       // Only fetch data if they just signed in or signed up
//       if (event === 'SIGNED_IN') {
//         await userStore.fetchAllUserData()
//       }
//     } else {
//       userStore.setUser(null)
//       userStore.$reset()
//     }
//   })
// })
onMounted(async () => {
  // Since the Router already checked the session, 
  // we just need to make sure data is fetched if a user exists
  if (userStore.user) {
    await userStore.fetchAllUserData()
  }
  
  mainStore.setAppReady(true)

  // Listen for changes (Logout/Login)
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      userStore.setUser(session.user)
      if (event === 'SIGNED_IN') await userStore.fetchAllUserData()
    } else {
      userStore.setUser(null)
      userStore.$reset()
    }
  })
})
</script>