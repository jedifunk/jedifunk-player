import { defineStore } from 'pinia';
import AudioService from '@/utils/audioService'

let audioService = AudioService.getInstance()

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
    isLikedList: [],
    taggedList: [],
    isTagged: {},
    playlists: []
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
    getIsLikedList: state => state.isLikedList,
    getIsTagged: (state) => (trackId, tagId) => {
      const tagsForTrack = state.isTagged[trackId];
      if (tagsForTrack) {
        // Iterate over the array of tag objects, comparing each tag's id to the provided tagId
        return tagsForTrack.some(tag => tag.id === tagId);
      } else {
        return false;
      }
    },
    maxPlaylistId() {
      return Math.max(...this.playlists.map(playlist => playlist.id));
    }  
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
    setIsPlaying(isPlaying) {
      this.isPlaying = isPlaying;
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
    addTag(tag, track) {
      const trackId = track.id;
      
      if (!this.isTagged[trackId]) {
        // Initialize the track's tags array if it doesn't exist yet
        this.isTagged[trackId] = [];
      }
    
      // Add the new tag to the track's tags array
      this.isTagged[trackId].push(tag);
    
      // If the track is not already in the taggedList, add it
      if (!this.taggedList.some(t => t.id === trackId)) {
        this.taggedList.push({...track}); // Spread operator to create a copy of the track object
      }
      
      localStorage.setItem('isTagged', JSON.stringify(this.isTagged));
      localStorage.setItem('taggedList', JSON.stringify(this.taggedList))
    },
    loadTaggedDataFromLocalStorage() {
      try {
        const storedIsTagged = localStorage.getItem('isTagged');
        const storedTaggedList = localStorage.getItem('taggedList');
        if (storedIsTagged && storedTaggedList) {
          try {
            // Parse the stored JSON strings back into objects
            const parsedIsTagged = JSON.parse(storedIsTagged);
            const parsedTaggedList = JSON.parse(storedTaggedList);
    
            // Update the store's state with the retrieved data
            this.isTagged = parsedIsTagged;
            this.taggedList = parsedTaggedList;
    
            // Optionally, trigger reactivity if needed
            this.$patch({ isTagged: parsedIsTagged, taggedList: parsedTaggedList });
          } catch (parseError) {
            console.error('Error parsing localStorage data:', parseError);
          }
        }
      } catch (error) {
        console.error('Error in loadTaggedDataFromLocalStorage:', error);
      }
    },
    toggleTrackInPlaylist(playlistId, track) {
      const playlistIndex = this.playlists.findIndex(playlist => playlist.id === playlistId);
  
      if (playlistIndex!== -1) {
        const playlist = this.playlists[playlistIndex];
        const trackId = track.id;
  
        // Check if the track is already in the playlist
        const isTrackInPlaylist = playlist.tracks.some(trackInPlaylist => trackInPlaylist.id === trackId);
  
        if (isTrackInPlaylist) {
          // Track is already in the playlist, so remove it
          playlist.tracks = playlist.tracks.filter(trackInPlaylist => trackInPlaylist.id!== trackId);
        } else {
          // Track is not in the playlist, so add it
          playlist.tracks.push({...track});
        }
  
        // Update the playlist in the store
        this.playlists[playlistIndex] = playlist;

        // Optionally, save the updated playlists to localStorage
        localStorage.setItem('playlists', JSON.stringify(this.playlists))

        return!isTrackInPlaylist;
      }
    },
    loadPlaylistsFromLocalStorage() {
      try {
        const storedPlaylists = localStorage.getItem('playlists');
        if (storedPlaylists) {
          try {
            // Parse the stored JSON string back into an object
            const parsedPlaylists = JSON.parse(storedPlaylists);
    
            // Update the store's state with the retrieved data
            this.playlists = parsedPlaylists;
    
            // Optionally, trigger reactivity if needed
            this.$patch({ playlists: parsedPlaylists });
          } catch (parseError) {
            console.error('Error parsing localStorage data:', parseError);
          }
        }
      } catch (error) {
        console.error('Error in loadPlaylistsFromLocalStorage:', error);
      }
    },
    deletePlaylistById(id) {
      this.playlists = this.playlists.filter(playlist => playlist.id !== id)
    },
    updateStartingTrack(newTrack) {
      this.startingTrack = newTrack
    }
  }
})