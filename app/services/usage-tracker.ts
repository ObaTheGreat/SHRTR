import { Http } from '@nativescript/core';

interface UsageResponse {
  remainingHours: number;
  isPremium: boolean;
}

export class UsageTracker {
  private static instance: UsageTracker;
  private readonly API_URL = 'YOUR_SUPABASE_URL';
  private readonly API_KEY = 'YOUR_SUPABASE_ANON_KEY';

  private constructor() {}

  public static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker();
    }
    return UsageTracker.instance;
  }

  async trackUsage(videoLengthMinutes: number): Promise<UsageResponse> {
    try {
      const response = await Http.request({
        url: `${this.API_URL}/rest/v1/rpc/track_usage`,
        method: 'POST',
        headers: {
          'apikey': this.API_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        content: JSON.stringify({
          video_length_minutes: videoLengthMinutes
        })
      });

      const data = response.content.toJSON();
      return {
        remainingHours: data.remaining_hours,
        isPremium: data.is_premium
      };
    } catch (error) {
      console.error('Error tracking usage:', error);
      throw new Error('Failed to track usage');
    }
  }
}