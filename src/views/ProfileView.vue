<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-title>Profile</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="solid" size="small" @click="handleLogout">Logout</ion-button>
        </ion-buttons>
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
              <ion-item>
                <ion-input type="text" name="password" v-model="password" label="New Password"></ion-input>
              </ion-item>
              <ion-item>
                <Avatar :path="profile.avatar_url" @updatePath="newAvatar"></Avatar>
              </ion-item>
            </ion-list>
            <ion-button class="ion-margin-top" expand="block" type="submit">Update Profile</ion-button>
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
  IonButtons,
  IonButton,
  IonContent,
  onIonViewWillEnter
} from '@ionic/vue'
import Loader from '@/components/SpinnerComponent.vue'
import UserAuth from '@/components/user/UserAuth.vue'
import Avatar from '@/components/user/AvatarComponent.vue'

import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { supabase, getProfile } from '@/utils/database'

const isLoading = ref(true)
const mainStore = useMainStore()
const store = useUserStore()
const router = useRouter()
const profile = ref({
  username: '',
  avatar_url: '',
})
const password = ref('')
const isUser = ref(false)

onIonViewWillEnter(async () => {
  isLoading.value = true
  try {
    while(!mainStore.appReady) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    const user = await store.user
    profile.value = await store.profile

    if (!profile.value || !profile.value.username) {
      const p = await getProfile(user)
      profile.value = {
        username: p.username,
        avatar_url: p.avatar_url
      }
      store.setProfile(profile.value)
    }
    if (user) {
      isUser.value = true
    }
  } catch (error) {
    console.error('failed to load profile', error)
  } finally {
    isLoading.value = false
  }
})

const updateProfile = async () => {
  try {
    const user = store.user
    const updates = {
      id: user.id,
      ...profile.value,
      updated_at: new Date(),
    }

    if (password.value) {
      await supabase.auth.updateUser({ password: password.value })
    }

    let { error } = await supabase
      .from('profiles')
      .upsert(updates, {returning: 'minimal'})

    if (error) throw error;

    store.setProfile(updates)
  } catch (error) {
    console.error(error.message);
  }
}

const newAvatar = (fileName) => {
  profile.value.avatar_url = fileName
}

const handleLogout = async () => {
  await supabase.auth.signOut({ scope: 'local' })
  router.push({ name: 'Login' })
}
</script>