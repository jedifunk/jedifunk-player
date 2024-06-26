<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" :fullscreen="true">
      <Loader v-if="isLoading" />
      <div v-else>
        <UserAuth v-if="!isUser" />
        <div v-else>
          <form @submit.prevent="updateProfile">
            <ion-list>
              <ion-item>
                <ion-input type="text" name="username" v-model="profile.username" label="Username"></ion-input>
              </ion-item>
            </ion-list>
            <ion-button expand="block" type="submit">Update Profile</ion-button>
          </form>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonContent,
  onIonViewWillEnter
} from '@ionic/vue'
import Loader from '@/components/SpinnerComponent.vue'
import UserAuth from '@/components/UserAuth.vue'

import { useMainStore } from '@/stores'
import { ref } from 'vue'
import { supabase } from '@/utils/database'

const isLoading = ref(true)
const store = useMainStore()
const profile = ref({
  username: '',
  avatar_url: '',
})
const isUser = ref(false)

onIonViewWillEnter(async () => {
  isLoading.value = true
  try {
    while(!store.appReady) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    const user = await store.user
    getProfile(user)
    if (user) {
      isUser.value = true
    }
  } catch (error) {
    console.error('failed to load profile', error)
  } finally {
    isLoading.value = false
  }
})

async function getProfile(user) {
  isLoading.value = true
  try {
    const { data, error, status } = await supabase
      .from('profiles')
      .select(`username, avatar_url`)
      .eq('id', user.id)
      .single()

    if (error && status !== 406) throw error

    if (data) {
      profile.value = {
        username: data.username,
        avatar_url: data.avatar_url,
      }

    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}


const updateProfile = async () => {
  isLoading.value = true
  try {
    const user = store.user
    const updates = {
      id: user.id,
      ...profile.value,
      updated_at: new Date(),
    }

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