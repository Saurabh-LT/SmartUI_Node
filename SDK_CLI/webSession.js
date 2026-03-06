const { Builder, By, Key, until, Proxy } = require('selenium-webdriver');
const {smartuiSnapshot} = require('@lambdatest/selenium-driver');


// username: Username can be found at automation dashboard
const USERNAME = process.env.LT_USERNAME || "<USERNAME>";

// AccessKey:  AccessKey can be generated from automation dashboard or profile section
const KEY = process.env.LT_ACCESS_KEY || "<ACCESS_KEY>";

const buildName = process.env.AUTOMATION_BUILD_NAME || "Web Session with Cli";
const smartuiProjectName = process.env.SMARTUI_PROJECT_NAME || "WebSession_CLI_Project";
const smartuiBuildName = process.env.SMARTUI_BUILD_NAME || "WebSession_CLI_Build";

const hubUrl = (process.env.ENV === "stage") ? "@stage-hub.lambdatestinternal.com/wd/hub" : "@hub.lambdatest.com/wd/hub";

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
        "smartUI.project": smartuiProjectName,
        "smartUI.build": smartuiBuildName,
        visual: true,
	},    
  };


(async function example() {
    // Setup Input capabilities
    var gridUrl = "https://" + USERNAME + ":" + KEY + hubUrl;
    let driver = await new Builder().usingServer(gridUrl).withCapabilities(capabilities).build();

    try {
        console.log('Driver started');
        await driver.get("https://ltqa-frontend.lambdatestinternal.com/dynamic-data-testing");
        await new Promise(r => setTimeout(r, 2000));
        await smartuiSnapshot(driver, 'ltqa-dynamic-page');
    } catch (error) {
        console.error(error);
    } finally {
        await driver.quit();
        console.log('Driver quit');
    }
})();

