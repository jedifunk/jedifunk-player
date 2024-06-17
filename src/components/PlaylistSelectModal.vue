<template>
  <ion-toolbar>
    <ion-title>Add To Playlist</ion-title>
    <ion-buttons slot="start">
      <ion-button @click="dismiss">Cancel</ion-button>
    </ion-buttons>
  </ion-toolbar>
  <ion-content>
    <ion-button @click="openCreatePlaylist">New Playlist</ion-button>
    <ion-searchbar></ion-searchbar>
    <ion-list>
      <ion-item v-for="playlist in playlists" :key="playlist.id">
        <ion-checkbox @click="addToSelectedPlaylist(playlist.id)">{{ playlist.name }}</ion-checkbox>
      </ion-item>
    </ion-list>
    <ion-fab vertical="bottom" horizontal="center">
      <ion-fab-button size="small" @click="dismiss">Done</ion-fab-button>
    </ion-fab>
  </ion-content>
</template>
<script setup>
import {
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonCheckbox,
  IonFab,
  IonFabButton,
  modalController
} from '@ionic/vue'

import { useMainStore } from '@/stores/index'

import CreatePlaylistModal from '@/components/CreatePlaylistModal.vue'

const store = useMainStore()
const props = defineProps({
  track: Object
})
const playlists = store.playlists

const openCreatePlaylist = async () => {
  const createModal = await modalController.create({ 
    component: CreatePlaylistModal,
    componentProps: {
      onClose: () => createModal.dismiss()
    },
    breakpoints: [0,.5],
    initialBreakpoint: .5,
    canDismiss: true
  })
  await createModal.present()
}

const addToSelectedPlaylist = (playlistId) => {
  store.addTrackToPlaylist(playlistId, props.track)
};

const dismiss = async () => {
  await modalController.dismiss()
}
</script>
<style>
ion-fab-button {
  width: 100px;
  --border-radius: 5px;
  --box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
}
</style>