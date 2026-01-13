const { Builder, By, Key, until, Proxy } = require('selenium-webdriver');
const proxy = require('selenium-webdriver/proxy');
const {smartuiSnapshot} = require('@lambdatest/selenium-driver');


// username: Username can be found at automation dashboard
const USERNAME = process.env.LT_USERNAME || "<USERNAME>";

// AccessKey:  AccessKey can be generated from automation dashboard or profile section
const KEY = process.env.LT_ACCESS_KEY || "<ACCESS_KEY>";

const buildName = process.env.AUTOMATION_BUILD_NAME || "SmartUI Exec Node GlobalCache";

let capabilities = {
    platform: "",
    browserName: "chrome",
    version: "latest",
    "LT:Options": {
		"username": USERNAME,
		"accessKey": KEY,
		"platformName": "Windows 10",
		"project": "Untitled",
		"w3c": true,
        name: "SmartUI Node Test", // name of the test
        build: buildName, // name of the build
        visual: true,
	},    
  };


(async function example() {
    // Setup Input capabilities
    var gridUrl = "https://" + USERNAME + ":" + KEY + "@hub.lambdatest.com/wd/hub";
    let driver = await new Builder().usingServer(gridUrl).withCapabilities(capabilities).build();

    try {
        console.log('Driver started');
       // Test Analytics
        await driver.get("https://www.lambdatest.com/test-analytics");
        await smartuiSnapshot(driver, "test-analytics");
        // LT Browser
        await driver.get("https://www.lambdatest.com/lt-browser");
        await smartuiSnapshot(driver, "lt-browser");
        // Accessibility DevTools
        await driver.get("https://www.lambdatest.com/accessibility-devtools");
        await smartuiSnapshot(driver, "accessibility-devtools");
        // Accessibility Testing Tool
        await driver.get("https://www.lambdatest.com/accessibility-testing-tool");
        await smartuiSnapshot(driver, "accessibility-testing-tool");
        // Real Device Cloud
        await driver.get("https://www.lambdatest.com/real-device-cloud");
        await smartuiSnapshot(driver, "real-device-cloud");
        // Visual Regression Testing
        await driver.get("https://www.lambdatest.com/visual-regression-testing");
        await smartuiSnapshot(driver, "visual-regression-testing");
        // Test Intelligence
        await driver.get("https://www.lambdatest.com/test-intelligence/");
        await smartuiSnapshot(driver, "test-intelligence");
        // Automation Cloud
        await driver.get("https://www.lambdatest.com/automation-cloud");
        await smartuiSnapshot(driver, "automation-cloud");
        // Kane AI
        await driver.get("https://www.lambdatest.com/kane-ai");
        await smartuiSnapshot(driver, "kane-ai");
        // On-Premise Selenium Grid
        await driver.get("https://www.lambdatest.com/on-premise-selenium-grid");
        await smartuiSnapshot(driver, "on-premise-selenium-grid");
        // HyperExecute
        await driver.get("https://www.lambdatest.com/hyperexecute");
        await smartuiSnapshot(driver, "hyperexecute");
        // Playwright Testing
        await driver.get("https://www.lambdatest.com/playwright-testing");
        await smartuiSnapshot(driver, "playwright-testing");
        // Test Manager
        await driver.get("https://www.lambdatest.com/test-manager");
        await smartuiSnapshot(driver, "test-manager");
        // Selenium Automation
        await driver.get("https://www.lambdatest.com/selenium-automation");
        await smartuiSnapshot(driver, "selenium-automation");


        // Test Analytics
        await driver.get("https://www.lambdatest.com/test-analytics");
        await smartuiSnapshot(driver, "1test-analytics");
        // LT Browser
        await driver.get("https://www.lambdatest.com/lt-browser");
        await smartuiSnapshot(driver, "1lt-browser");
        // Accessibility DevTools
        await driver.get("https://www.lambdatest.com/accessibility-devtools");
        await smartuiSnapshot(driver, "1accessibility-devtools");
        // Accessibility Testing Tool
        await driver.get("https://www.lambdatest.com/accessibility-testing-tool");
        await smartuiSnapshot(driver, "1accessibility-testing-tool");
        // Real Device Cloud
        await driver.get("https://www.lambdatest.com/real-device-cloud");
        await smartuiSnapshot(driver, "1real-device-cloud");
        // Visual Regression Testing
        await driver.get("https://www.lambdatest.com/visual-regression-testing");
        await smartuiSnapshot(driver, "1visual-regression-testing");
        // Test Intelligence
        await driver.get("https://www.lambdatest.com/test-intelligence/");
        await smartuiSnapshot(driver, "1test-intelligence");
        // Automation Cloud
        await driver.get("https://www.lambdatest.com/automation-cloud");
        await smartuiSnapshot(driver, "1automation-cloud");
        // Kane AI
        await driver.get("https://www.lambdatest.com/kane-ai");
        await smartuiSnapshot(driver, "1kane-ai");
        // On-Premise Selenium Grid
        await driver.get("https://www.lambdatest.com/on-premise-selenium-grid");
        await smartuiSnapshot(driver, "1on-premise-selenium-grid");
        // HyperExecute
        await driver.get("https://www.lambdatest.com/hyperexecute");
        await smartuiSnapshot(driver, "1hyperexecute");
        // Playwright Testing
        await driver.get("https://www.lambdatest.com/playwright-testing");
        await smartuiSnapshot(driver, "1playwright-testing");
        // Test Manager
        await driver.get("https://www.lambdatest.com/test-manager");
        await smartuiSnapshot(driver, "1test-manager");
        // Selenium Automation
        await driver.get("https://www.lambdatest.com/selenium-automation");
        await smartuiSnapshot(driver, "1selenium-automation");
    } catch (error) {
        console.error(error);
    } finally {
        await driver.quit();
        console.log('Driver quit');
    }
})();

