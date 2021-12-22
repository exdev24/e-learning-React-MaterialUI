const { setWorldConstructor, setDefaultTimeout } = require('cucumber');
const scope = require('./support/scope');

const World = function () {
  scope.host = 'http://localhost:12800';
  scope.driver = require('puppeteer');
  scope.context = {};

  // Set default timeout to 30 seconds before a step fails.
  setDefaultTimeout(30000);
};

setWorldConstructor(World);
