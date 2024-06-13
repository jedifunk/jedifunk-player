<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>All Shows</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div v-if="isLoading">Loading...</div>
      <ion-list v-else>
        <!-- {{ years.data[0].show_count }} -->
        <router-link v-for="year in years.data.slice().reverse()"
        :key="year.date"
        :to="{ name: 'Year', params: {yearParam: year.date}}"
        ref="yearsRefs"
        >
        <ion-item :button="true">
        <!-- <ion-item v-for="year in years.data.slice().reverse()" :key="year.date" :to="{name: 'Year', params: {year: year.date}}" :button="true"> -->
          <ion-label>
            <h1>{{  year.date }}</h1>
            <p>{{ year.show_count }} Shows</p>
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
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue';

import { ref } from 'vue'
import { getYears } from '@/utils/fetch'

const years = ref({})
const isLoading = ref(true);
const yearsRefs = ref([])

onIonViewWillEnter(async () => {
  console.log('home ion initialized')
  years.value = await getYears()
  isLoading.value = false
})
onIonViewWillLeave(() => {
  console.log('home ion destroyed');
});
</script>
<style>
a {
  text-decoration: none;
}
</style>