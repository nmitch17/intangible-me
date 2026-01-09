/**
 * Authentication helpers for dev-browser skill
 *
 * Environment variables (set in project's .env or .env.local):
 * - DEV_BROWSER_LOGIN_URL: URL of the login page (default: http://localhost:3000/login)
 * - DEV_BROWSER_LOGIN_EMAIL: Email/username for login
 * - DEV_BROWSER_LOGIN_PASSWORD: Password for login
 * - DEV_BROWSER_LOGIN_EMAIL_SELECTOR: CSS selector for email input (default: input[type="email"], input[name="email"])
 * - DEV_BROWSER_LOGIN_PASSWORD_SELECTOR: CSS selector for password input (default: input[type="password"])
 * - DEV_BROWSER_LOGIN_SUBMIT_SELECTOR: CSS selector for submit button (default: button[type="submit"])
 * - DEV_BROWSER_LOGIN_SUCCESS_URL: URL pattern to wait for after login (optional)
 * - DEV_BROWSER_LOGIN_SUCCESS_SELECTOR: Selector to wait for after login (optional)
 * - DEV_BROWSER_AUTH_TYPE: Authentication type - "standard" or "clerk" (default: auto-detect)
 */

import type { Page } from "playwright";
import { waitForPageLoad } from "./client.js";

export type AuthType = "standard" | "clerk" | "auto";

export interface LoginConfig {
  loginUrl?: string;
  email?: string;
  password?: string;
  emailSelector?: string;
  passwordSelector?: string;
  submitSelector?: string;
  successUrl?: string;
  successSelector?: string;
  authType?: AuthType;
}

export interface LoginResult {
  success: boolean;
  message: string;
  url: string;
}

/**
 * Get login configuration from environment variables
 */
export function getLoginConfig(): LoginConfig {
  return {
    loginUrl: process.env.DEV_BROWSER_LOGIN_URL || "http://localhost:3000/login",
    email: process.env.DEV_BROWSER_LOGIN_EMAIL,
    password: process.env.DEV_BROWSER_LOGIN_PASSWORD,
    emailSelector: process.env.DEV_BROWSER_LOGIN_EMAIL_SELECTOR || 'input[type="email"], input[name="email"], input[name="username"], input[name="identifier"]',
    passwordSelector: process.env.DEV_BROWSER_LOGIN_PASSWORD_SELECTOR || 'input[type="password"]',
    submitSelector: process.env.DEV_BROWSER_LOGIN_SUBMIT_SELECTOR || 'button[type="submit"], button:has-text("Sign in"), button:has-text("Login"), button:has-text("Log in")',
    successUrl: process.env.DEV_BROWSER_LOGIN_SUCCESS_URL,
    successSelector: process.env.DEV_BROWSER_LOGIN_SUCCESS_SELECTOR,
    authType: (process.env.DEV_BROWSER_AUTH_TYPE as AuthType) || "auto",
  };
}

/**
 * Check if login credentials are configured
 */
export function hasLoginCredentials(): boolean {
  const config = getLoginConfig();
  return !!(config.email && config.password);
}

/**
 * Detect if the current page is a Clerk sign-in page
 */
async function isClerkPage(page: Page): Promise<boolean> {
  try {
    // Check for Clerk-specific indicators
    const hasClerkIdentifier = await page.$('input[name="identifier"]');
    const hasClerkDomain = page.url().includes('clerk') || page.url().includes('accounts.');
    const hasClerkUI = await page.$('[data-clerk-component]');

    return !!(hasClerkIdentifier || hasClerkDomain || hasClerkUI);
  } catch {
    return false;
  }
}

/**
 * Perform Clerk two-step authentication
 * Clerk uses: Email → Continue → Password → Sign In
 */
async function clerkLogin(page: Page, config: LoginConfig): Promise<LoginResult> {
  try {
    // Wait for email/identifier input
    const emailSelectors = 'input[name="identifier"], input[type="email"], [data-testid="sign-in-email-input"]';
    await page.waitForSelector(emailSelectors, { timeout: 10000 });

    // Fill email
    const emailInput = page.locator(emailSelectors).first();
    await emailInput.fill(config.email!);

    // Click Continue/Next button (Clerk's first step)
    const continueButton = page.locator('button:has-text("Continue"), button:has-text("Next"), button[type="submit"]').first();
    await continueButton.click();

    // Wait for password field (Clerk's second step)
    await page.waitForSelector('input[type="password"], input[name="password"]', { timeout: 10000 });

    // Fill password
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await passwordInput.fill(config.password!);

    // Click Sign In button
    const signInButton = page.locator('button:has-text("Sign in"), button:has-text("Continue"), button[type="submit"]').first();
    await signInButton.click();

    // Wait for successful login
    if (config.successUrl) {
      await page.waitForURL(config.successUrl, { timeout: 30000 });
    } else if (config.successSelector) {
      await page.waitForSelector(config.successSelector, { timeout: 30000 });
    } else {
      // Default: wait for redirect away from Clerk/login pages
      await page.waitForFunction(
        () => {
          const url = window.location.href.toLowerCase();
          return !url.includes('login') &&
                 !url.includes('sign-in') &&
                 !url.includes('signin') &&
                 !url.includes('clerk') &&
                 !url.includes('accounts.');
        },
        { timeout: 30000 }
      );
    }

    await waitForPageLoad(page);

    return {
      success: true,
      message: "Clerk login successful",
      url: page.url(),
    };
  } catch (error) {
    return {
      success: false,
      message: `Clerk login failed: ${error instanceof Error ? error.message : String(error)}`,
      url: page.url(),
    };
  }
}

