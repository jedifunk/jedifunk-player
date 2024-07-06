import { defineStore } from 'pinia'

export const useShowsStore = defineStore('shows', {
  state: () => ({
    years: [],
    shows: {},
    singleShow: {},
    yearParam: null,
    dateParam: null,
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
    setYearParam(year) {
      this.yearParam = year;
    },
    setDateParam(value) {
      this.dateParam = value;
    },
  }
})