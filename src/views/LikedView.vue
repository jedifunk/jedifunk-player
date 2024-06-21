<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Favorites</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="loading" v-if="isLoading">
        <ion-spinner name="dots"></ion-spinner>
      </div>
      <ion-list v-else class="tracks">
        <ion-item-sliding v-for="(track, index) in tracks" :key="track.id">
          <TrackComponent :track="track" @click="openPlayer(track)"/>

          <ion-item-options side="end"> 
            <ion-item-option @click="toggleLikeStatus(track)">
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
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  IonSpinner,
  modalController,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue'

import { computed, ref } from 'vue'
import { useMainStore } from '@/stores/index'
import Player from '@/components/PlayerComponent.vue'
import TagModal from '@/components/TagModal.vue'
import PlaylistSelectModal from '@/components/PlaylistSelectModal.vue'
import TrackComponent from '@/components/TrackComponent.vue'
import { bookmarkOutline, bookmark, listOutline, pricetagsOutline, pricetags } from 'ionicons/icons'

const store = useMainStore()
const isLoading = ref(true)
const tracks = ref([])

onIonViewWillEnter(() => {
  isLoading.value = true
  try {
    const list = store.isLikedList
    tracks.value = list.sort((a, b) => new Date(b.show_date).getTime() - new Date(a.show_date).getTime())
  } catch (error) {
    console.error('failed to get liked tracks:', error)
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
  // set tracks for use in player tracklist
  store.setTracks(tracks.value)
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
    breakpoints: [0,.5,.80],
    initialBreakpoint: .80,
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

onIonViewWillLeave(() => {
  console.log('liked ion destoryed')
})
</script>
<style>
.track > .flex {
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.track-meta p {
  margin-top: 3px;
  font-size: 12px;
}
</style>