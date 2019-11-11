const Nexmo = require('nexmo');
require('dotenv').config();

let options = {};

module.exports = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET,
    applicationId: process.env.NEXMO_APP_ID,
    privateKey: process.env.NEXMO_PRIVATE_KEY_PATH
  }, options);