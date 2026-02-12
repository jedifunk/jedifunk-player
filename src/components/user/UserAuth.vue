<template>
  <form @submit.prevent="handleSignIn">
    <ion-list>
      <ion-item lines="full">
        <ion-input label="Email" label-placement="stacked" type="email" v-model="email" />
      </ion-item>
      <ion-item lines="full">
        <ion-input label="Password" label-placement="stacked" type="password" v-model="password">
          <ion-input-password-toggle slot="end"></ion-input-password-toggle>
        </ion-input>
      </ion-item>
    </ion-list>
    <ion-button class="ion-margin-top" expand="block" type="submit" :disabled="isLoading">
      {{ isLoading ? 'Entering Hyperspace...' : 'Login' }}
    </ion-button>
  </form>
</template>

<script setup>
import { IonInput, IonInputPasswordToggle, IonButton, IonItem, IonList } from '@ionic/vue'
import { ref } from 'vue'
import { supabase } from '@/utils/database'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)
const email = ref('')
const password = ref('')

const handleSignIn = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (!error) router.replace('/')
}
</script>