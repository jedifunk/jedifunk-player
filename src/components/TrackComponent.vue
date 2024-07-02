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
          <div class="track-meta flex column" ref="tm">
            <ion-label :class="{'playing': tracksMatch}">
              <Playing v-if="tracksMatch" />
              {{ track.title }}
            </ion-label>
            <p v-if="!show" ref="p" :class="{ 'anim': shouldAnimate }">{{ track.show_date }} | {{ track.venue_name }}, {{ track.venue_location }}</p>
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
import Player from '@/components/PlayerComponent.vue'
import TrackOptions from '@/components/TrackOptions.vue'
import Playing from '@/components/PlayingAnim.vue'
import { musicalNote } from 'ionicons/icons'

import { onMounted, nextTick, ref, computed, watchEffect } from 'vue';
import { useMainStore } from '@/stores'
import { formatDuration } from '@/utils/helpers'
import { useElementSize, useElementBounding } from '@vueuse/core'

const store = useMainStore()
const { show, tracks, track } = defineProps(['track', 'show', 'tracks'])
const tm = ref()
const p = ref()
const currentTrack = computed(() => store.currentTrack)
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
  tracksMatch.value = currentTrack.value.id === track.id
})

const shouldAnimate = () => {
  setTimeout(() => {
    console.log('p', p.value.scrollWidth, 'tm', tm.value.clientWidth, 'outcome', p.value.scrollWidth > tm.value.clientWidth)
    return p.value.scrollWidth > tm.value.clientWidth
  }, 200)
};

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
p.anim {
  animation: backAndForth 15s linear infinite;
}
.track .playing {
  display: flex;
  align-items: center;
  color: var(--ion-color-primary);
  gap: 5px;
}

@keyframes backAndForth {
  0% { transform: translateX(0); }
  10% { transform: translateX(0); }
  45% { transform: translateX(calc(-100% + 200px)); }
  55% { transform: translateX(calc(-100% + 200px)); }
  90% { transform: translateX(0); }
  100% { transform: translateX(0); }
}
</style>