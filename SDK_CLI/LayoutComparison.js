const { Builder, By, Key, until, Proxy } = require('selenium-webdriver');
const proxy = require('selenium-webdriver/proxy');
const {smartuiSnapshot} = require('@lambdatest/selenium-driver');


// username: Username can be found at automation dashboard
const USERNAME = process.env.LT_USERNAME || "<USERNAME>";

// AccessKey:  AccessKey can be generated from automation dashboard or profile section
const KEY = process.env.LT_ACCESS_KEY || "<ACCESS_KEY>";



let capabilities = {
    platform: "",
    browserName: "chrome",
    version: "latest",
    "LT:Options": {
		"username": USERNAME,
		"accessKey": KEY,
		"platformName": "macOS Catalina",
		"project": "Layout-SmartUI",
		"w3c": true,
        name: "SmartUI Node Layout Test", // name of the test
        build: "SmartUI Node Layout", // name of the build
        visual: true,
	},    
  };


(async function example() {
    // Setup Input capabilities
    var gridUrl = "https://" + USERNAME + ":" + KEY + "@hub.lambdatest.com/wd/hub";
    let driver = await new Builder().usingServer(gridUrl).withCapabilities(capabilities).build();
    let comparisonType = {
        ignoreType: ['layout'],
    }
    try {
        console.log('Driver started');

        // await driver.get("https://www.whatsapp.com/?lang=hi"); // Baseline
        await driver.get("https://www.whatsapp.com/?lang=en"); // Non-Baseline
        await new Promise(r => setTimeout(r, 2000));
        await smartuiSnapshot(driver, 'whatsapp', comparisonType);

        // await driver.get("https://www.netflix.com/in/"); // Baseline
        await driver.get("https://www.netflix.com/in-hi/"); // Non-Baseline
        await new Promise(r => setTimeout(r, 2000));
        await smartuiSnapshot(driver, 'netflix', comparisonType);

        // await driver.get("https://www.atlassian.com/ko"); // Baseline
        await driver.get("https://www.atlassian.com/"); // Non-Baseline
        await new Promise(r => setTimeout(r, 2000));
        await smartuiSnapshot(driver, 'atlassian', comparisonType);

        // await driver.get("https://www.autodesk.com/asean"); // Baseline
        await driver.get("https://www.autodesk.com/de"); // Non-Baseline
        await new Promise(r => setTimeout(r, 2000));
        await smartuiSnapshot(driver, 'autodesk', comparisonType);

    } catch (error) {
        console.error(error);
    } finally {
        await driver.quit();
        console.log('Driver quit');
    }
})();

