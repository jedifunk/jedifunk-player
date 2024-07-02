<template>
  <div class="audio" :class="{'active': isActive}">
    <span class="bar bar1"></span>
    <span class="bar bar2"></span>
    <span class="bar bar3"></span>
  </div>
</template>
<script setup>
import { ref, watchEffect, onBeforeUnmount } from 'vue'
import AudioService from '@/utils/audioService'

let audioService = AudioService.getInstance()
const isActive = ref(false)

watchEffect(() => {
  const handler = () => {
    isActive.value = true;
  };

  audioService.addEventListener('progressUpdate', handler);

  return () => {
    audioService.removeEventListener('progressUpdate', handler);
  };
});
</script>
<style>
.audio {
  width: 10px;
  height: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2px;
}

.bar {
  display: inline-block;
  background: var(--ion-color-primary);
  width: .5rem;
  height: 100%;
}
.audio.active .bar {
  animation: up-and-down 1.75s ease-in-out infinite alternate;
}

.audio.active .bar1 {
  height: 60%;
}

.audio.active .bar2 {
  height: 30%;
  animation-delay: -2.4s;
}

.audio.active .bar3 {
  height: 75%;
  animation-delay: -3.7s;
}

@keyframes up-and-down {
  10% {
    height: 30%;
  }
  
  30% {
    height: 100%;
  }
  
  60% {
    height: 50%;
  }
  
  80% {
    height: 75%;
  }
  
  100% {
    height: 20%;
  }
}
</style>