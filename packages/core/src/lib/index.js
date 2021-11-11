const chalk = require('chalk');
const config = require('../cli-validator/utils/processConfiguration');
const buildSwaggerObject = require('../cli-validator/utils/buildSwaggerObject');
const validator = require('../cli-validator/utils/validator');
const { formatResultsAsObject } = require('../cli-validator/utils/jsonResults');
const spectralValidator = require('../spectral/utils/spectral-validator');
const dedupFunction = require('../cli-validator/utils/noDeduplication');
const { Spectral } = require('@stoplight/spectral-core');
const OpenApiValidator = require('../openapi-validator');

module.exports = async function(
  input,
  defaultMode = false,
  configFileOverride = null
) {
  // process the config file for the validations &
  // create an instance of spectral & load the spectral ruleset, either a user's
  // or the default ruleset
  let configObject;
  let spectralResults;
  let openApiValidator;
  const openApiValidatorBuilder = new OpenApiValidator.Builder();

  try {
    configObject = await config.get(defaultMode, chalk, configFileOverride);
    await spectralValidator.setup(openApiValidatorBuilder, null, configObject);
    openApiValidatorBuilder.setDocumentPath(input);
  } catch (err) {
    return Promise.reject(err);
  }

  const swagger = await buildSwaggerObject(input);

  try {
    openApiValidator = openApiValidatorBuilder.build();
    spectralResults = await openApiValidator.validateDocument();
  } catch (err) {
    return Promise.reject(err);
  }
  const results = validator(swagger, configObject, spectralResults);

  // return a json object containing the errors/warnings
  return formatResultsAsObject(results);
};
