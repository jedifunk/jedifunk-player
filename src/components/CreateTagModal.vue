<template>
  <ion-content class="create-tag">
    <div class="flex column ion-padding">
      <h3>Give your tag a name</h3>
      <ion-input 
        v-model="tagName"
        aria-label="Tag"
        :class="{ 'ion-invalid': nameExists }"
        :value="tagName"
        error-text="Name already taken"
        @ionInput="checkNameUniqueness"
        @ionBlur="checkNameUniqueness"
      ></ion-input>
      <ion-button :disabled="!isValidName" @click="createTag">Create Tag</ion-button>
    </div>
  </ion-content>
</template>
<script setup>
import {
  IonContent,
  IonInput,
  IonButton
} from '@ionic/vue'

import { ref, onMounted, watchEffect } from 'vue'
import { useMainStore } from '@/stores'

const store = useMainStore()
const tagName = ref('Sick Tag')
const isValidName = ref(true)
const nameExists = ref(false)

const props = defineProps({
  onClose: Function
})

onMounted(() => {
  
  setTimeout(() => {
    const inputElement = document.querySelector('#ion-input-0');

    if (inputElement) {
      inputElement.focus()
      inputElement.select()
    }
  }, 100);
})

const checkNameUniqueness = () => {
  const nameLowercase = tagName.value.toLowerCase()
  const existingTag = store.tags.find(tag => tag.name.toLowerCase() === nameLowercase)
  if (existingTag) {
    nameExists.value = true
  } else {
    nameExists.value = false
  }
}

watchEffect(() => {
  isValidName.value = true
  nameExists.value = false
  if (tagName.value.trim()) {
    checkNameUniqueness()
    isValidName.value = !nameExists.value
  } else {
    isValidName.value = false
  }
})

const createTag = () => {
  // check if name is taken
  if (!isValidName.value) return

  // Convert the tag name to URL path friendly format
  const pathname = tagName.value.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Create the tag object with the new ID
  const newTag = {
    name: tagName.value,
    pathname: pathname,
  };

  // Update the store with the new tag
  store.addTag(newTag);

  // Optionally, reset the tagName after creation
  tagName.value = 'Sick Tag'
  props.onClose()
}
</script>
<style>
.create-tag .flex.column {
  justify-content: flex-start;
  align-items: center;
}
ion-input {
  text-align: center;
}
</style>