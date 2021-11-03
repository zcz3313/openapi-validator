const OpenApiValidator = require('../../../core/src/openapi-validator');
const {program} = require('commander');
const {filterFiles} = require('./input-files');
const {OpenApiValidatorExecutionResult} = require('./openapi-validator-execution-result');
const path = require('path');
const {findUp} = require('find-up');
const defaultConfig = require('./src/.defaultsForValidator');
const {readFile} = require('fs');
const {validateConfigObject} = require('./validate-config-object')

async function runCli(program) {

  try {
    const cliRunner = new CliRunner.Builder()
      .setProgram(program)
      .build();

    await cliRunner.execute();
    await cliRunner.printResult();
    // return value 0 and 1
    return 1;
  } catch (e) {
    console.log('fatal error')
    // return value 0 and 2
    return 2;
  }
};

/**
 * CliRunner is responsible for the following:
 * - extract properties from args and pass them through to OpenApiValidator
 * - provide methods makes possible observe OpenApiValidator internals for testing purposes
 * - provide method for starting validation
 * - provide method for output result, as OpenApiValidator returns a result object
 * the result display is responsibility of another component
 */
class CliRunner {

  #_openApiValidator;
  #_ruleset;
  #_spectralYamlReader;
  #_validateRcFileReader;
  #_openApiValidationExecutionResult = new OpenApiValidatorExecutionResult();
  #_openApiResultDecorator;
  #_validationResult;
  #_command;
  #_filesToBeValidated;
  #_defaultMode = false;
  #_configFileOverride;
  #_defaultConfig;

  #_supportedFileTypes = ['json', 'yaml', 'yml'];

  constructor(config) {
    if (config === undefined || config === null) {
      throw 'Config is not defined. Exiting.';
    }
    this.#_command = config.command;
    this.#_filesToBeValidated = config.filesToBeValidated;
    this.#_defaultMode = config.defaultMode;
    this.#_configFileOverride = config.configFileOverride;
  }

  async execute() {

    // strategy pattern here
    if (this.#_command !== undefined && this.#_command === 'init') {
      this.#_openApiValidationExecutionResult = await this.#executeInit();
    } else if (this.#_command !== undefined && this.#_command === 'migrate') {
      this.#_openApiValidationExecutionResult = await this.#executeMigrate();
    } else if (this.#_filesToBeValidated.length !== 0) {
      this.#_openApiValidationExecutionResult = await this.#executeValidation();
    }

  }

  async #executeValidation() {
    this.#_defaultConfig = await this.#_getDefaultConfig();
    // filter provided files and add the not accepted ones to a list for later print out
    const inputFileFilterResult = await filterFiles(this.#_filesToBeValidated, this.#_supportedFileTypes);
    await this.#_openApiValidationExecutionResult.addFileFilterResult(inputFileFilterResult);
    const config = await this.#_getConfiguration();

    return this.#_openApiValidationExecutionResult;
  }

