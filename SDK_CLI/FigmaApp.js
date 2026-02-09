const wd = require("wd");

// username: Username can be found at automation dashboard
const USERNAME = process.env.LT_USERNAME || "<USERNAME>";

// AccessKey: AccessKey can be generated from automation dashboard or profile section
const KEY = process.env.LT_ACCESS_KEY || "<ACCESS_KEY>";

const buildName = process.env.AUTOMATION_BUILD_NAME || "SmartUI Node";

const projectName = process.env.PROJECT_NAME || "SmartUI_Figma_App";

const DEFAULT_TIMEOUT = 30000;

const hubUrl = process.env.HUB_ENV === "prod"
    ? `https://${USERNAME}:${KEY}@mobile-hub.lambdatest.com/wd/hub`
    : `https://${USERNAME}:${KEY}@stage-mobile-hub.lambdatestinternal.com/wd/hub`;

const driver = wd.promiseRemote(hubUrl);

const desiredCapabilities = {
    deviceName: "Pixel 8",
    platformName: "android",
    platformVersion: "14",
    isRealMobile: true,
    build: buildName,
    name: "SmartUI Figma App Test",
    video: true,
    visual: true,
    "smartUI.project": projectName,
    "smartUI.build": "app-build"
};

async function runSmartUIAndroidTest() {
    try {
        await driver.init(desiredCapabilities);
        console.log("Driver started");

        await driver.get("https://ltqa-frontend.lambdatestinternal.com/layout1");
        await new Promise(r => setTimeout(r, 2000));
        await driver.execute("smartui.takeScreenshot=LayoutTesting.png");
        console.log("Screenshot Captured: LayoutTesting");

        driver.execute("lambda-status=passed");
        await driver.quit();
        console.log("Driver quit");
    } catch (error) {
        console.error(error);
        driver.execute("lambda-status=failed");
        await driver.quit();
        console.log("Driver quit");
    }
}

runSmartUIAndroidTest();
