const { FileFilterResult } = require('./input-files');

class OpenApiValidatorExecutionResult {
  #_acceptedFiles = [];
  #_notAcceptedFiles = [];
  #_errors = {};
  #_warnings = [];
  #_validationResult = [];

  get acceptedFiles() {
    return this.#_acceptedFiles;
  }

  get notAcceptedFiles() {
    return this.#_notAcceptedFiles;
  }

  async addFileFilterResult(fileFilterResult) {
    if (!(fileFilterResult instanceof FileFilterResult)) {
      new Promise.reject(
        `file filter result is not type of ${FileFilterResult}.`
      );
    }
    if (fileFilterResult.length === 0)
      new Promise.reject('file filter result is empty. Exiting.');

    this.#_acceptedFiles = this.#_acceptedFiles.concat(
      fileFilterResult['accepted']
    );
    this.#_notAcceptedFiles = this.#_notAcceptedFiles.concat(
      fileFilterResult['not_accepted']
    );
  }

  async addError(errorType, errorMessage) {
    const error = new ErrorMessage();
    error.errorType = errorType;
    error.errorMessage = errorMessage;
    this.#_errors[error.errorType] = error.errorMessage;
  }

  async addWarning(warningMessage) {
    this.#_warnings.push(warningMessage);
  }

  async addErrors(errors) {
    errors.forEach(e => {
      this.#_errors.push({
        errorType: 'Config object validation',
        errorMessage: e
      });
    });
  }
}

class ErrorMessage {
  errorType;
  errorMessage;
}

module.exports.OpenApiValidatorExecutionResult = OpenApiValidatorExecutionResult;
module.exports.ErrorMessage = ErrorMessage;
