<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-title>All Shows</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <Loader v-if="isLoading" />
      <ion-list v-else lines="none">
        <ion-item v-for="year in store.years.slice().reverse()" :key="year.date" :button="true" @click="selectedYear(year.date)">
          <ion-label>
            <h1>{{  year.date }}</h1>
            <p>{{ year.show_count }} Shows</p>
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
  IonLabel
} from '@ionic/vue';
import Loader from '@/components/SpinnerComponent.vue'

import { ref, onMounted } from 'vue'
import { getYears } from '@/utils/fetch'
import { useMainStore } from '@/stores/index'
import { useRouter } from 'vue-router'

const store = useMainStore()
const isLoading = ref(true)
const router = useRouter()

onMounted(async () => {
  isLoading.value = true
  try {
    const fetchedData = await getYears();
    if (fetchedData.success) {
      const yearsData = fetchedData.data
      store.setYears(yearsData)
    } else {
      console.error("Fetching years failed or returned unexpected data");
    }
  } catch (error) {
    console.error('failed to fetch and set years:', error)
  } finally {
    isLoading.value = false
  }
})

function selectedYear(year) {
  store.setYearParam(year)
  router.push({ name: 'Year', params: { yearParam: year } })
}
</script>
<style>
a {
  text-decoration: none;
}
</style>