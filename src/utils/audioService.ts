class AudioService {
  private static instance: AudioService;

  private audioElement: HTMLAudioElement | null = null;
  private eventListeners: { [key: string]: Function[] } = {};

  private constructor() {
    this.initAudioElement();
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  private initAudioElement() {
    if (!this.audioElement) {
      this.audioElement = new Audio();
      console.log('audio initialized', this.audioElement)
    }
  }

  public setAudioSource(sourceUrl: string) {
    if (this.audioElement) {
      this.audioElement.src = sourceUrl;
      this.audioElement.load();
    } else {
      console.error('audioElement is not initialized.');
    }
  }

  public play() {
    this.audioElement?.play();
  }

  public pause() {
    this.audioElement?.pause();
  }

  public addEventListener(event: string, listener: Function) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(listener);
    this.audioElement?.addEventListener(event, listener);
  }

  public removeEventListener(event: string, listener: Function) {
    const index = this.eventListeners[event]?.findIndex(fn => fn === listener);
    if (index!== -1) {
      this.eventListeners[event].splice(index, 1);
      this.audioElement?.removeEventListener(event, listener);
    }
  }
  
  public dispatchEvent(event: string, detail?: any) {
    this.eventListeners[event]?.forEach(listener => listener(detail));
  }

  public getCurrentTime() {
    this.initAudioElement()
    return this.audioElement ? this.audioElement.currentTime : 0
  }

  public getDuration() {
    this.initAudioElement()
    return this.audioElement ? this.audioElement.duration : 0
  }

  public setCurrentTime(time) {
    this.initAudioElement()
    if (this.audioElement) {
      this.audioElement.currentTime = time
    }
  }
}
export default AudioService.getInstance()