  async #executeInit() {
    throw 'Not implemented yet';
  }

  async #executeMigrate() {
    throw 'Not implemented yet';
  }

  printResult() {
    // print result
    // colored
    // non-colored
    // json
  }

  async #_getDefaultConfig() {
    return defaultConfig.defaults;
  }

  async #_getConfiguration() {
    let configObject;

    const findUpOptions = {};
    let configFileName;

    // You cannot pass a full path into findUp as a file name, you must split the
    // path or else findUp redudantly prepends the path to the result.
    if (this.#_configFileOverride) {
      configFileName = path.basename(this.#_configFileOverride);
      findUpOptions.cwd = path.dirname(this.#_configFileOverride);
    } else {
      configFileName = '.validaterc';
    }

    // search up the file system for the first instance
    // of '.validaterc' or,
    // if a config file override is passed in, use find-up
    // to verify existence of the file
    const configFile = await findUp(configFileName, findUpOptions);

    // if the user does not have a config file, run in default mode and warn them
    // (findUp returns null if it does not find a file)
    if (configFile === null && !this.#_defaultMode) {
      // console.log(
      //   '\n' +
      //   chalk.yellow('[Warning]') +
      //   ` No ${chalk.underline(
      //     '.validaterc'
      //   )} file found. The validator will run in ` +
      //   chalk.bold.cyan('default mode.')
      // );
      // console.log(`To configure the validator, create a .validaterc file.`);
      await this.#_openApiValidationExecutionResult.addWarning(
        '[Warning] No .validaterc file found. The validator will wun in default mode.'
      );
      this.#_defaultMode = true;
    }

    if (this.#_defaultMode) {
      configObject = this.#_getDefaultConfig();
    } else {
      try {
        const fileAsString = await readFile(configFile, 'utf8');
        configObject = JSON.parse(fileAsString);
      } catch (error) {
        await this.#_openApiValidationExecutionResult.addError({
          errorType: '.validaterc',
          errorMessage: 'There is a problem with the .validaterc file. See below for details.' + error
        });
        return Promise.reject(2);
      }

      // validate the user object
      configObject = validateConfigObject(configObject);
      if (configObject.invalid) {
        await this.#_openApiValidationExecutionResult.addErrors(configObject.errors);
        return Promise.reject(2);
      }
    }
  }

  get command() {
    return this.#_command;
  }

  get filesToBeValidated() {
    return this.#_filesToBeValidated;
  }

  get defaultMode() {
    return this.#_defaultMode;
  }

  get configFileOverride() {
    return this.#_configFileOverride;
  }

  static get Builder() {

    class Builder {
      #_program;
      #_buildErrors = [];

      setProgram(program) {
        this.#_program = program;
        return this;
      }

      get program() {
        return this.#_program;
      }

      build() {
        try {
          if (this.#_program === undefined) {
            this.#_buildErrors.push('Input parameter is undefined');
            return Promise.reject('Input parameter is undefined');
          }
          const cliRunnerConfig = new CliRunnerConfig();

          cliRunnerConfig.command = this.#_extractCommand();
          cliRunnerConfig.filesToBeValidated = this.#_extractListOfFilesToBeValidated();
          cliRunnerConfig.defaultMode = this.#_extractDefaultMode();
          cliRunnerConfig.configFileOverride = this.#_extractConfigFileOverride();
          cliRunnerConfig.config = this.#_getConfig();
          cliRunnerConfig.ruleset = this.#_setUpRuleSets();

          return new CliRunner(cliRunnerConfig);
        } catch (e) {
          console.log(e);
          return Promise.reject(2);
        }
      }

      #_extractCommand() {
        if (this.#_program.args[0] === 'init') {
          return this.#_program.args[0];
        } else if (this.#_program.args[0] === 'migrate') {
          return this.#_program.args[0];
        } else if (this.#_program.args[0] !== 'init' && this.#_program.args[0] !== 'migrate') {
          return undefined;
        } else {
          this.#_buildErrors.push('Neither command nor parameters are not provided.')
          return Promise.reject('Neither command nor parameters are not provided.');
        }
      }

      #_extractListOfFilesToBeValidated() {
        if (this.#_program.args.length === 0) {
          this.#_buildErrors.push('No file(s) are defined. Exiting.');
          return Promise.reject('No file(s) are defined. Exiting.');
        }
        return this.#_program.args;
      }

      #_getConfig() {

      }

      #_extractDefaultMode() {
        if (this.#_program.args.default_mode) {
          return this.#_program.args.default_mode;
        }
      }

      #_extractConfigFileOverride() {
        if (this.#_program.args.config) {
          return this.#_program.args.config;
        }
      }

      #_setUpRuleSets() {

        if (this.#_program.ruleset !== undefined) {
          return this.#_program.ruleset;
        } else {
          // if .spectral.yaml exists and have ruleset defined

          // when doesn't exist or ruleset is not defined -> default
          return 'ibm-oas';
        }
        // check if .spectral.yaml exist and extract the defined ruleset
        // if not then default
        // command line parameter

      }

    }

    return Builder;
  }

}

class CliRunnerConfig {
  command = undefined;
  filesToBeValidated = [];
  ruleset;
  config;
  configFileOverride;
}

module.exports.CliRunner = CliRunner;
module.exports.CliRunnerConfig = CliRunnerConfig;
module.exports.runCli = runCli;