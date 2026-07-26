#!/usr/bin/env node
var process = require('process');
var program = require('commander').program;
var packageDetails = require('../package.json');
var configFile = require('./config-file');
var Linter = require('./linter');

function run(args) {
  program
    .version(packageDetails.version)
    .description(packageDetails.description)
    .usage('[options] <file ...>')
    .argument('[files...]')
    .configureHelp({helpWidth: 9999})
    .option('-c, --config <path>', 'configuration file path')
    .option('-r, --reporter <reporter>', 'error reporter; console - default, inline', 'console')
    .parse(args);

  var config;
  var reporter;
  var linter = new Linter();
  var errors = [];
  var options = program.opts();

  if (program.args.length === 0) {
    program.help();
  }

  config = configFile.load(options.config);
  reporter = configFile.getReporter(options.reporter);

  if (!reporter.writer) {
    console.error('Reporter "' + options.reporter + '" does not exist');
    process.exit(1);
  }

  linter.configure(config);

  program.args.forEach(function (arg) {
    errors = errors.concat(linter.checkPath(arg));
  });

  if (errors.length > 0) {
    reporter.writer(errors);
    process.exit(2);
  } else {
    process.exit(0);
  }
}

module.exports = run;
