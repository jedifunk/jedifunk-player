<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Tags</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="loading" v-if="isLoading">
        <ion-spinner name="dots"></ion-spinner>
      </div>
      <ion-list>
        <ion-item v-for="tag in tags" :key="tag.id" class="tag-item" :button="true" @click="selectedTag(tag.abbr)">
          <span class="ion-padding">{{ tag.emoji }}</span><ion-label>{{ tag.name }}</ion-label>
        </ion-item>
      </ion-list>
      
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
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  modalController,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue'

import { ref, computed } from 'vue'
import { useMainStore } from '@/stores/index'
import { useRouter } from 'vue-router'
import { tags } from '@/utils/helpers'

const store = useMainStore()
const router = useRouter()
const isLoading = ref(true)

onIonViewWillEnter(() => {
  isLoading.value = true
  isLoading.value = false
})

const selectedTag = (abbr) => {
  router.push({ name: 'Single Tag', params: { tag: abbr } })
}

onIonViewWillLeave(() => {
  console.log('liked ion destoryed')
})
</script>
<style>
</style>