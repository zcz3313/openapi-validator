class ParameterSchemaOrContentRule {
  static ruleName = 'parameter-schema-or-content';
  static rule = {
    description: 'Parameter must provide either a schema or content',
    message: '{{error}}',
    severity: 'error',
    formats: [oas3],
    resolved: true,
    given: [
      '$.paths[*][*].parameters[*]'
    ],
    then: {
      function: schema_or_content_provided
    }
  };
}

module.exports = ParameterSchemaOrContentRule;