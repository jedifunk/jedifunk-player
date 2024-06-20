import Gapless from 'gapless.js'

class AudioService {

  constructor() {
    this.tracks = []
    this.player = null
    this.currentTime = 0
    this.duration = 0
    this.progressBar = 0
    this.listeners = {}
    this.currentTrackProgress = null
    this.isScrubbing = false
  }

  setTracks(tracks) {
    this.tracks = tracks
    if (this.player) {
      this.player.tracks = tracks
    }
  }
  
  initPlayer() {
    if (!this.player) {
      this.player = new Gapless.Queue({
        tracks: this.tracks,
        onProgress: (track) => {
          //track && console.log(track.completeState);
          this.currentTrackProgress = track.completeState
          this.updateProgress(track)
        },
        onStartNewTrack: (track) => {
          //track && console.log('new track', track)
          this.trackChanged(track.trackUrl)
        }
      });
    }

    // Expose player controls as methods
    this.play = () => this.player.play();
    this.pause = () => this.player.pause();
    this.playNext = () => this.player.playNext();
    this.playPrevious = () => this.player.playPrevious();
    this.togglePlayPause = () => this.player.togglePlayPause();
    this.gotoTrack = (idx, playImmediately = false) => this.player.gotoTrack(idx, playImmediately);
    this.resetCurrentTrack = () => this.player.resetCurrentTrack();
    this.disableWebAudio = () => this.player.disableWebAudio();
  }

  updateProgress(track) {
    if (this.currentTrackProgress) {
      this.currentTime = track.completeState.currentTime
      this.duration = track.completeState.duration
      this.progressBar = (this.currentTime/this.duration) * 100
      if (this.currentTime && this.duration) {
        this.elapsedTime = `${Math.floor(this.currentTime / 60)}:${Math.floor(this.currentTime % 60).toString().padStart(2, '0')}`;
        this.remainingTime = `${Math.floor((this.duration - this.currentTime) / 60)}:${Math.floor((this.duration - this.currentTime) % 60).toString().padStart(2, '0')}`;
      }
      this.emitEvent('progressUpdate', {
        currentTime: this.currentTime,
        duration: this.duration,
        progressBar: this.progressBar,
        elapsedTime: this.elapsedTime,
        remainingTime: this.remainingTime,
      });
    } else {
      console.log('no current track progress available')
    }
  }

  // Getter for current track
  get currentTrack() {
    return this.player ? this.player.currentTrack : null;
  }

  // Getter for next track
  get nextTrack() {
    return this.player ? this.player.nextTrack : null;
  }

  trackChanged(trackUrl) {
    this.emitEvent('trackChanged', { trackUrl })
  }

  // Method to start scrubbing
  startScrubbing() {
    this.isScrubbing = true;
  }

  // Method to handle scrubbing action
  scrub(event) {
    if (!this.isScrubbing) return;

    const target = document.querySelector('.progress-bar-container')
    const rect = target.getBoundingClientRect();

    if (!rect) return;

    const x = event.type.startsWith('touch')? event.touches[0].clientX : event.pageX;
    const percentage = (x - rect.left) / rect.width
    const seekArg = this.currentTrack.duration * percentage

    this.player.currentTrack.seek(seekArg);
  }

  // Method to stop scrubbing
  stopScrubbing() {
    this.isScrubbing = false;
  }

  // Method to add a listener for a specific event
  addEventListener(eventName, listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);
  }

  // Method to remove a listener for a specific event
  removeEventListener(eventName, listener) {
    if (this.listeners[eventName]) {
      const index = this.listeners[eventName].indexOf(listener);
      if (index!== -1) {
        this.listeners[eventName].splice(index, 1);
      }
    }
  }

  // Method to emit an event to all registered listeners
  emitEvent(eventName, data) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach((listener) => listener(data));
    }
  }

  static getInstance() {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }
}

export default AudioService;