# Jedifunk Player

Personal Phish audio player.
- Uses phish.in API for track audio and metadata
- Gapless.js from ReListen for audio player

### TODO
- [ ] BUG: clicking track in another playlist, show, list errors out
- [ ] BUG: track length incorrect in playback. track skips ahead before its done
- [x] Play next track in AudioServices
- [x] Delete playlist
- [x] Audio player to accept playlists, not just tracklists
- [x] Clicking previous track restarts current track, then another click to go back a track
- [x] Tracks: Add "playing" icon to current track in list views, or highlight its row
- [ ] Tracks: Upgrade playing icon to animated audiobar
- [ ] Tracks: FIX animation of venue
- [x] Shows: Setlists abstraction so everything works on shows
- [x] Tags: switch to ionChange
- [x] Tags: add to localStorage
- [x] Add to Playlist checkbox reactivity
- [ ] Playlist: add search functionality
- [x] Pinia: clean up and combine actions
- [x] Abstract like, tag, playlist into resuable components
- [x] Router: adjust routes to be cleaner
- [x] Style: FIX alignment of track time when venue is long
- [ ] Style: Color Theme
- [ ] Style: Make less generic Ionic
- [ ] Style: Dark Mode
- [ ] Tags: Allow edit name
- [ ] Playlists: Allow edit name
- [ ] Playlists: add reordering of tracks in playlists
- [ ] Shows: allow to select multiple tracks to add to tag, playlist, likes
- [ ] Systems: Abstract into separate stores (player, user, systems)
- [ ] Systems: Abstract functions by use (user, likes, tags, etc)
- [ ] Improve performance
- [ ] Improve playback
- [ ] Allow download to local for faster play
- [x] Move data (like, tag, playlist, etc) to supabase or similar
- [x] Create user auth system
- [ ] generate album art
- [ ] Build to native app
