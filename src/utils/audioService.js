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
      this.audioElement.addEventListener('ended', () => this.handlePlaybackEnd());
    }
  }

  handlePlaybackEnd() {
    console.log('end:', this._nextTrackUrl);
    if (this._nextTrackUrl) {
      this.setAudioSource(this._nextTrackUrl);
    }
  }

  setAudioSource(sourceUrl, nextTrackUrl) {
    if (this.audioElement) {
      this.audioElement.removeEventListener('ended', this.handlePlaybackEnd);
      this.audioElement.src = sourceUrl;
      this.audioElement.load();
      this.attachEventListeners();

      if (nextTrackUrl) {
        console.log(nextTrackUrl);
        this._nextTrackUrl = nextTrackUrl;
      }
    } else {
      console.error('audioElement is not initialized.');
    }
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

export default AudioService;

// class AudioService {
//   private static instance: AudioService;

//   private audioElement: HTMLAudioElement | null = null;
//   private eventListeners: { [key: string]: Function[] } = {}
//   private nextTrackUrl: string | null = null

//   private constructor() {
//     this.initAudioElement();
//   }

//   public static getInstance(): AudioService {
//     if (!AudioService.instance) {
//       AudioService.instance = new AudioService();
//     }
//     return AudioService.instance;
//   }

//   private initAudioElement() {
//     if (!this.audioElement) {
//       this.audioElement = new Audio();
//       this.attachEventListeners()
//     }
//   }

//   private attachEventListeners() {
//     if (this.audioElement) {
//       this.audioElement.addEventListener('ended', () => this.handlePlaybackEnd());
//     }
//   }

//   public setAudioSource(sourceUrl: string, nextTrackUrl?: string) {
//     if (this.audioElement) {
//       this.audioElement.removeEventListener('ended', this.handlePlaybackEnd);
//       this.audioElement.src = sourceUrl;
//       this.audioElement.load();
//       this.attachEventListeners(); // Reattach event listeners

//       if (nextTrackUrl) {
//         console.log(nextTrackUrl)
//         this.nextTrackUrl = nextTrackUrl;
//       }
//     } else {
//       console.error('audioElement is not initialized.');
//     }
//   }

//   private handlePlaybackEnd() {
//     console.log('end:', this.nextTrackUrl)
//     if (this.nextTrackUrl) {
//       this.setAudioSource(this.nextTrackUrl);
//     }
//   }

//   public play() {
//     if (this.audioElement) {
//       this.audioElement.play().catch(error => console.error("Failed to play audio:", error));
//     }
//   }

//   public pause() {
//     this.audioElement?.pause();
//   }

//   public addEventListener(event: string, listener: Function) {
//     if (!this.eventListeners[event]) {
//       this.eventListeners[event] = [];
//     }
//     this.eventListeners[event].push(listener);
//     this.audioElement?.addEventListener(event, listener);
//   }

//   public removeEventListener(event: string, listener: Function) {
//     const index = this.eventListeners[event]?.findIndex(fn => fn === listener);
//     if (index!== -1) {
//       this.eventListeners[event].splice(index, 1);
//       this.audioElement?.removeEventListener(event, listener);
//     }
//   }
  
//   public dispatchEvent(event: string, detail?: any) {
//     this.eventListeners[event]?.forEach(listener => listener(detail));
//   }

//   public getCurrentTime() {
//     this.initAudioElement()
//     return this.audioElement ? this.audioElement.currentTime : 0
//   }

//   public getDuration() {
//     this.initAudioElement()
//     return this.audioElement ? this.audioElement.duration : 0
//   }

//   public setCurrentTime(time) {
//     this.initAudioElement()
//     if (this.audioElement) {
//       this.audioElement.currentTime = time
//     }
//   }
// }
// export default AudioService.getInstance()