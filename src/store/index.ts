import { createStore } from 'vuex'

export default createStore({
  state: {
    years: {},
    shows: {},
    singleShow: {},
    showTracks: [],
    startingTrack: {},
    yearParam: null,
    dateParam: null
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
    }
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
    }
  },
  getters: {
    years: state => state.years,
    shows: state => state.shows,
    singleShow: state => state.singleShow,
    showTracks: state => state.showTracks,
    startingTrack: state => state.startingTrack,
    yearParam: state => state.yearParam,
    dateParam: state => state.dateParam
  }
})