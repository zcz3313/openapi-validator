const { FileFilterResult } = require('./input-files');

class OpenApiValidatorExecutionResult {
  
  #_acceptedFiles = [];
  #_notAcceptedFiles = [];
  #_errors = [];
  #_validationResult = [];
  
  get acceptedFiles() {
    return this.#_acceptedFiles;
  }
  
  get notAcceptedFiles() {
    return this.#_notAcceptedFiles;
  }
  
  async addFileFilterResult(fileFilterResult) {
    if (!fileFilterResult instanceof FileFilterResult) {
      new Promise.reject(`file filter result is not type of ${FileFilterResult}.`);
    }
    if (fileFilterResult.length === 0) new Promise.reject('file filter result is empyt. Exiting.');
    
    this.#_acceptedFiles = this.#_acceptedFiles.concat(fileFilterResult['accepted']);
    this.#_notAcceptedFiles = this.#_notAcceptedFiles.concat(fileFilterResult['not_accepted']);
  }
}

module.exports.OpenApiValidatorExecutionResult = OpenApiValidatorExecutionResult;
  
