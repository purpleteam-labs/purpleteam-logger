const Transport = require('winston-transport');
const { Signale } = require('signale');
const { LEVEL, MESSAGE } = require('triple-beam');
const figures = require('figures');

const objectify = (badge, color, label) => ({ badge, color, label });

const signale = new Signale({
  // Add other option properties as required: https://github.com/klauscfhq/signale#custom-loggers
  types: {
    emerg: objectify(figures('⬤'), 'red', 'emergency'),
    alert: objectify(figures.warning, 'redBright', 'alert'),
    crit: objectify(figures.cross, 'yellowBright', 'critical'),
    error: objectify(figures.circleCross, 'yellowBright', 'error'),    
    warning: objectify(figures.circleQuestionMark, 'yellow', 'warning'),
    notice: objectify(figures.hamburger, 'magentaBright', 'notice'),
    info: objectify(figures.info, 'blueBright', 'info'),
    debug: objectify(figures.play, 'cyanBright', 'debug')
  },
});


debugger
module.exports = class SignaleTransport extends Transport {
  constructor(options) {
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
};

