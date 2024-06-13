<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ props.dateParam }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <ion-card>
          <ion-card-content class="show-details">
            <h1>{{ single.data.venue.name }}</h1>
            <p>
              {{ single.data.venue.location }}
              <span>{{ formatDuration(single.data.duration) }}</span>
            </p>
          </ion-card-content>
        </ion-card>
        <div>
          <div v-for="(tracks, setName) in groupedTracks" :key="setName">
            <h4 class="set-title ion-padding-start">{{ setName }}</h4>
            <ion-list class="tracks">

              <ion-item-sliding v-for="track in tracks" :key="track.id">
                <ion-item>
                  <ion-label class="track">
                    <div>{{ track.position }}</div>
                    <div>{{ track.title }}</div>
                    <div>{{ track.formattedDuration }}</div>
                  </ion-label>
                </ion-item>
  
                <ion-item-options side="end"> 
                  <ion-item-option>
                    <ion-icon slot="icon-only" :icon="heart">Love</ion-icon>
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
  onIonViewWillLeave,
} from '@ionic/vue'

import { ref, defineProps, computed } from 'vue'
import { heart, listOutline } from 'ionicons/icons'
import { getSingleShow } from '@/utils/fetch'
import { formatDuration } from '@/utils/helpers'

const props = defineProps<{
  dateParam: string, // Expecting a string for the year
}>();

const single = ref([])
const isLoading = ref(true)
console.log('show params', props)

onIonViewWillEnter(async () => {
  console.log('show ion initialized', props.dateParam)
  single.value = await getSingleShow(props.dateParam)
  isLoading.value = false

  single.value.data.tracks.forEach((track) => {
    track.formattedDuration = formatDuration(track.duration); // Manually computing formatted duration for each track
  })
})

const groupedTracks = computed(() => {
  const groups = {};
  single.value.data.tracks.forEach(track => {
    if (!groups[track.set_name]) {
      groups[track.set_name] = [];
    }
    groups[track.set_name].push(track);
  });
  return groups;
});

onIonViewWillLeave(() => {
  console.log('show ion destroyed')
})
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