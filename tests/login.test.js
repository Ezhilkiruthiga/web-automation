const { expect } = require('chai');
const DriverManager = require('../utils/DriverManager');
const configReader = require('../utils/ConfigReader');
const LoginPage = require('../pages/LoginPage');
const ScreenshotHelper = require('../utils/ScreenshotHelper');

describe('Login Functionality', function() {
    let driverManager;
    let driver;
    let loginPage;
    let screenshotHelper;

    before(async function() {
        driverManager = new DriverManager();
        driver = await driverManager.initializeDriver();
        screenshotHelper = new ScreenshotHelper(driver);
        loginPage = new LoginPage(driver);
    });

    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            await screenshotHelper.captureScreenshotWithContext(
                this.currentTest.title,
                { test: this.currentTest }
            );
        }
    });

    after(async function() {
        await driverManager.quitDriver();
    });

    it('should login successfully with valid credentials', async function() {
        await driver.get(configReader.getBaseUrl());
        const credentials = configReader.getCredentials();
        const dashboardPage = await loginPage.login(
            credentials.email,
            credentials.password
        );
        // Assuming dashboardPage.isDashboardDisplayed() checks for successful login
        const isLoggedIn = await dashboardPage.isDashboardDisplayed();
        expect(isLoggedIn, 'User should be logged in').to.be.true;
    });

    it('should fail login with invalid credentials', async function() {
        await driver.get(configReader.getBaseUrl());
        // Try to login with invalid user
        const dashboardPage = await loginPage.login(
            'invalid-user@email.com',
            'wrongPassword'
        );
		const isNotLoggedIn = await dashboardPage.isDashboardDisplayed();
		        expect(isNotLoggedIn, 'User should be not logged in').to.be.false;
          });
});