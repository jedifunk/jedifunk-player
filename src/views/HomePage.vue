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
        <ion-item v-for="year in years.data.slice().reverse()" :key="year.date" :button="true" @click="selectedYear(year.date)">
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
  IonLabel
} from '@ionic/vue';

import { ref, onMounted } from 'vue'
import { getYears } from '@/utils/fetch'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const isLoading = ref(true)
const years = ref([])
const router = useRouter()

onMounted(async () => {
  isLoading.value = true
  await getYears()
  years.value = store.getters.years
  isLoading.value = false
})

function selectedYear(year: string) {
  store.commit('setYearParam', year)
  router.push({ name: 'Year', params: { yearParam: year } })
}
</script>
<style>
a {
  text-decoration: none;
}
</style>