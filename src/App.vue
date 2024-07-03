<template>
  <ion-app>
    <ion-router-outlet/>
    <MiniPlayer v-if="showMiniPlayer" :current-track="currentTrack" />
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { ref, computed, onBeforeMount } from 'vue'
import { useMainStore } from '@/stores/index'
import * as sb from '@/utils/database'
import MiniPlayer from '@/components/MiniPlayer.vue'

const store = useMainStore()
const showMiniPlayer = computed(() => store.showMiniPlayer)
const currentTrack = computed(() => store.currentTrack)
const session = ref(null)

onBeforeMount(async () => {
  try {

    await sb.supabase.auth.getSession().then(({ data }) => {
      session.value = data.session
    })

    await sb.supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session
    })

    const {data: {user}} = await sb.supabase.auth.getUser() ?? {}
    store.setUser(user)

    let tags = await sb.getUserTagsWithTracks(user.id)
    if (tags === null) {
      const {data} = await sb.supabase.from('tags').select('*').eq('user_id', user.id)
      tags = data.map(tag => ({
      ...tag,
        tracks: []
      }));
    }
    store.setTags(tags)

    let playlists = await sb.getUserPlaylistsWithTracks(user.id)
    if (playlists === null) {
      const {data} = await sb.supabase.from('playlists').select('*').eq('user_id', user.id)
      playlists = data.map(tag => ({
      ...tag,
        tracks: []
      }));
    }
    store.setPlaylists(playlists)

    const likes = await sb.getUserLikes(user.id)
    store.setLikes(likes)

  } catch (error) {
    console.error('Error executing method:', error);
  } finally {
    store.setAppReady(true)
  }
})
</script>
