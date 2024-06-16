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
      <ion-list v-else class="tracks">
        <ion-item-sliding v-for="track in tracks" :key="track.id">
          <ion-item :button="true" :detail="false" @click="openPlayer(track)">
            <ion-label class="track">
              <div class="flex">
                <div class="track-meta flex column">
                  {{ track.title }}
                  <p>{{ track.show_date }} | {{ track.venue_name }}, {{ track.venue_location }}</p>
                </div>
                <div>{{ track.formattedDuration }}</div>
              </div>
            </ion-label>
          </ion-item>

          <ion-item-options side="end"> 
            <ion-item-option @click="toggleLikeStatus(track)">
              <ion-icon slot="icon-only" :icon="isTrackLiked(track.id) ? bookmark : bookmarkOutline"></ion-icon>
            </ion-item-option>
            <ion-item-option color="secondary">
              <ion-icon slot="icon-only" :icon="pricetagsOutline"></ion-icon>
            </ion-item-option>
            <ion-item-option color="tertiary">
              <ion-icon slot="icon-only" :icon="listOutline"></ion-icon>
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
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  IonSpinner,
  modalController,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue'

import { ref } from 'vue'
import { useMainStore } from '@/stores/index'
import Player from '@/components/PlayerComponent.vue'
import { bookmarkOutline, bookmark, listOutline, pricetagsOutline, pricetags, list } from 'ionicons/icons'

const store = useMainStore()
const isLoading = ref(true)
const tracks = ref([])

onIonViewWillEnter(() => {
  isLoading.value = true
  try {
    tracks.value = store.isLikedList
  } catch (error) {
    console.error('failed to get liked tracks:', error)
  } finally {
    isLoading.value = false
  }
})

const isTrackLiked = (trackId) => {
  return !! store.isLiked[trackId]
}

const openPlayer = async (track) => {

  // set the selected track clicked
  store.setStartingTrack(track)
  store.setComingFromShow(true)

  const modal = await modalController.create({
    component: Player,
  })

  await modal.present()
}

const toggleLikeStatus = (track) => {
  store.toggleLikeStatus(track)
}

onIonViewWillLeave(() => {
  console.log('liked ion destoryed')
})
</script>
<style>
.track > .flex {
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
.track-meta p {
  font-size: 12px;
}
</style>