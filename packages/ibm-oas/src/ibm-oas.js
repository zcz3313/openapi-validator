const { oas3 } = require('@stoplight/spectral-formats');
const ExamplesNameContainsSpace = require('./rules/examples-name-contains-space.rule');
const ProhibitSummarySentenceStyleRule = require('./rules/prohibit-summary-sentence-style.rule');
const ContentEntryProvidedRule = require('./rules/content-entry-provided.rule');
const ContentEntryContainsSchema = require('./rules/content-entry-provided.rule');
const IbmContentTypeIsSpecific = require('./rules/ibm-content-type-is-specific.rule');
const IbmErrorContentTypeIsJson = require('./rules/ibm-error-content-type-is-json.rule');
const IbmSdkOperationsRule = require('./rules/ibm-sdk-operations.rule');
const MajorVersionInPathRule = require('./rules/major-version-in-path.rule');
const MissingRequiredPropertyRule = require('./rules/missing-required-property.rule');
const ParameterSchemaOrContentRule = require('./rules/parameter-schema-or-content.rule');
const ResponseErrorResponseSchemaRule = require('./rules/response-error-response-schema.rule');
const ResponseExampleProvidedRule = require('./rules/response-example-provided.rule');
const StringBoundaryRule = require('./rules/string-boundary-rule');
const ServerVariableDefaultValueRule = require('./rules/server-variable-default-value.rule');
const check_major_versions = require('./functions/check_major_version');

module.exports = async function() {
  
  const ruleset = {
    extends: 'spectral:oas',
    formats: [oas3],
    functions: [
      check_major_versions,
    ],
    rules: {
      // Turn off -- duplicates no_success_response_codes
      'operation-2xx-response': 'off',
      // Enable with same severity as Spectral
      'oas2-operation-formData-consume-check': 'true',
      // Enable with same severity as Spectral
      'operation-operationId-unique': 'true',
      // Enable with same severity as Spectral
      'operation-parameters': 'true',
      // Enable with same severity as Spectral
      'operation-tag-defined': 'true',
      // Turn off - duplicates missing_path_parameter
      'path-params': 'off',
      // Turn off - exclude from ibm:oas
      'info-contact': 'off',
      // Turn off - exclude from ibm:oas
      'info-description': 'off',
      // Enable with same severity as Spectral
      'no-eval-in-markdown': 'true',
      // Enable with same severity as Spectral
      'no-script-tags-in-markdown': 'true',
      // Enable with same severity as Spectral
      'openapi-tags': 'true',
      // Enable with same severity as Spectral
      'operation-description': 'true',
      // Turn off - duplicates operation_id_case_convention, operation_id_naming_convention
      'operation-operationId': 'off',
      // Turn off - duplicates operation_id_case_convention
      'operation-operationId-valid-in-url': 'off',
      // Enable with same severity as Spectral
      'operation-tags': 'true',
      // Turn off - duplicates missing_path_parameter
      'path-declarations-must-exist': 'off',
      // Enable with same severity as Spectral
      'path-keys-no-trailing-slash': 'true',
      // Enable with same severity as Spectral
      'path-not-include-query': 'true',
      // Turn off - duplicates $ref_siblings (off by default)
      'no-$ref-siblings': 'off',
      // Enable with same severity as Spectral
      'typed-enum': 'true',
      // Enable with same severity as Spectral
      'oas2-api-host': 'true',
      // Enable with same severity as Spectral
      'oas2-api-schemes': 'true',
      // Enable with same severity as Spectral
      'oas2-host-trailing-slash': 'true',
      // Turn off - dupicates non-configurable validation - security-ibm.js
      'oas2-operation-security-defined': 'off',
      // Turn off
      'oas2-valid-parameter-example': 'off',
      // Enable with warn severity
      'oas2-valid-definition-example': 'warn',
      // Turn off
      'oas2-valid-response-example': 'off',
      // Turn off
      'oas2-valid-response-schema-example': 'off',
      // Enable with same severity as Spectral
      'oas2-anyOf': 'true',
      // Enable with same severity as Spectral
      'oas2-oneOf': 'true',
      // Turn off
      'oas2-schema': 'off',
      // Turn off - duplicates non-configurable validation in base validator
      'oas2-unused-definition': 'off',
      // Enable with same severity as Spectral
      'oas3-api-servers': 'true',
      // Enable with same severity as Spectral
      'oas3-examples-value-or-externalValue': 'true',
      // Turn off - dupicates non-configurable validation - security-ibm.js
      'oas3-operation-security-defined': 'off',
      // Enable with same severity as Spectral
      'oas3-server-trailing-slash': 'true',
      // Turn off
      'oas3-valid-oas-parameter-example': 'off',
      // Turn off
      'oas3-valid-oas-header-example': 'off',
      // Enable with warn severity
      'oas3-valid-oas-content-example': 'warn',
      // Turn off
      'oas3-valid-parameter-schema-example': 'off',
      // Turn off
      'oas3-valid-header-schema-example': 'off',
      // Enable with warn severity
      'oas3-valid-schema-example': 'warn',
      // Enable with same severity as Spectral
      'oas3-schema': 'true',
      // Turn off - duplicates non-configurable validation in base validator
      'oas3-unused-components-schema': 'off'
    }
  };
  
  ruleset.rules[ExamplesNameContainsSpace.ruleName] = ExamplesNameContainsSpace.rule;
  ruleset.rules[ProhibitSummarySentenceStyleRule.ruleName] = ProhibitSummarySentenceStyleRule.rule;
  ruleset.rules[ContentEntryProvidedRule.ruleName] = ContentEntryProvidedRule.rule;
  ruleset.rules[ContentEntryContainsSchema.ruleName] = ContentEntryContainsSchema.rule;
  ruleset.rules[IbmContentTypeIsSpecific.ruleName] = IbmContentTypeIsSpecific.rule;
  ruleset.rules[IbmErrorContentTypeIsJson.ruleName] = IbmErrorContentTypeIsJson.rule;
  ruleset.rules[IbmSdkOperationsRule.ruleName] = IbmSdkOperationsRule.rule;
  ruleset.rules[MajorVersionInPathRule.ruleName] = MajorVersionInPathRule.rule;
  ruleset.rules[MissingRequiredPropertyRule.ruleName] = MissingRequiredPropertyRule.rule;
  ruleset.rules[ParameterSchemaOrContentRule.ruleName] = ParameterSchemaOrContentRule.rule;
  ruleset.rules[ResponseErrorResponseSchemaRule.ruleName] = ResponseErrorResponseSchemaRule.rule;
  ruleset.rules[ResponseExampleProvidedRule.ruleName] = ResponseExampleProvidedRule.rule;
  ruleset.rules[StringBoundaryRule.ruleName] = StringBoundaryRule.rule;
  ruleset.rules[ServerVariableDefaultValueRule.ruleName] = ServerVariableDefaultValueRule.rule;
  
  return ruleset;
};
