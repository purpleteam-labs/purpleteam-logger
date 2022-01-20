// Copyright (C) 2017-2022 BinaryMist Limited. All rights reserved.

// This file is ancillary to PurpleTeam.

// purpleteam-logger is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// purpleteam-logger is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// MIT License for more details.

// Help for creating winston transports:
// https://github.com/winstonjs/winston#transports
// Existing transports docs: https://github.com/winstonjs/winston/blob/master/docs/transports.md
// Existing transports code: https://github.com/winstonjs/winston/tree/master/lib/winston/transports
// Console transport was a good example for this: https://github.com/winstonjs/winston/blob/master/lib/winston/transports/console.js

import Transport from 'winston-transport';
import signalePkg from 'signale';
import { LEVEL } from 'triple-beam';
import figures from 'figures';

const { Signale } = signalePkg;

const objectify = (badge, color, label) => ({ badge, color, label });

const signale = new Signale({
  // Add other option properties as required: https://github.com/klauscfhq/signale#custom-loggers
  types: {
    emerg: objectify(figures.circleFilled, 'red', 'emergency'),
    alert: objectify(figures.warning, 'redBright', 'alert'),
    crit: objectify(figures.cross, 'yellowBright', 'critical'),
    error: objectify(figures.circleCross, 'yellowBright', 'error'),
    warning: objectify(figures.circleQuestionMark, 'yellow', 'warning'),
    notice: objectify(figures.hamburger, 'magentaBright', 'notice'),
    info: objectify(figures.info, 'blueBright', 'info'),
    debug: objectify(figures.play, 'cyanBright', 'debug')
  }
});


class SignaleTransport extends Transport {
  // Constructor left as documentation.
  constructor(options) { // eslint-disable-line no-useless-constructor
    super(options);
    //
    // Consume any custom options here. e.g.:
    // - Connection information for databases
    // - Authentication information for APIs (e.g. loggly, papertrail,
    //   logentries, etc.).
    //
  }

  log(info, callback) {
    signale[info[LEVEL]](info.message);
    setImmediate(() => {
      this.emit('logged', info);
    });
    callback();
  }
}

export default { SignaleTransport };
