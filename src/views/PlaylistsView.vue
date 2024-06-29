<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-title>Playlists</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <Loader v-if="isLoading" />
      <ion-list v-else>
        <ion-item-sliding v-for="playlist in playlists" :key="playlist.id">
          <ion-item :button="true" @click="handleSelectedPlaylist(playlist.pathname)">
            <ion-label>{{ playlist.name }}</ion-label>
          </ion-item>

          <ion-item-options>
            <ion-item-option color="danger">
              <ion-icon slot="icon-only" :icon="trashOutline" @click="deletePlaylist(playlist.id)"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
      
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
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonSpinner,
  IonIcon,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue'
import Loader from '@/components/SpinnerComponent.vue'
import { trashOutline } from 'ionicons/icons'

import { ref, watch } from 'vue'
import { useMainStore } from '@/stores/index'
import { useRouter } from 'vue-router'

const store = useMainStore()
const router = useRouter()
const isLoading = ref(true)
const playlists = ref([])

onIonViewWillEnter(async () => {
  isLoading.value = true
  try {
    while(!store.appReady) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    playlists.value = await store.playlists
  } catch (error) {
    console.error('Failed to get playlists', error)
  } finally {
    isLoading.value = false
  }
})

watch(() => store.playlists, (newPlaylits) => {
  playlists.value = newPlaylits
})

const deletePlaylist = async (playlistId) => {
  await store.deletePlaylistById(playlistId)
}

const handleSelectedPlaylist = (pathname) => {
  router.push({ name: 'Single Playlist', params: { pathname: pathname } })
}

onIonViewWillLeave(() => {
  console.log('playlists ion will leave')
})
</script>
<style>
</style>