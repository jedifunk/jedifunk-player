<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="shows" href="/tabs/home">
          <ion-icon :icon="calendarOutline" />
          <ion-label>Shows</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="liked" href="/tabs/liked">
          <ion-icon :icon="bookmarkOutline" />
          <ion-label>Favorites</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tags" href="/tabs/tags">
          <ion-icon :icon="pricetagsOutline" />
          <ion-label>Tags</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="playlists" href="/tabs/playlists">
          <ion-icon :icon="listOutline" />
          <ion-label>Playlists</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup>
import { 
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonPage,
  IonRouterOutlet, 
  IonLabel,
} from '@ionic/vue';
import { calendarOutline, bookmarkOutline, listOutline, pricetagsOutline } from 'ionicons/icons'
</script>