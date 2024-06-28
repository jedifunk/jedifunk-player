<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tags</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="loading" v-if="isLoading">
        <ion-spinner name="dots"></ion-spinner>
      </div>
      <ion-list v-else>
        <ion-item-sliding v-for="tag in tags" :key="tag.id">
          <ion-item :button="true" @click="handleSelectedTag(tag.pathname)">
            <ion-label>{{ tag.name }}</ion-label>
          </ion-item>

          <ion-item-options>
            <ion-item-option color="danger">
              <ion-icon slot="icon-only" :icon="trashOutline" @click="deleteTag(tag.id)"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
      
    </ion-content>
  </ion-page>
</template>
<script setup>
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonSpinner,
  IonIcon,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue'

import { trashOutline } from 'ionicons/icons'

import { ref, watch } from 'vue'
import { useMainStore } from '@/stores/index'
import { useRouter } from 'vue-router'

const store = useMainStore()
const router = useRouter()
const isLoading = ref(true)
const tags = ref([])

onIonViewWillEnter(async () => {
  isLoading.value = true
  try {
    tags.value = store.tags
  } catch (error) {
    console.error('Failed to get tags', error)
  } finally {
    isLoading.value = false
  }
})

watch(() => store.tags, (newTags, oldTags) => {
  tags.value = newTags
})

const deleteTag = async (tagId) => {
  await store.deleteTagById(tagId)
}

const handleSelectedTag = (pathname) => {
  router.push({ name: 'Single Tag', params: { tag: pathname } })
}

onIonViewWillLeave(() => {
  console.log('tags ion will leave')
})
</script>
<style>
</style>