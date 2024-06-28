<template>
  <ion-list class="tracks">
    <ion-item-sliding v-for="track in tracks" :key="track.id">
      <TrackComponent :track="track" @click="openPlayer(track)"/>
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
</template>
<script setup>
import {
  IonList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  modalController,
} from '@ionic/vue'
import TrackComponent from '@/components/TrackComponent.vue'
import Player from '@/components/PlayerComponent.vue'
import TagModal from '@/components/TagModal.vue'
import PlaylistSelectModal from '@/components/PlaylistSelectModal.vue'
import { bookmarkOutline, bookmark, listOutline, pricetagsOutline } from 'ionicons/icons'

import { ref } from 'vue'
import { useMainStore } from '@/stores/index'

const store = useMainStore()
const isLoading = ref(true)
const { tracks } = defineProps(['tracks'])

// onMounted(() => {
//   isLoading.value = true
//   console.log(tracks)
// })

const isTrackLiked = (trackId) => {
  return !! store.isLiked[trackId]
}
const openPlayer = async (track) => {
  // set tracks for use in player tracklist
  store.setTracks(tracks)
  // set the selected track clicked
  store.setCurrentTrack(track)
  store.setComingFrom('other')

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