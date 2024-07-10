<template>
  <ion-app>
    <ion-router-outlet/>
    <MiniPlayer v-if="showMiniPlayer" :current-track="currentTrack" />
  </ion-app>
</template>

<script setup>
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
</script>
