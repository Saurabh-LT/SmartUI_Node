const axios = require('axios');
const assert = require('assert');


// username: Username can be found at automation dashboard
const USERNAME = process.env.LT_USERNAME || "<USERNAME>";

// AccessKey:  AccessKey can be generated from automation dashboard or profile section
const KEY = process.env.LT_ACCESS_KEY || "<ACCESS_KEY>";

const PROJECT_NAME = process.env.PROJECT_NAME || "";

const BUILD_NAME = process.env.BUILD_NAME || "";


async function getBuildStatus() {
  try {
    const response = await axios.get(
      'https://api.lambdatest.com/smartui/2.0/build/screenshots/status?project_name=' + PROJECT_NAME + '&baseline=false&build_name=' + BUILD_NAME + '&sync=true',
      {
        headers: {
                    'accept': 'application/json',
                    'Authorization': 'Basic ' + Buffer.from(USERNAME + ':' + KEY).toString('base64')
                }
      }
    );
    const data = response.data;
    return data.build.build_status
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}


(async function example() {
    const build_status= await getBuildStatus();
    assert.equal(build_status,"Approved",'Build is not approved, Build Status : '+build_status);
})();