const { Builder, By, Key, until, Proxy } = require('selenium-webdriver');
const proxy = require('selenium-webdriver/proxy');
const {smartuiSnapshot} = require('@lambdatest/selenium-driver');
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');



let capabilities = {
  platform: "window 11",
  browserName: "edge",
  version: "latest",
  "LT:Options": {
  "username": process.env.LT_USERNAME,
  "accessKey": process.env.LT_ACCESS_KEY,
  "platformName": "win10",
  "project": "Untitled",
  "region": "us",
  "w3c": true,
  name: "test session", // name of the test
  build: "platform + browserName + version", // name of the build
},    
};

var gridUrl = "https://" + process.env.LT_USERNAME + ":" + process.env.LT_ACCESS_KEY + "@hub.lambdatest.com/wd/hub";

(async function example() {

    try {
        let driver = await new Builder().usingServer(gridUrl).withCapabilities(capabilities).build();
        let trueSync = {
          sync:true
        }
  
          await driver.get("https://ipinfo.io/");
          let count = process.env.LOAD_TEST_COUNT || 1000;
          for(let i=0; i<count; i++){
            let snapShotResponse = await smartuiSnapshot(driver, "lambdatestinternal"+i, trueSync);
            console.log(snapShotResponse);
          }
    } catch (error) {
        console.error(error);
    } finally {
        await driver.quit();
        console.log('Driver quit');
    }
})();

