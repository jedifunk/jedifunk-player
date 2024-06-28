import { defineStore } from 'pinia'
import { supabase, tagTrack, untagTrack, getUserTagsWithTracks, getUserPlaylistsWithTracks } from '@/utils/database'
import { addTrackToPlaylist, removeTrackFromPlaylist } from '../utils/database';

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
    user: {}
  }),
  getters: {
    maxPlaylistId() {
      return Math.max(...this.playlists.map(playlist => playlist.id));
    }  
  },
  actions: {
    setUser(user) {
      this.user = user
    },
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
    setTags(value) {
      this.tags = value
    },
    setPlaylists(value) {
      this.playlists = value
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
    async addTag(tag) {
      const tagData = {
        ...tag,
        user_id: this.user.id
      }
      try {
        const insertResult = await supabase
         .from('tags')
         .insert([tagData])
         .single();
    
        if (insertResult.error) throw insertResult.error;
    
        const updatedTags = await getUserTagsWithTracks(this.user.id)
        
        if (updatedTags.error) throw updatedTags.error

        this.tags = updatedTags
      } catch (error) {
        console.error('Error inserting tag:', error.message);
      }
    },
    async addPlaylist(playlist) {
      console.log('add triggered')
      const playlistData = {
        ...playlist,
        user_id: this.user.id
      }
      try {
        const insertPlaylist = await supabase
          .from('playlists')
          .insert([playlistData])
          .single()
        if (insertPlaylist.error) throw insertPlaylist.error

        const updatedPlaylists = await getUserPlaylistsWithTracks(this.user.id)
        if (updatedPlaylists.error) throw updatedPlaylists.error

        this.playlists = updatedPlaylists
      } catch (error) {
        console.error('Error inserting playlist', error)
      }
    },
    async deletePlaylistById(playlistId) {
      const { data, error } = await supabase
        .from('playlists')
        .delete()
        .match({ id: playlistId})
      if (error) throw error

      const updatedPlaylists = await getUserPlaylistsWithTracks(this.user.id)

      if (updatedPlaylists.fetchError) throw updatedPlaylists.fetchError

      this.playlists = updatedPlaylists
    },
    async deleteTagById(tagId) {
      const { data, error } = await supabase
        .from('tags')
        .delete()
        .match({ id: tagId})
      if (error) throw error

      const updatedTags = await getUserTagsWithTracks(this.user.id)

      if (updatedTags.fetchError) throw updatedTags.fetchError

      this.tags = updatedTags
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
    async toggleTagged(tagId, track) {
      // find correct tag
      const tagIndex = this.tags.findIndex(tag => tag.id === tagId);

      if (tagIndex !== -1) {
        const tag = this.tags[tagIndex];
        const trackId = track.id;
  
        // Check if the track is already in the tag
        const isTrackInTag = tag.tracks.some(trackTagged => trackTagged !== null && trackTagged.id !== null && trackTagged.id === trackId);

        let updatedTag = tag
  
        if (isTrackInTag) {
          // Track is already in the tag, so remove it
          updatedTag = {
            ...tag,
            tracks: tag.tracks.filter(trackTagged => trackTagged.id !== trackId)
          }
          await untagTrack(tagId, trackId)
        } else {
          // Track is not in the tag, so add it
          updatedTag = {
            ...tag,
            tracks: [...tag.tracks, {...track}]
          }
          await tagTrack(
            track.duration,
            track.id,
            track.mp3,
            track.show_date,
            track.title,
            tag.id,
            this.user.id,
            track.venue_location,
            track.venue_name
          );
        }
  
        // Update the tag in the store
        const updatedTagsFromDB = await getUserTagsWithTracks(this.user.id)

        this.tags = updatedTagsFromDB
        return!isTrackInTag;
      }
    },
    async toggleTrackInPlaylist(playlistId, track) {
      const playlistIndex = this.playlists.findIndex(playlist => playlist.id === playlistId);
  
      if (playlistIndex!== -1) {
        const playlist = this.playlists[playlistIndex];
        const trackId = track.id;
  
        // Check if the track is already in the playlist
        const isTrackInPlaylist = playlist.tracks.some(trackInPlaylist => trackInPlaylist !== null && trackInPlaylist.id !== null && trackInPlaylist.id === trackId);
        
        let updatedPlaylist = playlist

        if (isTrackInPlaylist) {
          // Track is already in the playlist, so remove it
          updatedPlaylist = {
            ...playlist,
            tracks: playlist.tracks.filter(trackInPlaylist => trackInPlaylist.id!== trackId)
          }
          await removeTrackFromPlaylist(playlistId, trackId)
        } else {
          // Track is not in the playlist, so add it
          updatedPlaylist = {
            ...playlist,
            tracks: [...playlist.tracks, {...track}]
          }
          await addTrackToPlaylist(
            track.duration,
            track.id,
            track.mp3,
            track.show_date,
            track.title,
            playlist.id,
            this.user.id,
            track.venue_location,
            track.venue_name
          )
        }
  
        // Update the playlist in the store
        const updatedPlaylistsFromDB = await getUserPlaylistsWithTracks(this.user.id)

        this.playlists = updatedPlaylistsFromDB
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