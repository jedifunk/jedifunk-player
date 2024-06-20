<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <ion-title>{{ store.dateParam }}</ion-title>
      <ion-buttons slot="start">
        <ion-button @click="dismiss(startingTrack)">
          <ion-icon slot="icon-only" :icon="chevronDown"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <div class="wrapper flex column">
      <div class="album-art">
        <div>
          <img src="@/assets/album.jpg" />
        </div>
      </div>
      <div class="flex column">
        <div class="track-details">
          <div class="track-header flex">
            <h2>{{ startingTrack.title }}</h2>
            <h6>{{ startingTrack.formattedDuration }}</h6>
          </div>
          <div class="track-meta">
            {{ startingTrack.show_date }} | {{ startingTrack.venue_name }}, {{ startingTrack.venue_location }}
          </div>
        </div>
        <div class="progress">
          <div class="progress-bar-container" @mousedown="audioService.startScrubbing" @mousemove="audioService.scrub" @mouseup="audioService.stopScrubbing" @touchstart="audioService.startScrubbing" @touchmove.prevent="audioService.scrub" @touchend="audioService.stopScrubbing">
            <div class="progress-bar" :style="{ width: `${progressBar}%` }"></div> 
          </div>
          <div class="pb-time flex">
            <div class="pb-current">{{ elapsedTime }}</div>
            <div class="pb-remaining">{{ remainingTime }}</div>
          </div>
        </div>
        <div class="controls">
          <ion-button fill="clear" @click="skipBackward">
            <ion-icon slot="icon-only" size="large" :icon="playSkipBackOutline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" @click="togglePlayback">
            <ion-icon slot="icon-only" size="large" :icon="store.isPlaying ? pauseOutline : playOutline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" @click="skipForward">
            <ion-icon slot="icon-only" size="large" :icon="playSkipForwardOutline"></ion-icon>
          </ion-button>
        </div>
      </div>
    </div>
  </ion-content>
</template>
<script setup>
import {  
  IonHeader,
  IonToolbar,
  IonButton,
  IonButtons,
  IonTitle,
  IonIcon,
  IonContent,
  modalController
} from '@ionic/vue'

import { ref, onMounted, nextTick, computed, onUnmounted } from 'vue'
import { useMainStore } from '@/stores/index'
import { chevronDown, playOutline, playSkipBackOutline, playSkipForwardOutline, pauseOutline } from 'ionicons/icons'
import AudioService from '@/utils/audioService'

let audioService = AudioService.getInstance()

const store = useMainStore()
const tracklist = computed(() => store.showTracks)
const startingTrack = computed(() => store.startingTrack)
const newTrackUrl = ref(null)
const progressBar = ref(0)
const currentTime = ref(0)
const duration = ref(0)
const elapsedTime = ref('00:00')
const remainingTime = ref('00:00')
const comingFromShow = computed(() => store.comingFromShow)

const normalizedUrl = url => url.toLowerCase().trim()

onMounted(async () => {
  await nextTick()

  // Determine the starting track based on whether we're coming from a show
  let startingTrackNormalizedMp3 = ''

  if (comingFromShow.value) {
    const tUrls = tracklist.value.map(track => track.mp3)
    audioService.setTracks(tUrls)
    audioService.initPlayer()
    startingTrackNormalizedMp3 = normalizedUrl(startingTrack.value.mp3 || '');

    if (startingTrackNormalizedMp3) {
      const trackIndex = audioService.tracks.findIndex(track => normalizedUrl(track) === startingTrackNormalizedMp3);
      if (trackIndex!== -1) {
        audioService.gotoTrack(trackIndex, true);
        store.setIsPlaying(true);
      }
    }
  }

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
})

const trackChanged = (track) => {
  newTrackUrl.value = track.trackUrl
  // Find the index of the track with the matching mp3 URL
  const trackIndex = tracklist.value.findIndex(track => normalizedUrl(track.mp3) === newTrackUrl.value);
  
  // If a matching track is found, retrieve the track object
  if (trackIndex!== -1) {
    const matchedTrack = tracklist.value[trackIndex];
    store.updateStartingTrack(matchedTrack)
  } else {
    console.log("No matching track found.");
  }
}

const togglePlayback = () => {
  audioService.togglePlayPause()
  store.setIsPlaying(store.isPlaying =! store.isPlaying)
}

const skipForward = () => {
  audioService.playNext();
}

const skipBackward = () => {
  audioService.playPrevious();
}

const dismiss = async () => {
  await modalController.dismiss()
  store.setShowMiniPlayer(true)
}
onUnmounted(() => {
  audioService.removeEventListener('progressUpdate')
  audioService.removeEventListener('trackChanged', (data) => trackChanged(data))
})
</script>
<style>
.toolbar-background {
  background: transparent;
}
.wrapper {
  width: 100%;
  padding: 1rem;
}
.flex {
  display: flex;
}
.column {
  flex-direction: column;
  height: 100%;
  justify-content: space-around;
}
.album-art img {
  border-radius: 5px;
}
.track-header {
  justify-content: space-between;
  align-items: center;
}
.progress {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.progress-bar-container {
  width: 100%;
  height: 10px;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  background-color: var(--ion-color-light);
}
.progress-bar {
  height: 100%;
  border-radius: 5px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--ion-color-primary);
  z-index: 1;
}
.pb-time {
  font-size: 12px;
  justify-content: space-between;
}
.controls {
  display: flex;
  justify-content: space-around;
}
audio {
  display: none;
}
</style>
