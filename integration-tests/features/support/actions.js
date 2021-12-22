const scope = require('./scope');
const pages = require('./pages');

// Defines whether puppeteer runs Chrome in headless mode.
const HEADLESS = process.env.VISUAL !== 'true';

const [headless, slowMo] = HEADLESS ? [true, 5] : [false, 10];

// Note: can remember intermediate values in scope.context

const visitPage = async page => {
  if (!scope.browser)
    scope.browser = await scope.driver.launch({
      headless,
      args: ['--no-sandbox'],
      slowMo
    });
  scope.context.currentPage = await scope.browser.newPage();
  await scope.context.currentPage.setViewport({ width: 1280, height: 1024 });

  const url = scope.host + pages[page];
  return await scope.context.currentPage.goto(url, {
    waitUntil: 'networkidle2'
  });
};

const clickFirstLinkWithText = async (text, className) => {
  const page = getPageOrError();

  await page.waitForSelector(className);
  const linkHandler = await page.$(className);

  if (!linkHandler) {
    throw new Error('Link not found');
  }

  await linkHandler.click();
  await page.waitFor(500);
};

const fillInFormInput = async (placeholder, value) => {
  const page = getPageOrError();

  const xpath = `//label[contains(., '${placeholder}')]/..//input | //label[contains(., '${placeholder}')]/..//select`;
  await page.waitForXPath(xpath);
  const fieldElements = await page.$x(xpath);

  if (fieldElements.length === 0) throw new Error('Input not found');

  await fieldElements[0].type(value);
};

const fillInHostedField = async (frameId, value) => {
  const page = getPageOrError();

  await page.waitForSelector('[role=progressbar]', {
    hidden: true
  });

  const xFramePath = `//iframe[@id="${frameId}"]`;
  await page.waitForXPath(xFramePath);
  const frameElement = await page.$x(xFramePath);
  const frame = await frameElement[0].contentFrame();

  await frame.waitForXPath('//input');
  const fields = await frame.$x('//input');
  if (fields.length === 0) throw new Error('Hosted field not found');
  await fields[0].type(value);
};

const takeScreenshot = async name => {
  const page = getPageOrError();
  await page.screenshot({ path: `./test-${name}.png` });
};

const textIsDisplayedOnPage = async text => {
  const page = getPageOrError();

  const xpath = `//div[contains(., '${text}')] | //h4[contains(., '${text}')]`;
  await page.waitForXPath(xpath);
  const elements = await page.$x(xpath);

  if (elements.length === 0) throw new Error('Text not found');
};

const assertInputValue = async (inputName, value) => {
  const page = getPageOrError();

  const inputValue = await page.$eval(`input[name=${inputName}]`, el => el.value);

  if (inputValue !== value) {
    throw new Error(`expected "${value}", got "${inputValue}"`);
  }
};

const getPageOrError = () => {
  if (!scope.context.currentPage) throw new Error('No page available!');
  return scope.context.currentPage;
};

module.exports = {
  visitPage,
  clickFirstLinkWithText,
  fillInFormInput,
  fillInHostedField,
  textIsDisplayedOnPage,
  assertInputValue,
  takeScreenshot
};
