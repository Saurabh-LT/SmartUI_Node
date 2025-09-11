const { Builder, until, By } = require('selenium-webdriver');
const {smartuiSnapshot} = require('@lambdatest/selenium-driver');


// username: Username can be found at automation dashboard
const USERNAME = process.env.LT_USERNAME || "<USERNAME>";

// AccessKey:  AccessKey can be generated from automation dashboard or profile section
const KEY = process.env.LT_ACCESS_KEY || "<ACCESS_KEY>";

const EMAIL = process.env.LT_EMAIL || "";

const PASSWORD = process.env.LT_PASSWORD || "";

const BASE_URL = (process.env.ENV == "stage")?"https://stage-smartui.lambdatestinternal.com":"https://smartui.lambdatest.com";

// Project Id of a project that does not have any builds
const EMPTY_PROJECT_ID = process.env.EMPTY_PROJECT_ID || "";

const PROJECT_ID = process.env.PROJECT_ID || "";

const BUILD_ID = process.env.BUILD_ID || "";


//Selectors
let emailInputSelector= "//input[@name='email']";
let passwordInputSelector= "//input[@name='password']";
let loginButtonSelector= "//button[@id='login-button']";
let homeDashboardTitle= "//h1[text()='Home']";
let smartuiProjectsList= "//div[@id='Home_list_wrapper']";
let smartuiProjectsCount= "//h2[@id='totalProjectsTitle']";
let smartuiNonBaselineBuildsList= "//ul[@aria-label='non baseline build list']";
let smartuiSettingsToken= "//div[@id='ProjectToken_clipboard_wrapper']";
let smartuiMismatchPercentage= "//div[@id='mismatchInfoContainer-webView']";
let commonHeaderTopBar= "//div[@class='Top_Nav']";
let commonHeaderSideBar= "//div[@role='navigation']";
let smartuiBuildUpdateTime= "//div[contains(text(),'Updated')]/..";


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
        name: "SmartUI Pages", // name of the test
        build: "SmartUI Pages Verification", // name of the build
        visual: true,
	},    
  };


(async function example() {
    // Setup Input capabilities
    var gridUrl = "https://" + USERNAME + ":" + KEY + "@hub.lambdatest.com/wd/hub";
    let driver = await new Builder().usingServer(gridUrl).withCapabilities(capabilities).build();

    try {
        console.log('Driver started');

        //Login with Lambdatest account
        await driver.get(BASE_URL);

        let element= await driver.wait(until.elementLocated(By.xpath(emailInputSelector)),10000);
        await element.sendKeys(EMAIL);
        element= await driver.wait(until.elementLocated(By.xpath(passwordInputSelector)),10000);
        await element.sendKeys(PASSWORD);
        element= await driver.wait(until.elementLocated(By.xpath(loginButtonSelector)),10000);
        await element.click();
        await driver.wait(until.elementLocated(By.xpath(homeDashboardTitle)),20000);


        //SmartUI Dashboard Verification
        await driver.get(BASE_URL+"/projects");
        element= await driver.wait(until.elementLocated(By.xpath(smartuiProjectsCount)),30000);
        await driver.wait(until.elementIsVisible(element),10000);
        let options = {
            ignoreDOM: {
                xpath: [smartuiProjectsList,commonHeaderTopBar,commonHeaderSideBar],
            },
            element: {
                id: 'root',
            }
        }
        await smartuiSnapshot(driver, 'SmartUI-Dashboard',options);

        options = {
            ignoreDOM: {
                xpath: [commonHeaderTopBar,commonHeaderSideBar],
            },
            element: {
                id: 'root',
            }
        }

        //SmartUI Create Project Page
        await driver.get(BASE_URL+"/newProject");
        await smartuiSnapshot(driver, 'SmartUI-CreateProject',options);

        //SmartUI Project Settings Page
        await driver.get(BASE_URL+"/project-settings/"+PROJECT_ID+"/builds");
        await driver.wait(until.elementLocated(By.xpath(smartuiSettingsToken)),20000);
        await smartuiSnapshot(driver, 'SmartUI-ProjectSettings',options);

        //SmartUI Onboarding Pages
        await driver.get(BASE_URL+"/onboard/cli/"+EMPTY_PROJECT_ID+"?currentTab=SDK");
        await smartuiSnapshot(driver, "SmartUI-SDK-Onboarding",options);

        await driver.get(BASE_URL+"/onboard/cli/"+EMPTY_PROJECT_ID+"?currentTab=CLI");
        await smartuiSnapshot(driver, "SmartUI-CLI-Onboarding",options);

        await driver.get(BASE_URL+"/onboard/cli/"+EMPTY_PROJECT_ID+"?currentTab=Storybook");
        await smartuiSnapshot(driver, "SmartUI-Storybook-Onboarding",options);

        await driver.get(BASE_URL+"/onboard/cli/"+EMPTY_PROJECT_ID+"?currentTab=Images");
        await smartuiSnapshot(driver, "SmartUI-Images-Onboarding",options);

        await driver.get(BASE_URL+"/onboard/cli/"+EMPTY_PROJECT_ID+"?currentTab=Figma");
        await smartuiSnapshot(driver, "SmartUI-Figma-Onboarding",options);

        //SmartUI Builds Page

        options = {
            ignoreDOM: {
                xpath: [commonHeaderTopBar,commonHeaderSideBar,smartuiBuildUpdateTime],
            },
            element: {
                id: 'root',
            }
        }

        await driver.get(BASE_URL+"/builds/"+PROJECT_ID);
        element= await driver.wait(until.elementLocated(By.xpath(smartuiNonBaselineBuildsList)),30000);
        await driver.wait(until.elementIsVisible(element),10000);
        await new Promise(r => setTimeout(r, 3000));
        await smartuiSnapshot(driver, "SamrtUI-Build-Page",options);

        //SmartUI Screenshot Page

        options = {
            ignoreDOM: {
                xpath: [commonHeaderTopBar,commonHeaderSideBar,smartuiBuildUpdateTime,"(//div[@id='TestTopBar']//span)[1]","//span[contains(text(),'Updated')]/.."],
            },
            element: {
                id: 'root',
            }
        }

        await driver.get(BASE_URL+"/test/web/"+PROJECT_ID+"/"+BUILD_ID+"/TestIm?pageNo=1&index=2&baseline=false");
        await driver.wait(until.elementLocated(By.xpath(smartuiMismatchPercentage)),30000);
        await smartuiSnapshot(driver, "SmartUI-Screenshot-Page",options);


    } catch (error) {
        console.error(error);
    } finally {
        await driver.quit();
        console.log('Driver quit');
    }
})();

