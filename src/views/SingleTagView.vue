<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ route.params.tag }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="loading" v-if="isLoading">
        <ion-spinner name="dots"></ion-spinner>
      </div>
      <ion-list v-else class="tracks">
        <ion-item-sliding v-for="(track, index) in tracks" :key="track.id">
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
            <ion-item-option color="secondary" @click="openTags(track)">
              <ion-icon slot="icon-only" :icon="isTrackTagged[index] ? pricetags : pricetagsOutline"></ion-icon>
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
  IonButtons,
  IonBackButton,
  IonSpinner,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue'

import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/index'
import Player from '@/components/PlayerComponent.vue'
import TagModal from '@/components/TagModal.vue'

import { bookmarkOutline, bookmark, listOutline, pricetagsOutline, pricetags, list } from 'ionicons/icons'

const store = useMainStore()
const route = useRoute()
const isLoading = ref(true)
const tracks = ref([])

onIonViewWillEnter(async () => {
  isLoading.value = true
  try {
    const tagName = route.params.tag.trim().toLowerCase()

    // Normalize tag names in the comparison
    const taggedTrackIds = Object.keys(store.isTagged).filter(trackId => {
      return store.isTagged[trackId].some(tag => tag.name.trim().toLowerCase() === tagName);
    });
    const filteredTracks = store.taggedList.filter(track => taggedTrackIds.includes(track.id.toString()));
    tracks.value = filteredTracks;
  } catch (error) {
    console.error('Failed to get filtered tracks:', error);
  } finally {
    isLoading.value = false
  }
})

const isTrackLiked = (trackId) => {
  return !! store.isLiked[trackId]
}

const isTrackTagged = computed(() => {
  return tracks.value.map(track => {
    // Assuming isTagged is a method that takes a track ID and returns a boolean
    return store.isTagged.hasOwnProperty(track.id) && store.isTagged[track.id].length > 0;
  });
});

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

const openTags = async (track) => {
  const modal = await modalController.create({ 
    component: TagModal,
    componentProps: {
      track: track
    },
    breakpoints: [0,.5,.8],
    initialBreakpoint: .8,
    canDismiss: true,
    handleBehavior: 'cycle',
    showBackdrop: false,
  })
  await modal.present()
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