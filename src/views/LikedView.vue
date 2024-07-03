<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-title>Liked Tracks</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <Loader v-if="isLoading" />
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
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue'
import Tracklist from '@/components/tracks/TrackList.vue';
import Loader from '@/components/SpinnerComponent.vue'

import { ref, watch } from 'vue'
import { useMainStore } from '@/stores/index'

const store = useMainStore()
const isLoading = ref(true)
const tracks = ref([])

onIonViewWillEnter(async () => {
  isLoading.value = true
  try {
    while(!store.appReady) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    const list = JSON.parse(JSON.stringify(await store.likes))
    tracks.value = list.map(item => item.tracks).sort((a, b) => new Date(b.show_date).getTime() - new Date(a.show_date).getTime())
  } catch (error) {
    console.error('failed to get liked tracks:', error)
  } finally {
    isLoading.value = false
  }
})

watch(() => store.likes, (newLikes) => {
  const list = JSON.parse(JSON.stringify(newLikes))
  tracks.value = list.map(item => item.tracks).sort((a, b) => new Date(b.show_date).getTime() - new Date(a.show_date).getTime())
}, {deep: true})

onIonViewWillLeave(() => {
  console.info('liked ion will leave')
})
</script>