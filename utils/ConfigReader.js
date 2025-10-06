const fs = require('fs');
const path = require('path');

class ConfigReader {
    constructor() {
        const configPath = path.join(__dirname, '../config/config.json');
        this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        
        const testDataPath = path.join(__dirname, '../test-data/testData.json');
        this.testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));
    }

    getBaseUrl() {
        return this.config.baseUrl;
    }

    getBrowser() {
        return this.config.browser;
    }

    isHeadless() {
        return this.config.headless;
    }

    getImplicitWait() {
        return this.config.implicitWait;
    }

    getExplicitWait() {
        return this.config.explicitWait;
    }

    getCredentials() {
        return this.config.credentials;
    }

    getTestData() {
        return this.testData;
    }

    isScreenshotOnFailure() {
        return this.config.screenshotOnFailure !== false;
    }

    getScreenshotPath() {
        return this.config.screenshotPath || './screenshots';
    }
}

module.exports = new ConfigReader();