<template>
  <ion-toolbar>
    <ion-title>Tag</ion-title>
    <ion-buttons slot="start">
      <ion-button @click="dismiss">Cancel</ion-button>
    </ion-buttons>
  </ion-toolbar>
  <ion-content>
    <ion-button class="ion-padding" expand="block" @click="openCreateTag">New Tag</ion-button>
    <ion-list lines="none">
      <ion-item v-for="tag in tags" :key="tag.id">
        <ion-checkbox
          :checked="selectionStatus[tag.id]"
          @ionChange="toggleSelectTag(tag.id)"
        >{{ tag.name }}</ion-checkbox>
      </ion-item>
    </ion-list>
    <ion-fab vertical="bottom" horizontal="center">
      <ion-fab-button size="small" @click="dismiss">Done</ion-fab-button>
    </ion-fab>
  </ion-content>
</template>
<script setup>
import {
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonCheckbox,
  IonFab,
  IonFabButton,
  modalController
} from '@ionic/vue'

import { ref, onMounted, watch } from 'vue';
import { useMainStore } from '@/stores/index'

import CreateTagModal from '@/components/CreateTagModal.vue'

const store = useMainStore()
const isLoading = ref(true)
const tags = ref([])
const selectionStatus = ref({})
const props = defineProps({
  track: Object
})

onMounted(async () => {
  isLoading.value = true;
  try {
    tags.value = await store.tags
    tags.value.forEach(tag => {
      const trackInTag = tag.tracks.some(trackInTag => trackInTag !== null && trackInTag.id !== null && trackInTag.id !== undefined && trackInTag.id === Number(props.track.id));
      selectionStatus.value[tag.id] = trackInTag
    });
  } catch (error) {
    console.error('Failed to get filtered tracks:', error);
  } finally {
    isLoading.value = false;
  }
})

watch(() => store.tags, (newTags) => {
  tags.value = newTags
}, {deep: true})

const openCreateTag = async () => {
  const createTagModal = await modalController.create({ 
    component: CreateTagModal,
    componentProps: {
      onClose: () => createTagModal.dismiss()
    },
    breakpoints: [0,.5],
    initialBreakpoint: .5,
    canDismiss: true,
  })
  await createTagModal.present()

  createTagModal.onDidDismiss = ((detail, role) => {
    console.info('create tag modal did dismiss', detail, role)
  })
}

const toggleSelectTag = async (tagId) => {
  const trackAddedOrRemoved = await store.toggleTagged(tagId, props.track)
  selectionStatus.value[tagId] = trackAddedOrRemoved
};

const dismiss = async () => {
  await modalController.dismiss()
}
</script>
<style>
ion-fab-button {
  width: 100px;
  --border-radius: 5px;
  --box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
}
</style>