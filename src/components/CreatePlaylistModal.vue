<template>
  <ion-content class="create-playlist">
    <div class="flex column ion-padding">
      <h3>Give your playlist a name</h3>
      <ion-input 
        v-model="playlistName"
        aria-label="Playlist"
        :class="{ 'ion-invalid': nameExists }"
        :value="playlistName"
        error-text="Name already taken"
        @ionInput="checkNameUniqueness"
        @ionBlur="checkNameUniqueness"
      ></ion-input>
      <ion-button :disabled="!isValidName" @click="createPlaylist">Create</ion-button>
    </div>
  </ion-content>
</template>
<script setup>
import {
  IonContent,
  IonInput,
  IonButton,
  modalController
} from '@ionic/vue'

import { ref, onMounted, watchEffect } from 'vue'
import { useMainStore } from '@/stores'

const store = useMainStore()
const playlistName = ref('My Jams')
const isValidName = ref(true)
const nameExists = ref(false)

const props = defineProps({
  onClose: Function
})

onMounted(() => {
  
  setTimeout(() => {
    const inputElement = document.querySelector('#ion-input-0');

    if (inputElement) {
      inputElement.focus()
      inputElement.select()
    }
  }, 100);
})

const checkNameUniqueness = () => {
  const nameLowercase = playlistName.value.toLowerCase()
  const existingPlaylist = store.playlists.find(playlist => playlist.name.toLowerCase() === nameLowercase)
  if (existingPlaylist) {
    nameExists.value = true
  } else {
    nameExists.value = false
  }
}

watchEffect(() => {
  isValidName.value = true
  nameExists.value = false
  if (playlistName.value.trim()) {
    checkNameUniqueness()
    isValidName.value = !nameExists.value
  } else {
    isValidName.value = false
  }
})

const createPlaylist = () => {
  // check if name is taken
  if (!isValidName.value) return

  // Convert the playlist name to URL path friendly format
  const pathname = playlistName.value.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Create the playlist object with the new ID
  const newPlaylist = {
    name: playlistName.value,
    pathname: pathname
  }

  // Update the store with the new playlist
  store.addPlaylist(newPlaylist);

  // Optionally, reset the playlistName after creation
  playlistName.value = 'My Jams'
  props.onClose()
}
</script>
<style>
.create-playlist .flex.column {
  justify-content: flex-start;
  align-items: center;
}
ion-input {
  text-align: center;
}
</style>