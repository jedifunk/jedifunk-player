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
              <ion-item-sliding v-for="(track, index) in tracks" :key="track.id">
                <TrackComponent :track="track" :show="true" @click="openPlayer(track)" />
  
                <ion-item-options side="end"> 
                  <ion-item-option @click="toggleLikeStatue(track)">
                    <ion-icon slot="icon-only" :icon="isTrackLiked(track.id) ? bookmark : bookmarkOutline"></ion-icon>
                  </ion-item-option>
                  <ion-item-option color="secondary" @click="openTags(track)">
                    <ion-icon slot="icon-only" :icon="isTrackTagged[index] ? pricetags : pricetagsOutline"></ion-icon>
                  </ion-item-option>
                  <ion-item-option color="tertiary" @click="openPlaylistSelectModal(track)">
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
<script setup>
import {
  IonContent, 
  IonHeader, 
  IonPage,  
  IonToolbar,
  IonList,
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
import { bookmarkOutline, bookmark, listOutline, pricetagsOutline, pricetags } from 'ionicons/icons'
import { getSingleShow } from '@/utils/fetch'
import { formatDuration } from '@/utils/helpers'
import Player from '@/components/PlayerComponent.vue'
import TagModal from '@/components/TagModal.vue'
import PlaylistSelectModal from '@/components/PlaylistSelectModal.vue'
import TrackComponent from '@/components/TrackComponent.vue'

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

const isTrackTagged = computed(() => {
  if (!store.singleShow ||!Array.isArray(store.singleShow.tracks)) {
    return []; // Return an empty array if tracks are not available
  }

  return store.singleShow.tracks.map(track => {
    // Assuming isTagged is a method that takes a track ID and returns a boolean
    return store.isTagged.hasOwnProperty(track.id) && store.isTagged[track.id].length > 0;
  });
});

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

const openPlayer = async (track) => {
  // set tracklist for the show
  store.setTracks(store.singleShow.tracks)
  // set the selected track clicked
  store.setCurrentTrack(track)
  store.setComingFrom('show')

  const modal = await modalController.create({
    component: Player,
  })

  await modal.present()
}

const toggleLikeStatue = (track) => {
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

const openPlaylistSelectModal = async (track) => {
  const modal = await modalController.create({ 
    component: PlaylistSelectModal,
    componentProps: {
      track: track
    },
    canDismiss: true
  })
  await modal.present()
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