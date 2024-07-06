import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    appReady: false,
    showMiniPlayer: false,
    isPlaying: false,
    tracks: [],
    currentTrack: {},
    comingFrom: 'show',
  }),
  actions: {
    setAppReady(value) {
      this.appReady = value
    },
    setShowMiniPlayer(value) {
      this.showMiniPlayer = value;
    },
    setIsPlaying(isPlaying) {
      this.isPlaying = isPlaying;
    },
    setTracks(value) {
      this.tracks = value;
    },
    setCurrentTrack(track) {
      this.currentTrack = track;
    },
    setComingFrom(value) {
      const validOptions = ["show", "other", "miniplayer"];
      if (validOptions.includes(value)) {
          this.comingFrom = value;
      } else {
        console.error("Invalid value for comingFrom:", value);
      }
    },
  }
})