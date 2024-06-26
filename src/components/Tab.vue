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

        <ion-tab-button tab="user" @click="goToUser(user.username)">
          <ion-icon :icon="personCircleOutline" />
          <ion-label>User</ion-label>
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
import { calendarOutline, bookmarkOutline, listOutline, pricetagsOutline, personCircleOutline } from 'ionicons/icons'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = JSON.parse(localStorage.getItem('user'))

const goToUser = (username) => {
  router.push({ name: 'User', params: { userParam: username }})
}
</script>