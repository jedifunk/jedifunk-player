<template>
  <ion-item-options side="end"> 
    <ion-item-option @click="toggleLikeStatus(track)">
      <ion-icon slot="icon-only" :icon="isLiked ? bookmark : bookmarkOutline"></ion-icon>
    </ion-item-option>
    <ion-item-option color="secondary" @click="openTags(track)">
      <ion-icon slot="icon-only" :icon="pricetagsOutline"></ion-icon>
    </ion-item-option>
    <ion-item-option color="tertiary" @click="openPlaylistSelectModal(track)">
      <ion-icon slot="icon-only" :icon="listOutline"></ion-icon>
    </ion-item-option>
  </ion-item-options>
</template>
<script setup>
import  {
  IonItemOptions,
  IonItemOption,
  IonIcon,
  modalController
} from '@ionic/vue'
import TagModal from '@/components/TagModal.vue'
import PlaylistSelectModal from '@/components/PlaylistSelectModal.vue'
import { bookmarkOutline, bookmark, listOutline, pricetagsOutline } from 'ionicons/icons'

import { useMainStore } from '@/stores'
import { ref, onMounted } from 'vue'

const store = useMainStore()
const { track } = defineProps(['track'])
const isLiked = ref(false)
const itemOptions = ref(null)
const emit = defineEmits(['closeOptions'])

onMounted(async () => {
  const liked = await store.likes
  const trackId = track.id
  isLiked.value = liked.some(liked => liked.track_id === trackId)
})

const toggleLikeStatus = async (track) => {
  const liked = await store.toggleLikeStatus(track)
  isLiked.value = liked

  emit('closeOptions')
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

  emit('closeOptions')
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

  emit('closeOptions')
}
</script>