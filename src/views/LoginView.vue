<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="flex column">
        <DeathStar />
        <ion-title><h1 class="app-title">the jedi's funk</h1></ion-title>
        <UserAuth />
        <div>
        <p @click="openSignUp">Or join the darkside</p>
      </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup>
import {
  IonPage,
  IonContent,
  IonTitle,
  IonButton,
  modalController
} from '@ionic/vue'
import UserAuth from '@/components/UserAuth.vue'
import DeathStar from '@/components/DeathStar.vue'
import SignUp from '@/components/SignUp.vue'

const openSignUp = async () => {
  const signupModal = await modalController.create({
    component: SignUp,
  })

  await signupModal.present()
}
</script>
<style>
.app-title {
  color: var(--ion-color-primary);
}
</style>