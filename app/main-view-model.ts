import { Observable } from '@nativescript/core';

export class HelloWorldModel extends Observable {
  private _youtubeUrl: string = '';
  private _isProcessing: boolean = false;
  private _processingMessage: string = '';
  private _freeHoursRemaining: string = '5 hours remaining in free plan';

  constructor() {
    super();
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

  onGenerateClips() {
    if (!this._youtubeUrl) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    this.isProcessing = true;
    this.processingMessage = 'Analyzing video content...';

    // Simulate processing - in real app, this would be an API call
    setTimeout(() => {
      this.isProcessing = false;
      this.processingMessage = '';
      alert('This is a demo version. API integration coming soon!');
    }, 2000);
  }
}