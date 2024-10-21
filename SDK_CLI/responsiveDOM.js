const { Builder, By, Key, until, Proxy } = require('selenium-webdriver');
const proxy = require('selenium-webdriver/proxy');
const { smartuiSnapshot } = require('@lambdatest/selenium-driver');


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
        "project": "Untitled",
        "w3c": true,
        name: "SmartUI Node Test", // name of the test
        build: "SmartUI Node", // name of the build
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
        let options0 =
        {
            "mobile": {
                "devices": [
                    "iPhone 14",
                    "Galaxy S23"
                ],
                "fullPage": true,
                "orientation": "portrait"
            },
            ignoreDOM: {
                class: ["nextAvailDate"],
              }
        };

        let options1 =
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
        await driver.get("https://www.3rdcoastsightcast.com/texas-fishing-charter-rates");
        await driver.executeScript(scrollToBottom);
        await smartuiSnapshot(driver, "3rdcoastsightcast");

        await driver.get("https://bento.monexinsight-dev.net/");
        await driver.executeScript(scrollToBottom);
        await smartuiSnapshot(driver, "monexinsight");


        driver.manage().window().maximize();
        await driver.get("https://www.3rdcoastsightcast.com/texas-fishing-charter-rates");
        await driver.navigate().refresh();
        await driver.executeScript(scrollToBottom);
        await smartuiSnapshot(driver, "3rdcoastsightcast", options1);

        await driver.get("https://bento.monexinsight-dev.net/");
        await driver.navigate().refresh();
        await driver.executeScript(scrollToBottom);
        await smartuiSnapshot(driver, "monexinsight", options1);

        
        await driver.manage().window().setSize(380, 3080);
        await driver.navigate().refresh();
        await driver.get("https://www.3rdcoastsightcast.com/texas-fishing-charter-rates");
        await driver.executeScript(scrollToBottom);
        await smartuiSnapshot(driver, "3rdcoastsightcast", options0);

        await driver.get("https://bento.monexinsight-dev.net/");
        await driver.executeScript(scrollToBottom);
        await smartuiSnapshot(driver, "monexinsight", options0);


        
    } catch (error) {
        console.error(error);
    } finally {
        await driver.quit();
        console.log('Driver quit');
    }
})();

