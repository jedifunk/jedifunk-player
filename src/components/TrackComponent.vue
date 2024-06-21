<template>
  <ion-item :button="true" :detail="false">
    <ion-label class="track">
      <div class="flex">
        <div class="track-meta flex column" ref="tm">
          <div :class="{'playing': tracksMatch}">
            <ion-icon v-if="tracksMatch" :icon="barcodeOutline"></ion-icon>
            {{ track.title }}</div>
          <p v-if="!show">{{ track.show_date }} | {{ track.venue_name }}, {{ track.venue_location }}</p>
        </div>
        <div>{{ track.formattedDuration }}</div>
      </div>
    </ion-label>
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
const currentTrack = computed(() => store.currentTrack)
const tracksMatch = ref(false)

onMounted(async () => {
  await nextTick()

  if (!show) {
    const para = tm.value.querySelector('p')
    const parentWidth = tm.value.clientWidth
    const pWidth = para.scrollWidth
    //console.log('p:', para, 'parent:', parentWidth, 'pw:', pWidth)
    if (pWidth > parentWidth) {
      para?.classList.add('anim')
    }
  }
})

watchEffect(() => {
  tracksMatch.value = currentTrack.value.id === track.id
})
</script>
<style>
.track > .flex {
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
.track-meta {
  max-width: 75%;
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