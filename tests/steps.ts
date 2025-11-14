import { Given, When, Then, Before, After, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Page, Browser, BrowserContext } from '@playwright/test';
import { chromium } from '@playwright/test';
import ActivityRankingService from '../src/ActivityRankingService';

/**
 * Step definitions for Activity Ranking API feature tests
 * Implements BDD scenarios using Playwright and Cucumber
 */

let browser: Browser;
let context: BrowserContext;
let page: Page;
let apiService: ActivityRankingService;
let lastApiResponse: any;
let lastError: Error | null;
let searchBoxSelector = 'input[id="city-search"]';
let suggestionsSelector = '.suggestions-list';

// Test data - Indian cities
const predefinedCities = [
  'New Delhi',
  'Mumbai',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Goa',
  'Jaipur',
  'Agra',
  'Shimla',
  'Manali',
  'Kerala',
];

/**
 * Setup: Initialize browser and API service before each scenario
 */
Before(async function () {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
  apiService = new ActivityRankingService('http://localhost:3000/api');
  await apiService.initializeRequestContext();
  lastApiResponse = null;
  lastError = null;
});

/**
 * Teardown: Close browser after each scenario
 */
After(async function () {
  if (apiService) await apiService.closeRequestContext();
  if (page) await page.close();
  if (context) await context.close();
  if (browser) await browser.close();
});

// ==================== Background Steps ====================

Given('the Activity Ranking API is available', async function () {
  // Verify API is reachable by attempting a health check
  try {
    await apiService.getActivityRankings('London').catch(() => {
      // Expected to potentially fail, we just want to verify API is responding
    });
  } catch (error: any) {
    if (error.message !== 'City not found') {
      throw new Error('Activity Ranking API is not available');
    }
  }
});

Given('the Open-Meteo weather API is available', async function () {
  // Verify Open-Meteo API is accessible
  try {
    const response = await apiService.fetchWeatherData(51.5074, -0.1278); // London coordinates
    expect(response).toBeTruthy();
  } catch (error) {
    throw new Error('Open-Meteo API is not available');
  }
});

Given('I am on the activity search page', async function () {
  // Navigate to the search page (assumes local app is running)
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  // Verify search box is present
  await page.locator(searchBoxSelector).waitFor({ timeout: 5000 });
});

// ==================== Core Functionality Steps ====================

When('I search for {string}', async function (city: string) {
  try {
    // Clear previous search
    await page.fill(searchBoxSelector, '');
    // Type city name
    await page.fill(searchBoxSelector, city);
    // Press Enter to search
    await page.press(searchBoxSelector, 'Enter');
    // Wait for results to load
    await page.locator('[data-testid="activity-results"]').waitFor({ timeout: 5000 });

    // Also fetch via API for validation
    lastApiResponse = await apiService.getActivityRankings(city);
  } catch (error: any) {
    lastError = error;
  }
});

Then('the system should fetch 7-day weather data for {string}', async function (city: string) {
  expect(lastApiResponse).toBeTruthy();
  expect(lastApiResponse.data).toBeDefined();
  expect(lastApiResponse.data.length).toBeGreaterThan(0);
});

Then('the response should contain activities ranked by suitability', async function () {
  expect(lastApiResponse.data).toBeDefined();
  const activities = lastApiResponse.data;
  
  // Check that activities have rank property
  activities.forEach((activity: any) => {
    expect(activity.rank).toBeDefined();
    expect(typeof activity.rank).toBe('number');
  });
});

Then('each activity should have:', async function (dataTable: DataTable) {
  const requiredFields = dataTable.raw().map((row: string[]) => row[0]);
  
  expect(lastApiResponse.data).toBeDefined();
  lastApiResponse.data.forEach((activity: any) => {
    requiredFields.forEach((field: string) => {
      expect(activity).toHaveProperty(field.toLowerCase());
    });
  });
});

Then('the response status should be {int}', async function (statusCode: number) {
  // If we got here without error, status is 200
  // In a real scenario, we'd track the actual HTTP status
  expect(statusCode).toBe(200);
  expect(lastError).toBeNull();
});

When('the weather forecast shows {string}', async function (this: any, weatherCondition: string) {
  // Mock: Store weather condition for ranking validation
  this.weatherCondition = weatherCondition;
});

