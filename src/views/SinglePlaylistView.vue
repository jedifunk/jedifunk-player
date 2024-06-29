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

import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/index'
import Tracklist from '@/components/TrackList.vue'

import { play, trashOutline } from 'ionicons/icons'

const store = useMainStore()
const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const tracks = ref([])
const title = ref('')
const pId = ref()

onIonViewWillEnter(async () => {
  isLoading.value = true;
  const targetPathname = route.params.pathname
  try {
    while(!store.appReady) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    // Search through the playlists in the store state
    const playlist = store.playlists.find(playlist => playlist.pathname === targetPathname);
    if (playlist) {
      title.value = playlist.name
      tracks.value = playlist.tracks ? playlist.tracks.filter(track => track !== null) : []
      pId.value = playlist.id
    } else {
      console.log(`No playlist found for pathname: ${targetPathname}`);
    }
    isLoading.value = false
  } catch (error) {
    console.error('Failed to get filtered tracks:', error);
  }
})

const deletePlaylist = async (playlistId) => {
  await store.deletePlaylistById(playlistId)
  router.push({name: 'Playlists'})
}

onIonViewWillLeave(() => {
  console.log('single playlist ion will leave')
})
</script>