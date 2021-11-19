const { oas2, oas3 } = require('@stoplight/spectral-formats');

class MissingRequiredPropertyRule {
  static ruleName = 'missing-required-property';
  static rule = {
    description: 'A required property is not in the schema',
    message: '{{error}}',
    formats: [oas2, oas3],
    given: [
      '$.paths[*][*][parameters][*].schema',
      '$.paths[*][*][parameters,responses][*].content[*].schema',
      '$.paths[*][*][requestBody].content[*].schema'
    ],
    severity: 'error',
    then: {
      function: required_property
    }
  };
}

module.exports = MissingRequiredPropertyRule;