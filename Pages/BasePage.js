const { By, until } = require('selenium-webdriver');
const configReader = require('../utils/ConfigReader');

class BasePage {
    constructor(driver) {
        this.driver = driver;
        this.timeout = configReader.getExplicitWait();
    }

    async waitForElement(locator, timeout) {
        if (!timeout) timeout = this.timeout;
        // Validate locator
        if (!locator || typeof locator !== 'object' || !locator.using) {
            throw new Error(`Invalid locator passed to waitForElement: ${JSON.stringify(locator)}`);
        }
        return await this.driver.wait(
            until.elementLocated(locator),
            timeout,
            `Element not found: ${JSON.stringify(locator)}`
        );
    }
	async waitForElementToBeInteractable(locator, timeout) {
	    const element = await this.waitForElement(locator, timeout);
	    await this.waitForElementVisible(element, timeout);
	    await this.driver.wait(
	        until.elementIsEnabled(element),
	        timeout,
	        'Element not enabled/interactable'
	    );
	    return element;
	}
    async waitForElementVisible(element, timeout) {
        if (!timeout) timeout = this.timeout;
        return await this.driver.wait(
            until.elementIsVisible(element),
            timeout,
            'Element not visible'
        );
    }

    async waitForElementClickable(element, timeout) {
        if (!timeout) timeout = this.timeout;
        await this.waitForElementVisible(element, timeout);
        return await this.driver.wait(
            until.elementIsEnabled(element),
            timeout,
            'Element not clickable'
        );
    }

    async clickElement(locator, timeout) {
        const element = await this.waitForElement(locator, timeout);
        await this.waitForElementClickable(element, timeout);
        await element.click();
    }

    async enterText(locator, text, timeout) {
        const element = await this.waitForElement(locator, timeout);
        await this.waitForElementVisible(element, timeout);
        await element.clear();
        await element.sendKeys(text);
    }

    async getText(locator, timeout) {
        const element = await this.waitForElement(locator, timeout);
        return await element.getText();
    }

    async isElementDisplayed(locator) {
        try {
            const element = await this.driver.findElement(locator);
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    async getCurrentUrl() {
        return await this.driver.getCurrentUrl();
    }

    async getPageTitle() {
        return await this.driver.getTitle();
    }

    async sleep(ms) {
        await this.driver.sleep(ms);
    }
}

module.exports = BasePage;