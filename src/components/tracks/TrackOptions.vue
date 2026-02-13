<template>
  <ion-item-options side="end"> 
    <ion-item-option @click="handleToggleLike">
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
import {
  IonItemOptions,
  IonItemOption,
  IonIcon,
  modalController
} from '@ionic/vue'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { 
  bookmarkOutline, 
  bookmark, 
  listOutline, 
  pricetagsOutline 
} from 'ionicons/icons'

import TagModal from '@/components/options/TagModal.vue'
import PlaylistSelectModal from '@/components/options/PlaylistSelectModal.vue'

const store = useUserStore()
const props = defineProps(['track'])
const emit = defineEmits(['closeOptions'])

const isLiked = computed(() => {
  if (!props.track || !store.likes) return false
  return store.likes.some(l => String(l.track_id) === String(props.track.id))
})

const handleToggleLike = async () => {
  await store.toggleLikeStatus(props.track)
  emit('closeOptions')
}

const openTags = async () => {
  const modal = await modalController.create({ 
    component: TagModal,
    componentProps: {
      track: props.track
    },
    canDismiss: true,
  })
  await modal.present()
  emit('closeOptions')
}

const openPlaylistSelectModal = async () => {
  const modal = await modalController.create({ 
    component: PlaylistSelectModal,
    componentProps: {
      track: props.track
    },
    canDismiss: true
  })
  await modal.present()
  emit('closeOptions')
}
</script>