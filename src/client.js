const { Builder, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const debug = require('debug')('client');

module.exports = async function buildActionPlan (actions, remoteUrl, browserOpts = '--start-maximized') {
  if (!remoteUrl) {
    throw new Error('Remote URL: must be a valid url');
  }

  if (!Array.isArray(actions) || !actions.length) {
    throw new Error('You must define at least one action');
  }
  
  const sharedDriver = await createChromeDriver(remoteUrl, browserOpts);
  let result = null;

  try {
    debug('Executing action series');
    for (const step of actions) {
      result = await step(sharedDriver);
      // Assure that at least a minimum of three seconds elapse per step
      await sharedDriver.sleep(3000);
    }
  } catch (err) {
    debug(err.message);
  } finally {
    debug('Cleaning up...');
    await sharedDriver.quit();
  }

  return result;
};

async function createChromeDriver (remoteUrl, chromeOptions) {
  const opts = new chrome.Options();
  opts.addArguments(chromeOptions);

  const driver = await new Builder()
    .usingServer(remoteUrl)
    .forBrowser('chrome')
    .setChromeOptions(opts)
    .withCapabilities(Capabilities.chrome())
    .build();
  
  return driver;
}
