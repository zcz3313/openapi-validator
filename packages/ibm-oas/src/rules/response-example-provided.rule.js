class ResponseExampleProvidedRule {
  static ruleName = 'response-example-provided';
  static rule = {
    message: '{{error}}',
    given: [
      '$.paths[*][*].responses[?(@property >= 200 && @property < 300)].content.application/json'
    ],
    severity: 'warn',
    resolved: true,
    then: {
      function: response_example_provided
    }
  };
}

module.exports = ResponseExampleProvidedRule;