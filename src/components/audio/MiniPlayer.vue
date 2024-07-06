<template>
  <div class="mini-player">
    <div class="flex">
      <div ref="ctm" class="current-track-meta" @click="handleModalSwitch">
        <h6>{{ currentTrack.title }}</h6>
        <p ref="para" :class="{'anim': anim}">{{ currentTrack.show_date }} • {{ currentTrack.venue_name }}, {{ currentTrack.venue_location }}</p>
      </div>
      <ion-button fill="clear" size="small" @click="togglePlayback">
        <ion-icon slot="icon-only" size="small" :icon="mainStore.isPlaying ? pauseOutline : playOutline"></ion-icon>
      </ion-button>
    </div>
    <div class="progress">
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: `${progressBar}%` }"></div> 
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { IonButton, IonIcon, modalController } from '@ionic/vue'
import { playOutline, pauseOutline } from 'ionicons/icons'
import { useMainStore } from '@/stores/main'
import Player from '@/components/audio/PlayerComponent.vue'
import AudioService from '@/utils/audioService'

let audioService = AudioService.getInstance()

const mainStore = useMainStore()
const tracklist = computed(() => mainStore.Tracks)
const currentTrack = computed(() => mainStore.currentTrack)
const currentTime = ref(0)
const duration = ref(0)
const progressBar = ref(0)
const elapsedTime = ref('00:00')
const remainingTime = ref('00:00')
const newTrackUrl = ref(null)
const ctm = ref(null)
const para = ref(null)
const anim = ref(false)

const normalizedUrl = url => url.toLowerCase().trim()

onMounted( async() => {
  await nextTick()

  if (audioService) {
    audioService.addEventListener('progressUpdate', (data) => {
      currentTime.value = data.currentTime;
      duration.value = data.duration;
      progressBar.value = data.progressBar;
      elapsedTime.value = data.elapsedTime;
      remainingTime.value = data.remainingTime;
    })
    audioService.addEventListener('trackChanged', (data) => trackChanged(data))
  }
  await new Promise(resolve => setTimeout(resolve, 100));
  animate()
})

const togglePlayback = () => {
  audioService.togglePlayPause()
  mainStore.setIsPlaying(mainStore.isPlaying =! mainStore.isPlaying)
}

const trackChanged = (track) => {
  newTrackUrl.value = track.trackUrl
  // Find the index of the track with the matching mp3 URL
  const trackIndex = tracklist.value.findIndex(track => normalizedUrl(track.mp3) === newTrackUrl.value);
  
  // If a matching track is found, retrieve the track object
  if (trackIndex!== -1) {
    const matchedTrack = tracklist.value[trackIndex];
    mainStore.setCurrentTrack(matchedTrack)
  } else {
    console.warn("No matching track found.");
  }
}

const handleModalSwitch = async () => {
  mainStore.setShowMiniPlayer(false)
  mainStore.setComingFrom('miniplayer')
  const modal = await modalController.create({
    component: Player
  })

  await modal.present()
}

const animate = () => {
  if (para.value.scrollWidth > ctm.value.clientWidth) {
    anim.value = true
  }
}

onUnmounted(() => {
  audioService.removeEventListener('progressUpdate')
  audioService.removeEventListener('trackChanged')
})
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
  animation: backAndForth 15s ease-in-out infinite;
}
.mini-player .progress-bar-container {
  height: 2px;
}
@keyframes backAndForth {
  0%, 100% { transform: translateX(0); }
  10%, 90% { transform: translateX(0); }
  50% { transform: translateX(calc(-100% + 200px)); }
}
</style>