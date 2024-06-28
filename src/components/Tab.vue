<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar class="ion-no-border" slot="bottom" :translucent="true">
        <ion-tab-button tab="shows" href="/tabs/home">
          <ion-icon :icon="getIcon('shows')" />
          <ion-label>Shows</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="liked" href="/tabs/liked">
          <ion-icon :icon="getIcon('liked')" />
          <ion-label>Liked</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tags" href="/tabs/tags">
          <ion-icon :icon="getIcon('tags')" />
          <ion-label>Tags</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="playlists" href="/tabs/playlists">
          <ion-icon :icon="getIcon('playlists')" />
          <ion-label>Playlists</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="user" @click="goToUser(store.user.username)">
          <ion-icon :icon="getIcon('user')" />
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
import { calendarOutline, calendar, bookmarkOutline, bookmark, listOutline, list, pricetagsOutline, pricetags, personCircleOutline, personCircle } from 'ionicons/icons'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores';
import { computed } from 'vue';

const store = useMainStore()
const router = useRouter()

const activeTab = computed(() => {
  return router.currentRoute.value.name
})

const getIcon = (tabName) => {
  switch (tabName) {
    case 'shows':
      return activeTab.value === 'Shows' || activeTab.value === 'Year' || activeTab.value === 'Date' ? calendar : calendarOutline;
    case 'liked':
      return activeTab.value === 'Liked' ? bookmark : bookmarkOutline;
    case 'tags':
      return activeTab.value === 'Tags' ? pricetags : pricetagsOutline;
    case 'playlists':
      return activeTab.value === 'Playlists' ? list : listOutline;
    case 'user':
      return activeTab.value === 'User' ? personCircle : personCircleOutline;
    default:
      return calendarOutline; // Default icon
  }
}

const goToUser = (username) => {
  router.push({ name: 'User', params: { userParam: username }})
}
</script>