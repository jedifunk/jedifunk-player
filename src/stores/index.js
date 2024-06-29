import { defineStore } from 'pinia'
import * as sb from '@/utils/database'

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    appReady: false,
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
    likes: [],
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
    setAppReady(value) {
      this.appReady = value
    },
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
    setLikes(likes) {
      this.likes = likes
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
        const insertResult = await sb.supabase
         .from('tags')
         .insert([tagData])
         .single();
    
        if (insertResult.error) throw insertResult.error;
    
        const updatedTags = await sb.getUserTagsWithTracks(this.user.id)
        
        if (updatedTags.error) throw updatedTags.error

        this.tags = updatedTags
      } catch (error) {
        console.error('Error inserting tag:', error.message);
      }
    },
    async addPlaylist(playlist) {
      const playlistData = {
        ...playlist,
        user_id: this.user.id
      }
      try {
        const insertPlaylist = await sb.supabase
          .from('playlists')
          .insert([playlistData])
          .single()
        if (insertPlaylist.error) throw insertPlaylist.error

        const updatedPlaylists = await sb.getUserPlaylistsWithTracks(this.user.id)
        if (updatedPlaylists.error) throw updatedPlaylists.error

        this.playlists = updatedPlaylists
      } catch (error) {
        console.error('Error inserting playlist', error)
      }
    },
    async deletePlaylistById(playlistId) {
      const { data, error } = await sb.supabase
        .from('playlists')
        .delete()
        .match({ id: playlistId})
      if (error) throw error

      const updatedPlaylists = await sb.getUserPlaylistsWithTracks(this.user.id)

      if (updatedPlaylists.fetchError) throw updatedPlaylists.fetchError

      this.playlists = updatedPlaylists
    },
    async deleteTagById(tagId) {
      const { data, error } = await sb.supabase
        .from('tags')
        .delete()
        .match({ id: tagId})
      if (error) throw error

      const updatedTags = await sb.getUserTagsWithTracks(this.user.id)

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
    async toggleLikeStatus(track) {
      const trackId = track.id;
      let isLiked = false;

      // Check if the track is already liked
      for (let like of this.likes) {
        if (like.track_id === trackId) {
          isLiked = true
          break
        }
      }

      if (!isLiked) {
        await sb.addTrackToLikes(
          track.duration,
          track.id,
          track.mp3,
          track.show_date,
          track.title,
          this.user.id,
          track.venue_location,
          track.venue_name
        )
      } else {
        await sb.removeTrackFromLikes(track.id, this.user.id)
      }

      const updatedLikes = await sb.getUserLikes(this.user.id)
      if (updatedLikes.fetchError) throw updatedLikes.fetchError

      this.likes = updatedLikes

      return!isLiked
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
          await sb.untagTrack(tagId, trackId)
        } else {
          // Track is not in the tag, so add it
          updatedTag = {
            ...tag,
            tracks: [...tag.tracks, {...track}]
          }
          await sb.tagTrack(
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
        const updatedTagsFromDB = await sb.getUserTagsWithTracks(this.user.id)

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
          await sb.removeTrackFromPlaylist(playlistId, trackId)
        } else {
          // Track is not in the playlist, so add it
          updatedPlaylist = {
            ...playlist,
            tracks: [...playlist.tracks, {...track}]
          }
          await sb.addTrackToPlaylist(
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
        const updatedPlaylistsFromDB = await sb.getUserPlaylistsWithTracks(this.user.id)

        this.playlists = updatedPlaylistsFromDB
        return!isTrackInPlaylist;
      }
    },
  }
})