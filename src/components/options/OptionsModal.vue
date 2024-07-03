<template>
  <ion-content class="ion-padding">
    <ion-list lines="none">
      <ion-item detail="false" :button="true" @click="openCreateOrEdit">
        <ion-label>Edit Name</ion-label>
      </ion-item>
      <ion-item>
        <ion-label>Add Color</ion-label>
      </ion-item>
      <ion-item detail="false" :button="true" @click="deleteObject">
        <ion-label>Delete {{ objectType }}</ion-label>
      </ion-item>
    </ion-list>
  </ion-content>
</template>
<script setup>
import { IonContent, IonList, IonItem, IonIcon, IonLabel, modalController } from '@ionic/vue'
import CreateObjectsModal from '@/components/options/CreateObjectsModal.vue'

import { onMounted, ref } from 'vue'
import { useMainStore } from '@/stores'
import { useRouter } from 'vue-router'

const store = useMainStore()
const router = useRouter()
const isLoading = ref(true)
const { objectId, objectType } = defineProps(['objectId', 'objectType'])
const object = ref(null)

onMounted(async () => {
  isLoading.value = true
  try {
    while(!store.appReady) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    switch(objectType) {
      case 'tag':
        object.value = await store.tags.find(tag => tag.id === objectId)
        break
      case 'playlist':
        object.value = await store.playlists.find(playlist => playlist.id === objectId)
        break
    }
    
    if (!object) { console.warn(`no ${objectType} with ID found`)}
  } catch (error) {
    console.error(`Failed to get ${objectType}:`, error);
  } finally {
    isLoading.value = false;
  }
})

const openCreateOrEdit = async () => {  
  const modalInstance = await modalController.create({
    component: CreateObjectsModal,
    componentProps: {
      objectType: objectType,
      objectToEdit: object,
      onClose: () => modalInstance.dismiss(),
    },
    breakpoints: [0,.5],
    initialBreakpoint:.5,
    canDismiss: true,
  });
  await modalInstance.present();

  modalInstance.onDidDismiss = ((detail, role) => {
    console.info('Modal did dismiss', detail, role);
  });
}

const dismiss = async () => {
  await modalController.dismiss()
}

const deleteObject = async () => {
  dismiss()
  if (objectType === 'tag') {
    router.replace({name: 'Tags'})
    await store.deleteTagById(objectId)
  } else {
    router.replace({name: 'Playlists'})
    await store.deletePlaylistById(objectId)
  }
}
</script>