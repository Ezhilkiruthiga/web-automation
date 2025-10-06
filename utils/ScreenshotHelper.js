const fs = require('fs');
const path = require('path');
const configReader = require('./ConfigReader');

class ScreenshotHelper {
    constructor(driver) {
        this.driver = driver;
        this.screenshotDir = configReader.getScreenshotPath();
        this.ensureDirectoryExists();
    }

    ensureDirectoryExists() {
        if (!fs.existsSync(this.screenshotDir)) {
            fs.mkdirSync(this.screenshotDir, { recursive: true });
            console.log(`Created screenshot directory: ${this.screenshotDir}`);
        }
    }

    async captureScreenshot(testName) {
        try {
            if (!configReader.isScreenshotOnFailure()) {
                return null;
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const sanitizedTestName = testName.replace(/[^a-z0-9]/gi, '_');
            const filename = `${sanitizedTestName}_${timestamp}.png`;
            const filepath = path.join(this.screenshotDir, filename);

            const image = await this.driver.takeScreenshot();
            fs.writeFileSync(filepath, image, 'base64');
            
            console.log(`Screenshot saved: ${filepath}`);
            return filepath;
        } catch (error) {
            console.error('Failed to capture screenshot:', error.message);
            return null;
        }
    }

    async captureScreenshotWithContext(testName, context = {}) {
        const screenshotPath = await this.captureScreenshot(testName);
        
        if (screenshotPath && context.test) {
            // Attach screenshot to mochawesome report
            const relativeScreenshotPath = path.relative(process.cwd(), screenshotPath);
            context.test.context = `<img src="../${relativeScreenshotPath}" style="max-width: 100%; height: auto;"/>`;
        }
        
        return screenshotPath;
    }
}

module.exports = ScreenshotHelper;