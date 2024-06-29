<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar class="ion-no-border" slot="bottom" :translucent="true">
        <ion-tab-button :class="getTabInfo('shows').className" tab="shows" @click="navigateTo('Shows')">
          <ion-icon :icon="getTabInfo('shows').iconName" />
          <ion-label>Shows</ion-label>
        </ion-tab-button>

        <ion-tab-button :class="getTabInfo('liked').className" tab="liked" @click="navigateTo('Liked')">
          <ion-icon :icon="getTabInfo('liked').iconName" />
          <ion-label>Liked</ion-label>
        </ion-tab-button>

        <ion-tab-button :class="getTabInfo('tags').className" tab="tags" @click="navigateTo('Tags')">
          <ion-icon :icon="getTabInfo('tags').iconName" />
          <ion-label>Tags</ion-label>
        </ion-tab-button>

        <ion-tab-button :class="getTabInfo('playlists').className" tab="playlists" @click="navigateTo('Playlists')">
          <ion-icon :icon="getTabInfo('playlists').iconName" />
          <ion-label>Playlists</ion-label>
        </ion-tab-button>

        <ion-tab-button :class="getTabInfo('user').className" tab="user" @click="goToUser(store.user.username)">
          <ion-icon :icon="getTabInfo('user').iconName" />
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
import { ref, watch } from 'vue';

const store = useMainStore()
const router = useRouter()

const activeTab = ref(router.currentRoute.value.name)

watch(() => router.currentRoute.value, (newRoute) => {
  activeTab.value = newRoute.name
}, {immediate: true})

const getTabInfo = (tabName) => {
  let iconName = '';
  let className = '';

  switch (tabName) {
    case 'shows':
      iconName = activeTab.value === 'Shows' || activeTab.value === 'Year' || activeTab.value === 'Date' ? calendar : calendarOutline;
      className = activeTab.value === 'Shows' || activeTab.value === 'Year' || activeTab.value === 'Date' ? 'tab-selected' : '';
      break;
    case 'liked':
      iconName = activeTab.value === 'Liked' ? bookmark : bookmarkOutline;
      className = activeTab.value === 'Liked' ? 'tab-selected' : '';
      break;
    case 'tags':
      iconName = activeTab.value === 'Tags' || activeTab.value === 'Single Tag' ? pricetags : pricetagsOutline;
      className = activeTab.value === 'Tags' || activeTab.value === 'Single Tag' ? 'tab-selected' : '';
      break;
    case 'playlists':
      iconName = activeTab.value === 'Playlists' || activeTab.value === 'Single Playlist' ? list : listOutline;
      className = activeTab.value === 'Playlists' || activeTab.value === 'Single Playlist' ? 'tab-selected' : '';
      break;
    case 'user':
      iconName = activeTab.value === 'User' ? personCircle : personCircleOutline;
      className = activeTab.value === 'User' ? 'tab-selected' : '';
      break;
    default:
      iconName = calendarOutline; // Default icon
      className = ''; // No class selected by default
  }

  return { iconName, className };
}

const goToUser = (username) => {
  router.push({ name: 'User', params: { userParam: username }})
}
const navigateTo = (routeName) => {
  router.push({ name: routeName });
}
</script>