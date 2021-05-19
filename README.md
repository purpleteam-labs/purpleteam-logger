<div align="center">
  <br/>
  <a href="https://purpleteam-labs.com" title="purpleteam">
    <img width=900px src="https://github.com/purpleteam-labs/purpleteam/blob/main/assets/images/purpleteam-banner.png" alt="purpleteam logo">
  </a>
  <br/>
<br/>
<h2>purpleteam logger</h2><br/>
Logging component of <a href="https://purpleteam-labs.com/" title="purpleteam">purpleteam</a>
<br/><br/>

<a href="https://github.com/purpleteam-labs/purpleteam-logger/blob/main/LICENSE" title="license">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="license"/>
</a>

<a href="https://github.com/purpleteam-labs/purpleteam-logger/commits/main" title="pipeline status">
  <img src="https://github.com/purpleteam-labs/purpleteam-logger/workflows/Node.js%20CI/badge.svg" alt="pipeline status">
</a>

<a href='https://coveralls.io/github/purpleteam-labs/purpleteam-logger?branch=main'>
  <img src='https://coveralls.io/repos/github/purpleteam-labs/purpleteam-logger/badge.svg?branch=main' alt='test coverage'>
</a>

<a href="https://github.com/purpleteam-labs/purpleteam-logger/releases" title="latest release">
  <img src="https://img.shields.io/github/v/release/purpleteam-labs/purpleteam-logger?color=%23794fb8&include_prereleases" alt="GitHub release (latest SemVer including pre-releases)">
</a>

<br/><br/><br/>
</div>


Purpleteam logger wraps [`winston`](https://github.com/winstonjs/winston) for [purpleteam components](https://github.com/purpleteam-labs/), provides a custom [`signale`](https://github.com/klauscfhq/signale) transport, and is open to be extended with additional transports.

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
  * Bespoke format the messages with a function (`prodFormatter`) that utilises `winston.format.printf` to format the printed message as `timestamp` `level` `message` (`message` includes any tags from the `tagger`)
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

![development log output](https://user-images.githubusercontent.com/2862029/104266561-bdeb4d00-54f4-11eb-9f76-bb06cf00e74f.png)

In `production`:

![production log output](https://user-images.githubusercontent.com/2862029/104266602-d22f4a00-54f4-11eb-8bf8-f840c98890c2.png)

The available log levels are listed [here](https://github.com/winstonjs/winston#logging-levels);

### Specify transport(s)

By default the [`winston.transports.Console`](https://github.com/winstonjs/winston/blob/master/lib/winston/transports/console.js) will be used.

```
const log = require('purpleteam-logger').init({level: 'debug', transports: ['Console']});
```

You can specify the name of one or more transport constructors.

Using the [`SignaleTransport`](https://github.com/purpleteam-labs/purpleteam-logger/blob/main/src/transports/signale-transport.js) alone for example looks like the following:

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

![development log output](https://user-images.githubusercontent.com/2862029/104266760-263a2e80-54f5-11eb-81e1-ce84ba93bf3b.png)

In `production`:

![production log output](https://user-images.githubusercontent.com/2862029/104266785-381bd180-54f5-11eb-98ac-ff82c45a46c1.png)

### Add more loggers

If you want to add extra loggers after the default logger has been `init`ialised. See the [Winston docs](https://github.com/winstonjs/winston/tree/5758752f1a3f5b1bf71b750fc32771bdbd1366ce#working-with-multiple-loggers-in-winston) for more details.

```
const log = require('purpleteam-logger').add('nameForYourNewLogger', { transports: ['File'], filename: '/path/to/your/logfile' });
```

&nbsp;



## API

### `init(options)`

Creates and returns a configured logger. If one already exists, it will be returned without creating another.

* `options`: Configuration object for the logger instance
  * `level`: Can be one of the [`syslog` levels](https://github.com/winstonjs/winston#logging-levels): `'emerg'`, `'alert'`, `'crit'`, `'error'`, `'warning'`, `'notice'`, `'info'`, `'debug'`
  * `transports`: An array of strings of any of the names of transport constructors. You can specify multiple transports in the `transports` array. These can be any combination of the `winston` [core transports](https://github.com/winstonjs/winston/blob/master/docs/transports.md#built-in-to-winston), and/or the custom transports (Any transport inside the [`src/transports/` directory](https://github.com/purpleteam-labs/purpleteam-logger/tree/main/src/transports) will be available for selection once added to the [`index.js`](https://github.com/purpleteam-labs/purpleteam-logger/blob/main/src/transports/index.js)), [`SignaleTransport`](https://github.com/purpleteam-labs/purpleteam-logger/blob/main/src/transports/signale-transport.js) for example

### `get(['default'])`

Returns the already instantiated logger object, unless one hasn't been instantiated yet by `init`, in which case an informative `Error` will be thrown.  
If an argument of `'default'` or no argument is passed to `get`, the 'default' logger will be returned if it has been `init`ialised.  
If you supply an argument that is the name of a logger you have created previously, then that logger will be returned to you.

### `add(catagory, [options])`

If no `options` are supplied to `add`, a new `options` object will be created using a transport of [`Console`](https://github.com/winstonjs/winston/blob/5758752f1a3f5b1bf71b750fc32771bdbd1366ce/docs/transports.md#console-transport), and the same `level` that the default logger has.

## Custom transport details

Currently `signale` is the only custom transport in the project, feel free to add additional transports.  
The `signale` types can be seen at:

* [docs](https://github.com/klauscfhq/signale#default-loggers)
* [source](https://github.com/klauscfhq/signale/blob/master/types.js)

Which utilise [figures](https://github.com/sindresorhus/figures/blob/master/index.js) for icons.

## Contribution

Please open an [issue](https://github.com/purpleteam-labs/purpleteam/issues) to discus the proposed change before submitting a [pull request](https://github.com/purpleteam-labs/purpleteam-logger/pulls).

## License

Copyright [Kim Carter](https://binarymist.io) and other contributors, Licensed under [MIT](https://github.com/purpleteam-labs/purpleteam-logger/blob/main/LICENSE).


