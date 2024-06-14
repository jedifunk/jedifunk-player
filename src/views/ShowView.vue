<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ store.state.dateParam }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <ion-card>
          <ion-card-content class="show-details">
            <h1>{{ singleShow.data.venue.name }}</h1>
            <p>
              {{ singleShow.data.venue.location }}
              <span>{{ formatDuration(singleShow.data.duration) }}</span>
            </p>
          </ion-card-content>
        </ion-card>
        <div>
          <div v-for="(tracks, setName) in groupedTracks" :key="setName">
            <h4 class="set-title ion-padding-start">{{ setName }}</h4>
            <ion-list class="tracks">

              <ion-item-sliding v-for="track in tracks" :key="track.id">
                <ion-item :button="true" @click="openPlayer(track)">
                  <ion-label class="track">
                    <div>{{ track.position }}</div>
                    <div>{{ track.title }}</div>
                    <div>{{ track.formattedDuration }}</div>
                  </ion-label>
                </ion-item>
  
                <ion-item-options side="end"> 
                  <ion-item-option>
                    <ion-icon slot="icon-only" :icon="heart"></ion-icon>
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
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardContent,
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
  modalController
} from '@ionic/vue'

import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { heart, listOutline } from 'ionicons/icons'
import { getSingleShow } from '@/utils/fetch'
import { formatDuration } from '@/utils/helpers'
import Player from '@/components/PlayerComponent.vue'

const route = useRoute()
const store = useStore()
const singleShow = ref([])
const isLoading = ref(true)

onIonViewWillEnter(async () => {
  isLoading.value = true
  await getSingleShow(route.params.dateParam)
  singleShow.value = store.getters.singleShow 
  console.log(singleShow.value)
  isLoading.value = false

  if (singleShow.value.data && Array.isArray(singleShow.value.data.tracks)) {
    singleShow.value.data.tracks.forEach((track) => {
      track.formattedDuration = formatDuration(track.duration); // Manually computing formatted duration for each track
    })
  }
})

const groupedTracks = computed(() => {
  const groups = {}
  if (singleShow.value.data && Array.isArray(singleShow.value.data.tracks)) {
    singleShow.value.data.tracks.forEach(track => {
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
  store.dispatch('setShowTracks', singleShow.value.data.tracks)
  // set the selected track clicked
  store.dispatch('setStartingTrack', track)

  const modal = await modalController.create({
    component: Player,
  })

  await modal.present()
}
</script>
<style>
.show-details p span {
  float: right;
}
.item {
  --inner-padding: 0;
}
.tracks .track {
  display: flex;
  gap: 1rem;
}
.track div:nth-child(2) {
  flex-grow: 2;
}
</style>