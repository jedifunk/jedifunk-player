<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="login-wrapper flex">
        <DeathStar />
        <h1 class="app-title">the jedi's funk</h1>
        <UserAuth />
        <div>
        <p @click="openSignUp" class="darkside">Or join the darkside</p>
      </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup>
import {
  IonPage,
  IonContent,
  IonButton,
  modalController
} from '@ionic/vue'
import UserAuth from '@/components/UserAuth.vue'
import DeathStar from '@/components/DeathStar.vue'
import SignUp from '@/components/SignUp.vue'

const openSignUp = async () => {
  const signupModal = await modalController.create({
    component: SignUp,
    breakpoints: [.5, 1],
    initialBreakpoint: .5,
    canDismiss: true
  })

  await signupModal.present()
}
</script>
<style>
.login-wrapper {
  flex-direction: column;
  height: 100%;
  align-items: center;
}
.app-title {
  color: var(--ion-color-primary);
}
.darkside {
  color: var(--ion-color-danger);
}
</style>