<template>
  <div class="avatar">
    <Loader v-if="isLoading" />
    <div class="avatar_wrapper" @click="uploadAvatar">
      <img v-if="avatarUrl" :src="avatarUrl" />
      <ion-icon v-else :icon="person" class="no-avatar"></ion-icon>
    </div>
  </div>
</template>
<script setup>
import { IonIcon } from '@ionic/vue'
import Loader from '@/components/SpinnerComponent.vue'
import { person } from 'ionicons/icons'

import { ref, toRefs, watch, onMounted } from 'vue'
import { supabase } from '@/utils/database'
import { useUserStore } from '@/stores/user'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

const store = useUserStore()
const props = defineProps(['path'])
const emit = defineEmits(['upload', 'updatePath'])
const { path } = toRefs(props)
const avatarUrl = ref('')
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  try {
    avatarUrl.value = await store.avatar
    if(!avatarUrl.value && path.value) {
      await downloadImage()
    }
    isLoading.value = false
  } catch (error) {
    console.error('failed to load image', error)
  }
})
const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage
      .from('avatars')
      .download(path.value)
    if (error) throw error;
    if (data) { // Check if data is truthy
      avatarUrl.value = URL.createObjectURL(data);
      store.setAvatar(avatarUrl.value)
    } else {
      console.error('No data received from download');
    }
  } catch (error) {
    console.error('Error downloading image: ', error.message);
  }
}

const uploadAvatar = async () => {
  try {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      quality: 10,
      width: 200,
      source: CameraSource.Photos
    })
    if (photo.dataUrl) {
      const file = await fetch(photo.dataUrl)
        .then((res) => res.blob())
        .then((blob) => new File([blob], 'my-file', { type: `image/${photo.format}` }))

      const fileName = `${Math.random()}-${new Date().getTime()}.${photo.format}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)
      if (uploadError) {
        throw uploadError
      }
      emit('updatePath', fileName)
      emit('upload')
    }
  } catch (error) {
    console.log(error)
  }
}

watch(path, () => {
  console.log('watch')
  if (path.value) downloadImage()
})
</script>
<style>
  .avatar {
    display: block;
    margin: auto;
    min-height: 150px;
  }
  .avatar .avatar_wrapper {
    margin: 16px auto 16px;
    border-radius: 50%;
    overflow: hidden;
    height: 150px;
    aspect-ratio: 1;
    background: var(--ion-color-step-50);
    border: thick solid var(--ion-color-step-200);
  }
  .avatar .avatar_wrapper:hover {
    cursor: pointer;
  }
  .avatar .avatar_wrapper ion-icon.no-avatar {
    width: 100%;
    height: 115%;
  }
  .avatar img {
    display: block;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
</style>