/**
 * Perform standard single-page login
 */
async function standardLogin(page: Page, config: LoginConfig): Promise<LoginResult> {
  try {
    // Fill email/username
    const emailInput = await page.waitForSelector(config.emailSelector!, { timeout: 5000 });
    await emailInput?.fill(config.email!);

    // Fill password
    const passwordInput = await page.waitForSelector(config.passwordSelector!, { timeout: 5000 });
    await passwordInput?.fill(config.password!);

    // Click submit
    const submitButton = await page.waitForSelector(config.submitSelector!, { timeout: 5000 });
    await submitButton?.click();

    // Wait for success
    if (config.successUrl) {
      await page.waitForURL(config.successUrl, { timeout: 10000 });
    } else if (config.successSelector) {
      await page.waitForSelector(config.successSelector, { timeout: 10000 });
    } else {
      // Default: wait for URL to change from login page
      await page.waitForFunction(
        (loginUrl) => !window.location.href.includes('login'),
        config.loginUrl,
        { timeout: 10000 }
      );
    }

    await waitForPageLoad(page);

    return {
      success: true,
      message: "Login successful",
      url: page.url(),
    };
  } catch (error) {
    return {
      success: false,
      message: `Login failed: ${error instanceof Error ? error.message : String(error)}`,
      url: page.url(),
    };
  }
}

/**
 * Perform login using environment variables
 *
 * @param page - Playwright page instance
 * @param overrides - Optional overrides for login config
 * @returns LoginResult indicating success/failure
 */
export async function login(page: Page, overrides: Partial<LoginConfig> = {}): Promise<LoginResult> {
  const config = { ...getLoginConfig(), ...overrides };

  if (!config.email || !config.password) {
    return {
      success: false,
      message: "Missing login credentials. Set DEV_BROWSER_LOGIN_EMAIL and DEV_BROWSER_LOGIN_PASSWORD environment variables.",
      url: page.url(),
    };
  }

  try {
    // Navigate to login page if not already there
    const currentPath = page.url().replace(/^https?:\/\/[^/]+/, '');
    const loginPath = config.loginUrl!.replace(/^https?:\/\/[^/]+/, '');

    if (!currentPath.includes(loginPath) && !isLoginPage(page.url())) {
      await page.goto(config.loginUrl!);
      await waitForPageLoad(page);
    }

    // Determine auth type
    let authType = config.authType;
    if (authType === "auto") {
      authType = await isClerkPage(page) ? "clerk" : "standard";
    }

    // Perform login based on auth type
    if (authType === "clerk") {
      return await clerkLogin(page, config);
    } else {
      return await standardLogin(page, config);
    }
  } catch (error) {
    return {
      success: false,
      message: `Login failed: ${error instanceof Error ? error.message : String(error)}`,
      url: page.url(),
    };
  }
}

/**
 * Check if the page is on a login page (heuristic)
 */
export function isLoginPage(url: string): boolean {
  const loginPatterns = ['/login', '/signin', '/sign-in', '/auth', '/authenticate'];
  return loginPatterns.some(pattern => url.toLowerCase().includes(pattern));
}

/**
 * Auto-login if redirected to login page
 *
 * @param page - Playwright page instance
 * @param targetUrl - The URL we originally wanted to visit
 * @returns LoginResult if login was performed, null if no login needed
 */
export async function autoLoginIfNeeded(page: Page, targetUrl: string): Promise<LoginResult | null> {
  const currentUrl = page.url();

  if (isLoginPage(currentUrl) && !isLoginPage(targetUrl)) {
    // We were redirected to login, attempt auto-login
    if (hasLoginCredentials()) {
      const result = await login(page);
      if (result.success) {
        // Navigate back to original target
        await page.goto(targetUrl);
        await waitForPageLoad(page);
        result.url = page.url();
      }
      return result;
    } else {
      return {
        success: false,
        message: "Redirected to login page but no credentials configured. Set DEV_BROWSER_LOGIN_EMAIL and DEV_BROWSER_LOGIN_PASSWORD.",
        url: currentUrl,
      };
    }
  }

  return null;
}
