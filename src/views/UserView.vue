<template>
  <ion-page>
    <ion-content>
      <div>{{ store.user.username }}</div>
    </ion-content>
  </ion-page>
</template>
<script setup>
import {
  IonPage,
  IonContent,
} from '@ionic/vue'

import { useMainStore } from '@/stores'

const store = useMainStore()
</script>