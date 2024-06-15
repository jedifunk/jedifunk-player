<template>
  <div class="mini-player">
    <div class="flex">
      <div class="current-track-meta" @click="handleModalSwitch">
        <h6>{{ startingTrack.title }}</h6>
        <p>{{ startingTrack.show_date }} | {{ startingTrack.venue_name }}, {{ startingTrack.venue_location }}</p>
      </div>
      <ion-button fill="clear" size="small" @click="togglePlayPause">
        <ion-icon slot="icon-only" size="small" :icon="store.getters.isPlaying ? pauseOutline : playOutline"></ion-icon>
      </ion-button>
    </div>
    <div class="progress">
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: `${progressBar}%` }"></div> 
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watchEffect } from 'vue'
import { IonButton, IonIcon, modalController } from '@ionic/vue'
import { playOutline, pauseOutline } from 'ionicons/icons'
import { useStore } from 'vuex'
import audioService from '@/utils/audioService'
import Player from '@/components/PlayerComponent.vue'

const store = useStore()
const currentTrack = computed(() => store.getters.currentTrack)
const startingTrack = computed(() => store.getters.startingTrack)
const progressBar = ref(0)
const elapsedTime = ref('00:00')
const remainingTime = ref('00:00')
let ctm = null

onMounted( async() => {
  await nextTick()
  if (audioService) {
    audioService.addEventListener('timeupdate', updateProgress)
  }
  ctm = document.querySelector('.current-track-meta')
  if (ctm) {
    const para = document.querySelector('.current-track-meta p')
    const parentWidth = ctm.clientWidth
    const pWidth = para.scrollWidth
    if (pWidth > parentWidth) {
      para?.classList.add('anim')
    }
  }
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

const updateProgress = () => {
  progressBar.value = (audioService.currentTime / audioService.duration) * 100

  const currentTime = audioService.getCurrentTime(); // Hypothetical method
  const duration = audioService.getDuration();
  
  if (currentTime && duration) {
    progressBar.value = (currentTime / duration) * 100;

    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    elapsedTime.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

    const totalMinutes = Math.floor(duration / 60);
    const totalSeconds = Math.floor(duration % 60);
    const remainingMinutes = totalMinutes - minutes;
    let remainingSeconds = totalSeconds - seconds;

    if (remainingSeconds < 0) {
      remainingSeconds += 60;
    }
    remainingTime.value = `${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
}

const handleModalSwitch = async () => {
  store.dispatch('setShowMiniPlayer', false)
  store.dispatch('setComingFromShow', false)
  const modal = await modalController.create({
    component: Player
  })

  await modal.present()
}
</script>
<style>
.mini-player {
  position: absolute;
  bottom: 50px;
  height: 100%;
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
  margin-bottom: 2px;
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
.mini-player .progress-bar {
  height: 2px;
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