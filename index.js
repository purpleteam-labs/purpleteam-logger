const {
  createLogger, config, format, transports
} = require('winston');

const { timestamp, printf } = format;
const Joi = require('joi');

const loggerSchema = {
  level: Joi.string().valid(['emerg', 'alert', 'crit', 'error', 'warning', 'notice', 'info', 'debug'])
};

let properties;
let loggerInstance;

const validateOptions = (loggerOptions) => {
  const result = Joi.validate(loggerOptions, loggerSchema);
  if (result.error) throw new Error(result.error.message);
  return result.value;
};


const logger = () => {
  if (!loggerInstance) throw new Error('You must call init(options) first.');
  return loggerInstance;
};


// If sensitive values need to be removed or censored, look at adding a function to format https://github.com/winstonjs/winston#filtering-info-objects https://github.com/winstonjs/winston#creating-custom-formats
//    One of the hapi good examples (https://github.com/hapijs/good/blob/master/examples/censoring-with-white-out.md) uses white-out, which looks good and simple (https://github.com/arb/white-out).

const tagger = format((infoParam) => {
  if (infoParam.tags) {
    const info = infoParam;
    info.message = `[${info[Symbol.for('level')]},${info.tags}] ${info.message}`;
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
    transports: [
      new transports.Console()
    ]
  });

  return loggerInstance;
};


const init = (options) => {
  if (loggerInstance) return loggerInstance;
  properties = validateOptions(options);
  return createPTLogger();
};


module.exports = {
  init,
  logger
};
