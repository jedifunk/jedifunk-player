<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="deletePlaylist(pId)"><ion-icon slot="icon-only" :icon="trashOutline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="loading" v-if="isLoading">
        <ion-spinner name="dots"></ion-spinner>
      </div>
      <ion-list v-else class="tracks">
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
  IonButtons,
  IonButton,
  IonBackButton,
  IonSpinner,
  modalController,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue'

import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/index'
import Player from '@/components/PlayerComponent.vue'
import TagModal from '@/components/TagModal.vue'
import PlaylistSelectModal from '@/components/PlaylistSelectModal.vue'
import TrackComponent from '@/components/TrackComponent.vue'

import { bookmarkOutline, bookmark, listOutline, pricetagsOutline, trashOutline } from 'ionicons/icons'

const store = useMainStore()
const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const tracks = ref([])
const title = ref('')
const pId = ref()

onIonViewWillEnter(async () => {
  isLoading.value = true;
  const targetPathname = route.params.pathname
  try {
    // Search through the playlists in the store state
    const playlist = store.playlists.find(playlist => playlist.pathname === targetPathname);
    if (playlist) {
      title.value = playlist.name
      tracks.value = playlist.tracks
      pId.value = playlist.id
    } else {
      console.log(`No playlist found for pathname: ${targetPathname}`);
    }
  } catch (error) {
    console.error('Failed to get filtered tracks:', error);
  } finally {
    isLoading.value = false;
  }
});

const isTrackLiked = (trackId) => {
  return !! store.isLiked[trackId]
}

// const isTrackTagged = computed(() => {
//   return tracks.value.map(track => {
//     // Assuming isTagged is a method that takes a track ID and returns a boolean
//     return store.isTagged.hasOwnProperty(track.id) && store.isTagged[track.id].length > 0;
//   });
// });

const openPlayer = async (track) => {
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

onIonViewWillLeave(() => {
  console.log('liked ion destoryed')
})

const deletePlaylist = async (playlistId) => {
  await store.deletePlaylistById(playlistId)
  router.push({name: 'Playlists'})
  console.log('deleted')
}
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