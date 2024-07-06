<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :defaultHref="defaultBack()"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ showsStore.singleShow.date }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <Loader v-if="isLoading" />
      <div v-else>
        <div class="show-details ion-padding">
          <ion-header collapse="condense">
            <ion-toolbar>
              <h1>{{ showsStore.singleShow.date }}</h1>
            </ion-toolbar>
          </ion-header>
          <h3>{{ showsStore.singleShow.venue.name }}</h3>
          <p>
            {{ showsStore.singleShow.venue.location }}
            <span>{{ formatDuration(showsStore.singleShow.duration) }}</span>
          </p>
        </div>
        <div>
          <SetList :tracks="showsStore.singleShow.tracks" :groupedTracks="groupedTracks"/>
        </div>  
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup>
import {
  IonContent, 
  IonHeader, 
  IonPage,  
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  onIonViewWillLeave
} from '@ionic/vue'
import SetList from '@/components/tracks/SetList.vue'
import Loader from '@/components/SpinnerComponent.vue'

import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useShowsStore } from '@/stores/shows'
import { getSingleShow } from '@/utils/fetch'
import { formatDuration } from '@/utils/helpers'

const route = useRoute()
const showsStore = useShowsStore()
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  try {
    const singleShow = await getSingleShow(route.params.dateParam)
    showsStore.setDateParam(route.params.dateParam)
    showsStore.setYearParam(route.params.yearParam)
    showsStore.setSingleShow(singleShow.data)
  } catch (error) {
    console.error('failed to set single show:', error)
  } finally {
    isLoading.value = false
  }
})

const groupedTracks = computed(() => {
  const groups = {}
  if (showsStore.singleShow && Array.isArray(showsStore.singleShow.tracks)) {
    showsStore.singleShow.tracks.forEach(track => {
      if (!groups[track.set_name]) {
        groups[track.set_name] = [];
      }
      groups[track.set_name].push(track);
    })
  }
  return groups
})
const defaultBack = () => {
  return `/${showsStore.yearParam}`
}
onIonViewWillLeave(() => {
  console.info('show view will leave')
})
</script>
<style>
.show-details {
  background: var(--ion-color-light-tint);
}
.show-details p span {
  float: right;
}
.show-details ion-toolbar {
  --background: transparent;
}
.show-details h1 {
  margin: 0;
}
</style>