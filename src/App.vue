<template>
  <ion-app>
    <ion-router-outlet />
    <MiniPlayer v-if="showMiniPlayer" :current-track="currentTrack" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
//import { defineComponent } from 'vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import MiniPlayer from '@/components/MiniPlayer.vue'

const store = useStore()
const showMiniPlayer = computed(() => store.getters.showMiniPlayer)
const currentTrack = computed(() => store.getters.startingTrack)
</script>
