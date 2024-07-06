<template>
  <ion-list class="tracks" lines="none">
    <TrackComponent v-for="track in props.tracks" :key="track.id" :track="track" :tracklist="props.tracks"/>
  </ion-list>
</template>
<script setup>
import {
  IonList,
} from '@ionic/vue'
import TrackComponent from '@/components/tracks/TrackComponent.vue'

const props = defineProps({tracks: Array})
</script>