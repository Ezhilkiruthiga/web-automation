const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');
const configReader = require('./ConfigReader');

class DriverManager {
    constructor() {
        this.driver = null;
    }

    async initializeDriver() {
        const browser = configReader.getBrowser();
        const isHeadless = configReader.isHeadless();

        let options;
        
        switch (browser.toLowerCase()) {
            case 'chrome':
                options = new chrome.Options();
                if (isHeadless) {
                    options.addArguments('--headless');
                }
                options.addArguments('--start-maximized');
                options.addArguments('--disable-notifications');
                options.addArguments('--disable-popup-blocking');
				options.addArguments('--disable-gpu');
				options.addArguments('--no-sandbox');
				options.addArguments('--disable-dev-shm-usage');
				options.addArguments('--disable-extensions');
				              
				              // Suppress DevTools and logging messages
				              options.addArguments('--log-level=3');
				              options.excludeSwitches('enable-logging');
				              options.setLoggingPrefs({ browser: 'OFF', driver: 'OFF' });
				              
				              this.driver = await new Builder()
				                  .forBrowser('chrome')
				                  .setChromeOptions(options)
				                  .build();
				              break;

            case 'firefox':
                options = new firefox.Options();
                if (isHeadless) {
                    options.addArguments('-headless');
                }
                this.driver = await new Builder()
                    .forBrowser('firefox')
                    .setFirefoxOptions(options)
                    .build();
                break;

            case 'edge':
                options = new edge.Options();
                if (isHeadless) {
                    options.addArguments('--headless');
                }
                this.driver = await new Builder()
                    .forBrowser('MicrosoftEdge')
                    .setEdgeOptions(options)
                    .build();
                break;

            default:
                throw new Error(`Browser ${browser} is not supported`);
        }

        // Set implicit wait
        await this.driver.manage().setTimeouts({
            implicit: configReader.getImplicitWait()
        });

        // Maximize window
        await this.driver.manage().window().maximize();

        return this.driver;
    }

    getDriver() {
        if (!this.driver) {
            throw new Error('Driver not initialized. Call initializeDriver() first.');
        }
        return this.driver;
    }

    async quitDriver() {
        if (this.driver) {
            await this.driver.quit();
            this.driver = null;
        }
    }
}

module.exports = DriverManager;