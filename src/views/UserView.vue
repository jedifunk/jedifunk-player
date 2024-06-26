<template>
  <ion-page>
    <ion-content>
      <div>{{ user.username }}</div>
    </ion-content>
  </ion-page>
</template>
<script setup>
import {
  IonPage,
  IonContent,
} from '@ionic/vue'

const user = JSON.parse(localStorage.getItem('user'))
</script>