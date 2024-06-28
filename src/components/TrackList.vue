<template>
  <ion-list class="tracks">
    <TrackComponent v-for="track in tracks" :key="track.id" :track="track"/>
  </ion-list>
</template>
<script setup>
import {
  IonList,
} from '@ionic/vue'
import TrackComponent from '@/components/TrackComponent.vue'

import { ref } from 'vue'
import { useMainStore } from '@/stores/index'

const store = useMainStore()
const isLoading = ref(true)
const { tracks } = defineProps(['tracks'])

// onMounted(() => {
//   isLoading.value = true
//   console.log(tracks)
// })
</script>