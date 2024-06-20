<template>
  <div class="mini-player">
    <div class="flex">
      <div class="current-track-meta" @click="handleModalSwitch">
        <h6>{{ currentTrack.title }}</h6>
        <p>{{ currentTrack.show_date }} | {{ currentTrack.venue_name }}, {{ currentTrack.venue_location }}</p>
      </div>
      <ion-button fill="clear" size="small" @click="togglePlayback">
        <ion-icon slot="icon-only" size="small" :icon="store.isPlaying ? pauseOutline : playOutline"></ion-icon>
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
import { useMainStore } from '@/stores/index'
import Player from '@/components/PlayerComponent.vue'
import AudioService from '@/utils/audioService'

let audioService = AudioService.getInstance()

const store = useMainStore()
const tracklist = computed(() => store.Tracks)
const currentTrack = computed(() => store.currentTrack)
const currentTime = ref(0)
const duration = ref(0)
const progressBar = ref(0)
const elapsedTime = ref('00:00')
const remainingTime = ref('00:00')
const newTrackUrl = ref(null)
let ctm = null

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

const togglePlayback = () => {
  audioService.togglePlayPause()
  store.setIsPlaying(store.isPlaying =! store.isPlaying)
}

const trackChanged = (track) => {
  newTrackUrl.value = track.trackUrl
  // Find the index of the track with the matching mp3 URL
  const trackIndex = tracklist.value.findIndex(track => normalizedUrl(track.mp3) === newTrackUrl.value);
  
  // If a matching track is found, retrieve the track object
  if (trackIndex!== -1) {
    const matchedTrack = tracklist.value[trackIndex];
    store.setCurrentTrack(matchedTrack)
  } else {
    console.log("No matching track found.");
  }
}

const handleModalSwitch = async () => {
  store.setShowMiniPlayer(false)
  store.setComingFrom('miniplayer')
  const modal = await modalController.create({
    component: Player
  })

  await modal.present()
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
  animation: backAndForth 15s linear infinite;
}
.mini-player .progress-bar-container {
  height: 2px;
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