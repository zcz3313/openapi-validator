const config = require('./processConfiguration');
const chalk = require('chalk');
const OpenApiValidator = require('./openapi-validator');
const ibmOASSpectralRuleset = require('../../simple-rule/src/init');
const buildSwaggerObject = require('./buildSwaggerObject');

/**
 * OpenApi Validator Api
 *
 * @param openApiFile the file which will be validated
 * @param defaultMode default mode - default value is false
 * @param configFileOverride alternative configuration file
 * @returns {Promise<*>}
 */
module.exports = async function(
  openApiFile,
  defaultMode = false,
  configFileOverride = null
) {
  // process the config file for the validations &
  // create an instance of spectral & load the spectral ruleset, either a user's
  // or the default ruleset
  let configObject;
  let spectralResults;
  let openApiValidator;
  // const spectral = new Spectral({
  //   computeFingerprint: dedupFunction
  // });
  
  try {
    configObject = await config.get(defaultMode, chalk, configFileOverride);
    // await spectralValidator.setup(spectral, null, configObject);
    const ruleset = ibmOASSpectralRuleset();
    
    
    openApiValidator = new OpenApiValidator.Builder().setDocumentPath(openApiFile)
                                                     .setRuleset(ruleset).build();
  } catch (err) {
    return Promise.reject(err);
  }
  
  const swagger = await buildSwaggerObject(openApiFile);
  
  try {
    spectralResults = await openApiValidator.validateDocument(openApiFile);
  } catch (err) {
    return Promise.reject(err);
  }
  const results = validator(swagger, configObject, spectralResults);
  
  // return a json object containing the errors/warnings
  return formatResultsAsObject(results);
};