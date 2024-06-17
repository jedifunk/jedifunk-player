<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Playlists</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="loading" v-if="isLoading">
        <ion-spinner name="dots"></ion-spinner>
      </div>
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

import { trashOutline } from 'ionicons/icons'

import { ref } from 'vue'
import { useMainStore } from '@/stores/index'
import { useRouter } from 'vue-router'

const store = useMainStore()
const router = useRouter()
const isLoading = ref(true)
const playlists = ref([])

onIonViewWillEnter(() => {
  isLoading.value = true
  try {
    playlists.value = store.playlists
  } catch (error) {
    console.error('Failed to get playlists', error)
  } finally {
    isLoading.value = false
  }
  
})

const deletePlaylist = async (playlistId) => {
  await store.deletePlaylistById(playlistId)
  playlists.value = store.playlists
}

const handleSelectedPlaylist = (pathname) => {
  router.push({ name: 'Single Playlist', params: { pathname: pathname } })
}

onIonViewWillLeave(() => {
  console.log('liked ion destoryed')
})
</script>
<style>
</style>