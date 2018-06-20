const {
  createLogger, config, format, transports: winstonTransports
} = require('winston');
const customTransports = require('./transports');
const Joi = require('joi');

const { timestamp, printf } = format;

const loggerSchema = {
  level: Joi.string().required().valid(['emerg', 'alert', 'crit', 'error', 'warning', 'notice', 'info', 'debug']),
  transports: Joi.array().min(1).required().items(Joi.string())
};

const properties = {};
let loggerInstance;

const validateOptions = (loggerOptions) => {
  const result = Joi.validate(loggerOptions, loggerSchema);
  if (result.error) throw new Error(result.error.message);
  return result.value;
};


const logger = () => {
  if (!loggerInstance) throw new Error('You must initialise the purpleteam-logger before using it. Call init(options) first.');
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


const prodFormatter = printf(info => `${info.timestamp} ${info.level}: ${info.message}`);


const createPTLogger = () => {
  loggerInstance = createLogger({
    levels: config.syslog.levels,
    level: properties.level,
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
    transports: properties.transports
  });

  return loggerInstance;
};


const init = (options) => {
  const unvalidatedOptions = options;
  if (loggerInstance) return loggerInstance;
  if (!options.transports) unvalidatedOptions.transports = ['Console'];
  const validatedOptions = validateOptions(unvalidatedOptions);
  const availableTransports = { ...winstonTransports, ...customTransports };
  const selectedTransports = validatedOptions.transports.map(selected => new availableTransports[selected]());
  properties.level = validatedOptions.level;
  properties.transports = selectedTransports;
  return createPTLogger();
};


module.exports = {
  init,
  logger
};

