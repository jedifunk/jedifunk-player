<template>
  <ion-item-sliding ref="sliding">
    <ion-item :button="true" :detail="false" @click="openPlayer(track)">
      <div class="track flex"> 
        <div class="track-inner flex">
          <div class="track-art">
            <div class="">
              <ion-icon :icon="musicalNote"></ion-icon>
            </div>
          </div>
          <div class="track-meta flex column">
            <ion-label :class="{'playing': tracksMatch}">
              <Playing v-if="tracksMatch" />
              {{ track.title }}
            </ion-label>
            <p v-if="!show">{{ track.show_date }} • {{ track.venue_location }}</p>
          </div>
        </div>
        <div>{{ formatDuration(track.duration) }}</div>
      </div>
    </ion-item>
    <TrackOptions :track="track" @closeOptions="closeOptions" />
  </ion-item-sliding>
</template>
<script setup>
import {
  IonItem,
  IonLabel,
  IonItemSliding,
  IonIcon,
  modalController
} from '@ionic/vue'
import Player from '@/components/audio/PlayerComponent.vue'
import TrackOptions from '@/components/tracks/TrackOptions.vue'
import Playing from '@/components/tracks/PlayingAnim.vue'
import { musicalNote } from 'ionicons/icons'

import { onMounted, nextTick, ref, toRefs, computed, watchEffect } from 'vue';
import { useMainStore } from '@/stores/main'
import { formatDuration } from '@/utils/helpers'

const mainStore = useMainStore()
const props = defineProps({
  track: Object,
  show: Boolean,
  tracklist: Array
})
const { track, show, tracklist } = toRefs(props)
const currentTrack = computed(() => mainStore.currentTrack)
const tracksMatch = ref(false)
const isLoading = ref(true)
const sliding = ref(null)

onMounted(async () => {
  isLoading.value = true;
  try {
    await nextTick()
  } catch (error) {
    console.error('Failed:', error);
  } finally {
    isLoading.value = false;
  }
})

watchEffect(() => {
  tracksMatch.value = currentTrack.value.id === props.track.id
})

const openPlayer = async (track) => {
  // set tracks for use in player tracklist
  mainStore.setTracks(tracklist.value)

  // set the selected track clicked
  mainStore.setCurrentTrack(track)
  mainStore.setComingFrom(show.value ? 'show' : 'other')

  const modal = await modalController.create({
    component: Player,
  })

  await modal.present()
}
const closeOptions = () => {
  sliding.value.$el.closeOpened()
}
</script>
<style>
.track {
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin: 10px auto;
}
.track-inner {
  gap: 1rem;
  align-items: center;
  max-width: calc(100% - 75px);
}
.track-art div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: var(--ion-color-primary);
  border-radius: 5px;
}
.track-art ion-icon {
  fill: black;
}
.track-meta {
  overflow-x: hidden;
}
.track-meta p {
  margin: 0;
  font-size: 12px;
  white-space: nowrap;
}
.track .playing {
  display: flex;
  align-items: center;
  color: var(--ion-color-primary);
  gap: 5px;
}
</style>