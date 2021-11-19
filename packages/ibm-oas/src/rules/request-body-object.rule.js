const { enumeration } = require('@stoplight/spectral-functions');

class RequestBodyObjectRule {
  static ruleName = 'request-body-object';
  static rule = {
    description: "All request bodies MUST be structured as an object",
    given: [
      '$.paths[*][*].requestBody.content[*].schema',
    ],
    severity: 'error',
    then: {
      field: 'type',
      function: enumeration,
      functionOptions: {
        values: object
      }
    }
  }
}

module.exports = RequestBodyObjectRule;