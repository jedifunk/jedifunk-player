<template>
  <div class="loading">
    <ion-spinner name="dots"></ion-spinner>
  </div>
</template>
<script setup>
import { IonSpinner } from '@ionic/vue'
</script>
<style>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>