import { defineStore } from 'pinia';
import audioService from '@/utils/audioService';

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    years: [],
    shows: {},
    singleShow: {},
    showTracks: [],
    startingTrack: {},
    yearParam: null,
    dateParam: null,
    showMiniPlayer: false,
    isPlaying: false,
    currentTrack: {},
    comingFromShow: false,
    isLiked: {},
    isLikedList: []
  }),
  getters: {
    getYears: state => state.years,
    getShows: state => state.shows,
    getSingleShow: state => state.singleShow,
    getShowTracks: state => state.showTracks,
    getStartingTrack: state => state.startingTrack,
    getYearParam: state => state.yearParam,
    getDateParam: state => state.dateParam,
    getShowMiniPlayer: state => state.showMiniPlayer,
    getIsPlaying: state => state.isPlaying,
    getCurrentTrack: state => state.currentTrack,
    getComingFromShow: state => state.comingFromShow,
    getIsLiked: state => state.isLiked,
    getIsLikedList: state => state.isLikedList
  },
  actions: {
    setYears(yearsData) {
      this.years = yearsData;
    },
    setShows(value) {
      this.shows = value;
    },
    setSingleShow(value) {
      this.singleShow = value;
    },
    setShowTracks(value) {
      this.showTracks = value;
    },
    setStartingTrack(value) {
      this.startingTrack = value;
    },
    setYearParam(year) {
      this.yearParam = year;
    },
    setDateParam(value) {
      this.dateParam = value;
    },
    setShowMiniPlayer(value) {
      this.showMiniPlayer = value;
    },
    setIsPlaying(playing) {
      this.isPlaying = playing;
    },
    setCurrentTrack(track) {
      this.currentTrack = track;
    },
    setComingFromShow(track) {
      this.comingFromShow = track;
    },
    toggleLikeStatus(track) {
      const trackId = track.id;
      const isCurrentlyLiked = this.isLiked[trackId] || false;
      this.isLiked[trackId] =!isCurrentlyLiked;

      if (!isCurrentlyLiked) {
        this.isLikedList.push(track);
      } else {
        const index = this.isLikedList.findIndex(t => t.id === trackId);
        if (index!== -1) {
          this.isLikedList.splice(index, 1);
        }
      }
      localStorage.setItem('isLiked', JSON.stringify(this.isLiked));
      localStorage.setItem('isLikedList', JSON.stringify(this.isLikedList))
    },
    loadLikedListFromLocalStorage() {
      try {
        const storedIsLiked = localStorage.getItem('isLiked')
        const storedIsLikedList = localStorage.getItem('isLikedList');
        if (storedIsLiked && storedIsLikedList) {
          try {
            // Parse the stored JSON strings back into objects
            const parsedIsLiked = JSON.parse(storedIsLiked);
            const parsedIsLikedList = JSON.parse(storedIsLikedList);
    
            // Update the store's state with the retrieved data
            this.isLiked = parsedIsLiked;
            this.isLikedList = parsedIsLikedList;
    
            // Optionally, trigger reactivity if needed
            this.$patch({ isLiked: parsedIsLiked, isLikedList: parsedIsLikedList });
            //this.isLikedList.splice(0, this.isLikedList.length,...parsedData)
          } catch (parseError) {
            console.error('Error parsing localStorage data:', parseError);
          }
        }
      } catch (error) {
        console.error('Error in loadLikedListFromLocalStorage:', error);
      }
    },
    playTrack(track) {
      this.setCurrentTrack(track);
      audioService.play();
      this.setIsPlaying(true);
    },
    pauseTrack() {
      this.setIsPlaying(false);
      audioService.pause();
    }
  }
})