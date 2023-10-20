const { By, until } = require('selenium-webdriver');
const debug = require('debug')('system');

const Mode = Object.freeze({
  Cool: 1,
  Hot: 2,
  Auto: 3,
  Off: 4
});

exports.selectMode = (query) => {
  switch (query.toLowerCase()) {
    case 'cool':
      return Mode.Cool;
    case 'heat':
      return Mode.Hot;
    case 'auto':
      return Mode.Auto;
    case 'off':
      return Mode.Off;
    default:
      throw new Error('Invalid mode selection: Must be cool, heat, auto or off');
  }
};

exports.switchMode = (mode) => async (driver) => {
  debug('Waiting until system is in view...');
  const systemTile = await driver.wait(until.elementLocated(By.id('system')), 10000);
  debug('System tile found');
  await systemTile.click();
  await driver.sleep(1000);
  const modeUsed = await driver.wait(until.elementLocated(By.css(`label[for="systemModeRadio_${mode}"]`)), 10000);
  await modeUsed.click();
  debug(`Used mode: ${mode}`);
  await driver.sleep(2000);
  const closeSubmodal = await driver.wait(until.elementLocated(By.css('.close-panel')), 10000);
  await closeSubmodal.click();
  await driver.sleep(2000);
  debug('Closed out system modal');
};
