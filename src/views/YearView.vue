<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ props.yearParam }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="isLoading">Loading...</div>
      <ion-list v-else>
        <!-- {{ shows.data[0].id }} -->
        <router-link v-for="show in shows.data.slice().reverse()" 
          :key="show.id" 
          :to="{ name: 'Date', params: {dateParam: show.date}}"
        >
          <ion-item :button="true">
            <ion-label>
              <h2>{{ show.date }}</h2>
              <p>{{ show.venue.name }}</p>
              <p>{{ show.venue.location }}</p>
            </ion-label>
          </ion-item>
        </router-link>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
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
  onIonViewWillLeave,
  onIonViewWillEnter,
} from '@ionic/vue'

import { ref, defineProps } from 'vue'
import { getShows } from '@/utils/fetch'

const props = defineProps<{
  yearParam: string, // Expecting a string for the year
}>();

const shows = ref([])
const isLoading = ref(true)

onIonViewWillEnter(async () => {
  console.log('year ion initialized')
  const myYear = props.yearParam
  shows.value = await getShows(myYear)
  isLoading.value = false
  console.log('year params on enter', props.yearParam)
})

onIonViewWillLeave(() => {
  console.log('year params on exit', props.yearParam)
  console.log('year ion destroyed');
});
</script>
<style>
a {
  text-decoration: none;
}
</style>