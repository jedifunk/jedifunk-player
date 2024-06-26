import { defineStore } from 'pinia';

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    years: [],
    shows: {},
    singleShow: {},
    tracks: [],
    yearParam: null,
    dateParam: null,
    showMiniPlayer: false,
    isPlaying: false,
    currentTrack: {},
    comingFrom: 'show',
    isLiked: {},
    isLikedList: [],
    tags: [],
    playlists: [],
    userId: null
  }),
  getters: {
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
    setTracks(value) {
      this.Tracks = value;
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
    addTag(tag) {
      this.tags.push(tag)
      localStorage.setItem('tags', JSON.stringify(this.tags))
    },
    addPlaylist(playlist) {
      this.playlists.push(playlist)
      localStorage.setItem('playlists', JSON.stringify(this.playlists))
    },
    deletePlaylistById(id) {
      this.playlists = this.playlists.filter(playlist => playlist.id !== id)
      localStorage.setItem('playlists', JSON.stringify(this.playlists))
    },
    deleteTagById(id) {
      this.tags = this.tags.filter(tag => tag.id !== id)
      localStorage.setItem('tags', JSON.stringify(this.tags))
    },
    setComingFrom(value) {
      const validOptions = ["show", "other", "miniplayer"];
      if (validOptions.includes(value)) {
          this.comingFrom = value;
      } else {
        console.error("Invalid value for comingFrom:", value);
      }
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
    toggleTagged(tagId, track) {
      const tagIndex = this.tags.findIndex(tag => tag.id === tagId);
  
      if (tagIndex!== -1) {
        const tag = this.tags[tagIndex];
        const trackId = track.id;
  
        // Check if the track is already in the tag
        const isTrackInTag = tag.tracks.some(trackTagged => trackTagged.id === trackId);
  
        if (isTrackInTag) {
          // Track is already in the tag, so remove it
          tag.tracks = tag.tracks.filter(trackTagged => trackTagged.id!== trackId);
        } else {
          // Track is not in the tag, so add it
          tag.tracks.push({...track});
        }
  
        // Update the tag in the store
        this.tags[tagIndex] = tag;

        localStorage.setItem('tags', JSON.stringify(this.tags))

        return!isTrackInTag;
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

        localStorage.setItem('playlists', JSON.stringify(this.playlists))

        return!isTrackInPlaylist;
      }
    },
    getFromLocalStorage() {
      const storedPlaylists = localStorage.getItem('playlists');
      const storedIsLiked = localStorage.getItem('isLiked')
      const storedIsLikedList = localStorage.getItem('isLikedList');
      const storedTags = localStorage.getItem('tags')

      if (storedPlaylists) {
        this.playlists = JSON.parse(storedPlaylists)
        this.$patch({ playlists: this.playlists })
      }
      if (storedIsLiked) {
        this.isLiked = JSON.parse(storedIsLiked)
        this.$patch({ isLiked: this.isLiked })
      }
      if (storedIsLikedList) {
        this.isLikedList = JSON.parse(storedIsLikedList)
        this.$patch({ isLikedList: this.isLikedList })
      }
      if (storedTags) {
        this.tags = JSON.parse(storedTags)
        this.$patch({ tags: this.tags })
      }
    }
  }
})