<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Playlists</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="loading" v-if="isLoading">
        <ion-spinner name="dots"></ion-spinner>
      </div>
      <ion-list v-else>
        <ion-item v-for="playlist in playlists" :key="playlist.id" :button="true" @click="handleSelectedPlaylist(playlist.pathname)">
          <ion-label>{{ playlist.name }}</ion-label>
        </ion-item>
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
  IonLabel,
  IonSpinner,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue'

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

const handleSelectedPlaylist = (pathname) => {
  router.push({ name: 'Single Playlist', params: { pathname: pathname } })
}

onIonViewWillLeave(() => {
  console.log('liked ion destoryed')
})
</script>
<style>
</style>