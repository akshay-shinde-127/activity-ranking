import { BasePage } from './BasePage';

/**
 * Activity Search Page - Contains all locators and actions for the search page
 */
export class ActivitySearchPage extends BasePage {
  // Locators
  private readonly SEARCH_BOX = 'input[id="city-search"]';
  private readonly SUGGESTIONS_LIST = '.suggestions-list';
  private readonly SUGGESTIONS_ITEMS = `${this.SUGGESTIONS_LIST} li`;
  private readonly ACTIVITY_RESULTS = '[data-testid="activity-results"]';
  private readonly ERROR_MESSAGE = '[data-testid="error-message"]';
  private readonly INFO_MESSAGE = '[data-testid="info-message"]';
  private readonly NO_SUGGESTIONS_MESSAGE = '[data-testid="no-suggestions-message"]';
  private readonly TIMEOUT_MESSAGE = '[data-testid="timeout-message"]';
  private readonly RETRY_BUTTON = 'button:has-text("Retry")';
  private readonly FALLBACK_MESSAGE = '[data-testid="fallback-message"]';
  private readonly FALLBACK_ACTIVITIES = '[data-testid="fallback-activities"]';
  private readonly ACTIVITY_ITEM = '[data-activity]';
  private readonly ACTIVITY_RANK = '[data-rank]';
  private readonly ACTIVITY_REASONING = '[data-reasoning]';
  private readonly DATE_SECTION = '[data-date]';

  // Search actions
  async searchForCity(city: string) {
    await this.fill(this.SEARCH_BOX, '');
    await this.fill(this.SEARCH_BOX, city);
    await this.press(this.SEARCH_BOX, 'Enter');
    await this.waitForElement(this.ACTIVITY_RESULTS);
  }

  async typeInSearchBox(text: string) {
    await this.fill(this.SEARCH_BOX, text);
  }

  async getSearchBoxValue(): Promise<string> {
    return await this.getInputValue(this.SEARCH_BOX);
  }

  async clearSearchBox() {
    await this.fill(this.SEARCH_BOX, '');
  }

  // Autocomplete actions
  async waitForAutocomplete(timeout: number = 1000) {
    await this.waitForElement(this.SUGGESTIONS_LIST, timeout);
  }

  async getAutocompleteSuggestions(): Promise<string[]> {
    await this.waitForElement(`${this.SUGGESTIONS_ITEMS}:first-child`, 1000);
    return await this.getAllTextContents(this.SUGGESTIONS_ITEMS);
  }

  async selectSuggestion(suggestionText: string) {
    await this.click(`${this.SUGGESTIONS_LIST} li:has-text("${suggestionText}")`);
  }

  async getVisibleSuggestionsCount(): Promise<number> {
    return (await this.getAllLocators(this.SUGGESTIONS_ITEMS)).length;
  }

  // Results actions
  async waitForActivityResults(timeout: number = 5000) {
    await this.waitForElement(this.ACTIVITY_RESULTS, timeout);
  }

  async areResultsDisplayed(): Promise<boolean> {
    return await this.isVisible(this.ACTIVITY_RESULTS);
  }

  async getDisplayedDates(): Promise<string[]> {
    const dateElements = await this.getAllLocators(this.DATE_SECTION);
    const dates: string[] = [];

    for (const element of dateElements) {
      const date = await element.getAttribute('data-date');
      if (date) dates.push(date);
    }

    return [...new Set(dates)];
  }

  async getActivitiesForDate(date: string) {
    const dateSection = this.getLocator(`[data-date="${date}"]`);
    const activities = await dateSection.locator(this.ACTIVITY_ITEM).all();

    const result = [];
    for (const activity of activities) {
      const name = await activity.getAttribute('data-activity');
      const rank = await activity.locator(this.ACTIVITY_RANK).textContent();
      const reasoning = await activity.locator(this.ACTIVITY_REASONING).textContent();

      result.push({
        name,
        rank: parseInt(rank || '0'),
        reasoning,
      });
    }

    return result;
  }

  // Error/Message actions
  async getErrorMessage(): Promise<string | null> {
    return await this.getText(this.ERROR_MESSAGE);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.ERROR_MESSAGE);
  }

  async getInfoMessage(): Promise<string | null> {
    return await this.getText(this.INFO_MESSAGE);
  }

  async isInfoMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.INFO_MESSAGE);
  }

  async getNoSuggestionsMessage(): Promise<string | null> {
    return await this.getText(this.NO_SUGGESTIONS_MESSAGE);
  }

  async isNoSuggestionsMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.NO_SUGGESTIONS_MESSAGE);
  }

  // Timeout/Retry actions
  async isTimeoutMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.TIMEOUT_MESSAGE);
  }

  async isRetryButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.RETRY_BUTTON);
  }

  async clickRetry() {
    await this.click(this.RETRY_BUTTON);
    await this.waitForElement(this.ACTIVITY_RESULTS);
  }

  // Fallback actions
  async getFallbackMessage(): Promise<string | null> {
    return await this.getText(this.FALLBACK_MESSAGE);
  }

  async isFallbackActivitySectionVisible(): Promise<boolean> {
    return await this.isVisible(this.FALLBACK_ACTIVITIES);
  }
}

export default ActivitySearchPage;
