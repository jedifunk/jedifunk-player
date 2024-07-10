<template>
  <form class="" @submit.prevent="handleLogin">
    <ion-list>
      <ion-item>
        <ion-input type="email" placeholder="Your email" v-model="email" />
      </ion-item>
      <ion-item>
        <ion-input type="password" placeholder="Password" v-model="password">
          <ion-input-password-toggle slot="end"></ion-input-password-toggle>
        </ion-input>
      </ion-item>
    </ion-list>
    <ion-button class="ion-margin-top ion-padding" expand="block" type="submit"  @click="handleSignIn">Login</ion-button>
  </form>
</template>
<script setup>
import { IonInput, IonInputPasswordToggle, IonButton, IonItem, IonList } from '@ionic/vue'
import { ref } from 'vue'
import { supabase } from '@/utils/database'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const isLoading = ref(true)
const email = ref('')
const password = ref('')

const handleSignIn = async () => {
  try {
    isLoading.value = true
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    userStore.setUser(data.user)
    router.replace('/')

  } catch (error) {
    alert(error.error_description || error.message)
  } finally {
    isLoading.value = false
  }
}

</script>