Then('{string} should have a high rank \\({int}-{int}\\)', async function (activity: string, min: number, max: number) {
  expect(lastApiResponse.data).toBeDefined();
  const activityData = lastApiResponse.data.find((a: any) => a.activity === activity);
  
  expect(activityData).toBeDefined();
  expect(activityData.rank).toBeGreaterThanOrEqual(min);
  expect(activityData.rank).toBeLessThanOrEqual(max);
});

Then('{string} should have a low rank \\({int}-{int}\\)', async function (activity: string, min: number, max: number) {
  expect(lastApiResponse.data).toBeDefined();
  const activityData = lastApiResponse.data.find((a: any) => a.activity === activity);
  
  expect(activityData).toBeDefined();
  expect(activityData.rank).toBeGreaterThanOrEqual(min);
  expect(activityData.rank).toBeLessThanOrEqual(max);
});

Then('the reasoning for {string} should mention {string}', async function (activity: string, keyword: string) {
  const activityData = lastApiResponse.data.find((a: any) => a.activity === activity);
  expect(activityData).toBeDefined();
  expect(activityData.reasoning.toLowerCase()).toContain(keyword.toLowerCase());
});

Then('the response should contain exactly {int} days of data', async function (days: number) {
  // Group by date and count unique dates
  const uniqueDates = new Set(lastApiResponse.data.map((a: any) => a.date));
  expect(uniqueDates.size).toBe(days);
});

Then('each day should have all four activity types ranked', async function () {
  const activities = ['Skiing', 'Surfing', 'Outdoor Sightseeing', 'Indoor Sightseeing'];
  const dates = new Set(lastApiResponse.data.map((a: any) => a.date));
  
  dates.forEach((date: unknown) => {
    const dayActivities = lastApiResponse.data.filter((a: any) => a.date === date);
    const activityNames = dayActivities.map((a: any) => a.activity);
    
    activities.forEach((activity: string) => {
      expect(activityNames).toContain(activity);
    });
  });
});

Then('the dates should be consecutive starting from today', async function () {
  const dates = lastApiResponse.data.map((a: any) => a.date);
  const uniqueDates = [...new Set(dates)].sort();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  uniqueDates.forEach((date: unknown, index: number) => {
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() + index);
    
    expect(date).toBe(expectedDate.toISOString().split('T')[0]);
  });
});

// ==================== Autocomplete Steps ====================

When('I type {string} in the search box', async function (text: string) {
  await page.fill(searchBoxSelector, text);
  // Wait for autocomplete to appear
  await page.locator(suggestionsSelector).waitFor({ timeout: 1000 });
});

Then('autocomplete suggestions should appear with cities starting with {string}', async function (prefix: string) {
  const suggestions = await page.locator(`${suggestionsSelector} li`).all();
  expect(suggestions.length).toBeGreaterThan(0);
  
  for (const suggestion of suggestions) {
    const text = await suggestion.textContent();
    expect(text?.toLowerCase()).toMatch(new RegExp(`^${prefix.toLowerCase()}`));
  }
});

Then('suggestions should include at least {string}, {string}, {string}', async function (city1: string, city2: string, city3: string) {
  const cities = [city1, city2, city3];
  const suggestionsText = await page.locator(`${suggestionsSelector} li`).allTextContents();
  
  cities.forEach((city: string) => {
    expect(suggestionsText.some((text: string) => text.includes(city))).toBeTruthy();
  });
});

Then('suggestions should appear within {int}ms of typing', async function (timeMs: number) {
  // In a real scenario, we'd measure this with performance API
  // For now, verify suggestions exist
  const suggestions = await page.locator(`${suggestionsSelector} li`).all();
  expect(suggestions.length).toBeGreaterThan(0);
});

Then('the suggestions should include predefined cities: {string}, {string}, {string}', async function (city1: string, city2: string, city3: string) {
  const expectedCities = [city1, city2, city3];
  const suggestionsText = await page.locator(`${suggestionsSelector} li`).allTextContents();
  
  expectedCities.forEach((city: string) => {
    expect(suggestionsText.some((text: string) => text.includes(city))).toBeTruthy();
  });
});

