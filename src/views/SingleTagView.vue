<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ route.params.tag }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="deleteTag(tId)"><ion-icon slot="icon-only" :icon="trashOutline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="loading" v-if="isLoading">
        <ion-spinner name="dots"></ion-spinner>
      </div>
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
  IonSpinner,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue'

import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/index'
import Tracklist from '@/components/TrackList.vue'

import { trashOutline } from 'ionicons/icons'

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
    // Search through the tags in the store state
    const tag = store.tags.find(tag => tag.pathname === targetPathname);
    if (tag) {
      title.value = tag.name
      tracks.value = tag.tracks
      tId.value = tag.id
    } else {
      console.log(`No tag found for pathname: ${targetPathname}`);
    }
  } catch (error) {
    console.error('Failed to get filtered tracks:', error);
  } finally {
    isLoading.value = false;
  }
})

const deleteTag = async (tagId) => {
  await store.deleteTagById(tagId)
  router.push({name: 'Tags'})
  console.log('deleted')
}

onIonViewWillLeave(() => {
  console.log('single tag ion will leave')
})
</script>