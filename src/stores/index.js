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
    profile: {},
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
    setUser(value) {
      this.user = value
    },
    setProfile(value) {
      this.profile = value
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
      if (value) {
        this.tags = value
      }
    },
    setPlaylists(value) {
      if (value) {
        this.playlists = value
      }
    },
    setLikes(likes) {
      if (likes) {
        this.likes = likes
      }
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
         .select()

        if (insertResult.error) throw insertResult.error;
    
        let updatedTags = await sb.getUserTagsWithTracks(this.user.id)
        if (updatedTags === null) {
          const {data} = await sb.supabase.from('tags').select('*').eq('user_id', this.user.id)
          updatedTags = data.map(tag => ({
          ...tag,
            tracks: []
          }));
        }
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
          .select()

        if (insertPlaylist.error) throw insertPlaylist.error

        let updatedPlaylists = await sb.getUserPlaylistsWithTracks(this.user.id)
        if (updatedPlaylists === null) {
          const {data} = await sb.supabase.from('playlists').select('*').eq('user_id', this.user.id)
          updatedPlaylists = data.map(playlist => ({
          ...playlist,
            tracks: []
          }));
        }
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

      let updatedPlaylists = await sb.getUserPlaylistsWithTracks(this.user.id)
      if (updatedPlaylists === null) {
        const {data} = await sb.supabase.from('playlists').select('*').eq('user_id', this.user.id)
        updatedPlaylists = data
      }
      if (updatedPlaylists.fetchError) throw updatedPlaylists.fetchError

      this.playlists = updatedPlaylists
    },
    async deleteTagById(tagId) {
      const { data, error } = await sb.supabase
        .from('tags')
        .delete()
        .match({ id: tagId})
      if (error) throw error

      let updatedTags = await sb.getUserTagsWithTracks(this.user.id)
      if (updatedTags === null) {
        const {data} = await sb.supabase.from('tags').select('*').eq('user_id', this.user.id)
        updatedTags = data
      }
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
      if (updatedLikes === null) {
        const {data} = await sb.supabase.from('likes').select('*').eq('user_id', this.user.id);
        updatedLikes = data
      }
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
        if (updatedTagsFromDB === null) {
          const {data} = await sb.supabase.from('tags').select('*').eq('user_id', this.user.id);
          updatedTagsFromDB = data
        }
        if (updatedTagsFromDB.fetchError) throw updatedTagsFromDB.fetchError
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
        let updatedPlaylistsFromDB = await sb.getUserPlaylistsWithTracks(this.user.id)
        if (updatedPlaylistsFromDB === null) {
          const {data} = await sb.supabase.from('playlists').select('*').eq('user_id', this.user.id);
          updatedPlaylistsFromDB = data
        }
        if (updatedPlaylistsFromDB.fetchError) throw updatedPlaylistsFromDB.fetchError
        this.playlists = updatedPlaylistsFromDB
        
        return!isTrackInPlaylist;
      }
    },
  }
})