import { createStore } from 'vuex'
import audioService from '@/utils/audioService'

export default createStore({
  state: {
    years: {},
    shows: {},
    singleShow: {},
    showTracks: [],
    startingTrack: {},
    yearParam: null,
    dateParam: null,
    showMiniPlayer: false,
    isPlaying: false,
    currentTrack: {}
  },
  mutations: {
    setYears(state, value) {
      state.years = value
    },
    setShows(state, value) {
      state.shows = value
    },
    setSingleShow(state, value) {
      state.singleShow = value
    },
    setShowTracks(state, value) {
      state.showTracks = value
    },
    setStartingTrack(state, value) {
      state.startingTrack = value
    },
    setYearParam(state, value) {
      state.yearParam = value
    },
    setDateParam(state, value) {
      state.dateParam = value
    },
    setShowMiniPlayer(state, value) {
      state.showMiniPlayer = value
    },
    setIsPlaying(state, playing) {
      state.isPlaying = playing
    },
    setCurrentTrack(state, track) {
      state.currentTrack = track
    },
  },
  actions: {
    setYears({ commit }, value) {
      commit('setYears', value)
    },
    setShows({ commit }, value) {
      commit('setShows', value)
    },
    setSingleShow({ commit }, value) {
      commit('setSingleShow', value)
    },
    setShowTracks({ commit }, value) {
      commit('setShowTracks', value)
    },
    setStartingTrack({ commit }, value) {
      commit('setStartingTrack', value)
    },
    setYearParam({ commit }, value) {
      commit('setYearParam', value)
    },
    setDateParam({ commit }, value) {
      commit('setDateParam', value)
    },
    setShowMiniPlayer({ commit }, value) {
      commit('setShowMiniPlayer', value)
    },
    playTrack({ commit }, track) {
      commit('setCurrentTrack', track)
      audioService.play()
      commit('setIsPlaying', true)
    },
    pauseTrack({ commit }) {
      commit('setIsPlaying', false)
      audioService.pause()
    },
  },
  getters: {
    years: state => state.years,
    shows: state => state.shows,
    singleShow: state => state.singleShow,
    showTracks: state => state.showTracks,
    startingTrack: state => state.startingTrack,
    yearParam: state => state.yearParam,
    dateParam: state => state.dateParam,
    showMiniPlayer: state => state.showMiniPlayer,
    isPlaying: state => state.isPlaying,
    currentTrack: state => state.currentTrack,
    getAudioElement: () => audioService.audioElement
  }
})