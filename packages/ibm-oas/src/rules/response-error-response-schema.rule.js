class ResponseErrorResponseSchemaRule {
  static ruleName = 'response-error-response-schema';
  static rule = {
    message: '{{error}}',
    given: [
      '$.paths[*][*].responses[?(@property >= 400 && @property < 600)].content[*].schema'
    ],
    severity: 'warn',
    formats: [oas3],
    resolved: true,
    then: {
      function: error_response_schema
    }
  };
}

module.exports = ResponseErrorResponseSchemaRule;