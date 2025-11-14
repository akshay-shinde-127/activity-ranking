import { Page, Locator } from '@playwright/test';

/**
 * Base page class with common page operations
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async waitForElement(selector: string, timeout: number = 5000) {
    await this.getLocator(selector).waitFor({ timeout });
  }

  async fill(selector: string, text: string) {
    await this.getLocator(selector).fill(text);
  }

  async click(selector: string) {
    await this.getLocator(selector).click();
  }

  async type(selector: string, text: string) {
    await this.getLocator(selector).type(text);
  }

  async press(selector: string, key: string) {
    await this.getLocator(selector).press(key);
  }

  async getText(selector: string): Promise<string | null> {
    return await this.getLocator(selector).textContent();
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.getLocator(selector).isVisible();
  }

  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return await this.getLocator(selector).getAttribute(attribute);
  }

  async getInputValue(selector: string): Promise<string> {
    return await this.getLocator(selector).inputValue();
  }

  async getAllLocators(selector: string) {
    return await this.getLocator(selector).all();
  }

  async getAllTextContents(selector: string): Promise<string[]> {
    return await this.getLocator(selector).allTextContents();
  }
}
