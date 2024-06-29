<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :defaultHref="defaultBack()"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ store.singleShow.date }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <Loader v-if="isLoading" />
      <div v-else>
        <div class="show-details ion-padding">
          <ion-header collapse="condense">
            <ion-toolbar>
              <h1>{{ store.singleShow.date }}</h1>
            </ion-toolbar>
          </ion-header>
          <h3>{{ store.singleShow.venue.name }}</h3>
          <p>
            {{ store.singleShow.venue.location }}
            <span>{{ formatDuration(store.singleShow.duration) }}</span>
          </p>
        </div>
        <div>
          <SetList :groupedTracks="groupedTracks"/>
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
import SetList from '@/components/SetList.vue'
import Loader from '@/components/SpinnerComponent.vue'

import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useMainStore } from '@/stores/index'
import { getSingleShow } from '@/utils/fetch'
import { formatDuration } from '@/utils/helpers'

const route = useRoute()
const store = useMainStore()
const isLoading = ref(true)


onMounted(async () => {
  isLoading.value = true
  try {
    const singleShow = await getSingleShow(route.params.dateParam)
    store.setDateParam(route.params.dateParam)
    store.setYearParam(route.params.yearParam)
    store.setSingleShow(singleShow.data) 
  } catch (error) {
    console.error('failed to set single show:', error)
  } finally {
    isLoading.value = false
  }
})

const groupedTracks = computed(() => {
  const groups = {}
  if (store.singleShow && Array.isArray(store.singleShow.tracks)) {
    store.singleShow.tracks.forEach(track => {
      if (!groups[track.set_name]) {
        groups[track.set_name] = [];
      }
      groups[track.set_name].push(track);
    })
  }
  return groups
})
const defaultBack = () => {
  return `/${store.yearParam}`
}
onIonViewWillLeave(() => {
  console.log('show view will leave')
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