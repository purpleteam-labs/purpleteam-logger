const { createLogger, config, transports } = require('winston');
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


const createPTLogger = () => {
  debugger;
  loggerInstance = createLogger({
    levels: config.syslog,
    level: properties.level,
    transports: [
      new transports.Console({ level: 'info' })
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
