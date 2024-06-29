<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ yearP }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <Loader v-if="isLoading" />
      <ion-list v-else lines="none">
        <ion-item v-for="show in store.shows.slice().reverse()" :key="show.id" :button="true" @click="selectedDate(show.date)">
          <div class="show-wrapper">
            <div class="show-art">
              <div>
                <ion-icon :icon="musicalNotes"></ion-icon>
              </div>
            </div>
            <ion-label>
              <h2>{{ show.date }}</h2>
              <p>{{ show.venue.name }}</p>
              <p>{{ show.venue.location }}</p>
            </ion-label>
          </div>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
<script setup>
import {
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonBackButton,
  IonIcon,
  onIonViewWillLeave
} from '@ionic/vue'
import Loader from '@/components/SpinnerComponent.vue'

import { ref, onMounted } from 'vue'
import { getShows } from '@/utils/fetch'
import { useMainStore } from '@/stores/index'
import { useRouter, useRoute } from 'vue-router'
import { musicalNotes } from 'ionicons/icons'

const store = useMainStore()
const router = useRouter()
const route = useRoute()

const isLoading = ref(true)
const yearP = ref()

onMounted(async () => {
  isLoading.value = true;
  try {
    yearP.value = route.params.yearParam ? route.params.yearParam : store.yearParam
    const shows = await getShows(yearP.value);
    store.setShows(shows.data)
  } catch (error) {
    console.error('failed to set shows:', error)
  } finally {
    isLoading.value = false;
  }
})
// click event for show selection
const selectedDate = (date) => {
  store.setDateParam(date)
  router.push({ name: 'Date', params: { dateParam: date } })
}

onIonViewWillLeave(() => {
  console.log('year view will leave:')
})
</script>
<style>
a {
  text-decoration: none;
}
.show-wrapper {
  display: flex;
  gap: 1rem;
  margin: 10px 0;
}
.show-art div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 5px;
  background: var(--ion-color-tertiary);
}
.show-art ion-icon {
  fill: black;
}
</style>