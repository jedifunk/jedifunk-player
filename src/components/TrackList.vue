<template>
  <ion-list class="tracks" lines="none">
    <TrackComponent v-for="track in tracks" :key="track.id" :track="track" :tracks="tracks"/>
  </ion-list>
</template>
<script setup>
import {
  IonList,
} from '@ionic/vue'
import TrackComponent from '@/components/TrackComponent.vue'

const { tracks } = defineProps(['tracks'])

// onMounted(() => {
//   isLoading.value = true
//   console.log(tracks)
// })
</script>