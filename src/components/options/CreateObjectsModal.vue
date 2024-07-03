<template>
  <ion-content :class="`${objectType} create-object`">
    <div class="flex column ion-padding">
      <h3>{{ isEditing ? 'Edit ' + objectType : 'Create a new ' + objectType }}</h3>
      <ion-input 
        v-model="objectName"
        aria-label="Object Name"
        :class="{ 'ion-invalid': nameExists || isEditing && !isObjectNameValid }"
        :value="objectName"
        error-text="Name already taken"
        @ionInput="checkNameUniqueness"
        @ionBlur="checkNameUniqueness"
      ></ion-input>
      <ion-button :disabled="!isValidName || isEditing &&!isObjectNameValid" @click="saveObject">{{ isEditing? 'Update ' + objectType : 'Create ' + objectType }}</ion-button>
    </div>
  </ion-content>
</template>

<script setup>
import {
  IonContent,
  IonInput,
  IonButton,
  modalController
} from '@ionic/vue'

import { ref, onMounted, watchEffect } from 'vue';
import { useMainStore } from '@/stores';

const store = useMainStore();
const objectName = ref('');
const isValidName = ref(true);
const nameExists = ref(false);
const isEditing = ref(false);
const originalObjectName = ref('')
const isObjectNameValid = ref(true)

const props = defineProps({
  onClose: Function,
  objectToEdit: Object,
  objectType: String
})

onMounted(() => {
  isEditing.value =!!props.objectToEdit;

  if (isEditing.value) {
    objectName.value = props.objectToEdit.value.name;
  } else {
    objectName.value = props.objectType === 'tag' ? 'Sick Tag' : 'My Jams'
  }
  setTimeout(() => {
    const inputElement = document.querySelector('#ion-input-0');
    if (inputElement) {
      inputElement.focus();
      inputElement.select();
    }
  }, 100);
});

const checkNameUniqueness = () => {
  const nameLowercase = objectName.value.toLowerCase();

  let objT = props.objectType === 'tag' ? store.tags : store.playlists
  let objectsToCheckAgainst = objT
  if (isEditing.value) {
    objectsToCheckAgainst = objT.filter(obj => obj.pathname!== originalObjectName.value);
  }

  const duplicateObj = objectsToCheckAgainst.find(obj => obj.name.toLowerCase() === nameLowercase);

  if (duplicateObj) {
    nameExists.value = true;
    isObjectNameValid.value = false;
  } else {
    nameExists.value = false;
    isObjectNameValid.value = true;
  }
};

watchEffect(() => {
  if (objectName.value.trim()) {
    checkNameUniqueness();
    isValidName.value =!nameExists.value;
  } else {
    isValidName.value = false;
  }
});

const saveObject = async () => {
  if (!isValidName.value ||!isObjectNameValid.value) return;

  const pathname = objectName.value.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const newObj = {
    name: objectName.value,
    pathname: pathname,
   ...(isEditing.value? { id: props.objectToEdit.value.id } : {})
  };

  if (props.objectType === 'tag') {
    await store.saveTag(newObj)
  } else {
    await store.savePlaylist(newObj)
  }

  objectName.value = ''; // Reset the object name after creation
  props.onClose();
}
</script>
<style scoped>
.create-object .flex.column {
  justify-content: flex-start;
  align-items: center;
}
ion-input {
  text-align: center;
}
</style>