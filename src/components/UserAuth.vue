<template>
  <form class="" @submit.prevent="handleLogin">
    <div class="ion-padding">
      <div>
        <ion-input type="email" placeholder="Your email" v-model="email" />
        <ion-input type="password" placeholder="Password" v-model="password">
          <!-- <ion-password-toggle slot="end"></ion-password-toggle> -->
        </ion-input>
      </div>
      <div>
        <ion-button expand="block" type="submit"  @click="handleSignIn">Login</ion-button>
      </div>
    </div>
  </form>
</template>
<script setup>
import { IonInput, IonButton } from '@ionic/vue'
import { ref } from 'vue'
import { supabase } from '@/utils/database'

const isLoading = ref(true)
const email = ref('')
const password = ref('')

const handleSignIn = async () => {
  try {
    isLoading.value = true
    const { error } = await supabase.auth.signInWithOtp({ email: email.value })
    if (error) throw error
      alert('Check your email for the login link!')
  } catch (error) {
    alert(error.error_description || error.message)
  } finally {
    isLoading.value = false
  }
}

async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
}

</script>