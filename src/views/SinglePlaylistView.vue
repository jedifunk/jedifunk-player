<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/playlists"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="deletePlaylist(pId)"><ion-icon slot="icon-only" :icon="trashOutline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <Loader v-if="isLoading" />
      <Tracklist v-else :tracks="tracks" />
    </ion-content>
  </ion-page>
</template>
<script setup>
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonIcon,
  IonButtons,
  IonButton,
  IonBackButton,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue'
import Loader from '@/components/SpinnerComponent.vue'

import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/index'
import Tracklist from '@/components/TrackList.vue'

import { trashOutline } from 'ionicons/icons'

const store = useMainStore()
const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const tracks = ref([])
const title = ref('')
const pId = ref()
const playlists = ref([])
const target = ref(null)

onIonViewWillEnter(async () => {
  isLoading.value = true;
  target.value = route.params.pathname
  try {
    while(!store.appReady) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    playlists.value = await store.playlists
    // Search through the playlists in the store state
    const playlist = playlists.value.find(playlist => playlist.pathname === target.value);
    if (playlist) {
      title.value = playlist.name
      tracks.value = playlist.tracks ? playlist.tracks.filter(track => track !== null) : []
      pId.value = playlist.id
    } else {
      console.warn(`No playlist found for pathname: ${target.value}`);
    }
    isLoading.value = false
  } catch (error) {
    console.error('Failed to get filtered tracks:', error);
  }
})

watch(() => store.playlists, (newPlaylists) => {
  playlists.value = newPlaylists
  const playlist = playlists.value.find(playlist => playlist.pathname === target.value);
  if (playlist) {
    title.value = playlist.name
    tracks.value = playlist.tracks ? playlist.tracks.filter(track => track !== null) : []
    pId.value = playlist.id
  } else {
    console.warn(`No playlist found for pathname: ${target.value}`);
  }
}, {deep: true})

const deletePlaylist = async (playlistId) => {
  await store.deletePlaylistById(playlistId)
  router.push({name: 'Playlists'})
}

onIonViewWillLeave(() => {
  console.info('single playlist ion will leave')
})
</script>