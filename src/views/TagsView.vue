<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-title>Tags</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <Loader v-if="isLoading" />
      <ion-list v-else ref="sliding">
        <ion-item-sliding v-for="tag in tags" :key="tag.id">
          <ion-item :button="true" @click="handleSelectedTag(tag.pathname)">
            <ion-label>{{ tag.name }}</ion-label>
          </ion-item>

          <ion-item-options>
            <ion-item-option color="primary">
              <ion-icon slot="icon-only" :icon="ellipsisHorizontalOutline" @click="openOptions(tag.id)"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
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
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonIcon,
  onIonViewWillEnter,
  onIonViewWillLeave,
  modalController
} from '@ionic/vue'
import Loader from '@/components/SpinnerComponent.vue'
import OptionsModal from '@/components/options/OptionsModal.vue'
import { ellipsisHorizontalOutline } from 'ionicons/icons'

import { ref, watch } from 'vue'
import { useMainStore } from '@/stores/index'
import { useRouter } from 'vue-router'

const store = useMainStore()
const router = useRouter()
const isLoading = ref(true)
const tags = ref([])
const sliding = ref()

onIonViewWillEnter(async () => {
  isLoading.value = true
  try {
    while(!store.appReady) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    tags.value = await store.tags
  } catch (error) {
    console.error('Failed to get tags', error)
  } finally {
    isLoading.value = false
  }
})

watch(() => store.tags, (newTags) => {
  tags.value = newTags
}, {deep: true})

const openOptions = async (tId) => {
  const optionsModal = await modalController.create({
    component: OptionsModal,
    componentProps: {
      objectId: tId,
      objectType: 'tag'
    },
    canDismiss: true,
    breakpoints: [.5, 1],
    initialBreakpoint: .5
  })

  sliding.value.$el.closeSlidingItems()
  await optionsModal.present()
}

const handleSelectedTag = (pathname) => {
  router.push({ name: 'Single Tag', params: { tag: pathname } })
}

onIonViewWillLeave(() => {
  console.info('tags ion will leave')
})
</script>
<style>
</style>