<template>
  <ion-item :button="true" :detail="false">
    <div class="track flex">
      <div class="track-meta flex column" ref="tm">
        <ion-label :class="{'playing': tracksMatch}">
          <ion-icon v-if="tracksMatch" :icon="barcodeOutline"></ion-icon>
          {{ track.title }}
        </ion-label>
        <p v-if="!show" ref="p">{{ track.show_date }} | {{ track.venue_name }}, {{ track.venue_location }}</p>
      </div>
      <div>{{ track.formattedDuration }}</div>
    </div>
  </ion-item>
</template>
<script setup>
import {
  IonItem,
  IonLabel,
  IonIcon
} from '@ionic/vue'
import { onMounted, nextTick, ref, computed, watchEffect } from 'vue';
import { useMainStore } from '@/stores'
import { barcodeOutline } from 'ionicons/icons';

const store = useMainStore()
const { show, track } = defineProps(['track', 'show'])
const tm = ref(null)
const p = ref(null)
const currentTrack = computed(() => store.currentTrack)
const tracksMatch = ref(false)
const isLoading = ref(true)

const animate = computed(() => {
  if (tm.value && p.value ) {
    animate.value = p.value.scrollWidth > tm.value.clientWidth
  }
  return animate
})

onMounted(async () => {
  isLoading.value = true;
  try {
    await nextTick()
  } catch (error) {
    console.error('Failed to get filtered tracks:', error);
  } finally {
    isLoading.value = false;
  }
})

watchEffect(() => {
  tracksMatch.value = currentTrack.value.id === track.id
})

</script>
<style>
.track {
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin: 10px auto;
}
.track-meta {
  max-width: calc(100% - 75px);
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
.playing {
  display: flex;
  align-items: center;
  color: var(--ion-color-primary);
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