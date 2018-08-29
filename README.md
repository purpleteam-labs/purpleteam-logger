# purpleteam-logger

A logger that wraps [`winston`](https://github.com/winstonjs/winston) for purpleteam components, provides a custom [`signale`](https://github.com/klauscfhq/signale) transport, and is open to be extended with additional transports.

[![pipeline status](https://gitlab.com/purpleteam-labs/purpleteam-logger/badges/master/pipeline.svg)](https://gitlab.com/purpleteam-labs/purpleteam/commits/master) &nbsp; [![known vulnerabilities](https://snyk.io/test/github/purpleteam-labs/purpleteam-logger/badge.svg?targetFile=package.json)](https://snyk.io/test/github/purpleteam-labs/purpleteam-logger?targetFile=package.json) &nbsp; [![license](https://img.shields.io/badge/license-MIT-green.svg)](https://gitlab.com/purpleteam-labs/purpleteam-logger/blob/master/LICENSE)

## Install

```
npm install purpleteam-logger
```
## Usage

### Create a reusable logger

Where ever you need a logger:

```
const log = require('purpleteam-logger').init({level: 'debug'});
```
&nbsp;

This will return an existing logger (with a default [`Console` transport](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport)) if one was already created.
Otherwise a winston logger will be created.
As part of creating a logger, the passed `options` object will be validated that the `level` is one of the [`syslog` levels](https://github.com/winstonjs/winston#logging-levels).

a [combined format](https://github.com/winstonjs/winston#combining-formats) (`format.combine`) will be created. in which we:

* [colorize](https://github.com/winstonjs/winston#colorizing-standard-logging-levels) the output
* Create a [custom format](https://github.com/winstonjs/winston#creating-custom-formats) (called `tagger`) by passing the bespoke (`tagger`) `transform` which consumes any tags from the log event and formats them into the printed message, along with the event message
* If `NODE_ENV` is `production` 
  * Include a `winston.format.timestamp`
  * Bespoke format the messages with a function (`prodFormatter`) that utilises [`winston.format.printf`]() to format the printed message as `timestamp` `level` `message` (`message` includes any tags from the `tagger`)
* If `NODE_ENV` is `development`
  * `format.simple` instead of including a timestamp

and finally a `winston.transport.console` transport is added to the `transports` array property of the options object used to create the logger. This could be made more extensible.

### Use the logger

```
log.info('Server registered.', {tags: ['startup']});
log.info('Server started.', {tags: ['startup']});
...
log.info('running testJob', {tags: ['app']});
...
log.notice(`Constructing the cucumber world for session with id "${id}".\n`, {tags: ['world']});
...
log.notice(`Located element using id="${attackField.name}", and sent keys.`, {tags: ['browser']});
...
```

In `development`:

![development log output](/uploads/4630d27f2ee00b2e54f9553e4c1fa915/dev.png)

In `production`:

![production log output](/uploads/6aee40ce7207b6dfb50ff7dfd1205613/prod.png)

The available log levels are listed [here](https://github.com/winstonjs/winston#logging-levels);

### Specify transport(s)

By default the [`winston.transports.Console`](https://github.com/winstonjs/winston/blob/master/lib/winston/transports/console.js) will be used.

```
const log = require('purpleteam-logger').init({level: 'debug', transports: ['Console']});
```

You can specify the name of one or more transport constructors.

Using the [`SignaleTransport`](https://gitlab.com/purpleteam-labs/purpleteam-logger/blob/master/src/transports/signale-transport.js) alone for example looks like the following:

```
const log = require('purpleteam-logger').init({level: 'debug', transports: ['SignaleTransport']});
```
### Use the logger

```
log.emerg('This is what an emergency looks like.', { tags: ['emerg-tag'] });
log.alert('This is what an alert looks like.', { tags: ['alert-tag'] });
log.crit('This is what a critical event looks like.', { tags: ['crit-tag'] });
log.error('This is what an error looks like.', { tags: ['error-tag'] });
log.warning('This is what a warning looks like.', { tags: ['warning-tag'] });
log.notice('This is what a notice looks like.', { tags: ['notice-tag'] }); 
log.info('This is what an info event looks like.', { tags: ['info-tag'] });
log.debug('This is what a debug event looks like.', { tags: ['debug-tag'] });
```

In `development`:

![development log output](/uploads/94fd458cf0ff8e5bd53c18cf1fc1f697/dev-SignaleTransport.png)

In `production`:

![production log output](/uploads/bbca2ce9d3a4073ef74d9c7a02c18208/prod-SignaleTransport.png)


&nbsp;



## API

### `init(options)`

Creates and returns a configured logger. If one already exists, it will be returned without creating another.

* `options`: Configuration object for the logger instance
  * `level`: Can be one of the [`syslog` levels](https://github.com/winstonjs/winston#logging-levels): `'emerg'`, `'alert'`, `'crit'`, `'error'`, `'warning'`, `'notice'`, `'info'`, `'debug'`
  * `transports`: An array of strings of any of the names of transport constructors. You can specify multiple transports in the `transports` array. These can be any combination of the `winston` [core transports](https://github.com/winstonjs/winston/blob/master/docs/transports.md#built-in-to-winston), and/or the custom transports (Any transport inside the [`src/transports/` directory](https://gitlab.com/purpleteam-labs/purpleteam-logger/tree/master/src/transports) will be available for selection once added to the [`index.js`](https://github.com/binarymist/purpleteam-logger/blob/master/src/transports/index.js)), [`SignaleTransport`](https://gitlab.com/purpleteam-labs/purpleteam-logger/blob/master/src/transports/signale-transport.js) for example

### `logger()`

Returns the already instantiated logger object, unless one hasn't been instantiated yet by `init`, in which case an `Error` is thrown.

## Custom transport details

Currently `signale` is the only custom transport in the project, feel free to add additional transports.  
The `signale` types can be seen at:

* [docs](https://github.com/klauscfhq/signale#default-loggers)
* [source](https://github.com/klauscfhq/signale/blob/master/types.js)

Which utilise [figures](https://github.com/sindresorhus/figures/blob/master/index.js) for icons.

## Contribution

Please open an [issue](https://gitlab.com/purpleteam-labs/purpleteam/issues) to discus the proposed change before submitting a [pull request](https://gitlab.com/purpleteam-labs/purpleteam/merge_requests).

## License

Copyright [Kim Carter](https://gitlab.com/binarymist) and other contributors, Licensed under [MIT](./LICENSE).


