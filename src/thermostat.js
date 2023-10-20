const { By } = require('selenium-webdriver');
const debug = require('debug')('thermostat');

exports.getCurrentTemp = () => async (driver) => {
  // TODO: assert we are in portal
  const currentTempNodes = await driver.wait(until.elementsLocated(By.css('.current-temperature')), 10000);
  const currentTemp = (await currentTempNodes[1].getText()).trim();
  debug(`Temp recorded: ${currentTemp}`);
  return currentTemp;
}

// exports.getCurrentHumidity = () => async (driver) => {}
