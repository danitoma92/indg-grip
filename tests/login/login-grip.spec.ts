import { test, expect, Page, Browser, chromium } from '@playwright/test';
import { verifyDisabledLoginButton } from '../../utils/function';
import { selectors } from '../../utils/selectors';

// Test Cases: https://docs.google.com/spreadsheets/d/1w-j0w81bYddUbhiMTwSv1gpX31GRetGgxQfv0XuhHwA/edit#gid=0

test.describe('Grip login page tests', () => {

  let browser: Browser;
  let page: Page;
  const loginUrl = 'https://gripapi-development.azurewebsites.net/login';


  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    await page.goto(loginUrl);
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test('Login with valid email and valid password', async () => {
    // Enter valid email
    await page.fill(selectors.emailInput, selectors.validEmail);
    // Type valid password
    await page.fill(selectors.passwordInput, selectors.validPassword);
    
    // Click on Log in button
    await page.click(selectors.logInButton);

    // Verify that we are on the right page
    // expect(await page.textContent('body')).toContain('Welcome to Grip!'); - I do not have valid credentials
  });

  test('Login with invalid email and valid password', async () => {
    // Enter invalid email
    await page.fill(selectors.emailInput, 'invalid_email@123');
    // Enter valid password
    await page.fill(selectors.passwordInput, selectors.validPassword);
    
     // Wait for the email error message to be visible
    const invalidEmailError = 'div:has-text("Invalid email address")';
    await page.waitForSelector(invalidEmailError);
    // Check if the email error message is visible
    const errorMessageVisible = await page.isVisible(invalidEmailError);
    expect(errorMessageVisible).toBe(true);

    // Log in button should be on disabled state
    await verifyDisabledLoginButton(page, selectors.logInButton);
  });

  test('Login with valid email and no password', async () => {
    // Enter invalid email
    await page.fill(selectors.emailInput, selectors.validEmail);
    // No password is entered
    await page.fill(selectors.passwordInput, '');
    
     // Wait for the password error message to be visible
    const passwordIsRequired = 'div:has-text("Password is required")';
    await page.waitForSelector(passwordIsRequired);
    // Check if the password error message is visible
    const errorMessageVisible = await page.isVisible(passwordIsRequired);
    expect(errorMessageVisible).toBe(true);

    // Log in button should be on disabled state
    await verifyDisabledLoginButton(page, selectors.logInButton);
  });

  test('Login with no email and and valid password', async () => {
    // No email is entered
    await page.fill(selectors.emailInput, '1');
    await page.keyboard.press('Backspace');
     // Enter valid password
     await page.fill(selectors.passwordInput, selectors.validPassword);

    // Wait for the password error message to be visible
    const emailIsRequired = 'div:has-text("E-mail is required")';
    await page.waitForSelector(emailIsRequired);
     // Check if the password error message is visible
     const emailErrorMessage = await page.isVisible(emailIsRequired);
     expect(emailErrorMessage).toBe(true);
    
    // Log in button should be on disabled state
    await verifyDisabledLoginButton(page, selectors.logInButton);
  });

  test ('Check Forgot your password?', async () => {
    // Click on Forgot your password link
    await page.click('h5:has-text("Forgot your password?")');
    // Enter valid email
    await page.fill(selectors.emailInput, selectors.validEmail);

    // Click on Send the link button
    await page.click(selectors.logInButton); // here we can rename the constant for eg: logInAndSendTheLinkButton
    
    // Password recovery text container should be displayed
    await page.waitForSelector(selectors.subtmitMessage);
    const passwordRecoveryPage = await page.isVisible(selectors.subtmitMessage);
    expect(passwordRecoveryPage).toBe(true);

    // Click on Back to login link
    await page.click('a[data-test-component="passwordRecoveryPage__goBack textLink link"]');
    // Check Sign up button
    const isVisible = await page.isVisible('button[type="button"]');
    expect(isVisible).toBe(true); 
  });
});

/* How to execute the automated test 

    1.Install Node.js and npm:  install Node.js from nodejs.org. (skip this part if it is already installed)
    2.Install TypeScript -> You can install TypeScript globally using npm with the following command: npm install -g typescript (skip this part if it is already installed)
    3.Open project in VSCode or any code editor.
    4.Install Playwright: Install Playwright and its TypeScript types as dependencies in your project: npm install -D @playwright/test
    5.We can run tests locally in terminal with the command: npx playwright test "login-grip.spec.ts" (if we want to see in front-end test running, we can add --headed to this command)
    6.View Test Results: : After running the test, Playwright will display the test results in the terminal, indicating whether each test passed or failed.
*/