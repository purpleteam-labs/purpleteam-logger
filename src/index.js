// Copyright (C) 2017-2022 BinaryMist Limited. All rights reserved.

// This file is ancillary to PurpleTeam.

// purpleteam-logger is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// purpleteam-logger is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// MIT License for more details.

import winston from 'winston';
import Joi from 'joi';
import customTransports from './transports/index.js';

const { createLogger, loggers, config, format, transports: winstonTransports } = winston;

const { timestamp, printf } = format;

const loggerSchema = Joi.object({
  level: Joi.string().required().valid('emerg', 'alert', 'crit', 'error', 'warning', 'notice', 'info', 'debug'),
  transports: Joi.array().min(1).required().items(Joi.string())
});

const properties = {};
let defaultLogger;

const validateOptions = (loggerOptions) => {
  const result = loggerSchema.validate(loggerOptions);
  if (result.error) throw new Error(result.error.message);
  return result.value;
};


const get = (requested) => {
  const instanceType = requested || 'default';
  const loggerInstance = instanceType === 'default' ? defaultLogger : loggers.get(instanceType);
  if (instanceType === 'default' && !loggerInstance) throw new Error('You must initialise the default purpleteam-logger before using it. Call init(options) first.');
  if (!loggerInstance) throw new Error('You must call add("yourChosenLoggerName", options) before attempting to obtain the logger.');
  return loggerInstance;
};


// If sensitive values need to be removed or censored, look at adding a function to format https://github.com/winstonjs/winston#filtering-info-objects https://github.com/winstonjs/winston#creating-custom-formats
//    One of the hapi good examples (https://github.com/hapijs/good/blob/master/examples/censoring-with-white-out.md) uses white-out, which looks good and simple (https://github.com/arb/white-out).

const tagger = format((infoParam) => {
  if (infoParam.tags) {
    const info = infoParam;
    // info.message = `[${info[Symbol.for('level')]},${info.tags}] ${info.message}`;
    info.message = `[${info.tags}] ${info.message}`;
    delete info.tags;
    return info;
  }
  return infoParam;
});


const justTheMessageFormatter = format.printf((info) => info.message);


const prodFormatter = printf((info) => `${info.timestamp} ${info.level}: ${info.message}`);


const createPTLogger = (loggerType) => {
  const defaultOnlyOpts = {
    format: process.env.NODE_ENV === 'production' ? (format.combine(
      format.colorize(),
      tagger(),
      timestamp(),
      prodFormatter
    )) : (format.combine(
      format.colorize(),
      tagger(),
      format.simple()
    )),
    level: properties.level
  };
  const otherOpts = { transports: properties.transports, levels: config.syslog.levels };

  if (loggerType === 'default') {
    defaultLogger = createLogger({ ...defaultOnlyOpts, ...otherOpts });
    return defaultLogger;
  }
  loggers.add(loggerType, { ...otherOpts, format: justTheMessageFormatter });
  return loggers.get(loggerType);
};


const add = (catagory, options) => {
  const loggerType = catagory || 'default';
  if (loggerType === 'default' && !options) throw new Error('You must initialise the "default" purpleteam-logger with a valid options object. See the README for details.');
  if (loggerType !== 'default' && !defaultLogger) throw new Error('A default logger must be created before any other logger. Do this by calling init(options)');
  const unvalidatedOptions = options || {};
  if (!options.transports) unvalidatedOptions.transports = ['Console'];
  if (!options.level) unvalidatedOptions.level = defaultLogger.level;
  const { level, transports } = unvalidatedOptions;
  validateOptions({ level, transports });
  const availableTransports = { ...winstonTransports, ...customTransports };
  const transportCreationOpts = { File: { filename: options.filename, level } /* Add transport opts as required */ };
  const selectedTransports = transports.map((selected) => new availableTransports[selected](transportCreationOpts[selected]));
  properties.level = level;
  properties.transports = selectedTransports;
  return createPTLogger(loggerType);
};

const init = (options) => defaultLogger || add('default', options);

export default { init, add, get };
export { init, add, get };
