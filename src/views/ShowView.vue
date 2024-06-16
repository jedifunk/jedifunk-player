<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="loading" v-if="isLoading">
        <ion-spinner name="dots"></ion-spinner>
      </div>
      <div v-else>
        <div class="show-details ion-padding">
          <h1>{{ store.singleShow.date }}</h1>
          <h3>{{ store.singleShow.venue.name }}</h3>
          <p>
            {{ store.singleShow.venue.location }}
            <span>{{ formatDuration(store.singleShow.duration) }}</span>
          </p>
        </div>
        <div>
          <div v-for="(tracks, setName) in groupedTracks" :key="setName">
            <h4 class="set-title ion-padding-start">{{ setName }}</h4>
            <ion-list class="tracks">

              <ion-item-sliding v-for="track in tracks" :key="track.id">
                <ion-item :button="true" :detail="false" @click="openPlayer(track)">
                  <ion-label class="track">
                    <div>{{ track.title }}</div>
                    <div>{{ track.formattedDuration }}</div>
                  </ion-label>
                </ion-item>
  
                <ion-item-options side="end"> 
                  <ion-item-option @click="toggleLikeStatue(track)">
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
          </div>
        </div>  
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import {
  IonContent, 
  IonHeader, 
  IonPage,  
  IonToolbar,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  IonLabel,
  IonButtons,
  IonBackButton,
  onIonViewWillEnter,
  modalController,
  IonSpinner
} from '@ionic/vue'

import { ref, computed } from 'vue'
import { useMainStore } from '@/stores/index'
import { useRoute } from 'vue-router'
import { bookmarkOutline, bookmark, listOutline, pricetagsOutline, pricetags, list } from 'ionicons/icons'
import { getSingleShow } from '@/utils/fetch'
import { formatDuration } from '@/utils/helpers'
import Player from '@/components/PlayerComponent.vue'

const route = useRoute()
const store = useMainStore()
const isLoading = ref(true)
const isLiked = ref({})

onIonViewWillEnter(async () => {
  isLoading.value = true
  try {
    const singleShow = await getSingleShow(route.params.dateParam)
    store.setSingleShow(singleShow.data) 
  } catch (error) {
    console.error('failed to set single show:', error)
  } finally {
    isLoading.value = false
  }
  console.log(store.singleShow)

  if (store.singleShow && Array.isArray(store.singleShow.tracks)) {
    store.singleShow.tracks.forEach((track) => {
      track.formattedDuration = formatDuration(track.duration)
      isLiked.value[track.id] = false
    })
  }
})

const isTrackLiked = (trackId) => {
  return !! store.isLiked[trackId]
}

const groupedTracks = computed(() => {
  const groups = {}
  if (store.singleShow && Array.isArray(store.singleShow.tracks)) {
    store.singleShow.tracks.forEach(track => {
      if (!groups[track.set_name]) {
        groups[track.set_name] = [];
      }
      groups[track.set_name].push(track);
    })
  }
  return groups
})

const openPlayer = async (track: object) => {
  // set tracklist for the show
  store.setShowTracks(store.singleShow.tracks)
  // set the selected track clicked
  store.setStartingTrack(track)
  store.setComingFromShow(true)

  const modal = await modalController.create({
    component: Player,
  })

  await modal.present()
}

const toggleLikeStatue = (track: object) => {
  store.toggleLikeStatus(track)
}
</script>
<style>
.show-details {
  background: var(--ion-color-light-tint);
}
.show-details p span {
  float: right;
}
.item {
  --inner-padding: 0;
}
.tracks .track {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>