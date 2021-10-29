const OpenApiValidator = require('../../../core/src/openapi-validator');
const { program } = require('commander');
const { filterFiles } = require('./input-files');
const { OpenApiValidatorExecutionResult } = require('./openapi-validator-execution-result');

/**
 * CliRunner is responsible for the following:
 * - extract properties from args and pass them through to OpenApiValidator
 * - provide methods makes possible observe OpenApiValidator internals for testing purposes
 * - provide method for starting validation
 * - provide method for output result, as OpenApiValidator returns a result object
 * the result display is responsibility of another component
 */
class CliRunner {

  #_program;
  #_openApiValidator;
  #_spectralYamlReader;
  #_validateRcFileReader;
  #_openApiValidationExecutionResult;
  #_openApiResultDecorator;
  #_validationResult;
  
  #_supportedFileTypes = ['json', 'yaml', 'yml'];
  
  constructor(builder) {
    this.#_program = builder.program;
    this.#_openApiValidationExecutionResult = new OpenApiValidatorExecutionResult();
  }
  
  async execute() {
    if (this.#_program === undefined) throw 'Program is not defined. Exiting.';
    
    let args = this.#_program.args;
    
    // strategy pattern here
    if (args[0] === 'init') {
      await this.#executeInit()
    } else if (args[0] === 'migrate'){
      await this.#executeMigrate();
    } else {
      return this.#_validationResult = await this.#executeValidation();
    }
  }
  
  async #executeValidation() {
    // filter provided files and add the not accepted ones to a list for later print out
    let inputFiles = this.#_program.args;
    const inputFileFilterResult = await filterFiles(inputFiles, this.#_supportedFileTypes);
    await this.#_openApiValidationExecutionResult.addFileFilterResult(inputFileFilterResult);
    
    return this.#_openApiValidationExecutionResult;
  }
  
  async #executeInit() {
    throw 'Not implemented yet';
  }
  
  async #executeMigrate() {
    throw 'Not implemented yet';
  }
  
  printResult() {}
  
  static get Builder() {
    
    class Builder{
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
        
        this.#_setUpRuleSets();
        
        return new CliRunner(this);
      }

      #_setUpRuleSets(){
        
        // check if .spectral.yaml exist
        
      }
      
    }
    
    return Builder;
  }
  
}

module.exports.CliRunner = CliRunner;