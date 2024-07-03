<template>
  <ion-content class="ion-padding">
    <form class="" @submit.prevent="signUpNewUser">
      <div class="ion-padding">
        <div>
          <ion-input type="email" placeholder="Your email" v-model="email" />
          <ion-input type="password" placeholder="Password" v-model="password">
            <!-- <ion-password-toggle slot="end"></ion-password-toggle> -->
          </ion-input>
        </div>
        <div>
          <ion-button expand="block" type="submit"  @click="handleSignIn">Rock the Galaxy</ion-button>
        </div>
      </div>
    </form>
  </ion-content>
</template>
<script setup>
import { IonContent, IonButton, IonInput} from '@ionic/vue'
import { supabase } from '@/utils/database'
import { ref } from 'vue'

const email = ref('')
const password = ref('')

async function signUpNewUser() {
  console.log('email', email.value)
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })
}


</script>