<template>
  <ion-content :fullscreen="true">
    <form @submit.prevent="updateProfile">
      <ion-list>
        <ion-item>
          <ion-input type="text" name="username" v-model="profile.username" label="Username"></ion-input>
        </ion-item>
      </ion-list>
      <ion-button expand="block" type="submit">Update Profile</ion-button>
    </form>
  </ion-content>
</template>
<script setup>
import {
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonButton
} from '@ionic/vue'

import { ref } from 'vue'
import { supabase } from '@/utils/database'

const isLoading = ref(true)
const profile = ref({})

const updateProfile = async () => {
  isLoading.value = true
  try {
    // const {data: {user}} = supabase.auth.getUser()
    const updates = {
      id: profile.value.id,
      ...profile.value,
      updated_at: new Date(),
    };

    let { error } = await supabase
      .from('profiles')
      .upsert(updates, {returning: 'minimal'})

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    isLoading.value = false
  }
}
</script>