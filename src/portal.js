const { By, Key, until } = require('selenium-webdriver');
const debug = require('debug')('portal');
const { 
  MAIN_URL,
  CONSUMER_PORTAL_URL
} = require('./constants'); 

exports.selectThermostat = (query) => async (driver) => {
  const thermostats = await driver.findElements(By.css('.tile'));
  let thermostatSelected; 
  for (const thermostat of thermostats) {
    const thermostatName = (await thermostat.getText()).toLowerCase();
    if (thermostatName.indexOf(query) > -1) {
      debug(`thermostat found: ${thermostatName}`);
      thermostatSelected = thermostat;
      break;
    }
  }
  await driver.sleep(3000);
  await driver.actions().move({ origin: thermostatSelected }).pause(1000).click().perform();
  debug(`using thermostat: ${query}`);
};

exports.login = (credentials) => async (driver) => {
  await driver.get(MAIN_URL);
  const loginElement = await driver.findElement(By.css('a[href="#modal-popup-85760"]'));
  debug('loginElement located');
  await loginElement.click();
  await driver.wait(until.elementLocated(By.id('modal-popup-85760')), 10000)
  debug('found modal - clicked');
  await driver.sleep(3000);
  const usernameField = await driver.findElement(By.id('userName'));
  await usernameField.sendKeys(credentials.username);
  debug('username field found and keys sent');
  const passwordField = await driver.findElement(By.id('password'));
  await driver.sleep(3000);
  await passwordField.sendKeys(credentials.password);
  debug('password field found and keys sent');
  await driver.actions().move({ origin: passwordField }).pause(1000).keyDown(Key.ENTER).perform();
  debug('sending login, waiting five seconds');
  await driver.wait(until.urlIs(CONSUMER_PORTAL_URL), 5000);
};

// exports.logout = () => async (driver) => {}
