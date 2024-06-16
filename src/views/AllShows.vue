<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>All Shows</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="loading" v-if="isLoading"><ion-spinner name="dots"></ion-spinner></div>
      <ion-list v-else>
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
  IonSpinner
} from '@ionic/vue';

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

function selectedYear(year: string) {
  store.setYearParam(year)
  router.push({ name: 'Year', params: { yearParam: year } })
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