<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tags"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openOptions"><ion-icon slot="icon-only" :icon="ellipsisHorizontalOutline"></ion-icon></ion-button>
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
  modalController
} from '@ionic/vue'
import Tracklist from '@/components/TrackList.vue'
import Loader from '@/components/SpinnerComponent.vue'
import OptionsModal from '@/components/OptionsModal.vue'
import { trashOutline, ellipsisHorizontalOutline } from 'ionicons/icons'

import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/index'

const store = useMainStore()
const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const tracks = ref([])
const title = ref('')
const tId = ref()
const tags = ref([])
const target = ref()

onIonViewWillEnter(async () => {
  isLoading.value = true;
  target.value = route.params.tag
  try {
    while(!store.appReady) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    tags.value = await store.tags
    // Search through the tags in the store state
    const tag = tags.value.find(tag => tag.pathname === target.value);
    if (tag) {
      title.value = tag.name
      tracks.value = tag.tracks ? tag.tracks.filter(track => track !== null) : []
      tId.value = tag.id
    } else {
      console.warn(`No tag found for pathname: ${target.value}`);
    }
    isLoading.value = false;
  } catch (error) {
    console.error('Failed to get tagged tracks:', error);
  }
})

watch(() => store.tags, (newTags) => {
  tags.value = newTags
  const tag = tags.value.find(tag => tag.pathname === target.value)
  if (tag) {
    title.value = tag.name
    tracks.value = tag.tracks ? tag.tracks.filter(track => track !== null) : []
    tId.value = tag.id
  } else {
    console.warn(`No tag found for pathname: ${target.value}`);
  }
}, {deep: true})

const openOptions = async () => {
  const nTId = tId.value
  const optionsModal = await modalController.create({
    component: OptionsModal,
    componentProps: {
      objectId: nTId,
      objectType: 'tag'
    },
    canDismiss: true,
    breakpoints: [.5, 1],
    initialBreakpoint: .5
  })

  await optionsModal.present()
}

onIonViewWillLeave(() => {
  console.info('single tag ion will leave')
})
</script>