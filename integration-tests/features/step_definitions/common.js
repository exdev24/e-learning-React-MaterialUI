const { Given, When, Then } = require('cucumber');
const {
  visitPage,
  clickFirstLinkWithText,
  fillInFormInput,
  fillInHostedField,
  textIsDisplayedOnPage,
  takeScreenshot,
  assertInputValue
} = require('../support/actions');

Given('I am not a registered user', () => {});

When('I go to the {string} page', visitPage);

When(
  'I click on first link {string} with class name {string}',
  clickFirstLinkWithText
);

When('I click on {string} button with class name {string}', clickFirstLinkWithText);

When('I fill in {string} with {string}', fillInFormInput);
When('I fill in hosted field {string} with {string}', fillInHostedField);

When('I want to see how {string} looks like now', takeScreenshot);

Then('I see a message {string}', textIsDisplayedOnPage);

Then('I see my name {string}', name => assertInputValue('firstName', name));

Then('I see my email {string}', email => assertInputValue('email', email));

Then('I see student name {string}', textIsDisplayedOnPage);
