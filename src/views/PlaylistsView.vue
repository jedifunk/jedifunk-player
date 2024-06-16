<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Playlists</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>

    </ion-content>
  </ion-page>
</template>
<script setup>
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue'

onIonViewWillEnter(() => {
  console.log('playlists ion initialize')
})

onIonViewWillLeave(() => {
  console.log('playlists ion destoryed')
})
</script>