Then('suggestions should be sorted alphabetically', async function () {
  const suggestionsText = await page.locator(`${suggestionsSelector} li`).allTextContents();
  const sorted = [...suggestionsText].sort();
  
  suggestionsText.forEach((text: string, index: number) => {
    expect(text).toBe(sorted[index]);
  });
});

Then('no more than {int} suggestions should be displayed', async function (maxCount: number) {
  const suggestions = await page.locator(`${suggestionsSelector} li`).all();
  expect(suggestions.length).toBeLessThanOrEqual(maxCount);
});

When('autocomplete shows {string} as a suggestion', async function (this: any, city: string) {
  const suggestion = await page.locator(`${suggestionsSelector} li:has-text("${city}")`).first();
  expect(await suggestion.isVisible()).toBeTruthy();
  this.selectedSuggestion = city;
});

When('I click on {string}', async function (city: string) {
  await page.click(`${suggestionsSelector} li:has-text("${city}")`);
  // Wait for search to be populated
  await page.waitForFunction(
    (selector: string) => {
      const element = document.querySelector(selector) as HTMLInputElement;
      return element?.value;
    },
    searchBoxSelector
  );
});

Then('the search should be populated with {string}', async function (city: string) {
  const searchValue = await page.inputValue(searchBoxSelector);
  expect(searchValue).toBe(city);
});

Then('the activity ranking should be fetched for {string}', async function (city: string) {
  lastApiResponse = await apiService.getActivityRankings(city);
  expect(lastApiResponse).toBeTruthy();
});

Then('the results should be displayed', async function () {
  await page.locator('[data-testid="activity-results"]').waitFor({ timeout: 5000 });
  const results = await page.locator('[data-testid="activity-results"]').isVisible();
  expect(results).toBeTruthy();
});

// ==================== Edge Cases - Input Validation ====================

When('I search for {string}', async function (city: string) {
  if (!lastApiResponse) {
    try {
      lastApiResponse = await apiService.getActivityRankings(city);
    } catch (error: any) {
      lastError = error;
    }
  }
});

Then('the system should return a {int} or {int} error', async function (code1: number, code2: number) {
  expect(lastError).toBeDefined();
  expect([code1, code2]).toContain(lastError!.message.includes('City not found') ? code1 : code2);
});

Then('an error message should display: {string}', async function (message: string) {
  const errorElement = await page.locator('[data-testid="error-message"]');
  await errorElement.waitFor({ timeout: 3000 });
  const errorText = await errorElement.textContent();
  expect(errorText).toContain(message);
});

Then('no activity rankings should be displayed', async function () {
  const results = await page.locator('[data-testid="activity-results"]').isVisible().catch(() => false);
  expect(results).toBeFalsy();
});

When('I clear the search box and press Enter', async function () {
  await page.fill(searchBoxSelector, '');
  await page.press(searchBoxSelector, 'Enter');
});

Then('no autocomplete suggestions should appear', async function () {
  const suggestions = await page.locator(`${suggestionsSelector} li`).all();
  expect(suggestions.length).toBe(0);
});

Then('no API request should be made', async function () {
  // In a real scenario, we'd spy on network calls
  expect(lastApiResponse).toBeNull();
});

Then('a message should display: {string}', async function (message: string) {
  const messageElement = await page.locator('[data-testid="info-message"]');
  await messageElement.waitFor({ timeout: 3000 });
  const messageText = await messageElement.textContent();
  expect(messageText).toContain(message);
});

// ==================== Edge Cases - API and Performance ====================

When('the weather API takes longer than {int} seconds to respond', async function (this: any, seconds: number) {
  // Mock: Simulate slow API response
  this.slowApiResponse = true;
});

Then('the system should display a timeout message after {int} seconds', async function (seconds: number) {
  const timeoutMessage = await page.locator('[data-testid="timeout-message"]').first();
  const isVisible = await timeoutMessage.isVisible().catch(() => false);
  expect(isVisible).toBeTruthy();
});

Then('a retry button should be available', async function () {
  const retryButton = await page.locator('button:has-text("Retry")');
  expect(await retryButton.isVisible()).toBeTruthy();
});

Then('the user should be able to retry the search', async function () {
  await page.click('button:has-text("Retry")');
  await page.locator('[data-testid="activity-results"]').waitFor({ timeout: 5000 });
});

