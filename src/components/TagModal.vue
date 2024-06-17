<template>
  <ion-content>
    <ion-list>
      <ion-list-header>
        <ion-title>Tags</ion-title>
      </ion-list-header>
      <ion-item v-for="tag in tags" :key="tag.id" class="tag-item">
        <ion-checkbox :checked="store.getIsTagged(props.track.id, tag.id)" @click="selectTag(tag)"><span>{{ tag.emoji }}</span> {{ tag.name }}</ion-checkbox>
      </ion-item>
    </ion-list>
    <ion-button @click="dismiss" size="small" expand="block">Close</ion-button>
  </ion-content>
</template>
<script setup>
import {
  IonContent,
  IonList,
  IonListHeader,
  IonTitle,
  IonItem,
  IonCheckbox,
  IonButton,
  modalController
} from '@ionic/vue'

import { ref } from 'vue'
import { useMainStore } from '@/stores'
import { tags } from '@/utils/helpers'

const store = useMainStore()
const selectedTags = ref([])
const props = defineProps({
  track: Object
})

const selectTag = (tag) => {
  selectedTags.value.push(tag)
  store.addTag(tag, props.track)
}

const dismiss = async () => {
  await modalController.dismiss()
}
</script>
<style>
.tag-item span {
  font-size: 21px;
}
</style>