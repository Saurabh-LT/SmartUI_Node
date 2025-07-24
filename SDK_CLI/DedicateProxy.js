const { Builder, By, Key, until, Proxy } = require('selenium-webdriver');
const proxy = require('selenium-webdriver/proxy');
const {smartuiSnapshot} = require('@lambdatest/selenium-driver');


// username: Username can be found at automation dashboard
const USERNAME_PROD = process.env.DP_PROD_LT_USERNAME || "<USERNAME>";
const USERNAME_STAGE = process.env.DP_STAGE_LT_USERNAME || "<USERNAME>";

// AccessKey:  AccessKey can be generated from automation dashboard or profile section
const KEY_PROD = process.env.DP_PROD_LT_ACCESS_KEY || "<ACCESS_KEY>";
const KEY_STAGE = process.env.DP_STAGE_LT_ACCESS_KEY || "<ACCESS_KEY>";
const HUB_URL = process.env.HUB_URL || "@hub.lambdatest.com/wd/hub";



let capabilities = {
    platform: "",
    browserName: "chrome",
    version: "latest",
    "LT:Options": {
		"username": HUB_URL.includes("stage") ? USERNAME_STAGE : USERNAME_PROD,
		"accessKey": HUB_URL.includes("stage") ? KEY_STAGE : KEY_PROD,
		"platformName": "macOS Catalina",
		"project": "Untitled",
		"w3c": true,
        name: "SmartUI Dedicated Proxy", // name of the test
        visual: true,
	},    
  };


(async function example() {
    // Setup Input capabilities
    if(HUB_URL.includes("stage")) {
        var gridUrl = "https://" + USERNAME_STAGE + ":" + KEY_STAGE + HUB_URL;
    } else {
        var gridUrl = "https://" + USERNAME_PROD + ":" + KEY_PROD + HUB_URL;
    }
    let driver = await new Builder().usingServer(gridUrl).withCapabilities(capabilities).build();
    try {
        console.log('Driver started');
        await driver.get("https://qa.goldman.com/");
        await driver.findElement(By.xpath("//input[@data-target='user-id']")).sendKeys("client5");
        await driver.findElement(By.xpath("//input[@class='form-control form-control-right-icon']")).sendKeys("simple123");
        await driver.findElement(By.xpath("//button[@type='submit']")).click();
        await new Promise(r => setTimeout(r, 20000));
        var ignoreDOMs = {
            xpath: ["//div[@class='module-content module-content--plain ']", "//div[@class='card square border rounded card-hover ']", "//div[@class='d-lg-inline-block text-lg-left']"]
        }
        var screenshotConfig = {
            screenshotName: "GS_HomePage",
            smartScroll: true,
            fullPage: true,  
            ignoreDOM: ignoreDOMs,
        }
        driver.executeScript("smartui.takeScreenshot", screenshotConfig);
    } catch (error) {
        console.error(error);
    } finally {
        await driver.quit();
        console.log('Driver quit');
    }
})();

