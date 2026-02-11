<!-- <template>
  <form class="" @submit.prevent="signUpNewUser">
    <div class="ion-padding">
      <h4>Let the force flow through you</h4>
      <div>
        <ion-input type="email" placeholder="Your email" v-model="email" />
        <ion-input type="password" placeholder="Password" v-model="password">
        </ion-input>
      </div>
      <div>
        <ion-button expand="block" type="submit"  @click="handleSignIn">Rock the Galaxy</ion-button>
      </div>
    </div>
  </form>
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


</script> -->
<template>
  <form class="" @submit.prevent="signUpNewUser">
    <div class="ion-padding">
      <h4>Let the force flow through you</h4>
      <div>
        <ion-input type="email" placeholder="Your email" v-model="email" />
        <ion-input type="password" placeholder="Password" v-model="password" />
      </div>
      <div>
        <ion-button expand="block" type="submit" :disabled="isSigningUp">
          {{ isSigningUp ? 'Processing...' : 'Rock the Galaxy' }}
        </ion-button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { IonButton, IonInput, modalController } from '@ionic/vue'
import { supabase } from '@/utils/database'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const isSigningUp = ref(false)

async function signUpNewUser() {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })
  if (!error && data?.user) {
    await modalController.dismiss()
    router.replace('/')
  }
}
</script>