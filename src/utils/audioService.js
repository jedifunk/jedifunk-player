class AudioService {
  static instance = null;

  constructor() {
    if (!AudioService.instance) {
      this.initAudioElement();
      this.eventListeners = {};
      AudioService.instance = this;
    } else {
      return AudioService.instance;
    }
  }

  initAudioElement() {
    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.attachEventListeners();
    }
  }

  attachEventListeners() {
    if (this.audioElement) {
      this.audioElement.addEventListener('ended', () => this.handlePlaybackEnd(this));
    }
  }

  handlePlaybackEnd() {
    console.log('Playback ended. Finding next track...', this._nextTrackUrl);
    if (this._nextTrackUrl) {
      console.log('End: Next track URL:', this._nextTrackUrl);
      this.setAudioSource('', this._nextTrackUrl); // Pass the mp3 URL of the next track
      this._nextTrackUrl = ''
    } else {
      console.warn('No current track URL available to find the next track.');
    }
  }

  setAudioSource(sourceUrl, nextTrackUrl) {
    if (this.audioElement) {
      this.audioElement.removeEventListener('ended', this.handlePlaybackEnd);
      this.audioElement.src = sourceUrl;
      this.audioElement.load();
      this.attachEventListeners();

      if (nextTrackUrl) {
        this._nextTrackUrl = nextTrackUrl;
        const nextAudioElement = new Audio(nextTrackUrl)
        nextAudioElement.preload = 'auto'
      } else {
        console.warn('No next track URL provided to setAudioSource');
      }
    } else {
      console.error('audioElement is not initialized.');
    }
  }

  getNextTrack(currentTrack, trackList) {
    const currentIndex = trackList.findIndex(track => track.position === currentTrack.position);

    if (currentIndex === -1) {
      console.log('Current track not found.');
      return null;
    }
    if (currentIndex >= trackList.length - 1) {
      console.log('Current track is last track.')
      return null
    }

    // Find the next track in the list
    const nextIndex = currentIndex + 1;
    const nextTrack = trackList[nextIndex];

    if (!nextTrack) {
      console.log('No next track found.');
      return null;
    }

    return nextTrack;
  }

  play() {
    if (this.audioElement) {
      this.audioElement.play().catch(error => console.error("Failed to play audio:", error));
    }
  }

  pause() {
    this.audioElement?.pause();
  }

  addEventListener(event, listener) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(listener);
    this.audioElement?.addEventListener(event, listener);
  }

  removeEventListener(event, listener) {
    const index = this.eventListeners[event]?.findIndex(fn => fn === listener);
    if (index!== -1) {
      this.eventListeners[event].splice(index, 1);
      this.audioElement?.removeEventListener(event, listener);
    }
  }

  dispatchEvent(event, detail) {
    this.eventListeners[event]?.forEach(listener => listener(detail));
  }

  getCurrentTime() {
    this.initAudioElement();
    return this.audioElement? this.audioElement.currentTime : 0;
  }

  getDuration() {
    this.initAudioElement();
    return this.audioElement? this.audioElement.duration : 0;
  }

  setCurrentTime(time) {
    this.initAudioElement();
    if (this.audioElement) {
      this.audioElement.currentTime = time;
    }
  }

  static getInstance() {
    if (!AudioService.instance) {
      new AudioService();
    }
    return AudioService.instance;
  }
}

// Exporting the singleton instance
window.AudioService = AudioService.getInstance();

export default AudioService