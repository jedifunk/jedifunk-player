<template>
  <div v-for="(tracks, setName) in props.groupedTracks" :key="setName">
    <h4 class="set-title ion-padding-start">{{ setName }}</h4>
    <ion-list class="tracks" lines="none">
      <TrackComponent v-for="track in tracks" :key="track.id" :track="track" :tracklist="props.tracks" :show="true"/>
    </ion-list>
  </div>
</template>
<script setup>
import {
  IonList,
} from '@ionic/vue'
import TrackComponent from '@/components/tracks/TrackComponent.vue'

const props = defineProps({
  groupedTracks: Object,
  tracks: Array
})
</script>
<style>
.item {
  --inner-padding: 0;
}
</style>