<template>
  <ion-toolbar>
    <ion-title>Add To Playlist</ion-title>
    <ion-buttons slot="start">
      <ion-button @click="dismiss">Cancel</ion-button>
    </ion-buttons>
  </ion-toolbar>
  <ion-content>
    <ion-button class="ion-padding" expand="block" @click="openCreateOrEdit">New Playlist</ion-button>
    <ion-list lines="none">
      <ion-item v-for="playlist in playlists" :key="playlist.id">
        <ion-checkbox
          :checked="selectionStatus[playlist.id]"
          @ionChange="toggleSelectPlaylist(playlist.id)"
        >{{ playlist.name }}</ion-checkbox>
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
  IonList,
  IonItem,
  IonCheckbox,
  IonFab,
  IonFabButton,
  modalController
} from '@ionic/vue'

import { ref, onMounted, watch } from 'vue';
import { useMainStore } from '@/stores/index'

import CreateObjectsModal from '@/components/options/CreateObjectsModal.vue'

const store = useMainStore()
const isLoading = ref(true)
const playlists = ref([])
const selectionStatus = ref({})
const props = defineProps({
  track: Object
})

onMounted(async () => {
  isLoading.value = true;
  try {
    playlists.value = await store.playlists
    playlists.value.forEach(playlist => {
      const trackInPlaylist = playlist.tracks.some(trackInPlaylist => trackInPlaylist !== null && trackInPlaylist.id !== null && trackInPlaylist.id !== undefined && trackInPlaylist.id === Number(props.track.id))
      selectionStatus.value[playlist.id] = trackInPlaylist
    });
  } catch (error) {
    console.error('Failed to get filtered tracks:', error);
  } finally {
    isLoading.value = false;
  }
})

watch(() => store.playlists, (newPlaylists) => {
  playlists.value = newPlaylists
}, {deep: true})

const openCreateOrEdit = async () => {  
  const modalInstance = await modalController.create({
    component: CreateObjectsModal,
    componentProps: {
      objectType: 'playlist',
      onClose: () => modalInstance.dismiss(),
    },
    breakpoints: [0,.5],
    initialBreakpoint:.5,
    canDismiss: true,
  });
  await modalInstance.present();

  modalInstance.onDidDismiss = ((detail, role) => {
    console.info('Modal did dismiss', detail, role);
  });
}

const toggleSelectPlaylist = async (playlistId) => {
  const trackAddedOrRemoved = await store.toggleTrackInPlaylist(playlistId, props.track)
  selectionStatus.value[playlistId] = trackAddedOrRemoved
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