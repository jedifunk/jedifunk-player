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
import { getUser, getUserTagsWithTracks, getUserPlaylistsWithTracks } from '@/utils/database'
import MiniPlayer from '@/components/MiniPlayer.vue'

const store = useMainStore()
const showMiniPlayer = computed(() => store.showMiniPlayer)
const currentTrack = computed(() => store.currentTrack)

onBeforeMount(async () => {
  try {
    const fetchedUser = await getUser('jedifunk')
    store.setUser(fetchedUser)
    const theTags = await getUserTagsWithTracks('5225927e-07e3-47db-9187-a0081921d779')
    store.setTags(theTags)
    const playlists = await getUserPlaylistsWithTracks('5225927e-07e3-47db-9187-a0081921d779')
    store.setPlaylists(playlists)
    //await store.getFromLocalStorage()
  } catch (error) {
    console.error('Error executing method:', error);
  }
})
</script>
