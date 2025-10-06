const { expect } = require('chai');
const DriverManager = require('../utils/DriverManager');
const configReader = require('../utils/ConfigReader');
const LoginPage = require('../pages/LoginPage');
const ScreenshotHelper = require('../utils/ScreenshotHelper');

describe('Task Management Functionality', function() {
    let driverManager;
    let driver;
    let loginPage;
    let taskPage;
    let testTaskName;
    let screenshotHelper;

    before(async function() {
        driverManager = new DriverManager();
        driver = await driverManager.initializeDriver();
        screenshotHelper = new ScreenshotHelper(driver);

        // Login once before all tests
        await driver.get(configReader.getBaseUrl());
        loginPage = new LoginPage(driver);

        const credentials = configReader.getCredentials();
        taskPage = await loginPage.login(
            credentials.email,
            credentials.password
        );

        // Wait for dashboard to be loaded after login
        await driver.sleep(2000);
        const isDashboard = await taskPage.isDashboardDisplayed();
        if (!isDashboard) {
            throw new Error('Failed to load dashboard after login');
        }
    });

    beforeEach(function() {
        // Generate a unique task name for each test
        const testData = configReader.getTestData();
        testTaskName = `${testData.tasks.taskPrefix} ${Date.now()}`;
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

    it('should create a new task successfully', async function() {
        await taskPage.createTask(testTaskName);
        const isDisplayed = await taskPage.isTaskDisplayed(testTaskName);
        expect(isDisplayed, 'Task should be visible in the list').to.be.true;
    });

    it('should complete a task successfully', async function() {
       // await taskPage.createTask(testTaskName);
        const isDisplayed = await taskPage.isTaskDisplayed(testTaskName);
        expect(isDisplayed, 'Task should be created first').to.be.true;

        const completed = await taskPage.completeTask(testTaskName);
        expect(completed, 'Task should be completed').to.be.true;
    });
});