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
		"platformName": "Windows 10",
		"project": "Untitled",
		"w3c": true,
        name: "SmartUI Node Test", // name of the test
        build: "SmartUI Exec Node Element Screenshot", // name of the build
        visual: true,
	},    
  };


(async function example() {
    // Setup Input capabilities
    var gridUrl = "https://" + USERNAME + ":" + KEY + "@hub.lambdatest.com/wd/hub";
    let driver = await new Builder().usingServer(gridUrl).withCapabilities(capabilities).build();
    let elementOptions = {
        element: {
          class: 'tools_logo',
        }
    };

    try {
        console.log('Driver started');
        await driver.get("https://www.lambdatest.com/visual-regression-testing");
        await new Promise(r => setTimeout(r, 2000));
        await smartuiSnapshot(driver, 'lambdatestHomePage', elementOptions);
    } catch (error) {
        console.error(error);
    } finally {
        await driver.quit();
        console.log('Driver quit');
    }
})();

