<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ store.yearParam }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="loading" v-if="isLoading"><ion-spinner name="dots"></ion-spinner></div>
      <ion-list v-else>
        <ion-item v-for="show in store.shows.slice().reverse()" :key="show.id" :button="true" @click="selectedDate(show.date)">
          <ion-label>
            <h2>{{ show.date }}</h2>
            <p>{{ show.venue.name }}</p>
            <p>{{ show.venue.location }}</p>
          </ion-label>
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
  onIonViewWillEnter,
  IonSpinner
} from '@ionic/vue'

import { ref } from 'vue'
import { getShows } from '@/utils/fetch'
import { useMainStore } from '@/stores/index'
import { useRouter, useRoute } from 'vue-router'

const store = useMainStore()
const isLoading = ref(true)
const route = useRoute()
const router = useRouter()

onIonViewWillEnter(async () => {
  isLoading.value = true
  try {
    const shows = await getShows(route.params.yearParam);
    store.setShows(shows.data)
  } catch (error) {
    console.error('failed to set shows:', error)
  } finally {
    isLoading.value = false
  }
})

// click event for show selection
const selectedDate = (date) => {
  store.setDateParam(date)
  router.push({ name: 'Date', params: { dateParam: date } })
}
</script>
<style>
a {
  text-decoration: none;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>