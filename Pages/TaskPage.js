const { By, Key } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class TaskPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Locators
        this.addTaskButton = By.xpath("//button[@class='_19abae45 _56a651f6 _3930afa0 _7ea1378e _7246d092']");
		this.taskNameField = By.xpath("(//div[@contenteditable='true'])[1]");
		this.taskPane = By.xpath("//button[@aria-label='Open/close sidebar']");
		this.submitButton= By.xpath("//button[@type='submit'])");
	    this.taskList = By.xpath("//div[contains(@class,'task_list_item')]");
        this.profileButton = By.xpath("//button[contains(@aria-label,'profile')]");
        this.logoutButton = By.xpath("//div[text()='Log out']");
    }

	// TaskPage.js
	async enterTaskName(taskName) {
	    await this.sleep(1000);
	   const element = await this.waitForElementToBeInteractable(this.taskNameField);
	    await element.clear();
	    await element.sendKeys(taskName);
	}
	async clickAddTask() {
	    await this.sleep(2000); // Wait for page load
	    await this.clickElement(this.addTaskButton);
	    await this.sleep(1500); // Wait for input field to appear
	}

	async submitTask() {
	    try {
	        // Direct findElement instead of using wait methods
	        const element = await this.driver.findElement(this.taskNameField);
	        await element.sendKeys(Key.RETURN);
	    } catch (error) {
	        
		
	    }
	}
    async createTask(taskName) {
		await this.clickAddTask();
		await this.sleep(2000); // Wait for page load
        await this.enterTaskName(taskName);
        await this.submitTask();
    }

    async isTaskDisplayed(taskName) {
        try {
            await this.sleep(2000);
            const taskLocator = By.xpath(`//span[@class='WzhfMde']`);
            return await this.isElementDisplayed(taskLocator);
        } catch (error) {
            console.log('Task not found:', error.message);
            return false;
        }
    }

    async completeTask(taskName) {
        try {
            await this.sleep(1000);
            const checkboxLocator = By.xpath(`//span[@class='WzhfMde']`);
            await this.clickElement(checkboxLocator);
            await this.sleep(2000); // Wait for completion animation
            return true;
        } catch (error) {
            console.log('Could not complete task:', error.message);
            return false;
        }
    }

    async getTaskCount() {
        try {
            const elements = await this.driver.findElements(this.taskList);
            return elements.length;
        } catch (error) {
            return 0;
        }
    }

    async logout() {
        await this.clickElement(this.profileButton);
        await this.sleep(1000);
        await this.clickElement(this.logoutButton);
        await this.sleep(2000);
    }

    async isDashboardDisplayed() {
        const url = await this.getCurrentUrl();
        return url.includes('app/today') || url.includes('app/inbox');
    }
}

module.exports = TaskPage;