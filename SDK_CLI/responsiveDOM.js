const { Builder, By, Key, until, Proxy } = require('selenium-webdriver');
const proxy = require('selenium-webdriver/proxy');
const { smartuiSnapshot } = require('@lambdatest/selenium-driver');


// username: Username can be found at automation dashboard
const USERNAME = process.env.LT_USERNAME || "<USERNAME>";

// AccessKey:  AccessKey can be generated from automation dashboard or profile section
const KEY = process.env.LT_ACCESS_KEY || "<ACCESS_KEY>";

const buildName = process.env.AUTOMATION_BUILD_NAME || "SmartUI Exec Node ResponsiveDOM";

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

function scrollToBottom({
    frequency = 100,
    timing = 150,
    remoteWindow = window
  } = {}) {
    let resolve;
    let scrolls = 1;
    let deferred = new Promise(r => (resolve = r));
    let totalScrolls = remoteWindow.document.body.scrollHeight / frequency;
  
    function scroll() {
      let scrollBy = totalScrolls * scrolls;
      remoteWindow.setTimeout(() => {
        remoteWindow.scrollTo(0, scrollBy);
  
        if (scrolls < frequency) {
          scrolls += 1;
          scroll();
        }
  
        // resolve the pending  once we've finished scrolling the page
        if (scrolls === frequency) resolve(true);
      }, timing);
    }
  
    scroll();
  
    return deferred;
  }

(async function example() {
    // Setup Input capabilities
    var gridUrl = "https://" + USERNAME + ":" + KEY + "@hub.lambdatest.com/wd/hub";
    let driver = await new Builder().usingServer(gridUrl).withCapabilities(capabilities).build();
    try {
        let mobile_dom_options =
        {
            "mobile": {
                "devices": [
                    "iPhone 14",
                    "Galaxy S24"
                ],
                "fullPage": true,
                "orientation": "portrait"
            }
        };

        let web_dom_options =
        {
            "web": {
                "browsers": [
                    "chrome",
                    "firefox",
                    "safari"
                ],
                "viewports": [[1366]],
            },
        };
        console.log('Driver started');
        await driver.get("https://ltqa-frontend.lambdatestinternal.com/responsive-dom");
        await driver.executeScript(scrollToBottom);
        await smartuiSnapshot(driver, "3rdcoastsightcast");

        await driver.manage().window().maximize();
        await driver.get("https://ltqa-frontend.lambdatestinternal.com/responsive-dom");
        await driver.navigate().refresh();
        await driver.executeScript(scrollToBottom);
        await smartuiSnapshot(driver, "3rdcoastsightcast", web_dom_options);
        
        
        await driver.manage().window().setRect({ width: 380, height: 800 });
        await driver.navigate().refresh();
        await driver.get("https://ltqa-frontend.lambdatestinternal.com/responsive-dom");
        await driver.executeScript(scrollToBottom);
        await smartuiSnapshot(driver, "3rdcoastsightcast", mobile_dom_options);
        
    } catch (error) {
        console.error(error);
    } finally {
        await driver.quit();
        console.log('Driver quit');
    }
})();

