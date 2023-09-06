# cor-thermostat-controller
Headless thermostat controller for Cor Thermostat (now Ecobee)

## Motive
This was originally a weekend project meant as a workaround since I'm unable to properly register a third-party app through the website using their OAuth 2.0 Auth code flow. It uses a remote 
selenium instance to automate actions that would otherwise be cumbersome to do manually such as turning off the system at a specified time/date using cronjobs.

## Status
Incomplete - aiming to fill out functionality when needed personally, otherwise feel free to fork and contribute. Please keep in mind that this can break at any time due to the underlying method 
used and should not be relied on for anything critical.

## Requirement
The client requires a remote standalone selenium instance using chrome as the browser to connect to, you can easily get up and running with docker by doing the following:

    $ docker run -d -p 4444:4444 --shm-size="2g" selenium/standalone-chrome:4.12.1-20230904

## Client API

### .buildActionPlan(actions, remoteUrl, [browserOpts]) -> any|void
```actions``` takes an array of actionable "steps" functions (which can be found in each module), ```remoteUrl``` is the destination url of the running chrome instance
being used, ```[browserOpts]``` is an optional parameter used to pass chrome specific flags. This can be used as a one-off command to complete a series
of actions with no end result returned or it be can used to retrieve a value as seen below.

## Example: Reading the current temperature from your "Living Room" sensor
```js 
  const buildActionPlan = require('../src/client');
  const { login, selectThermostat } = require('../src/portal');
  const { getCurrentTemp } = require('../src/thermostat');

  const credentials = Object.freeze({
    username: process.env.COR_PORTAL_USERNAME,
    password: process.env.COR_PORTAL_PASSWORD
  });

  (async () => {
    const tempReading = await buildActionPlan([
      login(credentials),
      selectThermostat('Living Room'),
      getCurrentTemp()
    ], 'https://my-chrome-testing-url:4444');
    console.log(tempReading);
  })();
```



