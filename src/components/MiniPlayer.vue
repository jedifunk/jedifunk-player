<template>
  <div class="mini-player">
    <div class="flex">
      <div ref="ctm" class="current-track-meta">
        <h6>{{ currentTrack.title }}</h6>
        <p :class="{ 'anim': tO}">{{ currentTrack.show_date }} | {{ currentTrack.venue_name }}, {{ currentTrack.venue_location }}</p>
      </div>
      <ion-button fill="clear" size="small" @click="togglePlayPause">
        <ion-icon slot="icon-only" size="small" :icon="store.getters.isPlaying ? pauseOutline : playOutline"></ion-icon>
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watchEffect } from 'vue'
import { IonButton, IonIcon } from '@ionic/vue'
import { playOutline, pauseOutline } from 'ionicons/icons'
import { useStore } from 'vuex'
import audioService from '@/utils/audioService'

const store = useStore()
const currentTrack = computed(() => store.getters.currentTrack)
const ctm = ref(null)

watchEffect(async () => {
  await nextTick()
  if (ctm.value) {
    const para = ctm.value.querySelector('.current-track-meta p')
    const parentWidth = ctm.value.clientWidth
    const pWidth = para.scrollWidth

    if (pWidth > parentWidth) {
      ctm.value.classList.add('text-over')
    } else {
      ctm.value.classList.remove('text-over')
    }
  }
})

const tO = computed(() => {
  if (!ctm.value || !ctm.value?.classList.contains('text-over')) return false
  return true
})

const togglePlayPause = () => {
  if (store.getters.isPlaying) {
    audioService.pause()
    store.dispatch('pauseTrack')
  } else {
    audioService.play()
    store.dispatch('playTrack', currentTrack.value)
  }
}
</script>
<style>
.mini-player {
  position: absolute;
  bottom: 50px;
  max-height: 50px;
  width: calc(100% - 10px);
  background: rgba(0,0,0,.86);
  border: 0px transparent;
  border-radius: 5px;
  padding: 5px 5px 5px 10px;
  margin: 5px;
  z-index: 1000;
}
.mini-player .flex {
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.current-track-meta {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}
.current-track-meta h6 {
  font-size: 13px;
  margin: 0;
}
.current-track-meta p {
  margin: 0;
  font-size: 12px;
  white-space: nowrap;
}
p.anim {
  animation: backAndForth 15s linear infinite;
}
audio {
  display: none;
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