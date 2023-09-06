const { By } = require('selenium-webdriver');
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
  // TODO: assert we are in portal
  const systemTile = await driver.findElement(By.id('system'));
  debug('System tile found');
  await driver.sleep(2000);
  await systemTile.click();
  await driver.sleep(3000);
  const modeUsed = await driver.findElement(By.css(`label[for="systemModeRadio_${mode}"]`));
  await driver.actions().move({ origin: modeUsed }).pause(1000).click().perform();
  debug(`Used mode: ${mode}`);
  await driver.sleep(2000);
  const closeSubmodal = await driver.findElement(By.css('.close-panel'));
  await driver.actions().move({ origin: closeSubmodal }).pause(1000).click().perform();
  debug('Closed out system modal');
};
