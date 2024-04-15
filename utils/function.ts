import { Page, expect } from '@playwright/test';

export async function verifyDisabledLoginButton(page: Page, logInButton: string) {
    const isDisabled = await page.$eval(logInButton, (button) => button.hasAttribute('disabled'));
    expect(isDisabled).toBe(true);
}
