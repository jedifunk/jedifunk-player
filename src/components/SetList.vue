<template>
  <div v-for="(tracks, setName) in groupedTracks" :key="setName">
    <h4 class="set-title ion-padding-start">{{ setName }}</h4>
    <ion-list class="tracks" lines="none">
      <TrackComponent v-for="track in tracks" :key="track.id" :track="track" :tracks="tracks" :show="true" @click="openPlayer(track)" />
    </ion-list>
  </div>
</template>
<script setup>
import {
  IonList,
} from '@ionic/vue'
import TrackComponent from '@/components/TrackComponent.vue'
const { groupedTracks } = defineProps(['groupedTracks'])
</script>
<style>
.item {
  --inner-padding: 0;
}
</style>