<template>
  <ion-app>
    <ion-router-outlet />
    <MiniPlayer v-if="showMiniPlayer" :current-track="currentTrack" />
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { computed, onMounted } from 'vue'
import { useMainStore } from '@/stores/index'
import MiniPlayer from '@/components/MiniPlayer.vue'

const store = useMainStore()
const showMiniPlayer = computed(() => store.showMiniPlayer)
const currentTrack = computed(() => store.startingTrack)

onMounted(() => {
  try {
    store.loadLikedListFromLocalStorage();
    store.loadTaggedDataFromLocalStorage();
  } catch (error) {
    console.error('Error executing method:', error);
  }
})
</script>
