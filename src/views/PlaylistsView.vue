<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-title>Playlists</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <Loader v-if="isLoading" />
      <ion-list v-else ref="sliding">
        <ion-item-sliding v-for="playlist in playlists" :key="playlist.id">
          <ion-item :button="true" @click="handleSelectedPlaylist(playlist.pathname)">
            <ion-label>{{ playlist.name }}</ion-label>
          </ion-item>

          <ion-item-options>
            <ion-item-option color="primary">
              <ion-icon slot="icon-only" :icon="ellipsisHorizontalOutline" @click="openOptions(playlist.id)"></ion-icon>
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
import { useMainStore } from '@/stores/main'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const mainStore = useMainStore()
const store = useUserStore()
const router = useRouter()
const isLoading = ref(true)
const playlists = ref([])
const sliding = ref()

onIonViewWillEnter(async () => {
  isLoading.value = true
  try {
    while(!mainStore.appReady) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    playlists.value = await store.playlists
  } catch (error) {
    console.error('Failed to get playlists', error)
  } finally {
    isLoading.value = false
  }
})

watch(() => store.playlists, (newPlaylists) => {
  playlists.value = newPlaylists
}, {deep: true})

const openOptions = async (pId) => {
  const optionsModal = await modalController.create({
    component: OptionsModal,
    componentProps: {
      objectId: pId,
      objectType: 'playlist'
    },
    canDismiss: true,
    breakpoints: [.5, 1],
    initialBreakpoint: .5
  })

  sliding.value.$el.closeSlidingItems()
  await optionsModal.present()
}

const handleSelectedPlaylist = (pathname) => {
  router.push({ name: 'Single Playlist', params: { pathname: pathname } })
}

onIonViewWillLeave(() => {
  console.info('playlists ion will leave')
})
</script>