const { Builder, By, Key, until, Proxy } = require('selenium-webdriver');
const assert = require('assert');
const { smartuiSnapshot } = require('@lambdatest/selenium-driver');
const https = require('https');


// username: Username can be found at automation dashboard
const USERNAME = process.env.LT_USERNAME || "<USERNAME>";

// AccessKey:  AccessKey can be generated from automation dashboard or profile section
const KEY = process.env.LT_ACCESS_KEY || "<ACCESS_KEY>";

// ProjectName: Name of the SmartUI Project
const ProjectName = process.env.PROJECT_NAME || "<PROJECT_NAME>";

// CommitUrl
const commitUrl = process.env.COMMIT_URL || "<COMMIT_URL>";

// Github PAT
const githubPat = process.env.GITHUB_PAT || "<GITHUB_PAT>";

let capabilities = {
    platform: "",
    browserName: "chrome",
    version: "latest",
    "LT:Options": {
        "username": USERNAME,
        "accessKey": KEY,
        "platformName": "macOS Catalina",
        "project": "SmartUI-Github-check",
        "w3c": true,
        name: "SmartUI-Github-check", // name of the test
        build: "SmartUI-Github-check", // name of the build
        visual: true,
    },
};

const funcName = process.argv[2];
if (funcName == "cli") {
    githubCheckVerificationWithCliRun();
}
if (funcName == "post-cli") {
    githubCheckVerificationPostCliRun();
}


// Automation script to verify Smartui Github check
async function githubCheckVerificationWithCliRun() {
    // Setup Input capabilities
    var gridUrl = "https://" + USERNAME + ":" + KEY + "@hub.lambdatest.com/wd/hub";
    let driver = await new Builder().usingServer(gridUrl).withCapabilities(capabilities).build();

    let githubCommitData;
    githubCommitData = await getGithubCommitStatus();

    // Verify SmartUI commit check when SmartUI build is running
    verifySmartuiCommitCheck(githubCommitData, "pending", "");

    // Automation script to capture screenshot    
    try {
        console.log('Driver started');
        await driver.get("https://ipinfo.io/");
        await new Promise(r => setTimeout(r, 2000));
        await smartuiSnapshot(driver, 'ipInfo');
    } catch (error) {
        console.error(error);
    } finally {
        await driver.quit();
        console.log('Driver quit');
    }

};

async function githubCheckVerificationPostCliRun() {

    let githubCommitData;
    githubCommitData = await getGithubCommitStatus();

    // Verify SmartUI commit check when SmartUI build is completed
    let maxRetries = 5;
    while (githubCommitData.statuses[0]?.state == "pending" && maxRetries > 0) {
        githubCommitData = await getGithubCommitStatus();
        await sleep(10000);
        maxRetries--;
    }
    verifySmartuiCommitCheck(githubCommitData, "failure", "Changes found");

};

// Function to get github commit status with API
async function getGithubCommitStatus() {
    return new Promise((resolve, reject) => {
        let commitUrlComponents = commitUrl.split("/");
        let path = "/repos/" + commitUrlComponents[0] + "/" + commitUrlComponents[1] + "/commits/" + commitUrlComponents[2] + "/status";
        const options = {
            hostname: 'api.github.com',
            path: path,
            method: 'GET',
            headers: {
                'Authorization': 'token ' + githubPat,
                'User-Agent': 'nodejs-https-request',
                'Accept': 'application/vnd.github+json'
            }
        };

        const req = https.request(options, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (e) {
                    reject(new Error('Failed to parse JSON response'));
                }
            });
        });

        req.on('error', error => {
            reject(error);
        });

        req.end();
    });
}

// Function to validate smartui commit check
function verifySmartuiCommitCheck(githubCommitData, expectedState, expectedBuildStatus) {
    const now = new Date();
    const currentUtcDate = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;

    assert.equal((githubCommitData.statuses[0]?.updated_at).split("T")[0], currentUtcDate, "SmartUI Github check update date " + (githubCommitData.statuses[0]?.updated_at).split("T")[0] + " does not matches with the current date " + currentUtcDate);
    assert.equal(githubCommitData.statuses[0]?.state, expectedState, "SmartUI Github check state is " + githubCommitData.statuses[0]?.state + " which does not matches the expected state " + expectedState);
    assert.equal(true, githubCommitData.statuses[0]?.context.includes(ProjectName), "SmartUI Github check context " + githubCommitData.statuses[0]?.context + " does not contains the expected project name " + ProjectName);
    assert.equal(true, githubCommitData.statuses[0]?.description.includes(expectedBuildStatus), "SmartUI Github check description " + githubCommitData.statuses[0]?.description + " does not contains the expected build status " + expectedBuildStatus);
}

// Function for static wait
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}