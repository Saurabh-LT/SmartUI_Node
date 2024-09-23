const { Builder, By, Key, until, Proxy } = require('selenium-webdriver');
const proxy = require('selenium-webdriver/proxy');
const {smartuiSnapshot} = require('@lambdatest/selenium-driver');
// const firefox = require('selenium-webdriver/firefox');
// const chrome = require('selenium-webdriver/chrome');
// const fs = require('fs');



let capabilities = {
    platform: "",
    browserName: "chrome",
    version: "latest",
    "LT:Options": {
		"username": "userName",
		"accessKey": "accessKey",
		"platformName": "macOS Catalina",
		"project": "Untitled",
		"w3c": true,
        name: "SmartUI Node Test", // name of the test
        build: "SmartUI Node", // name of the build
        visual: true,
	},    
  };


(async function example() {
    // Setup Input capabilities
    var gridUrl = "https://" + "saurabhlambdatest" + ":" + "3ITNMLNecjF951i6EPBqY6JLEPBfSAQWrbiMRWAXbgaUogvgcK" + "@hub.lambdatest.com/wd/hub";
    let driver = await new Builder().usingServer(gridUrl).withCapabilities(capabilities).build();
    driver.manage().window().fullscreen();
    try {
        console.log('Driver started');
        await driver.get("https://www.lambdatest.com/");
        await new Promise(r => setTimeout(r, 2000));
        await smartuiSnapshot(driver, 'lambdatestHomePage');
    } catch (error) {
        console.error(error);
    } finally {
        await driver.quit();
        console.log('Driver quit');
    }
})();