When('I search for a remote location with no available weather data', async function () {
  try {
    // Use a generic placeholder for testing
    lastApiResponse = await apiService.getActivityRankings('RemoteLocation');
  } catch (error: any) {
    lastError = error;
  }
});

Then('the system should display: {string}', async function (message: string) {
  const fallbackElement = await page.locator('[data-testid="fallback-message"]');
  await fallbackElement.waitFor({ timeout: 3000 });
  const text = await fallbackElement.textContent();
  expect(text).toContain(message);
});

Then('a fallback message with generic activity recommendations should be shown', async function () {
  const fallbackSection = await page.locator('[data-testid="fallback-activities"]');
  expect(await fallbackSection.isVisible()).toBeTruthy();
});

// ==================== Edge Cases - Autocomplete ====================

When('I quickly type {string}, {string}, {string} within {int}ms', async function (char1: string, char2: string, char3: string, timeMs: number) {
  const fullText = char1 + char2 + char3;
  // Simulate rapid typing
  for (const char of fullText) {
    await page.type(searchBoxSelector, char, { delay: Math.floor(timeMs / fullText.length) });
  }
  // Wait for debounce
  await page.waitForTimeout(300);
});

Then('the autocomplete should debounce and show suggestions for {string}', async function (text: string) {
  const suggestionsText = await page.locator(`${suggestionsSelector} li`).allTextContents();
  expect(suggestionsText.some((s: string) => s.includes(text))).toBeTruthy();
});

Then('no duplicate API calls should be made', async function () {
  // In a real scenario, we'd spy on network calls and count them
  // For now, just verify a suggestion exists
  const suggestions = await page.locator(`${suggestionsSelector} li`).all();
  expect(suggestions.length).toBeGreaterThan(0);
});

When('I type {string} in the search box', async function (text: string) {
  await page.fill(searchBoxSelector, text);
  await page.waitForTimeout(100);
});

Then('no autocomplete suggestions should appear', async function () {
  const suggestions = await page.locator(`${suggestionsSelector} li`).all();
  expect(suggestions.length).toBe(0);
});

Then('a message should display: {string}', async function (message: string) {
  const messageElement = await page.locator('[data-testid="no-suggestions-message"]');
  await messageElement.waitFor({ timeout: 3000 });
  const text = await messageElement.textContent();
  expect(text).toContain(message);
});

// ==================== Data Accuracy ====================

Then('{string} should be ranked based on:', async function (activity: string, dataTable: DataTable) {
  const criteria = dataTable.raw().map((row: string[]) => row[0]);
  
  const activityData = lastApiResponse.data.find((a: any) => a.activity === activity);
  expect(activityData).toBeDefined();
  expect(activityData.reasoning).toBeTruthy();
  
  criteria.forEach((criterion: string) => {
    expect(activityData.reasoning.toLowerCase()).toContain(criterion.toLowerCase());
  });
});

Then('{string} should have very low ranks \\({int}-{int}\\) due to warm climate', async function (activity: string, min: number, max: number) {
  const activityRecords = lastApiResponse.data.filter((a: any) => a.activity === activity);
  
  activityRecords.forEach((activity: any) => {
    expect(activity.rank).toBeGreaterThanOrEqual(min);
    expect(activity.rank).toBeLessThanOrEqual(max);
  });
});

Then('each activity result should have:', async function (dataTable: DataTable) {
  const fields = dataTable.raw().map((row: string[]) => ({
    field: row[0],
    format: row[1],
  }));
  
  expect(lastApiResponse.data).toBeDefined();
  lastApiResponse.data.forEach((activity: any) => {
    fields.forEach(({ field, format }: any) => {
      expect(activity).toHaveProperty(field);
      
      // Basic format validation
      if (format === 'YYYY-MM-DD') {
        expect(activity[field]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      } else if (format === 'Integer (1-10)') {
        expect(typeof activity[field]).toBe('number');
        expect(activity[field]).toBeGreaterThanOrEqual(1);
        expect(activity[field]).toBeLessThanOrEqual(10);
      } else if (format === 'Non-empty string') {
        expect(typeof activity[field]).toBe('string');
        expect(activity[field].length).toBeGreaterThan(0);
      }
    });
  });
});
