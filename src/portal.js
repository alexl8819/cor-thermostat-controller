const { By, Key, until } = require('selenium-webdriver');
const debug = require('debug')('portal');
const { 
  MAIN_URL,
  CONSUMER_PORTAL_URL
} = require('./constants'); 

exports.selectThermostat = (query) => async (driver) => {
  const thermostats = await driver.wait(until.elementsLocated(By.css('.tile')), 10000);
  let thermostatSelected; 
  for (const thermostat of thermostats) {
    const thermostatName = (await thermostat.getText()).toLowerCase();
    if (thermostatName.indexOf(query) > -1) {
      debug(`thermostat found: ${thermostatName}`);
      thermostatSelected = thermostat;
      break;
    }
  }
  await thermostatSelected.click();
  debug(`using thermostat: ${query}`);
};

exports.login = (credentials) => async (driver) => {
  await driver.get(MAIN_URL);
  const loginElement = await driver.wait(until.elementIsVisible(driver.findElement(By.css('a[href="#modal-popup-85760"]'))), 10000);
  debug('loginElement located');
  await loginElement.click();
  await driver.wait(until.elementLocated(By.id('modal-popup-85760')), 10000);
  debug('found modal - clicked');
  await driver.sleep(1000);
  const usernameField = await driver.wait(until.elementLocated(By.id('userName')), 10000);
  await usernameField.sendKeys(credentials.username);
  await driver.sleep(1000);
  debug('username field found and keys sent');
  const passwordField = await driver.wait(until.elementLocated(By.id('password')), 10000);
  await passwordField.sendKeys(credentials.password);
  await driver.sleep(1000);
  debug('password field found and keys sent');
  await driver.actions().move({ origin: passwordField }).pause(1000).keyDown(Key.ENTER).perform();
  debug('sending login, waiting a maximum of ten seconds');
  await driver.wait(until.urlIs(CONSUMER_PORTAL_URL), 10000);
};

// exports.logout = () => async (driver) => {}
