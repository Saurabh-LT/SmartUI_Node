const { Builder, By, Key, until, Proxy } = require('selenium-webdriver');
const proxy = require('selenium-webdriver/proxy');
const {smartuiSnapshot} = require('@lambdatest/selenium-driver');
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');



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
        name: "test session", // name of the test
        build: "platform + browserName + version", // name of the build
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

  function scrollToBottomAndBackToTop({
    frequency = 100,
    timing = 150,
    remoteWindow = window 
} = {}) {
    return new Promise(resolve => {
        let scrolls = 1;
        let scrollLength = remoteWindow.document.body.scrollHeight / frequency;
    
        (function scroll() {
            let scrollBy = scrollLength * scrolls;

            remoteWindow.setTimeout(() => {
                    remoteWindow.scrollTo(0, scrollBy);
            
                    if (scrolls < frequency) {
                        scrolls += 1;
                        scroll();
                    }
            
                    if (scrolls === frequency) {
                        remoteWindow.setTimeout(() => {
                            remoteWindow.scrollTo(0,0)
                            resolve();
                        }, timing);
                    }    
            }, timing);
        })();
    });
}



(async function example() {
      // Setup Input capabilities
  var gridUrl = "https://" + "userName" + ":" + "accessKey" + "@hub.lambdatest.com/wd/hub";


    // let driver = await new Builder().forBrowser('chrome').build();

    let driver = await new Builder().usingServer(gridUrl).withCapabilities(capabilities).build();
        // driver.manage().window().fullscreen();
        await driver.manage().window().setRect({ width: 1920, height: 1080 });
        let options = {
            ignoreDOM: {
                cssSelector: ["[class*='HeroSection_home_fold_img']"],
            }
          }
        try {
            console.log('driver started');
            for(var i =0; i<1; i++) {
              await driver.get("https://www.lambdatest.com/");
              await new Promise(r => setTimeout(r, 2000));
              await smartuiSnapshot(driver, 'IP-Info'+i, options);
            }

        } catch (error) {
            console.error(error);
        } finally {
            await driver.quit();
        }
})();

