import { Http } from '@nativescript/core';

export class YouTubeService {
  private static instance: YouTubeService;
  private readonly API_KEY = 'AIzaSyDjdQER8VyVmrTNcEUJbhz_ZYJxVhLu_Yk';
  private readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';

  private constructor() {}

  public static getInstance(): YouTubeService {
    if (!YouTubeService.instance) {
      YouTubeService.instance = new YouTubeService();
    }
    return YouTubeService.instance;
  }

  async getVideoDetails(videoId: string) {
    try {
      const response = await Http.request({
        url: `${this.BASE_URL}/videos?part=snippet,contentDetails&id=${videoId}&key=${this.API_KEY}`,
        method: 'GET'
      });

      return response.content.toJSON();
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw new Error('Failed to fetch video details');
    }
  }

  async getTranscript(videoId: string) {
    try {
      const response = await Http.request({
        url: `${this.BASE_URL}/captions?part=snippet&videoId=${videoId}&key=${this.API_KEY}`,
        method: 'GET'
      });

      const data = response.content.toJSON();
      if (!data.items || data.items.length === 0) {
        throw new Error('No captions found for this video');
      }

      // Get the first available caption track
      const captionId = data.items[0].id;
      
      // Fetch the actual transcript
      const transcriptResponse = await Http.request({
        url: `${this.BASE_URL}/captions/${captionId}?key=${this.API_KEY}`,
        method: 'GET'
      });

      return transcriptResponse.content.toJSON();
    } catch (error) {
      console.error('Error fetching transcript:', error);
      throw new Error('Failed to fetch transcript');
    }
  }
}