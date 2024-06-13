<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Options</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>

    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
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
  console.log('settings ion initialize')
})

onIonViewWillLeave(() => {
  console.log('settings ion destoryed')
})
</script>