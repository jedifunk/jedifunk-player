<template>
  <ion-app>
    <ion-router-outlet />
    <MiniPlayer v-if="showMiniPlayer" :current-track="currentTrack" />
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { computed, onBeforeMount } from 'vue'
import { useMainStore } from '@/stores/index'
import { getUser, getUserTagsWithTracks, getUserPlaylistsWithTracks, getUserLikes } from '@/utils/database'
import MiniPlayer from '@/components/MiniPlayer.vue'

const store = useMainStore()
const showMiniPlayer = computed(() => store.showMiniPlayer)
const currentTrack = computed(() => store.currentTrack)

onBeforeMount(async () => {
  try {
    const user = await getUser('jedifunk')
    store.setUser(user)
    const tags = await getUserTagsWithTracks(user.id)
    store.setTags(tags)
    const playlists = await getUserPlaylistsWithTracks(user.id)
    store.setPlaylists(playlists)
    const likes = await getUserLikes(user.id)
    store.setLikes(likes)
  } catch (error) {
    console.error('Error executing method:', error);
  }
})
</script>
