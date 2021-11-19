const { oas3 } = require('@stoplight/spectral-formats');

class StringBoundaryRule{
  static ruleName = 'string-boundary';
  static rule = {
    description: 'string schemas should have explicit boundaries defined',
    message: "{{error}}",
    severity: 'warn',
    formats: [oas3],
    resolved: true,
    given: [
      '$.paths[*][*][parameters][*].schema',
      '$.paths[*][*][parameters][*].content[*].schema',
      '$.paths[*][*].requestBody.content[*].schema',
      ],
  then: {
    function: string_boundary
  }
  };
}

module.exports = StringBoundaryRule