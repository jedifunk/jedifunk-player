<template>
  <div v-for="(tracks, setName) in groupedTracks" :key="setName">
    <h4 class="set-title ion-padding-start">{{ setName }}</h4>
    <ion-list class="tracks">
      <ion-item-sliding v-for="track in tracks" :key="track.id">
        <TrackComponent :track="track" :show="true" @click="openPlayer(track)" />
        <ion-item-options side="end"> 
          <ion-item-option @click="toggleLikeStatus(track)">
            <ion-icon slot="icon-only" :icon="isTrackLiked(track.id) ? bookmark : bookmarkOutline"></ion-icon>
          </ion-item-option>
          <ion-item-option color="secondary" @click="openTags(track)">
            <ion-icon slot="icon-only" :icon="pricetagsOutline"></ion-icon>
          </ion-item-option>
          <ion-item-option color="tertiary" @click="openPlaylistSelectModal(track)">
            <ion-icon slot="icon-only" :icon="listOutline"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
  </div>
</template>
<script setup>
import {
  IonList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  modalController
} from '@ionic/vue'
import Player from '@/components/PlayerComponent.vue'
import TagModal from '@/components/TagModal.vue'
import PlaylistSelectModal from '@/components/PlaylistSelectModal.vue'
import TrackComponent from '@/components/TrackComponent.vue'
import { bookmarkOutline, bookmark, listOutline, pricetagsOutline } from 'ionicons/icons'

import { useMainStore } from '@/stores'

const store = useMainStore()
// const isLoading = ref(true)
const { groupedTracks } = defineProps(['groupedTracks'])

const isTrackLiked = (trackId) => {
  return !! store.isLiked[trackId]
}

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

const toggleLikeStatus = (track) => {
  store.toggleLikeStatus(track)
}

const openTags = async (track) => {
  const modal = await modalController.create({ 
    component: TagModal,
    componentProps: {
      track: track
    },
    canDismiss: true,
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
.item {
  --inner-padding: 0;
}
.tracks .track {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
</style>