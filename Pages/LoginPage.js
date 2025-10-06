const { By, Key } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const TaskPage = require('./TaskPage');

class LoginPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Locators
        this.emailField = By.id('element-0');
        this.passwordField = By.id('element-2');
        this.loginButton = By.xpath("//button[@type='submit']");
        this.errorMessage = By.xpath("//div[contains(@class,'error')]");
    }

    async enterEmail(email) {
        await this.enterText(this.emailField, email);
    }

    async enterPassword(password) {
        await this.enterText(this.passwordField, password);
    }

    async clickLoginButton() {
        await this.clickElement(this.loginButton);
    }

    async login(email, password) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickLoginButton();
        await this.sleep(3000); // Wait for redirect
		await this.sleep(5000); // Increased from 3000ms
        return new TaskPage(this.driver);
    }
	/*async isErrorInvalidCredentials() {
	  //      const error = await this.getErrorMessage();
	        return error && error.toLowerCase().includes('invalid');
	    }*/
    async getErrorMessage() {
        return await this.isElementDisplayed(this.errorMessage);
    }
	
}

module.exports = LoginPage;