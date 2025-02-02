import { Observable } from '@nativescript/core';
import { UsageTracker } from './services/usage-tracker';

export class HelloWorldModel extends Observable {
  private _youtubeUrl: string = '';
  private _isProcessing: boolean = false;
  private _processingMessage: string = '';
  private _freeHoursRemaining: string = '5 hours remaining in free plan';
  private usageTracker: UsageTracker;

  constructor() {
    super();
    this.usageTracker = UsageTracker.getInstance();
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

    this.isProcessing = true;
    this.processingMessage = 'Analyzing video content...';

    try {
      // For demo purposes, assume 10 minutes of video processing
      const videoLength = 10;
      const usage = await this.usageTracker.trackUsage(videoLength);
      
      if (usage.remainingHours <= 0) {
        alert('You have reached your free plan limit. Please upgrade to continue.');
        return;
      }

      this.freeHoursRemaining = `${usage.remainingHours.toFixed(1)} hours remaining in free plan`;
      
      // Simulate processing - in real app, this would be an API call
      setTimeout(() => {
        this.isProcessing = false;
        this.processingMessage = '';
        alert('This is a demo version. API integration coming soon!');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the video');
    } finally {
      this.isProcessing = false;
      this.processingMessage = '';
    }
  }
}