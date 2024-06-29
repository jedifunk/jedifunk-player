<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tags"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ route.params.tag }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="deleteTag(tId)"><ion-icon slot="icon-only" :icon="trashOutline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <Loader v-if="isLoading" />
      <Tracklist v-else :tracks="tracks" />
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
  IonIcon,
  IonButtons,
  IonButton,
  IonBackButton,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue'
import Tracklist from '@/components/TrackList.vue'
import Loader from '@/components/SpinnerComponent.vue'
import { trashOutline } from 'ionicons/icons'

import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/index'

const store = useMainStore()
const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const tracks = ref([])
const title = ref('')
const tId = ref()

onIonViewWillEnter(async () => {
  isLoading.value = true;
  const targetPathname = route.params.tag
  try {
    while(!store.appReady) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    // Search through the tags in the store state
    const tag = await store.tags.find(tag => tag.pathname === targetPathname);
    if (tag) {
      title.value = tag.name
      tracks.value = tag.tracks ? tag.tracks.filter(track => track !== null) : []
      tId.value = tag.id
    } else {
      console.log(`No tag found for pathname: ${targetPathname}`);
    }
    isLoading.value = false;
  } catch (error) {
    console.error('Failed to get tagged tracks:', error);
  }
})

const deleteTag = async (tagId) => {
  await store.deleteTagById(tagId)
  router.push({name: 'Tags'})
}

onIonViewWillLeave(() => {
  console.log('single tag ion will leave')
})
</script>