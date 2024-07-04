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

        <ion-tab-button :class="getTabInfo('profile').className" tab="profile" @click="goToUser()">
          <img class="avatar-icon" v-if="avatar" :src="avatar" alt="avatar" />
          <ion-icon v-else :icon="getTabInfo('profile').iconName" />
          <ion-label>Profile</ion-label>
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
const avatar = store.avatar
console.log(avatar)
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
    case 'profile':
      iconName = activeTab.value === 'Profile' ? personCircle : personCircleOutline;
      className = activeTab.value === 'Profile' ? 'tab-selected' : '';
      break;
    default:
      iconName = calendarOutline; // Default icon
      className = ''; // No class selected by default
  }

  return { iconName, className };
}

// const goToUser = (username) => {
//   router.push({ name: 'Profile', params: { userParam: username }})
// }
const goToUser = (username) => {
  router.push({ name: 'Profile'})
}
const navigateTo = (routeName) => {
  router.push({ name: routeName });
}
</script>
<style>
.avatar-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 2px;
  margin-bottom: 2px;
  font-size: 24px;
  order: -1;
}
.avatar-icon + ion-label {
  font-size: 10px;
  margin-top: 0;
  margin-bottom: 1px;
  min-height: 11px;
}
</style>