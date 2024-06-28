<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Liked Tracks</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="loading" v-if="isLoading">
        <ion-spinner name="dots"></ion-spinner>
      </div>
      <Tracklist v-else :tracks="tracks"/>
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
  IonSpinner,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue'
import Tracklist from '@/components/TrackList.vue';

import { ref } from 'vue'
import { useMainStore } from '@/stores/index'

const store = useMainStore()
const isLoading = ref(true)
const tracks = ref([])

onIonViewWillEnter(async () => {
  isLoading.value = true
  try {
    const list = JSON.parse(JSON.stringify(await store.likes))
    tracks.value = list.map(item => item.tracks).sort((a, b) => new Date(b.show_date).getTime() - new Date(a.show_date).getTime())
  } catch (error) {
    console.error('failed to get liked tracks:', error)
  } finally {
    isLoading.value = false
  }
})

onIonViewWillLeave(() => {
  console.log('liked ion will leave')
})
</script>