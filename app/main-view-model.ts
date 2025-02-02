import { Observable } from '@nativescript/core';
import { UsageTracker } from './services/usage-tracker';
import { YouTubeService } from './services/youtube.service';
import { extractYouTubeVideoId } from './utils/youtube-parser';

export class HelloWorldModel extends Observable {
  private _youtubeUrl: string = '';
  private _isProcessing: boolean = false;
  private _processingMessage: string = '';
  private _freeHoursRemaining: string = '5 hours remaining in free plan';
  private usageTracker: UsageTracker;
  private youtubeService: YouTubeService;

  constructor() {
    super();
    this.usageTracker = UsageTracker.getInstance();
    this.youtubeService = YouTubeService.getInstance();
  }

  get youtubeUrl(): string {
    return this._youtubeUrl;
  }

  set youtubeUrl(value: string) {
    if (this._youtubeUrl !== value) {
      this._youtubeUrl = value;
      this.notifyPropertyChange('youtubeUrl', value);
    }
  }

  get isProcessing(): boolean {
    return this._isProcessing;
  }

  set isProcessing(value: boolean) {
    if (this._isProcessing !== value) {
      this._isProcessing = value;
      this.notifyPropertyChange('isProcessing', value);
    }
  }

  get processingMessage(): string {
    return this._processingMessage;
  }

  set processingMessage(value: string) {
    if (this._processingMessage !== value) {
      this._processingMessage = value;
      this.notifyPropertyChange('processingMessage', value);
    }
  }

  get freeHoursRemaining(): string {
    return this._freeHoursRemaining;
  }

  set freeHoursRemaining(value: string) {
    if (this._freeHoursRemaining !== value) {
      this._freeHoursRemaining = value;
      this.notifyPropertyChange('freeHoursRemaining', value);
    }
  }

  async onGenerateClips() {
    if (!this._youtubeUrl) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    const videoId = extractYouTubeVideoId(this._youtubeUrl);
    if (!videoId) {
      alert('Invalid YouTube URL. Please enter a valid YouTube video URL.');
      return;
    }

    this.isProcessing = true;
    this.processingMessage = 'Analyzing video content...';

    try {
      // Fetch video details and transcript
      const [videoDetails, transcript] = await Promise.all([
        this.youtubeService.getVideoDetails(videoId),
        this.youtubeService.getTranscript(videoId)
      ]);

      // Extract video duration from contentDetails
      const duration = videoDetails.items[0].contentDetails.duration;
      // Convert ISO 8601 duration to minutes
      const videoLength = this.parseIsoDuration(duration);

      const usage = await this.usageTracker.trackUsage(videoLength);
      
      if (usage.remainingHours <= 0) {
        alert('You have reached your free plan limit. Please upgrade to continue.');
        return;
      }

      this.freeHoursRemaining = `${usage.remainingHours.toFixed(1)} hours remaining in free plan`;
      
      // Process video details and transcript
      const title = videoDetails.items[0].snippet.title;
      this.processingMessage = `Processing "${title}"...`;

      // Simulate processing - in real app, this would analyze the transcript
      setTimeout(() => {
        this.isProcessing = false;
        this.processingMessage = '';
        alert(`Video: ${title}\nTranscript loaded successfully!\nReady to generate clips.`);
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the video');
    } finally {
      this.isProcessing = false;
      this.processingMessage = '';
    }
  }

  private parseIsoDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    let minutes = 0;

    if (match) {
      const hours = match[1] ? parseInt(match[1].slice(0, -1)) : 0;
      const mins = match[2] ? parseInt(match[2].slice(0, -1)) : 0;
      const secs = match[3] ? parseInt(match[3].slice(0, -1)) : 0;

      minutes = hours * 60 + mins + Math.ceil(secs / 60);
    }

    return minutes || 1; // Return at least 1 minute
  }
}