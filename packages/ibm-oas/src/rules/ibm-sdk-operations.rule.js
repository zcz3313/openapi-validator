const { oas3 } = require('@stoplight/spectral-formats');
const { schema } = require('@stoplight/spectral-functions');

class IbmSdkOperationsRule {
  static ruleName = 'ibm-sdk-operations';
  static rule = {
    message: '{{error}}',
    given: '$.',
    severity: 'warn',
    formats: [oas3],
    resolved: true,
    then: {
      function: schema,
      functionOptions: {
        schema: {
          $ref: './schemas/x-sdk-operations.json'
        }
      }
    }
  };
}

module.exports = IbmSdkOperationsRule;