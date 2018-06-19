# purpleteam-logger

A logger that wraps [`winston`](https://github.com/winstonjs/winston) for purpleteam components.

![license](https://img.shields.io/github/license/mashape/apistatus.svg)

## Install

Add the repository to your `package.json`:  

```
"dependencies": {
  ...
  "purpleteam-logger": "git+ssh://github.com/binarymist/purpleteam-logger.git",
  ...
}
```
Or add a specific version.

Then from within your project directory, run:

```
npm install
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

![development log output](../assets/dev.png?raw=true)

In `production`:

![production log output](../assets/prod.png?raw=true)

The available log levels are listed [here](https://github.com/winstonjs/winston#logging-levels);

### Specify transport(s)

By default the [`winston.transports.Console`](https://github.com/winstonjs/winston/blob/master/lib/winston/transports/console.js) will be used.

```
const log = require('purpleteam-logger').init({level: 'debug', transports: ['Console']});
```
You can specify multiple transports in the `transports` array. These can be any combination of the `winston` [core transports](https://github.com/winstonjs/winston/blob/master/docs/transports.md#built-in-to-winston), or the custom [`SignaleTransport`](https://github.com/binarymist/purpleteam-logger/src/transports/signale-transport.js).

Using the `SignaleTransport` alone for example looks like the following:

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

![development log output](../assets/dev-SignaleTransport.png?raw=true)

In `production`:

![production log output](../assets/prod-SignaleTransport.png?raw=true)


&nbsp;



## API

### `init(options)`

* `options`: Configuration object for the logger instance
  * `level`: Can be one of the [`syslog` levels](https://github.com/winstonjs/winston#logging-levels): `'emerg'`, `'alert'`, `'crit'`, `'error'`, `'warning'`, `'notice'`, `'info'`, `'debug'`

### `logger()`

Returns the already instantiated logger object, unless one hasn't been instantiated yet by `init`, in which case an `Error` is thrown.

## Contribution

Please open an [issue](https://github.com/binarymist/purpleteam-logger/issues) to discus the proposed change before submitting a [pull request](https://github.com/binarymist/purpleteam-logger/pulls).

## License

Copyright [Kim Carter](https://github.com/binarymist) and other contributors, Licensed under [MIT](./LICENSE).


