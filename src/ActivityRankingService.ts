import { APIRequestContext, request } from '@playwright/test';

export class ActivityRankingService {
  private apiBaseUrl: string;
  private apiRequestContext: APIRequestContext | null = null;
  private openMeteoBaseUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(apiBaseUrl: string = 'http://localhost:3000/api') {
    this.apiBaseUrl = apiBaseUrl;
  }

  async initializeRequestContext(): Promise<void> {
    if (!this.apiRequestContext) {
      this.apiRequestContext = await request.newContext({ timeout: 5000 });
    }
  }

  async closeRequestContext(): Promise<void> {
    if (this.apiRequestContext) {
      await this.apiRequestContext.dispose();
      this.apiRequestContext = null;
    }
  }

  async getActivityRankings(city: string): Promise<any> {
    const encodedCity = encodeURIComponent(city);
    const response = await this.apiRequestContext!.get(
      `${this.apiBaseUrl}/activities/rank?city=${encodedCity}`
    );

    if (response.status() === 404) {
      throw new Error('City not found');
    }

    if (!response.ok()) {
      throw new Error(`API error: ${response.status()}`);
    }

    return response.json();
  }

  async getAutocompleteSuggestions(query: string): Promise<string[]> {
    const encodedQuery = encodeURIComponent(query);
    const response = await this.apiRequestContext!.get(
      `${this.apiBaseUrl}/cities/autocomplete?q=${encodedQuery}`
    );

    if (!response.ok()) {
      return [];
    }

    const data = await response.json();
    return data.suggestions || [];
  }

  async fetchWeatherData(lat: number, lon: number): Promise<any> {
    const queryParams = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weather_code',
      timezone: 'auto',
      forecast_days: '7',
    });

    const response = await this.apiRequestContext!.get(
      `${this.openMeteoBaseUrl}?${queryParams.toString()}`
    );

    if (!response.ok()) {
      throw new Error('Failed to fetch weather data');
    }

    return response.json();
  }

  validateCity(city: string): boolean {
    const cleanCity = city.replace(/[^a-zA-Z\s'-]/g, '');
    return cleanCity.trim().length > 0 && !!cleanCity.match(/[a-zA-Z]/);
  }
}

export default ActivityRankingService;
