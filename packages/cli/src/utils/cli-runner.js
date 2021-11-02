const OpenApiValidator = require('../../../core/src/openapi-validator');
const {program} = require('commander');
const {filterFiles} = require('./input-files');
const {OpenApiValidatorExecutionResult} = require('./openapi-validator-execution-result');

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

  #_supportedFileTypes = ['json', 'yaml', 'yml'];

  constructor(config) {
    if (config === undefined || config === null) {
      throw 'Config is not defined. Exiting.';
    }
    this.#_command = config.command;
    this.#_filesToBeValidated = config.filesToBeValidated;
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
    // filter provided files and add the not accepted ones to a list for later print out
    const inputFileFilterResult = await filterFiles(this.#_filesToBeValidated, this.#_supportedFileTypes);
    await this.#_openApiValidationExecutionResult.addFileFilterResult(inputFileFilterResult);

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
  
  get command() {
    return this.#_command;
  }
  
  get filesToBeValidated() {
    return this.#_filesToBeValidated;
  }

  static get Builder() {

    class Builder {
      #_program;

      setProgram(program) {
        this.#_program = program;
        return this;
      }

      get program() {
        return this.#_program;
      }

      build() {

        if (this.#_program === undefined) {
          throw 'Program is not defined. Exiting.';
        }
        const cliRunnerConfig = new CliRunnerConfig();

        this.#_setUpRuleSets();

        cliRunnerConfig.command = this.#_extractCommand();
        cliRunnerConfig.filesToBeValidated = this.#_extractListOfFilesToBeValidated();
        cliRunnerConfig.ruleset = this.#_setUpRuleSets();

        return new CliRunner(cliRunnerConfig);
      }

      #_extractCommand() {
        if (this.#_program.args[0] === 'init') {
          return this.#_program.args[0];
        } else if (this.#_program.args[0] === 'migrate') {
          return this.#_program.args[0];
        } else {
          return undefined;
        }
      }

      #_extractListOfFilesToBeValidated() {
        if (this.#_program.args.length === 0) {
          throw 'No file(s) are defined. Exiting.'
        }
        return this.#_program.args;
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
}

module.exports.CliRunner = CliRunner;
module.exports.CliRunnerConfig = CliRunnerConfig;