<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <ion-title>{{ store.state.dateParam }}</ion-title>
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
          <div class="progress-bar-container" @mousedown="startScrubbing" @mousemove="scrub" @mouseup="stopScrubbing" @touchstart="startScrubbing" @touchmove.prevent="scrub" @touchend="stopScrubbing">
            <div class="progress-bar" :style="{ width: `${progressBar}%` }"></div> 
            <div class="loading-indicator" :style="{ width: `${isLoadingAudio}%` }"></div>
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
          <ion-button fill="clear" @click="togglePlayPause">
            <ion-icon slot="icon-only" size="large" :icon="store.getters.isPlaying ? pauseOutline : playOutline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" @click="skipForward">
            <ion-icon slot="icon-only" size="large" :icon="playSkipForwardOutline"></ion-icon>
          </ion-button>
        </div>
      </div>
    </div>
  </ion-content>
</template>
<script setup lang="ts">
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

import { ref, onMounted, nextTick, computed } from 'vue'
import { useStore } from 'vuex'
import { chevronDown, playOutline, playSkipBackOutline, playSkipForwardOutline, pauseOutline } from 'ionicons/icons'
import audioService from '@/utils/audioService'

const store = useStore()
const tracklist = computed(() => store.getters.showTracks)
const startingTrack = computed(() => store.getters.startingTrack)
const isLoadingAudio = ref(0)
const progressBar = ref(0)
const elapsedTime = ref('00:00')
const remainingTime = ref('00:00')
const isScrubbing = ref(false)
const currentTrack = computed(() => store.getters.currentTrack)

onMounted(async () => {
  await nextTick()
  
  audioService.setAudioSource(startingTrack.value.mp3)

  audioService.addEventListener('canplaythrough', () => {
    isLoadingAudio.value = 100; // Fully loaded
  })
  audioService.addEventListener('progress', (event) => {
    if (event.lengthComputable) {
      const percentLoaded = Math.round((event.loaded / event.total) * 100);
      isLoadingAudio.value = percentLoaded;
    }
  })
  if (audioService) {
    audioService.addEventListener('timeupdate', updateProgress)
  }
  store.dispatch('playTrack', store.getters.startingTrack)
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

const skipForward = () => {
  const currentIndex = tracklist.value.findIndex(track => track.id === startingTrack.value.id)

  if (currentIndex >= tracklist.value.length - 1) {
    console.log('Already on the last track');
    return;
  }

  // Move to the next track
  startingTrack.value = tracklist.value[currentIndex + 1];

  // Check if formattedDuration is available before setting elapsedTime
  if (startingTrack.value.formattedDuration) {
    elapsedTime.value = startingTrack.value.formattedDuration;
  } else {
    console.warn("Formatted duration is missing for the track.");
    // Optionally, set a default value or handle the missing data appropriately
    elapsedTime.value = '00:00';
  }

  // Update the audio source
  audioService.setAudioSource(startingTrack.value.mp3)
  store.dispatch('setStartingTrack', startingTrack.value.mp3)

  console.log('Skipping forward...', startingTrack.value.title);
}

const skipBackward = () => {
  const currentIndex = tracklist.value.findIndex(track => track.id === startingTrack.value.id);
  if (currentIndex <= 0) {
    console.log('Already on the first track');
    return;
  }

  // Move to the previous track
  startingTrack.value = tracklist.value[currentIndex - 1];

  // Check if formattedDuration is available before setting elapsedTime
  if (startingTrack.value.formattedDuration) {
    elapsedTime.value = startingTrack.value.formattedDuration;
  } else {
    console.warn("Formatted duration is missing for the track.");
    // Optionally, set a default value or handle the missing data appropriately
    elapsedTime.value = '00:00';
  }

  // Update the audio source
  audioService.setAudioSource(startingTrack.value.mp3)
  store.dispatch('setStartingTrack', startingTrack.value.mp3)

  console.log('Skipping backward...', startingTrack.value.title);
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
const startScrubbing = () => {
  isScrubbing.value = true
}

const scrub = (event) => {
  if (!isScrubbing.value) return

  const isTouchEvent = event.type === 'touchmove'
  const target = isTouchEvent? event.targetTouches[0].target : event.currentTarget

  const rect = target.getBoundingClientRect();
  const x = isTouchEvent? event.touches[0].clientX - rect.left : event.clientX - rect.left;
  const percentage = x / rect.width;
  const seekPosition = audioService.duration * percentage;
  audioService.setCurrentTime(seekPosition)
}

const stopScrubbing = () => {
  isScrubbing.value = false
}

const dismiss = async (startingTrack) => {
  await modalController.dismiss()
  store.dispatch('setShowMiniPlayer', true)
}
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
  border-radius: 5px;
  cursor: pointer;
  position: relative;
}
.loading-indicator, .progress-bar {
  height: 10px;
  border-radius: 5px;
  position: absolute;
  top: 0;
  left: 0;
}
.loading-indicator {
  background-color: var(--ion-color-light);
}
.progress-bar {
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
